# Implementation Plan - Connect Real Data
## Solus Application Data Integration

---

## Current State Analysis

### ✅ What Works
1. **Quick Decision Flow** - Users can create decisions, but...
   - Data gets saved to Firestore ✅
   - BUT: Not displayed anywhere after creation ❌
   - No way to view saved decisions ❌

2. **Database Layer** - All CRUD operations exist
   - `createQuickDecision()` ✅
   - `getQuickDecision()` ✅
   - `listQuickDecisions()` ✅
   - `getDashboardStats()` ✅ (function exists but not used)

3. **AI Services** - Working
   - Extract decision options ✅
   - Generate recommendations ✅

### ❌ What's Missing (HARDCODED)

1. **Dashboard Page** (`DashboardPage.tsx`)
   - All stats are fake numbers
   - Recent decisions are mock data
   - Charts show fake data
   - No Firebase queries

2. **Reflections Page** (`ReflectionsPage.tsx`)
   - Generates mock decisions with `generateMockDecisions()`
   - Generates mock reflections with `generateMockReflections()`
   - No real database integration

3. **Profile Page** (need to check)
   - Likely hardcoded user data

4. **Decision History Page**
   - Doesn't exist yet
   - Needed to view past decisions

5. **Decision Detail Page**
   - Doesn't exist
   - Can't view full decision after creation

---

## Implementation Tasks

### Phase 1: Data Flow Foundation (HIGH PRIORITY)

#### Task 1.1: Dashboard Database Integration
**File**: `src/Core/Dashboard/DashboardPage.tsx`
**Effort**: 1 day

Replace hardcoded data with real queries:
```typescript
// Instead of fake data:
const insightStats = [hardcoded...];

// Do this:
const [stats, setStats] = useState<DashboardStats | null>(null);
useEffect(() => {
  async function loadStats() {
    const data = await getDashboardStats(user.uid);
    setStats(data);
  }
  loadStats();
}, [user]);
```

**Implementation Steps**:
1. Add `useEffect` hooks to load data
2. Query `getDashboardStats(userId)`
3. Query `listQuickDecisions(userId, { limit: 5 })`  for recent decisions
4. Calculate real stats (decisions this week/month)
5. Add loading states
6. Add error handling

---

#### Task 1.2: Decision History Page
**File**: `src/Core/Decisions/DecisionHistoryPage.tsx` (NEW)
**Effort**: 1 day

Create dedicated page to view all decisions:
- List all quick decisions for user
- Filter by category
- Search by title
- Sort by date
- Pagination (20 per page)
- Click to view details

**Implementation**:
```typescript
export default function DecisionHistoryPage() {
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<QuickDecision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecisions() {
      if (!user) return;
      const data = await listQuickDecisions(user.uid);
      setDecisions(data);
      setLoading(false);
    }
    loadDecisions();
  }, [user]);

  // ... rest of component
}
```

---

#### Task 1.3: Decision Detail Page
**File**: `src/Core/Decisions/DecisionDetailPage.tsx` (NEW)
**Effort**: 0.5 days

View full decision with all details:
- Decision title, category, status
- All options with pros/cons
- AI recommendation
- Selected option
- Reflection (if exists)
- Edit button
- Delete button

**Route**: `/decisions/:id`

---

#### Task 1.4: Reflections Page Real Data
**File**: `src/Core/Reflections/ReflectionsPage.tsx`
**Effort**: 0.5 days

Replace mock data with real queries:
1. Remove `generateMockDecisions()` and `generateMockReflections()`
2. Query real decisions with reflections
3. Join decisions with reflections from Firestore
4. Calculate real stats

---

#### Task 1.5: Profile Page Real Data
**File**: `src/Core/Profile/ProfilePage.tsx`
**Effort**: 0.5 days

Show real user data:
- User display name
- Email
- Subscription tier
- Account creation date
- Decision count
- Allow editing

---

### Phase 2: Missing Functionality

#### Task 2.1: Create Reflection Form
**File**: `src/Core/Reflections/Components/CreateReflectionForm.tsx` (NEW)
**Effort**: 1 day

Modal/page to add reflection to a decision:
- Decision reference
- Outcome rating (1-5 stars)
- Notes (text area)
- Would choose again? (yes/no)
- Lessons learned (text)
- Submit to Firestore

---

#### Task 2.2: Decision Stats Calculator
**File**: `src/db/Dashboard/dashboardDb.ts`
**Effort**: 0.5 days

Implement `getDashboardStats()` properly:
```typescript
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  // Query all decisions
  const allDecisions = await listQuickDecisions(userId);

  // Calculate this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const thisWeek = allDecisions.filter(d => d.createdAt >= oneWeekAgo);

  // Calculate this month
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const thisMonth = allDecisions.filter(d => d.createdAt >= oneMonthAgo);

  // Get reflections
  const reflections = await getAllReflections(userId);
  const avgRating = reflections.length > 0
    ? reflections.reduce((sum, r) => sum + r.outcomeRating, 0) / reflections.length
    : 0;

  // Top category
  const categoryCounts: Record<string, number> = {};
  allDecisions.forEach(d => {
    categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
  });
  const topCategory = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'None';

  return {
    totalDecisions: allDecisions.length,
    quickDecisions: allDecisions.length,
    deepDecisions: 0, // TODO: query deep decisions
    decisionsThisWeek: thisWeek.length,
    decisionsThisMonth: thisMonth.length,
    averageOutcomeRating: avgRating,
    topCategory,
    completionRate: (allDecisions.filter(d => d.status === 'completed').length / allDecisions.length) * 100,
  };
}
```

---

#### Task 2.3: Pattern Recognition (AI)
**File**: `src/lib/ai/insightsService.ts` (NEW)
**Effort**: 2 days

Analyze user decisions and generate insights:
- Most common decision category
- Average time to decide
- Best outcomes by category
- Decision-making patterns
- Recommendations for improvement

Use Gemini Pro to analyze all decisions and generate personalized insights.

---

#### Task 2.4: Real-time Updates
**Effort**: 0.5 days

Add Firestore real-time listeners:
```typescript
useEffect(() => {
  if (!user) return;

  const unsubscribe = onSnapshot(
    query(
      collection(db, 'quickDecisions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    ),
    (snapshot) => {
      const decisions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDecisions(decisions);
    }
  );

  return () => unsubscribe();
}, [user]);
```

---

### Phase 3: Enhancements

#### Task 3.1: Loading Skeletons
**Effort**: 0.5 days

Add proper loading states instead of showing empty content:
- Dashboard skeleton
- Decision list skeleton
- Profile skeleton

---

#### Task 3.2: Error States
**Effort**: 0.5 days

Handle errors gracefully:
- Network errors
- Empty states
- Permission errors
- Not found states

---

#### Task 3.3: Optimistic UI Updates
**Effort**: 0.5 days

Immediate feedback on actions:
- Delete decision (remove from UI immediately)
- Create reflection (show immediately)
- Update decision (instant update)

---

#### Task 3.4: Data Visualizations
**Effort**: 1 day

Add real charts using recharts library:
- Decisions over time (line chart)
- Category distribution (pie chart)
- Outcome ratings (bar chart)

---

## Implementation Order (Prioritized)

### Week 1 (Days 1-3)
1. ✅ Dashboard real data integration (1 day)
2. ✅ Decision History page (1 day)
3. ✅ Decision Detail page (0.5 days)
4. ✅ Reflections page real data (0.5 days)

### Week 2 (Days 4-6)
5. ✅ Stats calculator implementation (0.5 days)
6. ✅ Create Reflection form (1 day)
7. ✅ Profile page real data (0.5 days)
8. ✅ Loading states & skeletons (0.5 days)
9. ✅ Error handling (0.5 days)

### Week 3 (Days 7-10)
10. ✅ Real-time listeners (0.5 days)
11. ✅ Optimistic UI (0.5 days)
12. ✅ Pattern recognition AI (2 days)
13. ✅ Data visualizations (1 day)

---

## Success Criteria

After implementation:
- [ ] Dashboard shows real user stats
- [ ] Can view all past decisions
- [ ] Can click decision to see full details
- [ ] Can add reflections to decisions
- [ ] Reflections page shows real data
- [ ] Profile shows real user info
- [ ] Stats accurately calculated from database
- [ ] Loading states while fetching data
- [ ] Error states for failures
- [ ] Real-time updates when data changes

---

## Files to Create

1. `src/Core/Decisions/DecisionHistoryPage.tsx`
2. `src/Core/Decisions/DecisionDetailPage.tsx`
3. `src/Core/Reflections/Components/CreateReflectionForm.tsx`
4. `src/lib/ai/insightsService.ts`
5. `src/components/LoadingSkeleton.tsx`
6. `src/components/EmptyState.tsx`

## Files to Modify

1. `src/Core/Dashboard/DashboardPage.tsx` - Replace all fake data
2. `src/Core/Reflections/ReflectionsPage.tsx` - Remove mock data generators
3. `src/Core/Profile/ProfilePage.tsx` - Show real user data
4. `src/db/Dashboard/dashboardDb.ts` - Implement real stats calculation
5. `src/db/Reflection/reflectionDb.ts` - Add `getAllReflections(userId)`
6. `src/App.tsx` - Add new routes for Decision History/Detail

---

## Database Queries Needed

```typescript
// Dashboard
getDashboardStats(userId) - Calculate all stats
listQuickDecisions(userId, { limit: 5 }) - Recent decisions
getAllReflections(userId) - For average rating

// History
listQuickDecisions(userId, { category?, status?, limit, startAfter })

// Detail
getQuickDecision(id)
getReflectionsForDecision(decisionId)

// Reflections
listQuickDecisions(userId) - All decisions
getAllReflections(userId) - All reflections
```

---

## Next Steps

1. Start with Dashboard integration (highest visibility)
2. Create Decision History page (core missing feature)
3. Connect Reflections to real data
4. Build out remaining features
5. Add polish (loading, errors, optimistic UI)

**Estimated Total Time**: 2-3 weeks of focused development

