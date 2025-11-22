import { describe, it, expect } from 'vitest';
import {
  getNextStep,
  getPreviousStep,
  canProceed,
  getStepTitle,
  getStepQuestion,
  getValidationError,
} from '../navigation-logic';
import { FlowAnswers, StepId } from '@/types/cgm-flow';

describe('navigation-logic', () => {
  describe('getNextStep', () => {
    const emptyAnswers: FlowAnswers = {
      currentlyUsingCGM: null,
      currentDevice: null,
      lastDeviceUpdate: null,
      lastSensorsOrdered: null,
      deviceSwitchIntention: null,
      deviceSelection: null,
      lastDoctorVisit: null,
    };

    it('should navigate from currently-using-cgm to current-device when answer is true', () => {
      const answers: FlowAnswers = {
        ...emptyAnswers,
        currentlyUsingCGM: true,
      };
      expect(getNextStep('currently-using-cgm', answers)).toBe('current-device');
    });

    it('should navigate from currently-using-cgm to device-selection when answer is false', () => {
      const answers: FlowAnswers = {
        ...emptyAnswers,
        currentlyUsingCGM: false,
      };
      expect(getNextStep('currently-using-cgm', answers)).toBe('device-selection');
    });

    it('should navigate from current-device to last-device-update', () => {
      expect(getNextStep('current-device', emptyAnswers)).toBe('last-device-update');
    });

    it('should navigate from last-device-update to last-sensors-ordered', () => {
      expect(getNextStep('last-device-update', emptyAnswers)).toBe('last-sensors-ordered');
    });

    it('should navigate from last-sensors-ordered to device-switch-intention', () => {
      expect(getNextStep('last-sensors-ordered', emptyAnswers)).toBe('device-switch-intention');
    });

    it('should navigate from device-switch-intention to device-selection when answer is true', () => {
      const answers: FlowAnswers = {
        ...emptyAnswers,
        deviceSwitchIntention: true,
      };
      expect(getNextStep('device-switch-intention', answers)).toBe('device-selection');
    });

    it('should navigate from device-switch-intention to last-doctor-visit when answer is false', () => {
      const answers: FlowAnswers = {
        ...emptyAnswers,
        deviceSwitchIntention: false,
      };
      expect(getNextStep('device-switch-intention', answers)).toBe('last-doctor-visit');
    });

    it('should navigate from device-selection to last-doctor-visit', () => {
      expect(getNextStep('device-selection', emptyAnswers)).toBe('last-doctor-visit');
    });

    it('should navigate from last-doctor-visit to summary', () => {
      expect(getNextStep('last-doctor-visit', emptyAnswers)).toBe('summary');
    });

    it('should return null when on summary (end of flow)', () => {
      expect(getNextStep('summary', emptyAnswers)).toBeNull();
    });

    it('should return null for unknown step', () => {
      expect(getNextStep('unknown-step' as StepId, emptyAnswers)).toBeNull();
    });
  });

  describe('getPreviousStep', () => {
    it('should return null when history has only one step', () => {
      const history: StepId[] = ['currently-using-cgm'];
      expect(getPreviousStep('currently-using-cgm', history)).toBeNull();
    });

    it('should return null when history is empty', () => {
      const history: StepId[] = [];
      expect(getPreviousStep('currently-using-cgm', history)).toBeNull();
    });

    it('should return the second-to-last step in history', () => {
      const history: StepId[] = ['currently-using-cgm', 'current-device', 'last-device-update'];
      expect(getPreviousStep('last-device-update', history)).toBe('current-device');
    });

    it('should work with complex navigation paths', () => {
      const history: StepId[] = [
        'currently-using-cgm',
        'current-device',
        'last-device-update',
        'last-sensors-ordered',
        'device-switch-intention',
        'device-selection',
      ];
      expect(getPreviousStep('device-selection', history)).toBe('device-switch-intention');
    });
  });

  describe('canProceed', () => {
    const emptyAnswers: FlowAnswers = {
      currentlyUsingCGM: null,
      currentDevice: null,
      lastDeviceUpdate: null,
      lastSensorsOrdered: null,
      deviceSwitchIntention: null,
      deviceSelection: null,
      lastDoctorVisit: null,
    };

    it('should return false for currently-using-cgm when answer is null', () => {
      expect(canProceed('currently-using-cgm', emptyAnswers)).toBe(false);
    });

    it('should return true for currently-using-cgm when answer is true', () => {
      const answers = { ...emptyAnswers, currentlyUsingCGM: true };
      expect(canProceed('currently-using-cgm', answers)).toBe(true);
    });

    it('should return true for currently-using-cgm when answer is false', () => {
      const answers = { ...emptyAnswers, currentlyUsingCGM: false };
      expect(canProceed('currently-using-cgm', answers)).toBe(true);
    });

    it('should return false for current-device when answer is null', () => {
      expect(canProceed('current-device', emptyAnswers)).toBe(false);
    });

    it('should return true for current-device when answer is provided', () => {
      const answers = { ...emptyAnswers, currentDevice: 'dexcom-g7' };
      expect(canProceed('current-device', answers)).toBe(true);
    });

    it('should return false for last-device-update when answer is null', () => {
      expect(canProceed('last-device-update', emptyAnswers)).toBe(false);
    });

    it('should return true for last-device-update when answer is provided', () => {
      const answers = { ...emptyAnswers, lastDeviceUpdate: '0-1-year' };
      expect(canProceed('last-device-update', answers)).toBe(true);
    });

    it('should return false for last-sensors-ordered when answer is null', () => {
      expect(canProceed('last-sensors-ordered', emptyAnswers)).toBe(false);
    });

    it('should return true for last-sensors-ordered when answer is provided', () => {
      const answers = { ...emptyAnswers, lastSensorsOrdered: '0-1-months' };
      expect(canProceed('last-sensors-ordered', answers)).toBe(true);
    });

    it('should return false for device-switch-intention when answer is null', () => {
      expect(canProceed('device-switch-intention', emptyAnswers)).toBe(false);
    });

    it('should return true for device-switch-intention when answer is true', () => {
      const answers = { ...emptyAnswers, deviceSwitchIntention: true };
      expect(canProceed('device-switch-intention', answers)).toBe(true);
    });

    it('should return true for device-switch-intention when answer is false', () => {
      const answers = { ...emptyAnswers, deviceSwitchIntention: false };
      expect(canProceed('device-switch-intention', answers)).toBe(true);
    });

    it('should return false for device-selection when answer is null', () => {
      expect(canProceed('device-selection', emptyAnswers)).toBe(false);
    });

    it('should return true for device-selection when answer is provided', () => {
      const answers = { ...emptyAnswers, deviceSelection: 'libre-freestyle-3' };
      expect(canProceed('device-selection', answers)).toBe(true);
    });

    it('should return false for last-doctor-visit when answer is null', () => {
      expect(canProceed('last-doctor-visit', emptyAnswers)).toBe(false);
    });

    it('should return true for last-doctor-visit when answer is true', () => {
      const answers = { ...emptyAnswers, lastDoctorVisit: true };
      expect(canProceed('last-doctor-visit', answers)).toBe(true);
    });

    it('should return true for last-doctor-visit when answer is false', () => {
      const answers = { ...emptyAnswers, lastDoctorVisit: false };
      expect(canProceed('last-doctor-visit', answers)).toBe(true);
    });

    it('should return true for summary step', () => {
      expect(canProceed('summary', emptyAnswers)).toBe(true);
    });

    it('should return false for unknown step', () => {
      expect(canProceed('unknown-step' as StepId, emptyAnswers)).toBe(false);
    });
  });

  describe('getStepTitle', () => {
    it('should return correct title for currently-using-cgm', () => {
      expect(getStepTitle('currently-using-cgm')).toBe('Currently Using CGM');
    });

    it('should return correct title for current-device', () => {
      expect(getStepTitle('current-device')).toBe('Current Device');
    });

    it('should return correct title for last-device-update', () => {
      expect(getStepTitle('last-device-update')).toBe('Last Device Update');
    });

    it('should return correct title for last-sensors-ordered', () => {
      expect(getStepTitle('last-sensors-ordered')).toBe('Last Sensors Ordered');
    });

    it('should return correct title for device-switch-intention', () => {
      expect(getStepTitle('device-switch-intention')).toBe('Device Switch Intention');
    });

    it('should return correct title for device-selection', () => {
      expect(getStepTitle('device-selection')).toBe('Device Selection');
    });

    it('should return correct title for last-doctor-visit', () => {
      expect(getStepTitle('last-doctor-visit')).toBe('Last Doctor Visit');
    });

    it('should return correct title for summary', () => {
      expect(getStepTitle('summary')).toBe('Summary');
    });

    it('should return empty string for unknown step', () => {
      expect(getStepTitle('unknown-step' as StepId)).toBe('');
    });
  });

  describe('getStepQuestion', () => {
    it('should return correct question for currently-using-cgm', () => {
      expect(getStepQuestion('currently-using-cgm')).toBe('Are you currently using a CGM device?');
    });

    it('should return correct question for current-device', () => {
      expect(getStepQuestion('current-device')).toBe('Which CGM device are you currently using?');
    });

    it('should return correct question for last-device-update', () => {
      expect(getStepQuestion('last-device-update')).toBe('When was your last device update?');
    });

    it('should return correct question for last-sensors-ordered', () => {
      expect(getStepQuestion('last-sensors-ordered')).toBe('When did you last order sensors?');
    });

    it('should return correct question for device-switch-intention', () => {
      expect(getStepQuestion('device-switch-intention')).toBe(
        'Are you interested in switching to a different CGM device?'
      );
    });

    it('should return correct question for device-selection', () => {
      expect(getStepQuestion('device-selection')).toBe('Which CGM device would you like to select?');
    });

    it('should return correct question for last-doctor-visit', () => {
      expect(getStepQuestion('last-doctor-visit')).toBe(
        'Have you seen your primary care physician in the last 6 months?'
      );
    });

    it('should return correct question for summary', () => {
      expect(getStepQuestion('summary')).toBe('Review Your Selections');
    });

    it('should return empty string for unknown step', () => {
      expect(getStepQuestion('unknown-step' as StepId)).toBe('');
    });
  });

  describe('getValidationError', () => {
    const emptyAnswers: FlowAnswers = {
      currentlyUsingCGM: null,
      currentDevice: null,
      lastDeviceUpdate: null,
      lastSensorsOrdered: null,
      deviceSwitchIntention: null,
      deviceSelection: null,
      lastDoctorVisit: null,
    };

    it('should return error for currently-using-cgm when answer is null', () => {
      expect(getValidationError('currently-using-cgm', emptyAnswers)).toBe(
        'Please select whether you are currently using a CGM device.'
      );
    });

    it('should return null for currently-using-cgm when answer is true', () => {
      const answers = { ...emptyAnswers, currentlyUsingCGM: true };
      expect(getValidationError('currently-using-cgm', answers)).toBeNull();
    });

    it('should return null for currently-using-cgm when answer is false', () => {
      const answers = { ...emptyAnswers, currentlyUsingCGM: false };
      expect(getValidationError('currently-using-cgm', answers)).toBeNull();
    });

    it('should return error for current-device when answer is null', () => {
      expect(getValidationError('current-device', emptyAnswers)).toBe(
        'Please select your current CGM device.'
      );
    });

    it('should return null for current-device when answer is provided', () => {
      const answers = { ...emptyAnswers, currentDevice: 'dexcom-g7' };
      expect(getValidationError('current-device', answers)).toBeNull();
    });

    it('should return error for last-device-update when answer is null', () => {
      expect(getValidationError('last-device-update', emptyAnswers)).toBe(
        'Please select when your last device update was.'
      );
    });

    it('should return null for last-device-update when answer is provided', () => {
      const answers = { ...emptyAnswers, lastDeviceUpdate: '0-1-year' };
      expect(getValidationError('last-device-update', answers)).toBeNull();
    });

    it('should return error for last-sensors-ordered when answer is null', () => {
      expect(getValidationError('last-sensors-ordered', emptyAnswers)).toBe(
        'Please select when you last ordered sensors.'
      );
    });

    it('should return null for last-sensors-ordered when answer is provided', () => {
      const answers = { ...emptyAnswers, lastSensorsOrdered: '0-1-months' };
      expect(getValidationError('last-sensors-ordered', answers)).toBeNull();
    });

    it('should return error for device-switch-intention when answer is null', () => {
      expect(getValidationError('device-switch-intention', emptyAnswers)).toBe(
        'Please indicate whether you are interested in switching devices.'
      );
    });

    it('should return null for device-switch-intention when answer is true', () => {
      const answers = { ...emptyAnswers, deviceSwitchIntention: true };
      expect(getValidationError('device-switch-intention', answers)).toBeNull();
    });

    it('should return null for device-switch-intention when answer is false', () => {
      const answers = { ...emptyAnswers, deviceSwitchIntention: false };
      expect(getValidationError('device-switch-intention', answers)).toBeNull();
    });

    it('should return error for device-selection when answer is null', () => {
      expect(getValidationError('device-selection', emptyAnswers)).toBe(
        'Please select a CGM device.'
      );
    });

    it('should return null for device-selection when answer is provided', () => {
      const answers = { ...emptyAnswers, deviceSelection: 'libre-freestyle-3' };
      expect(getValidationError('device-selection', answers)).toBeNull();
    });

    it('should return error for last-doctor-visit when answer is null', () => {
      expect(getValidationError('last-doctor-visit', emptyAnswers)).toBe(
        'Please indicate whether you have seen your primary care physician in the last 6 months.'
      );
    });

    it('should return null for last-doctor-visit when answer is true', () => {
      const answers = { ...emptyAnswers, lastDoctorVisit: true };
      expect(getValidationError('last-doctor-visit', answers)).toBeNull();
    });

    it('should return null for last-doctor-visit when answer is false', () => {
      const answers = { ...emptyAnswers, lastDoctorVisit: false };
      expect(getValidationError('last-doctor-visit', answers)).toBeNull();
    });

    it('should return null for summary step', () => {
      expect(getValidationError('summary', emptyAnswers)).toBeNull();
    });

    it('should return null for unknown step', () => {
      expect(getValidationError('unknown-step' as StepId, emptyAnswers)).toBeNull();
    });
  });
});

