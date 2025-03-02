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
                  <p className="text-muted-foreground max-w-2xl mx-auto mt-3">Why Solus was created</p>
                </div>
                
                <Card className="overflow-hidden border border-muted/60 transition-all duration-500 hover:shadow-xl group">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gradient-to-br from-muted/80 to-background p-10 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-white/[0.02] opacity-50" />
                      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                      
                      <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl ring-2 ring-background transition-all duration-300 group-hover:scale-105">
                        <AvatarImage src="https://github.com/dangphung4.png" alt="Dang Phung" />
                        <AvatarFallback className="text-2xl font-bold bg-primary/20">DP</AvatarFallback>
                      </Avatar>
                      
                      <div className="text-center relative z-10">
                        <h3 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Dang Phung</h3>
                        <p className="text-muted-foreground font-medium">Founder & Developer</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm" asChild>
                          <a href="https://github.com/dangphung4" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm" asChild>
                          <a href="https://linkedin.com/dang-phung" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm" asChild>
                          <a href="https://dangtphung.com" target="_blank" rel="noopener noreferrer" aria-label="Personal Website">
                            <Globe className="h-5 w-5" />
                          </a>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 shadow-sm" asChild>
                          <a href="mailto:dangphung4@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
                            <Mail className="h-5 w-5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="md:w-2/3 p-10 relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
                      <div className="space-y-5">
                        <p className="text-lg leading-relaxed">
                          I know too many people who can't make decisions. They overthink things and overanalyze. 
                          They want to make the "right" decision, but they can't.
                        </p>
                        <blockquote className="pl-4 border-l-2 border-primary/50 italic text-muted-foreground">
                            Indecision is the thief of opportunity." - Jim Rohn 
                        </blockquote>
                        <p className="leading-relaxed">
                          I wanted to create a tool that would help people make decisions quickly and easily.
                        </p>
                        <p className="leading-relaxed">
                          Solus is my attempt to solve this problem.
                        </p>
                        <div className="pt-6">
                          <Button className="group bg-gradient-to-r from-primary/90 to-primary/70 hover:from-primary hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300" asChild>
                            <a href="mailto:dangphung4@gmail.com" className="flex items-center">
                              Connect with Dang
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
                <div className="bg-gradient-to-r from-background via-background/95 to-background p-1 rounded-xl">
                  <Card className="border border-primary/20 shadow-sm transition-all duration-300 hover:shadow-xl overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    <CardContent className="p-10">
                      <h3 className="text-xl font-semibold mb-6 text-center">Built with cutting-edge technologies</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/10 border border-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/30">
                          <div className="bg-primary/5 p-3 rounded-full mb-4 group-hover:bg-primary/10 transition-all duration-300">
                            <img src={ReactIcon} alt="React" className="h-12 w-12" />
                          </div>
                          <span className="font-medium">React</span>
                          <span className="text-xs text-muted-foreground mt-1">UI Library</span>
                        </div>
                        <div className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/10 border border-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/30">
                          <div className="bg-primary/5 p-3 rounded-full mb-4 group-hover:bg-primary/10 transition-all duration-300">
                            <img src={TypeScriptIcon} alt="TypeScript" className="h-12 w-12" />
                          </div>
                          <span className="font-medium">TypeScript</span>
                          <span className="text-xs text-muted-foreground mt-1">Type Safety</span>
                        </div>
                        <div className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/10 border border-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/30">
                          <div className="bg-primary/5 p-3 rounded-full mb-4 group-hover:bg-primary/10 transition-all duration-300">
                            <img src={TailwindIcon} alt="Tailwind CSS" className="h-12 w-12" />
                          </div>
                          <span className="font-medium">Tailwind CSS</span>
                          <span className="text-xs text-muted-foreground mt-1">Styling</span>
                        </div>
                        <div className="group flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-background to-muted/10 border border-primary/10 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-primary/30">
                          <div className="bg-primary/5 p-3 rounded-full mb-4 group-hover:bg-primary/10 transition-all duration-300">
                            <img src={FirebaseIcon} alt="Firebase" className="h-12 w-12" />
                          </div>
                          <span className="font-medium">Firebase</span>
                          <span className="text-xs text-muted-foreground mt-1">Backend</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
              
              {/* CTA Section */}
              <section className="relative mt-16">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-background to-background -z-10 rounded-xl" />
                <div className="p-8 md:p-10 border border-primary/10 rounded-xl bg-gradient-to-b from-background to-background/50 backdrop-blur-sm shadow-lg text-center">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Ready to make better decisions?</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                    Join Solus and start making confident decisions today.
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