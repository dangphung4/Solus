
/**
 * User interface for the database
 * This is generated from firestore auth
 */
export interface User {
    id: string;
    displayName: string;
    email: string;
    photoURL: string;
    createdAt: Date;
    lastLoginAt: Date;
    userId: string;
    username?: string; // Optional username for profile URL
  }
