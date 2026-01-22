import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  History,
  Search,
  Zap,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Loader2,
  FileX,
  TrendingUp,
  Target,
  Clock,
  SlidersHorizontal,
  Grid3X3,
  List,
  ArrowUpDown,
  Filter,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { getUserDecisions } from "@/db/Decision/decisionDb";
import { Decision } from "@/db/types/Decision";
import { DecisionCategory, DecisionStatus } from "@/db/types/BaseDecision";
import { useNavigate } from "react-router-dom";

type ViewMode = "list" | "grid";
type SortBy = "newest" | "oldest" | "title";

export default function DecisionHistoryPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Load decisions
  useEffect(() => {
    const loadDecisions = async () => {
      if (!currentUser) return;

      setIsLoading(true);
      setError(null);

      try {
        const userDecisions = await getUserDecisions(currentUser.uid);
        setDecisions(userDecisions);
      } catch (err) {
        console.error("Error loading decisions:", err);
        setError("Failed to load your decisions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDecisions();
  }, [currentUser]);

  // Apply filters and sorting
  const filteredDecisions = useMemo(() => {
    let filtered = [...decisions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((d) => d.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((d) => d.type === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [decisions, searchQuery, categoryFilter, statusFilter, typeFilter, sortBy]);

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: diffDays > 365 ? "numeric" : undefined,
      }).format(new Date(date));
    }
  };

  // Get status badge variant
  const getStatusBadge = (status: DecisionStatus) => {
    switch (status) {
      case DecisionStatus.COMPLETED:
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">Completed</Badge>;
      case DecisionStatus.IN_PROGRESS:
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs">In Progress</Badge>;
      case DecisionStatus.DRAFT:
        return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20 text-xs">Draft</Badge>;
      case DecisionStatus.IMPLEMENTED:
        return <Badge className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs">Implemented</Badge>;
      case DecisionStatus.ARCHIVED:
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">Archived</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  // Get category name with emoji
  const getCategoryDisplay = (category: DecisionCategory) => {
    const categoryEmojis: Record<DecisionCategory, string> = {
      [DecisionCategory.CAREER]: "💼",
      [DecisionCategory.FOOD]: "🍽️",
      [DecisionCategory.ENTERTAINMENT]: "🎬",
      [DecisionCategory.RELATIONSHIP]: "❤️",
      [DecisionCategory.FINANCE]: "💰",
      [DecisionCategory.HEALTH]: "🏥",
      [DecisionCategory.TRAVEL]: "✈️",
      [DecisionCategory.SHOPPING]: "🛍️",
      [DecisionCategory.EDUCATION]: "📚",
      [DecisionCategory.LIFESTYLE]: "🏠",
      [DecisionCategory.TECHNOLOGY]: "💻",
      [DecisionCategory.OTHER]: "📌",
    };
    const name = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    return { name, emoji: categoryEmojis[category] || "📌" };
  };

  // Stats calculations
  const quickCount = decisions.filter((d) => d.type === "quick").length;
  const deepCount = decisions.filter((d) => d.type === "deep").length;
  const completedCount = decisions.filter((d) => d.status === DecisionStatus.COMPLETED).length;
  const completionRate = decisions.length > 0 ? Math.round((completedCount / decisions.length) * 100) : 0;

  // Recent activity (last 7 days)
  const recentCount = decisions.filter((d) => {
    const diffTime = new Date().getTime() - new Date(d.createdAt).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 7;
  }).length;

  // Active filters count
  const activeFiltersCount = [categoryFilter, statusFilter, typeFilter].filter(f => f !== "all").length;

  const clearFilters = () => {
    setCategoryFilter("all");
    setStatusFilter("all");
    setTypeFilter("all");
    setSearchQuery("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <History className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Decision History
                </h1>
                <p className="text-sm text-muted-foreground">
                  {decisions.length} decisions • {recentCount} this week
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/quick-decisions")}
                className="flex-1 md:flex-none"
              >
                <Zap className="mr-1.5 h-4 w-4 text-amber-500" />
                <span className="hidden sm:inline">Quick</span>
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/deep-reflections")}
                className="flex-1 md:flex-none"
              >
                <Brain className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Deep</span>
              </Button>
            </div>
          </header>

          {/* Stats - Horizontal scroll on mobile */}
          <section className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            <Card className="flex-shrink-0 min-w-[140px] md:flex-1 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{decisions.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-shrink-0 min-w-[140px] md:flex-1 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Zap className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{quickCount}</p>
                    <p className="text-xs text-muted-foreground">Quick</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-shrink-0 min-w-[140px] md:flex-1 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Brain className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{deepCount}</p>
                    <p className="text-xs text-muted-foreground">Deep</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-shrink-0 min-w-[140px] md:flex-1 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completionRate}%</p>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Search and Filters */}
          <section className="space-y-3">
            {/* Search Bar with View Controls */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search decisions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden relative"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* View Mode Toggle */}
              <div className="hidden md:flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </div>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Newest first
                    {sortBy === "newest" && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Oldest first
                    {sortBy === "oldest" && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("title")}>
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Alphabetical
                    {sortBy === "title" && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filters - Desktop inline, Mobile collapsible */}
            <AnimatePresence>
              {(showFilters || window.innerWidth >= 768) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    {/* Type Pills */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                      {[
                        { value: "all", label: "All Types", icon: Filter },
                        { value: "quick", label: "Quick", icon: Zap, color: "text-amber-500" },
                        { value: "deep", label: "Deep", icon: Brain, color: "text-purple-500" },
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setTypeFilter(type.value)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                            typeFilter === type.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <type.icon className={`h-3.5 w-3.5 ${typeFilter !== type.value ? type.color : ""}`} />
                          {type.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 flex-1 md:justify-end">
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full md:w-[150px] h-9 text-xs">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {Object.values(DecisionCategory).map((cat) => {
                            const { name, emoji } = getCategoryDisplay(cat);
                            return (
                              <SelectItem key={cat} value={cat}>
                                {emoji} {name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[150px] h-9 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {Object.values(DecisionStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="text-xs text-muted-foreground"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Decision List */}
          <section>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your decisions...</p>
              </div>
            ) : error ? (
              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="pt-6 text-center">
                  <p className="text-red-600">{error}</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredDecisions.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <FileX className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {decisions.length === 0 ? "No decisions yet" : "No matches found"}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    {decisions.length === 0
                      ? "Start making decisions to build your history and track your choices over time."
                      : "Try adjusting your search or filters to find what you're looking for."}
                  </p>
                  {decisions.length === 0 ? (
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => navigate("/quick-decisions")}>
                        <Zap className="mr-2 h-4 w-4 text-amber-500" />
                        Quick Decision
                      </Button>
                      <Button onClick={() => navigate("/deep-reflections")}>
                        <Brain className="mr-2 h-4 w-4" />
                        Deep Reflection
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Results count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredDecisions.length} of {decisions.length} decisions
                  </p>
                </div>

                {/* Decision cards */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className={viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-3"
                  }
                >
                  {filteredDecisions.map((decision) => (
                    <motion.div key={decision.id} variants={itemVariants}>
                      {viewMode === "grid" ? (
                        <GridDecisionCard
                          decision={decision}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                          getCategoryDisplay={getCategoryDisplay}
                          navigate={navigate}
                        />
                      ) : (
                        <ListDecisionCard
                          decision={decision}
                          formatDate={formatDate}
                          getStatusBadge={getStatusBadge}
                          getCategoryDisplay={getCategoryDisplay}
                          navigate={navigate}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// List View Card Component
interface DecisionCardProps {
  decision: Decision;
  formatDate: (date: Date) => string;
  getStatusBadge: (status: DecisionStatus) => React.ReactNode;
  getCategoryDisplay: (category: DecisionCategory) => { name: string; emoji: string };
  navigate: (path: string) => void;
}

function ListDecisionCard({
  decision,
  formatDate,
  getStatusBadge,
  getCategoryDisplay,
  navigate,
}: DecisionCardProps) {
  const { name: categoryName, emoji } = getCategoryDisplay(decision.category);

  const getOutcome = () => {
    if (decision.type === "quick") {
      const selected = decision.options.find((o) => o.selected);
      return selected?.text || decision.recommendation;
    } else if (decision.type === "deep") {
      return decision.recommendation;
    }
    return null;
  };

  const outcome = getOutcome();

  return (
    <Card
      className="group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer"
      onClick={() => navigate(`/decisions/${decision.id}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Type Icon */}
          <div
            className={`p-2.5 rounded-xl shrink-0 transition-colors ${
              decision.type === "quick"
                ? "bg-amber-500/10 group-hover:bg-amber-500/20"
                : "bg-purple-500/10 group-hover:bg-purple-500/20"
            }`}
          >
            {decision.type === "quick" ? (
              <Zap className="h-5 w-5 text-amber-600" />
            ) : (
              <Brain className="h-5 w-5 text-purple-600" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {decision.title}
                </h3>
                {decision.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                    {decision.description}
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {getStatusBadge(decision.status)}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                {emoji} {categoryName}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(decision.createdAt)}
              </span>
            </div>

            {/* Outcome preview */}
            {outcome && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                <span className="text-green-600 truncate">{outcome}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid View Card Component
function GridDecisionCard({
  decision,
  formatDate,
  getStatusBadge,
  getCategoryDisplay,
  navigate,
}: DecisionCardProps) {
  const { name: categoryName, emoji } = getCategoryDisplay(decision.category);

  const getOutcome = () => {
    if (decision.type === "quick") {
      const selected = decision.options.find((o) => o.selected);
      return selected?.text || decision.recommendation;
    } else if (decision.type === "deep") {
      return decision.recommendation;
    }
    return null;
  };

  const outcome = getOutcome();

  return (
    <Card
      className="group hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
      onClick={() => navigate(`/decisions/${decision.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div
            className={`p-2 rounded-lg ${
              decision.type === "quick"
                ? "bg-amber-500/10"
                : "bg-purple-500/10"
            }`}
          >
            {decision.type === "quick" ? (
              <Zap className="h-4 w-4 text-amber-600" />
            ) : (
              <Brain className="h-4 w-4 text-purple-600" />
            )}
          </div>
          {getStatusBadge(decision.status)}
        </div>
        <CardTitle className="text-base mt-3 line-clamp-2 group-hover:text-primary transition-colors">
          {decision.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between gap-3">
        {decision.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {decision.description}
          </p>
        )}

        <div className="space-y-2">
          {outcome && (
            <div className="flex items-center gap-1.5 text-xs bg-green-500/5 text-green-600 p-2 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{outcome}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span className="flex items-center gap-1">
              {emoji} {categoryName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(decision.createdAt)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
