interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isLastStep?: boolean;
  returnToSummary?: boolean;
  onReturnToSummary?: () => void;
}

export default function NavigationButtons({
  onBack,
  onNext,
  canGoBack,
  isLastStep = false,
  returnToSummary = false,
  onReturnToSummary,
}: NavigationButtonsProps) {
  if (returnToSummary) {
    return (
      <div className="flex justify-between items-center w-full mt-8 gap-4">
        {canGoBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 font-medium transition-all bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
            aria-label="Go back to previous step"
            data-testid="back-button"
          >
            Back
          </button>
        )}
        <div className="flex gap-4 ml-auto">
          <button
            onClick={onReturnToSummary}
            className="px-6 py-3 font-medium transition-all bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
            aria-label="Return to summary"
            data-testid="return-to-summary-button"
          >
            Return to Summary
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 font-medium transition-all text-gray-800 hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#d2bed8' }}
            aria-label="Go to next step"
            data-testid="next-button"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center w-full mt-8">
      {canGoBack ? (
        <button
          onClick={onBack}
          className="px-6 py-3 font-medium transition-all bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
          aria-label="Go back to previous step"
          data-testid="back-button"
        >
          Back
        </button>
      ) : (
        <div />
      )}
      <button
        onClick={onNext}
        className="px-6 py-3 font-medium transition-all text-gray-800 hover:opacity-90 cursor-pointer"
        style={{ backgroundColor: '#d2bed8' }}
        aria-label={isLastStep ? 'Complete' : 'Go to next step'}
        data-testid={isLastStep ? 'complete-button' : 'next-button'}
      >
        {isLastStep ? 'Complete' : 'Next'}
      </button>
    </div>
  );
}

