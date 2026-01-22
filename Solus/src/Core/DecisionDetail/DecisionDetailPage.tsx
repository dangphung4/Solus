import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Zap,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Award,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  MessageSquare,
  Heart,
  Scale,
  Share2,
  Copy,
  MoreHorizontal,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getDecision } from "@/db/Decision/decisionDb";
import { createReflection } from "@/db/Reflection/reflectionDb";
import { Decision } from "@/db/types/Decision";
import { DecisionCategory, DecisionStatus } from "@/db/types/BaseDecision";
import { ReflectionOutcome, LearningType } from "@/db/types/Reflection";

export default function DecisionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // State
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reflection form state
  const [showReflectionForm, setShowReflectionForm] = useState(false);
  const [reflectionContent, setReflectionContent] = useState("");
  const [reflectionOutcome, setReflectionOutcome] = useState<ReflectionOutcome | null>(null);
  const [isSavingReflection, setIsSavingReflection] = useState(false);

  // UI state
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());

  // Load decision
  useEffect(() => {
    const loadDecision = async () => {
      if (!id) {
        setError("Decision ID not provided");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const decisionData = await getDecision(id);
        if (!decisionData) {
          setError("Decision not found");
        } else {
          setDecision(decisionData);
          // Expand the selected option by default
          const selectedOpt = decisionData.options.find(o => o.selected);
          if (selectedOpt) {
            setExpandedOptions(new Set([selectedOpt.id]));
          }
        }
      } catch (err) {
        console.error("Error loading decision:", err);
        setError("Failed to load decision. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDecision();
  }, [id]);

  // Toggle option expansion
  const toggleOptionExpand = (optionId: string) => {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  };

  // Format date - relative
  const formatRelativeDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: days > 365 ? "numeric" : undefined,
    }).format(new Date(date));
  };

  // Format date - full
  const formatFullDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  // Get status badge
  const getStatusBadge = (status: DecisionStatus) => {
    switch (status) {
      case DecisionStatus.COMPLETED:
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Completed</Badge>;
      case DecisionStatus.IN_PROGRESS:
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">In Progress</Badge>;
      case DecisionStatus.DRAFT:
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20">Draft</Badge>;
      case DecisionStatus.IMPLEMENTED:
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20">Implemented</Badge>;
      case DecisionStatus.ARCHIVED:
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get category info
  const getCategoryInfo = (category: DecisionCategory) => {
    const categoryMap: Record<DecisionCategory, { name: string; emoji: string }> = {
      [DecisionCategory.CAREER]: { name: "Career", emoji: "💼" },
      [DecisionCategory.FOOD]: { name: "Food", emoji: "🍽️" },
      [DecisionCategory.ENTERTAINMENT]: { name: "Entertainment", emoji: "🎬" },
      [DecisionCategory.RELATIONSHIP]: { name: "Relationship", emoji: "❤️" },
      [DecisionCategory.FINANCE]: { name: "Finance", emoji: "💰" },
      [DecisionCategory.HEALTH]: { name: "Health", emoji: "🏥" },
      [DecisionCategory.TRAVEL]: { name: "Travel", emoji: "✈️" },
      [DecisionCategory.SHOPPING]: { name: "Shopping", emoji: "🛍️" },
      [DecisionCategory.EDUCATION]: { name: "Education", emoji: "📚" },
      [DecisionCategory.LIFESTYLE]: { name: "Lifestyle", emoji: "🏠" },
      [DecisionCategory.TECHNOLOGY]: { name: "Technology", emoji: "💻" },
      [DecisionCategory.OTHER]: { name: "Other", emoji: "📌" },
    };
    return categoryMap[category] || { name: category, emoji: "📌" };
  };

  // Share decision
  const handleShare = async () => {
    if (!decision) return;

    const selectedOption = decision.options.find((o) => o.selected);
    const shareText = `Decision: ${decision.title}\n\nChosen: ${selectedOption?.text || "Not yet decided"}\n\n${decision.recommendation ? `AI Recommendation: ${decision.recommendation}` : ""}\n\nMade with Solus`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Decision: ${decision.title}`,
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied to clipboard!");
    }
  };

  // Copy link
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Save reflection
  const handleSaveReflection = async () => {
    if (!currentUser || !decision || !reflectionOutcome) return;

    setIsSavingReflection(true);
    try {
      await createReflection({
        userId: currentUser.uid,
        decisionId: decision.id,
        decisionType: decision.type,
        decisionCategory: decision.category,
        outcome: reflectionOutcome,
        reflectionText: reflectionContent,
        learnings: [{
          type: LearningType.INSIGHT,
          description: reflectionContent,
        }],
        wouldRepeat: reflectionOutcome === ReflectionOutcome.SATISFIED || reflectionOutcome === ReflectionOutcome.VERY_SATISFIED,
      });

      toast.success("Reflection saved", {
        description: "Your reflection has been added to this decision.",
      });

      setShowReflectionForm(false);
      setReflectionContent("");
      setReflectionOutcome(null);
    } catch (err) {
      console.error("Error saving reflection:", err);
      toast.error("Failed to save reflection", {
        description: "Please try again.",
      });
    } finally {
      setIsSavingReflection(false);
    }
  };

  // Calculate confidence score
  const getConfidenceScore = () => {
    if (!decision) return 0;
    const selectedOption = decision.options.find((o) => o.selected);
    if (!selectedOption) return 50;

    const prosCount = selectedOption.pros?.length || 0;
    const consCount = selectedOption.cons?.length || 0;
    const total = prosCount + consCount;

    if (total === 0) return 70;
    const ratio = prosCount / total;
    return Math.min(95, Math.max(50, Math.round(ratio * 100)));
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading decision...</p>
        </div>
      </div>
    );
  }

  if (error || !decision) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="max-w-md border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Decision Not Found</h3>
            <p className="text-muted-foreground text-sm mb-6">{error || "The decision you're looking for doesn't exist or has been removed."}</p>
            <Button onClick={() => navigate("/history")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to History
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(decision.category);
  const confidenceScore = getConfidenceScore();
  const selectedOption = decision.options.find((o) => o.selected);

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-5"
        >
          {/* Header */}
          <header className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mt-1 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`p-1.5 rounded-lg ${
                        decision.type === "quick" ? "bg-amber-500/10" : "bg-purple-500/10"
                      }`}
                    >
                      {decision.type === "quick" ? (
                        <Zap className="h-4 w-4 text-amber-600" />
                      ) : (
                        <Brain className="h-4 w-4 text-purple-600" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {decision.type} Decision
                    </span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-bold leading-tight">
                    {decision.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {getStatusBadge(decision.status)}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      {categoryInfo.emoji} {categoryInfo.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatRelativeDate(decision.createdAt)}
                    </span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleShare}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit (Coming Soon)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" disabled>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete (Coming Soon)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Quick Stats */}
          {selectedOption && (
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Your Choice</p>
                      <p className="font-semibold truncate">{selectedOption.text}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={confidenceScore} className="w-16 h-2" />
                      <span className="text-sm font-semibold">{confidenceScore}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Recommendation */}
          {decision.recommendation && (
            <Card className="border-border/50 overflow-hidden">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  AI Recommendation
                  {decision.aiGenerated && (
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="font-medium text-primary mb-2">{decision.recommendation}</p>
                {decision.recommendationReasoning && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {decision.recommendationReasoning}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Options */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" />
                Options Considered
                <Badge variant="outline" className="ml-auto text-xs">
                  {decision.options.length} options
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {decision.options.map((option, idx) => {
                const isExpanded = expandedOptions.has(option.id);
                const hasProsOrCons = (option.pros && option.pros.length > 0) || (option.cons && option.cons.length > 0);

                return (
                  <div
                    key={option.id}
                    className={`rounded-xl border transition-all ${
                      option.selected
                        ? "border-primary/50 bg-primary/5 shadow-sm"
                        : "border-border/50 hover:border-border"
                    }`}
                  >
                    <button
                      onClick={() => hasProsOrCons && toggleOptionExpand(option.id)}
                      className="w-full p-4 text-left"
                      disabled={!hasProsOrCons}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
                              option.selected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className={`font-medium ${option.selected ? "text-primary" : ""}`}>
                              {option.text}
                            </p>
                            {hasProsOrCons && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {option.pros?.length || 0} pros • {option.cons?.length || 0} cons
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {option.selected && (
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                              Chosen
                            </Badge>
                          )}
                          {hasProsOrCons && (
                            isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Expandable Pros/Cons */}
                    <AnimatePresence>
                      {isExpanded && hasProsOrCons && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {option.pros && option.pros.length > 0 && (
                                <div className="bg-green-500/5 rounded-lg p-3">
                                  <h4 className="text-xs font-semibold text-green-600 flex items-center gap-1 mb-2">
                                    <ThumbsUp className="h-3 w-3" />
                                    Pros
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {option.pros.map((pro, i) => (
                                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">+</span>
                                        <span>{typeof pro === 'string' ? pro : pro.text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {option.cons && option.cons.length > 0 && (
                                <div className="bg-red-500/5 rounded-lg p-3">
                                  <h4 className="text-xs font-semibold text-red-600 flex items-center gap-1 mb-2">
                                    <ThumbsDown className="h-3 w-3" />
                                    Cons
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {option.cons.map((con, i) => (
                                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                        <span className="text-red-500 mt-0.5">-</span>
                                        <span>{typeof con === 'string' ? con : con.text}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Context / Description */}
          {decision.description && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {decision.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Values Alignment (Deep Decisions) */}
          {decision.type === "deep" && decision.valuesAlignment && decision.valuesAlignment.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  Values Considered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {decision.valuesAlignment.map((va, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1.5">
                      {va.value}
                      <span className="ml-2 text-primary font-semibold">{va.alignmentScore}/10</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reflection Responses (Deep Decisions) */}
          {decision.type === "deep" && decision.reflectionResponses && decision.reflectionResponses.length > 0 && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Reflection Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {decision.reflectionResponses.map((response, idx) => (
                  <div key={idx} className="border-l-2 border-primary/20 pl-4">
                    <h4 className="font-medium text-sm">{response.question}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {response.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Add Reflection */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Follow-up Reflection
              </CardTitle>
              <CardDescription className="text-xs">
                Track how this decision turned out over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showReflectionForm ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReflectionForm(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Reflection
                </Button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      How did this decision turn out?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { value: ReflectionOutcome.VERY_SATISFIED, label: "Great", icon: ThumbsUp, color: "text-green-600 bg-green-500/10 border-green-500/30" },
                        { value: ReflectionOutcome.SATISFIED, label: "Good", icon: ThumbsUp, color: "text-blue-600 bg-blue-500/10 border-blue-500/30" },
                        { value: ReflectionOutcome.NEUTRAL, label: "Okay", icon: Scale, color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
                        { value: ReflectionOutcome.UNSATISFIED, label: "Regret", icon: ThumbsDown, color: "text-red-600 bg-red-500/10 border-red-500/30" },
                      ].map((outcome) => (
                        <button
                          key={outcome.value}
                          onClick={() => setReflectionOutcome(outcome.value)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            reflectionOutcome === outcome.value
                              ? outcome.color
                              : "border-border/50 hover:border-border"
                          }`}
                        >
                          <outcome.icon className={`h-5 w-5 mx-auto mb-1 ${reflectionOutcome === outcome.value ? "" : "text-muted-foreground"}`} />
                          <span className="text-xs font-medium">{outcome.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      What did you learn?
                    </label>
                    <Textarea
                      placeholder="Share your thoughts, learnings, and insights..."
                      value={reflectionContent}
                      onChange={(e) => setReflectionContent(e.target.value)}
                      className="min-h-24 resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReflectionForm(false);
                        setReflectionContent("");
                        setReflectionOutcome(null);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveReflection}
                      disabled={!reflectionOutcome || !reflectionContent.trim() || isSavingReflection}
                      className="flex-1"
                    >
                      {isSavingReflection ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Reflection"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Timestamps */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Created: {formatFullDate(decision.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Updated: {formatFullDate(decision.updatedAt)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
