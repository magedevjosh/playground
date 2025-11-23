import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationButtons from '../NavigationButtons';

describe('NavigationButtons', () => {
  const mockOnBack = vi.fn();
  const mockOnNext = vi.fn();
  const mockOnReturnToSummary = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnNext.mockClear();
    mockOnReturnToSummary.mockClear();
  });

  describe('Back Button', () => {
    it('should render Back button when canGoBack is true', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
        />
      );
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
    });

    it('should not render Back button when canGoBack is false', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={false}
        />
      );
      
      expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
    });

    it('should call onBack when Back button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
        />
      );
      
      const backButton = screen.getByTestId('back-button');
      await user.click(backButton);
      
      expect(mockOnBack).toHaveBeenCalledTimes(1);
    });

    it('should have correct aria-label for Back button', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
        />
      );
      
      const backButton = screen.getByTestId('back-button');
      expect(backButton).toHaveAttribute('aria-label', 'Go back to previous step');
    });
  });

  describe('Next Button', () => {
    it('should render Next button', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={false}
        />
      );
      
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });

    it('should always enable Next button', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={false}
        />
      );
      
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toBeEnabled();
    });

    it('should call onNext when Next button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={false}
        />
      );
      
      const nextButton = screen.getByTestId('next-button');
      await user.click(nextButton);
      
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('should have correct aria-label for Next button', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={false}
        />
      );
      
      const nextButton = screen.getByTestId('next-button');
      expect(nextButton).toHaveAttribute('aria-label', 'Go to next step');
    });
  });

  describe('Complete Button (Last Step)', () => {
    it('should render Complete button when isLastStep is true', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          isLastStep={true}
        />
      );
      
      expect(screen.getByTestId('complete-button')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('should have correct aria-label for Complete button', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          isLastStep={true}
        />
      );
      
      const completeButton = screen.getByTestId('complete-button');
      expect(completeButton).toHaveAttribute('aria-label', 'Complete');
    });

    it('should call onNext when Complete button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          isLastStep={true}
        />
      );
      
      const completeButton = screen.getByTestId('complete-button');
      await user.click(completeButton);
      
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    it('should always be enabled on last step', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          isLastStep={true}
        />
      );
      
      const completeButton = screen.getByTestId('complete-button');
      expect(completeButton).toBeEnabled();
    });
  });

  describe('Button Layout', () => {
    it('should render both buttons when back is enabled', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
        />
      );
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });

    it('should apply correct styling classes to buttons', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
        />
      );
      
      const backButton = screen.getByTestId('back-button');
      const nextButton = screen.getByTestId('next-button');
      
      expect(backButton).toHaveClass('px-6', 'py-3');
      expect(nextButton).toHaveClass('px-6', 'py-3');
    });
  });

  describe('Return to Summary Mode', () => {
    it('should render Return to Summary button when returnToSummary is true', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          returnToSummary={true}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
      expect(screen.getByText('Return to Summary')).toBeInTheDocument();
    });

    it('should render all three buttons when in return to summary mode with canGoBack true', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          returnToSummary={true}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });

    it('should not render back button when in return to summary mode with canGoBack false', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={false}
          returnToSummary={true}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      expect(screen.queryByTestId('back-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('return-to-summary-button')).toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });

    it('should call onReturnToSummary when Return to Summary button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          returnToSummary={true}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      const returnButton = screen.getByTestId('return-to-summary-button');
      await user.click(returnButton);
      
      expect(mockOnReturnToSummary).toHaveBeenCalledTimes(1);
    });

    it('should have correct aria-label for Return to Summary button', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          returnToSummary={true}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      const returnButton = screen.getByTestId('return-to-summary-button');
      expect(returnButton).toHaveAttribute('aria-label', 'Return to summary');
    });

    it('should show Next button (not Complete) in return to summary mode even on last step', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          isLastStep={true}
          returnToSummary={true}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
      expect(screen.queryByText('Complete')).not.toBeInTheDocument();
    });

    it('should use standard layout when returnToSummary is false', () => {
      render(
        <NavigationButtons
          onBack={mockOnBack}
          onNext={mockOnNext}
          canGoBack={true}
          returnToSummary={false}
          onReturnToSummary={mockOnReturnToSummary}
        />
      );
      
      expect(screen.getByTestId('back-button')).toBeInTheDocument();
      expect(screen.queryByTestId('return-to-summary-button')).not.toBeInTheDocument();
      expect(screen.getByTestId('next-button')).toBeInTheDocument();
    });
  });
});

