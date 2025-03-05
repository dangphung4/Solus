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
  RefreshCw
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DecisionCategory } from "@/db/types/BaseDecision";

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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mt-1">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Badge>
              </CardDescription>
            </div>
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recommendation */}
          <div className="border-2 border-primary/30 bg-primary/5 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Recommendation</h3>
            <p>{recommendation.recommendation}</p>
            
            <Separator className="my-4" />
            
            <h3 className="text-lg font-semibold mb-2">Reasoning</h3>
            <p className="text-sm">{recommendation.reasoning}</p>
            
            {recommendation.fullAnalysis && (
              <div className="mt-4">
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                >
                  {showFullAnalysis ? "Hide" : "Show"} full analysis
                </Button>
                
                {showFullAnalysis && (
                  <div className="mt-2 text-sm text-muted-foreground p-2 border rounded-md">
                    <p className="whitespace-pre-line">{recommendation.fullAnalysis}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Context factors if available */}
          {contextFactors.length > 0 && (
            <div>
              <h3 className="text-md font-semibold mb-2">Context Factors</h3>
              <ScrollArea className="h-20 rounded-md border p-2">
                <div className="space-y-1">
                  {contextFactors.map((factor, index) => (
                    <div key={index} className="text-sm p-1 bg-muted/50 rounded">
                      {factor}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
          
          {/* Options */}
          <div>
            <h3 className="text-md font-semibold mb-2">Options</h3>
            <div className="space-y-3">
              {options.map((option) => (
                <div 
                  key={option.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer ${
                    option.selected 
                      ? "border-primary bg-primary/10" 
                      : option.text === recommendation.recommendation
                        ? "border-primary/30 bg-primary/5"
                        : "border-muted hover:border-primary/50"
                  }`}
                  onClick={() => onOptionSelect(option.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{option.text}</p>
                      {option.text === recommendation.recommendation && (
                        <p className="text-xs text-primary mt-1">AI Recommended</p>
                      )}
                      
                      {/* Pros and Cons */}
                      {(option.pros.length > 0 || option.cons.length > 0) && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {option.pros.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-green-600 flex items-center">
                                <Plus className="h-3 w-3 mr-1" />
                                Pros
                              </p>
                              <ul className="text-xs mt-1 list-disc list-inside text-green-600">
                                {option.pros.map((pro, index) => (
                                  <li key={index} className="text-green-600/80">{pro}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {option.cons.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-red-600 flex items-center">
                                <Minus className="h-3 w-3 mr-1" />
                                Cons
                              </p>
                              <ul className="text-xs mt-1 list-disc list-inside text-red-600">
                                {option.cons.map((con, index) => (
                                  <li key={index} className="text-red-600/80">{con}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            {onNew && (
              <Button variant="outline" onClick={onNew} disabled={isProcessing}>
                <RefreshCw className="mr-2 h-4 w-4" />
                New Decision
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-1" />
              Helpful
            </Button>
            <Button variant="outline" size="sm">
              <ThumbsDown className="h-4 w-4 mr-1" />
              Not Helpful
            </Button>
            <Button onClick={onSave} disabled={isProcessing}>
              {isProcessing ? "Saving..." : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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