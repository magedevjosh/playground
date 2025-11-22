import { StepProps, DEVICES } from '@/types/cgm-flow';
import DeviceCard from '../ui/DeviceCard';

interface DeviceSelectionProps extends StepProps {
  currentDevice?: string | null;
}

export default function DeviceSelection({ value, onChange, currentDevice }: DeviceSelectionProps) {
  // Filter out the current device from the available options
  const availableDevices = DEVICES.filter(device => device.id !== currentDevice);
  
  return (
    <div className="space-y-3">
      {availableDevices.map((device) => (
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

