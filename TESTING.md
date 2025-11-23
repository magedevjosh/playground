# Testing Guide

This project uses Vitest with React Testing Library for comprehensive unit testing.

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for development)
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

## Test Structure

### Utility Tests
- **`utils/__tests__/navigation-logic.test.ts`** - Tests for navigation logic functions
  - `getNextStep()` - Validates conditional navigation paths
  - `getPreviousStep()` - Tests backward navigation using history
  - `canProceed()` - Validates step completion requirements
  - `getStepTitle()` and `getStepQuestion()` - Tests UI text generation

### Component Tests

#### Container Component
- **`components/cgm-flow/__tests__/FlowContainer.test.tsx`** - Main flow container tests
  - Initial render and state management
  - Navigation flow (forward/backward)
  - LocalStorage persistence
  - Start over functionality
  - Complex navigation paths for different user scenarios
  - Edit from Summary navigation
  - Return to Summary functionality
  - Multi-field editing from summary
  - Validation for ineligible answers when returning to summary

#### Step Components
- **`components/cgm-flow/steps/__tests__/CurrentlyUsingCGM.test.tsx`**
  - Radio option selection
  - State management
  
- **`components/cgm-flow/steps/__tests__/DeviceSelection.test.tsx`**
  - Device card rendering
  - Device selection interaction

- **`components/cgm-flow/steps/__tests__/IneligibleSelection.test.tsx`**
  - Ineligibility message display
  - Customer support phone link functionality
  - Component styling and accessibility
  
- **`components/cgm-flow/steps/__tests__/Summary.test.tsx`**
  - Conditional rendering of answers
  - Data formatting and display
  - Edit functionality (clickable section headings)
  - Navigation to specific steps from summary

#### UI Components
- **`components/cgm-flow/ui/__tests__/NavigationButtons.test.tsx`**
  - Button enable/disable states
  - Back/Next/Complete button rendering
  - Click handlers
  - Return to Summary button in edit mode
  - Three-button layout when editing from summary
  
- **`components/cgm-flow/ui/__tests__/RadioOption.test.tsx`**
  - Radio input functionality
  - Label association
  - Selection states
  
- **`components/cgm-flow/ui/__tests__/DeviceCard.test.tsx`**
  - Device information display
  - Selection state
  - Click interaction

## Test Coverage

The test suite includes **216 tests** covering:
- ✅ All navigation logic functions (including eligibility checks)
- ✅ State management and persistence
- ✅ User interactions and form inputs
- ✅ Conditional rendering
- ✅ Accessibility attributes
- ✅ Complex multi-step flows (including ineligibility paths)
- ✅ Eligibility verification logic

## Configuration

- **`vitest.config.ts`** - Vitest configuration with React plugin and path aliases
- **`vitest.setup.ts`** - Global test setup including localStorage mock and jest-dom matchers

## Best Practices

1. Tests use React Testing Library's user-centric queries
2. User interactions are simulated with `@testing-library/user-event`
3. LocalStorage is mocked globally for consistency
4. Tests verify both functionality and accessibility
5. Complex flows are tested end-to-end

