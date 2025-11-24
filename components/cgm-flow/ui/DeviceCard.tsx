import Image from 'next/image';
import { Device } from '@/types/cgm-flow';

interface DeviceCardProps {
  device: Device;
  selected: boolean;
  onSelect: (deviceId: string) => void;
}

export default function DeviceCard({ device, selected, onSelect }: DeviceCardProps) {
  const isImagePath = device.image.startsWith('/');

  return (
    <button
      onClick={() => onSelect(device.id)}
      className={`w-full flex items-start gap-4 p-4 border-2 transition-all text-left ${
        selected
          ? 'bg-primary-light'
          : 'border-gray-300 hover:border-gray-400 bg-white'
      }`}
      style={selected ? { borderColor: '#d2bed8' } : undefined}
      aria-pressed={selected}
      aria-label={`Select ${device.name}`}
      data-testid={`device-card-${device.id}`}
    >
      <div className="flex-shrink-0 mt-1">
        {isImagePath ? (
          <Image
            src={device.image}
            alt={device.name}
            width={64}
            height={64}
            className="object-contain"
          />
        ) : (
          <span className="text-4xl">{device.image}</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className={`text-lg font-semibold mb-1 ${selected ? '' : 'text-gray-900'}`}
          style={selected ? { color: '#9d7ea7' } : undefined}>
          {device.name}
        </h3>
        <p className={`text-sm ${selected ? '' : 'text-gray-600'}`}
          style={selected ? { color: '#9d7ea7' } : undefined}>
          {device.description}
        </p>
      </div>
      {selected && (
        <div className="flex-shrink-0 text-xl" style={{ color: '#d2bed8' }}>
          ✓
        </div>
      )}
    </button>
  );
}

