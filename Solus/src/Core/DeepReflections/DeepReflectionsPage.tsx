import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Brain, ArrowRight, ArrowLeft, CheckCircle2, Scale, Clock, Lightbulb, Heart, Plus, Award, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function DeepReflectionsPage() {
  // State for step navigation
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  // Decision context state
  const [decisionQuestion, setDecisionQuestion] = useState("Should I accept the job offer in San Francisco or stay at my current position?");
  const [timeframe, setTimeframe] = useState("I need to decide within 2 weeks");
  const [importance, setImportance] = useState("This decision will significantly impact my career trajectory and personal life for the next 3-5 years");

  // Options state with fake data
  const [options, setOptions] = useState([
    {
      id: 1,
      text: "Accept new job offer in San Francisco",
      pros: [
        "Higher salary and better benefits",
        "Opportunity to work with cutting-edge technology",
        "Career advancement potential",
        "Exciting city with diverse culture"
      ],
      cons: [
        "Higher cost of living",
        "Moving away from family and friends",
        "Longer commute",
        "Uncertainty of new work environment"
      ],
      valuesAlignment: 78
    },
    {
      id: 2,
      text: "Stay at current position",
      pros: [
        "Established comfort and stability",
        "Close to family and support network",
        "Lower cost of living",
        "Good work-life balance"
      ],
      cons: [
        "Limited growth opportunities",
        "Lower salary ceiling",
        "Less exciting technology stack",
        "Feeling of stagnation"
      ],
      valuesAlignment: 65
    }
  ]);

  // Personal values state with fake data
  const [personalValues, setPersonalValues] = useState([
    "Professional growth",
    "Financial security",
    "Work-life balance",
    "Proximity to family",
    "Learning and development"
  ]);

  // Emotional context state
  const [emotionalContext, setEmotionalContext] = useState(
    "I feel excited about the new opportunity but anxious about the significant life changes it would entail. I'm worried about leaving my comfort zone, but also concerned about missing out on a potentially transformative experience. There's some fear of the unknown, but also anticipation of new possibilities."
  );

  // Handlers for adding new items
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

  const handleAddValue = () => {
    setPersonalValues([...personalValues, ""]);
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

  // Handlers for input changes
  const handleOptionTextChange = (id: number, value: string) => {
    setOptions(options.map(option =>
      option.id === id ? { ...option, text: value } : option
    ));
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...personalValues];
    newValues[index] = value;
    setPersonalValues(newValues);
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

  const handleAlignmentChange = (optionId: number, value: number[]) => {
    setOptions(options.map(option =>
      option.id === optionId
        ? { ...option, valuesAlignment: value[0] }
        : option
    ));
  };

  // Navigation handlers
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Final step action
      setStep(6); // Results page
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Calculate best option
  const getBestOption = () => {
    if (options.length === 0) return null;
    
    return options.reduce((best, current) => {
      const bestScore = best.pros.length - best.cons.length + (best.valuesAlignment / 20);
      const currentScore = current.pros.length - current.cons.length + (current.valuesAlignment / 20);
      
      return currentScore > bestScore ? current : best;
    }, options[0]);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="flex flex-col gap-8">
          <section className="flex items-center gap-4">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">
                Deep Reflection
              </h1>
              <p className="text-muted-foreground">
                A structured framework for life's important decisions
              </p>
            </div>
          </section>

          <section>
            <div className="mb-2 flex justify-between text-sm">
              <div className="font-medium">Step {step} of {totalSteps}</div>
              <div className="text-muted-foreground">{Math.round(progress)}% complete</div>
            </div>
            <Progress value={progress} className="h-2" />
          </section>

          <section className="w-full max-w-4xl mx-auto">
            {/* Step 1: Decision Context */}
            {step === 1 && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <Card className="w-full">
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      <CardTitle>Define Your Decision</CardTitle>
                    </div>
                    <CardDescription>
                      Clarify the decision you're facing and why it matters
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Decision Question</label>
                      <Textarea
                        placeholder="e.g., Should I accept the new job offer or stay at my current position?"
                        value={decisionQuestion}
                        onChange={(e) => setDecisionQuestion(e.target.value)}
                        className="min-h-24 resize-none"
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Importance & Impact</label>
                      <Textarea
                        placeholder="Why is this decision important? What impact will it have?"
                        value={importance}
                        onChange={(e) => setImportance(e.target.value)}
                        className="min-h-20 resize-none"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex justify-end">
                    <Button 
                      onClick={handleNext} 
                      disabled={!decisionQuestion.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Options */}
            {step === 2 && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle>Explore Your Options</CardTitle>
                    </div>
                    <CardDescription>
                      Define the different paths available to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-5">
                      {options.map((option, idx) => (
                        <div 
                          key={option.id} 
                          className="p-4 border rounded-md space-y-3 bg-card"
                        >
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-normal">
                              Option {idx + 1}
                            </Badge>
                            <Input
                              placeholder={`Describe option ${idx + 1}`}
                              value={option.text}
                              onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                              className="font-medium"
                            />
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        onClick={handleAddOption}
                        className="w-full group"
                      >
                        <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Add Another Option
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      disabled={options.some(opt => !opt.text.trim())}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Values */}
            {step === 3 && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <CardTitle>Your Core Values</CardTitle>
                    </div>
                    <CardDescription>
                      Identify what matters most to you in life
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {personalValues.map((value, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <div className="bg-primary/10 h-7 w-7 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                            {index + 1}
                          </div>
                          <Input
                            placeholder={`Value ${index + 1} (e.g., Family, Growth, Security)`}
                            value={value}
                            onChange={(e) => handleValueChange(index, e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        onClick={handleAddValue}
                        className="w-full group"
                      >
                        <Plus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        Add Another Value
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      disabled={personalValues.some(v => !v.trim())}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 4: Pros, Cons, and Values Alignment */}
            {step === 4 && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      <CardTitle>Evaluate Your Options</CardTitle>
                    </div>
                    <CardDescription>
                      Analyze the pros, cons, and alignment with your values
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Tabs defaultValue={options[0]?.id.toString()} className="w-full">
                      <TabsList className="mb-6 grid grid-cols-2 gap-2">
                        {options.map(option => (
                          <TabsTrigger 
                            key={option.id} 
                            value={option.id.toString()} 
                            className="py-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
                          >
                            {option.text || `Option ${option.id}`}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {options.map(option => (
                        <TabsContent key={option.id} value={option.id.toString()} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pros */}
                            <div className="space-y-4 bg-green-500/5 p-4 rounded-lg border border-green-500/20">
                              <h3 className="font-medium flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="h-5 w-5" />
                                Pros
                              </h3>
                              <div className="space-y-3">
                                {option.pros.map((pro, index) => (
                                  <div key={index} className="flex gap-2 items-center">
                                    <div className="bg-green-500/10 h-6 w-6 rounded-full flex items-center justify-center text-green-600 text-xs font-medium">
                                      {index + 1}
                                    </div>
                                    <Input
                                      placeholder={`Pro ${index + 1}`}
                                      value={pro}
                                      onChange={(e) => handleProChange(option.id, index, e.target.value)}
                                      className="flex-1 border-green-500/20 focus-visible:ring-green-500/50"
                                    />
                                  </div>
                                ))}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddPro(option.id)}
                                className="w-full border-green-500/20 text-green-600 hover:bg-green-500/10"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Pro
                              </Button>
                            </div>

                            {/* Cons */}
                            <div className="space-y-4 bg-red-500/5 p-4 rounded-lg border border-red-500/20">
                              <h3 className="font-medium flex items-center gap-2 text-red-600">
                                <Scale className="h-5 w-5" />
                                Cons
                              </h3>
                              <div className="space-y-3">
                                {option.cons.map((con, index) => (
                                  <div key={index} className="flex gap-2 items-center">
                                    <div className="bg-red-500/10 h-6 w-6 rounded-full flex items-center justify-center text-red-600 text-xs font-medium">
                                      {index + 1}
                                    </div>
                                    <Input
                                      placeholder={`Con ${index + 1}`}
                                      value={con}
                                      onChange={(e) => handleConChange(option.id, index, e.target.value)}
                                      className="flex-1 border-red-500/20 focus-visible:ring-red-500/50"
                                    />
                                  </div>
                                ))}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddCon(option.id)}
                                className="w-full border-red-500/20 text-red-600 hover:bg-red-500/10"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Con
                              </Button>
                            </div>
                          </div>

                          <div className="pt-4 bg-primary/5 p-6 rounded-lg border">
                            <h3 className="font-medium flex items-center gap-2 mb-5 text-primary">
                              <Heart className="h-5 w-5" />
                              Values Alignment
                            </h3>
                            
                            <div className="mb-6">
                              <div className="text-sm mb-3">How well does this option align with your core values?</div>
                              <div className="flex flex-wrap gap-2 mb-6">
                                {personalValues.map((value, index) => (
                                  <Badge 
                                    key={index} 
                                    variant="secondary" 
                                    className="px-3 py-1 text-xs"
                                  >
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
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
                                className="py-4"
                              />
                              <div className="text-center">
                                <Badge variant="outline" className="px-4 py-1 text-lg font-semibold border-primary text-primary">
                                  {option.valuesAlignment}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 5: Emotional Context */}
            {step === 5 && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <CardTitle>Emotional Context</CardTitle>
                    </div>
                    <CardDescription>
                      Explore how you feel about this decision
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-5">
                      <div className="p-1 bg-primary/5 rounded-lg">
                        <Textarea
                          placeholder="Describe your emotional state around this decision. Are you anxious? Excited? Conflicted? How might your current feelings be influencing your thinking?"
                          value={emotionalContext}
                          onChange={(e) => setEmotionalContext(e.target.value)}
                          className="min-h-40 resize-none border-none focus-visible:ring-primary"
                        />
                      </div>
                      
                      <div className="rounded-lg border p-4 bg-amber-500/5">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/10 p-2 rounded-full mt-0.5">
                            <Lightbulb className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium text-amber-600">Reflection Prompt</h4>
                            <p className="text-sm text-amber-600/80">
                              Consider how your emotions might be affecting your judgement. Are there any biases influencing your thinking? Try to separate facts from feelings.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      disabled={!emotionalContext.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Complete Reflection <CheckCircle2 className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {/* Step 6: Results */}
            {step === 6 && (
              <motion.div
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <Card className="overflow-hidden">
                  <div className="h-2 bg-primary"></div>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <CardTitle>Reflection Results</CardTitle>
                    </div>
                    <CardDescription>
                      Based on your structured reflection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Decision Question
                        </h3>
                        <p className="text-muted-foreground mt-2 italic">"{decisionQuestion}"</p>
                      </div>
                      
                      {getBestOption() && (
                        <div>
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            Recommended Path
                          </h3>
                          <div className="bg-primary/5 p-6 rounded-lg mt-2 border shadow-sm">
                            <div className="mx-auto w-fit mb-3">
                              <Badge className="px-3 py-1 text-xs bg-primary text-primary-foreground">
                                HIGHEST ALIGNMENT
                              </Badge>
                            </div>
                            <p className="font-bold text-xl text-center">{getBestOption()?.text}</p>
                            <div className="flex justify-center gap-8 text-sm text-center text-muted-foreground mt-4">
                              <div>
                                <div className="font-medium text-primary mb-1">Values Alignment</div>
                                <p className="text-lg font-bold">{getBestOption()?.valuesAlignment}%</p>
                              </div>
                              <div>
                                <div className="font-medium text-green-600 mb-1">Pros</div>
                                <p className="text-lg font-bold">{getBestOption()?.pros.filter(p => p.trim()).length}</p>
                              </div>
                              <div>
                                <div className="font-medium text-red-600 mb-1">Cons</div>
                                <p className="text-lg font-bold">{getBestOption()?.cons.filter(c => c.trim()).length}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <Brain className="h-4 w-4 text-primary" />
                          Analysis
                        </h3>
                        <div className="text-muted-foreground mt-2 space-y-2">
                          <p>
                            This option best aligns with your stated values and has the most favorable balance of pros and cons.
                            Your emotional context indicates thoughtful consideration on this decision.
                          </p>
                          <p>
                            Consider that while "{getBestOption()?.text}" provides better alignment with your growth values,
                            it does come with notable trade-offs related to stability and personal connections.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          <Heart className="h-4 w-4 text-primary" />
                          Values Considered
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {personalValues.filter(v => v.trim()).map((value, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="px-3 py-1.5 text-sm font-normal"
                            >
                              {value}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="border p-4 rounded-lg bg-amber-500/5">
                        <div className="flex items-start gap-3">
                          <div className="bg-amber-500/10 p-2 rounded-full mt-0.5">
                            <Lightbulb className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-medium text-amber-600">Final Reflection</h4>
                            <p className="text-sm text-amber-600/80">
                              Remember that while this analysis provides a structured approach to your decision, 
                              only you can determine what's truly best for your unique situation. Trust your instincts while
                              considering the insights gained through this reflection.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 border-t">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => setStep(1)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Start New Reflection
                    </Button>
                    <Button variant="outline" className="w-full">
                      Save This Reflection
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
