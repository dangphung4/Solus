import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Brain, ArrowRight, ArrowLeft, CheckCircle2, Scale, Clock, Lightbulb, Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DeepReflectionsPage() {
  const [step, setStep] = useState(1);
  const [decisionQuestion, setDecisionQuestion] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [options, setOptions] = useState<{
    id: number;
    text: string;
    pros: string[];
    cons: string[];
    valuesAlignment: number;
  }[]>([
    { id: 1, text: "", pros: [""], cons: [""], valuesAlignment: 50 }
  ]);
  const [personalValues, setPersonalValues] = useState<string[]>(["", ""]);
  const [emotionalContext, setEmotionalContext] = useState("");
  
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleAddOption = () => {
    setOptions([
      ...options,
      { 
        id: options.length + 1, 
        text: "", 
        pros: [""], 
        cons: [""],
        valuesAlignment: 50
      }
    ]);
  };

  const handleOptionTextChange = (id: number, value: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text: value } : option
    ));
  };

  const handleAddPro = (optionId: number) => {
    setOptions(options.map(option => 
      option.id === optionId 
        ? { ...option, pros: [...option.pros, ""] } 
        : option
    ));
  };

  const handleAddCon = (optionId: number) => {
    setOptions(options.map(option => 
      option.id === optionId 
        ? { ...option, cons: [...option.cons, ""] } 
        : option
    ));
  };

  const handleProChange = (optionId: number, index: number, value: string) => {
    setOptions(options.map(option => 
      option.id === optionId 
        ? { 
            ...option, 
            pros: option.pros.map((pro, i) => i === index ? value : pro) 
          } 
        : option
    ));
  };

  const handleConChange = (optionId: number, index: number, value: string) => {
    setOptions(options.map(option => 
      option.id === optionId 
        ? { 
            ...option, 
            cons: option.cons.map((con, i) => i === index ? value : con) 
          } 
        : option
    ));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...personalValues];
    newValues[index] = value;
    setPersonalValues(newValues);
  };

  const handleAddValue = () => {
    setPersonalValues([...personalValues, ""]);
  };

  const handleAlignmentChange = (optionId: number, value: number[]) => {
    setOptions(options.map(option => 
      option.id === optionId 
        ? { ...option, valuesAlignment: value[0] } 
        : option
    ));
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
    setStep(6);
  };

  // Calculate the best option based on pros/cons and values alignment
  const getBestOption = () => {
    if (options.length === 0) return null;
    
    // Simple algorithm: highest values alignment + most pros - cons
    return options.reduce((best, current) => {
      const bestScore = best.pros.length - best.cons.length + (best.valuesAlignment / 25);
      const currentScore = current.pros.length - current.cons.length + (current.valuesAlignment / 25);
      
      return currentScore > bestScore ? current : best;
    }, options[0]);
  };

  return (
    <div className="container max-w-4xl py-8 justify-self-center">
      <div className="flex flex-col gap-8">
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Deep Reflection</h1>
          </div>
          <p className="text-muted-foreground">
            A structured framework for life's important decisions
          </p>
        </section>

        <section>
          <div className="mb-2 flex justify-between text-sm">
            <div>Step {step > 5 ? 5 : step} of {totalSteps}</div>
            <div>{Math.min(Math.round(progress),100)}%</div>
          </div>
          <Progress value={progress} className="h-2" />
        </section>

        <section>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>What important decision are you facing?</CardTitle>
                <CardDescription>
                  Describe the decision you need to make and its significance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Decision Question</label>
                  <Textarea
                    placeholder="e.g., Should I accept the new job offer or stay at my current position?"
                    value={decisionQuestion}
                    onChange={(e) => setDecisionQuestion(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Decision Timeframe</label>
                  <Input
                    placeholder="e.g., I need to decide within 2 weeks"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleNext} disabled={!decisionQuestion.trim()}>
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
                  List the choices you're considering in detail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {options.map((option) => (
                    <div key={option.id} className="p-4 border rounded-md space-y-4">
                      <Input
                        placeholder={`Option ${option.id}`}
                        value={option.text}
                        onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={handleAddOption}
                    className="w-full"
                  >
                    Add Another Option
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={options.some(opt => !opt.text.trim())}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>What are your personal values?</CardTitle>
                <CardDescription>
                  List the core values that guide your decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalValues.map((value, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Value ${index + 1} (e.g., Family, Growth, Security)`}
                        value={value}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                  <Button 
                    variant="outline" 
                    onClick={handleAddValue}
                    className="w-full"
                  >
                    Add Another Value
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={personalValues.some(v => !v.trim())}
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Weigh your options</CardTitle>
                <CardDescription>
                  Consider the pros and cons for each option
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={options[0]?.id.toString()} className="w-full">
                  <TabsList className="mb-4 flex overflow-x-auto">
                    {options.map(option => (
                      <TabsTrigger key={option.id} value={option.id.toString()} className="flex-1">
                        {option.text || `Option ${option.id}`}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {options.map(option => (
                    <TabsContent key={option.id} value={option.id.toString()} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Pros */}
                        <div className="space-y-3">
                          <h3 className="font-medium flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Pros
                          </h3>
                          {option.pros.map((pro, index) => (
                            <div key={index}>
                              <Input
                                placeholder={`Pro ${index + 1}`}
                                value={pro}
                                onChange={(e) => handleProChange(option.id, index, e.target.value)}
                              />
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddPro(option.id)}
                            className="w-full"
                          >
                            Add Pro
                          </Button>
                        </div>

                        {/* Cons */}
                        <div className="space-y-3">
                          <h3 className="font-medium flex items-center gap-2">
                            <Scale className="h-4 w-4 text-red-500" />
                            Cons
                          </h3>
                          {option.cons.map((con, index) => (
                            <div key={index}>
                              <Input
                                placeholder={`Con ${index + 1}`}
                                value={con}
                                onChange={(e) => handleConChange(option.id, index, e.target.value)}
                              />
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddCon(option.id)}
                            className="w-full"
                          >
                            Add Con
                          </Button>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="font-medium flex items-center gap-2 mb-4">
                          <Heart className="h-4 w-4 text-primary" />
                          Values Alignment
                        </h3>
                        <div className="space-y-6">
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Low Alignment</span>
                            <span>High Alignment</span>
                          </div>
                          <Slider
                            value={[option.valuesAlignment]}
                            onValueChange={(value) => handleAlignmentChange(option.id, value)}
                            max={100}
                            step={1}
                          />
                          <div className="text-center font-medium">
                            {option.valuesAlignment}%
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Emotional Context</CardTitle>
                <CardDescription>
                  Explore how you feel about this decision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe your emotional state around this decision. Are you anxious? Excited? Conflicted? How might your current feelings be influencing your thinking?"
                    value={emotionalContext}
                    onChange={(e) => setEmotionalContext(e.target.value)}
                    className="min-h-32"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={handleSubmit} disabled={!emotionalContext.trim()}>
                  Complete Reflection <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Reflection Results
                </CardTitle>
                <CardDescription>
                  Based on your structured reflection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-lg">Decision Question</h3>
                    <p className="text-muted-foreground">{decisionQuestion}</p>
                  </div>
                  
                  {getBestOption() && (
                    <div>
                      <h3 className="font-medium text-lg">Recommended Path</h3>
                      <div className="bg-primary/10 p-4 rounded-md mt-2 border">
                        <p className="font-bold text-xl text-center">{getBestOption()?.text}</p>
                        <div className="text-sm text-center text-muted-foreground mt-2 space-y-1">
                          <p>Values Alignment: {getBestOption()?.valuesAlignment}%</p>
                          <p>Pros: {getBestOption()?.pros.filter(p => p.trim()).length} • Cons: {getBestOption()?.cons.filter(c => c.trim()).length}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium text-lg">Reasoning</h3>
                    <p className="text-muted-foreground">
                      This option best aligns with your stated values and has the most favorable balance of pros and cons.
                      Your emotional context indicates {emotionalContext.split(' ').length > 5 ? 'thoughtful consideration' : 'some reflection'} on this decision.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">Values Considered</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {personalValues.filter(v => v.trim()).map((value, index) => (
                        <div key={index} className="bg-secondary px-3 py-1 rounded-full text-sm">
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                  <Clock className="mr-2 h-4 w-4" />
                  Start New Reflection
                </Button>
              </CardFooter>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
