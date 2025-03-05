import { useState } from "react";
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
  Milestone,
  MoreHorizontal,
  Sparkles,
  ThumbsUp,
  Zap,
  LucideIcon
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Chart type definitions
type ChartType = "line" | "bar" | "area";

// Fake chart component (would use a real chart library in production)
function FakeChart({ type, color }: { type: ChartType; color: string }) {
  const barStyle = {
    display: "inline-block",
    margin: "0 2px",
    backgroundColor: color,
    borderRadius: "2px",
  };

  if (type === "line") {
    return (
      <div className="h-24 flex items-end gap-1 mt-2">
        {[40, 25, 45, 30, 60, 45, 65, 55, 70, 58, 62, 75].map((height, i) => (
          <div 
            key={i}
            style={{...barStyle, height: `${height}%`, width: "12px"}}
          />
        ))}
      </div>
    );
  }
  
  if (type === "bar") {
    return (
      <div className="h-24 flex items-end justify-between gap-1 mt-2">
        {[75, 60, 80, 65, 55].map((height, i) => (
          <div 
            key={i}
            style={{...barStyle, height: `${height}%`, width: "45px"}}
            className="relative group"
          >
            <div className="absolute -top-8 left-0 right-0 text-center text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
              {height}%
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "area") {
    return (
      <div className="h-24 relative mt-2">
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-primary/20 to-primary/5 rounded-md"></div>
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M0,50 Q10,40 20,45 T40,35 T60,45 T80,30 T100,35 V100 H0 Z" 
              fill={`${color}20`}
              stroke={color}
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  }
  
  return <div className="h-24 bg-muted/50 rounded-md mt-2 flex items-center justify-center text-muted-foreground">Chart Placeholder</div>;
}

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
}

// Decision history component
function DecisionHistoryItem({ title, type, date, outcome, icon: Icon, sentiment }: DecisionHistoryItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/40">
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
  trend: "up" | "down";
}

interface CategoryData {
  name: string;
  percentage: number;
  color: string;
}

interface FollowUpItem {
  title: string;
  date: string;
  decision: string;
}

interface StreakData {
  current: number;
  longest: number;
  thisMonth: number;
  total: number;
}

interface Suggestion {
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState("overview");
  
  // Fake data
  const insightStats: InsightStat[] = [
    { label: "Weekly Decisions", value: 12, change: "+15%", icon: Dices, trend: "up" },
    { label: "Avg. Reflection Score", value: "8.4", change: "+5%", icon: Brain, trend: "up" },
    { label: "Decision Satisfaction", value: "92%", change: "-3%", icon: ThumbsUp, trend: "down" },
    { label: "Time Saved", value: "4.5h", change: "+30%", icon: Clock, trend: "up" },
  ];
  
  const decisionCategories: CategoryData[] = [
    { name: "Work", percentage: 35, color: "bg-blue-500" },
    { name: "Lifestyle", percentage: 25, color: "bg-purple-500" },
    { name: "Finance", percentage: 20, color: "bg-green-500" },
    { name: "Relationships", percentage: 15, color: "bg-yellow-500" },
    { name: "Other", percentage: 5, color: "bg-gray-500" },
  ];
  
  const recentDecisions: DecisionHistoryItemProps[] = [
    { 
      title: "Accept remote job offer", 
      type: "deep", 
      date: "Today, 2:30 PM", 
      outcome: "Take the offer",
      icon: Milestone,
      sentiment: "positive" 
    },
    { 
      title: "Choose Italian or Thai for dinner", 
      type: "quick", 
      date: "Yesterday", 
      outcome: "Thai food",
      icon: Dices,
      sentiment: "positive" 
    },
    { 
      title: "Plan friend's surprise party", 
      type: "deep", 
      date: "Mar 28", 
      outcome: "Beach gathering",
      icon: Calendar,
      sentiment: "positive" 
    },
    { 
      title: "Fix car or buy new one", 
      type: "deep", 
      date: "Mar 25", 
      outcome: "Keep current car",
      icon: Compass,
      sentiment: "mixed" 
    },
    { 
      title: "Select project to prioritize", 
      type: "quick", 
      date: "Mar 22", 
      outcome: "Website redesign",
      icon: Lightbulb,
      sentiment: "positive" 
    },
  ];
  
  const upcomingFollowUps: FollowUpItem[] = [
    { title: "How was the Thai food?", date: "Today", decision: "Dinner choice" },
    { title: "Rate your experience with the new freelancer", date: "Tomorrow", decision: "Hiring decision" },
    { title: "Was postponing the trip the right call?", date: "Apr 5", decision: "Travel plans" },
  ];
  
  const streakData: StreakData = {
    current: 7,
    longest: 14,
    thisMonth: 22,
    total: 64
  };

  const todaysSuggestion: Suggestion = {
    title: "Update your career goals",
    description: "Based on your recent decisions, it might be time to revisit your career objectives.",
    icon: Sparkles
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background/90 to-background/95">
      <main className="w-full max-w-[1800px] mx-auto py-6 px-4">
        {/* Hero section */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Welcome back, {currentUser?.displayName || "Dang Phung"}
              </h1>
              <p className="text-muted-foreground">
                Your decision intelligence dashboard • <span className="text-primary font-medium">Wednesday, April 3</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span>{streakData.current} day streak</span>
              </Badge>
              
              <Button>
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
                      stat.trend === "up" ? "bg-green-100" : "bg-amber-100"
                    }`}>
                      <stat.icon className={`h-5 w-5 ${
                        stat.trend === "up" ? "text-green-700" : "text-amber-700"
                      }`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <Badge variant={stat.trend === "up" ? "default" : "destructive"} className={`text-xs font-medium ${stat.trend === "up" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}`}>
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
                <Card className="overflow-hidden border border-border/50 shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/40">
                    <CardTitle className="text-lg font-semibold">Decision Activity</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View all</DropdownMenuItem>
                        <DropdownMenuItem>Export data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-6">
                    <FakeChart type="area" color="hsl(var(--primary))" />
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-border/50 shadow-md">
                    <CardHeader className="pb-2 border-b border-border/40">
                      <CardTitle className="text-lg font-semibold">Decisions by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {decisionCategories.map((category, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{category.name}</span>
                              <span className="text-sm text-muted-foreground">{category.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${category.color}`} 
                                style={{ width: `${category.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-border/50 shadow-md">
                    <CardHeader className="pb-2 border-b border-border/40">
                      <CardTitle className="text-lg font-semibold">Decision Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <FakeChart type="bar" color="hsl(var(--primary))" />
                      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Positive</p>
                          <p className="text-lg font-bold">75%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Neutral</p>
                          <p className="text-lg font-bold">18%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Mixed</p>
                          <p className="text-lg font-bold">7%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border border-border/50 shadow-md">
                  <CardHeader className="pb-2 border-b border-border/40">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg font-semibold">Recent Decisions</CardTitle>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/40">
                      {recentDecisions.slice(0, 3).map((decision, index) => (
                        <DecisionHistoryItem 
                          key={index}
                          {...decision}
                        />
                      ))}
                    </div>
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
                    <Button variant="secondary" className="w-full">
                      Explore Now
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
                        <div className="absolute inset-0 rounded-full border-8 border-primary border-l-transparent border-r-transparent border-b-transparent transform -rotate-45" />
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
                    <div className="divide-y divide-border/40">
                      {upcomingFollowUps.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Safety-oriented</span>
                        <span className="text-sm text-muted-foreground">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Value-driven</span>
                        <span className="text-sm text-muted-foreground">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Long-term focused</span>
                        <span className="text-sm text-muted-foreground">58%</span>
                      </div>
                      <Progress value={58} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Risk-taking</span>
                        <span className="text-sm text-muted-foreground">35%</span>
                      </div>
                      <Progress value={35} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-border/50 shadow-md">
                <CardHeader className="border-b border-border/40">
                  <CardTitle>Decision Quality</CardTitle>
                  <CardDescription>How your decisions have performed over time</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <FakeChart type="line" color="hsl(var(--primary))" />
                </CardContent>
              </Card>
            </div>
            
            <Card className="border border-border/50 shadow-md">
              <CardHeader className="border-b border-border/40">
                <CardTitle>Decision Analysis</CardTitle>
                <CardDescription>AI-powered insights based on your decision history</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      <h4 className="font-medium">Top Strength</h4>
                    </div>
                    <p className="text-sm">You excel at making consistent decisions aligned with your stated values.</p>
                  </div>
                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <h4 className="font-medium">Opportunity</h4>
                    </div>
                    <p className="text-sm">Consider exploring more options before finalizing important decisions.</p>
                  </div>
                  <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Glasses className="h-5 w-5 text-purple-500" />
                      <h4 className="font-medium">Pattern</h4>
                    </div>
                    <p className="text-sm">You tend to make better decisions in the morning vs. evening hours.</p>
                  </div>
                </div>
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
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/40">
                  {recentDecisions.map((decision, index) => (
                    <DecisionHistoryItem 
                      key={index}
                      {...decision}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 