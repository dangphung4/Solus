import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { createQuickDecision } from "@/db/Decision/Quick/quickDecisionDb";
import { getUserDecisions } from "@/db/Decision/decisionDb";
import { processSpeechInput } from "@/lib/ai/quickDecisionService";
import { DecisionCategory, DecisionStatus } from "@/db/types/BaseDecision";
import { Decision } from "@/db/types/Decision";
import RecommendationResult from "./Components/RecommendationResult";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Brain,
  Sparkles,
  ArrowRight,
  Utensils,
  Briefcase,
  Heart,
  Gamepad2,
  DollarSign,
  History,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  MapPin,
  Calendar,
  ChevronDown,
  Dices,
  Users,
  Shuffle,
  Mic,
  Wand2,
  LightbulbIcon,
  X,
} from "lucide-react";

type ViewState = "input" | "results" | "coinflip";

interface ProcessedOption {
  text: string;
  pros: string[];
  cons: string[];
}

interface ProcessedResult {
  decisionData: {
    object: {
      title: string;
      category: string;
      options: ProcessedOption[];
      contextFactors?: string[];
    };
  };
  recommendation: {
    recommendation: string;
    reasoning: string;
    fullAnalysis?: string;
  };
}

interface CategoryTemplate {
  label: string;
  prompt: string;
}

interface CategoryStarter {
  icon: React.ElementType;
  label: string;
  color: string;
  bg: string;
  templates: CategoryTemplate[];
}

// Perspectives for "What would X do?" feature
const PERSPECTIVES = [
  { id: "friend", name: "Best Friend", emoji: "👋", desc: "Someone who knows you well" },
  { id: "future", name: "Future You", emoji: "🔮", desc: "10 years from now" },
  { id: "mentor", name: "Wise Mentor", emoji: "🧙", desc: "Focused on growth" },
  { id: "cautious", name: "Cautious Side", emoji: "🛡️", desc: "Consider the risks" },
  { id: "adventurous", name: "Bold Side", emoji: "🚀", desc: "Embrace opportunity" },
];

export default function QuickDecisionsPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { startListening } = useSpeechToText();

  const [isProcessing, setIsProcessing] = useState(false);
  const [viewState, setViewState] = useState<ViewState>("input");
  const [inputText, setInputText] = useState("");
  const [selectedPerspective, setSelectedPerspective] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Coin flip state
  const [coinFlipOptions, setCoinFlipOptions] = useState<string[]>(["", ""]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<string | null>(null);

  // Decision data
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DecisionCategory>(DecisionCategory.OTHER);
  const [options, setOptions] = useState<
    Array<{
      id: string;
      text: string;
      selected: boolean;
      pros: string[];
      cons: string[];
    }>
  >([]);
  const [contextFactors, setContextFactors] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState<{
    recommendation: string;
    reasoning: string;
    fullAnalysis: string;
  } | null>(null);

  // Recent decisions
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  // Category starters with multiple templates each
  const categoryStarters: CategoryStarter[] = [
    {
      icon: Utensils,
      label: "Food",
      color: "text-orange-500",
      bg: "bg-orange-500/10 hover:bg-orange-500/20",
      templates: [
        { label: "Cook vs Order", prompt: "Should I cook dinner at home or order takeout tonight?" },
        { label: "Healthy vs Comfort", prompt: "Should I eat something healthy or have comfort food?" },
        { label: "Try New vs Familiar", prompt: "Should I try a new restaurant or go to my usual spot?" },
        { label: "Quick vs Proper", prompt: "Should I grab a quick snack or make a proper meal?" },
      ],
    },
    {
      icon: Briefcase,
      label: "Work",
      color: "text-blue-500",
      bg: "bg-blue-500/10 hover:bg-blue-500/20",
      templates: [
        { label: "Home vs Office", prompt: "Should I work from home or go to the office today?" },
        { label: "Meeting vs Focus", prompt: "Should I attend this meeting or focus on my deep work?" },
        { label: "Task Priority", prompt: "Should I work on urgent tasks or important long-term projects?" },
        { label: "Overtime vs Balance", prompt: "Should I work late to finish this or maintain work-life balance?" },
      ],
    },
    {
      icon: Heart,
      label: "Social",
      color: "text-pink-500",
      bg: "bg-pink-500/10 hover:bg-pink-500/20",
      templates: [
        { label: "Go Out vs Stay In", prompt: "Should I go to the party tonight or stay home and relax?" },
        { label: "Call vs Text", prompt: "Should I call this person or just send a text?" },
        { label: "Accept vs Decline", prompt: "Should I accept this invitation or politely decline?" },
        { label: "Small Talk vs Deep", prompt: "Should I keep it casual or have a deeper conversation?" },
      ],
    },
    {
      icon: Gamepad2,
      label: "Fun",
      color: "text-purple-500",
      bg: "bg-purple-500/10 hover:bg-purple-500/20",
      templates: [
        { label: "Movie vs Games", prompt: "Should I watch a movie or play video games tonight?" },
        { label: "Active vs Relax", prompt: "Should I do something active or just relax at home?" },
        { label: "Solo vs Social", prompt: "Should I enjoy some alone time or hang out with friends?" },
        { label: "New vs Rewatch", prompt: "Should I try something new or rewatch my favorite?" },
      ],
    },
    {
      icon: DollarSign,
      label: "Money",
      color: "text-green-500",
      bg: "bg-green-500/10 hover:bg-green-500/20",
      templates: [
        { label: "Buy vs Save", prompt: "Should I buy this now or save the money for later?" },
        { label: "Cheap vs Quality", prompt: "Should I go for the cheaper option or invest in quality?" },
        { label: "Splurge vs Budget", prompt: "Should I treat myself or stick to my budget?" },
        { label: "Pay Off vs Invest", prompt: "Should I pay off debt or invest this money?" },
      ],
    },
    {
      icon: ShoppingBag,
      label: "Shopping",
      color: "text-amber-500",
      bg: "bg-amber-500/10 hover:bg-amber-500/20",
      templates: [
        { label: "Premium vs Budget", prompt: "Should I buy the premium quality item or the budget option?" },
        { label: "Need vs Want", prompt: "Do I really need this or is it just a want?" },
        { label: "Online vs Store", prompt: "Should I order online or go to the store?" },
        { label: "Now vs Wait", prompt: "Should I buy this now or wait for a sale?" },
      ],
    },
    {
      icon: MapPin,
      label: "Travel",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
      templates: [
        { label: "Trip vs Stay", prompt: "Should I take a short trip this weekend or stay home?" },
        { label: "Explore vs Relax", prompt: "Should I explore new places or have a relaxing staycation?" },
        { label: "Drive vs Fly", prompt: "Should I drive or fly to this destination?" },
        { label: "Plan vs Spontaneous", prompt: "Should I plan everything in advance or be spontaneous?" },
      ],
    },
    {
      icon: Calendar,
      label: "Plans",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 hover:bg-indigo-500/20",
      templates: [
        { label: "Today vs Tomorrow", prompt: "Should I do this today or wait until tomorrow?" },
        { label: "Morning vs Evening", prompt: "Should I do this in the morning or evening?" },
        { label: "Commit vs Flexible", prompt: "Should I commit to this plan or keep my options open?" },
        { label: "Start vs Delay", prompt: "Should I start this project now or wait for a better time?" },
      ],
    },
  ];

  useEffect(() => {
    const fetchRecent = async () => {
      if (!currentUser) {
        setLoadingRecent(false);
        return;
      }
      try {
        const decisions = await getUserDecisions(currentUser.uid);
        const quickDecisions = decisions
          .filter((d) => d.type === "quick")
          .slice(0, 5);
        setRecentDecisions(quickDecisions);
      } catch (error) {
        console.error("Error fetching recent decisions:", error);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, [currentUser]);

  const resetForm = () => {
    setViewState("input");
    setTitle("");
    setCategory(DecisionCategory.OTHER);
    setOptions([]);
    setContextFactors([]);
    setAiResponse(null);
    setInputText("");
    setSelectedPerspective(null);
    setFlipResult(null);
    setCoinFlipOptions(["", ""]);
  };

  const handleOptionSelect = (id: string) => {
    setOptions(options.map((opt) => ({ ...opt, selected: opt.id === id })));
  };

  const handleProcessComplete = (result: ProcessedResult) => {
    if (!result.decisionData?.object || !result.recommendation) {
      toast.error("Invalid response", {
        description: "Could not process the decision data correctly.",
      });
      return;
    }

    setTitle(result.decisionData.object.title);
    setCategory(result.decisionData.object.category as DecisionCategory);

    const formattedOptions = result.decisionData.object.options.map(
      (opt) => ({
        id: uuidv4(),
        text: opt.text,
        selected: false,
        pros: opt.pros || [],
        cons: opt.cons || [],
      })
    );

    setOptions(formattedOptions);

    if (result.decisionData.object.contextFactors) {
      setContextFactors(result.decisionData.object.contextFactors);
    }

    setAiResponse({
      recommendation: result.recommendation.recommendation,
      reasoning: result.recommendation.reasoning,
      fullAnalysis: result.recommendation.fullAnalysis || "",
    });

    const recommendedOption = formattedOptions.find(
      (opt) =>
        opt.text.toLowerCase() ===
        result.recommendation.recommendation.toLowerCase()
    );

    if (recommendedOption) {
      setOptions(
        formattedOptions.map((opt) => ({
          ...opt,
          selected: opt.id === recommendedOption.id,
        }))
      );
    }

    setViewState("results");
    toast.success("Decision analyzed", {
      description: "Your decision has been processed with AI recommendations!",
    });
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast.error("Input required", {
        description: "Please describe your decision first.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Build the full prompt with perspective if selected
      let fullPrompt = inputText;
      if (selectedPerspective) {
        const perspective = PERSPECTIVES.find(p => p.id === selectedPerspective);
        if (perspective) {
          fullPrompt = `${inputText}\n\nAnalyze this from the perspective of ${perspective.name}: ${perspective.desc}`;
        }
      }

      const result = await processSpeechInput(fullPrompt);

      if (!result.decisionData?.object || !result.recommendation) {
        throw new Error("Invalid response format from AI service");
      }

      if (!result.decisionData.object.options || result.decisionData.object.options.length < 2) {
        toast.error("Insufficient options", {
          description: "Please provide at least two clear options to choose from.",
        });
        setIsProcessing(false);
        return;
      }

      handleProcessComplete(result);
    } catch (error) {
      console.error("Error processing:", error);
      toast.error("Processing error", {
        description: "Failed to process your input. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveDecision = async () => {
    if (!currentUser) {
      toast.error("Sign in required", {
        description: "Please sign in to save your decision.",
      });
      return;
    }

    if (!options.some((opt) => opt.selected)) {
      toast.error("Selection required", {
        description: "Please select an option before saving.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const decisionData = {
        id: uuidv4(),
        userId: currentUser.uid,
        title,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: DecisionStatus.COMPLETED,
        aiGenerated: true,
        type: "quick" as const,
        options: options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          selected: opt.selected,
          pros: opt.pros.length > 0 ? opt.pros : undefined,
          cons: opt.cons.length > 0 ? opt.cons : undefined,
        })),
        contextFactors: contextFactors.length > 0 ? contextFactors : undefined,
        gutFeeling: undefined,
        recommendation: aiResponse?.recommendation || undefined,
        recommendationReasoning: aiResponse?.reasoning || undefined,
        timeSpent: 0,
      };

      await createQuickDecision(decisionData);

      toast.success("Decision saved", {
        description: "Your decision has been saved successfully.",
      });

      navigate("/dashboard");
    } catch {
      toast.error("Save error", {
        description: "Failed to save your decision. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = (prompt: string) => {
    setInputText(prompt);
  };

  const handleMicPress = async () => {
    setIsRecording(true);
    await startListening(
      () => setIsRecording(false),
      (finalText) => setInputText(finalText)
    );
  };

  // Coin flip / random picker
  const handleCoinFlip = () => {
    const validOptions = coinFlipOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      toast.error("Need at least 2 options", {
        description: "Please enter at least two options to pick from.",
      });
      return;
    }

    setIsFlipping(true);
    setFlipResult(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * validOptions.length);
      setFlipResult(validOptions[randomIndex]);
      setIsFlipping(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <AnimatePresence mode="wait">
        {/* Main Input View */}
        {viewState === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto px-4 py-6 md:py-8"
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">Quick Decision</h1>
                  <p className="text-sm text-muted-foreground">
                    AI-powered analysis in ~30 seconds
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewState("coinflip")}
                  className="gap-1.5"
                >
                  <Dices className="h-4 w-4" />
                  <span className="hidden sm:inline">Random Pick</span>
                </Button>
              </div>
            </header>

            {/* Main Content Card */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  Describe Your Decision
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explain your dilemma naturally - include the options you're considering
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Main Textarea */}
                <div className="relative">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g., Should I cook dinner at home or order takeout? I'm tired but trying to save money and eat healthier..."
                    className="min-h-[160px] md:min-h-[200px] resize-none text-base pr-14 leading-relaxed"
                    disabled={isProcessing}
                  />
                  <Button
                    variant={isRecording ? "destructive" : "ghost"}
                    size="icon"
                    onClick={handleMicPress}
                    className="absolute right-3 top-3 h-10 w-10"
                    disabled={isProcessing}
                  >
                    <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
                  </Button>
                  {isRecording && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 text-sm text-red-500">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      Listening...
                    </div>
                  )}
                </div>

                {/* Perspective Selection - Inline chips */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Get a perspective:</span>
                    {selectedPerspective && (
                      <button
                        onClick={() => setSelectedPerspective(null)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PERSPECTIVES.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPerspective(selectedPerspective === p.id ? null : p.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedPerspective === p.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        }`}
                      >
                        <span>{p.emoji}</span>
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Templates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LightbulbIcon className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Or try a template:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryStarters.map((cat) => (
                      <DropdownMenu key={cat.label}>
                        <DropdownMenuTrigger asChild>
                          <button
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${cat.bg}`}
                          >
                            <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
                            <span>{cat.label}</span>
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-72">
                          <DropdownMenuLabel className="flex items-center gap-2">
                            <cat.icon className={`h-4 w-4 ${cat.color}`} />
                            {cat.label} Templates
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {cat.templates.map((template) => (
                            <DropdownMenuItem
                              key={template.label}
                              onClick={() => handleTemplateSelect(template.prompt)}
                              className="flex flex-col items-start py-2.5 cursor-pointer"
                            >
                              <span className="font-medium">{template.label}</span>
                              <span className="text-xs text-muted-foreground mt-0.5">
                                {template.prompt}
                              </span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isProcessing || !inputText.trim()}
                  className="w-full h-12 text-base"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Analyze Decision
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg backdrop-blur-sm">
                    <div className="text-center px-4">
                      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                      <p className="font-medium">Analyzing your decision...</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Extracting options and generating recommendation
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom Section - Recent & Deep CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Recent Decisions */}
              {currentUser && (
                <Card className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      Recent Decisions
                      {recentDecisions.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate("/history")}
                          className="h-6 text-xs px-2 ml-auto"
                        >
                          View all
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {loadingRecent ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : recentDecisions.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No decisions yet. Make your first one above!
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {recentDecisions.slice(0, 3).map((decision) => (
                          <button
                            key={decision.id}
                            onClick={() => navigate(`/decisions/${decision.id}`)}
                            className="w-full text-left p-2.5 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{decision.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(decision.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Deep Reflection CTA */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                      <Brain className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">Need deeper analysis?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        For complex decisions with values alignment, bias detection, and long-term thinking.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/deep-reflections")}
                        className="gap-1.5"
                      >
                        Try Deep Reflection
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Coin Flip / Random Picker View */}
        {viewState === "coinflip" && (
          <motion.div
            key="coinflip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto px-4 py-8"
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto p-3 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 w-fit mb-3">
                  <Dices className="h-8 w-8 text-amber-500" />
                </div>
                <CardTitle className="text-xl">Random Decision Picker</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Can't decide? Let fate choose for you!
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Options Input */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Enter your options:</label>
                  {coinFlipOptions.map((opt, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...coinFlipOptions];
                          newOptions[idx] = e.target.value;
                          setCoinFlipOptions(newOptions);
                        }}
                        placeholder={`Option ${idx + 1}`}
                        className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      {coinFlipOptions.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCoinFlipOptions(coinFlipOptions.filter((_, i) => i !== idx));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {coinFlipOptions.length < 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCoinFlipOptions([...coinFlipOptions, ""])}
                      className="w-full"
                    >
                      + Add Option
                    </Button>
                  )}
                </div>

                {/* Result Display */}
                <AnimatePresence mode="wait">
                  {isFlipping && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="py-8 text-center"
                    >
                      <Shuffle className="h-12 w-12 mx-auto text-primary animate-spin" />
                      <p className="text-sm text-muted-foreground mt-3">Picking randomly...</p>
                    </motion.div>
                  )}
                  {flipResult && !isFlipping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-6 text-center bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl"
                    >
                      <Badge className="mb-3 bg-primary/20 text-primary border-primary/30">
                        The choice is...
                      </Badge>
                      <p className="text-2xl font-bold text-primary">{flipResult}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Sometimes random is the best way to decide!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setViewState("input")}
                    className="flex-1"
                  >
                    <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                    Back to AI
                  </Button>
                  <Button
                    onClick={handleCoinFlip}
                    disabled={isFlipping || coinFlipOptions.filter(o => o.trim()).length < 2}
                    className="flex-1 gap-2"
                  >
                    {isFlipping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Dices className="h-4 w-4" />
                    )}
                    {flipResult ? "Pick Again" : "Pick Randomly"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tip Card */}
            <Card className="mt-4 border-dashed bg-muted/20">
              <CardContent className="p-4 flex gap-3">
                <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Pro tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    If you feel disappointed with the random result, that's your gut telling you what you really want!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results View */}
        {viewState === "results" && aiResponse && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto px-4 py-6"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
