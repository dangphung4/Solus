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
- **AI**: Gemini AI for natural language understanding, context processing, and insights
- **Voice**: Speech-to-text integration for hands-free decision input
- **Deployment**: PWA for cross-platform compatibility
- **CI/CD**: GitHub Actions for testing, code quality, and deployment

## Core Features

### Quick Decision Mode

For everyday choices (food, entertainment, simple scheduling)

- Voice-powered 30-second decision flow
- Speech-to-text functionality for effortless input
- Automatic categorization of options from natural speech
- Gemini AI processes verbal context to extract decision elements
- No manual typing needed - just explain your choice verbally
- Context-aware recommendations
- Pattern learning from past choices
- Immediate, personalized suggestions

### Deep Reflection Mode

For complex or impactful decisions (career, relationships, major purchases)

- Voice-driven multi-step guided framework
- Speak freely about your decision while AI extracts key information
- Gemini AI organizes your thoughts into structured categories
- Values alignment assessment through conversation
- Automatic pros/cons extraction with weighted importance
- Future scenario visualization
- Cognitive bias identification
- Balanced perspective generation
- In-depth analysis without manual data entry

### Decision Journal & Follow-ups

High priority for MVP:

- Automatic saving of past decisions with outcomes
- Personal database of decision history for reference
- Periodic prompts to reflect on if decisions were good ones
- Personal insights dashboard showing decision patterns
- Learning from past choices to improve future recommendations
- Integration with existing database structure

### Quick Templates Library

Planned for post-MVP:

- Pre-built decision templates for common scenarios (restaurant choice, purchase comparison)
- User ability to save custom templates for recurring decisions
- "One-tap" decision flows for frequently made choices
- Faster execution for similar decision types

### Smart Features

- Speech-to-text conversion for frictionless decision input
- Gemini LLM for natural language understanding and processing
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

- Voice-driven interface for frictionless decision capture
- Reflections Journal that tracks outcomes and builds personal decision intelligence
- Dual-mode approach for both quick and complex decisions
- AI that understands emotional and ethical dimensions
- Learning system that improves with usage
- Privacy-focused design for sensitive decisions
- Structured frameworks tailored to decision types
- Automatic categorization of options from natural speech

## Development Phases

1. **MVP**: 
   - Quick Decision mode with basic AI for common choices
   - Decision Journal & Follow-ups with core tracking functionality
   - Integration with voice-driven input

2. **V2**: 
   - Deep Reflection mode with enhanced frameworks
   - Quick Templates Library for recurring decisions
   - Expanded tracking and insights

3. **V3**: 
   - Advanced pattern learning and expanded decision library
   - Visual Decision Maps for better visualization
   - Mood & Context Awareness
   - Enhanced social features

## Ethical Approach

- Clear boundaries for medical, legal, and mental health topics
- Appropriate disclaimers when professional guidance would be beneficial
- Design choices encouraging reflection over impulsivity
- Transparent AI limitations and confidence levels
