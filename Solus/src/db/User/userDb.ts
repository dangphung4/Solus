import { collection, doc, getDoc, limit, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "@/db/db";
import { User } from "@/db/types/User";

/**
 * Get a user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Create a new user profile in Firestore
 */
export const createUserProfile = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, 'users', user.id);
    
    // Add default fields if they don't exist
    const userWithDefaults = {
      ...user,
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      username: user.username || '',
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await setDoc(userRef, userWithDefaults);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Update an existing user profile in Firestore
 */
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Add updated timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(userRef, updateData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Get a user profile by phone number
 */
export const getUserByPhone = async (phoneNumber: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phoneNumber', '==', phoneNumber), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user by phone number:', error);
    return null;
  }
}; 