import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  AlertCircle, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  ArrowRight, 
  CheckCircle 
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email")
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [signUpError, setSignUpError] = useState<string | null>(null)
  const { signUp, signInWithGoogle, signInWithPhone, verifyPhoneCode } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpError(null)

    if (authMethod === "email") {
      if (password !== confirmPassword) {
        setSignUpError("Passwords do not match")
        return
      }

      setIsLoading(true)

      try {
        await signUp(email, password, name)
        navigate("/dashboard")
      } catch (error) {
        if ((error as Error).message.includes("email-already-in-use")) {
          setSignUpError("Email already in use. Try logging in instead.")
        } else {
          setSignUpError("Failed to create account. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      // Phone verification submit
      if (!codeSent) {
        handleSendVerificationCode()
      } else {
        handleVerifyCode()
      }
    }
  }

  const handleSendVerificationCode = async () => {
    setSignUpError(null)
    setIsLoading(true)

    try {
      await signInWithPhone(phoneNumber)
      setCodeSent(true)
    } catch (error) {
      setSignUpError("Failed to send verification code. Please check your phone number and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setSignUpError(null)
    setIsLoading(true)

    try {
      await verifyPhoneCode(verificationCode, name)
      navigate("/dashboard")
    } catch (error) {
      setSignUpError("Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setSignUpError(null)
    setIsLoading(true)

    try {
      await signInWithGoogle()
      navigate("/dashboard")
    } catch (error) {
      setSignUpError("Failed to sign up with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-background to-background -z-10 rounded-b-[50%] opacity-70" />
      <div className="absolute bottom-0 right-0 left-0 h-[300px] bg-gradient-to-t from-primary/10 to-transparent -z-10" />
      
      <div className="container flex flex-col items-center justify-center flex-1 w-full px-4 py-12 mx-auto">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block">
              <img src="/favicon.svg" alt="Solus Logo" className="h-14 w-14 mx-auto transition-transform duration-300 hover:scale-110" />
            </Link>
            <h1 className="text-2xl font-bold mt-4 text-foreground">Join Solus</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create your account and start making better decisions
            </p>
          </div>
          
          <Card className="border-muted/50 shadow-lg bg-background/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>
                Choose your preferred sign up method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {signUpError && (
                <Alert variant="destructive" className="animate-fade-in">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{signUpError}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="email" className="w-full"
                onValueChange={(value) => setAuthMethod(value as "email" | "phone")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger 
                    value="email" 
                    className="text-sm py-2 px-4 transition-all duration-300 rounded-lg min-h-10
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary
                      data-[state=active]:text-white data-[state=inactive]:text-foreground/80
                      data-[state=inactive]:bg-transparent"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger 
                    value="phone" 
                    className="text-sm py-2 px-4 transition-all duration-300 rounded-lg min-h-10
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary
                      data-[state=active]:text-white data-[state=inactive]:text-foreground/80
                      data-[state=inactive]:bg-transparent"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Phone
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="email">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative">
                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Create account"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="phone">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10"
                          required
                          disabled={codeSent}
                        />
                      </div>
                    </div>
                    
                    {codeSent && (
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode" className="text-sm font-medium">Verification Code</Label>
                        <Input
                          id="verificationCode"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          A verification code has been sent to your phone
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      type="submit"
                      className="w-full transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                      disabled={isLoading}
                    >
                      {isLoading 
                        ? (codeSent ? "Verifying..." : "Sending code...") 
                        : (codeSent ? "Verify & Create Account" : "Send Verification Code")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="flex items-center gap-2 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full transition-all duration-300 hover:bg-primary/10"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <img src="/google.svg" alt="Google" className="mr-2 h-4 w-4" />
                Sign up with Google
              </Button>
            </CardContent>
            <CardFooter className="flex justify-center pt-2 pb-4">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
} 