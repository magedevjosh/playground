import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeviceCard from '../DeviceCard';
import { Device } from '@/types/cgm-flow';

describe('DeviceCard', () => {
  const mockDevice: Device = {
    id: 'dexcom-g7',
    name: 'Dexcom G7',
    description: 'The most advanced CGM system with a sleek, all-in-one design.',
    image: '/images/cgm-flow/devices/dexcom-g7.webp',
  };

  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('should render device name', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    expect(screen.getByText('Dexcom G7')).toBeInTheDocument();
  });

  it('should render device description', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    expect(screen.getByText(/The most advanced CGM system/)).toBeInTheDocument();
  });

  it('should render device image', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    const image = screen.getByAltText('Dexcom G7');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('dexcom-g7.webp'));
  });

  it('should have correct test-id', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    expect(screen.getByTestId('device-card-dexcom-g7')).toBeInTheDocument();
  });

  it('should call onSelect with device id when clicked', async () => {
    const user = userEvent.setup();
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    await user.click(card);
    
    expect(mockOnSelect).toHaveBeenCalledWith('dexcom-g7');
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it('should have aria-pressed false when not selected', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card).toHaveAttribute('aria-pressed', 'false');
  });

  it('should have aria-pressed true when selected', () => {
    render(<DeviceCard device={mockDevice} selected={true} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card).toHaveAttribute('aria-pressed', 'true');
  });

  it('should have correct aria-label', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card).toHaveAttribute('aria-label', 'Select Dexcom G7');
  });

  it('should show checkmark when selected', () => {
    render(<DeviceCard device={mockDevice} selected={true} onSelect={mockOnSelect} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('should not show checkmark when not selected', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
  });

  it('should apply selected styles when selected', () => {
    render(<DeviceCard device={mockDevice} selected={true} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card).toHaveClass('bg-primary-light');
  });

  it('should apply unselected styles when not selected', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card).toHaveClass('bg-white', 'border-gray-300');
  });

  it('should be a button element', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card.tagName).toBe('BUTTON');
  });

  it('should render correctly for different devices', () => {
    const anotherDevice: Device = {
      id: 'libre-freestyle-3',
      name: 'Libre FreeStyle 3',
      description: 'Small, discreet sensor with continuous glucose monitoring.',
      image: '/images/cgm-flow/devices/libre-freestyle-3.webp',
    };

    render(<DeviceCard device={anotherDevice} selected={false} onSelect={mockOnSelect} />);

    expect(screen.getByText('Libre FreeStyle 3')).toBeInTheDocument();
    expect(screen.getByText(/Small, discreet sensor/)).toBeInTheDocument();
    const image = screen.getByAltText('Libre FreeStyle 3');
    expect(image).toHaveAttribute('src', expect.stringContaining('libre-freestyle-3.webp'));
    expect(screen.getByTestId('device-card-libre-freestyle-3')).toBeInTheDocument();
  });

  it('should maintain button functionality when already selected', async () => {
    const user = userEvent.setup();
    render(<DeviceCard device={mockDevice} selected={true} onSelect={mockOnSelect} />);
    
    const card = screen.getByTestId('device-card-dexcom-g7');
    await user.click(card);
    
    // Should still trigger onSelect even if already selected
    expect(mockOnSelect).toHaveBeenCalledWith('dexcom-g7');
  });

  it('should have text-left alignment for content', () => {
    render(<DeviceCard device={mockDevice} selected={false} onSelect={mockOnSelect} />);

    const card = screen.getByTestId('device-card-dexcom-g7');
    expect(card).toHaveClass('text-left');
  });

  it('should render emoji for devices without image paths', () => {
    const emojiDevice: Device = {
      id: 'other',
      name: 'I don\'t see my device',
      description: 'Select this option if your device is not listed above.',
      image: '❓',
    };

    render(<DeviceCard device={emojiDevice} selected={false} onSelect={mockOnSelect} />);

    expect(screen.getByText('❓')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

