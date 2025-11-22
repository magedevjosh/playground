# Playwright Testing Guide - CGM Device Selection Flow

## Table of Contents
1. [Application Overview](#application-overview)
2. [Playwright Setup Instructions](#playwright-setup-instructions)
3. [Data Test IDs Reference](#data-test-ids-reference)
4. [Flow Logic and Conditional Paths](#flow-logic-and-conditional-paths)
5. [Example Playwright Test Scenarios](#example-playwright-test-scenarios)
6. [Testing Best Practices](#testing-best-practices)
7. [Common Testing Patterns](#common-testing-patterns)

---

## Application Overview

### Purpose
The CGM (Continuous Glucose Monitor) Device Selection Flow is a multi-step questionnaire that guides patients through selecting and ordering CGM devices. The application collects information about the patient's current CGM usage, device preferences, and recent medical visits to provide personalized device recommendations.

### User Journey
The flow consists of conditional steps that adapt based on user responses:
- Users answer questions about their current CGM usage
- Based on responses, they're guided through relevant steps
- The flow culminates in a summary of their selections
- State is persisted to localStorage for session recovery

### Key Features
- **Conditional navigation**: Different paths based on user answers
- **State persistence**: Uses localStorage to save progress
- **Back navigation**: Users can return to previous steps
- **Start Over**: Ability to reset the entire flow at any time

---

## Playwright Setup Instructions

### Installation

```bash
# Install Playwright
npm init playwright@latest
# or
pnpm create playwright

# Install specific browsers
npx playwright install
```

### Basic Configuration

Create or update `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Recommended Project Structure

```
tests/
├── cgm-flow/
│   ├── complete-flow.spec.ts
│   ├── navigation.spec.ts
│   ├── validation.spec.ts
│   └── persistence.spec.ts
├── fixtures/
│   └── test-data.ts
└── helpers/
    └── cgm-helpers.ts
```

---

## Data Test IDs Reference

All interactive elements have unique `data-testid` attributes for reliable test selection.

### Navigation Controls

| Test ID | Element | Description |
|---------|---------|-------------|
| `start-over-button` | Button | Clears localStorage and resets flow to first step |
| `back-button` | Button | Navigates to previous step (only visible when applicable) |
| `next-button` | Button | Advances to next step (disabled until selection made) |
| `complete-button` | Button | Completes the flow (only on summary step) |

### Radio Options

Radio buttons use dynamic test IDs based on their value:

| Test ID Pattern | Element | Examples |
|----------------|---------|----------|
| `radio-option-{value}` | Label wrapper | `radio-option-yes`, `radio-option-no` |
| `radio-input-{value}` | Input element | `radio-input-yes`, `radio-input-no` |

**Common Radio Values:**
- `yes` / `no` - Boolean questions
- `0-1-year`, `1-3-years`, `3-4-years`, `5-plus-years` - Device update timeframes
- `0-1-months`, `1-3-months`, `3-6-months`, `6-plus-months` - Sensor order timeframes

### Device Cards

Device selection uses these test IDs:

| Test ID | Device |
|---------|--------|
| `device-card-dexcom-g7` | Dexcom G7 |
| `device-card-dexcom-g6` | Dexcom G6 |
| `device-card-libre-freestyle-3` | Libre FreeStyle 3 |
| `device-card-libre-14-day` | Libre 14 Day |

---

## Flow Logic and Conditional Paths

The application has two main conditional paths based on initial CGM usage.

### Path 1: Currently Using CGM (Yes)

**Full flow for existing CGM users:**

1. **Currently Using CGM** → Answer: Yes
2. **Current Device** → Select current device (4 options)
3. **Last Device Update** → Select timeframe (4 options)
4. **Last Sensors Ordered** → Select timeframe (4 options)
5. **Device Switch Intention** → Answer: Yes or No
   - **If Yes**: → Device Selection → Last Doctor Visit → Summary
   - **If No**: → Last Doctor Visit → Summary

**Total steps (wants to switch)**: 8 steps
**Total steps (doesn't want to switch)**: 7 steps

### Path 2: Not Currently Using CGM (No)

**Shortened flow for new CGM users:**

1. **Currently Using CGM** → Answer: No
2. **Device Selection** → Select desired device (4 options)
3. **Last Doctor Visit** → Answer: Yes or No
4. **Summary** → Review selections

**Total steps**: 4 steps

### Step Validation Rules

Each step requires a selection before the Next button becomes enabled:

| Step | Required Field | Validation |
|------|---------------|------------|
| Currently Using CGM | `currentlyUsingCGM` | Must be `true` or `false` |
| Current Device | `currentDevice` | Must select one device |
| Last Device Update | `lastDeviceUpdate` | Must select one timeframe |
| Last Sensors Ordered | `lastSensorsOrdered` | Must select one timeframe |
| Device Switch Intention | `deviceSwitchIntention` | Must be `true` or `false` |
| Device Selection | `deviceSelection` | Must select one device |
| Last Doctor Visit | `lastDoctorVisit` | Must be `true` or `false` |
| Summary | N/A | Always enabled |

---

## Example Playwright Test Scenarios

### 1. Complete Flow Test - Existing CGM User Who Wants to Switch

```typescript
import { test, expect } from '@playwright/test';

test('complete flow - existing user wants to switch devices', async ({ page }) => {
  await page.goto('/');

  // Step 1: Currently using CGM - Yes
  await expect(page.getByText('Currently Using CGM')).toBeVisible();
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();

  // Step 2: Current Device - Select Dexcom G6
  await expect(page.getByText('Current Device')).toBeVisible();
  await page.getByTestId('device-card-dexcom-g6').click();
  await page.getByTestId('next-button').click();

  // Step 3: Last Device Update - 1-3 Years
  await expect(page.getByText('Last Device Update')).toBeVisible();
  await page.getByTestId('radio-option-1-3-years').click();
  await page.getByTestId('next-button').click();

  // Step 4: Last Sensors Ordered - 1-3 months
  await expect(page.getByText('Last Sensors Ordered')).toBeVisible();
  await page.getByTestId('radio-option-1-3-months').click();
  await page.getByTestId('next-button').click();

  // Step 5: Device Switch Intention - Yes
  await expect(page.getByText('Device Switch Intention')).toBeVisible();
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();

  // Step 6: Device Selection - Dexcom G7
  await expect(page.getByText('Device Selection')).toBeVisible();
  await page.getByTestId('device-card-dexcom-g7').click();
  await page.getByTestId('next-button').click();

  // Step 7: Last Doctor Visit - Yes
  await expect(page.getByText('Last Doctor Visit')).toBeVisible();
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();

  // Step 8: Summary
  await expect(page.getByText('Summary')).toBeVisible();
  await expect(page.getByText('Your CGM Experience Profile')).toBeVisible();
  
  // Verify summary contains selections
  await expect(page.getByText('Currently Using CGM')).toBeVisible();
  await expect(page.getByText('Dexcom G6')).toBeVisible();
  await expect(page.getByText('Dexcom G7')).toBeVisible();
  
  // Complete the flow
  await expect(page.getByTestId('complete-button')).toBeVisible();
  await page.getByTestId('complete-button').click();
});
```

### 2. Complete Flow Test - New CGM User

```typescript
import { test, expect } from '@playwright/test';

test('complete flow - new user selecting first device', async ({ page }) => {
  await page.goto('/');

  // Step 1: Currently using CGM - No
  await expect(page.getByText('Currently Using CGM')).toBeVisible();
  await page.getByTestId('radio-option-no').click();
  await page.getByTestId('next-button').click();

  // Step 2: Device Selection - Libre FreeStyle 3
  await expect(page.getByText('Device Selection')).toBeVisible();
  await page.getByTestId('device-card-libre-freestyle-3').click();
  await page.getByTestId('next-button').click();

  // Step 3: Last Doctor Visit - Yes
  await expect(page.getByText('Last Doctor Visit')).toBeVisible();
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();

  // Step 4: Summary
  await expect(page.getByText('Summary')).toBeVisible();
  await expect(page.getByText('Libre FreeStyle 3')).toBeVisible();
  await expect(page.getByTestId('complete-button')).toBeVisible();
});
```

### 3. Back Button Navigation Test

```typescript
import { test, expect } from '@playwright/test';

test('back button navigates to previous steps correctly', async ({ page }) => {
  await page.goto('/');

  // Move forward through first 3 steps
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();
  
  await page.getByTestId('device-card-dexcom-g7').click();
  await page.getByTestId('next-button').click();
  
  await page.getByTestId('radio-option-0-1-year').click();
  await page.getByTestId('next-button').click();

  // Now on step 4, verify we're at "Last Sensors Ordered"
  await expect(page.getByText('Last Sensors Ordered')).toBeVisible();
  
  // Go back to step 3
  await page.getByTestId('back-button').click();
  await expect(page.getByText('Last Device Update')).toBeVisible();
  
  // Verify selection is still checked
  const radioOption = page.getByTestId('radio-input-0-1-year');
  await expect(radioOption).toBeChecked();
  
  // Go back to step 2
  await page.getByTestId('back-button').click();
  await expect(page.getByText('Current Device')).toBeVisible();
  
  // Go back to step 1
  await page.getByTestId('back-button').click();
  await expect(page.getByText('Currently Using CGM')).toBeVisible();
  
  // Back button should not be visible on first step
  await expect(page.getByTestId('back-button')).not.toBeVisible();
});
```

### 4. Start Over Functionality Test

```typescript
import { test, expect } from '@playwright/test';

test('start over button resets flow and clears state', async ({ page }) => {
  await page.goto('/');

  // Progress through several steps
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();
  
  await page.getByTestId('device-card-dexcom-g7').click();
  await page.getByTestId('next-button').click();
  
  await page.getByTestId('radio-option-1-3-years').click();
  await page.getByTestId('next-button').click();

  // Verify we're on step 4
  await expect(page.getByText('Last Sensors Ordered')).toBeVisible();
  
  // Check localStorage has data
  const storedData = await page.evaluate(() => {
    return localStorage.getItem('cgm-flow-state');
  });
  expect(storedData).not.toBeNull();
  
  // Click Start Over
  await page.getByTestId('start-over-button').click();
  
  // Should be back at step 1
  await expect(page.getByText('Currently Using CGM')).toBeVisible();
  await expect(page.getByText('Step 1')).toBeVisible();
  
  // localStorage should be cleared
  const clearedData = await page.evaluate(() => {
    return localStorage.getItem('cgm-flow-state');
  });
  expect(clearedData).toBeNull();
  
  // Previous selections should not be checked
  const yesRadio = page.getByTestId('radio-input-yes');
  await expect(yesRadio).not.toBeChecked();
});
```

### 5. Form Validation Test - Disabled Next Button

```typescript
import { test, expect } from '@playwright/test';

test('next button is disabled until selection is made', async ({ page }) => {
  await page.goto('/');

  // Next button should be disabled initially
  const nextButton = page.getByTestId('next-button');
  await expect(nextButton).toBeDisabled();
  
  // Select an option
  await page.getByTestId('radio-option-yes').click();
  
  // Next button should now be enabled
  await expect(nextButton).toBeEnabled();
  
  // Navigate to next step
  await nextButton.click();
  
  // Next button should be disabled again on new step
  await expect(page.getByText('Current Device')).toBeVisible();
  await expect(nextButton).toBeDisabled();
  
  // Select a device
  await page.getByTestId('device-card-dexcom-g6').click();
  
  // Next button enabled again
  await expect(nextButton).toBeEnabled();
});
```

### 6. localStorage Persistence Test

```typescript
import { test, expect } from '@playwright/test';

test('flow state persists after page reload', async ({ page }) => {
  await page.goto('/');

  // Progress through several steps
  await page.getByTestId('radio-option-no').click();
  await page.getByTestId('next-button').click();
  
  await page.getByTestId('device-card-libre-14-day').click();
  await page.getByTestId('next-button').click();

  // Verify we're on step 3
  await expect(page.getByText('Last Doctor Visit')).toBeVisible();
  
  // Reload the page
  await page.reload();
  
  // Should still be on step 3
  await expect(page.getByText('Last Doctor Visit')).toBeVisible();
  await expect(page.getByText('Step 3')).toBeVisible();
  
  // Navigate back to verify previous selections
  await page.getByTestId('back-button').click();
  await expect(page.getByText('Device Selection')).toBeVisible();
  
  // Device selection should still be selected
  const deviceCard = page.getByTestId('device-card-libre-14-day');
  await expect(deviceCard).toHaveClass(/bg-primary-light/);
});
```

### 7. Conditional Path Test - User Doesn't Want to Switch

```typescript
import { test, expect } from '@playwright/test';

test('existing user who does not want to switch skips device selection', async ({ page }) => {
  await page.goto('/');

  // Answer as existing user
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();
  
  // Select current device
  await page.getByTestId('device-card-dexcom-g6').click();
  await page.getByTestId('next-button').click();
  
  // Last device update
  await page.getByTestId('radio-option-1-3-years').click();
  await page.getByTestId('next-button').click();
  
  // Last sensors ordered
  await page.getByTestId('radio-option-1-3-months').click();
  await page.getByTestId('next-button').click();
  
  // Device switch intention - NO
  await page.getByTestId('radio-option-no').click();
  await page.getByTestId('next-button').click();
  
  // Should skip device selection and go directly to last doctor visit
  await expect(page.getByText('Last Doctor Visit')).toBeVisible();
  await expect(page.getByText('Device Selection')).not.toBeVisible();
  
  // Complete the flow
  await page.getByTestId('radio-option-yes').click();
  await page.getByTestId('next-button').click();
  
  // Should be on summary
  await expect(page.getByText('Summary')).toBeVisible();
  
  // Summary should NOT show a "Selected Device" field
  await expect(page.getByText('Selected Device')).not.toBeVisible();
});
```

---

## Testing Best Practices

### Waiting Strategies

```typescript
// Wait for navigation to complete
await page.getByTestId('next-button').click();
await expect(page.getByText('Expected Step Title')).toBeVisible();

// Wait for button state changes
await page.getByTestId('radio-option-yes').click();
await expect(page.getByTestId('next-button')).toBeEnabled();

// Wait for localStorage updates
await page.waitForFunction(() => {
  return localStorage.getItem('cgm-flow-state') !== null;
});
```

### Testing localStorage State

```typescript
// Get localStorage value
const state = await page.evaluate(() => {
  return JSON.parse(localStorage.getItem('cgm-flow-state'));
});

// Set localStorage value (for test setup)
await page.evaluate(() => {
  const testState = {
    currentStep: 'device-selection',
    answers: { currentlyUsingCGM: false },
    stepHistory: ['currently-using-cgm', 'device-selection']
  };
  localStorage.setItem('cgm-flow-state', JSON.stringify(testState));
});

// Clear localStorage
await page.evaluate(() => {
  localStorage.clear();
});
```

### Handling Dynamic Content

```typescript
// Radio options with dynamic IDs
const selectRadioOption = async (value: string) => {
  await page.getByTestId(`radio-option-${value}`).click();
};

// Device cards with dynamic IDs
const selectDevice = async (deviceId: string) => {
  await page.getByTestId(`device-card-${deviceId}`).click();
};
```

### Testing Radio Buttons vs Device Cards

```typescript
// Radio buttons - check the input element
const radioInput = page.getByTestId('radio-input-yes');
await expect(radioInput).toBeChecked();

// Device cards - check for selected styling class
const deviceCard = page.getByTestId('device-card-dexcom-g7');
await expect(deviceCard).toHaveClass(/bg-primary-light/);

// Or check for the checkmark icon
await expect(deviceCard.locator('text=✓')).toBeVisible();
```

### Verifying Step Progression

```typescript
// Check step number
await expect(page.getByText('Step 1')).toBeVisible();
await page.getByTestId('next-button').click();
await expect(page.getByText('Step 2')).toBeVisible();

// Check step title
await expect(page.getByText('Currently Using CGM')).toBeVisible();

// Check step question
await expect(page.getByText('Are you currently using a CGM device?')).toBeVisible();
```

---

## Common Testing Patterns

### Helper Functions

Create reusable helper functions in `tests/helpers/cgm-helpers.ts`:

```typescript
import { Page, expect } from '@playwright/test';

export async function selectRadioOption(page: Page, value: string) {
  await page.getByTestId(`radio-option-${value}`).click();
  await expect(page.getByTestId('next-button')).toBeEnabled();
}

export async function selectDevice(page: Page, deviceId: string) {
  await page.getByTestId(`device-card-${deviceId}`).click();
  await expect(page.getByTestId('next-button')).toBeEnabled();
}

export async function proceedToNextStep(page: Page) {
  await page.getByTestId('next-button').click();
  // Wait for navigation
  await page.waitForLoadState('networkidle');
}

export async function navigateToStep(page: Page, stepTitle: string) {
  await expect(page.getByText(stepTitle)).toBeVisible();
}

export async function verifyStepNumber(page: Page, stepNum: number) {
  await expect(page.getByText(`Step ${stepNum}`)).toBeVisible();
}

export async function clearFlowState(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('cgm-flow-state');
  });
}

export async function getFlowState(page: Page) {
  return await page.evaluate(() => {
    const state = localStorage.getItem('cgm-flow-state');
    return state ? JSON.parse(state) : null;
  });
}

// Complete flow paths
export async function completeNewUserFlow(page: Page, deviceId: string) {
  await selectRadioOption(page, 'no');
  await proceedToNextStep(page);
  
  await selectDevice(page, deviceId);
  await proceedToNextStep(page);
  
  await selectRadioOption(page, 'yes');
  await proceedToNextStep(page);
  
  await expect(page.getByText('Summary')).toBeVisible();
}

export async function completeExistingUserFlow(
  page: Page,
  wantsToSwitch: boolean,
  newDeviceId?: string
) {
  // Step 1: Currently using CGM
  await selectRadioOption(page, 'yes');
  await proceedToNextStep(page);
  
  // Step 2: Current device
  await selectDevice(page, 'dexcom-g6');
  await proceedToNextStep(page);
  
  // Step 3: Last device update
  await selectRadioOption(page, '1-3-years');
  await proceedToNextStep(page);
  
  // Step 4: Last sensors ordered
  await selectRadioOption(page, '1-3-months');
  await proceedToNextStep(page);
  
  // Step 5: Device switch intention
  await selectRadioOption(page, wantsToSwitch ? 'yes' : 'no');
  await proceedToNextStep(page);
  
  // Step 6: Device selection (only if wants to switch)
  if (wantsToSwitch && newDeviceId) {
    await selectDevice(page, newDeviceId);
    await proceedToNextStep(page);
  }
  
  // Step 7: Last doctor visit
  await selectRadioOption(page, 'yes');
  await proceedToNextStep(page);
  
  // Should be on summary
  await expect(page.getByText('Summary')).toBeVisible();
}
```

### Page Object Model Example

```typescript
// tests/pages/cgm-flow.page.ts
import { Page, Locator } from '@playwright/test';

export class CGMFlowPage {
  readonly page: Page;
  readonly startOverButton: Locator;
  readonly backButton: Locator;
  readonly nextButton: Locator;
  readonly completeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startOverButton = page.getByTestId('start-over-button');
    this.backButton = page.getByTestId('back-button');
    this.nextButton = page.getByTestId('next-button');
    this.completeButton = page.getByTestId('complete-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async selectRadio(value: string) {
    await this.page.getByTestId(`radio-option-${value}`).click();
  }

  async selectDevice(deviceId: string) {
    await this.page.getByTestId(`device-card-${deviceId}`).click();
  }

  async clickNext() {
    await this.nextButton.click();
  }

  async clickBack() {
    await this.backButton.click();
  }

  async clickStartOver() {
    await this.startOverButton.click();
  }

  async getStepTitle() {
    return await this.page.locator('h1').textContent();
  }

  async isOnStep(stepNumber: number) {
    return await this.page.getByText(`Step ${stepNumber}`).isVisible();
  }
}

// Usage in tests:
import { test, expect } from '@playwright/test';
import { CGMFlowPage } from './pages/cgm-flow.page';

test('use page object model', async ({ page }) => {
  const cgmFlow = new CGMFlowPage(page);
  
  await cgmFlow.goto();
  await cgmFlow.selectRadio('yes');
  await cgmFlow.clickNext();
  
  await cgmFlow.selectDevice('dexcom-g7');
  await cgmFlow.clickNext();
  
  expect(await cgmFlow.isOnStep(3)).toBeTruthy();
});
```

### Test Data Organization

```typescript
// tests/fixtures/test-data.ts
export const DEVICES = {
  DEXCOM_G7: 'dexcom-g7',
  DEXCOM_G6: 'dexcom-g6',
  LIBRE_3: 'libre-freestyle-3',
  LIBRE_14: 'libre-14-day',
};

export const TIME_RANGES = {
  DEVICE_UPDATE: {
    ZERO_TO_ONE: '0-1-year',
    ONE_TO_THREE: '1-3-years',
    THREE_TO_FOUR: '3-4-years',
    FIVE_PLUS: '5-plus-years',
  },
  SENSORS_ORDERED: {
    ZERO_TO_ONE: '0-1-months',
    ONE_TO_THREE: '1-3-months',
    THREE_TO_SIX: '3-6-months',
    SIX_PLUS: '6-plus-months',
  },
};

export const BOOLEAN_OPTIONS = {
  YES: 'yes',
  NO: 'no',
};

// Usage:
import { DEVICES, BOOLEAN_OPTIONS } from './fixtures/test-data';

await page.getByTestId(`device-card-${DEVICES.DEXCOM_G7}`).click();
await page.getByTestId(`radio-option-${BOOLEAN_OPTIONS.YES}`).click();
```

---

## Additional Tips

### Debugging Tests

```typescript
// Take a screenshot at any point
await page.screenshot({ path: 'screenshot.png' });

// Pause test execution to inspect
await page.pause();

// Log page content
console.log(await page.content());

// Check localStorage
console.log(await page.evaluate(() => localStorage.getItem('cgm-flow-state')));
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/cgm-flow/complete-flow.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests with specific browser
npx playwright test --project=chromium

# Generate test report
npx playwright show-report
```

### CI/CD Integration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## Summary

This guide provides a comprehensive overview of testing the CGM Device Selection Flow with Playwright. Key takeaways:

1. **Use data-testid attributes** for reliable element selection
2. **Understand conditional flow paths** to test all scenarios
3. **Test localStorage persistence** and state management
4. **Create reusable helper functions** to reduce test duplication
5. **Follow best practices** for waiting strategies and assertions
6. **Organize tests logically** by feature/functionality

For questions or issues with the testing setup, refer to the [Playwright documentation](https://playwright.dev/docs/intro).

