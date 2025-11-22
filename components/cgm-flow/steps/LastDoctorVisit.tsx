import { StepProps } from '@/types/cgm-flow';
import RadioOption from '../ui/RadioOption';

export default function LastDoctorVisit({ value, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <RadioOption
        id="doctor-yes"
        name="last-doctor-visit"
        label="Yes"
        value="true"
        checked={value === true}
        onChange={() => onChange(true)}
      />
      <RadioOption
        id="doctor-no"
        name="last-doctor-visit"
        label="No"
        value="false"
        checked={value === false}
        onChange={() => onChange(false)}
      />
    </div>
  );
}

