import { StepProps, DEVICES } from '@/types/cgm-flow';
import DeviceCard from '../ui/DeviceCard';

export default function CurrentDevice({ value, onChange }: StepProps) {
  return (
    <div className="space-y-3">
      {DEVICES.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          selected={value === device.id}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}

