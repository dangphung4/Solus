import { useState, useEffect, createContext, useContext, ReactNode } from "react"
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setError(null)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      if (displayName) {
        await updateProfile(userCredential.user, { displayName })
      }
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      setError(null)
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError(null)
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      setError(null)
      if (user) {
        await updateProfile(user, { displayName, photoURL: photoURL || user.photoURL })
        // Force refresh the user object
        setUser({ ...user, displayName, photoURL: photoURL || user.photoURL })
      }
    } catch (error) {
      setError((error as Error).message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  
  return context
} 