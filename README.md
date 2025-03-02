# Solus

<img src="/Solus/public/favicon.svg" alt="Solus" width="200" height="200">

*Singular clarity for every decision*

[![Build and Test](https://github.com/dangphung4/Solus/actions/workflows/build-test.yml/badge.svg)](https://github.com/dangphung4/Solus/actions/workflows/build-test.yml)
[![Code Quality](https://github.com/dangphung4/Solus/actions/workflows/code-quality.yml/badge.svg)](https://github.com/dangphung4/Solus/actions/workflows/code-quality.yml)

## Overview

Solus is an AI-powered Progressive Web App (PWA) helping indecisive people make better choices through intelligent guidance and personalized recommendations.

## Repository Structure

This repository is organized as follows:

- `/Solus` - Main application code (React, Vite, TypeScript)
- `/.github` - GitHub workflows, templates, and configuration
- For development setup, see the [Contributing Guide](CONTRIBUTING.md)

## Problems We Solve

- **Decision Fatigue**: Reduces the mental load of evaluating options and tradeoffs
- **Overthinking**: Provides structure to prevent rumination on simple choices
- **Blind Spots**: Surfaces considerations users might overlook
- **Confidence Gap**: Validates thinking and increases decision satisfaction
- **Time Waste**: Accelerates decision processes with appropriate depth based on importance

## Target Market

- **Primary**: Millennials and Gen Z adults who experience decision paralysis
- **Secondary**: Busy professionals who need to optimize decision-making time
- **Tertiary**: People facing complex life choices seeking structured guidance

## Tech Stack

- **Frontend**: React 19 with Vite, Tailwind CSS, shadcn/ui component library
- **Backend**: Firebase (Authentication, Firestore, Functions)
- **AI**: Vercel AI SDK for natural language understanding and insights
- **Deployment**: PWA for cross-platform compatibility
- **CI/CD**: GitHub Actions for testing, code quality, and deployment

## Core Features

### Quick Decision Mode

For everyday choices (food, entertainment, simple scheduling)

- 30-second decision flow
- Context-aware recommendations
- Simple gut reaction capture
- Pattern learning from past choices
- Immediate, personalized suggestions

### Deep Reflection Mode

For complex or impactful decisions (career, relationships, major purchases)

- Multi-step guided framework
- Values alignment assessment
- Pros/cons with weighted importance
- Future scenario visualization
- Cognitive bias identification
- Balanced perspective generation

### Smart Features

- Automatic decision type detection
- Contextual prompting based on decision category
- Personal pattern recognition
- Judgment-free space for sensitive topics
- Privacy-first approach for personal matters

## Architecture

Solus follows a vertical slice architecture, organizing code around features rather than technical layers. Each feature contains all necessary components (UI, business logic, data access) in a self-contained slice.

## Development

### Prerequisites

- Node.js v20+
- npm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/dangphung4/Solus
cd Solus/Solus  # Note: app is in /Solus subdirectory

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

# Lint
npm run lint
```

## Contributing

Please see our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Continuous Integration

This project uses GitHub Actions for:

- Building and testing
- Code quality checks (linting, type checking)
- Security scanning
- Automated releases

## Monetization

- Freemium model with premium subscription
- Free tier: Limited daily quick decisions, basic deep reflections
- Premium: Unlimited decisions, enhanced AI insights, decision journal
- No ads, no data selling

## Differentiation

- Dual-mode approach for both quick and complex decisions
- AI that understands emotional and ethical dimensions
- Learning system that improves with usage
- Privacy-focused design for sensitive decisions
- Structured frameworks tailored to decision types

## Development Phases

1. **MVP**: Quick Decision mode with basic AI for common choices
2. **V2**: Deep Reflection mode with enhanced frameworks
3. **V3**: Advanced pattern learning and expanded decision library

## Ethical Approach

- Clear boundaries for medical, legal, and mental health topics
- Appropriate disclaimers when professional guidance would be beneficial
- Design choices encouraging reflection over impulsivity
- Transparent AI limitations and confidence levels
