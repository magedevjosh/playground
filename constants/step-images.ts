import { StepId } from '@/types/cgm-flow';

export interface StepImageConfig {
  src: string;
  alt: string;
}

export const STEP_IMAGES: Record<StepId, StepImageConfig> = {
  'currently-using-cgm': {
    src: '/images/cgm-flow/currently-using-cgm.svg',
    alt: 'Person wearing a continuous glucose monitor on their arm',
  },
  'current-device': {
    src: '/images/cgm-flow/current-device.svg',
    alt: 'Different CGM device options displayed side by side',
  },
  'last-device-update': {
    src: '/images/cgm-flow/last-device-update.svg',
    alt: 'Calendar with checkmark indicating device update date',
  },
  'last-sensors-ordered': {
    src: '/images/cgm-flow/last-sensors-ordered.svg',
    alt: 'CGM sensor supply boxes with sensors',
  },
  'device-switch-intention': {
    src: '/images/cgm-flow/device-switch-intention.svg',
    alt: 'Arrows showing transition from one CGM device to another',
  },
  'device-selection': {
    src: '/images/cgm-flow/device-selection.svg',
    alt: 'Hand selecting a preferred CGM device from available options',
  },
  'last-doctor-visit': {
    src: '/images/cgm-flow/last-doctor-visit.svg',
    alt: 'Doctor consultation with patient discussing CGM management',
  },
  'ineligible-selection': {
    src: '/images/cgm-flow/ineligible-selection.svg',
    alt: 'Information document indicating eligibility requirements',
  },
  'summary': {
    src: '/images/cgm-flow/summary.svg',
    alt: 'Checkmark badge showing completion of CGM device selection',
  },
};
