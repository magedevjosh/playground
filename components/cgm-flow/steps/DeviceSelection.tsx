import { StepProps, DEVICES } from '@/types/cgm-flow';
import DeviceCard from '../ui/DeviceCard';

interface DeviceSelectionProps extends StepProps {
  currentDevice?: string | null;
  currentlyUsingCGM?: boolean | null;
}

export default function DeviceSelection({ value, onChange, currentDevice }: DeviceSelectionProps) {
  // Filter devices: always show "no-preference", never show "other"
  const availableDevices = DEVICES.filter(device => {
    // Always filter out the current device
    if (device.id === currentDevice) return false;
    
    // Never show "I don't see my device" on Device Selection
    if (device.id === 'other') return false;
    
    return true;
  });
  
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

