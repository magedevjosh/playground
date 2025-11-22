import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationButtons from '../NavigationButtons';

describe('NavigationButtons', () => {
  const mockOnBack = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    mockOnNext.mockClear();
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
      
      expect(backButton).toHaveClass('px-6', 'py-3', 'rounded-lg');
      expect(nextButton).toHaveClass('px-6', 'py-3', 'rounded-lg');
    });
  });
});

