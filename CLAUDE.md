# CLAUDE.md - AI Assistant Guide for Solus

> **Purpose**: This document provides comprehensive guidance for AI assistants working on the Solus codebase, including architecture patterns, conventions, workflows, and best practices.

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Quick Start](#quick-start)
3. [Directory Structure](#directory-structure)
4. [Architecture Patterns](#architecture-patterns)
5. [Tech Stack](#tech-stack)
6. [Development Workflow](#development-workflow)
7. [Code Standards & Conventions](#code-standards--conventions)
8. [Database Patterns](#database-patterns)
9. [AI Integration Patterns](#ai-integration-patterns)
10. [State Management](#state-management)
11. [Testing](#testing)
12. [CI/CD Workflows](#cicd-workflows)
13. [Common Tasks](#common-tasks)
14. [Important Notes](#important-notes)

---

## Repository Overview

**Solus** is an AI-powered Progressive Web App (PWA) that helps indecisive people make better choices through intelligent guidance and personalized recommendations.

### Key Features
- **Quick Decision Mode**: Voice-powered 30-second decision flow for everyday choices
- **Deep Reflection Mode**: Multi-step guided framework for complex decisions
- **Decision Journal**: Automatic tracking of past decisions with periodic follow-ups
- **AI-Powered**: Leverages Gemini AI for natural language understanding and insights
- **Voice-First**: Speech-to-text integration for hands-free input

### Project Philosophy
- **Mobile-First**: Responsive design optimized for mobile devices
- **AI-Centric**: All major features leverage AI for intelligent assistance
- **Type-Safe**: Strong TypeScript with interfaces throughout
- **Voice-Native**: Voice input is a first-class feature
- **Privacy-First**: No ads, no data selling

---

## Quick Start

### Prerequisites
- Node.js v20+
- npm
- Git

### Setup Commands
```bash
# Clone repository
git clone https://github.com/dangphung4/Solus
cd Solus/Solus  # Note: app is in /Solus subdirectory

# Install dependencies (use --legacy-peer-deps for React 19 compatibility)
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and Gemini API keys

# Start development server
npm run dev
# App runs at http://localhost:5173
```

### Essential Commands
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Lint code
npm run format           # Format code with Prettier
npm run typecheck        # Type check without building
```

---

## Directory Structure

```
Solus/
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       ├── build-test.yml      # Build and test CI
│       ├── code-quality.yml    # Linting and type checking
│       ├── commitlint.yml      # Commit message validation
│       └── release-please.yml  # Automated releases
├── Solus/                      # Main application directory
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── Core/              # Feature slices (vertical architecture)
│   │   │   ├── Auth/          # Authentication
│   │   │   ├── Dashboard/     # Dashboard
│   │   │   ├── DeepReflections/   # Complex decision mode
│   │   │   ├── Landing/       # Landing pages
│   │   │   ├── Profile/       # User profile
│   │   │   ├── QuickDecisions/    # Quick decision mode
│   │   │   │   └── Components/    # Slice-specific components
│   │   │   ├── Reflections/   # Post-decision reflections
│   │   │   └── Shared/        # Cross-slice components (Navbar, Footer)
│   │   ├── components/
│   │   │   └── ui/            # shadcn/ui component library
│   │   ├── db/                # Database layer
│   │   │   ├── types/         # TypeScript interfaces (source of truth)
│   │   │   │   ├── BaseDecision.ts
│   │   │   │   ├── QuickDecision.ts
│   │   │   │   ├── DeepDecision.ts
│   │   │   │   ├── Decision.ts    # Union type
│   │   │   │   ├── User.ts
│   │   │   │   ├── Reflection.ts
│   │   │   │   └── AI.ts
│   │   │   ├── User/          # User database operations
│   │   │   ├── Decision/      # Decision database operations
│   │   │   │   ├── Quick/     # Quick decision CRUD
│   │   │   │   └── Deep/      # Deep decision CRUD
│   │   │   ├── Reflection/    # Reflection operations
│   │   │   ├── Dashboard/     # Dashboard data
│   │   │   ├── AI/            # AI configuration
│   │   │   ├── db.ts          # Firebase initialization
│   │   │   └── integration.ts # Cross-entity operations
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.tsx    # Authentication context
│   │   │   ├── useSpeechToText.tsx
│   │   │   └── use-mobile.tsx
│   │   ├── lib/               # Libraries and utilities
│   │   │   ├── ai/            # AI service layer
│   │   │   │   ├── provider.ts        # Gemini models
│   │   │   │   ├── quickDecisionService.ts
│   │   │   │   └── reflectionService.ts
│   │   │   ├── firebase.ts    # Firebase config
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── utils.ts
│   │   ├── test/              # Test setup
│   │   ├── App.tsx            # Root component
│   │   ├── main.tsx           # Entry point
│   │   └── globals.css        # Global styles
│   ├── package.json
│   ├── vite.config.ts         # Vite + PWA configuration
│   ├── vitest.config.ts       # Test configuration
│   ├── tsconfig.json          # TypeScript config
│   └── eslint.config.js       # ESLint config
├── README.md                   # User-facing documentation
├── CONTRIBUTING.md             # Contribution guidelines
└── CLAUDE.md                   # This file (AI assistant guide)
```

### Important Path Note
⚠️ **The React application is in `/Solus/Solus`, not the repository root!**
- All npm commands must be run from `/Solus/Solus` directory
- GitHub workflows account for this with `cd Solus` commands

---

## Architecture Patterns

### Vertical Slice Architecture

Solus follows a **vertical slice architecture** where features are self-contained modules, not layered by technical concern.

#### Structure
Each feature slice in `/src/Core` contains:
- Main page component (e.g., `QuickDecisionsPage.tsx`)
- Sub-components in `Components/` folder
- All business logic specific to that feature
- Integration with database and AI services

#### Benefits
- **Isolation**: Features don't interfere with each other
- **Maintainability**: All related code is in one place
- **Scalability**: Easy to add new features without touching existing ones

#### Example: Quick Decisions Slice
```
src/Core/QuickDecisions/
├── QuickDecisionsPage.tsx    # Main page component
└── Components/
    ├── OptionsList.tsx        # Sub-component for options
    ├── ContextInput.tsx       # Sub-component for context
    └── RecommendationCard.tsx # Sub-component for AI recommendation
```

#### Shared Components
Cross-slice components (Navbar, Footer, etc.) live in `src/Core/Shared/`.

---

## Tech Stack

### Frontend
- **React 19**: Modern React with concurrent features
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe development
- **Tailwind CSS v3**: Utility-first styling (v4 avoided due to stability)
- **shadcn/ui**: Component library built on Radix UI primitives
- **lucide-react**: Icon library

### Backend & Services
- **Firebase Authentication**: User auth
- **Firestore**: NoSQL database
- **Firebase Functions**: Serverless functions (planned)
- **Gemini AI**: Google's LLM for decision assistance
  - **Gemini Flash**: Fast, interactive features
  - **Gemini Pro**: Deep analysis and complex reasoning

### AI SDK
- **Vercel AI SDK**: Structured AI responses with streaming
- **Zod**: Schema validation for AI outputs

### State Management
- **React Context API**: Authentication, theme
- **Local State (useState)**: Component-level state
- **Zustand**: Available but not actively used yet

### Testing
- **Vitest**: Fast unit test runner
- **React Testing Library**: Component testing
- **jsdom**: DOM implementation for tests

### PWA
- **vite-plugin-pwa**: PWA support with service workers
- **Workbox**: Offline caching strategies

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript ESLint**: TypeScript-specific linting

---

## Development Workflow

### Branch Organization
- `main` - Production-ready code
- `develop` - Integration branch for features (if exists)
- `{your-name}/feature/*` - Feature branches
- `{your-name}/fix/*` - Bug fix branches
- `claude/*` - AI-created branches (auto-generated with session ID)

### Creating a Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b your-name/feature/feature-name
```

### Making Changes
1. Make your changes
2. Run tests: `npm test`
3. Lint code: `npm run lint`
4. Format code: `npm run format`
5. Type check: `npm run typecheck`

### Committing Changes
Use **Conventional Commits** format (required for PR acceptance):
```bash
git add .
git commit -m "feat(quick-decisions): add voice input support"
```

### Creating Pull Requests
```bash
git push origin your-name/feature/feature-name
# Then create PR on GitHub targeting main or develop
```

#### PR Requirements
- At least one approving review
- All CI checks must pass
- Commit messages follow conventional commits
- No console.logs in code
- Tests pass
- Code is formatted and linted

---

## Code Standards & Conventions

### TypeScript Guidelines

#### Use Interfaces, Not Types
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Avoid
type User = {
  id: string;
  name: string;
  email: string;
}
```

#### Avoid ESLint Ignore Tags
Fix the issue instead of suppressing warnings.

#### Use Enums for Constants
```typescript
export enum DecisionCategory {
  FOOD = 'food',
  ENTERTAINMENT = 'entertainment',
  CAREER = 'career',
  RELATIONSHIPS = 'relationships',
}

export enum DecisionStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}
```

### React Guidelines

#### One Component Per File
Each component should be in its own file with the same name.

#### Functional Components with Hooks
```typescript
export default function QuickDecisionsPage() {
  const [step, setStep] = useState(1);
  const { user } = useAuth();

  // Component logic

  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### No Console Logs in PRs
Remove all `console.log()` statements before submitting PRs.

### Naming Conventions

#### Components
- Page components: `<FeatureName>Page.tsx` (e.g., `QuickDecisionsPage.tsx`)
- Sub-components: Descriptive names (e.g., `OptionsList.tsx`, `RecommendationCard.tsx`)

#### Database Functions
Follow CRUD patterns:
```typescript
createQuickDecision()
getQuickDecision()
updateQuickDecision()
deleteQuickDecision()
listQuickDecisions()
```

#### AI Service Functions
Use descriptive names:
```typescript
extractDecisionOptions()
generateRecommendation()
processSpeechInput()
generateReflectionPrompts()
```

### Import Path Aliases
Use `@/` alias instead of relative paths:
```typescript
// ✅ Good
import { useAuth } from '@/hooks/useAuth';
import { createQuickDecision } from '@/db/Decision/Quick/quickDecisionDb';

// ❌ Avoid
import { useAuth } from '../../../hooks/useAuth';
import { createQuickDecision } from '../../db/Decision/Quick/quickDecisionDb';
```

### Error Handling Pattern
```typescript
try {
  // operation
} catch (error) {
  console.error('Clear context message:', error);
  throw new Error('User-friendly error message');
}
```

### Styling Guidelines

#### Mobile-First Approach
Always design for mobile first, then add responsive breakpoints:
```tsx
<div className="flex flex-col md:flex-row gap-4 p-4 md:p-6">
  {/* Mobile: vertical stack, Desktop: horizontal row */}
</div>
```

#### Use shadcn/ui Components
Prefer shadcn/ui components over custom implementations:
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

#### Tailwind CSS Best Practices
- Use Tailwind utility classes
- Follow existing design patterns
- Reference [21st.dev](https://21st.dev/) for shadcn design systems
- Keep responsive design principles

---

## Database Patterns

### Type-First Design

**Source of Truth**: `/src/db/types/` directory

All database operations are built on TypeScript interfaces defined in the types directory.

### Base Decision Interface
```typescript
// src/db/types/BaseDecision.ts
export interface BaseDecision {
  id: string;
  userId: string;
  title: string;
  category: DecisionCategory;
  status: DecisionStatus;
  importance?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Quick Decision Interface
```typescript
// src/db/types/QuickDecision.ts
export interface QuickDecision extends BaseDecision {
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
}
```

### Deep Decision Interface
```typescript
// src/db/types/DeepDecision.ts
export interface DeepDecision extends BaseDecision {
  type: 'deep';  // Discriminator for union type
  values: string[];
  longTermGoals: string[];
  stakeholders: string[];
  // ... additional deep reflection fields
}
```

### Union Type for Polymorphism
```typescript
// src/db/types/Decision.ts
export type Decision = QuickDecision | DeepDecision;
```

### Firebase Timestamp Conversion Pattern

Always convert between Firebase Timestamps and JavaScript Dates:

```typescript
const convertDates = (decision: any, toFirestore = false): any => {
  if (toFirestore) {
    return {
      ...decision,
      createdAt: decision.createdAt instanceof Date
        ? Timestamp.fromDate(decision.createdAt)
        : decision.createdAt,
      updatedAt: Timestamp.fromDate(new Date())
    };
  } else {
    return {
      ...decision,
      createdAt: decision.createdAt?.toDate?.() || decision.createdAt,
      updatedAt: decision.updatedAt?.toDate?.() || decision.updatedAt
    };
  }
};
```

### CRUD Pattern Example
```typescript
// Create
export async function createQuickDecision(
  decision: Omit<QuickDecision, 'id' | 'createdAt' | 'updatedAt'>
): Promise<QuickDecision> {
  const docRef = await addDoc(collection(db, 'quickDecisions'), {
    ...convertDates(decision, true),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return {
    ...decision,
    id: docRef.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Read
export async function getQuickDecision(id: string): Promise<QuickDecision | null> {
  const docRef = doc(db, 'quickDecisions', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  return convertDates({
    id: docSnap.id,
    ...docSnap.data(),
  }) as QuickDecision;
}

// Update
export async function updateQuickDecision(
  id: string,
  updates: Partial<QuickDecision>
): Promise<void> {
  const docRef = doc(db, 'quickDecisions', id);
  await updateDoc(docRef, convertDates(updates, true));
}

// Delete
export async function deleteQuickDecision(id: string): Promise<void> {
  await deleteDoc(doc(db, 'quickDecisions', id));
}
```

### Polymorphic Database Access
```typescript
// src/db/Decision/decisionDb.ts
export const getDecision = async (
  id: string,
  type?: 'quick' | 'deep'
): Promise<Decision | null> => {
  if (type === 'quick' || !type) {
    const quickDecision = await getQuickDecision(id);
    if (quickDecision) return quickDecision;
  }

  if (type === 'deep' || !type) {
    const deepDecision = await getDeepDecision(id);
    if (deepDecision) return deepDecision;
  }

  return null;
};
```

### Type Narrowing with Discriminators
```typescript
function processDecision(decision: Decision) {
  if (decision.type === 'quick') {
    // TypeScript knows decision is QuickDecision
    console.log(decision.options);
  } else if (decision.type === 'deep') {
    // TypeScript knows decision is DeepDecision
    console.log(decision.values);
  }
}
```

### Firestore Collections
```
users/                # User profiles and settings
quickDecisions/       # Quick decision data
deepDecisions/        # Deep reflection data
reflections/          # Post-decision reflections
feedback/             # User feedback (planned)
```

---

## AI Integration Patterns

### Gemini Models Setup

```typescript
// src/lib/ai/provider.ts
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

### Model Selection Guidelines
- **Gemini Flash**: Fast, interactive features (quick decisions, voice input)
- **Gemini Pro**: Deep analysis, complex reasoning (reflections, deep decisions)
- **Gemini Pro with Search**: When real-time information is needed

### Structured Output with Zod

Always use Zod schemas for type-safe AI responses:

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';

export async function extractDecisionOptions(userInput: string) {
  const optionsSchema = z.object({
    title: z.string().describe('A concise title for the decision'),
    category: z.nativeEnum(DecisionCategory),
    options: z.array(z.object({
      text: z.string(),
      pros: z.array(z.string()).min(1),
      cons: z.array(z.string()).min(1)
    })).min(1),
    contextFactors: z.array(z.string()).optional(),
    gutFeeling: z.string().optional(),
  });

  const result = await generateObject({
    model: geminiFlash,
    schema: optionsSchema,
    prompt: `Extract decision information from this user input: ${userInput}`,
  });

  return result.object;
}
```

### Text Generation Pattern

```typescript
import { generateText } from 'ai';

export async function generateRecommendation(
  title: string,
  options: Option[],
  contextFactors: string[],
  gutFeeling?: string
) {
  const { text } = await generateText({
    model: geminiFlash,
    prompt: `
      Help me decide: ${title}

      Options:
      ${options.map((opt, i) => `${i + 1}. ${opt.text}`).join('\n')}

      Context: ${contextFactors.join(', ')}
      ${gutFeeling ? `Gut feeling: ${gutFeeling}` : ''}

      Provide a recommendation with reasoning.
    `,
  });

  return text;
}
```

### Graceful Error Handling

Always provide fallbacks when AI calls fail:

```typescript
export async function generateSmartRecommendation(decision: QuickDecision) {
  try {
    // Try structured output
    const result = await generateObject({
      model: geminiFlash,
      schema: recommendationSchema,
      prompt: `Analyze this decision and recommend an option...`,
    });

    return {
      recommendation: result.object.recommendedOption,
      reasoning: result.object.reasoning,
      confidence: result.object.confidence,
    };
  } catch (error) {
    console.warn('Structured AI call failed, using text fallback', error);

    try {
      // Fallback to simple text generation
      const { text } = await generateText({
        model: geminiFlash,
        prompt: `Recommend one of these options and explain why...`,
      });

      // Parse text manually
      let bestMatch = decision.options[0].text;
      for (const option of decision.options) {
        if (text.toLowerCase().includes(option.text.toLowerCase())) {
          bestMatch = option.text;
          break;
        }
      }

      return {
        recommendation: bestMatch,
        reasoning: text,
        confidence: 0.7,
      };
    } catch (fallbackError) {
      console.error('All AI methods failed', fallbackError);

      // Final fallback: return first option
      return {
        recommendation: decision.options[0].text,
        reasoning: 'Unable to generate AI recommendation. Please review the options and decide based on your preferences.',
        confidence: 0.5,
      };
    }
  }
}
```

### AI Service Organization

```
src/lib/ai/
├── provider.ts              # Model configuration
├── quickDecisionService.ts  # Quick decision AI functions
└── reflectionService.ts     # Reflection AI functions
```

Each service exports focused, single-purpose functions:
- `extractDecisionOptions(input: string)`
- `generateRecommendation(...)`
- `processSpeechInput(audioData: Blob)`
- `generateReflectionPrompts(decision: Decision)`

---

## State Management

### Current Approach

Solus uses **React's built-in state management** patterns:

1. **Local Component State** (`useState`)
   - Form inputs
   - UI toggles
   - Step navigation
   - Temporary data

2. **Context API**
   - Authentication state (`useAuth`)
   - Theme state (`ThemeProvider`)

3. **Zustand** (Available but unused)
   - Listed in dependencies for future use
   - Consider for complex global state needs

### Authentication Context Example

```typescript
// src/hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth logic...

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### When to Use Each Pattern

| Pattern | Use Case | Example |
|---------|----------|---------|
| `useState` | Component-local state | Form inputs, UI toggles, step counters |
| `Context API` | Shared state across many components | User authentication, theme settings |
| `Zustand` | Complex global state (future) | App-wide settings, cached data |

### State Management Guidelines

1. **Start with local state**: Use `useState` first
2. **Lift state when needed**: Move to Context if multiple components need access
3. **Avoid prop drilling**: Use Context for deeply nested components
4. **Keep state close to usage**: Don't make everything global
5. **Consider performance**: Use `useMemo` and `useCallback` for expensive operations

---

## Testing

### Test Framework
- **Vitest**: Fast, Vite-native test runner
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM implementation for Node.js

### Test Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Patterns

#### Component Testing
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('QuickDecisionCard', () => {
  it('renders decision title', () => {
    render(<QuickDecisionCard decision={mockDecision} />);
    expect(screen.getByText('What should I eat for lunch?')).toBeInTheDocument();
  });

  it('shows options when expanded', async () => {
    const user = userEvent.setup();
    render(<QuickDecisionCard decision={mockDecision} />);

    const expandButton = screen.getByRole('button', { name: /expand/i });
    await user.click(expandButton);

    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Salad')).toBeInTheDocument();
  });
});
```

#### Integration Testing (Preferred)
Focus on testing how components work together:

```typescript
describe('Quick Decision Flow', () => {
  it('completes full decision process', async () => {
    const user = userEvent.setup();
    render(<QuickDecisionsPage />);

    // Step 1: Enter title
    const titleInput = screen.getByLabelText(/decision title/i);
    await user.type(titleInput, 'Lunch choice');
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 2: Add options
    await user.type(screen.getByLabelText(/option 1/i), 'Pizza');
    await user.type(screen.getByLabelText(/option 2/i), 'Salad');
    await user.click(screen.getByRole('button', { name: /get recommendation/i }));

    // Step 3: Verify recommendation appears
    expect(await screen.findByText(/recommendation/i)).toBeInTheDocument();
  });
});
```

#### Functional Testing
Test actual user workflows end-to-end.

### Testing Commands
```bash
npm run test              # Run all tests once
npm run test:watch        # Run tests in watch mode
npm run test:ui           # Open Vitest UI
npm run test:coverage     # Generate coverage report
```

### Testing Guidelines

1. **Write tests for new features**: All new features should include tests
2. **Prefer integration tests**: Test workflows, not implementation details
3. **Test user behavior**: Focus on what users do, not internal state
4. **Mock external services**: Mock Firebase and AI calls in tests
5. **Keep tests simple**: Each test should verify one behavior

### Test Requirements for PRs
- All tests must pass
- New features require tests
- Aim for meaningful coverage, not 100%

---

## CI/CD Workflows

### GitHub Actions Workflows

Located in `.github/workflows/`:

#### 1. Build and Test (`build-test.yml`)
Runs on: Push to `main`/`develop`, Pull Requests

```yaml
- Checkout code
- Setup Node.js 20.x
- Install dependencies (npm ci --legacy-peer-deps)
- Build application (npm run build)
- Run tests (npm test)
- Upload build artifacts
```

**Required Environment Variables** (GitHub Secrets):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_OPENAI_API_KEY`

#### 2. Code Quality (`code-quality.yml`)
Runs on: Push to `main`/`develop`, Pull Requests

```yaml
- Lint code (currently commented out, ready to enable)
- Type check (currently commented out, ready to enable)
- Format check (currently commented out, ready to enable)
```

**Note**: Linting and type checking are commented out in the workflow but available in package.json. Enable when ready.

#### 3. Commit Lint (`commitlint.yml`)
Validates commit messages against Conventional Commits specification.

#### 4. Release Please (`release-please.yml`)
Automates versioning and changelog generation based on conventional commits.

### Workflow Best Practices

1. **All CI checks must pass** before merging PRs
2. **Fix failing tests** immediately, don't ignore them
3. **Keep builds fast** by avoiding unnecessary dependencies
4. **Use caching** for npm dependencies (already configured)

---

## Common Tasks

### Adding a New Feature

1. **Create a feature branch**
   ```bash
   git checkout -b your-name/feature/feature-name
   ```

2. **Create a vertical slice** (if it's a major feature)
   ```
   src/Core/YourFeature/
   ├── YourFeaturePage.tsx
   └── Components/
       ├── SubComponent1.tsx
       └── SubComponent2.tsx
   ```

3. **Define types first**
   ```typescript
   // src/db/types/YourType.ts
   export interface YourType {
     id: string;
     // ... fields
   }
   ```

4. **Create database operations**
   ```typescript
   // src/db/YourFeature/yourFeatureDb.ts
   export async function createYourThing(data: YourType) { ... }
   export async function getYourThing(id: string) { ... }
   ```

5. **Add AI service if needed**
   ```typescript
   // src/lib/ai/yourFeatureService.ts
   export async function analyzeYourThing(data: YourType) { ... }
   ```

6. **Build the UI component**
   ```typescript
   // src/Core/YourFeature/YourFeaturePage.tsx
   export default function YourFeaturePage() { ... }
   ```

7. **Add route** (if needed)
   ```typescript
   // src/App.tsx or routing file
   <Route path="/your-feature" element={<YourFeaturePage />} />
   ```

8. **Write tests**
   ```typescript
   // src/Core/YourFeature/__tests__/YourFeaturePage.test.tsx
   describe('YourFeaturePage', () => { ... });
   ```

9. **Commit with conventional commits**
   ```bash
   git add .
   git commit -m "feat(your-feature): add new feature"
   git push origin your-name/feature/feature-name
   ```

### Fixing a Bug

1. **Create a fix branch**
   ```bash
   git checkout -b your-name/fix/bug-description
   ```

2. **Write a failing test** that reproduces the bug
   ```typescript
   it('should not crash when data is null', () => {
     expect(() => processData(null)).not.toThrow();
   });
   ```

3. **Fix the bug**
   ```typescript
   function processData(data: Data | null) {
     if (!data) return null; // Fix
     // ... rest of logic
   }
   ```

4. **Verify test passes**
   ```bash
   npm test
   ```

5. **Commit and push**
   ```bash
   git commit -m "fix(data-processing): handle null data gracefully"
   git push origin your-name/fix/bug-description
   ```

### Adding a shadcn/ui Component

1. **Install the component** (if not already added)
   ```bash
   npx shadcn-ui@latest add button
   ```

2. **Import and use**
   ```typescript
   import { Button } from '@/components/ui/button';

   <Button variant="default" size="lg">Click me</Button>
   ```

### Working with Environment Variables

1. **Add to `.env.local`** (not committed)
   ```
   VITE_NEW_API_KEY=your-key-here
   ```

2. **Add to `.env.example`** (committed)
   ```
   VITE_NEW_API_KEY=
   ```

3. **Access in code**
   ```typescript
   const apiKey = import.meta.env.VITE_NEW_API_KEY;
   ```

4. **Add to GitHub Secrets** (for CI/CD)
   - Go to repo Settings > Secrets and variables > Actions
   - Add `VITE_NEW_API_KEY`

### Running Specific Tests

```bash
# Run tests matching pattern
npm test -- QuickDecision

# Run tests in a specific file
npm test -- src/Core/QuickDecisions/__tests__/QuickDecisionsPage.test.tsx

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

---

## Important Notes

### For AI Assistants Working on This Codebase

#### Must-Follow Rules

1. **Always use conventional commits**
   - Format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
   - PRs will be rejected without proper commits

2. **No console.logs in PRs**
   - Remove all debugging logs before committing
   - Use proper error handling instead

3. **Mobile-first design**
   - Start with mobile layout, then add responsive breakpoints
   - Test on mobile viewport first

4. **Type safety is required**
   - Use TypeScript interfaces
   - No `any` types without good reason
   - Avoid ESLint ignore comments

5. **Test your changes**
   - Run `npm test` before committing
   - Run `npm run lint` before committing
   - Run `npm run typecheck` before committing

6. **Follow the vertical slice architecture**
   - Keep features isolated in their own directories
   - Don't mix concerns across slices

7. **Use the `@/` import alias**
   - Never use relative paths like `../../../`
   - Always use `@/` for cleaner imports

8. **Firebase Timestamp conversion**
   - Always convert Timestamps to Dates when reading
   - Always convert Dates to Timestamps when writing

9. **AI calls need fallbacks**
   - Structured AI calls should have text generation fallback
   - Text generation should have hardcoded fallback
   - Never let the app crash due to AI failures

10. **Use shadcn/ui components**
    - Don't reinvent UI components
    - Check [21st.dev](https://21st.dev/) for design patterns

#### Common Pitfalls to Avoid

❌ **Don't**: Create new types when interfaces exist
✅ **Do**: Use existing types from `/src/db/types/`

❌ **Don't**: Add features without tests
✅ **Do**: Write integration tests for new features

❌ **Don't**: Use relative imports
✅ **Do**: Use `@/` path alias

❌ **Don't**: Forget to run `npm install --legacy-peer-deps`
✅ **Do**: Always use `--legacy-peer-deps` flag (React 19 compatibility)

❌ **Don't**: Commit `.env.local` file
✅ **Do**: Add secrets to `.env.local` and update `.env.example`

❌ **Don't**: Push to `main` directly
✅ **Do**: Create feature branch and submit PR

❌ **Don't**: Ignore TypeScript errors
✅ **Do**: Fix type errors properly

❌ **Don't**: Leave commented-out code
✅ **Do**: Remove dead code or explain why it's commented

### Environment Setup Checklist

Before starting development:

- [ ] Node.js v20+ installed
- [ ] Repository cloned
- [ ] Changed directory to `/Solus/Solus`
- [ ] Ran `npm install --legacy-peer-deps`
- [ ] Copied `.env.example` to `.env.local`
- [ ] Added Firebase credentials to `.env.local`
- [ ] Added Gemini API key to `.env.local`
- [ ] Ran `npm run dev` successfully
- [ ] App loads at `http://localhost:5173`

### Git Workflow Checklist

For each feature/fix:

- [ ] Created feature branch from `develop`
- [ ] Made changes following conventions
- [ ] Ran `npm run lint` (passes)
- [ ] Ran `npm run typecheck` (passes)
- [ ] Ran `npm test` (passes)
- [ ] Ran `npm run format` (formatted)
- [ ] Removed all console.logs
- [ ] Committed with conventional commit message
- [ ] Pushed to remote branch
- [ ] Created PR with description
- [ ] All CI checks pass
- [ ] Requested review

### PR Review Checklist

Before requesting review:

- [ ] PR title follows conventional commits format
- [ ] Description explains what and why
- [ ] Screenshots included for UI changes
- [ ] Related issues linked
- [ ] All tests pass locally
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Code is formatted
- [ ] No console.logs
- [ ] Mobile responsive (if UI change)
- [ ] Tested on mobile viewport
- [ ] AI error handling includes fallbacks
- [ ] Database operations convert timestamps properly

---

## Quick Reference

### Essential Commands
```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Lint code
npm run format           # Format with Prettier
npm run typecheck        # Check types

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# PWA
npm run generate-pwa-assets  # Generate PWA icons
```

### File Path Quick Reference
```
📁 /Solus                           # Repository root
├── 📁 .github/workflows            # CI/CD
├── 📁 Solus                        # ⚠️ Application root (run commands here)
│   ├── 📁 src
│   │   ├── 📁 Core                 # ✨ Feature slices (add new features here)
│   │   ├── 📁 components/ui        # 🎨 UI components (shadcn)
│   │   ├── 📁 db                   # 💾 Database layer
│   │   │   ├── 📁 types            # 📝 TypeScript types (define types here)
│   │   │   └── 📁 [Feature]        # Feature-specific DB ops
│   │   ├── 📁 hooks                # 🪝 Custom React hooks
│   │   ├── 📁 lib                  # 📚 Libraries
│   │   │   └── 📁 ai               # 🤖 AI services (Gemini)
│   │   └── 📁 test                 # 🧪 Test setup
│   ├── 📄 .env.local               # 🔐 Local secrets (not committed)
│   ├── 📄 .env.example             # 📋 Environment template (committed)
│   └── 📄 package.json             # 📦 Dependencies
├── 📄 README.md                    # 👥 User documentation
├── 📄 CONTRIBUTING.md              # 🤝 Contribution guide
└── 📄 CLAUDE.md                    # 🤖 This file (AI guide)
```

### Type Quick Reference
```typescript
// Base types
import { User } from '@/db/types/User';
import { BaseDecision } from '@/db/types/BaseDecision';
import { QuickDecision } from '@/db/types/QuickDecision';
import { DeepDecision } from '@/db/types/DeepDecision';
import { Decision } from '@/db/types/Decision'; // Union type
import { Reflection } from '@/db/types/Reflection';

// Enums
import {
  DecisionCategory,
  DecisionStatus
} from '@/db/types/BaseDecision';
```

### Database Quick Reference
```typescript
// Quick Decision
import {
  createQuickDecision,
  getQuickDecision,
  updateQuickDecision,
  deleteQuickDecision,
  listQuickDecisions,
} from '@/db/Decision/Quick/quickDecisionDb';

// Deep Decision
import {
  createDeepDecision,
  getDeepDecision,
  updateDeepDecision,
  deleteDeepDecision,
} from '@/db/Decision/Deep/deepDecisionDb';

// Polymorphic
import { getDecision } from '@/db/Decision/decisionDb';

// User
import {
  createUser,
  getUser,
  updateUser
} from '@/db/User/userDb';
```

### AI Service Quick Reference
```typescript
// Quick Decision AI
import {
  extractDecisionOptions,
  generateRecommendation,
  processSpeechInput,
} from '@/lib/ai/quickDecisionService';

// Reflection AI
import {
  generateReflectionPrompts,
} from '@/lib/ai/reflectionService';

// Models
import {
  geminiFlash,      // Fast, interactive
  geminiPro,        // Deep analysis
} from '@/lib/ai/provider';
```

### Hooks Quick Reference
```typescript
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/use-mobile';
import { useSpeechToText } from '@/hooks/useSpeechToText';
```

---

## Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)

### Design Resources
- [21st.dev - shadcn Design Systems](https://21st.dev/)
- [Lucide Icons](https://lucide.dev/)

### Project Links
- [GitHub Repository](https://github.com/dangphung4/Solus)
- [Contributing Guide](CONTRIBUTING.md)
- [README](README.md)

---

## Version Information

**Document Version**: 1.0.0
**Last Updated**: 2026-01-21
**Codebase Version**: 0.0.2
**Maintained By**: AI assistants working on the Solus project

---

## Feedback & Updates

This document is a living guide and should be updated as the codebase evolves. If you notice outdated information or missing patterns:

1. Update this document
2. Commit with: `docs(claude-md): update [section] for [reason]`
3. Submit PR with changes

**Questions?** Contact the repository maintainer or open a GitHub issue.
