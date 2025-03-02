import { useAuth } from "@/hooks/useAuth"
import { Navbar } from "@/Core/Shared/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Brain, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <section>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome, {user?.displayName || "Decision Maker"}
            </h1>
            <p className="text-muted-foreground">
              What decision are you looking to make today?
            </p>
          </section>

          <section>
            <Tabs defaultValue="quick" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="quick">Quick Decision</TabsTrigger>
                <TabsTrigger value="deep">Deep Reflection</TabsTrigger>
              </TabsList>
              <TabsContent value="quick" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Quick Decision Mode
                    </CardTitle>
                    <CardDescription>
                      Perfect for everyday choices. Get an answer in 30 seconds.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="quick-decision" className="text-sm font-medium">
                          What are you deciding?
                        </label>
                        <textarea
                          id="quick-decision"
                          className="w-full min-h-24 p-3 border rounded-md"
                          placeholder="e.g., What should I eat for dinner tonight? I'm thinking Italian or Thai."
                        />
                      </div>
                      <Button className="w-full">
                        <Clock className="mr-2 h-4 w-4" />
                        Get Quick Decision
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="deep" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Deep Reflection Mode
                    </CardTitle>
                    <CardDescription>
                      For life's important choices. Guided framework for clarity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="deep-decision" className="text-sm font-medium">
                          What important decision are you facing?
                        </label>
                        <textarea
                          id="deep-decision"
                          className="w-full min-h-24 p-3 border rounded-md"
                          placeholder="e.g., Should I accept the new job offer or stay at my current position?"
                        />
                      </div>
                      <Button className="w-full">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Start Deep Reflection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4">Recent Decisions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">What to eat for dinner</CardTitle>
                  <CardDescription>Quick Decision • 2 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Recommended: <span className="font-medium">Thai food</span></p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekend plans</CardTitle>
                  <CardDescription>Quick Decision • 5 days ago</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Recommended: <span className="font-medium">Hiking trip</span></p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 