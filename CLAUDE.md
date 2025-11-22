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
```

## Architecture

### App Router Structure
- Uses Next.js App Router (not Pages Router)
- Entry point: `app/page.tsx` (home page)
- Root layout: `app/layout.tsx` (defines HTML structure, metadata, and font configuration)
- All routing is file-system based within the `app/` directory

### Styling
- Tailwind CSS v4 with PostCSS
- Global styles: `app/globals.css`
- CSS variables defined for theming (light/dark mode support)
- Custom fonts: Geist Sans and Geist Mono (loaded via `next/font/google`)

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

## Development Notes

- This project uses **pnpm** as the package manager (lock file: `pnpm-lock.yaml`)
- The app supports both light and dark modes via Tailwind classes
- Next.js Image component is used for optimized image loading
- Metadata is configured via the Metadata API in `app/layout.tsx`
