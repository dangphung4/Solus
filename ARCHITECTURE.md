# Technical Architecture Document
## Solus - AI-Powered Decision Assistant

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-21
**Maintained By**: Development Team
**Status**: Active

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [System Architecture](#system-architecture)
4. [Data Architecture](#data-architecture)
5. [Component Architecture](#component-architecture)
6. [AI/ML Architecture](#aiml-architecture)
7. [Security Architecture](#security-architecture)
8. [Deployment Architecture](#deployment-architecture)
9. [Scaling Strategy](#scaling-strategy)
10. [Monitoring & Observability](#monitoring--observability)
11. [Technical Debt & Future Improvements](#technical-debt--future-improvements)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Mobile     │  │   Tablet     │  │   Desktop    │      │
│  │   Browser    │  │   Browser    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                     Progressive Web App (PWA)                │
│                    React 19 + Vite + TypeScript              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Service Worker                          │
│             Offline Caching + Background Sync                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│                      Firebase SDK                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         ↓                                         ↓
┌──────────────────────┐              ┌──────────────────────┐
│  Firebase Services   │              │   External APIs      │
│  ┌────────────────┐  │              │  ┌────────────────┐  │
│  │ Authentication │  │              │  │  Gemini AI     │  │
│  │ Firestore DB   │  │              │  │  (via Vercel   │  │
│  │ Cloud Functions│  │              │  │   AI SDK)      │  │
│  │ Hosting        │  │              │  └────────────────┘  │
│  │ Storage        │  │              │  ┌────────────────┐  │
│  └────────────────┘  │              │  │ Web Speech API │  │
└──────────────────────┘              │  │ (Browser Native)│  │
                                      │  └────────────────┘  │
                                      └──────────────────────┘
```

### Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript | UI framework with type safety |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Styling** | Tailwind CSS v3 | Utility-first CSS framework |
| **Components** | shadcn/ui | Radix UI-based component library |
| **State** | React Context API | Auth and theme management |
| **Routing** | React Router v6 | Client-side routing |
| **PWA** | vite-plugin-pwa, Workbox | Service worker and offline support |
| **Backend** | Firebase (BaaS) | Authentication, database, hosting |
| **Database** | Firestore | NoSQL document database |
| **Functions** | Firebase Cloud Functions | Serverless backend logic |
| **AI/ML** | Google Gemini AI | LLM for recommendations |
| **AI SDK** | Vercel AI SDK | Structured AI outputs |
| **Validation** | Zod | Schema validation |
| **Testing** | Vitest, React Testing Library | Unit and integration tests |
| **CI/CD** | GitHub Actions | Automated testing and deployment |

---

## Architecture Principles

### 1. Vertical Slice Architecture

**Philosophy**: Organize code by feature, not technical layer

**Benefits**:
- Features are self-contained and independent
- Easier to understand and maintain
- Faster development (no cross-layer navigation)
- Better scalability (add features without touching existing code)

**Implementation**:
```
src/Core/
├── QuickDecisions/          # Complete vertical slice
│   ├── QuickDecisionsPage.tsx      # Page component
│   └── Components/                  # Feature-specific components
│       ├── OptionsList.tsx
│       ├── ContextInput.tsx
│       └── RecommendationCard.tsx
├── DeepReflections/         # Another vertical slice
├── Dashboard/               # Another vertical slice
└── Shared/                  # Shared components only
```

### 2. Mobile-First Progressive Enhancement

- Design for mobile screens first (320px+)
- Add responsive breakpoints for larger screens
- Touch-friendly UI (44px minimum touch targets)
- Progressive enhancement (works without JS, better with JS)

### 3. Type-First Development

- Define TypeScript interfaces before implementation
- Interfaces over types (`interface User {}` vs `type User = {}`)
- Strict type checking enabled
- No `any` types without justification

### 4. AI-Centric Design

- AI is core to product, not a feature
- Graceful degradation when AI fails
- Transparent about AI limitations
- User always has final control

### 5. Privacy-First Approach

- Minimal data collection
- User owns their data
- GDPR-compliant data deletion
- No third-party analytics beyond Firebase

---

## System Architecture

### Frontend Architecture

#### Component Hierarchy

```
App.tsx (Root)
├── AuthProvider (Context)
│   └── ThemeProvider (Context)
│       └── Router
│           ├── PublicRoutes
│           │   ├── LandingPage
│           │   ├── SignInPage
│           │   └── SignUpPage
│           └── ProtectedRoutes (requires auth)
│               ├── DashboardPage
│               ├── QuickDecisionsPage
│               ├── DeepReflectionsPage
│               ├── ReflectionsPage
│               └── ProfilePage
```

#### State Management Strategy

**Level 1: Local Component State** (`useState`)
- Form inputs
- UI toggles (modals, dropdowns)
- Step navigation
- Temporary data

**Level 2: Context API**
- Authentication state (user, loading, signIn, signOut)
- Theme state (dark mode, light mode)
- Shared across many components

**Level 3: Zustand** (Future)
- Complex global state if needed
- Currently available but unused

**Decision Tree**:
```
Does only one component need this state?
  └─ Yes: Use useState

Does the state need to be shared across multiple components?
  └─ Yes: Are they close in the component tree?
      ├─ Yes: Lift state up to common parent
      └─ No: Use Context API

Is the state complex with many interdependencies?
  └─ Yes: Consider Zustand (future)
```

#### Data Flow

```
User Action (UI Event)
       ↓
Event Handler (Component)
       ↓
Service Layer (db/, lib/ai/)
       ↓
Firebase/Gemini API
       ↓
Service Layer (response processing)
       ↓
State Update (setState or Context)
       ↓
Re-render (React)
       ↓
UI Update
```

---

### Backend Architecture (Firebase)

#### Firebase Services

**1. Firebase Authentication**
- Email/password authentication
- Google OAuth provider
- Session management (30-day tokens)
- Password reset flows

**2. Firestore Database**
- NoSQL document database
- Real-time listeners for live updates
- Offline persistence enabled
- Security rules for access control

**3. Firebase Cloud Functions** (Planned)
- Scheduled functions (follow-up prompts)
- Background processing (analytics)
- Webhooks (payment processing)
- Triggered functions (on user creation, decision saved)

**4. Firebase Hosting**
- Static asset hosting
- CDN distribution
- SSL certificates (automatic)
- Custom domain support

**5. Firebase Storage** (Future)
- Audio recordings (voice input)
- Data exports (CSV, JSON)
- User uploads (images for decisions)

#### Cloud Functions Architecture (Planned)

```typescript
// Scheduled Functions
exports.sendDailyFollowUps = functions.pubsub
  .schedule('every day 09:00')
  .onRun(async (context) => {
    // Send follow-up prompts for decisions made 2 days ago
  });

exports.generateWeeklyInsights = functions.pubsub
  .schedule('every sunday 20:00')
  .onRun(async (context) => {
    // Analyze user patterns and generate insights
  });

// HTTP Functions
exports.processPayment = functions.https.onRequest(async (req, res) => {
  // Handle Stripe webhook for subscription payments
});

// Firestore Triggers
exports.onDecisionCreated = functions.firestore
  .document('quickDecisions/{decisionId}')
  .onCreate(async (snap, context) => {
    // Update user stats, send notifications, etc.
  });
```

---

## Data Architecture

### Database Schema

#### Collections Structure

```
firestore/
├── users/                          # User profiles
│   └── {userId}/
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── subscriptionTier: 'free' | 'premium'
│       ├── preferences: {}
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── quickDecisions/                 # Quick decision data
│   └── {decisionId}/
│       ├── type: 'quick'           # Discriminator
│       ├── userId: string
│       ├── title: string
│       ├── category: DecisionCategory
│       ├── status: DecisionStatus
│       ├── options: Array<Option>
│       ├── contextFactors: string[]
│       ├── gutFeeling: string
│       ├── recommendation: {}
│       ├── selectedOption: string
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── deepDecisions/                  # Deep reflection data
│   └── {decisionId}/
│       ├── type: 'deep'            # Discriminator
│       ├── userId: string
│       ├── title: string
│       ├── category: DecisionCategory
│       ├── status: DecisionStatus
│       ├── values: string[]
│       ├── longTermGoals: string[]
│       ├── stakeholders: string[]
│       ├── options: Array<Option>
│       ├── prosConsAnalysis: {}
│       ├── futureScenarios: {}
│       ├── cognitiveBiases: string[]
│       ├── recommendation: {}
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── reflections/                    # Post-decision reflections
│   └── {reflectionId}/
│       ├── decisionId: string
│       ├── userId: string
│       ├── decisionType: 'quick' | 'deep'
│       ├── outcomeRating: number   # 1-5 stars
│       ├── notes: string
│       ├── wouldChooseAgain: boolean
│       ├── lessonsLearned: string
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── templates/                      # Decision templates (future)
│   └── {templateId}/
│       ├── name: string
│       ├── category: DecisionCategory
│       ├── isPublic: boolean
│       ├── createdBy: string
│       ├── usageCount: number
│       └── template: {}
│
└── subscriptions/                  # Premium subscriptions (future)
    └── {subscriptionId}/
        ├── userId: string
        ├── tier: 'free' | 'premium'
        ├── stripeCustomerId: string
        ├── stripeSubscriptionId: string
        ├── status: 'active' | 'cancelled' | 'past_due'
        ├── currentPeriodStart: Timestamp
        ├── currentPeriodEnd: Timestamp
        └── cancelAtPeriodEnd: boolean
```

#### TypeScript Type System

**Type Hierarchy**:

```typescript
// Base Decision (shared properties)
interface BaseDecision {
  id: string;
  userId: string;
  title: string;
  category: DecisionCategory;
  status: DecisionStatus;
  importance?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Quick Decision (extends base)
interface QuickDecision extends BaseDecision {
  type: 'quick';  // Discriminator for union type
  options: Array<{
    id: string;
    text: string;
    selected: boolean;
    pros?: string[];
    cons?: string[];
  }>;
  contextFactors?: string[];
  gutFeeling?: string;
  recommendation?: {
    optionId: string;
    reasoning: string;
    confidence: number;
  };
  selectedOption?: string;
}

// Deep Decision (extends base)
interface DeepDecision extends BaseDecision {
  type: 'deep';  // Discriminator for union type
  values: string[];
  longTermGoals: string[];
  stakeholders: string[];
  options: Array<Option>;
  prosConsAnalysis?: ProsConsAnalysis;
  futureScenarios?: FutureScenario[];
  cognitiveBiases?: string[];
  recommendation?: DeepRecommendation;
}

// Union type for polymorphism
type Decision = QuickDecision | DeepDecision;

// Type narrowing example
function processDecision(decision: Decision) {
  if (decision.type === 'quick') {
    // TypeScript knows decision is QuickDecision
    console.log(decision.options);
  } else {
    // TypeScript knows decision is DeepDecision
    console.log(decision.values);
  }
}
```

#### Enums

```typescript
export enum DecisionCategory {
  FOOD = 'food',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  CAREER = 'career',
  RELATIONSHIPS = 'relationships',
  HEALTH = 'health',
  FINANCE = 'finance',
  EDUCATION = 'education',
  TRAVEL = 'travel',
  OTHER = 'other',
}

export enum DecisionStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  IMPLEMENTED = 'implemented',
  ARCHIVED = 'archived',
}
```

#### Indexing Strategy

**Firestore Composite Indexes**:

```yaml
# firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "quickDecisions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "quickDecisions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "quickDecisions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "updatedAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**Query Patterns**:

```typescript
// Get recent decisions for user
const decisions = await getDocs(
  query(
    collection(db, 'quickDecisions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
);

// Get decisions by category
const foodDecisions = await getDocs(
  query(
    collection(db, 'quickDecisions'),
    where('userId', '==', userId),
    where('category', '==', DecisionCategory.FOOD),
    orderBy('createdAt', 'desc')
  )
);
```

---

## Component Architecture

### Core Components

#### 1. Quick Decisions Page

**File**: `src/Core/QuickDecisions/QuickDecisionsPage.tsx`

**Responsibilities**:
- Orchestrate quick decision flow
- Manage multi-step state (steps 1-4)
- Coordinate voice/text input
- Display AI recommendation
- Save decision to database

**State**:
```typescript
const [step, setStep] = useState(1);
const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('voice');
const [title, setTitle] = useState('');
const [options, setOptions] = useState<Option[]>([]);
const [contextFactors, setContextFactors] = useState<string[]>([]);
const [gutFeeling, setGutFeeling] = useState('');
const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
const [loading, setLoading] = useState(false);
```

**Flow**:
```
Step 1: Choose input method (voice or text)
Step 2: Input decision (AI extracts title, options, context)
Step 3: Review and edit extracted information
Step 4: Get AI recommendation
Step 5: Accept/modify and save decision
```

#### 2. Dashboard Page

**File**: `src/Core/Dashboard/DashboardPage.tsx`

**Responsibilities**:
- Display decision statistics
- Show recent decisions
- Highlight patterns and insights
- Provide quick actions (new decision, view history)

**Data Sources**:
- `getDashboardStats(userId)` - User statistics
- `getRecentDecisions(userId)` - Recent decision list
- `getUserInsights(userId)` - AI-generated insights

#### 3. Shared Components

**Navbar** (`src/Core/Shared/Navbar.tsx`)
- Logo and navigation links
- User profile menu
- Theme toggle
- Mobile hamburger menu

**Footer** (`src/Core/Shared/Footer.tsx`)
- Copyright notice
- Links (Privacy, Terms, About)
- Social media icons

### shadcn/ui Components

**Available Components**:
- Button (variants: default, outline, ghost, destructive)
- Card (for decision cards, recommendations)
- Input (text fields, search)
- Select (dropdowns for categories)
- Dialog (modals for confirmations)
- Badge (for tags, categories)
- Skeleton (loading states)
- Toast (notifications)

**Usage Example**:
```typescript
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Quick Decision</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default" onClick={handleSubmit}>
      Get Recommendation
    </Button>
  </CardContent>
</Card>
```

---

## AI/ML Architecture

### Gemini AI Integration

#### Model Selection

**Gemini Flash 2.0** (`gemini-2.0-flash`)
- **Use Case**: Quick decisions, voice input processing, real-time interactions
- **Characteristics**: Fast (<1s response), lower cost, good for structured tasks
- **API Calls**:
  - `extractDecisionOptions()`
  - `generateRecommendation()` (quick mode)
  - `processSpeechInput()`

**Gemini Pro 1.5** (`gemini-1.5-pro-latest`)
- **Use Case**: Deep reflections, complex analysis, nuanced reasoning
- **Characteristics**: More capable (2-5s response), higher cost, better reasoning
- **API Calls**:
  - `generateDeepAnalysis()`
  - `identifyCognitiveBiases()`
  - `generateFutureScenarios()`

**Gemini Pro with Search** (`gemini-1.5-pro-latest` + `useSearchGrounding: true`)
- **Use Case**: Decisions requiring real-time information (restaurants, events, news)
- **Characteristics**: Access to Google Search, up-to-date info, higher cost
- **API Calls**:
  - `getContextualRecommendations()` (future feature)

#### AI Service Layer

**Architecture**:

```
src/lib/ai/
├── provider.ts              # AI model configuration
├── quickDecisionService.ts  # Quick decision AI functions
├── reflectionService.ts     # Reflection AI functions (future)
└── utils.ts                 # Shared AI utilities
```

**provider.ts**:
```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY,
});

export const geminiPro = google('gemini-1.5-pro-latest');
export const geminiFlash = google('gemini-2.0-flash');
export const geminiProWithSearch = google('gemini-1.5-pro-latest', {
  useSearchGrounding: true,
});
```

**quickDecisionService.ts**:
```typescript
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { geminiFlash } from './provider';

export async function extractDecisionOptions(userInput: string) {
  const schema = z.object({
    title: z.string().describe('Concise decision title'),
    category: z.nativeEnum(DecisionCategory),
    options: z.array(z.object({
      text: z.string(),
      pros: z.array(z.string()).min(1),
      cons: z.array(z.string()).min(1)
    })).min(1),
    contextFactors: z.array(z.string()).optional(),
  });

  const result = await generateObject({
    model: geminiFlash,
    schema,
    prompt: `Extract decision information from: ${userInput}`,
  });

  return result.object;
}

export async function generateRecommendation(
  title: string,
  options: Option[],
  context: string[],
  gutFeeling?: string
) {
  const recommendationSchema = z.object({
    recommendedOption: z.string(),
    reasoning: z.string().min(50),
    confidence: z.number().min(0).max(1),
    alternativeConsideration: z.string().optional(),
  });

  try {
    // Try structured output first
    const result = await generateObject({
      model: geminiFlash,
      schema: recommendationSchema,
      prompt: buildPrompt(title, options, context, gutFeeling),
    });

    return result.object;
  } catch (error) {
    // Fallback to text generation
    console.warn('Structured AI failed, using text fallback');

    const { text } = await generateText({
      model: geminiFlash,
      prompt: buildPrompt(title, options, context, gutFeeling),
    });

    // Parse text manually
    return parseTextRecommendation(text, options);
  }
}
```

#### Error Handling & Fallbacks

**Three-Tier Fallback Strategy**:

```typescript
export async function generateSmartRecommendation(decision: QuickDecision) {
  // Tier 1: Try structured output (best quality)
  try {
    const result = await generateObject({
      model: geminiFlash,
      schema: recommendationSchema,
      prompt: buildPrompt(decision),
    });
    return result.object;
  } catch (structuredError) {
    console.warn('Tier 1 failed (structured output):', structuredError);

    // Tier 2: Try text generation (good quality)
    try {
      const { text } = await generateText({
        model: geminiFlash,
        prompt: buildPrompt(decision),
      });
      return parseTextRecommendation(text, decision.options);
    } catch (textError) {
      console.warn('Tier 2 failed (text generation):', textError);

      // Tier 3: Simple heuristic (basic quality)
      return generateHeuristicRecommendation(decision);
    }
  }
}

// Tier 3: Simple rule-based fallback
function generateHeuristicRecommendation(decision: QuickDecision) {
  // Pick option with most pros and fewest cons
  const scored = decision.options.map(opt => ({
    option: opt,
    score: (opt.pros?.length || 0) - (opt.cons?.length || 0)
  }));

  const best = scored.sort((a, b) => b.score - a.score)[0];

  return {
    recommendedOption: best.option.text,
    reasoning: `Based on the pros and cons, ${best.option.text} appears to be the best choice with the most advantages.`,
    confidence: 0.6,
  };
}
```

#### Prompt Engineering

**Quick Decision Prompt Template**:

```typescript
function buildQuickDecisionPrompt(decision: QuickDecision): string {
  return `
You are an AI decision assistant helping someone make a choice.

Decision: ${decision.title}
Category: ${decision.category}

Options:
${decision.options.map((opt, i) => `
${i + 1}. ${opt.text}
   Pros: ${opt.pros?.join(', ') || 'None listed'}
   Cons: ${opt.cons?.join(', ') || 'None listed'}
`).join('\n')}

${decision.contextFactors?.length ? `
Context: ${decision.contextFactors.join(', ')}
` : ''}

${decision.gutFeeling ? `
User's gut feeling: ${decision.gutFeeling}
` : ''}

Provide a thoughtful recommendation:
1. Choose the option that best fits the context
2. Explain your reasoning clearly
3. Consider the user's gut feeling if provided
4. Be concise but thorough (3-5 sentences)
5. Express confidence as a number between 0 and 1

Remember: You're advising, not deciding. The user always has final say.
  `.trim();
}
```

#### Rate Limiting & Cost Management

**Strategy**:
- Cache AI responses for identical decisions (localStorage)
- Implement user-based rate limiting (100 requests/day free, unlimited premium)
- Use Gemini Flash for most calls (cheaper)
- Reserve Gemini Pro for complex decisions only
- Monitor API costs with Firebase Cloud Functions

**Implementation**:
```typescript
// Rate limiting check
async function checkRateLimit(userId: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userData = userDoc.data();

  if (userData.subscriptionTier === 'premium') {
    return true; // Unlimited
  }

  // Free tier: 10 quick decisions per day
  const todayKey = new Date().toISOString().split('T')[0];
  const usageKey = `usage_${todayKey}`;
  const todayUsage = userData[usageKey] || 0;

  return todayUsage < 10;
}

// Increment usage
async function incrementUsage(userId: string): Promise<void> {
  const todayKey = new Date().toISOString().split('T')[0];
  const usageKey = `usage_${todayKey}`;

  await updateDoc(doc(db, 'users', userId), {
    [usageKey]: increment(1)
  });
}
```

---

## Security Architecture

### Authentication Security

**Firebase Auth Features**:
- Secure token-based authentication
- Automatic token refresh
- Session expiration (30 days)
- Password strength requirements
- Email verification (optional)
- Rate limiting on auth endpoints

**Implementation**:
```typescript
// Sign up with validation
export async function signUpWithEmail(email: string, password: string) {
  // Validate password strength
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Create user profile in Firestore
  await createUser({
    id: userCredential.user.uid,
    email: email,
    displayName: email.split('@')[0],
    subscriptionTier: 'free',
    createdAt: new Date(),
  });

  return userCredential.user;
}
```

### Firestore Security Rules

**Rules File** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    function isPremium() {
      return isAuthenticated() &&
             get(/databases/$(database)/documents/users/$(request.auth.uid))
               .data.subscriptionTier == 'premium';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isOwner(userId);
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId);
      allow delete: if isOwner(userId);
    }

    // Quick decisions
    match /quickDecisions/{decisionId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Deep decisions
    match /deepDecisions/{decisionId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() &&
                       isPremium() &&
                       request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }

    // Reflections
    match /reflections/{reflectionId} {
      allow read: if isOwner(resource.data.userId);
      allow create: if isAuthenticated() &&
                       request.resource.data.userId == request.auth.uid;
      allow update: if isOwner(resource.data.userId);
      allow delete: if isOwner(resource.data.userId);
    }
  }
}
```

### Data Privacy

**GDPR Compliance**:
- User data export functionality
- Complete data deletion on account deletion
- Data retention policies (7 days after deletion request)
- Clear privacy policy and terms of service

**Data Export**:
```typescript
export async function exportUserData(userId: string): Promise<UserDataExport> {
  const [user, decisions, reflections] = await Promise.all([
    getUser(userId),
    getAllDecisions(userId),
    getAllReflections(userId),
  ]);

  return {
    user,
    decisions,
    reflections,
    exportedAt: new Date().toISOString(),
  };
}
```

**Data Deletion**:
```typescript
export async function deleteUserAccount(userId: string): Promise<void> {
  const batch = writeBatch(db);

  // Delete all user decisions
  const decisions = await getDocs(
    query(collection(db, 'quickDecisions'), where('userId', '==', userId))
  );
  decisions.forEach(doc => batch.delete(doc.ref));

  // Delete all reflections
  const reflections = await getDocs(
    query(collection(db, 'reflections'), where('userId', '==', userId))
  );
  reflections.forEach(doc => batch.delete(doc.ref));

  // Delete user profile
  batch.delete(doc(db, 'users', userId));

  await batch.commit();

  // Delete Firebase Auth user
  const user = auth.currentUser;
  if (user && user.uid === userId) {
    await deleteUser(user);
  }
}
```

### Input Sanitization

**XSS Prevention**:
- React automatically escapes JSX content
- Never use `dangerouslySetInnerHTML` without sanitization
- Validate and sanitize user input before saving to database

**SQL Injection** (N/A):
- Firestore is NoSQL, not vulnerable to SQL injection
- Still validate input format and types

---

## Deployment Architecture

### Hosting Strategy

**Option 1: Firebase Hosting** (Current)
- Automatic SSL certificates
- Global CDN distribution
- Custom domain support
- Rollback functionality
- Free tier available

**Option 2: Vercel** (Alternative)
- Optimized for React/Vite
- Automatic previews for PRs
- Edge functions support
- Analytics included

**Deployment Flow**:

```yaml
# GitHub Actions workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        working-directory: ./Solus
        run: npm ci --legacy-peer-deps

      - name: Build
        working-directory: ./Solus
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          # ... other env vars

      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: solus-app
```

### Environment Management

**Environments**:
1. **Development**: Local development (`npm run dev`)
2. **Preview**: PR preview builds (Firebase preview channels)
3. **Staging**: Pre-production testing (staging.solus.app)
4. **Production**: Live app (app.solus.com)

**Environment Variables**:

```.env
# .env.example (committed)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GOOGLE_GENERATIVE_AI_API_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=  # Future
```

### CDN & Caching Strategy

**Asset Caching**:
- HTML: `Cache-Control: public, max-age=0, must-revalidate`
- JS/CSS: `Cache-Control: public, max-age=31536000, immutable` (content-hashed)
- Images: `Cache-Control: public, max-age=86400` (1 day)
- Fonts: `Cache-Control: public, max-age=31536000, immutable`

**Service Worker Caching**:
```typescript
// vite.config.ts
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'firestore-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24, // 1 day
          },
        },
      },
      {
        urlPattern: /^https:\/\/.*\.googleusercontent\.com\/.*/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-images-cache',
          expiration: {
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
          },
        },
      },
    ],
  },
});
```

---

## Scaling Strategy

### Horizontal Scaling

**Firebase Auto-Scaling**:
- Firestore automatically scales with load
- Cloud Functions auto-scale based on requests
- No manual intervention required

**Client-Side Optimization**:
- Code splitting by route
- Lazy loading for heavy components
- Virtual scrolling for long lists
- Debounced search inputs
- Optimistic UI updates

### Database Optimization

**Query Optimization**:
- Use composite indexes for multi-field queries
- Limit query results (pagination)
- Cache frequently accessed data
- Use Firestore offline persistence

**Example**:
```typescript
// Paginated query
export async function getDecisionsPaginated(
  userId: string,
  pageSize: number = 20,
  startAfter?: DocumentSnapshot
) {
  let q = query(
    collection(db, 'quickDecisions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );

  if (startAfter) {
    q = query(q, startAfter(startAfter));
  }

  const snapshot = await getDocs(q);
  const decisions = snapshot.docs.map(doc => convertDates(doc.data()));
  const lastDoc = snapshot.docs[snapshot.docs.length - 1];

  return { decisions, lastDoc };
}
```

### Cost Management

**Firebase Cost Optimization**:
- Use Firestore offline persistence (reduces reads)
- Batch write operations
- Delete unnecessary data
- Monitor costs with billing alerts

**AI Cost Optimization**:
- Cache AI responses (localStorage + Firestore)
- Use Gemini Flash for most operations
- Implement rate limiting
- Monitor API usage

---

## Monitoring & Observability

### Error Tracking

**Sentry Integration** (Future):
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Analytics

**Firebase Analytics**:
```typescript
import { logEvent } from 'firebase/analytics';

// Track decision created
logEvent(analytics, 'decision_created', {
  type: 'quick',
  category: 'food',
  method: 'voice',
});

// Track recommendation accepted
logEvent(analytics, 'recommendation_accepted', {
  confidence: 0.85,
  category: 'food',
});
```

### Performance Monitoring

**Metrics to Track**:
- Page load time
- Time to Interactive (TTI)
- API response times
- AI generation time
- Database query time
- Error rates

**Firebase Performance Monitoring**:
```typescript
import { trace } from 'firebase/performance';

// Track AI generation time
const aiTrace = trace(performance, 'ai_recommendation_generation');
aiTrace.start();

const recommendation = await generateRecommendation(...);

aiTrace.stop();
```

---

## Technical Debt & Future Improvements

### Known Technical Debt

1. **No backend validation**: All validation is client-side (Firebase Security Rules only)
2. **Limited error recovery**: Some error states don't have user-friendly recovery flows
3. **No offline sync conflict resolution**: Offline changes may conflict with server changes
4. **Hardcoded rate limits**: Should be configurable per user/tier
5. **No A/B testing framework**: Difficult to experiment with features

### Planned Improvements

**Short-term** (Next 3 months):
- [ ] Add Sentry for error tracking
- [ ] Implement proper loading skeletons
- [ ] Add end-to-end tests (Playwright or Cypress)
- [ ] Optimize bundle size (code splitting)
- [ ] Add comprehensive logging

**Medium-term** (3-6 months):
- [ ] Migrate to Firebase Cloud Functions for backend validation
- [ ] Implement A/B testing framework
- [ ] Add Stripe integration for payments
- [ ] Implement email notifications (SendGrid)
- [ ] Build admin dashboard for monitoring

**Long-term** (6-12 months):
- [ ] Explore edge computing for faster AI responses
- [ ] Implement real-time collaborative decisions
- [ ] Add ML model for pattern recognition
- [ ] Build mobile apps (React Native)
- [ ] Implement advanced analytics and insights

---

## Appendix

### Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Production build
npm run preview                # Preview production build

# Testing
npm test                       # Run tests
npm run test:watch            # Watch mode
npm run test:coverage         # Coverage report

# Code Quality
npm run lint                   # Lint code
npm run lint:fix              # Auto-fix linting issues
npm run format                # Format code
npm run typecheck             # Type checking

# Firebase
firebase deploy               # Deploy to Firebase
firebase deploy --only hosting  # Deploy only frontend
firebase deploy --only functions  # Deploy only Cloud Functions
firebase emulators:start      # Run local emulators
```

### References

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Document End**
