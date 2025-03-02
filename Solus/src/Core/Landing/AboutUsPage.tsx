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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-12 px-4 md:py-16">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero section */}
          <section className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              About <span className="text-primary">Solus</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Solus is an AI-powered decision-making assistant that helps you navigate choices 
              with confidence and clarity.
            </p>
          </section>

          {/* Mission statement */}
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
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
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center">Meet the Creator</h2>
            
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-muted p-6 flex flex-col items-center justify-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://github.com/dangphung4.png" alt="Dang Phung" />
                    <AvatarFallback className="text-xl">DP</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-semibold text-xl">Dang Phung</h3>
                    <p className="text-muted-foreground">Founder & Developer</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href="https://github.com/dangphung4" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href="https://linkedin.com/dang-phung" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href="https://dangtphung" target="_blank" rel="noopener noreferrer" aria-label="Personal Website">
                        <Globe className="h-5 w-5" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                        <a href="mailto:dangphung4@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
                            <Mail className="h-5 w-5" />
                        </a>
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-6">
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
                      <Button variant="outline" className="group" asChild>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Technology Stack
              </CardTitle>
              <CardDescription>Built with modern, reliable technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <img src={ReactIcon} alt="React" className="h-10 w-10 mb-2" />
                  <span className="text-sm font-medium">React</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <img src={TypeScriptIcon} alt="TypeScript" className="h-10 w-10 mb-2" />
                  <span className="text-sm font-medium">TypeScript</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <img src={TailwindIcon} alt="Tailwind CSS" className="h-10 w-10 mb-2" />
                  <span className="text-sm font-medium">Tailwind CSS</span>
                </div>
                <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                  <img src={FirebaseIcon} alt="Firebase" className="h-10 w-10 mb-2" />
                  <span className="text-sm font-medium">Firebase</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
