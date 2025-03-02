# Solus Web Application

*Singular clarity for every decision*

## What is Solus?

Solus is an AI-powered Progressive Web App (PWA) designed to help indecisive people make better choices through intelligent guidance and personalized recommendations. This repository contains the web frontend implementation of the Solus application.

## Tech Stack

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- Firebase for backend services
- OpenAI API integration
- Progressive Web App (PWA) capabilities

## PWA Features

Solus is configured as a Progressive Web App (PWA) with the following features:

- Installable on desktop and mobile devices directly from the browser
- Offline functionality
- App-like experience with full-screen mode
- Automatic updates
- Fast loading times
- Home screen icon and splash screen

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Generate PWA assets
npm run generate-pwa-assets
```

### PWA Configuration

The PWA configuration is managed through:

- `vite.config.ts` - Main PWA configuration
- `pwa-assets.config.ts` - Icon generation configuration
- `src/registerSW.ts` - Service worker registration

## Core Features

### Quick Decision Mode

For everyday choices with a 30-second decision flow, context-aware recommendations, and immediate suggestions.

### Deep Reflection Mode

For complex decisions with guided frameworks, values alignment, and cognitive bias identification.

See the main project README for complete documentation, setup instructions, and contribution guidelines.

## Deployment

The application is deployed at [https://soluscore.com](https://soluscore.com).
