import { StepProps, TIME_RANGES } from '@/types/cgm-flow';
import RadioOption from '../ui/RadioOption';

export default function LastSensorsOrdered({ value, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      {TIME_RANGES.sensorsOrdered.map((option) => (
        <RadioOption
          key={option.id}
          id={`sensors-ordered-${option.id}`}
          name="last-sensors-ordered"
          label={option.label}
          value={option.id}
          checked={value === option.id}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

