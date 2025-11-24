# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 application using the App Router with React 19, TypeScript, and Tailwind CSS v4. The project was bootstrapped with `create-next-app` and uses pnpm as the package manager.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Run tests with Vitest
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Architecture

### App Router Structure
- Uses Next.js App Router (not Pages Router)
- Entry point: `app/page.tsx` (home page)
- Root layout: `app/layout.tsx` (defines HTML structure, metadata, and font configuration)
- All routing is file-system based within the `app/` directory

### CGM Flow Application
This is the main feature of the application - a multi-step flow for managing CGM (Continuous Glucose Monitor) device information.

**Core Flow Logic** (`utils/navigation-logic.ts`):
- `getNextStep()`: Determines next step based on current step and user answers. Implements conditional logic (e.g., skips to device-selection if not currently using CGM, shows ineligible-selection if device is "other" and update is not 5+ years)
- `getPreviousStep()`: Uses step history array to enable proper back navigation
- `canProceed()`: Validates if user can proceed from current step
- `getValidationError()`: Returns validation messages for incomplete steps

**Flow State Management** (`components/cgm-flow/FlowContainer.tsx`):
- Main container component managing the entire flow
- State persisted to localStorage with key `'cgm-flow-state'`
- `FlowState` includes: currentStep, answers, stepHistory, and returnToSummary flag
- Step history tracks the path taken by the user, enabling proper back navigation even with conditional branching
- "Edit from Summary" feature: Users can edit individual answers and return to summary, with special validation for ineligible states

**Step Components** (`components/cgm-flow/steps/`):
- Each step is a separate component (e.g., `CurrentlyUsingCGM.tsx`, `DeviceSelection.tsx`, `Summary.tsx`)
- Steps receive props: `value`, `onChange`, `onNext`
- `IneligibleSelection.tsx` is a special terminal step shown when user is ineligible for equipment (device is "other" and last update is not 5+ years)

**Reusable UI Components** (`components/cgm-flow/ui/`):
- `DeviceCard.tsx`: Device selection cards with emoji placeholders
- `RadioOption.tsx`: Radio button options for yes/no and time range selections
- `NavigationButtons.tsx`: Back/Next buttons with conditional "Return to Summary" button
- `Header.tsx`: Logo and header with clickable logo to restart flow

**Types** (`types/cgm-flow.ts`):
- `StepId`: Union type of all possible step IDs
- `FlowAnswers`: Object containing all user answers across the flow
- `FlowState`: Complete state including current step, answers, and history
- `Device`: Device information including id, name, description, and emoji placeholder
- `DEVICES`: Array of available CGM devices
- `TIME_RANGES`: Time range options for device updates and sensor orders

### Styling
- Tailwind CSS v4 with PostCSS
- Global styles: `app/globals.css`
- CSS variables defined for theming with custom purple color scheme (`--primary`, `--primary-hover`, `--primary-light`, `--primary-dark`)
- Supports light/dark mode via media query
- Custom fonts: Geist Sans and Geist Mono (loaded via `next/font/google`)

### Testing Setup
- Uses Vitest as test runner (not Jest)
- Testing Library for React component testing
- Test environment: jsdom
- Setup file: `vitest.setup.ts` (mocks localStorage)
- Test files located alongside source files in `__tests__/` directories
- Configuration: `vitest.config.ts` with path alias `@/` mapped to project root

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to project root
- Target: ES2017
- Module resolution: bundler (Next.js optimized)
- JSX mode: react-jsx

### ESLint Setup
- Uses Next.js ESLint config with Core Web Vitals and TypeScript rules
- Configuration file: `eslint.config.mjs` (flat config format)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Key Dependencies

- **Next.js 16.0.3**: React framework with App Router
- **React 19.2.0**: Latest React with concurrent features
- **Tailwind CSS 4**: Utility-first CSS framework (major version upgrade)
- **TypeScript 5**: Static typing
- **Vitest 4**: Fast unit test framework
- **Testing Library**: React component testing utilities

## Development Notes

- This project uses **pnpm** as the package manager (lock file: `pnpm-lock.yaml`)
- The app supports both light and dark modes via Tailwind classes
- Next.js Image component is used for optimized image loading
- Metadata is configured via the Metadata API in `app/layout.tsx`
- All client-side interactive components must have `'use client'` directive (e.g., `FlowContainer.tsx`)
