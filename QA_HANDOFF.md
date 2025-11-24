# QA Handoff Document
## CGM Device Selection Flow

**Document Version:** 1.0  
**Last Updated:** November 22, 2025  
**Product:** CGM Device Selection Experience  
**Status:** Ready for QA Testing

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Feature Overview](#feature-overview)
3. [Acceptance Criteria](#acceptance-criteria)
4. [User Flow Paths](#user-flow-paths)
5. [Manual Test Scenarios](#manual-test-scenarios)
6. [Test Data Reference](#test-data-reference)
7. [Known Limitations](#known-limitations)
8. [Testing Resources](#testing-resources)

---

## Executive Summary

### Purpose
This document provides comprehensive testing scenarios for the CGM (Continuous Glucose Monitor) Device Selection Flow. The feature guides patients through a multi-step questionnaire to select appropriate CGM devices based on their current usage status and preferences.

### Scope of Testing
- **User Flows:** 4 primary paths (3 conditional branches, including eligibility check)
- **Total Steps:** 4-8 steps depending on user responses (or termination at ineligibility step)
- **Supported Devices:** 5 CGM devices (Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day, and "I don't see my device")
- **Key Features:** Conditional navigation, eligibility verification, state persistence, back navigation, flow restart capability

### Target Browsers
- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)

### Testing Timeline
- **Manual Testing:** [To be scheduled]
- **Automated Testing:** Reference the [Playwright Testing Guide](PLAYWRIGHT_TESTING_GUIDE.md)
- **Sign-off Required:** Product Manager, QA Lead

---

## Feature Overview

### Business Context
The CGM Device Selection Flow streamlines the process of helping patients identify and order the most appropriate continuous glucose monitoring devices. The application adapts the questionnaire based on whether the patient is:
- A new CGM user (shorter path)
- An existing CGM user who wants to continue with their current device
- An existing CGM user who wants to switch devices

### Value Proposition
- **For Patients:** Simplified device selection process with personalized recommendations
- **For Healthcare Providers:** Structured data collection for better patient care
- **For Business:** Increased conversion and improved user experience

### Key User Benefits
1. **Smart Conditional Logic:** Questions adapt based on previous answers
2. **Session Persistence:** Progress is saved automatically (via localStorage)
3. **Easy Navigation:** Back button allows users to review/change answers
4. **Clear Summary:** Final review screen shows all selections before completion
5. **Edit from Summary:** Users can click any field heading on the Summary page to edit that specific answer and return

---

## Acceptance Criteria

### Functional Requirements

#### FR-1: Initial Load
- [ ] Application loads successfully on first visit
- [ ] First step displayed is "Currently Using CGM"
- [ ] Step counter shows "Step 1"
- [ ] Next button is disabled until selection is made
- [ ] Back button is not visible on first step
- [ ] Start Over button is visible

#### FR-2: Conditional Navigation - New User Path
- [ ] User selects "No" to "Currently Using CGM"
- [ ] Flow skips directly to "Device Selection" (step 2)
- [ ] Then proceeds to "Last Doctor Visit" (step 3)
- [ ] Ends at "Summary" (step 4)
- [ ] Total steps: 4

#### FR-3: Conditional Navigation - Existing User (No Switch)
- [ ] User selects "Yes" to "Currently Using CGM"
- [ ] Flow proceeds through: Current Device → Last Device Update → Last Sensors Ordered → Device Switch Intention
- [ ] User selects "No" to "Device Switch Intention"
- [ ] Flow skips "Device Selection" and goes directly to "Last Doctor Visit"
- [ ] Ends at "Summary"
- [ ] Total steps: 7

#### FR-4: Conditional Navigation - Existing User (Wants to Switch)
- [ ] User selects "Yes" to "Currently Using CGM"
- [ ] Flow proceeds through all device questions
- [ ] User selects "Yes" to "Device Switch Intention"
- [ ] Flow includes "Device Selection" step
- [ ] Ends at "Summary"
- [ ] Total steps: 8

#### FR-5: Form Validation
- [ ] Next button is disabled when no selection is made
- [ ] Next button enables immediately when a selection is made
- [ ] Radio buttons can be changed before clicking Next
- [ ] Device cards can be reselected before clicking Next
- [ ] All required fields must be answered to reach Summary

#### FR-6: Back Navigation
- [ ] Back button is not visible on step 1
- [ ] Back button appears on all subsequent steps
- [ ] Back button returns to the actual previous step viewed (not logical previous)
- [ ] Previous selections remain selected when navigating back
- [ ] User can change answers and navigate forward with new selections
- [ ] Step counter decrements correctly when going back

#### FR-7: State Persistence
- [ ] Progress is automatically saved to localStorage after each step
- [ ] Page refresh preserves current step and all answers
- [ ] Browser back/forward buttons maintain application state
- [ ] LocalStorage key used: `cgm-flow-state`

#### FR-8: Start Over Functionality
- [ ] Start Over button is visible on all steps
- [ ] Clicking Start Over clears localStorage
- [ ] Clicking Start Over resets to step 1
- [ ] All previous answers are cleared
- [ ] No selections are pre-selected after restart

#### FR-9: Summary Screen
- [ ] Summary displays all answered questions
- [ ] Summary only shows fields that were answered (conditional display)
- [ ] Device names display correctly (not IDs)
- [ ] Time ranges display correctly (not IDs)
- [ ] Boolean values display as "Yes" or "No"
- [ ] Complete button is visible and enabled
- [ ] Message displayed: "Thank you for completing the CGM device selection experience"
- [ ] Each field heading is clickable (appears as a link with hover effect)
- [ ] Clicking a field heading navigates to that specific step

#### FR-10: Edit from Summary
- [ ] When navigating from Summary to a step, a "Return to Summary" button appears
- [ ] When in edit mode, three buttons are shown: Back, Return to Summary, and Next
- [ ] Clicking "Return to Summary" returns user to Summary page with any changes saved
- [ ] User can edit an answer and click "Return to Summary" without affecting flow
- [ ] User can edit an answer and click "Next" to continue through normal flow
- [ ] User can use "Back" button normally while in edit mode
- [ ] Multiple fields can be edited sequentially from Summary
- [ ] Changes made during edit mode are reflected immediately on Summary
- [ ] "Return to Summary" button is only shown when navigating from Summary (not during normal flow)

#### FR-11: Device Selection
- [ ] All 5 devices are displayed with correct information
- [ ] Each device shows: name, description, icon placeholder
- [ ] Clicking a device card selects it (visual feedback with styling change)
- [ ] Only one device can be selected at a time
- [ ] Selected device shows checkmark or distinct styling
- [ ] Next button enables when device is selected

### Non-Functional Requirements

#### NFR-1: Performance
- [ ] Initial page load completes in < 2 seconds
- [ ] Step transitions are instantaneous (< 100ms)
- [ ] No visual lag when selecting options
- [ ] localStorage operations don't block UI

#### NFR-2: Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical through form elements
- [ ] Focus states are clearly visible
- [ ] ARIA labels present for screen readers (data-testid attributes)
- [ ] Color contrast meets WCAG AA standards

#### NFR-3: Responsive Design
- [ ] Layout works on mobile devices (320px min width)
- [ ] Layout works on tablets (768px)
- [ ] Layout works on desktop (1024px+)
- [ ] Touch targets are minimum 44x44px on mobile
- [ ] Text remains readable at all breakpoints

#### NFR-4: Browser Compatibility
- [ ] Works in Chrome (latest 2 versions)
- [ ] Works in Safari (latest 2 versions)
- [ ] Works in Firefox (latest 2 versions)
- [ ] Works in Edge (latest 2 versions)
- [ ] No console errors in any supported browser

---

## User Flow Paths

### Flow Diagram Overview

```
START: Currently Using CGM?
    |
    |-- [NO] --> Device Selection --> Last Doctor Visit --> SUMMARY (4 steps)
    |
    |-- [YES] --> Current Device --> Last Device Update
                                            |
                                            |-- [Device = "other" AND Update ≠ "5+ Years"] --> INELIGIBLE (Terminal)
                                            |
                                            |-- [Device ≠ "other" OR Update = "5+ Years"] --> Last Sensors Ordered
                                                                                                    |
                                                                                                    v
                                                                                        Device Switch Intention?
                                                                                                    |
                                                                                                    |-- [YES] --> Device Selection --> Last Doctor Visit --> SUMMARY (8 steps)
                                                                                                    |
                                                                                                    |-- [NO] --> Last Doctor Visit --> SUMMARY (7 steps)
```

### Path 1: New CGM User (Shortest Path)
**Total Steps: 4**

| Step # | Step Name | Question | Options | Next Step |
|--------|-----------|----------|---------|-----------|
| 1 | Currently Using CGM | Are you currently using a CGM device? | Yes / No | **Select: No** → Step 2 |
| 2 | Device Selection | Which CGM device would you like to select? | Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day | Step 3 |
| 3 | Last Doctor Visit | Have you seen your primary care physician in the last 6 months? | Yes / No | Step 4 |
| 4 | Summary | Review Your Selections | (Display only) | Complete |

**Expected Summary Fields:**
- Currently Using CGM: No
- Selected Device: [Selected device name]
- Seen Doctor in Last 6 Months: [Yes/No]

---

### Path 2: Existing User - Staying with Current Device
**Total Steps: 7**

| Step # | Step Name | Question | Options | Next Step |
|--------|-----------|----------|---------|-----------|
| 1 | Currently Using CGM | Are you currently using a CGM device? | Yes / No | **Select: Yes** → Step 2 |
| 2 | Current Device | Which CGM device are you currently using? | Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day | Step 3 |
| 3 | Last Device Update | When was your last device update? | 0-1 Year, 1-3 Years, 3-4 Years, 5+ Years | Step 4 |
| 4 | Last Sensors Ordered | When did you last order sensors? | 0-1 months, 1-3 months, 3-6 months, 6+ months | Step 5 |
| 5 | Device Switch Intention | Are you interested in switching to a different CGM device? | Yes / No | **Select: No** → Step 6 |
| 6 | Last Doctor Visit | Have you seen your primary care physician in the last 6 months? | Yes / No | Step 7 |
| 7 | Summary | Review Your Selections | (Display only) | Complete |

**Expected Summary Fields:**
- Currently Using CGM: Yes
- Current Device: [Selected device name]
- Last Device Update: [Selected timeframe]
- Last Sensors Ordered: [Selected timeframe]
- Interested in Switching: No
- Seen Doctor in Last 6 Months: [Yes/No]

**Note:** "Selected Device" field should NOT appear in summary for this path.

---

### Path 3: Ineligible User - Device Not Listed with Recent Update
**Total Steps: 4 (Terminal)**

| Step # | Step Name | Question | Options | Next Step |
|--------|-----------|----------|---------|-----------|
| 1 | Currently Using CGM | Are you currently using a CGM device? | Yes / No | **Select: Yes** → Step 2 |
| 2 | Current Device | Which CGM device are you currently using? | Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day, I don't see my device | **Select: I don't see my device** → Step 3 |
| 3 | Last Device Update | When was your last device update? | 0-1 Year, 1-3 Years, 3-4 Years, 5+ Years | **Select: Any except 5+ Years** → Step 4 |
| 4 | Ineligible Selection | Eligibility Status | (Display only - ineligible message) | Terminal - Back or Start Over |

**Expected Behavior:**
- Step 4 displays ineligibility message
- No Next or Complete button shown
- Only Back button available
- Customer support phone number (1-800-555-0123) is clickable
- Message explains: device not specified AND less than 5 years since last update
- User must go back to change answers or use Start Over

**Note:** If user goes back and changes either:
- Current Device to a specific device (not "I don't see my device"), OR
- Last Device Update to "5+ Years"
Then they become eligible and continue with normal flow.

---

### Path 4: Existing User - Wants to Switch Devices
**Total Steps: 8**

| Step # | Step Name | Question | Options | Next Step |
|--------|-----------|----------|---------|-----------|
| 1 | Currently Using CGM | Are you currently using a CGM device? | Yes / No | **Select: Yes** → Step 2 |
| 2 | Current Device | Which CGM device are you currently using? | Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day | Step 3 |
| 3 | Last Device Update | When was your last device update? | 0-1 Year, 1-3 Years, 3-4 Years, 5+ Years | Step 4 |
| 4 | Last Sensors Ordered | When did you last order sensors? | 0-1 months, 1-3 months, 3-6 months, 6+ months | Step 5 |
| 5 | Device Switch Intention | Are you interested in switching to a different CGM device? | Yes / No | **Select: Yes** → Step 6 |
| 6 | Device Selection | Which CGM device would you like to select? | Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day | Step 7 |
| 7 | Last Doctor Visit | Have you seen your primary care physician in the last 6 months? | Yes / No | Step 8 |
| 8 | Summary | Review Your Selections | (Display only) | Complete |

**Expected Summary Fields:**
- Currently Using CGM: Yes
- Current Device: [Selected device name]
- Last Device Update: [Selected timeframe]
- Last Sensors Ordered: [Selected timeframe]
- Interested in Switching: Yes
- Selected Device: [New selected device name]
- Seen Doctor in Last 6 Months: [Yes/No]

---

## Manual Test Scenarios

### Test Case Format
Each test case includes:
- **Test Case ID:** Unique identifier
- **Priority:** Critical, High, Medium, Low
- **Objective:** What is being tested
- **Preconditions:** Required state before testing
- **Steps:** Numbered execution steps
- **Expected Results:** What should happen
- **Actual Results:** [To be filled during testing]
- **Pass/Fail:** [To be marked during testing]

---

### Happy Path Scenarios

#### TC-001: Complete New User Flow
**Priority:** Critical  
**Objective:** Verify new CGM user can complete the entire flow successfully

**Preconditions:**
- Application is loaded
- No localStorage data exists (clear browser cache)

**Steps:**
1. Navigate to the application URL
2. Verify you're on step 1 "Currently Using CGM"
3. Click "No" radio option
4. Click "Next" button
5. Verify you're on step 2 "Device Selection"
6. Click on "Libre FreeStyle 3" device card
7. Click "Next" button
8. Verify you're on step 3 "Last Doctor Visit"
9. Click "Yes" radio option
10. Click "Next" button
11. Verify you're on step 4 "Summary"
12. Verify summary shows:
    - Currently Using CGM: No
    - Selected Device: Libre FreeStyle 3
    - Seen Doctor in Last 6 Months: Yes
13. Click "Complete" button

**Expected Results:**
- User progresses through exactly 4 steps
- Each step displays correct question and options
- Next button is disabled until selection is made
- Summary displays all selections correctly
- No errors occur during flow

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-002: Complete Existing User Flow - No Switch
**Priority:** Critical  
**Objective:** Verify existing CGM user who doesn't want to switch can complete the flow

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Navigate to the application URL
2. On "Currently Using CGM", click "Yes"
3. Click "Next"
4. On "Current Device", select "Dexcom G6"
5. Click "Next"
6. On "Last Device Update", select "1-3 Years"
7. Click "Next"
8. On "Last Sensors Ordered", select "1-3 months"
9. Click "Next"
10. On "Device Switch Intention", click "No"
11. Click "Next"
12. Verify you're on "Last Doctor Visit" (Device Selection was skipped)
13. Click "Yes"
14. Click "Next"
15. Verify you're on "Summary" (step 7)
16. Verify summary shows:
    - Currently Using CGM: Yes
    - Current Device: Dexcom G6
    - Last Device Update: 1-3 Years
    - Last Sensors Ordered: 1-3 months
    - Interested in Switching: No
    - Seen Doctor in Last 6 Months: Yes
    - "Selected Device" field should NOT appear
17. Click "Complete"

**Expected Results:**
- User progresses through exactly 7 steps
- Device Selection step is skipped
- Summary correctly omits "Selected Device" field
- All other answers are displayed correctly

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-003: Complete Existing User Flow - Wants to Switch
**Priority:** Critical  
**Objective:** Verify existing CGM user who wants to switch can complete the flow

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Navigate to the application URL
2. On "Currently Using CGM", click "Yes"
3. Click "Next"
4. On "Current Device", select "Dexcom G6"
5. Click "Next"
6. On "Last Device Update", select "0-1 Year"
7. Click "Next"
8. On "Last Sensors Ordered", select "0-1 months"
9. Click "Next"
10. On "Device Switch Intention", click "Yes"
11. Click "Next"
12. Verify you're on "Device Selection" (step 6)
13. Select "Dexcom G7"
14. Click "Next"
15. On "Last Doctor Visit", click "No"
16. Click "Next"
17. Verify you're on "Summary" (step 8)
18. Verify summary shows:
    - Currently Using CGM: Yes
    - Current Device: Dexcom G6
    - Last Device Update: 0-1 Year
    - Last Sensors Ordered: 0-1 months
    - Interested in Switching: Yes
    - Selected Device: Dexcom G7
    - Seen Doctor in Last 6 Months: No
19. Click "Complete"

**Expected Results:**
- User progresses through exactly 8 steps (longest path)
- Device Selection step is included
- Summary shows both current device AND selected device
- All answers are displayed correctly

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Navigation & State Scenarios

#### TC-004: Back Button Navigation
**Priority:** High  
**Objective:** Verify back button correctly navigates to previous steps and preserves selections

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Navigate to the application URL
2. Verify "Back" button is NOT visible on step 1
3. Select "Yes" for "Currently Using CGM" and click "Next"
4. Verify "Back" button IS visible on step 2
5. Select "Dexcom G7" and click "Next"
6. Select "1-3 Years" and click "Next"
7. Verify you're on step 4 "Last Sensors Ordered"
8. Click "Back" button
9. Verify you're on step 3 "Last Device Update"
10. Verify "1-3 Years" is still selected
11. Click "Back" button
12. Verify you're on step 2 "Current Device"
13. Verify "Dexcom G7" is still selected
14. Click "Back" button
15. Verify you're on step 1 "Currently Using CGM"
16. Verify "Yes" is still selected
17. Verify "Back" button is NOT visible on step 1

**Expected Results:**
- Back button visibility is correct at each step
- Previous selections are preserved when navigating back
- Step counter decrements correctly
- Can navigate back to step 1

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-005: Changing Answers Via Back Button
**Priority:** High  
**Objective:** Verify user can change answers by navigating back and the flow adapts correctly

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Navigate to the application URL
2. Select "No" for "Currently Using CGM" and click "Next"
3. Verify you're on "Device Selection" (step 2)
4. Select "Libre 14 Day" and click "Next"
5. Verify you're on "Last Doctor Visit" (step 3)
6. Click "Back" button twice to return to step 1
7. Change selection to "Yes" and click "Next"
8. Verify you're now on "Current Device" (step 2)
9. Verify the flow now follows the existing user path
10. Complete the flow as an existing user

**Expected Results:**
- Changing first answer correctly redirects to different path
- Previous answers from abandoned path don't affect new path
- Flow logic correctly adapts to new selections
- Can successfully complete the new path

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-006: Start Over Functionality
**Priority:** High  
**Objective:** Verify Start Over button resets the entire flow and clears localStorage

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to the application URL
2. Progress through 4-5 steps (make various selections)
3. Note current step number (e.g., "Step 5")
4. Open browser developer tools → Application/Storage → Local Storage
5. Verify `cgm-flow-state` key exists with data
6. Click "Start Over" button
7. Verify you're back on step 1 "Currently Using CGM"
8. Verify step counter shows "Step 1"
9. Verify no selections are pre-selected
10. Check localStorage - verify `cgm-flow-state` key is removed
11. Try progressing through flow again
12. Verify flow works normally after restart

**Expected Results:**
- Start Over button is visible on all steps
- Clicking Start Over immediately returns to step 1
- All previous selections are cleared
- localStorage is cleared
- Flow can be completed normally after restart
- No errors occur

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-007: State Persistence - Page Reload
**Priority:** High  
**Objective:** Verify flow state persists after page reload

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Navigate to the application URL
2. Progress through 3 steps making selections:
   - Step 1: Select "No"
   - Step 2: Select "Dexcom G7"
   - Step 3: Currently on "Last Doctor Visit"
3. Note current step: "Step 3"
4. Reload the page (F5 or Cmd+R)
5. Wait for page to reload
6. Verify you're still on step 3 "Last Doctor Visit"
7. Verify step counter shows "Step 3"
8. Click "Back" button
9. Verify "Dexcom G7" is still selected on step 2
10. Click "Back" button
11. Verify "No" is still selected on step 1
12. Navigate forward again
13. Complete the flow

**Expected Results:**
- Current step is preserved after reload
- All previous answers are preserved
- Can navigate back to see all previous selections
- Can continue and complete flow normally
- No data loss occurs

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Validation & Error Scenarios

#### TC-008: Next Button Disabled State
**Priority:** High  
**Objective:** Verify Next button is properly disabled until a selection is made

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to the application URL
2. Verify "Next" button is disabled (greyed out or unclickable)
3. Try clicking "Next" button (should not advance)
4. Click "Yes" radio option
5. Verify "Next" button is now enabled
6. Click "Next" button
7. Verify you advance to step 2
8. Verify "Next" button is disabled again on step 2
9. Click any device card
10. Verify "Next" button is enabled
11. Repeat validation for all steps

**Expected Results:**
- Next button is disabled on page load for all question steps
- Next button enables immediately when selection is made
- Cannot advance without making a selection
- Behavior is consistent across all steps

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-009: Radio Button Selection Changes
**Priority:** Medium  
**Objective:** Verify user can change radio selection before clicking Next

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to the application URL
2. Click "Yes" radio option
3. Verify "Yes" is selected (filled circle)
4. Verify "Next" button is enabled
5. Click "No" radio option
6. Verify "No" is now selected
7. Verify "Yes" is no longer selected
8. Verify "Next" button remains enabled
9. Click "Yes" again
10. Click "Next"
11. Verify flow proceeds based on most recent selection ("Yes")

**Expected Results:**
- Only one radio option can be selected at a time
- Selection can be changed multiple times before clicking Next
- Next button remains enabled when changing between options
- Flow uses the final selection when Next is clicked

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-010: Device Card Selection Changes
**Priority:** Medium  
**Objective:** Verify user can change device selection before clicking Next

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to a device selection step (either step 2 for new users or later for existing users)
2. Click on "Dexcom G7" card
3. Verify "Dexcom G7" card shows selected state (distinct styling/checkmark)
4. Verify "Next" button is enabled
5. Click on "Libre FreeStyle 3" card
6. Verify "Libre FreeStyle 3" is now selected
7. Verify "Dexcom G7" is no longer selected
8. Verify "Next" button remains enabled
9. Click "Next"
10. Complete the flow
11. On Summary, verify "Libre FreeStyle 3" is shown (the final selection)

**Expected Results:**
- Only one device can be selected at a time
- Visual feedback clearly indicates which device is selected
- Selection can be changed multiple times before clicking Next
- Summary reflects the final device selection

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Device Combination Scenarios

#### TC-011: All Device Selections - New User Path
**Priority:** Medium  
**Objective:** Verify all 5 devices work correctly in the new user path

**Preconditions:**
- Application is loaded

**Steps:**
For each device (Dexcom G7, Dexcom G6, Libre FreeStyle 3, Libre 14 Day, I don't see my device):
1. Start/restart the flow
2. Select "No" for "Currently Using CGM"
3. Click "Next"
4. Select the device
5. Click "Next"
6. Select "Yes" for "Last Doctor Visit"
7. Click "Next"
8. On Summary, verify correct device name is displayed
9. Click "Start Over"

**Expected Results:**
- All 5 devices can be selected
- Each device displays correct name and description
- Summary shows correct device name for each
- No errors occur with any device
- Device names are displayed (not IDs)

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-012: Device Switch - Same Device Selection
**Priority:** Medium  
**Objective:** Verify user can select the same device they currently have when switching

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to the application URL
2. Select "Yes" for "Currently Using CGM"
3. On "Current Device", select "Dexcom G6"
4. Progress through device update and sensor questions
5. Select "Yes" for "Device Switch Intention"
6. On "Device Selection", select "Dexcom G6" again (same as current)
7. Complete the flow
8. On Summary, verify:
   - Current Device: Dexcom G6
   - Selected Device: Dexcom G6

**Expected Results:**
- User can select the same device they currently have
- No error or validation message appears
- Summary shows both fields with the same device
- Flow completes successfully

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-012a: Device Selection - Cannot Select Same Device as Current When Going Back
**Priority:** High  
**Objective:** Verify validation prevents selecting the same device on Current Device that was already selected on Device Selection

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to the application URL
2. Select "Yes" for "Currently Using CGM"
3. On "Current Device", select "Dexcom G6"
4. Progress through device update and sensor questions
5. Select "Yes" for "Device Switch Intention"
6. On "Device Selection", select "Dexcom G7"
7. Continue to next steps, then click "Back" multiple times to return to "Current Device"
8. Change selection to "Dexcom G7" (same as Device Selection)
9. Click "Next" button
10. Verify validation error message appears
11. Verify error message includes "Dexcom G7" device name
12. Verify error message states "You cannot select Dexcom G7 as your current device because you've already selected it as your new device."
13. Verify you remain on "Current Device" step
14. Change selection to a different device (e.g., "Dexcom G6")
15. Click "Next" button
16. Verify you can proceed normally

**Expected Results:**
- Validation error appears when current device matches device selection
- Error message clearly identifies the device name
- User cannot proceed with matching devices
- User remains on Current Device step when validation fails
- Flow continues normally after changing to a different device
- Validation only applies when going back after Device Selection was already answered

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-012b: Device Selection - Cannot Return to Summary with Same Device Selection
**Priority:** High  
**Objective:** Verify validation prevents returning to summary when current device matches device selection during edit mode

**Preconditions:**
- Application is loaded
- User has completed the full flow and is on Summary page

**Steps:**
1. Complete the existing user switching devices flow (8 steps total):
   - Currently Using CGM: Yes
   - Current Device: Dexcom G6
   - Last Device Update: 1-3 Years
   - Last Sensors Ordered: 1-3 months
   - Device Switch Intention: Yes
   - Device Selection: Dexcom G7
   - Last Doctor Visit: Yes
2. Verify you're on Summary page
3. Click on "Current Device" heading to edit
4. Verify you navigate to "Current Device" step
5. Verify "Return to Summary" button is visible
6. Change selection to "Dexcom G7" (same as Device Selection)
7. Click "Return to Summary" button
8. Verify validation error message appears
9. Verify error message includes "Dexcom G7" device name
10. Verify error message states "You cannot select Dexcom G7 as your current device because you've already selected it as your new device."
11. Verify you remain on "Current Device" step
12. Change selection back to "Dexcom G6" (different device)
13. Click "Return to Summary" button
14. Verify you return to Summary page successfully
15. Verify "Current Device" still shows "Dexcom G6"
16. Verify no validation error is displayed

**Expected Results:**
- Validation error appears when trying to return to summary with matching devices
- Error message clearly identifies the device name
- User cannot return to summary with matching devices
- User remains on Current Device step when validation fails
- Return to Summary works normally after changing to a different device
- Changes are preserved when successfully returning to summary
- Validation applies to both "Next" and "Return to Summary" buttons

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Time Range Validation Scenarios

#### TC-013: All Time Range Selections - Device Update
**Priority:** Medium  
**Objective:** Verify all device update time ranges work correctly

**Preconditions:**
- Application is loaded

**Steps:**
For each time range (0-1 Year, 1-3 Years, 3-4 Years, 5+ Years):
1. Start/restart the flow
2. Select existing user path (Yes to "Currently Using CGM")
3. Select any current device
4. On "Last Device Update", select the time range
5. Complete the flow to Summary
6. Verify correct time range label is displayed in Summary
7. Click "Start Over"

**Expected Results:**
- All 4 time ranges can be selected
- Each time range has correct label (not ID)
- Summary displays correct time range label
- No errors occur

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-014: All Time Range Selections - Sensors Ordered
**Priority:** Medium  
**Objective:** Verify all sensor order time ranges work correctly

**Preconditions:**
- Application is loaded

**Steps:**
For each time range (0-1 months, 1-3 months, 3-6 months, 6+ months):
1. Start/restart the flow
2. Navigate to "Last Sensors Ordered" step
3. Select the time range
4. Complete the flow to Summary
5. Verify correct time range label is displayed
6. Click "Start Over"

**Expected Results:**
- All 4 time ranges can be selected
- Each time range has correct label (not ID)
- Summary displays correct time range label
- No errors occur

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Edge Cases & Boundary Conditions

#### TC-015: Multiple Browser Tabs
**Priority:** Low  
**Objective:** Verify behavior when flow is open in multiple tabs

**Preconditions:**
- Application is loaded in Tab 1

**Steps:**
1. In Tab 1, progress through 3 steps
2. Open the same URL in Tab 2
3. Verify Tab 2 shows the same step and data as Tab 1 (step 3)
4. In Tab 2, click "Back" to go to step 2
5. In Tab 1, refresh the page
6. Verify Tab 1 now shows step 2 (localStorage is shared)
7. In Tab 2, click "Start Over"
8. In Tab 1, refresh the page
9. Verify Tab 1 is now on step 1

**Expected Results:**
- localStorage is shared between tabs
- State changes in one tab affect other tabs after refresh
- No data corruption occurs
- Behavior is predictable and documented

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-016: Browser Back/Forward Buttons
**Priority:** Medium  
**Objective:** Verify application behavior with browser navigation buttons

**Preconditions:**
- Application is loaded

**Steps:**
1. Navigate to the application URL
2. Progress through 4 steps (making selections)
3. Click browser "Back" button
4. Note the behavior
5. Click browser "Forward" button
6. Note the behavior
7. Verify flow state is still consistent
8. Continue completing the flow

**Expected Results:**
- Document expected behavior (may refresh page or show previous step)
- Application remains functional
- No errors occur
- User can still complete the flow
- localStorage state is preserved

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-017: Summary with Minimal Data - New User
**Priority:** Low  
**Objective:** Verify Summary displays correctly with minimum required fields

**Preconditions:**
- Application is loaded

**Steps:**
1. Complete new user path (shortest path)
2. On Summary, verify only the following fields are shown:
   - Currently Using CGM: No
   - Selected Device: [device name]
   - Seen Doctor in Last 6 Months: [Yes/No]
3. Verify the following fields are NOT shown:
   - Current Device
   - Last Device Update
   - Last Sensors Ordered
   - Interested in Switching

**Expected Results:**
- Summary only displays fields that were answered
- No "Not specified" values are shown
- No empty fields are displayed
- Layout looks correct with fewer fields

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-018: LocalStorage Quota
**Priority:** Low  
**Objective:** Verify application handles localStorage gracefully

**Preconditions:**
- Application is loaded

**Steps:**
1. Open browser developer tools
2. Navigate to Application/Storage → Local Storage
3. Check size of `cgm-flow-state` value
4. Complete multiple full flows (without clearing localStorage)
5. Verify application continues to work
6. Check for any console errors related to storage

**Expected Results:**
- localStorage data is reasonably sized (< 5KB)
- No quota errors occur during normal use
- Application handles storage errors gracefully if they occur
- No data corruption

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Edit from Summary Scenarios

#### TC-029: Edit Single Field from Summary
**Priority:** High  
**Objective:** Verify user can edit a single field from the Summary page and return

**Preconditions:**
- Application is loaded
- User has completed the full flow and is on Summary page

**Steps:**
1. Complete any full flow path to reach Summary
2. Note the value displayed for "Current Device" (or any field)
3. Click on the "Current Device" heading
4. Verify you navigate to the "Current Device" step
5. Verify the "Return to Summary" button is visible
6. Verify three buttons are shown: Back, Return to Summary, Next
7. Change the device selection to a different device
8. Click "Return to Summary" button
9. Verify you're back on the Summary page
10. Verify the "Current Device" field shows the new device
11. Verify other fields remain unchanged
12. Click "Complete" button

**Expected Results:**
- Field heading is clickable with hover effect
- Navigation to specific step works correctly
- Return to Summary button appears and functions
- Changed value is reflected on Summary
- Other answers are preserved
- Flow can still be completed

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-030: Edit Multiple Fields from Summary
**Priority:** High  
**Objective:** Verify user can edit multiple different fields from Summary

**Preconditions:**
- User has completed the full flow and is on Summary page

**Steps:**
1. Complete the longest flow path (existing user who wants to switch)
2. On Summary, click "Current Device" heading
3. Change the device selection
4. Click "Return to Summary"
5. Verify you're back on Summary with updated device
6. Click "Device Switch Intention" heading
7. Change the answer
8. Click "Return to Summary"
9. Verify you're back on Summary with updated answer
10. Click "Last Doctor Visit" heading
11. Change the answer
12. Click "Return to Summary"
13. Verify all three changes are reflected on Summary
14. Click "Complete"

**Expected Results:**
- Multiple fields can be edited sequentially
- Each return to Summary preserves all previous changes
- Summary always shows the most current values
- No data loss occurs
- Flow can be completed after multiple edits

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-031: Use Next Button During Edit from Summary
**Priority:** Medium  
**Objective:** Verify clicking Next while in edit mode continues normal flow

**Preconditions:**
- User has completed the flow and is on Summary page

**Steps:**
1. Complete the flow to reach Summary
2. Click on a field heading that has multiple steps after it (e.g., "Current Device")
3. Verify "Return to Summary" button is visible
4. Make a change to the selection
5. Click "Next" button (not Return to Summary)
6. Verify you proceed to the next step in the normal flow
7. Verify "Return to Summary" button is still visible
8. Continue clicking "Next" through several steps
9. Click "Return to Summary" from any step
10. Verify you return to Summary
11. Verify all changes made during the flow are reflected

**Expected Results:**
- Next button continues normal flow progression
- Return to Summary button remains available through multiple steps
- Can return to Summary from any step reached during edit mode
- All changes are preserved
- Flow logic remains correct

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-032: Use Back Button During Edit from Summary
**Priority:** Medium  
**Objective:** Verify Back button works correctly when in edit mode from Summary

**Preconditions:**
- User has completed the flow and is on Summary page

**Steps:**
1. Complete the flow to reach Summary
2. Click on "Last Sensors Ordered" heading (a middle step)
3. Verify "Return to Summary" button is visible
4. Click "Back" button
5. Verify you go to the previous step ("Last Device Update")
6. Verify "Return to Summary" button is still visible
7. Click "Back" again
8. Verify you go to "Current Device"
9. Verify "Return to Summary" button is still visible
10. Make a change
11. Click "Return to Summary"
12. Verify you return to Summary with the change reflected

**Expected Results:**
- Back button functions normally during edit mode
- Return to Summary button persists when using Back
- Can navigate backward multiple steps
- Can return to Summary from any step
- Changes are preserved

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-033: Edit from Summary - All Clickable Fields
**Priority:** High  
**Objective:** Verify all field headings on Summary are clickable and navigate correctly

**Preconditions:**
- User has completed the longest flow path

**Steps:**
1. Complete the existing user switching devices flow (8 steps total)
2. On Summary, note all displayed field headings:
   - Currently Using CGM
   - Current Device
   - Last Device Update
   - Last Sensors Ordered
   - Interested in Switching
   - Selected Device
   - Seen Doctor in Last 6 Months
3. For each field heading:
   a. Click the heading
   b. Verify navigation to the correct step
   c. Verify "Return to Summary" button appears
   d. Click "Return to Summary"
   e. Verify return to Summary page

**Expected Results:**
- All field headings are clickable
- Each heading navigates to its corresponding step
- Return to Summary works from every step
- No errors occur
- Navigation is always correct

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-034: Edit from Summary - Conditional Field Visibility
**Priority:** Medium  
**Objective:** Verify only answered fields are clickable on Summary

**Preconditions:**
- Application is loaded

**Steps:**
1. Complete the shortest flow path (new user - 4 steps)
2. On Summary, verify only these fields are displayed and clickable:
   - Currently Using CGM
   - Selected Device
   - Seen Doctor in Last 6 Months
3. Verify these fields are NOT displayed (because they weren't answered):
   - Current Device
   - Last Device Update
   - Last Sensors Ordered
   - Interested in Switching
4. Click each visible field heading to verify it works
5. Return to Summary after each edit

**Expected Results:**
- Only answered fields appear on Summary
- Only displayed field headings are clickable
- Navigation works correctly for all visible fields
- No errors or null references occur

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-035: Edit from Summary - State Persistence
**Priority:** High  
**Objective:** Verify edit mode state is handled correctly with page reload

**Preconditions:**
- User has completed the flow and is on Summary page

**Steps:**
1. Complete a full flow to reach Summary
2. Click on a field heading to enter edit mode
3. Verify "Return to Summary" button is visible
4. Reload the page (F5 or Cmd+R)
5. Wait for page to reload
6. Verify the correct step is displayed
7. Verify "Return to Summary" button is NOT visible (normal mode restored)
8. Make a change if needed
9. Click "Next" to continue normal flow
10. Verify flow progression is normal (not in edit mode)

**Expected Results:**
- Page reload resets edit mode
- User remains on the current step
- Return to Summary button disappears after reload
- Flow continues in normal mode
- No errors or state corruption

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-036: Edit from Summary - Visual Feedback
**Priority:** Medium  
**Objective:** Verify proper visual feedback for clickable field headings

**Preconditions:**
- User has completed the flow and is on Summary page

**Steps:**
1. Complete any flow to reach Summary
2. Hover mouse over different field headings
3. Verify visual feedback on hover (cursor change, color change, underline)
4. Move mouse away and verify styling returns to normal
5. Click a field heading
6. Navigate to that step
7. Verify the heading text was clear and the navigation was expected
8. Return to Summary
9. Test hover behavior on all field headings

**Expected Results:**
- Field headings show clear hover state (cursor pointer)
- Hover styling indicates clickability (color change, underline)
- Visual feedback is consistent across all fields
- Accessibility is maintained (keyboard focus states)
- No confusion about what is clickable

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-037: Edit from Summary - Return Button Appearance
**Priority:** Medium  
**Objective:** Verify Return to Summary button only appears when appropriate

**Preconditions:**
- Application is loaded

**Steps:**
1. Start a new flow from step 1
2. Progress through steps 1-3 normally
3. Verify "Return to Summary" button is NOT visible
4. Complete the flow to reach Summary
5. Click "Back" from Summary
6. Verify "Return to Summary" button is NOT visible (normal back navigation)
7. Navigate forward to Summary again
8. Click a field heading to edit
9. Verify "Return to Summary" button IS visible
10. Click "Back"
11. Verify "Return to Summary" button IS still visible
12. Click "Start Over"
13. Progress through flow normally
14. Verify "Return to Summary" button never appears during normal flow

**Expected Results:**
- Button only appears when navigating from Summary via field heading
- Button persists when using Back/Next during edit mode
- Button does NOT appear during normal flow progression
- Button does NOT appear when using Back from Summary
- Behavior is consistent and predictable

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-038: Validation - Cannot Return to Summary with Ineligible Answers
**Priority:** High  
**Objective:** Verify validation prevents returning to Summary when answers make user ineligible

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Complete flow with the following path:
   - Currently Using CGM: Yes
   - Current Device: "I don't see my device"
   - Last Device Update: "5+ Years" (eligible)
   - Last Sensors Ordered: "0-1 months"
   - Device Switch Intention: Yes
   - Device Selection: "Dexcom G7"
   - Last Doctor Visit: Yes
2. Verify you reach Summary page
3. Click "Last Device Update" heading to edit
4. Verify you navigate to Last Device Update step
5. Change selection to "0-1 Year" (ineligible answer)
6. Click "Return to Summary" button
7. Verify validation error message appears:
   - Message should say: "You must select '5+ Years' for your last device update to return to the summary, or click 'Next' to continue."
8. Verify you remain on Last Device Update step
9. Verify Summary is NOT displayed
10. Click "Next" button
11. Verify you navigate to "Ineligible for Equipment" step
12. Verify phone number and ineligibility message are displayed

**Expected Results:**
- Return to Summary button is blocked when answers are ineligible
- Clear validation error message explains why user cannot return
- User remains on current step when validation fails
- Next button still works and proceeds to Ineligible Selection step
- Normal flow logic remains intact

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-039: Validation - Can Return After Fixing Ineligible Answer
**Priority:** High  
**Objective:** Verify user can return to Summary after changing answer from ineligible to eligible

**Preconditions:**
- Application is loaded
- Following TC-038 setup through step 7 (validation error showing)

**Steps:**
1. Start from Last Device Update step with validation error showing
2. Verify validation error is visible
3. Change selection back to "5+ Years"
4. Click "Return to Summary" button
5. Verify you navigate back to Summary page
6. Verify "Your CGM Experience Profile" is displayed
7. Verify validation error is no longer visible
8. Verify "Last Device Update" field shows "5+ Years"
9. Verify all other fields remain unchanged
10. Click "Complete" button to verify flow can be completed

**Expected Results:**
- Changing answer to eligible value clears validation error
- Return to Summary button works after fixing the answer
- Updated answer is reflected on Summary page
- Other answers are preserved
- Flow can be completed successfully

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-027: Ineligible User Flow - Device "Other" with Recent Update
**Priority:** Critical  
**Objective:** Verify ineligibility detection when user selects "I don't see my device" and update < 5 years

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**
1. Navigate to the application URL
2. On "Currently Using CGM", click "Yes"
3. Click "Next"
4. On "Current Device", select "I don't see my device"
5. Click "Next"
6. On "Last Device Update", select "0-1 Year"
7. Click "Next"
8. Verify you're on "Ineligible for Equipment" step
9. Verify ineligibility message is displayed
10. Verify message mentions: not selecting specific device AND less than 5 years
11. Verify phone number "1-800-555-0123" is displayed
12. Click phone number link
13. Verify it opens phone dialer with correct number
14. Verify only "Back" button is shown (no Next or Complete button)
15. Repeat test with "1-3 Years" and "3-4 Years" selections

**Expected Results:**
- User is routed to ineligibility step
- Clear message explains why they're ineligible
- Phone number is clickable (tel: link)
- Only Back button available
- Flow terminates at this step (cannot proceed)

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-028: Eligibility Edge Cases
**Priority:** High  
**Objective:** Verify correct eligibility routing for edge cases

**Preconditions:**
- Application is loaded
- No localStorage data exists

**Steps:**

**Test Case A: "Other" device with 5+ years (ELIGIBLE)**
1. Navigate to application
2. Select "Yes" for Currently Using CGM
3. Select "I don't see my device" for Current Device
4. Select "5+ Years" for Last Device Update
5. Click "Next"
6. Verify you proceed to "Last Sensors Ordered" (NOT ineligible)

**Test Case B: Specific device with recent update (ELIGIBLE)**
7. Click "Start Over"
8. Select "Yes" for Currently Using CGM
9. Select "Dexcom G7" for Current Device
10. Select "0-1 Year" for Last Device Update
11. Click "Next"
12. Verify you proceed to "Last Sensors Ordered" (NOT ineligible)

**Test Case C: User corrects from ineligible state**
13. Click "Start Over"
14. Navigate to ineligible state (other device + 0-1 year)
15. Click "Back" from ineligible step
16. Change "Last Device Update" to "5+ Years"
17. Click "Next"
18. Verify you proceed to "Last Sensors Ordered"
19. Complete flow successfully

**Expected Results:**
- Only users with "other" device AND < 5 years update are ineligible
- All other combinations allow flow to continue
- Users can correct their answers and continue

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Cross-Browser Testing Checklist

#### TC-019: Chrome Browser Testing
**Priority:** Critical  
**Objective:** Verify full functionality in Chrome

**Preconditions:**
- Chrome browser (latest version)

**Steps:**
1. Execute TC-001, TC-002, TC-003 (all happy paths)
2. Execute TC-004 (back navigation)
3. Execute TC-006 (start over)
4. Execute TC-007 (state persistence)
5. Verify no console errors
6. Verify UI renders correctly
7. Verify localStorage works

**Expected Results:**
- All test cases pass
- No browser-specific issues
- UI is visually correct
- No console errors

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-020: Safari Browser Testing
**Priority:** Critical  
**Objective:** Verify full functionality in Safari

**Preconditions:**
- Safari browser (latest version)

**Steps:**
1. Execute TC-001, TC-002, TC-003 (all happy paths)
2. Execute TC-004 (back navigation)
3. Execute TC-006 (start over)
4. Execute TC-007 (state persistence)
5. Verify no console errors
6. Verify UI renders correctly
7. Verify localStorage works
8. Test on both macOS and iOS if possible

**Expected Results:**
- All test cases pass
- No browser-specific issues
- localStorage works in private browsing mode
- No console errors

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-021: Firefox Browser Testing
**Priority:** High  
**Objective:** Verify full functionality in Firefox

**Preconditions:**
- Firefox browser (latest version)

**Steps:**
1. Execute TC-001, TC-002, TC-003 (all happy paths)
2. Execute TC-004 (back navigation)
3. Execute TC-006 (start over)
4. Execute TC-007 (state persistence)
5. Verify no console errors
6. Verify UI renders correctly

**Expected Results:**
- All test cases pass
- No browser-specific issues
- No console errors

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-022: Edge Browser Testing
**Priority:** High  
**Objective:** Verify full functionality in Edge

**Preconditions:**
- Edge browser (latest version)

**Steps:**
1. Execute TC-001, TC-002, TC-003 (all happy paths)
2. Execute TC-004 (back navigation)
3. Execute TC-006 (start over)
4. Execute TC-007 (state persistence)
5. Verify no console errors
6. Verify UI renders correctly

**Expected Results:**
- All test cases pass
- No browser-specific issues
- No console errors

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Mobile Responsiveness Testing

#### TC-023: Mobile Device Testing - Portrait
**Priority:** High  
**Objective:** Verify application works on mobile devices in portrait orientation

**Preconditions:**
- Mobile device or browser DevTools mobile emulation (iPhone 12, Samsung Galaxy)

**Steps:**
1. Open application in mobile browser or emulation (portrait mode)
2. Verify layout is responsive (no horizontal scrolling)
3. Verify text is readable (not too small)
4. Verify touch targets are at least 44x44px
5. Complete one full flow path
6. Test radio buttons are easy to tap
7. Test device cards are easy to tap
8. Test all buttons (Next, Back, Start Over) work
9. Verify Summary displays correctly

**Expected Results:**
- Layout adapts to narrow screen
- All elements are accessible and tappable
- No content is cut off
- Text is readable
- Flow completes successfully

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-024: Tablet Device Testing
**Priority:** Medium  
**Objective:** Verify application works on tablet devices

**Preconditions:**
- Tablet device or browser DevTools tablet emulation (iPad)

**Steps:**
1. Open application on tablet (both portrait and landscape)
2. Verify layout looks appropriate for screen size
3. Complete one full flow path
4. Verify all interactions work
5. Test both touch and (if available) mouse input

**Expected Results:**
- Layout is optimized for tablet screen size
- All functionality works correctly
- UI looks polished on tablet

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

### Accessibility Testing

#### TC-025: Keyboard Navigation
**Priority:** High  
**Objective:** Verify application is fully keyboard accessible

**Preconditions:**
- Application is loaded
- Do not use mouse/trackpad for this test

**Steps:**
1. Load the application
2. Press Tab key to move through interactive elements
3. Verify tab order is logical (top to bottom, left to right)
4. Use Tab to focus on "Yes" radio button
5. Press Space to select it
6. Tab to "Next" button
7. Press Enter to click it
8. Continue tabbing through all steps
9. Use Space/Enter to make selections and navigate
10. Complete entire flow using only keyboard

**Expected Results:**
- All interactive elements are reachable via Tab
- Tab order is logical and predictable
- Space selects radio buttons and device cards
- Enter activates buttons
- Focus states are clearly visible
- Can complete entire flow without mouse

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

#### TC-026: Screen Reader Compatibility
**Priority:** Medium  
**Objective:** Verify application works with screen readers

**Preconditions:**
- Screen reader enabled (NVDA, JAWS, VoiceOver)

**Steps:**
1. Load the application with screen reader active
2. Listen to page announcement
3. Navigate through form using screen reader commands
4. Verify labels are announced for all form fields
5. Verify current step is announced
6. Verify button states (enabled/disabled) are announced
7. Complete flow using screen reader

**Expected Results:**
- All text content is read correctly
- Form labels are associated with inputs
- Button states are announced
- Current page/step is clear
- User can understand and complete flow using only screen reader

**Actual Results:** [To be filled]  
**Pass/Fail:** [To be marked]

---

## Test Data Reference

### Available Devices

| Device ID | Device Name | Description | Display Icon |
|-----------|-------------|-------------|--------------|
| `dexcom-g7` | Dexcom G7 | The most advanced CGM system with a sleek, all-in-one design and real-time glucose readings. | 📱 |
| `dexcom-g6` | Dexcom G6 | Proven CGM technology with no fingersticks required and seamless smartphone integration. | 📲 |
| `libre-freestyle-3` | Libre FreeStyle 3 | Small, discreet sensor with continuous glucose monitoring and smartphone alerts. | ⌚ |
| `libre-14-day` | Libre 14 Day | Affordable CGM option with 14-day wear time and easy scanning technology. | 🔍 |
| `other` | I don't see my device | Select this option if your device is not listed above. | ❓ |

### Time Range Options

#### Last Device Update Options

| Option ID | Display Label |
|-----------|---------------|
| `0-1-year` | 0-1 Year |
| `1-3-years` | 1-3 Years |
| `3-4-years` | 3-4 Years |
| `5-plus-years` | 5+ Years |

#### Last Sensors Ordered Options

| Option ID | Display Label |
|-----------|---------------|
| `0-1-months` | 0-1 months |
| `1-3-months` | 1-3 months |
| `3-6-months` | 3-6 months |
| `6-plus-months` | 6+ months |

### Boolean Questions

All Yes/No questions:
- Yes = `true` (displayed as "Yes" in summary)
- No = `false` (displayed as "No" in summary)

### Step Names and Questions

| Step ID | Step Title | Question Text |
|---------|------------|---------------|
| `currently-using-cgm` | Currently Using CGM | Are you currently using a CGM device? |
| `current-device` | Current Device | Which CGM device are you currently using? |
| `last-device-update` | Last Device Update | When was your last device update? |
| `last-sensors-ordered` | Last Sensors Ordered | When did you last order sensors? |
| `device-switch-intention` | Device Switch Intention | Are you interested in switching to a different CGM device? |
| `device-selection` | Device Selection | Which CGM device would you like to select? |
| `last-doctor-visit` | Last Doctor Visit | Have you seen your primary care physician in the last 6 months? |
| `ineligible-selection` | Ineligible for Equipment | Eligibility Status |
| `summary` | Summary | Review Your Selections |

### Test ID Attributes

For automated testing reference, see the [Playwright Testing Guide](PLAYWRIGHT_TESTING_GUIDE.md) for complete data-testid mappings.

**Key Test IDs:**
- `start-over-button` - Start Over button
- `back-button` - Back navigation button
- `next-button` - Next/Continue button
- `complete-button` - Complete button (on summary)
- `return-to-summary-button` - Return to Summary button (edit mode)
- `edit-{step-id}` - Edit buttons on Summary (e.g., `edit-current-device`)
- `radio-option-{value}` - Radio button labels (e.g., `radio-option-yes`)
- `radio-input-{value}` - Radio input elements
- `device-card-{device-id}` - Device cards (e.g., `device-card-dexcom-g7`)

---

## Known Limitations

### Current Limitations

1. **Single Session Flow**
   - The flow is designed for single-session completion
   - No user authentication or account linking
   - Data is stored locally only (localStorage)

2. **Browser Dependencies**
   - Requires localStorage support (may not work in private/incognito mode in some browsers)
   - No server-side state management
   - No cross-device synchronization

3. **Validation**
   - No email or phone validation
   - No integration with patient records
   - No verification of doctor visit information

4. **Device Information**
   - Device data is hardcoded
   - No real-time inventory checking
   - No pricing information displayed
   - Icons are placeholder emojis

5. **Internationalization**
   - English language only
   - No localization support
   - US-centric time ranges

### Future Enhancements

- User authentication and account creation
- Save and resume across devices
- Email confirmation of selections
- Integration with healthcare provider systems
- Real-time device availability
- Multi-language support
- Enhanced accessibility features
- Analytics and tracking

---

## Testing Resources

### Related Documentation

1. **[Playwright Testing Guide](PLAYWRIGHT_TESTING_GUIDE.md)** - Comprehensive automated testing documentation including:
   - Setup instructions
   - Data test ID reference
   - Example test scenarios
   - Helper functions and page objects
   - CI/CD integration

2. **Technical Implementation Files:**
   - `types/cgm-flow.ts` - Type definitions and data structures
   - `utils/navigation-logic.ts` - Flow logic and conditional navigation
   - `components/cgm-flow/FlowContainer.tsx` - State management
   - `components/cgm-flow/steps/` - Individual step components

### Testing Tools

- **Manual Testing:** Use this document for manual test execution
- **Automated Testing:** Playwright for E2E test automation
- **Browser DevTools:** For localStorage inspection and console error checking
- **Accessibility Tools:** 
  - axe DevTools browser extension
  - WAVE browser extension
  - Screen readers (NVDA, JAWS, VoiceOver)

### Bug Reporting Template

When reporting bugs found during QA, please include:

**Bug ID:** [Unique identifier]  
**Test Case:** [Related test case ID]  
**Severity:** Critical / High / Medium / Low  
**Browser/Device:** [Browser version and OS]  
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]  
**Actual Result:** [What actually happened]  
**Screenshot/Video:** [If applicable]  
**Console Errors:** [Any errors from browser console]  
**localStorage State:** [If relevant to the bug]

### Environment Information

**Development URL:** [To be provided]  
**Staging URL:** [To be provided]  
**Production URL:** [To be provided]

### Test Execution Tracking

**Test Cycle Start Date:** [To be filled]  
**Test Cycle End Date:** [To be filled]  
**QA Engineer(s):** [To be filled]  
**Test Environment:** [Development/Staging/Production]

**Test Summary:**
- Total Test Cases: 39
- Passed: [To be filled]
- Failed: [To be filled]
- Blocked: [To be filled]
- Not Executed: [To be filled]

**Sign-off:**
- QA Lead: _________________ Date: _______
- Product Manager: _________________ Date: _______
- Engineering Lead: _________________ Date: _______

---

## Appendix

### Glossary

- **CGM:** Continuous Glucose Monitor - A medical device for monitoring blood glucose levels
- **localStorage:** Browser storage mechanism for persisting data locally
- **Step History:** Array tracking the sequence of steps the user has visited
- **Conditional Navigation:** Flow logic that determines next step based on user answers
- **State Persistence:** Saving user progress so it can be recovered after page reload

### Quick Reference - Flow Paths

**New User (4 steps):**
Currently Using CGM (No) → Device Selection → Last Doctor Visit → Summary

**Existing User - No Switch (7 steps):**
Currently Using CGM (Yes) → Current Device → Last Device Update → Last Sensors Ordered → Device Switch Intention (No) → Last Doctor Visit → Summary

**Existing User - Switch (8 steps):**
Currently Using CGM (Yes) → Current Device → Last Device Update → Last Sensors Ordered → Device Switch Intention (Yes) → Device Selection → Last Doctor Visit → Summary

**Ineligible User (Terminal):**
Currently Using CGM (Yes) → Current Device ("I don't see my device") → Last Device Update (< 5 years) → Ineligible Selection (Must go back or start over)

---

**End of QA Handoff Document**

