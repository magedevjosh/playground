'use client';

import { useState, useEffect } from 'react';
import { StepId, FlowState, FlowAnswers } from '@/types/cgm-flow';
import {
  getNextStep,
  getPreviousStep,
  canProceed,
  getStepTitle,
  getStepQuestion,
} from '@/utils/navigation-logic';
import Header from './ui/Header';
import NavigationButtons from './ui/NavigationButtons';
import CurrentlyUsingCGM from './steps/CurrentlyUsingCGM';
import CurrentDevice from './steps/CurrentDevice';
import LastDeviceUpdate from './steps/LastDeviceUpdate';
import LastSensorsOrdered from './steps/LastSensorsOrdered';
import DeviceSwitchIntention from './steps/DeviceSwitchIntention';
import DeviceSelection from './steps/DeviceSelection';
import LastDoctorVisit from './steps/LastDoctorVisit';
import Summary from './steps/Summary';

const STORAGE_KEY = 'cgm-flow-state';

const initialAnswers: FlowAnswers = {
  currentlyUsingCGM: null,
  currentDevice: null,
  lastDeviceUpdate: null,
  lastSensorsOrdered: null,
  deviceSwitchIntention: null,
  deviceSelection: null,
  lastDoctorVisit: null,
};

export default function FlowContainer() {
  const [flowState, setFlowState] = useState<FlowState>({
    currentStep: 'currently-using-cgm',
    answers: initialAnswers,
    stepHistory: ['currently-using-cgm'],
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved) as FlowState;
        setFlowState(parsedState);
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(flowState));
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }, [flowState]);

  const updateAnswer = (field: keyof FlowAnswers, value: any) => {
    setFlowState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    const nextStep = getNextStep(flowState.currentStep, flowState.answers);
    if (nextStep) {
      setFlowState((prev) => ({
        ...prev,
        currentStep: nextStep,
        stepHistory: [...prev.stepHistory, nextStep],
      }));
    } else {
      // Flow complete
      console.log('Flow completed with answers:', flowState.answers);
    }
  };

  const handleBack = () => {
    const prevStep = getPreviousStep(flowState.currentStep, flowState.stepHistory);
    if (prevStep) {
      setFlowState((prev) => ({
        ...prev,
        currentStep: prevStep,
        stepHistory: prev.stepHistory.slice(0, -1),
      }));
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFlowState({
      currentStep: 'currently-using-cgm',
      answers: initialAnswers,
      stepHistory: ['currently-using-cgm'],
    });
  };

  const handleLogoClick = () => {
    localStorage.removeItem(STORAGE_KEY);
    setFlowState({
      currentStep: 'currently-using-cgm',
      answers: initialAnswers,
      stepHistory: ['currently-using-cgm'],
    });
  };

  const canGoNext = canProceed(flowState.currentStep, flowState.answers);
  const canGoBack = flowState.stepHistory.length > 1;
  const isLastStep = flowState.currentStep === 'summary';

  const renderStep = () => {
    const stepProps = {
      onNext: handleNext,
    };

    switch (flowState.currentStep) {
      case 'currently-using-cgm':
        return (
          <CurrentlyUsingCGM
            {...stepProps}
            value={flowState.answers.currentlyUsingCGM}
            onChange={(value) => updateAnswer('currentlyUsingCGM', value)}
          />
        );

      case 'current-device':
        return (
          <CurrentDevice
            {...stepProps}
            value={flowState.answers.currentDevice}
            onChange={(value) => updateAnswer('currentDevice', value)}
          />
        );

      case 'last-device-update':
        return (
          <LastDeviceUpdate
            {...stepProps}
            value={flowState.answers.lastDeviceUpdate}
            onChange={(value) => updateAnswer('lastDeviceUpdate', value)}
          />
        );

      case 'last-sensors-ordered':
        return (
          <LastSensorsOrdered
            {...stepProps}
            value={flowState.answers.lastSensorsOrdered}
            onChange={(value) => updateAnswer('lastSensorsOrdered', value)}
          />
        );

      case 'device-switch-intention':
        return (
          <DeviceSwitchIntention
            {...stepProps}
            value={flowState.answers.deviceSwitchIntention}
            onChange={(value) => updateAnswer('deviceSwitchIntention', value)}
          />
        );

      case 'device-selection':
        return (
          <DeviceSelection
            {...stepProps}
            value={flowState.answers.deviceSelection}
            onChange={(value) => updateAnswer('deviceSelection', value)}
          />
        );

      case 'last-doctor-visit':
        return (
          <LastDoctorVisit
            {...stepProps}
            value={flowState.answers.lastDoctorVisit}
            onChange={(value) => updateAnswer('lastDoctorVisit', value)}
          />
        );

      case 'summary':
        return <Summary answers={flowState.answers} />;

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto px-6 py-8">
        <Header onLogoClick={handleLogoClick} />
        
        <main className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-sm mb-2">
              <div className="text-gray-500">
                Step {flowState.stepHistory.length}
              </div>
              <button
                onClick={handleStartOver}
                className="text-gray-600 hover:text-gray-900 underline transition-colors"
                aria-label="Start over from the beginning"
                data-testid="start-over-button"
              >
                Start Over
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getStepTitle(flowState.currentStep)}
            </h1>
            <p className="text-lg text-gray-700">
              {getStepQuestion(flowState.currentStep)}
            </p>
          </div>

          {/* Step content */}
          <div className="mb-6">{renderStep()}</div>

          {/* Navigation */}
          <NavigationButtons
            onBack={handleBack}
            onNext={handleNext}
            canGoBack={canGoBack}
            canGoNext={canGoNext}
            isLastStep={isLastStep}
          />
        </main>
      </div>
    </div>
  );
}

