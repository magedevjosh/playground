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
  });
});

