import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Save,
  Plus,
  Minus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCheck
} from "lucide-react";
import { DecisionCategory } from "@/db/types/BaseDecision";
import { toast } from "sonner";

type Option = {
  id: string;
  text: string;
  selected: boolean;
  pros: string[];
  cons: string[];
};

type RecommendationResultProps = {
  title: string;
  category: DecisionCategory;
  options: Option[];
  recommendation: {
    recommendation: string;
    reasoning: string;
    fullAnalysis?: string;
  };
  onOptionSelect: (id: string) => void;
  onSave: () => void;
  onNew?: () => void;
  contextFactors?: string[];
  isProcessing?: boolean;
};

export default function RecommendationResult({
  title,
  category,
  options,
  recommendation,
  onOptionSelect,
  onSave,
  onNew,
  contextFactors = [],
  isProcessing = false,
}: RecommendationResultProps) {
  const [showFullAnalysis, setShowFullAnalysis] = useState(false);
  const [feedback, setFeedback] = useState<'helpful' | 'unhelpful' | null>(null);
  
  const handleFeedback = (type: 'helpful' | 'unhelpful') => {
    setFeedback(type);
    // You could add an API call here to store user feedback
    toast.success(
      type === 'helpful' 
        ? "Thanks for your feedback!" 
        : "Thanks for your feedback. We'll improve our recommendations."
    );
  };
  
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/10 shadow-md">
        <CardHeader className="pb-3 md:pb-4 bg-gradient-to-r from-primary/5 to-background">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mt-2">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              </CardDescription>
            </div>
            <CheckCircle2 className="h-7 w-7 md:h-9 md:w-9 text-primary shrink-0" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Recommendation box */}
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 transition-all hover:border-primary/40 hover:bg-primary/10">
            <h3 className="text-lg font-semibold mb-2 flex items-center text-primary">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Recommendation
            </h3>
            <p className="text-lg font-medium">{recommendation.recommendation}</p>
            
            <Separator className="my-4" />
            
            <h3 className="text-md font-semibold mb-2">Reasoning</h3>
            <p className="text-md text-muted-foreground">{recommendation.reasoning}</p>
            
            {recommendation.fullAnalysis && (
              <div className="mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                  className="p-0 h-auto text-primary"
                >
                  {showFullAnalysis ? (
                    <ChevronUp className="h-4 w-4 mr-1.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1.5" />
                  )}
                  {showFullAnalysis ? "Hide" : "Show"} full analysis
                </Button>
                
                {showFullAnalysis && (
                  <div className="mt-3 text-sm text-muted-foreground p-3 border rounded-md bg-background animate-fadeIn">
                    <p className="whitespace-pre-line">{recommendation.fullAnalysis}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Context factors */}
          {contextFactors.length > 0 && (
            <div className="animate-fadeIn">
              <h3 className="text-md font-semibold mb-2">Considered Context Factors</h3>
              <div className="flex flex-wrap gap-2">
                {contextFactors.map((factor, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="px-2 py-1 text-sm transition-all hover:bg-secondary/80"
                  >
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Options */}
          <div>
            <h3 className="text-md font-semibold mb-3">All Options</h3>
            <div className="space-y-3">
              {options.map((option) => {
                const isRecommended = option.text.toLowerCase() === recommendation.recommendation.toLowerCase();
                
                return (
                  <div 
                    key={option.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      option.selected 
                        ? "border-primary bg-primary/10 shadow-sm" 
                        : isRecommended
                          ? "border-primary/40 bg-primary/5 hover:border-primary/60 hover:bg-primary/10"
                          : "border-muted hover:border-primary/30 hover:bg-muted/30"
                    }`}
                    onClick={() => onOptionSelect(option.id)}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{option.text}</h4>
                        <div className="flex items-center gap-2">
                          {isRecommended && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              AI Recommended
                            </Badge>
                          )}
                          {option.selected && (
                            <Badge 
                              variant={isRecommended ? "default" : "outline"} 
                              className={isRecommended 
                                ? "bg-primary text-primary-foreground animate-pulse" 
                                : "bg-secondary text-secondary-foreground"
                              }
                            >
                              {isRecommended ? <CheckCheck className="h-3 w-3 mr-1" /> : null}
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Pros and Cons */}
                      {(option.pros.length > 0 || option.cons.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                          {option.pros.length > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md transition-all hover:bg-green-100 dark:hover:bg-green-900/30">
                              <p className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center mb-1.5">
                                <Plus className="h-3 w-3 mr-1" />
                                Pros
                              </p>
                              <ul className="text-xs space-y-1 list-disc list-inside text-green-700 dark:text-green-300">
                                {option.pros.map((pro, index) => (
                                  <li key={index} className="ml-1">{pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {option.cons.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md transition-all hover:bg-red-100 dark:hover:bg-red-900/30">
                              <p className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center mb-1.5">
                                <Minus className="h-3 w-3 mr-1" />
                                Cons
                              </p>
                              <ul className="text-xs space-y-1 list-disc list-inside text-red-700 dark:text-red-300">
                                {option.cons.map((con, index) => (
                                  <li key={index} className="ml-1">{con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-3 justify-between py-4 md:py-5 bg-gradient-to-r from-background to-primary/5">
          <div className="flex flex-wrap gap-2">
            {onNew && (
              <Button 
                variant="outline" 
                onClick={onNew} 
                disabled={isProcessing}
                className="transition-all hover:bg-primary/5"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Decision
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 md:gap-3">
            <div className="flex gap-1">
              <Button 
                variant={feedback === 'helpful' ? 'default' : 'outline'}
                size="sm" 
                className={`rounded-r-none border-r-0 px-2.5 transition-all ${
                  feedback === 'helpful' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
                onClick={() => handleFeedback('helpful')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button 
                variant={feedback === 'unhelpful' ? 'default' : 'outline'}
                size="sm" 
                className={`rounded-l-none px-2.5 transition-all ${
                  feedback === 'unhelpful' ? 'bg-red-600 hover:bg-red-700' : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                onClick={() => handleFeedback('unhelpful')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={onSave} 
              disabled={isProcessing || !options.some(opt => opt.selected)}
              className="whitespace-nowrap transition-all hover:bg-primary/90"
            >
              {isProcessing ? "Saving..." : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Decision
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 