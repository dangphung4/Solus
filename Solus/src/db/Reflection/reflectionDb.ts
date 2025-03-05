import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/db/db";
import {
  Reflection,
  ReflectionOutcome,
  ReflectionStats,
  LearningType,
} from "@/db/types/Reflection";
import { DecisionCategory } from "@/db/types/BaseDecision";
import { v4 as uuidv4 } from "uuid";

/**
 * Collection names
 */
const REFLECTIONS_COLLECTION = "reflections";
const REFLECTION_STATS_COLLECTION = "reflectionStats";

/**
 * Convert between Firestore data and Reflection objects
 */
const fromFirestore = (data: DocumentData): Reflection => {
  return {
    ...data,
    createdAt: data.createdAt?.toDate() || data.createdAt,
    updatedAt: data.updatedAt?.toDate() || data.updatedAt,
  } as Reflection;
};

const toFirestore = (reflection: Reflection): DocumentData => {
  const now = new Date();
  return {
    ...reflection,
    createdAt:
      reflection.createdAt instanceof Date
        ? Timestamp.fromDate(reflection.createdAt)
        : Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };
};

/**
 * Create a new reflection
 */
export const createReflection = async (
  reflection: Omit<Reflection, "id" | "createdAt" | "updatedAt">
): Promise<Reflection> => {
  try {
    const now = new Date();
    const newReflection: Reflection = {
      ...reflection,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(
      doc(db, REFLECTIONS_COLLECTION, newReflection.id),
      toFirestore(newReflection)
    );

    // Update reflection stats after adding new reflection
    await updateReflectionStats(reflection.userId);

    return newReflection;
  } catch (error) {
    console.error("Error creating reflection:", error);
    throw error;
  }
};

/**
 * Get a reflection by ID
 */
export const getReflection = async (id: string): Promise<Reflection | null> => {
  try {
    const docRef = doc(db, REFLECTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return fromFirestore(docSnap.data());
    }

    return null;
  } catch (error) {
    console.error("Error getting reflection:", error);
    throw error;
  }
};

/**
 * Update an existing reflection
 */
export const updateReflection = async (
  id: string,
  updates: Partial<
    Omit<Reflection, "id" | "userId" | "decisionId" | "createdAt">
  >
): Promise<void> => {
  try {
    const reflectionRef = doc(db, REFLECTIONS_COLLECTION, id);

    // Add updated timestamp
    await updateDoc(reflectionRef, {
      ...updates,
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Get the reflection to find the userId for stats update
    const reflectionSnap = await getDoc(reflectionRef);
    if (reflectionSnap.exists()) {
      const reflection = fromFirestore(reflectionSnap.data());
      await updateReflectionStats(reflection.userId);
    }
  } catch (error) {
    console.error("Error updating reflection:", error);
    throw error;
  }
};

/**
 * Delete a reflection
 */
export const deleteReflection = async (id: string): Promise<void> => {
  try {
    // Get the reflection first to find the userId for stats update
    const reflectionRef = doc(db, REFLECTIONS_COLLECTION, id);
    const reflectionSnap = await getDoc(reflectionRef);

    if (reflectionSnap.exists()) {
      const reflection = fromFirestore(reflectionSnap.data());

      // Delete the reflection
      await deleteDoc(reflectionRef);

      // Update stats after deletion
      await updateReflectionStats(reflection.userId);
    }
  } catch (error) {
    console.error("Error deleting reflection:", error);
    throw error;
  }
};

/**
 * Get all reflections for a user
 */
export const getUserReflections = async (
  userId: string
): Promise<Reflection[]> => {
  try {
    const q = query(
      collection(db, REFLECTIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reflections: Reflection[] = [];

    querySnapshot.forEach((doc) => {
      reflections.push(fromFirestore(doc.data()));
    });

    return reflections;
  } catch (error) {
    console.error("Error getting user reflections:", error);
    throw error;
  }
};

/**
 * Get reflections for a specific decision
 */
export const getDecisionReflections = async (
  decisionId: string
): Promise<Reflection[]> => {
  try {
    const q = query(
      collection(db, REFLECTIONS_COLLECTION),
      where("decisionId", "==", decisionId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reflections: Reflection[] = [];

    querySnapshot.forEach((doc) => {
      reflections.push(fromFirestore(doc.data()));
    });

    return reflections;
  } catch (error) {
    console.error("Error getting decision reflections:", error);
    throw error;
  }
};

/**
 * Get recent reflections for a user
 */
export const getRecentReflections = async (
  userId: string,
  limitCount: number = 10
): Promise<Reflection[]> => {
  try {
    const q = query(
      collection(db, REFLECTIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const reflections: Reflection[] = [];

    querySnapshot.forEach((doc) => {
      reflections.push(fromFirestore(doc.data()));
    });

    return reflections;
  } catch (error) {
    console.error("Error getting recent reflections:", error);
    throw error;
  }
};

/**
 * Get reflections by outcome
 */
export const getReflectionsByOutcome = async (
  userId: string,
  outcome: ReflectionOutcome
): Promise<Reflection[]> => {
  try {
    const q = query(
      collection(db, REFLECTIONS_COLLECTION),
      where("userId", "==", userId),
      where("outcome", "==", outcome),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const reflections: Reflection[] = [];

    querySnapshot.forEach((doc) => {
      reflections.push(fromFirestore(doc.data()));
    });

    return reflections;
  } catch (error) {
    console.error("Error getting reflections by outcome:", error);
    throw error;
  }
};

/**
 * Get reflection statistics for a user
 */
export const getReflectionStats = async (
  userId: string
): Promise<ReflectionStats | null> => {
  try {
    const docRef = doc(db, REFLECTION_STATS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || data.lastUpdated,
      } as ReflectionStats;
    }

    return null;
  } catch (error) {
    console.error("Error getting reflection stats:", error);
    throw error;
  }
};

/**
 * Update or create reflection statistics for a user
 * This is called automatically when reflections are added, updated, or deleted
 */
export const updateReflectionStats = async (userId: string): Promise<void> => {
  try {
    // Get all the user's reflections
    const reflections = await getUserReflections(userId);

    if (reflections.length === 0) {
      // If no reflections, create empty stats
      const emptyStats: ReflectionStats = {
        userId,
        satisfactionCounts: {
          [ReflectionOutcome.VERY_SATISFIED]: 0,
          [ReflectionOutcome.SATISFIED]: 0,
          [ReflectionOutcome.NEUTRAL]: 0,
          [ReflectionOutcome.UNSATISFIED]: 0,
          [ReflectionOutcome.VERY_UNSATISFIED]: 0,
        },
        averageSatisfaction: 0,
        wouldRepeatPercentage: 0,
        satisfactionByCategory: {} as Record<DecisionCategory, number>,
        reflectionTrend: "stable",
        learningsByType: {
          [LearningType.INSIGHT]: 0,
          [LearningType.PREFERENCE]: 0,
          [LearningType.PATTERN]: 0,
          [LearningType.IMPROVEMENT]: 0,
        },
        lastUpdated: new Date(),
      };

      await setDoc(doc(db, REFLECTION_STATS_COLLECTION, userId), {
        ...emptyStats,
        lastUpdated: Timestamp.fromDate(emptyStats.lastUpdated),
      });
      return;
    }

    // Initialize counters
    const satisfactionCounts = {
      [ReflectionOutcome.VERY_SATISFIED]: 0,
      [ReflectionOutcome.SATISFIED]: 0,
      [ReflectionOutcome.NEUTRAL]: 0,
      [ReflectionOutcome.UNSATISFIED]: 0,
      [ReflectionOutcome.VERY_UNSATISFIED]: 0,
    };

    const learningsByType = {
      [LearningType.INSIGHT]: 0,
      [LearningType.PREFERENCE]: 0,
      [LearningType.PATTERN]: 0,
      [LearningType.IMPROVEMENT]: 0,
    };

    const satisfactionByCategory: Record<
      string,
      { count: number; total: number }
    > = {};
    let wouldRepeatCount = 0;

    // Calculate statistics
    reflections.forEach((reflection) => {
      // Count by outcome
      satisfactionCounts[reflection.outcome]++;

      // Count would repeat
      if (reflection.wouldRepeat) {
        wouldRepeatCount++;
      }

      // Track by category
      if (!satisfactionByCategory[reflection.decisionCategory]) {
        satisfactionByCategory[reflection.decisionCategory] = {
          count: 0,
          total: 0,
        };
      }

      // Calculate numerical satisfaction value (5 to 1)
      let satisfactionValue = 3; // Default neutral
      switch (reflection.outcome) {
        case ReflectionOutcome.VERY_SATISFIED:
          satisfactionValue = 5;
          break;
        case ReflectionOutcome.SATISFIED:
          satisfactionValue = 4;
          break;
        case ReflectionOutcome.NEUTRAL:
          satisfactionValue = 3;
          break;
        case ReflectionOutcome.UNSATISFIED:
          satisfactionValue = 2;
          break;
        case ReflectionOutcome.VERY_UNSATISFIED:
          satisfactionValue = 1;
          break;
      }

      satisfactionByCategory[reflection.decisionCategory].count++;
      satisfactionByCategory[reflection.decisionCategory].total +=
        satisfactionValue;

      // Count learnings by type
      reflection.learnings?.forEach((learning) => {
        learningsByType[learning.type]++;
      });
    });

    // Calculate averages and percentages
    const totalSatisfactionValue =
      satisfactionCounts[ReflectionOutcome.VERY_SATISFIED] * 5 +
      satisfactionCounts[ReflectionOutcome.SATISFIED] * 4 +
      satisfactionCounts[ReflectionOutcome.NEUTRAL] * 3 +
      satisfactionCounts[ReflectionOutcome.UNSATISFIED] * 2 +
      satisfactionCounts[ReflectionOutcome.VERY_UNSATISFIED] * 1;

    const averageSatisfaction = totalSatisfactionValue / reflections.length;
    const wouldRepeatPercentage = (wouldRepeatCount / reflections.length) * 100;

    // Calculate satisfaction by category
    const satisfactionByCategoryResult: Record<string, number> = {};
    Object.entries(satisfactionByCategory).forEach(([category, data]) => {
      satisfactionByCategoryResult[category] = data.total / data.count;
    });

    // Determine trend (simple implementation - could be more sophisticated)
    let reflectionTrend: "improving" | "stable" | "declining" = "stable";
    if (reflections.length >= 5) {
      const recent = reflections.slice(0, 3);
      const older = reflections.slice(reflections.length - 3);

      const recentAvg =
        recent.reduce((acc, r) => {
          let val = 3;
          switch (r.outcome) {
            case ReflectionOutcome.VERY_SATISFIED:
              val = 5;
              break;
            case ReflectionOutcome.SATISFIED:
              val = 4;
              break;
            case ReflectionOutcome.NEUTRAL:
              val = 3;
              break;
            case ReflectionOutcome.UNSATISFIED:
              val = 2;
              break;
            case ReflectionOutcome.VERY_UNSATISFIED:
              val = 1;
              break;
          }
          return acc + val;
        }, 0) / recent.length;

      const olderAvg =
        older.reduce((acc, r) => {
          let val = 3;
          switch (r.outcome) {
            case ReflectionOutcome.VERY_SATISFIED:
              val = 5;
              break;
            case ReflectionOutcome.SATISFIED:
              val = 4;
              break;
            case ReflectionOutcome.NEUTRAL:
              val = 3;
              break;
            case ReflectionOutcome.UNSATISFIED:
              val = 2;
              break;
            case ReflectionOutcome.VERY_UNSATISFIED:
              val = 1;
              break;
          }
          return acc + val;
        }, 0) / older.length;

      if (recentAvg > olderAvg + 0.5) {
        reflectionTrend = "improving";
      } else if (recentAvg < olderAvg - 0.5) {
        reflectionTrend = "declining";
      }
    }

    // Create stats object
    const stats: ReflectionStats = {
      userId,
      satisfactionCounts,
      averageSatisfaction,
      wouldRepeatPercentage,
      satisfactionByCategory: satisfactionByCategoryResult as Record<
        DecisionCategory,
        number
      >,
      reflectionTrend,
      learningsByType,
      lastUpdated: new Date(),
    };

    // Save to database with proper Timestamp conversion
    await setDoc(doc(db, REFLECTION_STATS_COLLECTION, userId), {
      ...stats,
      lastUpdated: Timestamp.fromDate(stats.lastUpdated),
    });
  } catch (error) {
    console.error("Error updating reflection stats:", error);
    throw error;
  }
};
