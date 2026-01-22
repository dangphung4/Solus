import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Lightbulb,
  Loader2,
  PencilLine,
  Plus,
  Search,
  Star,
  ThumbsUp,
  AlertCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { getUserDecisions } from "@/db/Decision/decisionDb";
import { getUserReflections, createReflection, getReflectionStats } from "@/db/Reflection/reflectionDb";
import { Decision } from "@/db/types/Decision";
import { Reflection, ReflectionOutcome, ReflectionStats, LearningType } from "@/db/types/Reflection";

// Component for star rating
const StarRating = ({ rating, maxRating = 5, size = 18, onClick }: {
  rating: number;
  maxRating?: number;
  size?: number;
  onClick?: (rating: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center">
      {Array.from({ length: maxRating }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onClick?.(i + 1)}
          onMouseEnter={() => onClick && setHoverRating(i + 1)}
          onMouseLeave={() => onClick && setHoverRating(0)}
          className={`focus:outline-none ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!onClick}
        >
          <Star
            className={`${
              (hoverRating || rating) > i
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground"
            } transition-colors`}
            size={size}
          />
        </button>
      ))}
    </div>
  );
};

// Helper to convert outcome to rating
const outcomeToRating = (outcome: ReflectionOutcome): number => {
  switch (outcome) {
    case ReflectionOutcome.VERY_SATISFIED: return 5;
    case ReflectionOutcome.SATISFIED: return 4;
    case ReflectionOutcome.NEUTRAL: return 3;
    case ReflectionOutcome.UNSATISFIED: return 2;
    case ReflectionOutcome.VERY_UNSATISFIED: return 1;
    default: return 3;
  }
};

// Helper to convert rating to outcome
const ratingToOutcome = (rating: number): ReflectionOutcome => {
  if (rating >= 5) return ReflectionOutcome.VERY_SATISFIED;
  if (rating >= 4) return ReflectionOutcome.SATISFIED;
  if (rating >= 3) return ReflectionOutcome.NEUTRAL;
  if (rating >= 2) return ReflectionOutcome.UNSATISFIED;
  return ReflectionOutcome.VERY_UNSATISFIED;
};

// Helper to get sentiment from outcome
const getSentiment = (outcome: ReflectionOutcome): "positive" | "negative" | "neutral" | "mixed" => {
  if (outcome === ReflectionOutcome.VERY_SATISFIED || outcome === ReflectionOutcome.SATISFIED) {
    return "positive";
  }
  if (outcome === ReflectionOutcome.UNSATISFIED || outcome === ReflectionOutcome.VERY_UNSATISFIED) {
    return "negative";
  }
  return "neutral";
};

// Helper to format date relatively
const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return format(date, "MMM d, yyyy");
};

// Decision status type
type DecisionStatus = "pending" | "reflected" | "learned";

// Get decision status based on reflection
const getDecisionStatus = (reflection?: Reflection): DecisionStatus => {
  if (!reflection) return "pending";
  if (reflection.learnings && reflection.learnings.length > 0) return "learned";
  return "reflected";
};

// Component for a decision item with its reflection
interface DecisionItemProps {
  decision: Decision;
  reflection?: Reflection;
  isExpanded: boolean;
  onClick: () => void;
  onAddReflection: () => void;
}

function DecisionItem({ decision, reflection, isExpanded, onClick, onAddReflection }: DecisionItemProps) {
  const status = getDecisionStatus(reflection);

  return (
    <Card
      className={`border border-border/50 transition-all duration-200 shadow-sm hover:shadow-md ${
        isExpanded ? "border-primary/30 shadow-lg" : ""
      }`}
    >
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={decision.type === "quick" ? "default" : "secondary"}>
                {decision.type === "quick" ? "Quick Decision" : "Deep Reflection"}
              </Badge>
              <Badge
                variant="outline"
                className={
                  status === "reflected"
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                    : status === "learned"
                    ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                    : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                }
              >
                {status === "reflected"
                  ? "Reflected"
                  : status === "learned"
                  ? "Learnings Captured"
                  : "Awaiting Reflection"}
              </Badge>
            </div>
            <CardTitle className="text-lg">{decision.title}</CardTitle>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-sm text-muted-foreground">
              {formatRelativeDate(new Date(decision.createdAt))}
            </span>
            {reflection && (
              <div className="mt-1">
                <StarRating rating={outcomeToRating(reflection.outcome)} />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-4 pb-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {decision.type === 'quick' && decision.options
            ? `Options: ${decision.options.map(o => o.text).join(', ')}`
            : decision.description
            ? decision.description
            : `Category: ${decision.category}`}
        </p>

        {reflection && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px]" : "max-h-0"}`}>
            <div className="bg-muted/30 p-3 rounded-md mt-2 space-y-3">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                  <PencilLine className="h-3.5 w-3.5 text-blue-500" />
                  Reflection • {formatRelativeDate(new Date(reflection.createdAt))}
                </h4>
                <p className="text-sm">{reflection.reflectionText}</p>
              </div>

              {reflection.learnings && reflection.learnings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    Key Learnings
                  </h4>
                  <ul className="text-sm space-y-1">
                    {reflection.learnings.map((learning, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{learning.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                  <Activity className="h-3.5 w-3.5 text-purple-500" />
                  Outcome
                </h4>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`
                      ${getSentiment(reflection.outcome) === "positive"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                        : getSentiment(reflection.outcome) === "negative"
                        ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"}
                    `}
                  >
                    {reflection.outcome.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </Badge>
                  {reflection.wouldRepeat && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Would repeat
                    </Badge>
                  )}
                </div>
              </div>

              {reflection.improvementNotes && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-orange-500" />
                    What I'd do differently
                  </h4>
                  <p className="text-sm text-muted-foreground">{reflection.improvementNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-3 gap-2">
          {!reflection && (
            <Button variant="outline" size="sm" onClick={onAddReflection}>
              <PencilLine className="mr-1 h-4 w-4" />
              Add Reflection
            </Button>
          )}
          {reflection && (
            <Button variant="ghost" size="sm" onClick={onClick}>
              {isExpanded ? "Show less" : "Show more"}
              <ChevronRight
                className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Add Reflection Dialog Component
interface AddReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  decision: Decision | null;
  onSubmit: (reflection: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

function AddReflectionDialog({ open, onOpenChange, decision, onSubmit }: AddReflectionDialogProps) {
  const [rating, setRating] = useState(3);
  const [reflectionText, setReflectionText] = useState("");
  const [wouldRepeat, setWouldRepeat] = useState<string>("");
  const [improvementNotes, setImprovementNotes] = useState("");
  const [learnings, setLearnings] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setRating(3);
    setReflectionText("");
    setWouldRepeat("");
    setImprovementNotes("");
    setLearnings([""]);
  };

  const handleSubmit = async () => {
    if (!decision || !reflectionText.trim() || !wouldRepeat) return;

    setSubmitting(true);
    try {
      const filteredLearnings = learnings
        .filter(l => l.trim())
        .map(l => ({
          type: LearningType.INSIGHT,
          description: l.trim()
        }));

      await onSubmit({
        userId: decision.userId,
        decisionId: decision.id,
        decisionType: decision.type,
        decisionCategory: decision.category,
        outcome: ratingToOutcome(rating),
        reflectionText: reflectionText.trim(),
        wouldRepeat: wouldRepeat === "yes",
        improvementNotes: improvementNotes.trim() || undefined,
        learnings: filteredLearnings.length > 0 ? filteredLearnings : undefined,
      });

      resetForm();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  const addLearning = () => {
    setLearnings([...learnings, ""]);
  };

  const updateLearning = (index: number, value: string) => {
    const newLearnings = [...learnings];
    newLearnings[index] = value;
    setLearnings(newLearnings);
  };

  const removeLearning = (index: number) => {
    if (learnings.length > 1) {
      setLearnings(learnings.filter((_, i) => i !== index));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reflect on Your Decision</DialogTitle>
          <DialogDescription>
            {decision ? `How did "${decision.title}" turn out?` : "Add your reflection"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>How satisfied are you with this decision?</Label>
            <div className="flex items-center gap-2">
              <StarRating rating={rating} size={28} onClick={setRating} />
              <span className="text-sm text-muted-foreground ml-2">
                {rating === 5 ? "Very Satisfied" :
                 rating === 4 ? "Satisfied" :
                 rating === 3 ? "Neutral" :
                 rating === 2 ? "Unsatisfied" : "Very Unsatisfied"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reflection">Your reflection *</Label>
            <Textarea
              id="reflection"
              placeholder="How did this decision turn out? What happened?"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Would you make this decision again? *</Label>
            <Select value={wouldRepeat} onValueChange={setWouldRepeat}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes, I would</SelectItem>
                <SelectItem value="no">No, I wouldn't</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvement">What would you do differently? (optional)</Label>
            <Textarea
              id="improvement"
              placeholder="Any changes you'd make next time?"
              value={improvementNotes}
              onChange={(e) => setImprovementNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Key learnings (optional)</Label>
            {learnings.map((learning, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Learning ${index + 1}`}
                  value={learning}
                  onChange={(e) => updateLearning(index, e.target.value)}
                />
                {learnings.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLearning(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLearning}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Learning
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!reflectionText.trim() || !wouldRepeat || submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Reflection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Main component
export default function ReflectionsPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);

  // Real data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [stats, setStats] = useState<ReflectionStats | null>(null);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [userDecisions, userReflections, reflectionStats] = await Promise.all([
          getUserDecisions(currentUser.uid),
          getUserReflections(currentUser.uid),
          getReflectionStats(currentUser.uid)
        ]);

        setDecisions(userDecisions);
        setReflections(userReflections);
        setStats(reflectionStats);

        // Check if we should open reflection dialog for a specific decision
        const decisionId = searchParams.get('decision');
        if (decisionId) {
          const decision = userDecisions.find(d => d.id === decisionId);
          const hasReflection = userReflections.some(r => r.decisionId === decisionId);
          if (decision && !hasReflection) {
            setSelectedDecision(decision);
            setDialogOpen(true);
          }
        }
      } catch (err) {
        console.error('Error loading reflections data:', err);
        setError('Failed to load reflections. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [currentUser?.uid, searchParams]);

  // Handle creating a new reflection
  const handleCreateReflection = async (reflectionData: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newReflection = await createReflection(reflectionData);
      setReflections(prev => [newReflection, ...prev]);

      // Refresh stats
      if (currentUser?.uid) {
        const updatedStats = await getReflectionStats(currentUser.uid);
        setStats(updatedStats);
      }

      toast.success("Reflection saved", {
        description: "Your reflection has been recorded successfully.",
      });
    } catch (err) {
      console.error('Error creating reflection:', err);
      toast.error("Error", {
        description: "Failed to save reflection. Please try again.",
      });
      throw err;
    }
  };

  // Open add reflection dialog
  const openAddReflection = (decision: Decision) => {
    setSelectedDecision(decision);
    setDialogOpen(true);
  };

  // Associate reflections with decisions
  const decisionsWithReflections = decisions.map(decision => {
    const reflection = reflections.find(r => r.decisionId === decision.id);
    return { decision, reflection };
  });

  // Filter decisions based on active tab and search term
  const filteredDecisions = decisionsWithReflections.filter(({ decision, reflection }) => {
    const status = getDecisionStatus(reflection);
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && status === "pending") ||
      (activeTab === "reflected" && (status === "reflected" || status === "learned"));

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      decision.title.toLowerCase().includes(searchLower) ||
      decision.category.toLowerCase().includes(searchLower) ||
      (decision.type === 'quick' && decision.options?.some(o => o.text.toLowerCase().includes(searchLower)));

    return matchesTab && matchesSearch;
  });

  // Calculate reflection stats
  const totalDecisions = decisions.length;
  const reflectedDecisions = decisions.filter(d =>
    reflections.some(r => r.decisionId === d.id)
  ).length;
  const reflectionRate = totalDecisions > 0
    ? Math.round((reflectedDecisions / totalDecisions) * 100)
    : 0;

  // Calculate average decision rating
  const averageRating = reflections.length > 0
    ? (reflections.reduce((sum, r) => sum + outcomeToRating(r.outcome), 0) / reflections.length).toFixed(1)
    : "0.0";

  // Positive outcomes percentage
  const positiveOutcomes = reflections.filter(r =>
    r.outcome === ReflectionOutcome.VERY_SATISFIED || r.outcome === ReflectionOutcome.SATISFIED
  ).length;
  const positiveRate = reflections.length > 0
    ? Math.round((positiveOutcomes / reflections.length) * 100)
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background/90 to-background/95 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your reflections...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background/90 to-background/95 p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
        {/* Compact Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Decision Journal
              </h1>
              <p className="text-sm text-muted-foreground">
                Learn from your past decisions
              </p>
            </div>

            {decisions.filter(d => !reflections.some(r => r.decisionId === d.id)).length > 0 && (
              <Button
                size="sm"
                className="gap-2"
                onClick={() => {
                  const unreflectedDecision = decisions.find(d =>
                    !reflections.some(r => r.decisionId === d.id)
                  );
                  if (unreflectedDecision) {
                    openAddReflection(unreflectedDecision);
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                Add Reflection
              </Button>
            )}
          </div>

          {/* Compact Stats Row */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0">
              <FileText className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium">{totalDecisions}</span>
              <span className="text-muted-foreground">decisions</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0">
              <PencilLine className="h-3.5 w-3.5 text-purple-500" />
              <span className="font-medium">{reflectionRate}%</span>
              <span className="text-muted-foreground">reflected</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="font-medium">{averageRating}</span>
              <span className="text-muted-foreground">avg rating</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5 flex-shrink-0">
              <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
              <span className="font-medium">{positiveRate}%</span>
              <span className="text-muted-foreground">positive</span>
            </Badge>
          </div>
        </header>

        {/* Search and Tabs combined */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search decisions..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all" className="text-xs md:text-sm">
                  All ({decisions.length})
                </TabsTrigger>
                <TabsTrigger value="reflected" className="text-xs md:text-sm">
                  Reflected ({reflectedDecisions})
                </TabsTrigger>
                <TabsTrigger value="pending" className="text-xs md:text-sm">
                  Pending ({totalDecisions - reflectedDecisions})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Decisions list */}
        <div className="space-y-4">
          {filteredDecisions.length > 0 ? (
            filteredDecisions.map(({ decision, reflection }) => (
              <DecisionItem
                key={decision.id}
                decision={decision}
                reflection={reflection}
                isExpanded={expandedDecision === decision.id}
                onClick={() => setExpandedDecision(
                  expandedDecision === decision.id ? null : decision.id
                )}
                onAddReflection={() => openAddReflection(decision)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No decisions found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try changing your search or filters"
                  : activeTab === "pending"
                  ? "You've reflected on all your decisions!"
                  : "Start by making some decisions to reflect on"}
              </p>
              {searchTerm ? (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              ) : (
                <Button onClick={() => navigate('/quick-decision')}>
                  Make a Decision
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Reflection Insights */}
        {reflections.length >= 3 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Reflection Insights</h2>
            </div>

            <Card className="border border-border/50 shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      <h4 className="font-medium">Decision Quality</h4>
                    </div>
                    <p className="text-sm">
                      {parseFloat(averageRating) >= 4
                        ? "Your decisions are performing well with high satisfaction scores."
                        : parseFloat(averageRating) >= 3
                        ? "Your decisions are moderately successful. Look for patterns to improve."
                        : "Consider taking more time on decisions or consulting others."}
                    </p>
                  </div>

                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Reflection Habit</h4>
                    </div>
                    <p className="text-sm">
                      {reflectionRate >= 70
                        ? `Great job! You've reflected on ${reflectionRate}% of your decisions.`
                        : reflectionRate >= 40
                        ? `You've reflected on ${reflectionRate}% of decisions. Try to reflect more often.`
                        : `Only ${reflectionRate}% of decisions have reflections. Regular reflection improves future decisions.`}
                    </p>
                  </div>

                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Repeat Rate</h4>
                    </div>
                    <p className="text-sm">
                      {stats?.wouldRepeatPercentage !== undefined
                        ? `${Math.round(stats.wouldRepeatPercentage)}% of your decisions you would make again.`
                        : "Keep adding reflections to see your repeat rate."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Upcoming reflections */}
        {decisions.filter(d => !reflections.some(r => r.decisionId === d.id)).length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Awaiting Your Reflection</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {decisions
                .filter(d => !reflections.some(r => r.decisionId === d.id))
                .slice(0, 3)
                .map(decision => (
                  <Card key={decision.id} className="border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant={decision.type === "quick" ? "default" : "secondary"}>
                          {decision.type === "quick" ? "Quick" : "Deep"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeDate(new Date(decision.createdAt))}
                        </span>
                      </div>
                      <CardTitle className="text-lg mt-2">{decision.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {decision.type === 'quick' && decision.options
                          ? `Options: ${decision.options.slice(0, 2).map(o => o.text).join(', ')}...`
                          : decision.category}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => openAddReflection(decision)}
                      >
                        <PencilLine className="h-4 w-4" />
                        Add Reflection
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* Add Reflection Dialog */}
        <AddReflectionDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          decision={selectedDecision}
          onSubmit={handleCreateReflection}
        />
      </div>
    </div>
  );
}
