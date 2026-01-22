import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Lightbulb,
  Heart,
  Plus,
  Award,
  Sparkles,
  Loader2,
  Edit3,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Save,
  RotateCcw,
  Zap,
  Clock,
  Target,
  Shield,
  Users,
  Share2,
  Copy,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createDeepDecision } from "@/db/Decision/Deep/deepDecisionDb";
import { DecisionCategory, DecisionStatus } from "@/db/types/BaseDecision";
import ProcessDeepReflection, { DeepReflectionResult } from "./Components/ProcessDeepReflection";
import { generateDeepAnalysis } from "@/lib/ai/deepReflectionService";

// Interface for local option state
interface LocalOption {
  id: number;
  text: string;
  pros: string[];
  cons: string[];
  valuesAlignment: number;
}

type ViewState = "input" | "review" | "results";

export default function DeepReflectionsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // View state
  const [viewState, setViewState] = useState<ViewState>("input");

  // Loading and saving states
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [savedDecisionId, setSavedDecisionId] = useState<string | null>(null);

  // Data states
  const [decisionTitle, setDecisionTitle] = useState("");
  const [decisionDescription, setDecisionDescription] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [importance, setImportance] = useState("");
  const [options, setOptions] = useState<LocalOption[]>([]);
  const [personalValues, setPersonalValues] = useState<string[]>([]);
  const [emotionalContext, setEmotionalContext] = useState("");
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [potentialBiases, setPotentialBiases] = useState<string[]>([]);

  // Analysis results
  const [recommendation, setRecommendation] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [keyInsights, setKeyInsights] = useState<string[]>([]);
  const [cautionaryNotes, setCautionaryNotes] = useState<string[]>([]);
  const [nextSteps, setNextSteps] = useState<string[]>([]);

  // UI states
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());

  // Handle AI processing complete
  const handleProcessComplete = (result: DeepReflectionResult) => {
    const { extractedData, analysis } = result;

    // Set extracted data
    setDecisionTitle(extractedData.title);
    setDecisionDescription(extractedData.description);
    setTimeframe(extractedData.timeframe || "");
    setImportance(extractedData.importance);
    setOptions(
      extractedData.options.map((opt, idx) => ({
        id: idx + 1,
        text: opt.text,
        pros: opt.pros,
        cons: opt.cons,
        valuesAlignment: opt.valuesAlignment,
      }))
    );
    setPersonalValues(extractedData.personalValues);
    setEmotionalContext(extractedData.emotionalContext || "");
    setStakeholders(extractedData.stakeholders || []);
    setPotentialBiases(extractedData.potentialBiases || []);

    // Set analysis
    setRecommendation(analysis.recommendation);
    setReasoning(analysis.reasoning);
    setKeyInsights(analysis.keyInsights);
    setCautionaryNotes(analysis.cautionaryNotes);
    setNextSteps(analysis.nextSteps);

    // Expand first option by default
    setExpandedOptions(new Set([1]));

    // Move to review state
    setViewState("review");
  };

  // Toggle option expansion
  const toggleOptionExpand = (id: number) => {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Handlers for editing options
  const handleOptionTextChange = (id: number, value: string) => {
    setOptions(options.map((option) => (option.id === id ? { ...option, text: value } : option)));
  };

  const handleProChange = (optionId: number, index: number, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? { ...option, pros: option.pros.map((pro, i) => (i === index ? value : pro)) }
          : option
      )
    );
  };

  const handleConChange = (optionId: number, index: number, value: string) => {
    setOptions(
      options.map((option) =>
        option.id === optionId
          ? { ...option, cons: option.cons.map((con, i) => (i === index ? value : con)) }
          : option
      )
    );
  };

  const handleAddPro = (optionId: number) => {
    setOptions(
      options.map((option) =>
        option.id === optionId ? { ...option, pros: [...option.pros, ""] } : option
      )
    );
  };

  const handleAddCon = (optionId: number) => {
    setOptions(
      options.map((option) =>
        option.id === optionId ? { ...option, cons: [...option.cons, ""] } : option
      )
    );
  };

  const handleRemovePro = (optionId: number, index: number) => {
    setOptions(
      options.map((option) =>
        option.id === optionId && option.pros.length > 1
          ? { ...option, pros: option.pros.filter((_, i) => i !== index) }
          : option
      )
    );
  };

  const handleRemoveCon = (optionId: number, index: number) => {
    setOptions(
      options.map((option) =>
        option.id === optionId && option.cons.length > 1
          ? { ...option, cons: option.cons.filter((_, i) => i !== index) }
          : option
      )
    );
  };

  const handleAlignmentChange = (optionId: number, value: number[]) => {
    setOptions(
      options.map((option) => (option.id === optionId ? { ...option, valuesAlignment: value[0] } : option))
    );
  };

  const handleAddOption = () => {
    setOptions([
      ...options,
      {
        id: options.length + 1,
        text: "",
        pros: [""],
        cons: [""],
        valuesAlignment: 50,
      },
    ]);
  };

  const handleRemoveOption = (id: number) => {
    if (options.length > 2) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...personalValues];
    newValues[index] = value;
    setPersonalValues(newValues);
  };

  const handleAddValue = () => {
    setPersonalValues([...personalValues, ""]);
  };

  const handleRemoveValue = (index: number) => {
    if (personalValues.length > 1) {
      setPersonalValues(personalValues.filter((_, i) => i !== index));
    }
  };

  // Regenerate analysis with updated data
  const handleRegenerateAnalysis = async () => {
    setIsRegenerating(true);
    try {
      const analysis = await generateDeepAnalysis(
        decisionTitle,
        options.map((opt) => ({
          text: opt.text,
          pros: opt.pros.filter((p) => p.trim()),
          cons: opt.cons.filter((c) => c.trim()),
          valuesAlignment: opt.valuesAlignment,
        })),
        personalValues.filter((v) => v.trim()),
        emotionalContext,
        stakeholders.filter((s) => s.trim()),
        potentialBiases.filter((b) => b.trim())
      );

      setRecommendation(analysis.recommendation);
      setReasoning(analysis.reasoning);
      setKeyInsights(analysis.keyInsights);
      setCautionaryNotes(analysis.cautionaryNotes);
      setNextSteps(analysis.nextSteps);

      toast.success("Analysis updated", {
        description: "Your analysis has been regenerated with your changes.",
      });
    } catch (error) {
      console.error("Error regenerating analysis:", error);
      toast.error("Failed to regenerate", {
        description: "Please try again.",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  // Proceed to results
  const handleProceedToResults = () => {
    setViewState("results");
  };

  // Save decision
  const handleSaveDecision = async () => {
    if (!currentUser) {
      toast.error("Please sign in", {
        description: "You need to be signed in to save your reflection.",
      });
      return;
    }

    setIsSaving(true);
    try {
      const formattedOptions = options.map((opt, idx) => ({
        id: `option-${idx + 1}`,
        text: opt.text,
        selected: recommendation.toLowerCase().includes(opt.text.toLowerCase()),
        pros: opt.pros.filter((p) => p.trim()).map((p) => ({ text: p, weight: 5 })),
        cons: opt.cons.filter((c) => c.trim()).map((c) => ({ text: c, weight: 5 })),
      }));

      const valuesAlignment = personalValues.filter((v) => v.trim()).map((value) => ({
        value,
        alignmentScore: Math.round(
          options.reduce((sum, opt) => sum + opt.valuesAlignment, 0) / options.length / 10
        ),
      }));

      const deepDecision = await createDeepDecision({
        userId: currentUser.uid,
        title: decisionTitle,
        description: decisionDescription,
        category: DecisionCategory.OTHER,
        status: DecisionStatus.COMPLETED,
        aiGenerated: true,
        type: "deep",
        options: formattedOptions,
        valuesAlignment,
        futureScenarios: [],
        identifiedBiases: potentialBiases.filter((b) => b.trim()),
        reflectionResponses: [
          { question: "Emotional Context", answer: emotionalContext },
          { question: "Decision Timeframe", answer: timeframe },
          { question: "Key Insights", answer: keyInsights.join("; ") },
        ],
        recommendation,
        recommendationReasoning: reasoning,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setSavedDecisionId(deepDecision.id);
      toast.success("Reflection saved!", {
        description: "Your deep reflection has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving decision:", error);
      toast.error("Failed to save", {
        description: "There was an error saving your reflection. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form
  const handleStartNew = () => {
    setViewState("input");
    setDecisionTitle("");
    setDecisionDescription("");
    setTimeframe("");
    setImportance("");
    setOptions([]);
    setPersonalValues([]);
    setEmotionalContext("");
    setStakeholders([]);
    setPotentialBiases([]);
    setRecommendation("");
    setReasoning("");
    setKeyInsights([]);
    setCautionaryNotes([]);
    setNextSteps([]);
    setSavedDecisionId(null);
    setExpandedOptions(new Set());
  };

  // Share results
  const handleShare = async () => {
    const shareText = `Decision: ${decisionTitle}\n\nRecommendation: ${recommendation}\n\nKey Insights:\n${keyInsights.map((i) => `• ${i}`).join("\n")}\n\nMade with Solus`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Decision: ${decisionTitle}`,
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

  // Copy reasoning
  const handleCopyReasoning = async () => {
    await navigator.clipboard.writeText(`${recommendation}\n\n${reasoning}`);
    toast.success("Reasoning copied!");
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Get best option for display
  const getBestOption = () => {
    return options.find((opt) =>
      recommendation.toLowerCase().includes(opt.text.toLowerCase())
    ) || options.reduce((best, current) =>
      current.valuesAlignment > best.valuesAlignment ? current : best
    , options[0]);
  };

  // Calculate overall confidence
  const getOverallConfidence = () => {
    if (options.length === 0) return 0;
    const bestOption = getBestOption();
    if (!bestOption) return 70;
    return Math.min(95, Math.max(60, bestOption.valuesAlignment));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <AnimatePresence mode="wait">
        {/* Input State */}
        {viewState === "input" && (
          <motion.div
            key="input"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="container max-w-6xl mx-auto px-4 py-4 md:py-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Left Column - Main Input */}
              <div className="lg:col-span-8">
                {/* Header */}
                <header className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-lg md:text-xl font-bold">Deep Reflection</h1>
                      <p className="text-xs text-muted-foreground">
                        Comprehensive analysis for complex decisions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span className="hidden sm:inline">AI-Powered</span>
                  </div>
                </header>

                {/* Main Input Card */}
                <ProcessDeepReflection onProcessComplete={handleProcessComplete} />

                {/* Mobile Features Grid */}
                <div className="lg:hidden mt-4 grid grid-cols-2 gap-2">
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="p-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-xs">Values Alignment</span>
                    </CardContent>
                  </Card>
                  <Card className="border-dashed bg-muted/20">
                    <CardContent className="p-3 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-amber-500" />
                      <span className="text-xs">Bias Detection</span>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column - Features (Desktop) */}
              <div className="hidden lg:block lg:col-span-4 space-y-4">
                {/* How it works */}
                <Card className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-3 border-b border-border/50 bg-muted/30">
                      <h3 className="text-xs font-semibold flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        How It Works
                      </h3>
                    </div>
                    <div className="p-3 space-y-3">
                      {[
                        { step: "1", title: "Share your dilemma", desc: "Describe the decision" },
                        { step: "2", title: "AI analyzes", desc: "Options & biases identified" },
                        { step: "3", title: "Review & refine", desc: "Edit before results" },
                        { step: "4", title: "Get guidance", desc: "Insights & next steps" },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-2.5">
                          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <p className="text-xs font-medium">{item.title}</p>
                            <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Target, label: "Values", color: "text-purple-500", bg: "bg-purple-500/10" },
                    { icon: Shield, label: "Biases", color: "text-amber-500", bg: "bg-amber-500/10" },
                    { icon: Users, label: "Stakeholders", color: "text-blue-500", bg: "bg-blue-500/10" },
                    { icon: Clock, label: "Long-term", color: "text-green-500", bg: "bg-green-500/10" },
                  ].map((feature) => (
                    <Card key={feature.label} className="border-dashed bg-muted/20">
                      <CardContent className="p-2.5 flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${feature.bg}`}>
                          <feature.icon className={`h-3.5 w-3.5 ${feature.color}`} />
                        </div>
                        <span className="text-xs font-medium">{feature.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Quick Decision CTA */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-amber-500/5">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span className="text-xs font-medium">Quick decision?</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/quick-decisions")}
                        className="h-7 text-xs gap-1"
                      >
                        Quick Mode
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review State */}
        {viewState === "review" && (
          <motion.div
            key="review"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="container max-w-4xl mx-auto px-4 py-4 md:py-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setViewState("input")}>
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Badge variant="secondary" className="text-xs">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Review Mode
                </Badge>
              </div>
              <Button onClick={handleProceedToResults} size="sm">
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                View Results
              </Button>
            </div>

            <div className="space-y-4">
              {/* Decision Overview Card */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Decision Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Title</label>
                    <Input
                      value={decisionTitle}
                      onChange={(e) => setDecisionTitle(e.target.value)}
                      className="mt-1 h-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Timeframe</label>
                      <Input
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        placeholder="When to decide?"
                        className="mt-1 h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Importance</label>
                      <Input
                        value={importance}
                        onChange={(e) => setImportance(e.target.value)}
                        placeholder="Why important?"
                        className="mt-1 h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Options Card */}
              <Card className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      Options ({options.length})
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={handleAddOption} className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {options.map((option, idx) => {
                    const isExpanded = expandedOptions.has(option.id);
                    const isRecommended = recommendation.toLowerCase().includes(option.text.toLowerCase());

                    return (
                      <div
                        key={option.id}
                        className={`border rounded-lg overflow-hidden transition-all ${
                          isRecommended ? "border-primary/50 bg-primary/5" : "border-border/50"
                        }`}
                      >
                        {/* Option Header */}
                        <div className="p-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5">
                            {idx + 1}
                          </Badge>
                          <Input
                            value={option.text}
                            onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                            className="flex-1 h-8 text-sm"
                            placeholder="Describe this option"
                          />
                          {isRecommended && (
                            <Badge className="text-[10px] bg-primary/20 text-primary border-0">
                              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                              Best
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => toggleOptionExpand(option.id)}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                          {options.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveOption(option.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>

                        {/* Expandable Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="border-t border-border/50"
                            >
                              <div className="p-3 space-y-3">
                                {/* Pros/Cons Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                  {/* Pros */}
                                  <div className="bg-green-500/5 p-2.5 rounded-lg space-y-2">
                                    <h4 className="text-xs font-medium text-green-600 flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Pros
                                    </h4>
                                    {option.pros.map((pro, proIdx) => (
                                      <div key={proIdx} className="flex gap-1.5">
                                        <Input
                                          value={pro}
                                          onChange={(e) => handleProChange(option.id, proIdx, e.target.value)}
                                          placeholder={`Pro ${proIdx + 1}`}
                                          className="h-7 text-xs"
                                        />
                                        {option.pros.length > 1 && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => handleRemovePro(option.id, proIdx)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleAddPro(option.id)}
                                      className="h-6 text-xs text-green-600 w-full"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>

                                  {/* Cons */}
                                  <div className="bg-red-500/5 p-2.5 rounded-lg space-y-2">
                                    <h4 className="text-xs font-medium text-red-600 flex items-center gap-1">
                                      <AlertTriangle className="h-3 w-3" />
                                      Cons
                                    </h4>
                                    {option.cons.map((con, conIdx) => (
                                      <div key={conIdx} className="flex gap-1.5">
                                        <Input
                                          value={con}
                                          onChange={(e) => handleConChange(option.id, conIdx, e.target.value)}
                                          placeholder={`Con ${conIdx + 1}`}
                                          className="h-7 text-xs"
                                        />
                                        {option.cons.length > 1 && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => handleRemoveCon(option.id, conIdx)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    ))}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleAddCon(option.id)}
                                      className="h-6 text-xs text-red-600 w-full"
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Add
                                    </Button>
                                  </div>
                                </div>

                                {/* Values Alignment Slider */}
                                <div>
                                  <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-muted-foreground">Values Alignment</span>
                                    <span className="font-medium text-primary">{option.valuesAlignment}%</span>
                                  </div>
                                  <Slider
                                    value={[option.valuesAlignment]}
                                    onValueChange={(value) => handleAlignmentChange(option.id, value)}
                                    max={100}
                                    step={5}
                                    className="w-full"
                                  />
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

              {/* Values & Context Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Values */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-500" />
                      Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {personalValues.map((value, index) => (
                      <div key={index} className="flex gap-1.5">
                        <Input
                          value={value}
                          onChange={(e) => handleValueChange(index, e.target.value)}
                          placeholder={`Value ${index + 1}`}
                          className="h-8 text-sm"
                        />
                        {personalValues.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleRemoveValue(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" onClick={handleAddValue} className="h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Value
                    </Button>
                  </CardContent>
                </Card>

                {/* Emotional Context */}
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Edit3 className="h-4 w-4 text-blue-500" />
                      Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={emotionalContext}
                      onChange={(e) => setEmotionalContext(e.target.value)}
                      placeholder="How are you feeling about this decision?"
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={handleRegenerateAnalysis}
                  disabled={isRegenerating}
                  className="h-9"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Regenerate Analysis
                    </>
                  )}
                </Button>
                <Button onClick={handleProceedToResults} className="h-9">
                  View Results
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results State */}
        {viewState === "results" && (
          <motion.div
            key="results"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="container max-w-3xl mx-auto px-4 py-4 md:py-6"
          >
            {/* Results Card */}
            <Card className="overflow-hidden border-primary/20 shadow-lg">
              {/* Gradient Header */}
              <div className="h-1.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                        <Brain className="h-3 w-3 mr-1" />
                        Deep Reflection
                      </Badge>
                      {savedDecisionId && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Saved
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg md:text-xl leading-tight">
                      {decisionTitle}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setViewState("review")}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Edit
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
                      <Award className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      AI Recommendation
                    </span>
                  </div>

                  <p className="text-lg md:text-xl font-bold mb-4">{recommendation}</p>

                  {/* Confidence & Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-background/50">
                      <div className="text-lg font-bold text-primary">
                        {getOverallConfidence()}%
                      </div>
                      <div className="text-[10px] text-muted-foreground">Alignment</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-background/50">
                      <div className="text-lg font-bold text-green-600">
                        {getBestOption()?.pros.filter((p) => p.trim()).length || 0}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Pros</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-background/50">
                      <div className="text-lg font-bold text-red-600">
                        {getBestOption()?.cons.filter((c) => c.trim()).length || 0}
                      </div>
                      <div className="text-[10px] text-muted-foreground">Cons</div>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Confidence
                      </span>
                      <span className="font-medium text-primary">
                        {getOverallConfidence() >= 80 ? "High" : getOverallConfidence() >= 60 ? "Moderate" : "Consider more"}
                      </span>
                    </div>
                    <Progress value={getOverallConfidence()} className="h-2" />
                  </div>
                </motion.div>

                {/* Analysis */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                      <Brain className="h-4 w-4 text-primary" />
                      Analysis
                    </h3>
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleCopyReasoning}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reasoning}</p>
                </div>

                {/* Key Insights */}
                {keyInsights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Key Insights
                    </h3>
                    <ul className="space-y-1.5">
                      {keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cautionary Notes */}
                {cautionaryNotes.length > 0 && (
                  <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/20">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Things to Watch
                    </h3>
                    <ul className="space-y-1.5">
                      {cautionaryNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                          <span className="text-amber-500">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {nextSteps.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                      <ArrowRight className="h-4 w-4 text-primary" />
                      Next Steps
                    </h3>
                    <ul className="space-y-1.5">
                      {nextSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] mt-0.5 flex-shrink-0">
                            {idx + 1}
                          </Badge>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Values Considered */}
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                    <Heart className="h-4 w-4 text-pink-500" />
                    Values Considered
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {personalValues
                      .filter((v) => v.trim())
                      .map((value, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                          {value}
                        </Badge>
                      ))}
                  </div>
                </div>
              </CardContent>

              {/* Footer Actions */}
              <CardFooter className="flex flex-col gap-2 pt-4 border-t bg-muted/30">
                <div className="flex w-full gap-2">
                  <Button
                    onClick={handleSaveDecision}
                    disabled={isSaving || savedDecisionId !== null}
                    className="flex-1"
                    size="lg"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : savedDecisionId ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Reflection
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleStartNew} size="lg">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                {savedDecisionId && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/decisions/${savedDecisionId}`)}
                    className="w-full text-xs"
                  >
                    View in Decision History
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </CardFooter>
            </Card>

            {/* Tip Card */}
            <Card className="mt-4 border-dashed bg-muted/30">
              <CardContent className="p-3 flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-blue-500/10 flex-shrink-0">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium mb-0.5">Come back later</p>
                  <p className="text-xs text-muted-foreground">
                    Add a follow-up reflection after you've made your decision to track how it turned out.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
