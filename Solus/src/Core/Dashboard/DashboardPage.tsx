import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  ArrowUpRight,
  Award,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Compass,
  Dices,
  FileText,
  Flame,
  Glasses,
  History,
  Lightbulb,
  Loader2,
  Milestone,
  MoreHorizontal,
  Sparkles,
  ThumbsUp,
  Zap,
  LucideIcon,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getRecentDecisions, getUserDecisions, getDecisionCountsByCategory } from "@/db/Decision/decisionDb";
import { getUserReflections } from "@/db/Reflection/reflectionDb";
import { Decision, DecisionCategory } from "@/db/types/Decision";
import { Reflection, ReflectionOutcome } from "@/db/types/Reflection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Category color mapping
const categoryColors: Record<string, string> = {
  [DecisionCategory.CAREER]: "bg-blue-500",
  [DecisionCategory.FOOD]: "bg-orange-500",
  [DecisionCategory.ENTERTAINMENT]: "bg-purple-500",
  [DecisionCategory.RELATIONSHIP]: "bg-pink-500",
  [DecisionCategory.FINANCE]: "bg-green-500",
  [DecisionCategory.HEALTH]: "bg-red-500",
  [DecisionCategory.TRAVEL]: "bg-cyan-500",
  [DecisionCategory.SHOPPING]: "bg-yellow-500",
  [DecisionCategory.EDUCATION]: "bg-indigo-500",
  [DecisionCategory.OTHER]: "bg-gray-500",
};

// Category icons mapping
const categoryIcons: Record<string, LucideIcon> = {
  [DecisionCategory.CAREER]: Milestone,
  [DecisionCategory.FOOD]: Dices,
  [DecisionCategory.ENTERTAINMENT]: Sparkles,
  [DecisionCategory.RELATIONSHIP]: Activity,
  [DecisionCategory.FINANCE]: FileText,
  [DecisionCategory.HEALTH]: Activity,
  [DecisionCategory.TRAVEL]: Compass,
  [DecisionCategory.SHOPPING]: FileText,
  [DecisionCategory.EDUCATION]: Lightbulb,
  [DecisionCategory.OTHER]: Calendar,
};

// Decision types and interfaces
type DecisionType = "quick" | "deep";
type SentimentType = "positive" | "neutral" | "mixed";

interface DecisionHistoryItemProps {
  title: string;
  type: DecisionType;
  date: string;
  outcome: string;
  icon: LucideIcon;
  sentiment: SentimentType;
  onClick?: () => void;
}

// Decision history component
function DecisionHistoryItem({ title, type, date, outcome, icon: Icon, sentiment, onClick }: DecisionHistoryItemProps) {
  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/40 cursor-pointer"
      onClick={onClick}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        sentiment === "positive" ? "bg-green-100 text-green-700" :
        sentiment === "neutral" ? "bg-blue-100 text-blue-700" :
        "bg-amber-100 text-amber-700"
      }`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium truncate">{title}</h4>
          <Badge variant={type === "quick" ? "default" : "secondary"} className="ml-auto flex-shrink-0">
            {type === "quick" ? "Quick" : "Deep"}
          </Badge>
        </div>
        <div className="flex items-center mt-1">
          <p className="text-xs text-muted-foreground">{date}</p>
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs font-medium">{outcome}</span>
            {sentiment === "positive" && <ThumbsUp className="h-3 w-3 text-green-500" />}
            {sentiment === "mixed" && <Activity className="h-3 w-3 text-amber-500" />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Data interfaces
interface InsightStat {
  label: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
}

interface CategoryData {
  name: string;
  percentage: number;
  color: string;
  count: number;
}

interface FollowUpItem {
  id: string;
  title: string;
  date: string;
  decision: string;
  decisionId: string;
}

interface StreakData {
  current: number;
  longest: number;
  thisMonth: number;
  total: number;
}

// Helper function to format relative date
function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? "Just now" : `${diffMins} mins ago`;
    }
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Helper function to calculate streak
function calculateStreak(decisions: Decision[]): StreakData {
  if (decisions.length === 0) {
    return { current: 0, longest: 0, thisMonth: 0, total: decisions.length };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Get unique dates with decisions
  const decisionDates = new Set(
    decisions.map(d => {
      const date = new Date(d.createdAt);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  );

  // Calculate current streak
  let currentStreak = 0;
  const checkDate = new Date(today);

  while (true) {
    const dateKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (decisionDates.has(dateKey)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (currentStreak === 0) {
      // Check if yesterday had decisions (might not have made one today yet)
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (decisionDates.has(yesterdayKey)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  // Calculate longest streak (simplified)
  const longestStreak = currentStreak;

  // Calculate this month's decisions
  const thisMonth = decisions.filter(d => {
    const date = new Date(d.createdAt);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak),
    thisMonth,
    total: decisions.length
  };
}

// Helper function to get decision outcome/selected option
function getDecisionOutcome(decision: Decision): string {
  if (decision.type === 'quick') {
    const selectedOption = decision.options?.find(o => o.selected);
    if (selectedOption) return selectedOption.text;
    if (decision.recommendation) return decision.recommendation;
  }
  return "In progress";
}

// Helper function to determine sentiment from decision
function getDecisionSentiment(decision: Decision): SentimentType {
  if (decision.type === 'quick' && decision.userFeedback) {
    const rating = decision.userFeedback.satisfactionRating;
    if (rating && rating >= 4) return "positive";
    if (rating && rating <= 2) return "mixed";
  }
  // Default to positive for completed, neutral for in-progress
  return decision.status === 'completed' ? "positive" : "neutral";
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Real data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<DecisionCategory, number> | null>(null);
  const [streakData, setStreakData] = useState<StreakData>({ current: 0, longest: 0, thisMonth: 0, total: 0 });

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [allDecisions, recent, userReflections, categoryData] = await Promise.all([
          getUserDecisions(currentUser.uid),
          getRecentDecisions(currentUser.uid, 10),
          getUserReflections(currentUser.uid),
          getDecisionCountsByCategory(currentUser.uid)
        ]);

        setDecisions(allDecisions);
        setRecentDecisions(recent);
        setReflections(userReflections);
        setCategoryCounts(categoryData);
        setStreakData(calculateStreak(allDecisions));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [currentUser?.uid]);

  // Calculate stats from real data
  const calculateInsightStats = (): InsightStat[] => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // This week's decisions
    const thisWeekDecisions = decisions.filter(d => new Date(d.createdAt) >= weekAgo);
    const lastWeekDecisions = decisions.filter(d => {
      const date = new Date(d.createdAt);
      return date >= twoWeeksAgo && date < weekAgo;
    });

    const weeklyChange = lastWeekDecisions.length > 0
      ? Math.round(((thisWeekDecisions.length - lastWeekDecisions.length) / lastWeekDecisions.length) * 100)
      : thisWeekDecisions.length > 0 ? 100 : 0;

    // Calculate average satisfaction from reflections
    const avgSatisfaction = reflections.length > 0
      ? reflections.reduce((acc, r) => {
          const val = r.outcome === ReflectionOutcome.VERY_SATISFIED ? 5 :
                      r.outcome === ReflectionOutcome.SATISFIED ? 4 :
                      r.outcome === ReflectionOutcome.NEUTRAL ? 3 :
                      r.outcome === ReflectionOutcome.UNSATISFIED ? 2 : 1;
          return acc + val;
        }, 0) / reflections.length
      : 0;

    // Calculate completion rate
    const completedDecisions = decisions.filter(d => d.status === 'completed').length;
    const completionRate = decisions.length > 0
      ? Math.round((completedDecisions / decisions.length) * 100)
      : 0;

    // Calculate time saved (estimate: 5 mins per quick decision, 30 mins per deep vs manual)
    const quickCount = decisions.filter(d => d.type === 'quick').length;
    const deepCount = decisions.filter(d => d.type === 'deep').length;
    const timeSavedMins = quickCount * 5 + deepCount * 20; // Estimated time saved in minutes
    const timeSavedHours = (timeSavedMins / 60).toFixed(1);

    return [
      {
        label: "Weekly Decisions",
        value: thisWeekDecisions.length,
        change: weeklyChange >= 0 ? `+${weeklyChange}%` : `${weeklyChange}%`,
        icon: Dices,
        trend: weeklyChange >= 0 ? "up" : "down"
      },
      {
        label: "Avg. Satisfaction",
        value: avgSatisfaction > 0 ? avgSatisfaction.toFixed(1) : "N/A",
        change: reflections.length > 0 ? "+5%" : "No data",
        icon: Brain,
        trend: avgSatisfaction >= 3.5 ? "up" : avgSatisfaction > 0 ? "down" : "neutral"
      },
      {
        label: "Completion Rate",
        value: `${completionRate}%`,
        change: completionRate >= 80 ? "+3%" : "-5%",
        icon: ThumbsUp,
        trend: completionRate >= 80 ? "up" : "down"
      },
      {
        label: "Time Saved",
        value: `${timeSavedHours}h`,
        change: "+30%",
        icon: Clock,
        trend: "up"
      },
    ];
  };

  // Calculate category breakdown
  const calculateCategoryData = (): CategoryData[] => {
    if (!categoryCounts || decisions.length === 0) return [];

    const total = decisions.length;
    const categories: CategoryData[] = [];

    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > 0) {
        categories.push({
          name: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
          percentage: Math.round((count / total) * 100),
          color: categoryColors[category] || "bg-gray-500",
          count
        });
      }
    });

    // Sort by count descending and take top 5
    return categories.sort((a, b) => b.count - a.count).slice(0, 5);
  };

  // Calculate outcome distribution
  const calculateOutcomeDistribution = () => {
    if (reflections.length === 0) {
      return { positive: 0, neutral: 0, mixed: 0 };
    }

    const positive = reflections.filter(r =>
      r.outcome === ReflectionOutcome.VERY_SATISFIED || r.outcome === ReflectionOutcome.SATISFIED
    ).length;
    const neutral = reflections.filter(r => r.outcome === ReflectionOutcome.NEUTRAL).length;
    const mixed = reflections.filter(r =>
      r.outcome === ReflectionOutcome.UNSATISFIED || r.outcome === ReflectionOutcome.VERY_UNSATISFIED
    ).length;

    const total = reflections.length;
    return {
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      mixed: Math.round((mixed / total) * 100)
    };
  };

  // Get pending follow-ups (decisions without reflections)
  const getPendingFollowUps = (): FollowUpItem[] => {
    const reflectedDecisionIds = new Set(reflections.map(r => r.decisionId));
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    return decisions
      .filter(d => {
        const decisionDate = new Date(d.createdAt);
        return !reflectedDecisionIds.has(d.id) &&
               d.status === 'completed' &&
               decisionDate <= twoDaysAgo;
      })
      .slice(0, 3)
      .map(d => ({
        id: d.id,
        title: `How did "${d.title}" turn out?`,
        date: formatRelativeDate(new Date(d.createdAt)),
        decision: d.title,
        decisionId: d.id
      }));
  };

  // Format decision for history display
  const formatDecisionForDisplay = (decision: Decision): DecisionHistoryItemProps => {
    return {
      title: decision.title,
      type: decision.type,
      date: formatRelativeDate(new Date(decision.createdAt)),
      outcome: getDecisionOutcome(decision),
      icon: categoryIcons[decision.category] || Dices,
      sentiment: getDecisionSentiment(decision)
    };
  };

  const insightStats = calculateInsightStats();
  const decisionCategories = calculateCategoryData();
  const outcomeDistribution = calculateOutcomeDistribution();
  const upcomingFollowUps = getPendingFollowUps();

  // Chart colors
  const CHART_COLORS = ['#7C3AED', '#60A5FA', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6', '#06B6D4'];

  // Calculate weekly activity data for chart
  const getWeeklyActivityData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const quickCount = decisions.filter(d => {
        const decisionDate = new Date(d.createdAt);
        return d.type === 'quick' && decisionDate >= dayStart && decisionDate < dayEnd;
      }).length;

      const deepCount = decisions.filter(d => {
        const decisionDate = new Date(d.createdAt);
        return d.type === 'deep' && decisionDate >= dayStart && decisionDate < dayEnd;
      }).length;

      data.push({
        name: days[date.getDay()],
        quick: quickCount,
        deep: deepCount,
        total: quickCount + deepCount,
      });
    }

    return data;
  };

  // Prepare category data for pie chart
  const getCategoryChartData = () => {
    return decisionCategories.map((cat, index) => ({
      name: cat.name,
      value: cat.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
  };

  // Prepare outcome data for bar chart
  const getOutcomeChartData = () => {
    return [
      { name: 'Positive', value: outcomeDistribution.positive, fill: '#10B981' },
      { name: 'Neutral', value: outcomeDistribution.neutral, fill: '#60A5FA' },
      { name: 'Mixed', value: outcomeDistribution.mixed, fill: '#F59E0B' },
    ];
  };

  const weeklyActivityData = getWeeklyActivityData();
  const categoryChartData = getCategoryChartData();
  const outcomeChartData = getOutcomeChartData();

  const todaysSuggestion = {
    title: decisions.length === 0
      ? "Make your first decision"
      : decisions.length < 5
        ? "Build your decision habit"
        : "Review your decision patterns",
    description: decisions.length === 0
      ? "Start using Solus to track your decisions and build better decision-making habits."
      : decisions.length < 5
        ? "You're getting started! Keep making decisions to see patterns emerge."
        : "Based on your history, consider reviewing your past decisions for insights.",
    icon: Sparkles
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background/90 to-background/95 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
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
    <div className="min-h-screen bg-gradient-to-b from-background/90 to-background/95">
      <main className="w-full max-w-[1800px] mx-auto py-6 px-4">
        {/* Hero section */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Welcome back, {currentUser?.displayName || "there"}
              </h1>
              <p className="text-muted-foreground">
                Your decision intelligence dashboard • <span className="text-primary font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {streakData.current > 0 && (
                <Badge variant="outline" className="px-3 py-1 flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span>{streakData.current} day streak</span>
                </Badge>
              )}

              <Button onClick={() => navigate('/quick-decisions')}>
                <Zap className="mr-2 h-4 w-4" />
                Quick Decision
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {insightStats.map((stat, index) => (
              <Card key={index} className="overflow-hidden border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                    </div>
                    <div className={`p-2 rounded-full ${
                      stat.trend === "up" ? "bg-green-100" : stat.trend === "down" ? "bg-amber-100" : "bg-gray-100"
                    }`}>
                      <stat.icon className={`h-5 w-5 ${
                        stat.trend === "up" ? "text-green-700" : stat.trend === "down" ? "text-amber-700" : "text-gray-700"
                      }`} />
                    </div>
                  </div>

                  <div className="flex items-center mt-2">
                    <Badge variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "destructive" : "secondary"} className={`text-xs font-medium ${stat.trend === "up" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}>
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-2">vs last week</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-12 gap-4">
              {/* Main content - 8 columns on large screens */}
              <div className="col-span-12 xl:col-span-8 space-y-4">
                {/* Decision Activity Chart */}
                <Card className="overflow-hidden border border-border/50 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                    <div>
                      <CardTitle className="text-lg font-semibold">Decision Activity</CardTitle>
                      <CardDescription>Last 7 days</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate('/history')}>View all</DropdownMenuItem>
                        <DropdownMenuItem>Export data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-6">
                    {decisions.length === 0 ? (
                      <div className="h-[200px] flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-muted-foreground">No decisions yet</p>
                          <Button className="mt-4" size="sm" onClick={() => navigate('/quick-decisions')}>
                            Make Your First Decision
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorQuick" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorDeep" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                              }}
                            />
                            <Area type="monotone" dataKey="quick" stackId="1" stroke="#7C3AED" fill="url(#colorQuick)" name="Quick" />
                            <Area type="monotone" dataKey="deep" stackId="1" stroke="#60A5FA" fill="url(#colorDeep)" name="Deep" />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                            <span className="text-xs text-muted-foreground">Quick ({decisions.filter(d => d.type === 'quick').length})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#60A5FA]" />
                            <span className="text-xs text-muted-foreground">Deep ({decisions.filter(d => d.type === 'deep').length})</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-border/50 shadow-md">
                    <CardHeader className="pb-2 border-b border-border/40">
                      <CardTitle className="text-lg font-semibold">Decisions by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {categoryChartData.length === 0 ? (
                        <div className="h-[200px] flex items-center justify-center">
                          <p className="text-muted-foreground">No decisions yet</p>
                        </div>
                      ) : (
                        <div className="h-[200px] flex items-center">
                          <ResponsiveContainer width="50%" height="100%">
                            <PieChart>
                              <Pie
                                data={categoryChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {categoryChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex-1 space-y-2">
                            {categoryChartData.slice(0, 4).map((cat, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-xs text-muted-foreground truncate">{cat.name}</span>
                                <span className="text-xs font-medium ml-auto">{cat.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-border/50 shadow-md">
                    <CardHeader className="pb-2 border-b border-border/40">
                      <CardTitle className="text-lg font-semibold">Decision Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {reflections.length === 0 ? (
                        <div className="h-[200px] flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-muted-foreground">No reflections yet</p>
                            <p className="text-xs text-muted-foreground mt-1">Reflect on decisions to see outcome data</p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[200px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={outcomeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} unit="%" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: 'hsl(var(--background))',
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px',
                                }}
                                formatter={(value: number) => [`${value}%`, 'Percentage']}
                              />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {outcomeChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-border/50 shadow-md">
                  <CardHeader className="pb-2 border-b border-border/40">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold">Recent Decisions</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {recentDecisions.length === 0 ? (
                      <div className="p-6 text-center">
                        <p className="text-muted-foreground">No decisions yet</p>
                        <Button className="mt-4" onClick={() => navigate('/quick-decisions')}>
                          Make Your First Decision
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/40">
                        {recentDecisions.slice(0, 3).map((decision) => (
                          <DecisionHistoryItem
                            key={decision.id}
                            {...formatDecisionForDisplay(decision)}
                            onClick={() => navigate(`/decision/${decision.id}`)}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - 4 columns on large screens */}
              <div className="col-span-12 xl:col-span-4 space-y-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-none shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                        AI Suggestion
                      </Badge>
                      <todaysSuggestion.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg mt-2">{todaysSuggestion.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{todaysSuggestion.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="secondary" className="w-full" onClick={() => navigate('/quick-decisions')}>
                      {decisions.length === 0 ? "Get Started" : "Explore Now"}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border border-border/50 shadow-md">
                  <CardHeader className="pb-2 border-b border-border/40">
                    <CardTitle className="text-lg font-semibold">Decision Streak</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center py-4">
                      <div className="w-28 h-28 rounded-full border-8 border-primary/20 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full border-8 border-primary border-l-transparent border-r-transparent border-b-transparent transform -rotate-45"
                             style={{ clipPath: `inset(0 0 ${100 - Math.min((streakData.current / 14) * 100, 100)}% 0)` }} />
                        <div className="text-center">
                          <span className="text-3xl font-bold block">{streakData.current}</span>
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="text-center p-2 bg-muted/40 rounded-lg">
                        <p className="text-xs text-muted-foreground">Longest</p>
                        <p className="font-bold">{streakData.longest}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/40 rounded-lg">
                        <p className="text-xs text-muted-foreground">This Month</p>
                        <p className="font-bold">{streakData.thisMonth}</p>
                      </div>
                      <div className="text-center p-2 bg-muted/40 rounded-lg">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="font-bold">{streakData.total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/50 shadow-md">
                  <CardHeader className="pb-2 border-b border-border/40">
                    <CardTitle className="text-lg font-semibold">Follow-Ups</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {upcomingFollowUps.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground">No pending follow-ups</p>
                        <p className="text-xs text-muted-foreground mt-1">Make decisions to receive follow-up prompts</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border/40">
                        {upcomingFollowUps.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => navigate(`/reflections?decision=${item.decisionId}`)}
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Clock className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground">{item.date} • {item.decision}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="flex-shrink-0">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-border/50 shadow-md">
                <CardHeader className="border-b border-border/40">
                  <CardTitle>Decision Patterns</CardTitle>
                  <CardDescription>Your common decision-making themes</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {decisions.length < 5 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Need more decisions to identify patterns</p>
                      <p className="text-xs text-muted-foreground mt-1">Make at least 5 decisions to see insights</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Quick Decisions</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((decisions.filter(d => d.type === 'quick').length / decisions.length) * 100)}%
                          </span>
                        </div>
                        <Progress value={(decisions.filter(d => d.type === 'quick').length / decisions.length) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Deep Reflections</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((decisions.filter(d => d.type === 'deep').length / decisions.length) * 100)}%
                          </span>
                        </div>
                        <Progress value={(decisions.filter(d => d.type === 'deep').length / decisions.length) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Completed</span>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((decisions.filter(d => d.status === 'completed').length / decisions.length) * 100)}%
                          </span>
                        </div>
                        <Progress value={(decisions.filter(d => d.status === 'completed').length / decisions.length) * 100} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Reflection Rate</span>
                          <span className="text-sm text-muted-foreground">
                            {decisions.length > 0 ? Math.round((reflections.length / decisions.length) * 100) : 0}%
                          </span>
                        </div>
                        <Progress value={decisions.length > 0 ? (reflections.length / decisions.length) * 100 : 0} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border/50 shadow-md">
                <CardHeader className="border-b border-border/40">
                  <CardTitle>Decision Quality</CardTitle>
                  <CardDescription>How your decisions have performed over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {reflections.length < 3 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Need more reflections for quality analysis</p>
                      <p className="text-xs text-muted-foreground mt-1">Reflect on at least 3 decisions to see trends</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Average Satisfaction</span>
                        <span className="text-2xl font-bold">
                          {(reflections.reduce((acc, r) => {
                            const val = r.outcome === ReflectionOutcome.VERY_SATISFIED ? 5 :
                                        r.outcome === ReflectionOutcome.SATISFIED ? 4 :
                                        r.outcome === ReflectionOutcome.NEUTRAL ? 3 :
                                        r.outcome === ReflectionOutcome.UNSATISFIED ? 2 : 1;
                            return acc + val;
                          }, 0) / reflections.length).toFixed(1)}/5
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Would Repeat Decision</span>
                        <span className="text-2xl font-bold">
                          {Math.round((reflections.filter(r => r.wouldRepeat).length / reflections.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/50 shadow-md">
              <CardHeader className="border-b border-border/40">
                <CardTitle>Decision Analysis</CardTitle>
                <CardDescription>AI-powered insights based on your decision history</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {decisions.length < 5 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Make more decisions to unlock AI insights</p>
                    <p className="text-xs text-muted-foreground mt-1">{5 - decisions.length} more decisions needed</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-amber-500" />
                        <h4 className="font-medium">Top Category</h4>
                      </div>
                      <p className="text-sm">
                        Most of your decisions are about {decisionCategories[0]?.name?.toLowerCase() || "various topics"}.
                      </p>
                    </div>
                    <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">Decision Style</h4>
                      </div>
                      <p className="text-sm">
                        You prefer {decisions.filter(d => d.type === 'quick').length > decisions.filter(d => d.type === 'deep').length ? "quick" : "deep"} decisions for most choices.
                      </p>
                    </div>
                    <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Glasses className="h-5 w-5 text-purple-500" />
                        <h4 className="font-medium">Reflection Habit</h4>
                      </div>
                      <p className="text-sm">
                        {reflections.length > 0
                          ? `You've reflected on ${Math.round((reflections.length / decisions.length) * 100)}% of your decisions.`
                          : "Start reflecting on decisions to build better habits."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="border border-border/50 shadow-md">
              <CardHeader className="pb-2 border-b border-border/40">
                <div className="flex justify-between items-center">
                  <CardTitle>Decision History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate('/history')}>
                      <History className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentDecisions.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-muted-foreground">No decisions yet</p>
                    <Button className="mt-4" onClick={() => navigate('/quick-decisions')}>
                      Make Your First Decision
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-border/40">
                    {recentDecisions.map((decision) => (
                      <DecisionHistoryItem
                        key={decision.id}
                        {...formatDecisionForDisplay(decision)}
                        onClick={() => navigate(`/decision/${decision.id}`)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
