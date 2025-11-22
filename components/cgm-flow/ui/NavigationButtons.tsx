interface NavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastStep?: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  canGoBack,
  canGoNext,
  isLastStep = false,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center w-full mt-8">
      {canGoBack ? (
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium transition-all bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer"
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
        disabled={!canGoNext}
        className={`px-6 py-3 rounded-lg font-medium transition-all ${
          canGoNext
            ? 'text-gray-800 hover:opacity-90 cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        style={canGoNext ? { backgroundColor: '#d2bed8' } : undefined}
        aria-label={isLastStep ? 'Complete' : 'Go to next step'}
        data-testid={isLastStep ? 'complete-button' : 'next-button'}
      >
        {isLastStep ? 'Complete' : 'Next'}
      </button>
    </div>
  );
}

