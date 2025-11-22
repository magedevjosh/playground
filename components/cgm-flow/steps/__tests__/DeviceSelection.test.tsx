import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceSelection from '../DeviceSelection';
import { DEVICES } from '@/types/cgm-flow';

describe('DeviceSelection', () => {
  const mockOnChange = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnNext.mockClear();
  });

  it('should render all device options', () => {
    render(<DeviceSelection value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    DEVICES.forEach((device) => {
      expect(screen.getByText(device.name)).toBeInTheDocument();
      expect(screen.getByText(device.description)).toBeInTheDocument();
    });
  });

  it('should render all device cards with correct test ids', () => {
    render(<DeviceSelection value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    DEVICES.forEach((device) => {
      expect(screen.getByTestId(`device-card-${device.id}`)).toBeInTheDocument();
    });
  });

  it('should call onChange with device id when a device is clicked', async () => {
    const user = userEvent.setup();
    render(<DeviceSelection value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    const dexcomG7Card = screen.getByTestId('device-card-dexcom-g7');
    await user.click(dexcomG7Card);
    
    expect(mockOnChange).toHaveBeenCalledWith('dexcom-g7');
  });

  it('should show the selected device as selected', () => {
    render(<DeviceSelection value="dexcom-g7" onChange={mockOnChange} onNext={mockOnNext} />);
    
    const dexcomG7Card = screen.getByTestId('device-card-dexcom-g7');
    expect(dexcomG7Card).toHaveAttribute('aria-pressed', 'true');
  });

  it('should show unselected devices as not selected', () => {
    render(<DeviceSelection value="dexcom-g7" onChange={mockOnChange} onNext={mockOnNext} />);
    
    const dexcomG6Card = screen.getByTestId('device-card-dexcom-g6');
    expect(dexcomG6Card).toHaveAttribute('aria-pressed', 'false');
  });

  it('should allow switching between devices', async () => {
    const user = userEvent.setup();
    render(<DeviceSelection value="dexcom-g7" onChange={mockOnChange} onNext={mockOnNext} />);
    
    // Click on a different device
    const libreCard = screen.getByTestId('device-card-libre-freestyle-3');
    await user.click(libreCard);
    
    expect(mockOnChange).toHaveBeenCalledWith('libre-freestyle-3');
  });

  it('should render device placeholder emojis', () => {
    render(<DeviceSelection value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    DEVICES.forEach((device) => {
      expect(screen.getByText(device.imagePlaceholder)).toBeInTheDocument();
    });
  });

  it('should show no device as selected when value is null', () => {
    render(<DeviceSelection value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    DEVICES.forEach((device) => {
      const card = screen.getByTestId(`device-card-${device.id}`);
      expect(card).toHaveAttribute('aria-pressed', 'false');
    });
  });
});

