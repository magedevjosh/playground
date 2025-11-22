import { StepProps, TIME_RANGES } from '@/types/cgm-flow';
import RadioOption from '../ui/RadioOption';

export default function LastDeviceUpdate({ value, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      {TIME_RANGES.deviceUpdate.map((option) => (
        <RadioOption
          key={option.id}
          id={`device-update-${option.id}`}
          name="last-device-update"
          label={option.label}
          value={option.id}
          checked={value === option.id}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

