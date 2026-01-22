import { useState, useEffect } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { processSpeechInput } from "@/lib/ai/quickDecisionService";
import { ArrowRight, Wand2, Loader2, LightbulbIcon, Mic } from "lucide-react";

type ProcessedOption = {
  text: string;
  pros: string[];
  cons: string[];
};

type ProcessedResult = {
  decisionData: {
    object: {
      title: string;
      category: string;
      options: ProcessedOption[];
      contextFactors?: string[];
    }
  };
  recommendation: {
    recommendation: string;
    reasoning: string;
    fullAnalysis?: string;
  };
};

type ProcessTextProps = {
  onProcessComplete: (result: ProcessedResult) => void;
  initialText?: string;
  onTextChange?: (text: string) => void;
};

export default function ProcessText({ onProcessComplete, initialText = "", onTextChange }: ProcessTextProps) {
  const [inputText, setInputText] = useState(initialText);

  // Update local state when initialText changes from parent
  useEffect(() => {
    if (initialText !== inputText) {
      setInputText(initialText);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialText]);

  const handleTextChange = (text: string) => {
    setInputText(text);
    onTextChange?.(text);
  };
  const [isProcessing, setIsProcessing] = useState(false);
  const [examples] = useState([
    "Should I watch Netflix or go to bed? I'm not tired but have work tomorrow.",
    "I need to decide between going to the gym or meeting friends for dinner. I haven't seen my friends in a while, but I've been neglecting my workout routine.",
    "Should I buy the new phone now or wait for the next model? The current one is still working but getting slow."
  ]);

  const [isDecisionRecording, setIsDecisionRecording] = useState<boolean>(false);
  const { startListening } = useSpeechToText();

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

      if (!result.decisionData?.object || !result.recommendation) {
        throw new Error("Invalid response format from AI service");
      }
      
      if (!result.decisionData.object.options || result.decisionData.object.options.length < 2) {
        toast.error("Insufficient options", {
          description: "The AI couldn't extract enough options from your input. Please provide at least two clear options."
        });
        setIsProcessing(false);
        return;
      }
      
      const recommendationText = result.recommendation.recommendation.toLowerCase();
      const hasMatchingOption = result.decisionData.object.options.some(
        (opt: ProcessedOption) => opt.text.toLowerCase() === recommendationText
      );
      
      if (!hasMatchingOption) {
        const bestMatch = findBestMatchingOption(
          recommendationText,
          result.decisionData.object.options
        );
        
        if (bestMatch) {
          result.recommendation.recommendation = bestMatch.text;
        } else {
          toast.error("Recommendation mismatch", {
            description: "The AI recommendation doesn't match any of the options. Please try rephrasing your input."
          });
          setIsProcessing(false);
          return;
        }
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

  const findBestMatchingOption = (recommendation: string, options: ProcessedOption[]) => {
    if (!options || options.length === 0) return null;
    
    for (const option of options) {
      const optionText = option.text.toLowerCase();
      if (optionText.includes(recommendation) || recommendation.includes(optionText)) {
        return option;
      }
    }
    
    let bestMatch = null;
    let highestOverlap = 0;
    
    for (const option of options) {
      const optionWords = new Set(option.text.toLowerCase().split(/\s+/));
      const recommendationWords = recommendation.split(/\s+/);
      
      let overlap = 0;
      for (const word of recommendationWords) {
        if (optionWords.has(word.toLowerCase()) && word.length > 3) {
          overlap++;
        }
      }
      
      if (overlap > highestOverlap) {
        highestOverlap = overlap;
        bestMatch = option;
      }
    }
    
    return highestOverlap > 1 ? bestMatch : options[0]; 
  };

  const handleMicButtonPress = async () => {
    setIsDecisionRecording(true);
        await startListening(
          () => setIsDecisionRecording(false), 
          (finalText) => {setInputText(finalText);} 
        );
  };

  return (
    <Card className="w-full border-border/50 shadow-lg">
      <CardHeader className="pb-3 space-y-1">
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Wand2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          Describe Your Decision
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Explain your dilemma naturally - include the options you're considering
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={inputText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="e.g., I need to decide between working from home or going to the office tomorrow. At home I'm more comfortable but get distracted, at the office I'm more focused but have a long commute."
            className="min-h-[140px] md:min-h-[180px] resize-none text-sm md:text-base pr-12"
            disabled={isProcessing}
          />
          <Button
            variant={isDecisionRecording ? "destructive" : "ghost"}
            size="icon"
            onClick={() => handleMicButtonPress()}
            className="absolute right-2 top-2 h-9 w-9"
            disabled={isProcessing}
          >
            <Mic className={`h-4 w-4 ${isDecisionRecording ? 'animate-pulse' : ''}`} />
          </Button>
          {isDecisionRecording && (
            <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-red-500">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              Listening...
            </div>
          )}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-md backdrop-blur-sm">
              <div className="text-center px-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm font-medium">Analyzing your decision...</p>
                <p className="text-xs text-muted-foreground mt-1">Extracting options and generating recommendation</p>
              </div>
            </div>
          )}
        </div>

        {/* Examples - scrollable on mobile */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <LightbulbIcon className="h-3.5 w-3.5 text-amber-500" />
            Try an example:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExample(example)}
                className="text-xs h-auto py-2 px-3 flex-shrink-0 max-w-[250px] md:max-w-none whitespace-normal text-left"
                disabled={isProcessing}
              >
                <span className="line-clamp-2">{example.length > 50 ? example.substring(0, 50) + '...' : example}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !inputText.trim()}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Analyze Decision
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 