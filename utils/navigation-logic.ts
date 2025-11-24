import { StepId, FlowAnswers, DEVICES } from '@/types/cgm-flow';

export function getNextStep(currentStep: StepId, answers: FlowAnswers): StepId | null {
  switch (currentStep) {
    case 'currently-using-cgm':
      // If currently using CGM, go to Current Device step
      // If not using CGM, go directly to Device Selection
      return answers.currentlyUsingCGM === true ? 'current-device' : 'device-selection';

    case 'current-device':
      return 'last-device-update';

    case 'last-device-update':
      // Check eligibility: if device is "other" and update is not 5+ years, they're ineligible
      if (answers.currentDevice === 'other' && answers.lastDeviceUpdate !== '5-plus-years') {
        return 'ineligible-selection';
      }
      return 'last-sensors-ordered';

    case 'last-sensors-ordered':
      // Only show device switch intention if they've had their device for 5+ years
      // Otherwise, they're not eligible for an upgrade and we skip to last doctor visit
      return answers.lastDeviceUpdate === '5-plus-years' 
        ? 'device-switch-intention' 
        : 'last-doctor-visit';

    case 'device-switch-intention':
      // If wants to switch, go to Device Selection
      // If doesn't want to switch, go to Last Doctor Visit
      return answers.deviceSwitchIntention === true ? 'device-selection' : 'last-doctor-visit';

    case 'device-selection':
      return 'last-doctor-visit';

    case 'last-doctor-visit':
      return 'summary';

    case 'ineligible-selection':
      return null; // End of flow - user must go back or start over

    case 'summary':
      return null; // End of flow

    default:
      return null;
  }
}

export function getPreviousStep(
  currentStep: StepId,
  stepHistory: StepId[]
): StepId | null {
  // Use step history to go back to the actual previous step
  if (stepHistory.length > 1) {
    // Return the step before the current one
    return stepHistory[stepHistory.length - 2];
  }
  return null;
}

export function canProceed(currentStep: StepId, answers: FlowAnswers): boolean {
  switch (currentStep) {
    case 'currently-using-cgm':
      return answers.currentlyUsingCGM !== null;

    case 'current-device':
      return answers.currentDevice !== null;

    case 'last-device-update':
      return answers.lastDeviceUpdate !== null;

    case 'last-sensors-ordered':
      return answers.lastSensorsOrdered !== null;

    case 'device-switch-intention':
      return answers.deviceSwitchIntention !== null;

    case 'device-selection':
      return answers.deviceSelection !== null;

    case 'last-doctor-visit':
      return answers.lastDoctorVisit !== null;

    case 'ineligible-selection':
      return true; // Can proceed (but will go back or start over)

    case 'summary':
      return true; // Can always proceed from summary (to complete)

    default:
      return false;
  }
}

export function getStepTitle(step: StepId): string {
  switch (step) {
    case 'currently-using-cgm':
      return 'Currently Using CGM';
    case 'current-device':
      return 'Current Device';
    case 'last-device-update':
      return 'Last Device Update';
    case 'last-sensors-ordered':
      return 'Last Sensors Ordered';
    case 'device-switch-intention':
      return 'Device Switch Intention';
    case 'device-selection':
      return 'Device Selection';
    case 'last-doctor-visit':
      return 'Last Doctor Visit';
    case 'ineligible-selection':
      return 'Ineligible for Equipment';
    case 'summary':
      return 'Summary';
    default:
      return '';
  }
}

export function getStepQuestion(step: StepId): string {
  switch (step) {
    case 'currently-using-cgm':
      return 'Are you currently using a CGM device?';
    case 'current-device':
      return 'Which CGM device are you currently using?';
    case 'last-device-update':
      return 'When was your last device update?';
    case 'last-sensors-ordered':
      return 'When did you last order sensors?';
    case 'device-switch-intention':
      return 'Are you interested in switching to a different CGM device?';
    case 'device-selection':
      return 'Which CGM device would you like to select?';
    case 'last-doctor-visit':
      return 'Have you seen your primary care physician in the last 6 months?';
    case 'ineligible-selection':
      return 'Eligibility Status';
    case 'summary':
      return 'Review Your Selections';
    default:
      return '';
  }
}

export function getValidationError(currentStep: StepId, answers: FlowAnswers): string | null {
  switch (currentStep) {
    case 'currently-using-cgm':
      return answers.currentlyUsingCGM === null
        ? 'Please select whether you are currently using a CGM device.'
        : null;

    case 'current-device':
      if (answers.currentDevice === null) {
        return 'Please select your current CGM device.';
      }
      // Check if the current device matches the device they selected on Device Selection step
      if (answers.deviceSelection !== null && answers.currentDevice === answers.deviceSelection) {
        const device = DEVICES.find(d => d.id === answers.currentDevice);
        const deviceName = device ? device.name : 'this device';
        return `You cannot select ${deviceName} as your current device because you've already selected it as your new device.`;
      }
      return null;

    case 'last-device-update':
      return answers.lastDeviceUpdate === null
        ? 'Please select when your last device update was.'
        : null;

    case 'last-sensors-ordered':
      return answers.lastSensorsOrdered === null
        ? 'Please select when you last ordered sensors.'
        : null;

    case 'device-switch-intention':
      return answers.deviceSwitchIntention === null
        ? 'Please indicate whether you are interested in switching devices.'
        : null;

    case 'device-selection':
      return answers.deviceSelection === null
        ? 'Please select a CGM device.'
        : null;

    case 'last-doctor-visit':
      return answers.lastDoctorVisit === null
        ? 'Please indicate whether you have seen your primary care physician in the last 6 months.'
        : null;

    case 'ineligible-selection':
      return null; // No validation needed on ineligible selection

    case 'summary':
      return null; // No validation needed on summary

    default:
      return null;
  }
}

