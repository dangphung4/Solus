import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Zap, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function QuickDecisionsPage() {
  const [step, setStep] = useState(1);
  const [decision, setDecision] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [feeling, setFeeling] = useState<string>("");
  
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // This would typically send data to the backend
    // For now, we'll just go to the results step
    setStep(4);
  };

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Quick Decision</h1>
          </div>
          <p className="text-muted-foreground">
            Get clarity on everyday choices in 30 seconds or less
          </p>
        </section>

        <section>
          <div className="mb-2 flex justify-between text-sm">
            <div>Step {step} of {totalSteps}</div>
            <div>{Math.round(progress)}%</div>
          </div>
          <Progress value={progress} className="h-2" />
        </section>

        <section>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>What are you deciding?</CardTitle>
                <CardDescription>
                  Describe the decision you need to make in a simple question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., What should I eat for dinner tonight?"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  className="min-h-24"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext} disabled={!decision.trim()}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>What are your options?</CardTitle>
                <CardDescription>
                  List the choices you're considering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={handleAddOption}
                    className="w-full mt-2"
                  >
                    Add Another Option
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={options.length === 0 || options.some(opt => !opt.trim())}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>What's your gut feeling?</CardTitle>
                <CardDescription>
                  Consider which option you're naturally leaning toward
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={feeling} onValueChange={setFeeling}>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 py-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={!feeling}>
                  Get Decision <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Decision Results
                </CardTitle>
                <CardDescription>
                  Based on your inputs and past decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Decision</h3>
                    <p className="text-muted-foreground">{decision}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Recommended Choice</h3>
                    <div className="bg-primary/10 p-4 rounded-md mt-2 border">
                      <p className="font-bold text-xl text-center">{feeling}</p>
                      <p className="text-sm text-center text-muted-foreground mt-1">
                        This aligns with your gut feeling
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Reasoning</h3>
                    <p className="text-muted-foreground">
                      Your gut feeling often reflects your true preferences. For quick decisions like this,
                      trusting your intuition can lead to more satisfaction with your choice.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setStep(1)} variant="outline" className="w-full">
                  <Clock className="mr-2 h-4 w-4" />
                  Make Another Decision
                </Button>
              </CardFooter>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
