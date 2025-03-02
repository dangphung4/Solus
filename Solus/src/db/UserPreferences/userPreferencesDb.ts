import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/db/db';
import { UserPreferences, AIPersonalityStyle, DashboardWidgetType } from '@/db/types/UserPreferences';

/**
 * Collection name for user preferences
 */
const COLLECTION_NAME = 'userPreferences';

/**
 * Convert Firebase Timestamp to JavaScript Date and vice versa
 */
const convertDates = (prefs: any, toFirestore = false): any => {
  if (toFirestore) {
    return {
      ...prefs,
      createdAt: prefs.createdAt instanceof Date ? Timestamp.fromDate(prefs.createdAt) : prefs.createdAt,
      updatedAt: Timestamp.fromDate(new Date())
    };
  } else {
    return {
      ...prefs,
      createdAt: prefs.createdAt?.toDate?.() || prefs.createdAt,
      updatedAt: prefs.updatedAt?.toDate?.() || prefs.updatedAt
    };
  }
};

/**
 * Default user preferences settings
 */
const getDefaultPreferences = (userId: string): UserPreferences => ({
  id: userId,
  userId: userId,
  theme: 'system',
  notificationsEnabled: true,
  emailNotifications: true,
  pushNotifications: true,
  defaultDecisionMode: 'auto',
  privacySettings: {
    shareAnonymousData: true,
    allowHistoryStorage: true,
    retentionPeriod: 365 // 1 year in days
  },
  aiPreferences: {
    usageConsent: true,
    personalityStyle: AIPersonalityStyle.BALANCED,
    detailLevel: 'moderate',
    creativityLevel: 5 // middle value on 1-10 scale
  },
  dashboard: {
    favoriteCategories: [],
    pinnedDecisions: [],
    widgets: [
      {
        id: 'recent-decisions-widget',
        type: DashboardWidgetType.RECENT_DECISIONS,
        position: { row: 0, col: 0, width: 2, height: 2 },
        title: 'Recent Decisions'
      },
      {
        id: 'decision-stats-widget',
        type: DashboardWidgetType.DECISION_STATS,
        position: { row: 0, col: 2, width: 1, height: 1 },
        title: 'Decision Stats'
      },
      {
        id: 'quick-decision-widget',
        type: DashboardWidgetType.QUICK_DECISION,
        position: { row: 2, col: 0, width: 3, height: 1 },
        title: 'Quick Decision'
      }
    ]
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

/**
 * Get user preferences
 */
export const getUserPreferences = async (userId: string): Promise<UserPreferences> => {
  try {
    const prefsRef = doc(db, COLLECTION_NAME, userId);
    const prefsSnap = await getDoc(prefsRef);
    
    if (prefsSnap.exists()) {
      const prefsData = prefsSnap.data();
      return convertDates(prefsData) as UserPreferences;
    } else {
      // If no preferences exist, create default ones
      const defaultPrefs = getDefaultPreferences(userId);
      await createUserPreferences(defaultPrefs);
      return defaultPrefs;
    }
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};

/**
 * Create user preferences
 */
export const createUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  try {
    const prefsRef = doc(db, COLLECTION_NAME, preferences.userId);
    
    // Convert dates for Firestore
    const prefsForFirestore = convertDates(preferences, true);
    
    await setDoc(prefsRef, prefsForFirestore);
  } catch (error) {
    console.error('Error creating user preferences:', error);
    throw error;
  }
};

/**
 * Update user preferences
 */
export const updateUserPreferences = async (userId: string, data: Partial<UserPreferences>): Promise<void> => {
  try {
    const prefsRef = doc(db, COLLECTION_NAME, userId);
    
    // Convert dates for Firestore and set updated timestamp
    const updateData = convertDates({
      ...data,
      updatedAt: new Date()
    }, true);
    
    await updateDoc(prefsRef, updateData);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

/**
 * Update theme preference
 */
export const updateThemePreference = async (userId: string, theme: UserPreferences['theme']): Promise<void> => {
  try {
    await updateUserPreferences(userId, { theme });
  } catch (error) {
    console.error('Error updating theme preference:', error);
    throw error;
  }
};

/**
 * Update notification settings
 */
export const updateNotificationSettings = async (
  userId: string,
  notificationsEnabled: boolean,
  emailNotifications: boolean,
  pushNotifications: boolean
): Promise<void> => {
  try {
    await updateUserPreferences(userId, {
      notificationsEnabled,
      emailNotifications,
      pushNotifications
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

/**
 * Update AI preferences
 */
export const updateAIPreferences = async (
  userId: string,
  aiPreferences: UserPreferences['aiPreferences']
): Promise<void> => {
  try {
    await updateUserPreferences(userId, { aiPreferences });
  } catch (error) {
    console.error('Error updating AI preferences:', error);
    throw error;
  }
};

/**
 * Update dashboard widgets
 */
export const updateDashboardWidgets = async (
  userId: string,
  widgets: UserPreferences['dashboard']['widgets']
): Promise<void> => {
  try {
    const prefs = await getUserPreferences(userId);
    const dashboard = { ...prefs.dashboard, widgets };
    
    await updateUserPreferences(userId, { dashboard });
  } catch (error) {
    console.error('Error updating dashboard widgets:', error);
    throw error;
  }
};

/**
 * Update favorite categories
 */
export const updateFavoriteCategories = async (
  userId: string,
  favoriteCategories: string[]
): Promise<void> => {
  try {
    const prefs = await getUserPreferences(userId);
    const dashboard = { ...prefs.dashboard, favoriteCategories };
    
    await updateUserPreferences(userId, { dashboard });
  } catch (error) {
    console.error('Error updating favorite categories:', error);
    throw error;
  }
};

/**
 * Update pinned decisions
 */
export const updatePinnedDecisions = async (
  userId: string,
  pinnedDecisions: string[]
): Promise<void> => {
  try {
    const prefs = await getUserPreferences(userId);
    const dashboard = { ...prefs.dashboard, pinnedDecisions };
    
    await updateUserPreferences(userId, { dashboard });
  } catch (error) {
    console.error('Error updating pinned decisions:', error);
    throw error;
  }
}; 