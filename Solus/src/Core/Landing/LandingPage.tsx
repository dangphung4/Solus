import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Clock,
  Compass,
  Fingerprint,
  Info,
  Lightbulb,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import fakePreview from "@/assets/fake-preview.png"


export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [, setScrolled] = useState(false)
  const navigate = useNavigate()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-background to-background -z-10 rounded-b-[50%] opacity-70" />
      <div className="absolute bottom-0 right-0 left-0 h-[300px] bg-gradient-to-t from-primary/10 to-transparent -z-10" />
      
      <main className="flex-1 w-full mx-auto">
        {/* Hero Section */}
        <section className="py-20 md:py-28 w-full">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-6">
              <Badge 
                className="mb-2 transition-all duration-300 hover:bg-primary/20 cursor-default animate-fade-in"
                variant="outline"
              >
                Under production
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                Singular clarity for <span className="text-foreground">every decision</span>
              </h1>
              <p className="text-muted-foreground max-w-[700px] md:text-xl animate-fade-in">
                AI-powered guidance to help you make better choices, reduce decision fatigue, and gain confidence in
                your decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full justify-center">
                <div className="flex w-full max-w-md items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                  <Button 
                    type="submit" 
                    className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    Get Early Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">No credit card required. Free plan available.</p>
              <div className="flex items-center text-center space-y-4 mt-4">
                <Button 
                  variant="outline" 
                  className="rounded-full transition-all hover:bg-primary/10 hover:scale-105 duration-300" 
                  onClick={() => navigate('/about-us')}
                >
                  <Info className="mr-2 h-4 w-4" />
                  About Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* App Preview */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background -z-10" />
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex justify-center">
              <div className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden border shadow-2xl transition-all duration-500 hover:shadow-primary/20">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 opacity-70" />
                <img
                  src={fakePreview}
                  alt="Solus App Preview"
                  className="object-cover w-full h-full transition-all duration-700 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">
                Two powerful modes for any decision
              </h2>
              <p className="text-muted-foreground max-w-[700px]">
                Whether you need a quick recommendation or deep guidance, Solus adapts to your needs.
              </p>
            </div>

            <Tabs defaultValue="quick" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
                <TabsTrigger 
                  value="quick" 
                  className="text-sm md:text-base py-3 px-4 transition-all duration-300 rounded-lg min-h-12 flex items-center justify-center
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary
                    data-[state=active]:text-white data-[state=inactive]:text-foreground/80
                    border border-transparent data-[state=inactive]:border-transparent
                    shadow-none data-[state=inactive]:bg-transparent"
                >
                  Quick Decision Mode
                </TabsTrigger>
                <TabsTrigger 
                  value="deep" 
                  className="text-sm md:text-base py-3 px-4 transition-all duration-300 rounded-lg min-h-12 flex items-center justify-center
                    data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/80 data-[state=active]:to-primary
                    data-[state=active]:text-white data-[state=inactive]:text-foreground/80
                    border border-transparent data-[state=inactive]:border-transparent
                    shadow-none data-[state=inactive]:bg-transparent"
                >
                  Deep Reflection Mode
                </TabsTrigger>
              </TabsList>
              <TabsContent value="quick" className="space-y-4 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-4">Decide in seconds, not hours</h3>
                    <p className="text-muted-foreground mb-6">
                      Perfect for everyday choices like what to eat, watch, or how to schedule your day.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <span>30-second decision flow</span>
                      </li>
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Compass className="h-4 w-4 text-primary" />
                        </div>
                        <span>Context-aware recommendations</span>
                      </li>
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Fingerprint className="h-4 w-4 text-primary" />
                        </div>
                        <span>Captures your gut reactions</span>
                      </li>
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span>Learns from your past choices</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-background to-muted rounded-xl p-6 border shadow-lg">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Quick Decision Mode"
                      className="w-full rounded-lg transition-all duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="deep" className="space-y-4 animate-fade-in-up">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-4">Clarity for life's big choices</h3>
                    <p className="text-muted-foreground mb-6">
                      For complex decisions about career, relationships, or major purchases.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <span>Multi-step guided framework</span>
                      </li>
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span>Values alignment assessment</span>
                      </li>
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Lightbulb className="h-4 w-4 text-primary" />
                        </div>
                        <span>Cognitive bias identification</span>
                      </li>
                      <li className="flex items-start gap-3 transition-all duration-300 hover:translate-x-1">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <Lock className="h-4 w-4 text-primary" />
                        </div>
                        <span>Privacy-first for sensitive topics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-background to-muted rounded-xl p-6 border shadow-lg">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Deep Reflection Mode"
                      className="w-full rounded-lg transition-all duration-500 hover:scale-105"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background -z-10" />
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">How Solus Works</h2>
              <p className="text-muted-foreground max-w-[700px]">
                A simple process designed to give you clarity without the overwhelm.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">Ask Anything</h3>
                <p className="text-muted-foreground">Input your decision question in any format, about any topic.</p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">Smart Categorization</h3>
                <p className="text-muted-foreground">
                  Solus identifies the decision type and suggests the right approach.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">Guided Process</h3>
                <p className="text-muted-foreground">
                  Follow a tailored framework based on your decision's complexity.
                </p>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <span className="text-primary font-bold text-lg">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">Clear Recommendation</h3>
                <p className="text-muted-foreground">
                  Receive personalized insights with rationale to support your choice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 relative">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Start for free, upgrade when you need more decision power.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border border-muted transition-all duration-300 hover:shadow-lg hover:border-primary/20 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription>For occasional decision-makers</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>5 quick decisions per day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>2 deep reflections per month</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Basic decision history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Standard AI insights</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full transition-all duration-300 hover:bg-primary/10 hover:text-primary">
                    Sign Up Free
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary relative transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Premium</CardTitle>
                    <Badge className="bg-gradient-to-r from-primary to-primary/80">Popular</Badge>
                  </div>
                  <CardDescription>For the chronically indecisive</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Unlimited quick decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Unlimited deep reflections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Advanced decision journal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Enhanced AI insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Pattern recognition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:scale-[1.02]">
                    Get Premium
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background -z-10" />
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-[700px]">Join the waitlist to be one of the first beta testers.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="transition-all duration-300 hover:shadow-lg group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="h-5 w-5 fill-primary text-primary group-hover:scale-110 transition-all duration-300" />
                    ))}
                  </div>
                  <p className="mb-4">
                    "I used to spend hours deciding what to watch. Now I just ask Solus and get the perfect
                    recommendation in seconds."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium">Jamie D.</p>
                      <p className="text-sm text-muted-foreground">Chronic Overthinker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="h-5 w-5 fill-primary text-primary group-hover:scale-110 transition-all duration-300" />
                    ))}
                  </div>
                  <p className="mb-4">
                    "The Deep Reflection mode helped me decide whether to take a new job. It surfaced considerations I
                    hadn't even thought about."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">SM</span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah M.</p>
                      <p className="text-sm text-muted-foreground">Career Changer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all duration-300 hover:shadow-lg group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="h-5 w-5 fill-primary text-primary group-hover:scale-110 transition-all duration-300" />
                    ))}
                  </div>
                  <p className="mb-4">
                    "As someone with ADHD, decision paralysis is real. Solus has been a game-changer for helping me move
                    forward with confidence."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">TK</span>
                    </div>
                    <div>
                      <p className="font-medium">Tyler K.</p>
                      <p className="text-sm text-muted-foreground">Productivity Enthusiast</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-background to-background -z-10" />
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="flex flex-col items-center text-center space-y-6 bg-gradient-to-b from-background to-background/50 backdrop-blur-sm rounded-2xl p-8 border border-primary/10 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter">Ready to make better decisions?</h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl">
                Join the waitlist for early access to Solus and start making decisions with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-md mx-auto">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary/50 bg-background/80 backdrop-blur-sm"
                  />
                  <Button 
                    type="submit" 
                    className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  >
                    Get Early Access
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Be among the first to experience Solus. Limited spots available.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}