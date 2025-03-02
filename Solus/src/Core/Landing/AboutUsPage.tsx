import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
  } from "@/components/ui/card"
  import { 
    Github, 
    Linkedin, 
    Globe, 
    ArrowRight, 
    Mail, 
    Code 
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
  
  import ReactIcon from "@/assets/react-icon.svg"
  import TypeScriptIcon from "@/assets/typescript-icon.png"
  import TailwindIcon from "@/assets/tailwind-icon.png"
  import FirebaseIcon from "@/assets/firebase-icon.png"
  
  export default function AboutUsPage() {
    return (
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        {/* Background gradients similar to LandingPage */}
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-primary/20 via-background to-background -z-10 rounded-b-[50%] opacity-70" />
        <div className="absolute bottom-0 right-0 left-0 h-[300px] bg-gradient-to-t from-primary/10 to-transparent -z-10" />
        
        <main className="flex-1 w-full">
          <div className="container px-4 md:px-6 py-12 md:py-16 max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Hero section */}
              <section className="text-center space-y-6">
                <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto mb-4" />
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                  About <span className="text-primary">Solus</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Solus is an AI-powered decision-making assistant that helps you navigate choices 
                  with confidence and clarity.
                </p>
              </section>
  
              {/* Mission statement */}
              <Card className="border border-muted transition-all duration-300 hover:shadow-lg overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <CardHeader>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                  <CardDescription>What drives us</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    We believe that making better decisions leads to better outcomes and ultimately, a better life. 
                    Our mission is to reduce decision fatigue and provide clarity through a thoughtful, 
                    AI-enhanced decision-making process.
                  </p>
                  <p>
                    Solus combines cutting-edge AI with proven decision frameworks to help you understand 
                    your options, weigh factors appropriately, and gain confidence in your choices.
                  </p>
                </CardContent>
              </Card>
  
              {/* Creator section */}
              <section className="space-y-6">
                <div className="text-center mb-8">
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Meet the Creator</h2>
                </div>
                
                <Card className="overflow-hidden border border-muted transition-all duration-300 hover:shadow-lg">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gradient-to-br from-muted to-muted/50 p-8 flex flex-col items-center justify-center space-y-4">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-lg">
                        <AvatarImage src="https://github.com/dangphung4.png" alt="Dang Phung" />
                        <AvatarFallback className="text-xl bg-primary/10">DP</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-semibold text-xl">Dang Phung</h3>
                        <p className="text-muted-foreground">Founder & Developer</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300" asChild>
                          <a href="https://github.com/dangphung4" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300" asChild>
                          <a href="https://linkedin.com/dang-phung" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300" asChild>
                          <a href="https://dangtphung.com" target="_blank" rel="noopener noreferrer" aria-label="Personal Website">
                            <Globe className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 transition-all duration-300" asChild>
                          <a href="mailto:dangphung4@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
                            <Mail className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 p-8">
                      <div className="space-y-4">
                        <p>
                          Passionate about leveraging technology to solve everyday problems, Dang created Solus 
                          to address the universal challenge of decision-making in our increasingly complex world.
                        </p>
                        <p>
                          With a background in software development and AI, Dang combines technical expertise with 
                          a deep understanding of human psychology to create tools that truly enhance our daily lives.
                        </p>
                        <p>
                          Solus represents Dang's vision of technology that doesn't just provide information, but 
                          actually helps us make sense of it and arrive at better decisions.
                        </p>
                        <div className="pt-4">
                          <Button variant="outline" className="group transition-all duration-300 hover:bg-primary/10" asChild>
                            <a href="mailto:dangphung4@gmail.com">
                              Contact Dang
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </section>
  
              {/* Tech stack */}
              <section>
                <div className="text-center mb-8">
                  <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mx-auto mb-4" />
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Technology Stack</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mt-3">
                    Built with modern, reliable technologies
                  </p>
                </div>
                
                <Card className="border border-muted transition-all duration-300 hover:shadow-lg overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 border border-muted transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <img src={ReactIcon} alt="React" className="h-12 w-12 mb-3" />
                        <span className="text-sm font-medium">React</span>
                      </div>
                      <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 border border-muted transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <img src={TypeScriptIcon} alt="TypeScript" className="h-12 w-12 mb-3" />
                        <span className="text-sm font-medium">TypeScript</span>
                      </div>
                      <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 border border-muted transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <img src={TailwindIcon} alt="Tailwind CSS" className="h-12 w-12 mb-3" />
                        <span className="text-sm font-medium">Tailwind CSS</span>
                      </div>
                      <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-br from-muted/80 to-muted/30 border border-muted transition-all duration-300 hover:scale-105 hover:shadow-md">
                        <img src={FirebaseIcon} alt="Firebase" className="h-12 w-12 mb-3" />
                        <span className="text-sm font-medium">Firebase</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
              
              {/* CTA Section */}
              <section className="relative mt-16">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background -z-10 rounded-xl" />
                <div className="p-8 md:p-10 border border-primary/10 rounded-xl bg-gradient-to-b from-background to-background/50 backdrop-blur-sm shadow-lg text-center">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Ready to make better decisions?</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                    Join thousands who've found clarity through Solus and start making confident decisions today.
                  </p>
                  <Button className="transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    )
  } 