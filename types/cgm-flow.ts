export type StepId =
  | 'currently-using-cgm'
  | 'current-device'
  | 'last-device-update'
  | 'last-sensors-ordered'
  | 'device-switch-intention'
  | 'device-selection'
  | 'last-doctor-visit'
  | 'ineligible-selection'
  | 'summary';

export interface FlowAnswers {
  currentlyUsingCGM: boolean | null;
  currentDevice: string | null;
  lastDeviceUpdate: string | null;
  lastSensorsOrdered: string | null;
  deviceSwitchIntention: boolean | null;
  deviceSelection: string | null;
  lastDoctorVisit: boolean | null;
}

export interface FlowState {
  currentStep: StepId;
  answers: FlowAnswers;
  stepHistory: StepId[];
  returnToSummary?: boolean; // Track if user is editing from summary page
}

export interface Device {
  id: string;
  name: string;
  description: string;
  imagePlaceholder: string;
}

export interface StepProps {
  value: any;
  onChange: (value: any) => void;
  onNext: () => void;
}

export const DEVICES: Device[] = [
  {
    id: 'dexcom-g7',
    name: 'Dexcom G7',
    description: 'The most advanced CGM system with a sleek, all-in-one design and real-time glucose readings.',
    imagePlaceholder: '📱',
  },
  {
    id: 'dexcom-g6',
    name: 'Dexcom G6',
    description: 'Proven CGM technology with no fingersticks required and seamless smartphone integration.',
    imagePlaceholder: '📲',
  },
  {
    id: 'libre-freestyle-3',
    name: 'Libre FreeStyle 3',
    description: 'Small, discreet sensor with continuous glucose monitoring and smartphone alerts.',
    imagePlaceholder: '⌚',
  },
  {
    id: 'libre-14-day',
    name: 'Libre 14 Day',
    description: 'Affordable CGM option with 14-day wear time and easy scanning technology.',
    imagePlaceholder: '🔍',
  },
  {
    id: 'other',
    name: 'I don\'t see my device',
    description: 'Select this option if your device is not listed above.',
    imagePlaceholder: '❓',
  },
  {
    id: 'no-preference',
    name: 'No Preference',
    description: 'I would like assistance in choosing the right device for me.',
    imagePlaceholder: '💡',
  },
];

export const TIME_RANGES = {
  deviceUpdate: [
    { id: '0-1-year', label: '0-1 Year' },
    { id: '1-3-years', label: '1-3 Years' },
    { id: '3-4-years', label: '3-4 Years' },
    { id: '5-plus-years', label: '5+ Years' },
  ],
  sensorsOrdered: [
    { id: '0-1-months', label: '0-1 months' },
    { id: '1-3-months', label: '1-3 months' },
    { id: '3-6-months', label: '3-6 months' },
    { id: '6-plus-months', label: '6+ months' },
  ],
};

