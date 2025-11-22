import { StepProps } from '@/types/cgm-flow';
import RadioOption from '../ui/RadioOption';

export default function CurrentlyUsingCGM({ value, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <RadioOption
        id="cgm-yes"
        name="currently-using-cgm"
        label="Yes"
        value="true"
        checked={value === true}
        onChange={() => onChange(true)}
      />
      <RadioOption
        id="cgm-no"
        name="currently-using-cgm"
        label="No"
        value="false"
        checked={value === false}
        onChange={() => onChange(false)}
      />
    </div>
  );
}

