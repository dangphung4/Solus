import { useState } from "react"
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
  Lightbulb,
  Lock,
  Sparkles,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/Core/Shared/Navbar"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Badge className="mb-2">Now in Beta</Badge>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Singular clarity for <span className="text-primary">every decision</span>
              </h1>
              <p className="text-muted-foreground max-w-[700px] md:text-xl">
                AI-powered guidance to help you make better choices, reduce decision fatigue, and gain confidence in
                your decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
                    Get Early Access
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">No credit card required. Free plan available.</p>
            </div>
          </div>
        </section>

        {/* App Preview */}
        <section className="py-12 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex justify-center">
              <div className="relative w-full max-w-3xl aspect-video rounded-xl overflow-hidden border shadow-xl">
                <img
                  src="/placeholder.svg?height=720&width=1280"
                  alt="Solus App Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Two powerful modes for any decision</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Whether you need a quick recommendation or deep guidance, Solus adapts to your needs.
              </p>
            </div>

            <Tabs defaultValue="quick" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="quick">Quick Decision Mode</TabsTrigger>
                <TabsTrigger value="deep">Deep Reflection Mode</TabsTrigger>
              </TabsList>
              <TabsContent value="quick" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Decide in seconds, not hours</h3>
                    <p className="text-muted-foreground mb-6">
                      Perfect for everyday choices like what to eat, watch, or how to schedule your day.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <span>30-second decision flow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Compass className="h-5 w-5 text-primary mt-0.5" />
                        <span>Context-aware recommendations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Fingerprint className="h-5 w-5 text-primary mt-0.5" />
                        <span>Captures your gut reactions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                        <span>Learns from your past choices</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted rounded-xl p-4 border">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Quick Decision Mode"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="deep" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Clarity for life's big choices</h3>
                    <p className="text-muted-foreground mb-6">
                      For complex decisions about career, relationships, or major purchases.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Brain className="h-5 w-5 text-primary mt-0.5" />
                        <span>Multi-step guided framework</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <span>Values alignment assessment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                        <span>Cognitive bias identification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="h-5 w-5 text-primary mt-0.5" />
                        <span>Privacy-first for sensitive topics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-muted rounded-xl p-4 border">
                    <img
                      src="/placeholder.svg?height=400&width=400"
                      alt="Deep Reflection Mode"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">How Solus Works</h2>
              <p className="text-muted-foreground max-w-[700px]">
                A simple process designed to give you clarity without the overwhelm.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Ask Anything</h3>
                <p className="text-muted-foreground">Input your decision question in any format, about any topic.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Categorization</h3>
                <p className="text-muted-foreground">
                  Solus identifies the decision type and suggests the right approach.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Guided Process</h3>
                <p className="text-muted-foreground">
                  Follow a tailored framework based on your decision's complexity.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Clear Recommendation</h3>
                <p className="text-muted-foreground">
                  Receive personalized insights with rationale to support your choice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-[700px]">
                Start for free, upgrade when you need more decision power.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
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
                  <Button variant="outline" className="w-full">
                    Sign Up Free
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Premium</CardTitle>
                    <Badge>Popular</Badge>
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
                  <Button className="w-full">Get Premium</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-[700px]">Join thousands who've found clarity through Solus.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4">
                    "I used to spend hours deciding what to watch. Now I just ask Solus and get the perfect
                    recommendation in seconds."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-medium">Jamie D.</p>
                      <p className="text-sm text-muted-foreground">Chronic Overthinker</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4">
                    "The Deep Reflection mode helped me decide whether to take a new job. It surfaced considerations I
                    hadn't even thought about."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">SM</span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah M.</p>
                      <p className="text-sm text-muted-foreground">Career Changer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Sparkles key={star} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-4">
                    "As someone with ADHD, decision paralysis is real. Solus has been a game-changer for helping me move
                    forward with confidence."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
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
        <section className="py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Ready to make better decisions?</h2>
              <p className="text-muted-foreground max-w-[700px] md:text-xl">
                Join the waitlist for early access to Solus and start making decisions with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit">
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

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Solus Logo" className="w-6 h-6" />
            <span className="text-sm font-medium">Solus © 2025</span>
          </div>
          <nav className="flex items-center gap-4 md:gap-6">
            <a href="#" className="text-xs md:text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="text-xs md:text-sm text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#" className="text-xs md:text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}