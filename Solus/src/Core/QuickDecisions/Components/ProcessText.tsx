import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { processSpeechInput } from "@/lib/ai/quickDecisionService";
import { ArrowRight, Wand2, Loader2, LightbulbIcon } from "lucide-react";

type ProcessTextProps = {
  onProcessComplete: (result: any) => void;
};

export default function ProcessText({ onProcessComplete }: ProcessTextProps) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [examples] = useState([
    "Should I watch Netflix or go to bed? I'm not tired but have work tomorrow.",
    "I need to decide between going to the gym or meeting friends for dinner. I haven't seen my friends in a while, but I've been neglecting my workout routine.",
    "Should I buy the new phone now or wait for the next model? The current one is still working but getting slow."
  ]);

  const handleExample = (example: string) => {
    setInputText(example);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast.error("Input text required", {
        description: "Please describe your decision first."
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await processSpeechInput(inputText);
      console.log("Process result:", result);
      
      // Validate result has the expected structure
      if (!result.decisionData?.object || !result.recommendation) {
        throw new Error("Invalid response format from AI service");
      }
      
      // Validate we have at least two options
      if (!result.decisionData.object.options || result.decisionData.object.options.length < 2) {
        toast.error("Insufficient options", {
          description: "The AI couldn't extract enough options from your input. Please provide at least two clear options."
        });
        setIsProcessing(false);
        return;
      }
      
      // Check that we have a recommended option that matches one of the options
      const recommendationText = result.recommendation.recommendation.toLowerCase();
      const hasMatchingOption = result.decisionData.object.options.some(
        (opt: any) => opt.text.toLowerCase() === recommendationText
      );
      
      if (!hasMatchingOption) {
        toast.error("Recommendation mismatch", {
          description: "The AI recommendation doesn't match any of the options. Please try rephrasing your input."
        });
        setIsProcessing(false);
        return;
      }
      
      onProcessComplete(result);
    } catch (error) {
      console.error("Error processing text:", error);
      toast.error("Processing error", {
        description: "Failed to process your input. Please try providing more details about your options."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full border-primary/10 shadow-md transition-all hover:shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-background">
        <CardTitle className="text-xl flex items-center">
          <Wand2 className="h-5 w-5 mr-2 text-primary" />
          Describe Your Decision
        </CardTitle>
        <CardDescription>
          Explain your decision dilemma in natural language, including options and any important context
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g., I need to decide between working from home or going to the office tomorrow. At home I'm more comfortable but get distracted, at the office I'm more focused but have a long commute."
            className="min-h-[180px] md:min-h-[200px] resize-none transition-all focus:border-primary focus:ring-primary"
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-md">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Processing your decision...</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2 animate-fadeIn">
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <LightbulbIcon className="h-4 w-4 text-yellow-500" />
            Try these examples:
          </p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={() => handleExample(example)}
                className="text-xs whitespace-normal text-left h-auto py-2 flex-grow md:flex-grow-0 transition-all hover:bg-primary/5 hover:border-primary/30"
                disabled={isProcessing}
              >
                {example.length > 40 ? example.substring(0, 40) + '...' : example}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 bg-gradient-to-r from-background to-primary/5">
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing || !inputText.trim()} 
          className="w-full md:w-auto ml-auto transition-all hover:bg-primary/90"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Process Decision
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 