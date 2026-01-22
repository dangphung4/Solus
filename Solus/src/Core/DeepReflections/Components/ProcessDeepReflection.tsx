import { useState } from "react";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { processDeepReflectionInput, ExtractedDeepReflection } from "@/lib/ai/deepReflectionService";
import { ArrowRight, Brain, Loader2, LightbulbIcon, Mic, Sparkles } from "lucide-react";

export interface DeepReflectionResult {
  extractedData: ExtractedDeepReflection;
  analysis: {
    recommendation: string;
    reasoning: string;
    keyInsights: string[];
    cautionaryNotes: string[];
    nextSteps: string[];
  };
}

interface ProcessDeepReflectionProps {
  onProcessComplete: (result: DeepReflectionResult) => void;
}

export default function ProcessDeepReflection({ onProcessComplete }: ProcessDeepReflectionProps) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { startListening } = useSpeechToText();

  const examples = [
    "I'm deciding whether to accept a new job offer that pays 30% more but requires relocating away from family. My current job is stable but has limited growth. I value family time but also want career advancement.",
    "Should I go back to school for a master's degree or continue working? I'm worried about the cost and time commitment, but I feel stuck in my current career path. I have a young family to support.",
    "I need to decide whether to buy a house now or continue renting. Interest rates are high, but rent keeps increasing. I value stability but also flexibility to move if opportunities arise."
  ];

  const handleExample = (example: string) => {
    setInputText(example);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast.error("Input required", {
        description: "Please describe your decision first."
      });
      return;
    }

    if (inputText.trim().length < 50) {
      toast.error("More detail needed", {
        description: "Please provide more context about your decision for better analysis."
      });
      return;
    }

    setIsProcessing(true);

    try {
      const result = await processDeepReflectionInput(inputText);

      if (!result.extractedData?.options || result.extractedData.options.length < 2) {
        toast.error("Insufficient options", {
          description: "Please describe at least two options you're considering."
        });
        setIsProcessing(false);
        return;
      }

      onProcessComplete(result);
    } catch (error) {
      console.error("Error processing deep reflection:", error);
      toast.error("Processing error", {
        description: "Failed to analyze your input. Please try providing more details."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicButtonPress = async () => {
    setIsRecording(true);
    await startListening(
      () => setIsRecording(false),
      (finalText) => {
        setInputText(prev => prev ? `${prev} ${finalText}` : finalText);
      }
    );
  };

  return (
    <Card className="w-full border-border/50 shadow-lg">
      <CardHeader className="pb-3 space-y-1">
        <CardTitle className="text-lg md:text-xl flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Brain className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          Describe Your Decision
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Share the important decision you're facing - include options, values, and context
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Example: I'm trying to decide whether to accept a promotion that would require moving to another city. On one hand, it's a great career opportunity with better pay. On the other hand, my partner has a job they love here, and we're close to family..."
            className="min-h-[160px] md:min-h-[200px] resize-none text-sm md:text-base pr-12"
            disabled={isProcessing}
          />
          <Button
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            onClick={handleMicButtonPress}
            disabled={isProcessing}
            className="absolute right-2 top-2 h-9 w-9"
          >
            <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
          {isRecording && (
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
                <p className="text-xs text-muted-foreground mt-1">
                  Extracting options and generating insights
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
          <span>AI extracts options, identifies values, and provides comprehensive analysis</span>
        </div>

        {/* Examples - scrollable on mobile */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <LightbulbIcon className="h-3.5 w-3.5 text-amber-500" />
            Try an example:
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-col scrollbar-hide">
            {examples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExample(example)}
                className="text-xs h-auto py-2.5 px-3 flex-shrink-0 min-w-[280px] md:min-w-0 md:w-full whitespace-normal text-left justify-start"
                disabled={isProcessing}
              >
                <span className="line-clamp-2">{example}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex-col gap-3">
        <div className="text-xs text-muted-foreground text-center w-full">
          {inputText.length < 50 ? (
            <span className="text-amber-600">
              {50 - inputText.length} more characters needed
            </span>
          ) : (
            <span className="text-green-600">
              Ready for analysis
            </span>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || inputText.trim().length < 50}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
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
