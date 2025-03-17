import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Check,
  ChevronRight, 
  Clock, 
  FileText, 
  Filter, 
  Lightbulb, 
  PencilLine,
  Plus,
  Search,
  SortAsc,
  Star,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { format, subDays } from "date-fns";

// Types and interfaces
type DecisionType = "quick" | "deep";
type DecisionStatus = "pending" | "reflected" | "learned";
type Sentiment = "positive" | "negative" | "neutral" | "mixed";

interface Decision {
  id: string;
  title: string;
  description: string;
  type: DecisionType;
  date: Date;
  category: string;
  status: DecisionStatus;
}

interface Reflection {
  id: string;
  decisionId: string;
  reflectionDate: Date;
  content: string;
  rating: number; // 1-5
  outcome: string;
  sentiment: Sentiment;
  learnings: string[];
}

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
          className="focus:outline-none"
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

// Component for a decision item
const DecisionItem = ({ decision, reflection, isExpanded, onClick }: { 
  decision: Decision; 
  reflection?: Reflection;
  isExpanded: boolean;
  onClick: () => void;
}) => {
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
                  decision.status === "reflected" 
                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200" 
                    : decision.status === "learned" 
                    ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" 
                    : "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                }
              >
                {decision.status === "reflected" 
                  ? "Reflected" 
                  : decision.status === "learned" 
                  ? "Learnings Captured" 
                  : "Awaiting Reflection"}
              </Badge>
            </div>
            <CardTitle className="text-lg">{decision.title}</CardTitle>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-sm text-muted-foreground">
              {format(decision.date, "MMM d, yyyy")}
            </span>
            {reflection && (
              <div className="mt-1">
                <StarRating rating={reflection.rating} />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 pb-4">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {decision.description}
        </p>
        {reflection && (
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-96" : "max-h-0"}`}>
            <div className="bg-muted/30 p-3 rounded-md mt-2 space-y-3">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                  <PencilLine className="h-3.5 w-3.5 text-blue-500" />
                  Reflection • {format(reflection.reflectionDate, "MMM d, yyyy")}
                </h4>
                <p className="text-sm">{reflection.content}</p>
              </div>
              
              {reflection.learnings.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    Key Learnings
                  </h4>
                  <ul className="text-sm space-y-1">
                    {reflection.learnings.map((learning, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-green-500 mt-1 flex-shrink-0" />
                        <span>{learning}</span>
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
                      ${reflection.sentiment === "positive" 
                        ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" 
                        : reflection.sentiment === "negative" 
                        ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" 
                        : reflection.sentiment === "mixed" 
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"}
                    `}
                  >
                    {reflection.outcome}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-3">
          <Button variant="ghost" size="sm" onClick={onClick}>
            {isExpanded ? "Show less" : "Show more"}
            <ChevronRight 
              className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} 
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for decisions
const generateMockDecisions = (): Decision[] => {
  return [
    {
      id: "d1",
      title: "Accept remote job offer",
      description: "Deciding between accepting the new remote position at Company X versus staying at my current job. The new role offers better pay but less stability.",
      type: "deep",
      date: subDays(new Date(), 24),
      category: "Career",
      status: "learned",
    },
    {
      id: "d2",
      title: "Choose Italian or Thai for dinner",
      description: "Deciding where to go for dinner with friends tonight. Italian offers comfort food but Thai would be a new experience.",
      type: "quick",
      date: subDays(new Date(), 15),
      category: "Lifestyle",
      status: "reflected",
    },
    {
      id: "d3",
      title: "Fix car or buy new one",
      description: "My car needs significant repairs that will cost about $2,000. Deciding whether to invest in fixing it or put that money toward a new vehicle.",
      type: "deep",
      date: subDays(new Date(), 42),
      category: "Finance",
      status: "learned",
    },
    {
      id: "d4",
      title: "Plan friend's surprise party",
      description: "Deciding what type of surprise party to plan for my friend's birthday. Options include a beach gathering, restaurant dinner, or home party.",
      type: "deep",
      date: subDays(new Date(), 30),
      category: "Relationships",
      status: "reflected",
    },
    {
      id: "d5",
      title: "Subscribe to productivity app",
      description: "Deciding whether the annual subscription to this productivity app is worth the cost, or if I should stick with free alternatives.",
      type: "quick",
      date: subDays(new Date(), 7),
      category: "Technology",
      status: "pending",
    },
    {
      id: "d6",
      title: "Join fitness class or solo workout",
      description: "Deciding between signing up for group fitness classes or continuing with my solo workout routine at home.",
      type: "quick",
      date: subDays(new Date(), 3),
      category: "Health",
      status: "pending",
    },
  ];
};

// Mock data for reflections
const generateMockReflections = (): Reflection[] => {
  return [
    {
      id: "r1",
      decisionId: "d1",
      reflectionDate: subDays(new Date(), 10),
      content: "After two weeks in the new position, I'm very glad I took this opportunity. The team is supportive, and the remote flexibility has improved my work-life balance. The higher pay has also allowed me to start saving more for my long-term goals.",
      rating: 5,
      outcome: "Excellent decision",
      sentiment: "positive",
      learnings: [
        "Trust my intuition when it aligns with my core values",
        "Don't let fear of change prevent growth opportunities",
        "Remote work substantially improves my productivity and happiness"
      ],
    },
    {
      id: "r2",
      decisionId: "d2",
      reflectionDate: subDays(new Date(), 14),
      content: "The Thai food was fantastic and everyone enjoyed trying new dishes. It was more expensive than our usual spots but worth it for the experience.",
      rating: 4,
      outcome: "Good choice",
      sentiment: "positive",
      learnings: [],
    },
    {
      id: "r3",
      decisionId: "d3",
      reflectionDate: subDays(new Date(), 30),
      content: "Fixing the car was the right call. The repairs ended up being slightly under budget and the mechanic found a few preventative fixes that will likely extend the car's life by another 2-3 years.",
      rating: 5,
      outcome: "Cost-effective solution",
      sentiment: "positive",
      learnings: [
        "Get multiple opinions on major financial decisions",
        "Don't assume the most expensive option is always best",
        "Consider long-term value, not just immediate costs"
      ],
    },
    {
      id: "r4",
      decisionId: "d4",
      reflectionDate: subDays(new Date(), 21),
      content: "The beach gathering was nice but the weather was unpredictable. Some people had trouble with transportation. Maybe a restaurant would have been easier to coordinate.",
      rating: 3,
      outcome: "Mixed results",
      sentiment: "mixed",
      learnings: [],
    },
  ];
};

// Main component
export default function ReflectionsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedDecision, setExpandedDecision] = useState<string | null>(null);
  
  // Mock data
  const decisions = generateMockDecisions();
  const reflections = generateMockReflections();
  
  // Associate reflections with decisions
  const decisionsWithReflections = decisions.map(decision => {
    const reflection = reflections.find(r => r.decisionId === decision.id);
    return { decision, reflection };
  });
  
  // Filter decisions based on active tab and search term
  const filteredDecisions = decisionsWithReflections.filter(({ decision }) => {
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "pending" && decision.status === "pending") || 
      (activeTab === "reflected" && (decision.status === "reflected" || decision.status === "learned"));
    
    const matchesSearch = 
      searchTerm === "" || 
      decision.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decision.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      decision.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesTab && matchesSearch;
  });
  
  // Calculate reflection stats
  const totalDecisions = decisions.length;
  const reflectedDecisions = decisions.filter(d => d.status !== "pending").length;
  const reflectionRate = Math.round((reflectedDecisions / totalDecisions) * 100);
  
  // Calculate average decision rating
  const averageRating = reflections.length > 0
    ? (reflections.reduce((sum, r) => sum + r.rating, 0) / reflections.length).toFixed(1)
    : "0.0";
  
  // Positive outcomes percentage
  const positiveOutcomes = reflections.filter(r => r.sentiment === "positive").length;
  const positiveRate = reflections.length > 0
    ? Math.round((positiveOutcomes / reflections.length) * 100)
    : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background/90 to-background/95">
      <main className="w-full max-w-[1800px] mx-auto py-6 px-4">
        {/* Hero section with stats */}
        <section className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">
                Decision Journal
              </h1>
              <p className="text-muted-foreground">
                Reflect on past decisions to improve future ones
              </p>
            </div>
            
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Reflection
            </Button>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Total Decisions</p>
                    <h3 className="text-2xl font-bold">{totalDecisions}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Reflection Rate</p>
                    <h3 className="text-2xl font-bold">{reflectionRate}%</h3>
                  </div>
                  <div className="p-2 rounded-full bg-purple-100">
                    <PencilLine className="h-5 w-5 text-purple-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Average Rating</p>
                    <h3 className="text-2xl font-bold">{averageRating}</h3>
                  </div>
                  <div className="p-2 rounded-full bg-amber-100">
                    <Star className="h-5 w-5 text-amber-700 fill-amber-700" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <StarRating rating={parseFloat(averageRating)} size={14} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Positive Outcomes</p>
                    <h3 className="text-2xl font-bold">{positiveRate}%</h3>
                  </div>
                  <div className="p-2 rounded-full bg-green-100">
                    <ThumbsUp className="h-5 w-5 text-green-700" />
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={positiveRate} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search decisions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <SortAsc className="h-4 w-4" />
              Sort
            </Button>
          </div>
        </div>
        
        {/* Tab navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Decisions</TabsTrigger>
            <TabsTrigger value="reflected">Reflected</TabsTrigger>
            <TabsTrigger value="pending">Awaiting Reflection</TabsTrigger>
          </TabsList>
        </Tabs>
        
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
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Reflection Insights */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Reflection Insights</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
          
          <Card className="border border-border/50 shadow-md">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h4 className="font-medium">Decision Strength</h4>
                  </div>
                  <p className="text-sm">Your career decisions tend to be your strongest, with an average rating of 4.8/5.</p>
                </div>
                
                <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <h4 className="font-medium">Reflection Time</h4>
                  </div>
                  <p className="text-sm">You typically reflect on decisions 14 days after making them, which is above average.</p>
                </div>
                
                <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <h4 className="font-medium">Learning Pattern</h4>
                  </div>
                  <p className="text-sm">You've captured detailed learnings for 50% of your decisions, focusing on long-term value.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Upcoming reflections */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Upcoming Reflections</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {decisions
              .filter(d => d.status === "pending")
              .slice(0, 3)
              .map(decision => (
                <Card key={decision.id} className="border border-border/50 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant={decision.type === "quick" ? "default" : "secondary"}>
                        {decision.type === "quick" ? "Quick" : "Deep"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(decision.date, "MMM d")}
                      </span>
                    </div>
                    <CardTitle className="text-lg mt-2">{decision.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground line-clamp-2">{decision.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2">
                      <PencilLine className="h-4 w-4" />
                      Add Reflection
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
