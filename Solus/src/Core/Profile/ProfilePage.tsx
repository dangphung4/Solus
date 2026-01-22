import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, LogOut, Upload, X, Zap, Brain, MessageSquare, TrendingUp, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { app } from "@/lib/firebase"
import { getUserDecisions } from "@/db/Decision/decisionDb"
import { getUserReflections } from "@/db/Reflection/reflectionDb"
import { Decision } from "@/db/types/Decision"
import { Reflection } from "@/db/types/Reflection"

export default function ProfilePage() {
  const { currentUser, userProfile, updateUserData, logOut } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "")
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "")
  const [username, setUsername] = useState(userProfile?.username || "")
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storage = getStorage(app)

  // Stats state
  const [statsLoading, setStatsLoading] = useState(true)
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [reflections, setReflections] = useState<Reflection[]>([])

  // Load user stats
  useEffect(() => {
    const loadStats = async () => {
      if (!currentUser) return;

      setStatsLoading(true);
      try {
        const [userDecisions, userReflections] = await Promise.all([
          getUserDecisions(currentUser.uid),
          getUserReflections(currentUser.uid),
        ]);

        setDecisions(userDecisions);
        setReflections(userReflections);
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsLoading(true)

    try {
      await updateUserData({ displayName, photoURL, username, phoneNumber })
      setSuccess(true)
      toast.success("Profile updated successfully")
    } catch (error) {
      setError("Failed to update profile. Please try again.")
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
      toast.success("Signed out successfully")
      navigate('/')
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading("Uploading image...")

    try {
      if (!currentUser?.uid) {
        throw new Error("User not authenticated")
      }

      const storageRef = ref(storage, `users/${currentUser.uid}/profile/${Date.now()}-${file.name}`)
      
      await uploadBytes(storageRef, file)
      
      const downloadURL = await getDownloadURL(storageRef)
      
      setPhotoURL(downloadURL)
      toast.success("Image uploaded successfully", { id: toastId })
      
      await updateUserData({ photoURL: downloadURL })
    } catch (error: any) {
      console.error("Error uploading image:", error)
      
      if (error.code === 'storage/unauthorized') {
        toast.error("Storage permission denied. Please check Firebase Storage rules.", { id: toastId })
      } else {
        toast.error(`Failed to upload image: ${error.message || "Unknown error"}`, { id: toastId })
      }
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearPhotoURL = () => {
    setPhotoURL("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage 
                      src={photoURL || undefined} 
                      alt={currentUser?.displayName || "User"} 
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl">
                      {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute inset-0 bg-black/30 rounded-full
                      flex items-center justify-center gap-2 transition-opacity cursor-pointer
                      ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                    onClick={!isUploading ? triggerFileInput : undefined}
                  >
                    {isUploading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </div>
                <div>
                  <CardTitle>{currentUser?.displayName || "User"}</CardTitle>
                  <CardDescription>{currentUser?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 border-green-500 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>Profile updated successfully!</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photoURL">Profile Picture URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="photoURL"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/your-image.gif"
                    />
                    {photoURL && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={clearPhotoURL}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a URL or click on your profile picture to upload.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be used for your profile URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 555-5555"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={currentUser?.email || ""}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
              <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          {/* Stats Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Your Stats
              </CardTitle>
              <CardDescription>Your decision-making journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-primary/5">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 rounded-full bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{decisions.length}</p>
                    <p className="text-xs text-muted-foreground">Total Decisions</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-amber-500/5">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 rounded-full bg-amber-500/10">
                        <Zap className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{decisions.filter(d => d.type === 'quick').length}</p>
                    <p className="text-xs text-muted-foreground">Quick Decisions</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-purple-500/5">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 rounded-full bg-purple-500/10">
                        <Brain className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{decisions.filter(d => d.type === 'deep').length}</p>
                    <p className="text-xs text-muted-foreground">Deep Reflections</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-green-500/5">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 rounded-full bg-green-500/10">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{reflections.length}</p>
                    <p className="text-xs text-muted-foreground">Reflections</p>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/history')}
                >
                  View Decision History
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">Receive emails about your decisions</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data & Privacy</h3>
                  <p className="text-sm text-muted-foreground">Manage your data and privacy settings</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 