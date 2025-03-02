import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { app, googleProvider } from '@/lib/firebase';
import { getUserProfile, updateUserProfile} from '@/db/User/userDb';
import { User as DbUser } from '@/db/types/User';
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserData: (data: { displayName?: string; photoURL?: string; username?: string }) => Promise<void>;
  userProfile: DbUser | null;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  logOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  updateUserData: async () => {},
  userProfile: null
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const updateUserData = async (data: { displayName?: string; photoURL?: string; username?: string }) => {
    if (!currentUser) throw new Error('No user is signed in');
    
    const { displayName, photoURL, username } = data;
    
    // Update Firebase Auth profile
    if (displayName || photoURL) {
      await firebaseUpdateProfile(currentUser, {
        displayName: displayName || currentUser.displayName,
        photoURL: photoURL || currentUser.photoURL
      });
    }
    
    // Update Firestore profile
    await updateUserProfile(currentUser.uid, {
      displayName: displayName || currentUser.displayName || '',
      photoURL: photoURL || currentUser.photoURL || '',
      username: username
    });
    
    // Refresh user profile
    const updatedProfile = await getUserProfile(currentUser.uid);
    if (updatedProfile) {
      setUserProfile(updatedProfile);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user profile from Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    loading,
    logOut,
    signIn,
    signUp,
    signInWithGoogle,
    updateUserData,
    userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 