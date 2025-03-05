import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgePlus, XCircle, Trash2, ArrowRight, ArrowLeft, Plus, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { extractDecisionOptions, generateRecommendation } from "@/lib/ai/quickDecisionService";
import { createQuickDecision } from "@/db/Decision/Quick/quickDecisionDb";
import { DecisionCategory, DecisionStatus } from "@/db/types/BaseDecision";
import ProcessText from "./Components/ProcessText";
import RecommendationResult from "./Components/RecommendationResult";

/**
 * QuickDecisionsPage Component
 * 
 * A mobile-first page for making quick decisions with AI assistance
 */
export default function QuickDecisionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DecisionCategory>(DecisionCategory.OTHER);
  const [options, setOptions] = useState<Array<{
    id: string;
    text: string;
    selected: boolean;
    pros: string[];
    cons: string[];
  }>>([
    { id: uuidv4(), text: "", selected: false, pros: [], cons: [] },
    { id: uuidv4(), text: "", selected: false, pros: [], cons: [] }
  ]);
  const [contextFactors, setContextFactors] = useState<string[]>([]);
  const [newContextFactor, setNewContextFactor] = useState("");
  const [gutFeeling, setGutFeeling] = useState("");
  const [aiResponse, setAiResponse] = useState<{
    recommendation: string;
    reasoning: string;
    fullAnalysis: string;
  } | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("manual");
  const tabsRef = useRef<HTMLDivElement>(null);
  
  // Reset form for a new decision
  const resetForm = () => {
    setStep(1);
    setTitle("");
    setCategory(DecisionCategory.OTHER);
    setOptions([
      { id: uuidv4(), text: "", selected: false, pros: [], cons: [] },
      { id: uuidv4(), text: "", selected: false, pros: [], cons: [] }
    ]);
    setContextFactors([]);
    setGutFeeling("");
    setAiResponse(null);
    setSelectedOption(null);
    setActiveTab("manual");
  };

  const handleAddOption = () => {
    setOptions([...options, { 
      id: uuidv4(), 
      text: "", 
      selected: false,
      pros: [],
      cons: []
    }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      toast.error("Cannot remove option", {
        description: "You need at least two options for a decision."
      });
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, value: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text: value } : option
    ));
  };

  const handleOptionSelect = (id: string) => {
    setOptions(options.map(option => 
      ({ ...option, selected: option.id === id })
    ));
    setSelectedOption(id);
  };

  const handleAddContextFactor = () => {
    if (!newContextFactor.trim()) return;
    
    setContextFactors([...contextFactors, newContextFactor.trim()]);
    setNewContextFactor("");
  };

  const handleRemoveContextFactor = (index: number) => {
    setContextFactors(contextFactors.filter((_, i) => i !== index));
  };

  const handleAddPro = (optionId: string, pro: string) => {
    if (!pro.trim()) return;
    
    setOptions(options.map(option => {
      if (option.id === optionId) {
        return { ...option, pros: [...option.pros, pro.trim()] };
      }
      return option;
    }));
  };

  const handleAddCon = (optionId: string, con: string) => {
    if (!con.trim()) return;
    
    setOptions(options.map(option => {
      if (option.id === optionId) {
        return { ...option, cons: [...option.cons, con.trim()] };
      }
      return option;
    }));
  };

  const handleRemovePro = (optionId: string, index: number) => {
    setOptions(options.map(option => {
      if (option.id === optionId) {
        return { 
          ...option, 
          pros: option.pros.filter((_, i) => i !== index) 
        };
      }
      return option;
    }));
  };

  const handleRemoveCon = (optionId: string, index: number) => {
    setOptions(options.map(option => {
      if (option.id === optionId) {
        return { 
          ...option, 
          cons: option.cons.filter((_, i) => i !== index) 
        };
      }
      return option;
    }));
  };

  const handleNext = () => {
    // Validate before moving to the next step
    if (step === 1) {
      if (!title.trim()) {
        toast.error("Title required", {
          description: "Please enter a title for your decision."
        });
        return;
      }
      
      const validOptions = options.filter(opt => opt.text.trim() !== "");
      if (validOptions.length < 2) {
        toast.error("Options required", {
          description: "Please enter at least two options."
        });
        return;
      }
      
      // Clean up empty options before proceeding
      setOptions(validOptions);
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleProcessComplete = (result: any) => {
    console.log("Process complete result:", result);
    
    if (!result.decisionData?.object || !result.recommendation) {
      toast.error("Invalid response format", {
        description: "Could not process the decision data correctly."
      });
      return;
    }
    
    // Update state with processed data
    setTitle(result.decisionData.object.title);
    setCategory(result.decisionData.object.category);
    
    // Format options with IDs and selected state
    const formattedOptions = result.decisionData.object.options.map((opt: any) => ({
      id: uuidv4(),
      text: opt.text,
      selected: false,
      pros: opt.pros || [],
      cons: opt.cons || []
    }));
    
    setOptions(formattedOptions);
    
    // Set context factors if available
    if (result.decisionData.object.contextFactors) {
      setContextFactors(result.decisionData.object.contextFactors);
    }
    
    // Set AI recommendation
    setAiResponse(result.recommendation);
    
    // Find and mark the recommended option as selected
    const recommendedOption = formattedOptions.find((opt: any) => 
      opt.text.toLowerCase() === result.recommendation.recommendation.toLowerCase()
    );
    
    if (recommendedOption) {
      setSelectedOption(recommendedOption.id);
      // Update the options to mark the recommended one as selected
      setOptions(formattedOptions.map((opt: any) => 
        ({ ...opt, selected: opt.id === recommendedOption.id })
      ));
    }
    
    // Switch to results view
    setStep(3);
    setActiveTab("results");
    
    toast.success("Decision processed", {
      description: "Your input has been processed and recommendations generated!"
    });
  };

  const handleGetRecommendation = async () => {
    if (options.filter(opt => opt.text.trim() !== "").length < 2) {
      toast.error("Options required", {
        description: "Please enter at least two options."
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await generateRecommendation(
        title,
        options,
        contextFactors.length > 0 ? contextFactors : undefined,
        gutFeeling.trim() !== "" ? gutFeeling : undefined
      );
      
      setAiResponse(result);
      setStep(3);
      setActiveTab("results");
      
      // Find and mark the recommended option as selected
      const recommendedOption = options.find(opt => 
        opt.text.toLowerCase() === result.recommendation.toLowerCase()
      );
      
      if (recommendedOption) {
        handleOptionSelect(recommendedOption.id);
      }

      toast.success("Recommendation generated", {
        description: "Your options have been analyzed and a recommendation has been made."
      });
    } catch (error) {
      console.error("Error generating recommendation:", error);
      toast.error("Recommendation error", {
        description: "Failed to generate a recommendation. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDecision = async () => {
    if (!currentUser) {
      toast.error("Authentication required", {
        description: "Please sign in to save your decision."
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Filter out options with empty text
      const validOptions = options.filter(opt => opt.text.trim() !== "");
      
      if (validOptions.length < 2) {
        toast.error("Options required", {
          description: "Please enter at least two options."
        });
        setIsProcessing(false);
        return;
      }
      
      // Check if at least one option is selected
      if (!validOptions.some(opt => opt.selected)) {
        toast.error("Selection required", {
          description: "Please select an option before saving."
        });
        setIsProcessing(false);
        return;
      }
      
      // A helper function to convert undefined values to null for Firebase
      const replaceUndefinedWithNull = (obj: any): any => {
        if (obj === undefined) return null;
        if (obj === null || typeof obj !== 'object') return obj;
        
        if (Array.isArray(obj)) {
          return obj.map(item => replaceUndefinedWithNull(item));
        }
        
        const result: Record<string, any> = {};
        for (const key in obj) {
          result[key] = replaceUndefinedWithNull(obj[key]);
        }
        return result;
      };
      
      // Prepare decision data with proper typing
      const decisionData = {
        id: uuidv4(),
        userId: currentUser.uid,
        title,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: DecisionStatus.COMPLETED,
        aiGenerated: false,
        type: 'quick' as const,
        options: validOptions.map(opt => ({
          id: opt.id,
          text: opt.text,
          selected: opt.selected,
          pros: opt.pros.length > 0 ? opt.pros : null,
          cons: opt.cons.length > 0 ? opt.cons : null
        })),
        contextFactors: contextFactors.length > 0 ? contextFactors : null,
        gutFeeling: gutFeeling.trim() !== "" ? gutFeeling.trim() : null,
        recommendation: aiResponse?.recommendation || null,
        recommendationReasoning: aiResponse?.reasoning || null,
        timeSpent: 0
      };
      
      // Replace any remaining undefined values with null
      const cleanDecisionData = replaceUndefinedWithNull(decisionData);
      
      console.log("Saving decision data:", cleanDecisionData);
      
      // Save to database
      await createQuickDecision(cleanDecisionData);
      
      toast.success("Decision saved", {
        description: "Your decision has been saved successfully."
      });
      
      // Navigate to decision history or dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving decision:", error);
      toast.error("Save error", {
        description: "Failed to save your decision. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Quick Decision Header */}
          <div className="text-center mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Quick Decision</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Make everyday decisions faster with AI assistance
            </p>
          </div>
          
          {/* Mode Selection */}
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
            ref={tabsRef}
          >
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="manual" className="px-2 py-2 md:px-4">Manual Entry</TabsTrigger>
              <TabsTrigger value="process" className="px-2 py-2 md:px-4">Process Text</TabsTrigger>
              <TabsTrigger value="results" disabled={!aiResponse} className="px-2 py-2 md:px-4">Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="mt-2 focus:outline-none">
              {/* Step 1: Decision Information */}
              {step === 1 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Step 1: What's your decision about?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Decision Title</Label>
                      <Input 
                        id="title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="e.g., Where to go for dinner tonight?"
                        className="mt-1.5"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                      <Select value={category} onValueChange={(value) => setCategory(value as DecisionCategory)}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(DecisionCategory).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Options</Label>
                      <div className="space-y-3">
                        {options.map((option, index) => (
                          <div key={option.id} className="flex items-center gap-2">
                            <Input 
                              value={option.text} 
                              onChange={(e) => handleOptionChange(option.id, e.target.value)} 
                              placeholder={`Option ${index + 1}`}
                              className="flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveOption(option.id)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddOption}
                        className="w-full mt-2"
                      >
                        <BadgePlus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-2">
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}
              
              {/* Step 2: Additional Information */}
              {step === 2 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl">Step 2: Additional Context</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="gutFeeling" className="text-sm font-medium">Gut Feeling (Optional)</Label>
                      <Textarea
                        id="gutFeeling"
                        value={gutFeeling}
                        onChange={(e) => setGutFeeling(e.target.value)}
                        placeholder="What's your intuition telling you about this decision?"
                        className="mt-1.5 h-20"
                      />
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Context Factors (Optional)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newContextFactor}
                          onChange={(e) => setNewContextFactor(e.target.value)}
                          placeholder="e.g., Time constraints, weather, budget"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newContextFactor.trim()) {
                              e.preventDefault();
                              handleAddContextFactor();
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleAddContextFactor}
                          className="shrink-0"
                          disabled={!newContextFactor.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {contextFactors.length > 0 && (
                        <ScrollArea className="h-24 rounded-md border p-2 mt-2">
                          <div className="space-y-2">
                            {contextFactors.map((factor, index) => (
                              <div key={index} className="flex items-center justify-between bg-secondary/50 rounded-lg p-2">
                                <span className="text-sm truncate mr-2">{factor}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveContextFactor(index)}
                                  className="h-6 w-6 shrink-0"
                                >
                                  <XCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Pros & Cons (Optional)</Label>
                      <Tabs defaultValue={options[0]?.id} className="w-full">
                        <TabsList className="w-full grid mb-2" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
                          {options.map((option, index) => (
                            <TabsTrigger key={option.id} value={option.id} className="text-xs md:text-sm px-1 py-1.5">
                              {option.text.substring(0, 12)}{option.text.length > 12 ? "..." : ""}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {options.map((option) => (
                          <TabsContent key={option.id} value={option.id} className="mt-2 space-y-4 focus:outline-none">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Label className="text-green-600 text-sm font-medium">Pros</Label>
                                <div className="flex-1">
                                  <Input
                                    placeholder="Add a pro"
                                    className="border-green-300"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        e.preventDefault();
                                        handleAddPro(option.id, e.currentTarget.value);
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {option.pros.length > 0 && (
                                <ScrollArea className="h-24 rounded-md border border-green-200 p-2">
                                  <div className="space-y-2">
                                    {option.pros.map((pro, index) => (
                                      <div key={index} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                                        <span className="text-sm truncate mr-2">{pro}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleRemovePro(option.id, index)}
                                          className="h-6 w-6 shrink-0"
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Label className="text-red-600 text-sm font-medium">Cons</Label>
                                <div className="flex-1">
                                  <Input
                                    placeholder="Add a con"
                                    className="border-red-300"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        e.preventDefault();
                                        handleAddCon(option.id, e.currentTarget.value);
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {option.cons.length > 0 && (
                                <ScrollArea className="h-24 rounded-md border border-red-200 p-2">
                                  <div className="space-y-2">
                                    {option.cons.map((con, index) => (
                                      <div key={index} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-lg p-2">
                                        <span className="text-sm truncate mr-2">{con}</span>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleRemoveCon(option.id, index)}
                                          className="h-6 w-6 shrink-0"
                                        >
                                          <XCircle className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-wrap gap-2 justify-between pt-2">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleGetRecommendation} 
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Getting Recommendation..." : "Get Recommendation"}
                      {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="process" className="mt-2 focus:outline-none">
              <ProcessText onProcessComplete={handleProcessComplete} />
            </TabsContent>
            
            <TabsContent value="results" className="mt-2 focus:outline-none">
              {aiResponse && (
                <RecommendationResult 
                  title={title}
                  category={category}
                  options={options}
                  recommendation={aiResponse}
                  onOptionSelect={handleOptionSelect}
                  onSave={handleSaveDecision}
                  onNew={resetForm}
                  contextFactors={contextFactors}
                  isProcessing={isProcessing}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
