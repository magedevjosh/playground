import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlowContainer from '../FlowContainer';

describe('FlowContainer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Initial Render', () => {
    it('should render the first step (currently-using-cgm)', () => {
      render(<FlowContainer />);
      expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
      expect(screen.getByText('Are you currently using a CGM device?')).toBeInTheDocument();
    });

    it('should show step 1 in progress indicator', () => {
      render(<FlowContainer />);
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    it('should show Start Over button', () => {
      render(<FlowContainer />);
      expect(screen.getByTestId('start-over-button')).toBeInTheDocument();
    });

    it('should show validation error when Next button is clicked without selection', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);
      
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeEnabled();
      
      // Click Next without making a selection
      await user.click(nextButton);
      
      // Should show validation error
      await waitFor(() => {
        const errorMessage = screen.getByTestId('validation-error');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent('Please select whether you are currently using a CGM device.');
      });
    });

    it('should clear validation error when selection is made', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);
      
      const nextButton = screen.getByTestId('next-button');
      
      // Click Next without making a selection to trigger error
      await user.click(nextButton);
      
      // Should show validation error
      await waitFor(() => {
        expect(screen.getByTestId('validation-error')).toBeInTheDocument();
      });
      
      // Make a selection
      await user.click(screen.getByLabelText('Yes'));
      
      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument();
      });
    });

    it('should not show Back button on first step', () => {
      render(<FlowContainer />);
      const backButton = screen.queryByTestId('back-button');
      expect(backButton).not.toBeInTheDocument();
    });
  });

  describe('Navigation Flow', () => {
    it('should navigate to current-device when user selects Yes for currently using CGM', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Select Yes
      const yesOption = screen.getByLabelText('Yes');
      await user.click(yesOption);

      // Next button should be enabled
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeEnabled();

      // Click Next
      await user.click(nextButton);

      // Should navigate to current-device step
      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });
    });

    it('should navigate to device-selection when user selects No for currently using CGM', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Select No
      const noOption = screen.getByLabelText('No');
      await user.click(noOption);

      // Click Next
      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);

      // Should navigate to device-selection step
      await waitFor(() => {
        expect(screen.getByText('Device Selection')).toBeInTheDocument();
      });
    });

    it('should navigate back to previous step', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Navigate forward
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });

      // Navigate back
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);

      await waitFor(() => {
        expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
      });
    });

    it('should maintain answers when navigating back and forth', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Select Yes and navigate forward
      const yesOption = screen.getByLabelText('Yes');
      await user.click(yesOption);
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });

      // Navigate back
      await user.click(screen.getByTestId('back-button'));

      // Check that Yes is still selected
      await waitFor(() => {
        const yesOptionAgain = screen.getByLabelText('Yes') as HTMLInputElement;
        expect(yesOptionAgain.checked).toBe(true);
      });
    });

    it('should show Complete button on summary step', async () => {
      const user = userEvent.setup();
      
      // Pre-populate localStorage with state at summary step
      const summaryState = {
        currentStep: 'summary',
        answers: {
          currentlyUsingCGM: false,
          currentDevice: null,
          lastDeviceUpdate: null,
          lastSensorsOrdered: null,
          deviceSwitchIntention: null,
          deviceSelection: 'dexcom-g7',
          lastDoctorVisit: true,
        },
        stepHistory: ['currently-using-cgm', 'device-selection', 'last-doctor-visit', 'summary'],
      };
      localStorage.setItem('cgm-flow-state', JSON.stringify(summaryState));

      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByTestId('complete-button')).toBeInTheDocument();
      });
    });
  });

  describe('LocalStorage Persistence', () => {
    it('should save state to localStorage when answers change', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Select an answer
      await user.click(screen.getByLabelText('Yes'));

      // Wait for state to be saved
      await waitFor(() => {
        const saved = localStorage.getItem('cgm-flow-state');
        expect(saved).toBeTruthy();
        const parsed = JSON.parse(saved!);
        expect(parsed.answers.currentlyUsingCGM).toBe(true);
      });
    });

    it('should restore state from localStorage on mount', async () => {
      // Pre-populate localStorage
      const savedState = {
        currentStep: 'current-device',
        answers: {
          currentlyUsingCGM: true,
          currentDevice: 'dexcom-g7',
          lastDeviceUpdate: null,
          lastSensorsOrdered: null,
          deviceSwitchIntention: null,
          deviceSelection: null,
          lastDoctorVisit: null,
        },
        stepHistory: ['currently-using-cgm', 'current-device'],
      };
      localStorage.setItem('cgm-flow-state', JSON.stringify(savedState));

      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
        expect(screen.getByText('Step 2')).toBeInTheDocument();
      });
    });

    it('should handle corrupted localStorage data gracefully', async () => {
      localStorage.setItem('cgm-flow-state', 'invalid json data');

      render(<FlowContainer />);

      // Should render initial state despite corrupt data
      expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });
  });

  describe('Start Over Functionality', () => {
    it('should reset to initial state when Start Over is clicked', async () => {
      const user = userEvent.setup();
      
      // Navigate forward a few steps
      render(<FlowContainer />);
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });

      // Click Start Over
      await user.click(screen.getByTestId('start-over-button'));

      // Should be back at first step
      await waitFor(() => {
        expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
        expect(screen.getByText('Step 1')).toBeInTheDocument();
      });

      // Previous answer should be cleared
      const yesOption = screen.getByLabelText('Yes') as HTMLInputElement;
      expect(yesOption.checked).toBe(false);
    });

    it('should clear localStorage when Start Over is clicked', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      // Verify localStorage has data
      await waitFor(() => {
        expect(localStorage.getItem('cgm-flow-state')).toBeTruthy();
      });

      // Click Start Over
      await user.click(screen.getByTestId('start-over-button'));

      // localStorage should be cleared
      await waitFor(() => {
        const saved = localStorage.getItem('cgm-flow-state');
        if (saved) {
          const parsed = JSON.parse(saved);
          expect(parsed.currentStep).toBe('currently-using-cgm');
          expect(parsed.answers.currentlyUsingCGM).toBeNull();
        }
      });
    });
  });

  describe('Step Counter', () => {
    it('should increment step counter as user progresses', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      expect(screen.getByText('Step 1')).toBeInTheDocument();

      // Navigate forward
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Step 2')).toBeInTheDocument();
      });
    });

    it('should decrement step counter when going back', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Navigate forward
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Step 2')).toBeInTheDocument();
      });

      // Navigate back
      await user.click(screen.getByTestId('back-button'));

      await waitFor(() => {
        expect(screen.getByText('Step 1')).toBeInTheDocument();
      });
    });
  });

  describe('Complex Navigation Paths', () => {
    it('should handle full flow for existing CGM users who want to switch', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Step 1: Currently using CGM - Yes
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      // Step 2: Current Device
      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('device-card-dexcom-g7'));
      await user.click(screen.getByTestId('next-button'));

      // Step 3: Last Device Update
      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('radio-option-0-1-year'));
      await user.click(screen.getByTestId('next-button'));

      // Step 4: Last Sensors Ordered
      await waitFor(() => {
        expect(screen.getByText('Last Sensors Ordered')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('radio-option-0-1-months'));
      await user.click(screen.getByTestId('next-button'));

      // Step 5: Device Switch Intention - Yes
      await waitFor(() => {
        expect(screen.getByText('Device Switch Intention')).toBeInTheDocument();
      });
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      // Step 6: Device Selection
      await waitFor(() => {
        expect(screen.getByText('Device Selection')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('device-card-libre-freestyle-3'));
      await user.click(screen.getByTestId('next-button'));

      // Step 7: Last Doctor Visit
      await waitFor(() => {
        expect(screen.getByText('Last Doctor Visit')).toBeInTheDocument();
      });
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      // Step 8: Summary
      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('Your CGM Experience Profile')).toBeInTheDocument();
      });
    });

    it('should handle short flow for new CGM users', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Step 1: Currently using CGM - No
      await user.click(screen.getByLabelText('No'));
      await user.click(screen.getByTestId('next-button'));

      // Step 2: Device Selection (skips current device questions)
      await waitFor(() => {
        expect(screen.getByText('Device Selection')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('device-card-dexcom-g7'));
      await user.click(screen.getByTestId('next-button'));

      // Step 3: Last Doctor Visit
      await waitFor(() => {
        expect(screen.getByText('Last Doctor Visit')).toBeInTheDocument();
      });
      await user.click(screen.getByLabelText('No'));
      await user.click(screen.getByTestId('next-button'));

      // Step 4: Summary
      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });
    });

    it('should handle ineligible user flow - device "other" with recent update', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Step 1: Currently using CGM - Yes
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      // Step 2: Current Device - Select "I don't see my device"
      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('device-card-other'));
      await user.click(screen.getByTestId('next-button'));

      // Step 3: Last Device Update - Select "0-1 Year" (not eligible)
      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('radio-option-0-1-year'));
      await user.click(screen.getByTestId('next-button'));

      // Step 4: Should show Ineligible Selection
      await waitFor(() => {
        expect(screen.getByText('Ineligible for Equipment')).toBeInTheDocument();
        expect(screen.getByText(/unable to provide you with equipment/i)).toBeInTheDocument();
      });

      // Should show phone link
      const phoneLink = screen.getByRole('link', { name: /1-800-555-0123/i });
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink).toHaveAttribute('href', 'tel:18005550123');

      // Should have Back button but not Next button
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.queryByTestId('next-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('complete-button')).not.toBeInTheDocument();
    });

    it('should allow user to go back and correct answers from ineligible step', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Navigate to ineligible state
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('device-card-other'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('radio-option-1-3-years'));
      await user.click(screen.getByTestId('next-button'));

      // Verify at ineligible step
      await waitFor(() => {
        expect(screen.getByText('Ineligible for Equipment')).toBeInTheDocument();
      });

      // Go back and change answer
      await user.click(screen.getByTestId('back-button'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });

      // Change to 5+ years (eligible)
      await user.click(screen.getByTestId('radio-option-5-plus-years'));
      await user.click(screen.getByTestId('next-button'));

      // Should now go to Last Sensors Ordered (normal flow)
      await waitFor(() => {
        expect(screen.getByText('Last Sensors Ordered')).toBeInTheDocument();
      });
    });

    it('should allow eligible flow when device is "other" but update is 5+ years', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Step 1: Currently using CGM - Yes
      await user.click(screen.getByLabelText('Yes'));
      await user.click(screen.getByTestId('next-button'));

      // Step 2: Current Device - Select "I don't see my device"
      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('device-card-other'));
      await user.click(screen.getByTestId('next-button'));

      // Step 3: Last Device Update - Select "5+ Years" (eligible)
      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });
      await user.click(screen.getByTestId('radio-option-5-plus-years'));
      await user.click(screen.getByTestId('next-button'));

      // Step 4: Should go to Last Sensors Ordered (not ineligible)
      await waitFor(() => {
        expect(screen.getByText('Last Sensors Ordered')).toBeInTheDocument();
      });

      // Verify we can continue the normal flow
      await user.click(screen.getByTestId('radio-option-0-1-months'));
      await user.click(screen.getByTestId('next-button'));

      await waitFor(() => {
        expect(screen.getByText('Device Switch Intention')).toBeInTheDocument();
      });
    });
  });

  describe('Edit from Summary', () => {
    beforeEach(() => {
      // Pre-populate localStorage with state at summary step
      const summaryState = {
        currentStep: 'summary',
        answers: {
          currentlyUsingCGM: true,
          currentDevice: 'dexcom-g7',
          lastDeviceUpdate: '0-1-year',
          lastSensorsOrdered: '0-1-months',
          deviceSwitchIntention: true,
          deviceSelection: 'libre-freestyle-3',
          lastDoctorVisit: true,
        },
        stepHistory: [
          'currently-using-cgm',
          'current-device',
          'last-device-update',
          'last-sensors-ordered',
          'device-switch-intention',
          'device-selection',
          'last-doctor-visit',
          'summary'
        ],
        returnToSummary: false,
      };
      localStorage.setItem('cgm-flow-state', JSON.stringify(summaryState));
    });

    it('should navigate to specific step when clicking edit button from summary', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      // Should be on summary page
      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('Your CGM Experience Profile')).toBeInTheDocument();
      });

      // Click edit button for Current Device
      const editButton = screen.getByTestId('edit-current-device');
      await user.click(editButton);

      // Should navigate to Current Device step
      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
        expect(screen.getByText('Which CGM device are you currently using?')).toBeInTheDocument();
      });
    });

    it('should show Return to Summary button when editing from summary', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Click edit button
      await user.click(screen.getByTestId('edit-device-selection'));

      // Should see Return to Summary button
      await waitFor(() => {
        expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
        expect(screen.getByText('Return to Summary')).toBeInTheDocument();
      });
    });

    it('should return to summary when clicking Return to Summary button', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Click edit button
      await user.click(screen.getByTestId('edit-device-selection'));

      await waitFor(() => {
        expect(screen.getByText('Device Selection')).toBeInTheDocument();
        expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
      });

      // Click Return to Summary
      await user.click(screen.getByTestId('return-to-summary-button'));

      // Should be back on summary
      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('Your CGM Experience Profile')).toBeInTheDocument();
      });
    });

    it('should show all three buttons (Back, Return to Summary, Next) when editing from summary', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Click edit button
      await user.click(screen.getByTestId('edit-last-device-update'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
        // Should have all three buttons
        expect(screen.getByTestId('back-button')).toBeInTheDocument();
        expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
        expect(screen.getByTestId('next-button')).toBeInTheDocument();
      });
    });

    it('should allow changing answer and returning to summary', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        // Verify original value
        expect(screen.getByText('Dexcom G7')).toBeInTheDocument();
      });

      // Edit current device
      await user.click(screen.getByTestId('edit-current-device'));

      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });

      // Change selection to Dexcom G6
      await user.click(screen.getByTestId('device-card-dexcom-g6'));

      // Return to summary
      await user.click(screen.getByTestId('return-to-summary-button'));

      // Should see updated value on summary
      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('Dexcom G6')).toBeInTheDocument();
        expect(screen.queryByText('Dexcom G7')).not.toBeInTheDocument();
      });
    });

    it('should navigate to next step from edit mode if Next is clicked', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit Last Sensors Ordered
      await user.click(screen.getByTestId('edit-last-sensors-ordered'));

      await waitFor(() => {
        expect(screen.getByText('Last Sensors Ordered')).toBeInTheDocument();
      });

      // Change selection
      await user.click(screen.getByTestId('radio-option-1-3-months'));

      // Click Next (not Return to Summary)
      await user.click(screen.getByTestId('next-button'));

      // Should go to next step in normal flow
      await waitFor(() => {
        expect(screen.getByText('Device Switch Intention')).toBeInTheDocument();
      });
    });

    it('should be able to navigate back from edit mode', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit Last Device Update
      await user.click(screen.getByTestId('edit-last-device-update'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });

      // Click Back
      await user.click(screen.getByTestId('back-button'));

      // Should go to previous step
      await waitFor(() => {
        expect(screen.getByText('Current Device')).toBeInTheDocument();
      });

      // Return to Summary button should still be there
      expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
    });

    it('should edit multiple fields from summary', async () => {
      const user = userEvent.setup();
      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit first field
      await user.click(screen.getByTestId('edit-currently-using-cgm'));

      await waitFor(() => {
        expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
      });

      // Return to summary
      await user.click(screen.getByTestId('return-to-summary-button'));

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit another field
      await user.click(screen.getByTestId('edit-last-doctor-visit'));

      await waitFor(() => {
        expect(screen.getByText('Last Doctor Visit')).toBeInTheDocument();
      });

      // Change answer and return to summary
      await user.click(screen.getByLabelText('No'));
      await user.click(screen.getByTestId('return-to-summary-button'));

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        // Verify the change
        const doctorSection = screen.getByText('Seen Doctor in Last 6 Months').closest('div');
        expect(doctorSection).toHaveTextContent('No');
      });
    });

    it('should show validation error when trying to return to summary with ineligible answers', async () => {
      const user = userEvent.setup();
      
      // Pre-populate with eligible state (device='other' but 5+ years)
      const eligibleState = {
        currentStep: 'summary',
        answers: {
          currentlyUsingCGM: true,
          currentDevice: 'other',
          lastDeviceUpdate: '5-plus-years',
          lastSensorsOrdered: '0-1-months',
          deviceSwitchIntention: true,
          deviceSelection: 'dexcom-g7',
          lastDoctorVisit: true,
        },
        stepHistory: [
          'currently-using-cgm',
          'current-device',
          'last-device-update',
          'last-sensors-ordered',
          'device-switch-intention',
          'device-selection',
          'last-doctor-visit',
          'summary'
        ],
        returnToSummary: false,
      };
      localStorage.setItem('cgm-flow-state', JSON.stringify(eligibleState));

      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit Last Device Update
      await user.click(screen.getByTestId('edit-last-device-update'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });

      // Change to ineligible answer (0-1 Year)
      await user.click(screen.getByTestId('radio-option-0-1-year'));

      // Try to return to summary
      await user.click(screen.getByTestId('return-to-summary-button'));

      // Should show validation error
      await waitFor(() => {
        const errorMessage = screen.getByTestId('validation-error');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveTextContent(
          'You must select "5+ Years" for your last device update to return to the summary, or click "Next" to continue.'
        );
      });

      // Should still be on Last Device Update step
      expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      expect(screen.queryByText('Summary')).not.toBeInTheDocument();
    });

    it('should allow Next button to work with ineligible answers when editing from summary', async () => {
      const user = userEvent.setup();
      
      // Same setup as previous test
      const eligibleState = {
        currentStep: 'summary',
        answers: {
          currentlyUsingCGM: true,
          currentDevice: 'other',
          lastDeviceUpdate: '5-plus-years',
          lastSensorsOrdered: '0-1-months',
          deviceSwitchIntention: true,
          deviceSelection: 'dexcom-g7',
          lastDoctorVisit: true,
        },
        stepHistory: [
          'currently-using-cgm',
          'current-device',
          'last-device-update',
          'last-sensors-ordered',
          'device-switch-intention',
          'device-selection',
          'last-doctor-visit',
          'summary'
        ],
        returnToSummary: false,
      };
      localStorage.setItem('cgm-flow-state', JSON.stringify(eligibleState));

      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit Last Device Update
      await user.click(screen.getByTestId('edit-last-device-update'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });

      // Change to ineligible answer
      await user.click(screen.getByTestId('radio-option-0-1-year'));

      // Click Next button (should work - navigate to ineligible step)
      await user.click(screen.getByTestId('next-button'));

      // Should navigate to Ineligible Selection step
      await waitFor(() => {
        expect(screen.getByText('Ineligible for Equipment')).toBeInTheDocument();
        expect(screen.getByText(/unable to provide you with equipment/i)).toBeInTheDocument();
      });
    });

    it('should allow return to summary after fixing ineligible answer', async () => {
      const user = userEvent.setup();
      
      // Same setup as previous tests
      const eligibleState = {
        currentStep: 'summary',
        answers: {
          currentlyUsingCGM: true,
          currentDevice: 'other',
          lastDeviceUpdate: '5-plus-years',
          lastSensorsOrdered: '0-1-months',
          deviceSwitchIntention: true,
          deviceSelection: 'dexcom-g7',
          lastDoctorVisit: true,
        },
        stepHistory: [
          'currently-using-cgm',
          'current-device',
          'last-device-update',
          'last-sensors-ordered',
          'device-switch-intention',
          'device-selection',
          'last-doctor-visit',
          'summary'
        ],
        returnToSummary: false,
      };
      localStorage.setItem('cgm-flow-state', JSON.stringify(eligibleState));

      render(<FlowContainer />);

      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
      });

      // Edit Last Device Update
      await user.click(screen.getByTestId('edit-last-device-update'));

      await waitFor(() => {
        expect(screen.getByText('Last Device Update')).toBeInTheDocument();
      });

      // Change to ineligible answer
      await user.click(screen.getByTestId('radio-option-0-1-year'));

      // Try to return to summary (should show error)
      await user.click(screen.getByTestId('return-to-summary-button'));

      await waitFor(() => {
        expect(screen.getByTestId('validation-error')).toBeInTheDocument();
      });

      // Fix the answer back to 5+ years
      await user.click(screen.getByTestId('radio-option-5-plus-years'));

      // Now return to summary should work
      await user.click(screen.getByTestId('return-to-summary-button'));

      // Should return to Summary successfully
      await waitFor(() => {
        expect(screen.getByText('Summary')).toBeInTheDocument();
        expect(screen.getByText('Your CGM Experience Profile')).toBeInTheDocument();
      });

      // Validation error should be cleared
      expect(screen.queryByTestId('validation-error')).not.toBeInTheDocument();

      // Should show the updated answer
      expect(screen.getByText('5+ Years')).toBeInTheDocument();
    });
  });
});

