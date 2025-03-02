import { Separator } from "@/components/ui/separator"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Link } from "react-router-dom"
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react"

export default function PrivacyPolicyPage() {
  // Current date for last updated
  const lastUpdated = "June 15, 2023"

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-12 px-4 md:py-16">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Back button */}
          <div>
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Your Privacy Matters
              </CardTitle>
              <CardDescription>
                How Solus handles and protects your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                At Solus, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our application.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
                please do not access the application.
              </p>
            </CardContent>
          </Card>

          {/* Privacy sections in accordion */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="info-collection">
              <AccordionTrigger className="text-lg font-medium">
                <span className="flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-muted-foreground" />
                  Information We Collect
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p>
                  We may collect several types of information from and about users of our application, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal data:</strong> Name, email address, and profile information when you create an account.
                  </li>
                  <li>
                    <strong>Usage data:</strong> Information about how you use our application, including decisions you've made, 
                    preferences you've set, and features you've accessed.
                  </li>
                  <li>
                    <strong>Device information:</strong> Data about your device, including IP address, browser type, operating system, 
                    and other technology on the devices you use to access our application.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="info-use">
              <AccordionTrigger className="text-lg font-medium">
                <span className="flex items-center">
                  <Database className="mr-2 h-5 w-5 text-muted-foreground" />
                  How We Use Your Information
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p>
                  We use the information we collect about you or that you provide to us, including any personal information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide, maintain, and improve our application</li>
                  <li>To personalize your experience with our decision-making tools</li>
                  <li>To analyze usage patterns and improve our services</li>
                  <li>To communicate with you about updates, support, and promotional materials</li>
                  <li>To detect, prevent, and address technical issues or fraudulent activities</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="info-disclosure">
              <AccordionTrigger className="text-lg font-medium">
                <span className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-muted-foreground" />
                  Disclosure of Your Information
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p>
                  We may disclose aggregated information about our users, and information that does not identify any individual, 
                  without restriction.
                </p>
                <p>
                  We may disclose personal information that we collect or you provide as described in this privacy policy:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To our subsidiaries and affiliates</li>
                  <li>To contractors, service providers, and other third parties we use to support our business</li>
                  <li>To comply with any court order, law, or legal process</li>
                  <li>To enforce or apply our terms of use</li>
                  <li>If we believe disclosure is necessary to protect the rights, property, or safety of Solus, our users, or others</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="data-security">
              <AccordionTrigger className="text-lg font-medium">
                <span className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                  Data Security
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p>
                  We have implemented measures designed to secure your personal information from accidental loss and from 
                  unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on 
                  secure servers behind firewalls.
                </p>
                <p>
                  The safety and security of your information also depends on you. Where we have given you (or where you have chosen) 
                  a password for access to certain parts of our application, you are responsible for keeping this password confidential. 
                  We ask you not to share your password with anyone.
                </p>
                <p>
                  Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best 
                  to protect your personal information, we cannot guarantee the security of your personal information transmitted 
                  to our application. Any transmission of personal information is at your own risk.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="changes">
              <AccordionTrigger className="text-lg font-medium">
                <span className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-muted-foreground" />
                  Changes to Our Privacy Policy
                </span>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p>
                  It is our policy to post any changes we make to our privacy policy on this page. 
                  If we make material changes to how we treat our users' personal information, we will notify you 
                  through a notice on the application home page.
                </p>
                <p>
                  The date the privacy policy was last revised is identified at the top of the page. 
                  You are responsible for periodically visiting our application and this privacy policy to check for any changes.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Questions about our privacy practices?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                If you have any questions or concerns about this privacy policy or our privacy practices, 
                please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:privacy@solusapp.com" className="text-primary hover:underline">privacy@solusapp.com</a>
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <footer className="pt-8">
            <Separator className="my-4" />
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Solus. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <Link to="/about-us" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
                <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
