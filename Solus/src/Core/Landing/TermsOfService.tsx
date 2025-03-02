import { Separator } from "@/components/ui/separator"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, Scale, File, AlertTriangle, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TermsOfService() {
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
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center">
              <Scale className="mr-3 h-8 w-8 text-primary" />
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="terms" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="terms" className="flex-1">Terms</TabsTrigger>
              <TabsTrigger value="use" className="flex-1">Acceptable Use</TabsTrigger>
              <TabsTrigger value="disclaimers" className="flex-1">Disclaimers</TabsTrigger>
            </TabsList>

            {/* Terms Tab */}
            <TabsContent value="terms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-primary" />
                    Agreement to Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    These Terms of Service constitute a legally binding agreement made between you and Solus, concerning 
                    your access to and use of our mobile application and website.
                  </p>
                  <p>
                    You agree that by accessing the App, you have read, understood, and agree to be bound by all of these 
                    Terms of Service. If you do not agree with all of these terms, then you are expressly prohibited from 
                    using the App and must discontinue use immediately.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intellectual Property Rights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Unless otherwise indicated, the App is our proprietary property and all source code, databases, 
                    functionality, software, website designs, audio, video, text, photographs, and graphics on the App 
                    (collectively, the "Content") and the trademarks, service marks, and logos contained therein 
                    (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and 
                    trademark laws and various other intellectual property rights.
                  </p>
                  <p>
                    The Content and Marks are provided on the App "AS IS" for your information and personal use only. 
                    Except as expressly provided in these Terms of Service, no part of the App and no Content or Marks 
                    may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, 
                    translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose 
                    whatsoever, without our express prior written permission.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Representations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>By using the App, you represent and warrant that:</p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                    <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                    <li>You are not a minor in the jurisdiction in which you reside.</li>
                    <li>You will not access the App through automated or non-human means, whether through a bot, script, or otherwise.</li>
                    <li>You will not use the App for any illegal or unauthorized purpose.</li>
                    <li>Your use of the App will not violate any applicable law or regulation.</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Acceptable Use Tab */}
            <TabsContent value="use" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-primary" />
                    Prohibited Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    You may not access or use the App for any purpose other than that for which we make the App available. 
                    The App may not be used in connection with any commercial endeavors except those that are specifically 
                    endorsed or approved by us.
                  </p>
                  <p>As a user of the App, you agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Systematically retrieve data or other content from the App to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                    <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
                    <li>Circumvent, disable, or otherwise interfere with security-related features of the App.</li>
                    <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the App.</li>
                    <li>Use any information obtained from the App in order to harass, abuse, or harm another person.</li>
                    <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
                    <li>Use the App in a manner inconsistent with any applicable laws or regulations.</li>
                    <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming, that interferes with any party's uninterrupted use and enjoyment of the App or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the App.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Generated Contributions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The App may invite you to chat, contribute to, or participate in blogs, message boards, online forums, 
                    and other functionality, and may provide you with the opportunity to create, submit, post, display, 
                    transmit, perform, publish, distribute, or broadcast content and materials to us or on the App, including 
                    but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal 
                    information or other material (collectively, "Contributions").
                  </p>
                  <p>
                    Contributions may be viewable by other users of the App. As such, any Contributions you transmit may be 
                    treated as non-confidential and non-proprietary. When you create or make available any Contributions, 
                    you thereby represent and warrant that your Contributions comply with these Terms of Service.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Disclaimers Tab */}
            <TabsContent value="disclaimers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="mr-2 h-5 w-5 text-primary" />
                    Disclaimer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    THE APP IS PROVIDED ON AN "AS-IS" AND "AS AVAILABLE" BASIS. YOU AGREE THAT YOUR USE OF THE APP AND OUR 
                    SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, 
                    EXPRESS OR IMPLIED, IN CONNECTION WITH THE APP AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE 
                    IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE 
                    NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE APP'S CONTENT OR THE CONTENT 
                    OF ANY WEBSITES LINKED TO THE APP AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, 
                    MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE 
                    WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE APP, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR 
                    SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Decision Making</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The Solus app is designed to assist with decision-making, but the ultimate responsibility for any 
                    decision you make remains solely with you. We provide tools and suggestions based on the information 
                    you provide, but:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We do not guarantee that the app will result in the optimal decision for your specific situation.</li>
                    <li>We are not liable for any consequences, direct or indirect, that may arise from decisions you make based on information provided by our app.</li>
                    <li>For important life decisions, we strongly recommend consulting with appropriate professionals (financial advisors, doctors, lawyers, etc.) before taking action.</li>
                    <li>The app should be viewed as a supplementary tool rather than a replacement for professional advice in complex matters.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY 
                    DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, 
                    LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE APP, EVEN IF WE HAVE BEEN ADVISED 
                    OF THE POSSIBILITY OF SUCH DAMAGES.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Questions or Concerns?</CardTitle>
              <CardDescription>
                We're here to help with any questions about our terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Please contact us at:
              </p>
              <p className="mt-4">
                <strong>Email:</strong> <a href="mailto:legal@solusapp.com" className="text-primary hover:underline">legal@solusapp.com</a>
              </p>
            </CardContent>
          </Card>

          {/* Agreement button */}
          <div className="flex justify-center pt-6">
            <Button asChild className="w-full max-w-xs">
              <Link to="/">I Understand and Agree</Link>
            </Button>
          </div>

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
                <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
