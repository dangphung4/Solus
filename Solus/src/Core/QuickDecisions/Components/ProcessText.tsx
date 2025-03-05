import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MicIcon, SendIcon, SparklesIcon, LoaderIcon } from "lucide-react"; 
import { processSpeechInput } from "@/lib/ai/quickDecisionService";

type ProcessTextProps = {
  onProcessComplete: (result: any) => void;
};

export default function ProcessText({ onProcessComplete }: ProcessTextProps) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [examples] = useState([
    "Should I watch Netflix or go to bed? I'm not tired but have work tomorrow.",
    "Where should I go for dinner tonight? I'm considering Italian or sushi.",
    "Should I buy the new iPhone now or wait for next year's model?"
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="h-5 w-5 text-primary" />
          Process Decision Text
        </CardTitle>
        <CardDescription>
          Describe your decision in natural language and let AI structure it for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Describe your decision in your own words, e.g.: I'm trying to decide between going to the gym or watching a movie tonight..."
          className="min-h-32 transition-all"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isProcessing}
        />
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                onClick={() => handleExample(example)}
                className="text-xs"
                disabled={isProcessing}
              >
                {example.length > 30 ? example.substring(0, 30) + "..." : example}
              </Button>
            ))}
          </div>
        </div>

        <Separator />
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium">How this works:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Describe your decision dilemma in natural language</li>
            <li>AI extracts the key options, pros, and cons</li>
            <li>Get an instant recommendation with reasoning</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          disabled={isProcessing}
          onClick={() => setInputText("")}
        >
          Clear
        </Button>
        <Button
          disabled={isProcessing || !inputText.trim()}
          onClick={handleSubmit}
          className="gap-2"
        >
          {isProcessing ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4" />
              Process Decision
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 