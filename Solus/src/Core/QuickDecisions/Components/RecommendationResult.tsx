import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ThumbsUp,
  ThumbsDown,
  Save,
  Plus,
  Minus,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  CheckCheck,
  Share2,
  Copy,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Info,
} from "lucide-react";
import { DecisionCategory } from "@/db/types/BaseDecision";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { motion, AnimatePresence } from "framer-motion";

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
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(null);
  const [expandedOption, setExpandedOption] = useState<string | null>(null);

  // Calculate confidence score based on pros/cons balance
  const getConfidenceScore = () => {
    const recommendedOption = options.find(
      (opt) => opt.text.toLowerCase() === recommendation.recommendation.toLowerCase()
    );
    if (!recommendedOption) return 75;

    const prosCount = recommendedOption.pros.length;
    const consCount = recommendedOption.cons.length;
    const total = prosCount + consCount;
    if (total === 0) return 70;

    const ratio = prosCount / total;
    return Math.min(95, Math.max(60, Math.round(ratio * 100)));
  };

  const confidenceScore = getConfidenceScore();

  const getConfidenceLabel = () => {
    if (confidenceScore >= 85) return { text: "High Confidence", color: "text-green-600" };
    if (confidenceScore >= 70) return { text: "Moderate Confidence", color: "text-amber-600" };
    return { text: "Consider Carefully", color: "text-orange-600" };
  };

  const handleFeedback = (type: "helpful" | "unhelpful") => {
    setFeedback(type);
    toast.success(
      type === "helpful"
        ? "Thanks for your feedback!"
        : "Thanks for your feedback. We'll improve our recommendations."
    );
  };

  const handleShare = async () => {
    const selectedOption = options.find((opt) => opt.selected);
    const shareText = `Decision: ${title}\n\nRecommendation: ${recommendation.recommendation}\n\nMy choice: ${selectedOption?.text || "Not yet decided"}\n\nMade with Solus`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Decision: ${title}`,
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!", {
        description: "Share your decision with others",
      });
    }
  };

  const handleCopyReasoning = async () => {
    await navigator.clipboard.writeText(
      `${recommendation.recommendation}\n\n${recommendation.reasoning}`
    );
    toast.success("Reasoning copied!");
  };

  const toggleOptionExpand = (id: string) => {
    setExpandedOption(expandedOption === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Main Recommendation Card */}
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        {/* Gradient Header */}
        <div className="h-1.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

        <CardHeader className="pb-3 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {category}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-xs bg-primary/10 text-primary"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Quick Decision
                </Badge>
              </div>
              <CardTitle className="text-lg md:text-xl leading-tight">
                {title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 pt-0">
          {/* AI Recommendation Box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-purple-500/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">
                AI Recommendation
              </span>
            </div>

            <p className="text-lg md:text-xl font-bold mb-4">
              {recommendation.recommendation}
            </p>

            {/* Confidence Meter */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Confidence
                </span>
                <span className={`font-medium ${getConfidenceLabel().color}`}>
                  {getConfidenceLabel().text} ({confidenceScore}%)
                </span>
              </div>
              <Progress value={confidenceScore} className="h-2" />
            </div>

            {/* Reasoning */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Why this choice?
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleCopyReasoning}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <MarkdownRenderer
                content={recommendation.reasoning}
                className="text-sm text-muted-foreground"
              />
            </div>

            {/* Full Analysis Toggle */}
            {recommendation.fullAnalysis && (
              <div className="mt-4 pt-3 border-t border-primary/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullAnalysis(!showFullAnalysis)}
                  className="p-0 h-auto text-primary hover:text-primary/80"
                >
                  {showFullAnalysis ? (
                    <ChevronUp className="h-4 w-4 mr-1.5" />
                  ) : (
                    <ChevronDown className="h-4 w-4 mr-1.5" />
                  )}
                  {showFullAnalysis ? "Hide" : "Show"} detailed analysis
                </Button>

                <AnimatePresence>
                  {showFullAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 text-sm text-muted-foreground p-3 border rounded-lg bg-background/50"
                    >
                      <MarkdownRenderer
                        content={recommendation.fullAnalysis}
                        className="text-sm text-muted-foreground"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Context Factors */}
          {contextFactors.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Context Considered
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {contextFactors.map((factor, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {factor}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Options Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Choose Your Option</h3>
              <span className="text-xs text-muted-foreground">
                Tap to select
              </span>
            </div>

            <div className="space-y-2">
              {options.map((option) => {
                const isRecommended =
                  option.text.toLowerCase() ===
                  recommendation.recommendation.toLowerCase();
                const isExpanded = expandedOption === option.id;
                const hasProsOrCons =
                  option.pros.length > 0 || option.cons.length > 0;

                return (
                  <motion.div
                    key={option.id}
                    layout
                    className={`rounded-xl border-2 overflow-hidden transition-all ${
                      option.selected
                        ? "border-primary bg-primary/5 shadow-md"
                        : isRecommended
                        ? "border-primary/40 bg-primary/5"
                        : "border-muted hover:border-primary/30"
                    }`}
                  >
                    {/* Option Header - Always Clickable */}
                    <button
                      onClick={() => onOptionSelect(option.id)}
                      className="w-full p-3 md:p-4 text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                              option.selected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                            }`}
                          >
                            {option.selected && (
                              <CheckCheck className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <span
                            className={`font-medium truncate ${
                              option.selected ? "text-primary" : ""
                            }`}
                          >
                            {option.text}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {isRecommended && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/30 hidden sm:flex"
                            >
                              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                              Best
                            </Badge>
                          )}
                          {hasProsOrCons && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleOptionExpand(option.id);
                              }}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expandable Pros/Cons */}
                    <AnimatePresence>
                      {isExpanded && hasProsOrCons && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-border/50"
                        >
                          <div className="p-3 grid grid-cols-2 gap-2">
                            {/* Pros */}
                            {option.pros.length > 0 && (
                              <div className="bg-green-500/10 p-2 rounded-lg">
                                <p className="text-[10px] font-semibold text-green-600 flex items-center gap-1 mb-1.5">
                                  <Plus className="h-3 w-3" />
                                  Pros
                                </p>
                                <ul className="space-y-1">
                                  {option.pros.map((pro, idx) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-green-700 dark:text-green-300"
                                    >
                                      • {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Cons */}
                            {option.cons.length > 0 && (
                              <div className="bg-red-500/10 p-2 rounded-lg">
                                <p className="text-[10px] font-semibold text-red-600 flex items-center gap-1 mb-1.5">
                                  <Minus className="h-3 w-3" />
                                  Cons
                                </p>
                                <ul className="space-y-1">
                                  {option.cons.map((con, idx) => (
                                    <li
                                      key={idx}
                                      className="text-xs text-red-700 dark:text-red-300"
                                    >
                                      • {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>

        {/* Footer Actions */}
        <CardFooter className="flex flex-col gap-3 pt-4 border-t bg-muted/30">
          {/* Primary Actions */}
          <div className="flex w-full gap-2">
            <Button
              onClick={onSave}
              disabled={isProcessing || !options.some((opt) => opt.selected)}
              className="flex-1"
              size="lg"
            >
              {isProcessing ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Decision
                </>
              )}
            </Button>
            {onNew && (
              <Button
                variant="outline"
                onClick={onNew}
                disabled={isProcessing}
                size="lg"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Feedback Row */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs text-muted-foreground">
              Was this helpful?
            </span>
            <div className="flex gap-1">
              <Button
                variant={feedback === "helpful" ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-3 ${
                  feedback === "helpful"
                    ? "bg-green-600 hover:bg-green-700"
                    : "hover:bg-green-500/10 hover:text-green-600"
                }`}
                onClick={() => handleFeedback("helpful")}
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                Yes
              </Button>
              <Button
                variant={feedback === "unhelpful" ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-3 ${
                  feedback === "unhelpful"
                    ? "bg-red-600 hover:bg-red-700"
                    : "hover:bg-red-500/10 hover:text-red-600"
                }`}
                onClick={() => handleFeedback("unhelpful")}
              >
                <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                No
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Quick Tip Card */}
      <Card className="border-dashed bg-muted/30">
        <CardContent className="p-3 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500/10 flex-shrink-0">
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-medium mb-0.5">Follow up later</p>
            <p className="text-xs text-muted-foreground">
              After saving, you can add a reflection to track how this decision
              turned out.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
