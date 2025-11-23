import { StepProps, DEVICES } from '@/types/cgm-flow';
import DeviceCard from '../ui/DeviceCard';

export default function CurrentDevice({ value, onChange }: StepProps) {
  // Filter out "no-preference" - only show actual devices patient could currently be using
  const currentDeviceOptions = DEVICES.filter(device => device.id !== 'no-preference');
  
  return (
    <div className="space-y-3">
      {currentDeviceOptions.map((device) => (
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

