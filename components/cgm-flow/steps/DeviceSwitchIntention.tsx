import { StepProps } from '@/types/cgm-flow';
import RadioOption from '../ui/RadioOption';

export default function DeviceSwitchIntention({ value, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <RadioOption
        id="switch-yes"
        name="device-switch-intention"
        label="Yes"
        value="true"
        checked={value === true}
        onChange={() => onChange(true)}
      />
      <RadioOption
        id="switch-no"
        name="device-switch-intention"
        label="No"
        value="false"
        checked={value === false}
        onChange={() => onChange(false)}
      />
    </div>
  );
}

