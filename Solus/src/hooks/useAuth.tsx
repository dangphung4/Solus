import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  User, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile as firebaseUpdateProfile,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult
} from 'firebase/auth';
import { app, googleProvider } from '@/lib/firebase';
import { getUserProfile, updateUserProfile, createUserProfile } from '@/db/User/userDb';
import { User as DbUser } from '@/db/types/User';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  verifyPhoneCode: (verificationCode: string, displayName?: string) => Promise<void>;
  updateUserData: (data: { displayName?: string; photoURL?: string; username?: string; phoneNumber?: string }) => Promise<void>;
  userProfile: DbUser | null;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  logOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
  signInWithGoogle: async () => {},
  signInWithPhone: async () => {},
  verifyPhoneCode: async () => {},
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
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
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

  const signUp = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await firebaseUpdateProfile(userCredential.user, { displayName });
    }
    
    // Create user profile in Firestore
    await createUserProfile({
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: displayName || userCredential.user.displayName || '',
      photoURL: userCredential.user.photoURL || '',
      createdAt: new Date().toISOString()
    });
  };

  const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Check if user profile exists, create one if it doesn't
    const existingProfile = await getUserProfile(userCredential.user.uid);
    
    if (!existingProfile) {
      await createUserProfile({
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userCredential.user.displayName || '',
        photoURL: userCredential.user.photoURL || '',
        createdAt: new Date().toISOString()
      });
    }
  };
  
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };
  
  const signInWithPhone = async (phoneNumber: string) => {
    setupRecaptcha();
    
    try {
      const result = await signInWithPhoneNumber(
        auth, 
        phoneNumber, 
        (window as any).recaptchaVerifier
      );
      
      setConfirmationResult(result);
    } catch (error) {
      console.error("Error in phone auth:", error);
      throw error;
    }
  };
  
  const verifyPhoneCode = async (verificationCode: string, displayName?: string) => {
    if (!confirmationResult) {
      throw new Error('No confirmation result available');
    }
    
    try {
      const userCredential = await confirmationResult.confirm(verificationCode);
      
      if (displayName) {
        await firebaseUpdateProfile(userCredential.user, { displayName });
      }
      
      // Check if user profile exists, create one if it doesn't
      const existingProfile = await getUserProfile(userCredential.user.uid);
      
      if (!existingProfile) {
        await createUserProfile({
          id: userCredential.user.uid,
          phoneNumber: userCredential.user.phoneNumber || '',
          displayName: displayName || userCredential.user.displayName || '',
          photoURL: userCredential.user.photoURL || '',
          createdAt: new Date().toISOString()
        });
      }
      
      setConfirmationResult(null);
    } catch (error) {
      console.error("Error verifying code:", error);
      throw error;
    }
  };

  const updateUserData = async (data: { displayName?: string; photoURL?: string; username?: string; phoneNumber?: string }) => {
    if (!currentUser) throw new Error('No user is signed in');
    
    const { displayName, photoURL, username, phoneNumber } = data;
    
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
      username: username,
      phoneNumber: phoneNumber
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
    signInWithPhone,
    verifyPhoneCode,
    updateUserData,
    userProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <>
          <div id="recaptcha-container"></div>
          {children}
        </>
      )}
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