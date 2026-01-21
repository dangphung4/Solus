# API Documentation & Integration Guide
## Solus - AI-Powered Decision Assistant

---

**Document Version**: 1.0.0
**Last Updated**: 2026-01-21
**Maintained By**: Development Team
**Status**: Active

---

## Table of Contents

1. [Overview](#overview)
2. [Database API](#database-api)
3. [AI Services API](#ai-services-api)
4. [Authentication API](#authentication-api)
5. [Third-Party Integrations](#third-party-integrations)
6. [Integration Guide](#integration-guide)
7. [Code Examples](#code-examples)
8. [Error Handling](#error-handling)
9. [Best Practices](#best-practices)

---

## Overview

This document provides comprehensive API documentation for Solus, covering database operations, AI services, authentication, and third-party integrations. It serves as a reference for developers working on the codebase or integrating with Solus systems.

### API Architecture

Solus uses a **service layer pattern** where all business logic and external API calls are abstracted into service modules:

```
Component (UI)
      ↓
Service Layer (db/, lib/ai/, hooks/)
      ↓
External APIs (Firebase, Gemini, etc.)
```

### Import Paths

All imports use the `@/` alias for cleaner code:

```typescript
import { createQuickDecision } from '@/db/Decision/Quick/quickDecisionDb';
import { generateRecommendation } from '@/lib/ai/quickDecisionService';
import { useAuth } from '@/hooks/useAuth';
```

---

## Database API

### User Operations

**Location**: `src/db/User/userDb.ts`

#### createUser()

Creates a new user profile in Firestore.

```typescript
function createUser(userData: Omit<User, 'id'>): Promise<User>
```

**Parameters**:
- `userData`: User object without `id` (auto-generated)

**Returns**: `Promise<User>` - Created user with generated ID

**Example**:
```typescript
import { createUser } from '@/db/User/userDb';

const newUser = await createUser({
  email: 'sarah@example.com',
  displayName: 'Sarah',
  photoURL: '',
  subscriptionTier: 'free',
  preferences: {
    theme: 'light',
    notifications: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

console.log(newUser.id); // Auto-generated Firebase ID
```

**Throws**:
- Firebase errors (permission denied, network issues, etc.)

---

#### getUser()

Retrieves a user profile by ID.

```typescript
function getUser(userId: string): Promise<User | null>
```

**Parameters**:
- `userId`: Firebase UID

**Returns**: `Promise<User | null>` - User object or null if not found

**Example**:
```typescript
const user = await getUser('abc123');

if (user) {
  console.log(user.email);
} else {
  console.log('User not found');
}
```

---

#### updateUser()

Updates a user profile.

```typescript
function updateUser(userId: string, updates: Partial<User>): Promise<void>
```

**Parameters**:
- `userId`: Firebase UID
- `updates`: Partial user object with fields to update

**Returns**: `Promise<void>`

**Example**:
```typescript
await updateUser('abc123', {
  displayName: 'Sarah Johnson',
  subscriptionTier: 'premium',
  updatedAt: new Date(),
});
```

**Note**: `updatedAt` is automatically set by the database layer.

---

#### deleteUser()

Deletes a user profile and all associated data.

```typescript
function deleteUser(userId: string): Promise<void>
```

**Parameters**:
- `userId`: Firebase UID

**Returns**: `Promise<void>`

**Example**:
```typescript
await deleteUser('abc123');
// User and all decisions/reflections are permanently deleted
```

**Warning**: This operation is irreversible. Consider implementing a soft delete for production.

---

### Quick Decision Operations

**Location**: `src/db/Decision/Quick/quickDecisionDb.ts`

#### createQuickDecision()

Creates a new quick decision.

```typescript
function createQuickDecision(
  decision: Omit<QuickDecision, 'id' | 'createdAt' | 'updatedAt'>
): Promise<QuickDecision>
```

**Parameters**:
- `decision`: QuickDecision object without auto-generated fields

**Returns**: `Promise<QuickDecision>` - Created decision with generated ID and timestamps

**Example**:
```typescript
import { createQuickDecision } from '@/db/Decision/Quick/quickDecisionDb';
import { DecisionCategory, DecisionStatus } from '@/db/types/BaseDecision';

const decision = await createQuickDecision({
  type: 'quick',
  userId: 'abc123',
  title: 'What should I eat for lunch?',
  category: DecisionCategory.FOOD,
  status: DecisionStatus.COMPLETED,
  options: [
    {
      id: '1',
      text: 'Salad',
      selected: false,
      pros: ['Healthy', 'Light'],
      cons: ['Not filling'],
    },
    {
      id: '2',
      text: 'Burrito',
      selected: true,
      pros: ['Filling', 'Tasty'],
      cons: ['Heavy', 'Expensive'],
    },
  ],
  contextFactors: ['Trying to eat healthy', 'Very hungry'],
  gutFeeling: 'I really want the burrito',
  recommendation: {
    optionId: '2',
    reasoning: 'Given that you\'re very hungry, the burrito will provide more satisfaction.',
    confidence: 0.85,
  },
  selectedOption: 'Burrito',
});
```

**Throws**:
- Firebase errors
- Validation errors (if schema is invalid)

---

#### getQuickDecision()

Retrieves a quick decision by ID.

```typescript
function getQuickDecision(id: string): Promise<QuickDecision | null>
```

**Parameters**:
- `id`: Decision ID

**Returns**: `Promise<QuickDecision | null>` - Decision object or null if not found

**Example**:
```typescript
const decision = await getQuickDecision('decision123');

if (decision && decision.type === 'quick') {
  console.log(decision.title);
  console.log(decision.options);
}
```

---

#### updateQuickDecision()

Updates a quick decision.

```typescript
function updateQuickDecision(
  id: string,
  updates: Partial<QuickDecision>
): Promise<void>
```

**Parameters**:
- `id`: Decision ID
- `updates`: Partial decision object with fields to update

**Returns**: `Promise<void>`

**Example**:
```typescript
await updateQuickDecision('decision123', {
  selectedOption: 'Salad',
  status: DecisionStatus.IMPLEMENTED,
});
```

---

#### deleteQuickDecision()

Deletes a quick decision.

```typescript
function deleteQuickDecision(id: string): Promise<void>
```

**Parameters**:
- `id`: Decision ID

**Returns**: `Promise<void>`

**Example**:
```typescript
await deleteQuickDecision('decision123');
```

---

#### listQuickDecisions()

Lists quick decisions for a user with optional filtering.

```typescript
function listQuickDecisions(
  userId: string,
  options?: {
    category?: DecisionCategory;
    status?: DecisionStatus;
    limit?: number;
    startAfter?: DocumentSnapshot;
  }
): Promise<QuickDecision[]>
```

**Parameters**:
- `userId`: User ID
- `options`: Optional filters
  - `category`: Filter by decision category
  - `status`: Filter by decision status
  - `limit`: Max number of results (default: 20)
  - `startAfter`: Document snapshot for pagination

**Returns**: `Promise<QuickDecision[]>` - Array of decisions

**Example**:
```typescript
// Get all food decisions
const foodDecisions = await listQuickDecisions('abc123', {
  category: DecisionCategory.FOOD,
  limit: 10,
});

// Get completed decisions
const completed = await listQuickDecisions('abc123', {
  status: DecisionStatus.COMPLETED,
});

// Pagination
const firstPage = await listQuickDecisions('abc123', { limit: 20 });
const lastDoc = firstPage[firstPage.length - 1];

const secondPage = await listQuickDecisions('abc123', {
  limit: 20,
  startAfter: lastDoc,
});
```

---

### Deep Decision Operations

**Location**: `src/db/Decision/Deep/deepDecisionDb.ts`

Deep decision operations follow the same pattern as quick decisions:

- `createDeepDecision(decision)`
- `getDeepDecision(id)`
- `updateDeepDecision(id, updates)`
- `deleteDeepDecision(id)`
- `listDeepDecisions(userId, options)`

**Key Difference**: Deep decisions have additional fields:

```typescript
interface DeepDecision extends BaseDecision {
  type: 'deep';
  values: string[];                    // User's personal values
  longTermGoals: string[];             // Long-term goals
  stakeholders: string[];              // People affected by decision
  prosConsAnalysis?: ProsConsAnalysis; // Weighted analysis
  futureScenarios?: FutureScenario[];  // "What if" scenarios
  cognitiveBiases?: string[];          // Identified biases
}
```

---

### Polymorphic Decision Operations

**Location**: `src/db/Decision/decisionDb.ts`

#### getDecision()

Retrieves any decision (quick or deep) by ID.

```typescript
function getDecision(
  id: string,
  type?: 'quick' | 'deep'
): Promise<Decision | null>
```

**Parameters**:
- `id`: Decision ID
- `type`: Optional decision type hint (improves performance)

**Returns**: `Promise<Decision | null>` - Union type of QuickDecision or DeepDecision

**Example**:
```typescript
import { getDecision } from '@/db/Decision/decisionDb';

const decision = await getDecision('decision123');

if (decision) {
  // Type narrowing with discriminator
  if (decision.type === 'quick') {
    console.log(decision.options); // TypeScript knows this is QuickDecision
  } else if (decision.type === 'deep') {
    console.log(decision.values); // TypeScript knows this is DeepDecision
  }
}
```

---

### Reflection Operations

**Location**: `src/db/Reflection/reflectionDb.ts`

#### createReflection()

Creates a post-decision reflection.

```typescript
function createReflection(
  reflection: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Reflection>
```

**Example**:
```typescript
import { createReflection } from '@/db/Reflection/reflectionDb';

const reflection = await createReflection({
  decisionId: 'decision123',
  userId: 'abc123',
  decisionType: 'quick',
  outcomeRating: 5,
  notes: 'Great choice! The burrito was delicious and I felt satisfied.',
  wouldChooseAgain: true,
  lessonsLearned: 'When I\'m very hungry, go with the more filling option.',
});
```

#### getReflectionsForDecision()

Retrieves all reflections for a specific decision.

```typescript
function getReflectionsForDecision(decisionId: string): Promise<Reflection[]>
```

---

### Dashboard Operations

**Location**: `src/db/Dashboard/dashboardDb.ts`

#### getDashboardStats()

Retrieves user statistics for dashboard.

```typescript
function getDashboardStats(userId: string): Promise<DashboardStats>
```

**Returns**:
```typescript
interface DashboardStats {
  totalDecisions: number;
  quickDecisions: number;
  deepDecisions: number;
  decisionsThisWeek: number;
  decisionsThisMonth: number;
  averageOutcomeRating: number;
  topCategory: DecisionCategory;
  completionRate: number;
}
```

**Example**:
```typescript
import { getDashboardStats } from '@/db/Dashboard/dashboardDb';

const stats = await getDashboardStats('abc123');

console.log(`Total decisions: ${stats.totalDecisions}`);
console.log(`Completion rate: ${stats.completionRate}%`);
console.log(`Top category: ${stats.topCategory}`);
```

---

## AI Services API

### Quick Decision Service

**Location**: `src/lib/ai/quickDecisionService.ts`

#### extractDecisionOptions()

Extracts structured decision data from natural language input.

```typescript
function extractDecisionOptions(userInput: string): Promise<ExtractedDecision>
```

**Parameters**:
- `userInput`: Natural language description of decision

**Returns**: `Promise<ExtractedDecision>`

```typescript
interface ExtractedDecision {
  title: string;
  category: DecisionCategory;
  options: Array<{
    text: string;
    pros: string[];
    cons: string[];
  }>;
  contextFactors?: string[];
  gutFeeling?: string;
}
```

**Example**:
```typescript
import { extractDecisionOptions } from '@/lib/ai/quickDecisionService';

const input = `
  I'm trying to decide between getting a salad or a burrito bowl for lunch.
  I'm trying to eat healthy but I'm really hungry and the burrito sounds good.
  The salad is lighter but might not fill me up.
`;

const extracted = await extractDecisionOptions(input);

console.log(extracted);
// {
//   title: "Lunch choice",
//   category: DecisionCategory.FOOD,
//   options: [
//     {
//       text: "Salad",
//       pros: ["Healthy", "Light"],
//       cons: ["Might not be filling"]
//     },
//     {
//       text: "Burrito bowl",
//       pros: ["Filling", "Tasty"],
//       cons: ["Less healthy", "Heavier"]
//     }
//   ],
//   contextFactors: ["Trying to eat healthy", "Very hungry"],
//   gutFeeling: "The burrito sounds good"
// }
```

**Throws**:
- `AIServiceError` if API call fails
- `ValidationError` if response doesn't match schema

---

#### generateRecommendation()

Generates an AI recommendation for a decision.

```typescript
function generateRecommendation(
  title: string,
  options: Option[],
  contextFactors: string[],
  gutFeeling?: string
): Promise<Recommendation>
```

**Parameters**:
- `title`: Decision title
- `options`: Array of options with pros/cons
- `contextFactors`: Contextual information
- `gutFeeling`: Optional user intuition

**Returns**: `Promise<Recommendation>`

```typescript
interface Recommendation {
  recommendedOption: string;
  reasoning: string;
  confidence: number;  // 0-1
  alternativeConsideration?: string;
}
```

**Example**:
```typescript
import { generateRecommendation } from '@/lib/ai/quickDecisionService';

const recommendation = await generateRecommendation(
  'Lunch choice',
  [
    {
      id: '1',
      text: 'Salad',
      pros: ['Healthy', 'Light'],
      cons: ['Not filling'],
    },
    {
      id: '2',
      text: 'Burrito',
      pros: ['Filling', 'Tasty'],
      cons: ['Heavy'],
    },
  ],
  ['Trying to eat healthy', 'Very hungry'],
  'I really want the burrito'
);

console.log(recommendation);
// {
//   recommendedOption: "Burrito",
//   reasoning: "Given that you're very hungry, the burrito will provide...",
//   confidence: 0.85,
//   alternativeConsideration: "If health is a priority, consider the salad..."
// }
```

**Graceful Fallback**: If structured output fails, falls back to text generation, then to simple heuristics.

---

#### processSpeechInput()

Processes voice input into a decision.

```typescript
function processSpeechInput(transcript: string): Promise<ProcessedDecision>
```

**Parameters**:
- `transcript`: Speech-to-text transcript

**Returns**: `Promise<ProcessedDecision>` - Extracted decision + recommendation

**Example**:
```typescript
import { processSpeechInput } from '@/lib/ai/quickDecisionService';

const transcript = "Should I watch a movie or read a book tonight?";

const processed = await processSpeechInput(transcript);

console.log(processed.decision.title);  // "Evening activity"
console.log(processed.recommendation);  // AI recommendation
```

---

### Reflection Service

**Location**: `src/lib/ai/reflectionService.ts`

#### generateReflectionPrompts()

Generates follow-up questions for decision reflection.

```typescript
function generateReflectionPrompts(
  decision: Decision
): Promise<ReflectionPrompt[]>
```

**Parameters**:
- `decision`: QuickDecision or DeepDecision

**Returns**: `Promise<ReflectionPrompt[]>`

```typescript
interface ReflectionPrompt {
  question: string;
  category: 'outcome' | 'satisfaction' | 'lessons' | 'alternative';
}
```

**Example**:
```typescript
import { generateReflectionPrompts } from '@/lib/ai/reflectionService';

const prompts = await generateReflectionPrompts(decision);

console.log(prompts);
// [
//   {
//     question: "How satisfied are you with your choice?",
//     category: "satisfaction"
//   },
//   {
//     question: "Would you make the same decision again?",
//     category: "outcome"
//   },
//   ...
// ]
```

---

### AI Provider Configuration

**Location**: `src/lib/ai/provider.ts`

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY,
});

// Fast model for quick decisions
export const geminiFlash = google('gemini-2.0-flash');

// Advanced model for deep reflections
export const geminiPro = google('gemini-1.5-pro-latest');

// Model with search grounding
export const geminiProWithSearch = google('gemini-1.5-pro-latest', {
  useSearchGrounding: true,
});
```

**Usage Guidelines**:
- Use `geminiFlash` for quick decisions (fast, cost-effective)
- Use `geminiPro` for deep reflections (more capable, slower)
- Use `geminiProWithSearch` for real-time information needs

---

## Authentication API

### Authentication Hook

**Location**: `src/hooks/useAuth.tsx`

#### useAuth()

React hook for authentication state and operations.

```typescript
function useAuth(): AuthContextType
```

**Returns**: `AuthContextType`

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}
```

**Example**:
```typescript
import { useAuth } from '@/hooks/useAuth';

function ProfilePage() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {user.displayName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

#### signIn()

Signs in with email and password.

```typescript
function signIn(email: string, password: string): Promise<void>
```

**Example**:
```typescript
const { signIn } = useAuth();

async function handleSignIn() {
  try {
    await signIn('sarah@example.com', 'password123');
    // Redirect to dashboard
  } catch (error) {
    console.error('Sign in failed:', error);
  }
}
```

**Throws**:
- `auth/user-not-found`
- `auth/wrong-password`
- `auth/invalid-email`
- `auth/user-disabled`

---

#### signInWithGoogle()

Signs in with Google OAuth.

```typescript
function signInWithGoogle(): Promise<void>
```

**Example**:
```typescript
const { signInWithGoogle } = useAuth();

async function handleGoogleSignIn() {
  try {
    await signInWithGoogle();
    // User is signed in, redirect to dashboard
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('User closed the popup');
    }
  }
}
```

---

#### signUp()

Creates a new account.

```typescript
function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<void>
```

**Example**:
```typescript
const { signUp } = useAuth();

async function handleSignUp() {
  try {
    await signUp('sarah@example.com', 'SecurePass123!', 'Sarah Johnson');
    // User is created and signed in
  } catch (error) {
    console.error('Sign up failed:', error);
  }
}
```

**Throws**:
- `auth/email-already-in-use`
- `auth/weak-password`
- `auth/invalid-email`

---

#### signOut()

Signs out the current user.

```typescript
function signOut(): Promise<void>
```

**Example**:
```typescript
const { signOut } = useAuth();

async function handleSignOut() {
  await signOut();
  // Redirect to landing page
}
```

---

#### resetPassword()

Sends a password reset email.

```typescript
function resetPassword(email: string): Promise<void>
```

**Example**:
```typescript
const { resetPassword } = useAuth();

async function handleResetPassword() {
  try {
    await resetPassword('sarah@example.com');
    alert('Password reset email sent!');
  } catch (error) {
    console.error('Failed to send reset email:', error);
  }
}
```

---

## Third-Party Integrations

### Firebase

**Setup**: `src/lib/firebase.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
```

**Environment Variables Required**:
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

---

### Gemini AI

**Setup**: `src/lib/ai/provider.ts`

```typescript
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const google = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY,
});
```

**Environment Variable Required**:
```bash
VITE_GOOGLE_GENERATIVE_AI_API_KEY=
```

**API Key Setup**:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`

---

### Stripe (Future)

**Planned for Phase 2**

```typescript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
```

---

## Integration Guide

### Adding a New Feature (Step-by-Step)

#### 1. Define TypeScript Types

Create interface in `src/db/types/`

```typescript
// src/db/types/Template.ts
export interface Template {
  id: string;
  userId: string;
  name: string;
  category: DecisionCategory;
  isPublic: boolean;
  template: {
    title: string;
    options: string[];
    contextFactors: string[];
  };
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2. Create Database Operations

Create CRUD functions in `src/db/Template/`

```typescript
// src/db/Template/templateDb.ts
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Template } from '@/db/types/Template';

export async function createTemplate(
  template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Template> {
  const docRef = await addDoc(collection(db, 'templates'), {
    ...template,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    ...template,
    id: docRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function getTemplate(id: string): Promise<Template | null> {
  const docRef = doc(db, 'templates', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Template;
}

// ... more CRUD operations
```

#### 3. Create UI Components

Create vertical slice in `src/Core/Templates/`

```typescript
// src/Core/Templates/TemplatesPage.tsx
export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function loadTemplates() {
      if (!user) return;
      const userTemplates = await listTemplates(user.uid);
      setTemplates(userTemplates);
    }
    loadTemplates();
  }, [user]);

  return (
    <div>
      <h1>Decision Templates</h1>
      {templates.map(template => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
```

#### 4. Add Routing

Update `src/App.tsx`

```typescript
import TemplatesPage from '@/Core/Templates/TemplatesPage';

// In Routes
<Route path="/templates" element={<TemplatesPage />} />
```

#### 5. Add Navigation

Update `src/Core/Shared/Navbar.tsx`

```typescript
<Link to="/templates">Templates</Link>
```

#### 6. Write Tests

Create test file `src/Core/Templates/__tests__/TemplatesPage.test.tsx`

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TemplatesPage from '../TemplatesPage';

describe('TemplatesPage', () => {
  it('renders template list', () => {
    render(<TemplatesPage />);
    expect(screen.getByText('Decision Templates')).toBeInTheDocument();
  });
});
```

---

### Adding an AI Feature

#### 1. Define Zod Schema

```typescript
// src/lib/ai/templateService.ts
import { z } from 'zod';

const templateSchema = z.object({
  name: z.string(),
  category: z.nativeEnum(DecisionCategory),
  suggestedOptions: z.array(z.string()).min(2),
  contextPrompts: z.array(z.string()),
});
```

#### 2. Create AI Function

```typescript
import { generateObject } from 'ai';
import { geminiFlash } from './provider';

export async function generateTemplate(
  description: string
): Promise<GeneratedTemplate> {
  const result = await generateObject({
    model: geminiFlash,
    schema: templateSchema,
    prompt: `Create a decision template for: ${description}`,
  });

  return result.object;
}
```

#### 3. Use in Component

```typescript
const [template, setTemplate] = useState(null);
const [loading, setLoading] = useState(false);

async function handleGenerate() {
  setLoading(true);
  try {
    const generated = await generateTemplate(userInput);
    setTemplate(generated);
  } catch (error) {
    console.error('AI generation failed:', error);
  } finally {
    setLoading(false);
  }
}
```

---

## Code Examples

### Complete Flow: Create and Save Decision

```typescript
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { extractDecisionOptions, generateRecommendation } from '@/lib/ai/quickDecisionService';
import { createQuickDecision } from '@/db/Decision/Quick/quickDecisionDb';
import { DecisionStatus } from '@/db/types/BaseDecision';

export default function QuickDecisionFlow() {
  const [input, setInput] = useState('');
  const [extracted, setExtracted] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  async function handleExtract() {
    setLoading(true);
    try {
      const result = await extractDecisionOptions(input);
      setExtracted(result);
    } catch (error) {
      console.error('Extraction failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecommendation() {
    if (!extracted) return;

    setLoading(true);
    try {
      const rec = await generateRecommendation(
        extracted.title,
        extracted.options,
        extracted.contextFactors || [],
        extracted.gutFeeling
      );
      setRecommendation(rec);
    } catch (error) {
      console.error('Recommendation failed:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user || !extracted || !recommendation) return;

    try {
      await createQuickDecision({
        type: 'quick',
        userId: user.uid,
        title: extracted.title,
        category: extracted.category,
        status: DecisionStatus.COMPLETED,
        options: extracted.options.map((opt, i) => ({
          id: String(i),
          text: opt.text,
          selected: opt.text === recommendation.recommendedOption,
          pros: opt.pros,
          cons: opt.cons,
        })),
        contextFactors: extracted.contextFactors,
        gutFeeling: extracted.gutFeeling,
        recommendation: {
          optionId: '0', // Find matching option
          reasoning: recommendation.reasoning,
          confidence: recommendation.confidence,
        },
        selectedOption: recommendation.recommendedOption,
      });

      alert('Decision saved!');
    } catch (error) {
      console.error('Save failed:', error);
    }
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe your decision..."
      />
      <button onClick={handleExtract} disabled={loading}>
        Extract Decision
      </button>

      {extracted && (
        <div>
          <h2>{extracted.title}</h2>
          <ul>
            {extracted.options.map((opt, i) => (
              <li key={i}>{opt.text}</li>
            ))}
          </ul>
          <button onClick={handleRecommendation} disabled={loading}>
            Get Recommendation
          </button>
        </div>
      )}

      {recommendation && (
        <div>
          <h3>Recommendation: {recommendation.recommendedOption}</h3>
          <p>{recommendation.reasoning}</p>
          <p>Confidence: {(recommendation.confidence * 100).toFixed(0)}%</p>
          <button onClick={handleSave}>Save Decision</button>
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling

### Error Types

```typescript
// Custom error classes
export class AIServiceError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Handling Pattern

```typescript
async function robustOperation() {
  try {
    // Attempt operation
    const result = await riskyFunction();
    return result;
  } catch (error) {
    // Log error with context
    console.error('Operation failed:', {
      operation: 'robustOperation',
      error,
      timestamp: new Date().toISOString(),
    });

    // Determine error type
    if (error instanceof AIServiceError) {
      // Handle AI-specific errors
      return fallbackAIResponse();
    } else if (error instanceof DatabaseError) {
      // Handle database errors
      throw new Error('Failed to save data. Please try again.');
    } else {
      // Unknown error
      throw new Error('An unexpected error occurred.');
    }
  }
}
```

---

## Best Practices

### 1. Always Use Type Guards

```typescript
// Good
if (decision && decision.type === 'quick') {
  // TypeScript knows this is QuickDecision
  console.log(decision.options);
}

// Bad
console.log(decision.options); // May error if decision is DeepDecision
```

### 2. Handle Loading States

```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function fetchData() {
  setLoading(true);
  setError(null);
  try {
    const result = await apiCall();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### 3. Implement Optimistic UI Updates

```typescript
async function deleteDecision(id: string) {
  // Optimistic update
  setDecisions(prev => prev.filter(d => d.id !== id));

  try {
    await deleteQuickDecision(id);
  } catch (error) {
    // Revert on error
    const deleted = await getQuickDecision(id);
    if (deleted) {
      setDecisions(prev => [...prev, deleted]);
    }
    alert('Failed to delete decision');
  }
}
```

### 4. Use Debouncing for Search

```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchDecisions() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      searchDecisions(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### 5. Implement Pagination

```typescript
const [decisions, setDecisions] = useState<QuickDecision[]>([]);
const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
const [hasMore, setHasMore] = useState(true);

async function loadMore() {
  const result = await listQuickDecisions(userId, {
    limit: 20,
    startAfter: lastDoc,
  });

  setDecisions(prev => [...prev, ...result.decisions]);
  setLastDoc(result.lastDoc);
  setHasMore(result.decisions.length === 20);
}
```

---

**Document End**
