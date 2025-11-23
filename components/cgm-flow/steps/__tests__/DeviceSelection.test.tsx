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

  it('should always render "No Preference" option', () => {
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    // Should always show "no-preference" and never show "other"
    expect(screen.getByText('No Preference')).toBeInTheDocument();
    expect(screen.queryByText('I don\'t see my device')).not.toBeInTheDocument();
  });

  it('should never render "I don\'t see my device" option', () => {
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    // Should never show "other"
    expect(screen.queryByTestId('device-card-other')).not.toBeInTheDocument();
  });

  it('should call onChange with device id when a device is clicked', async () => {
    const user = userEvent.setup();
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    const dexcomG7Card = screen.getByTestId('device-card-dexcom-g7');
    await user.click(dexcomG7Card);
    
    expect(mockOnChange).toHaveBeenCalledWith('dexcom-g7');
  });

  it('should show the selected device as selected', () => {
    render(
      <DeviceSelection 
        value="dexcom-g7" 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    const dexcomG7Card = screen.getByTestId('device-card-dexcom-g7');
    expect(dexcomG7Card).toHaveAttribute('aria-pressed', 'true');
  });

  it('should show unselected devices as not selected', () => {
    render(
      <DeviceSelection 
        value="dexcom-g7" 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    const dexcomG6Card = screen.getByTestId('device-card-dexcom-g6');
    expect(dexcomG6Card).toHaveAttribute('aria-pressed', 'false');
  });

  it('should allow switching between devices', async () => {
    const user = userEvent.setup();
    render(
      <DeviceSelection 
        value="dexcom-g7" 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    // Click on a different device
    const libreCard = screen.getByTestId('device-card-libre-freestyle-3');
    await user.click(libreCard);
    
    expect(mockOnChange).toHaveBeenCalledWith('libre-freestyle-3');
  });

  it('should allow selecting no-preference', async () => {
    const user = userEvent.setup();
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    const noPreferenceCard = screen.getByTestId('device-card-no-preference');
    await user.click(noPreferenceCard);
    
    expect(mockOnChange).toHaveBeenCalledWith('no-preference');
  });

  it('should hide current device from the list when currentDevice is provided', () => {
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext} 
        currentDevice="dexcom-g7"
      />
    );
    
    // Current device should not be in the list
    expect(screen.queryByTestId('device-card-dexcom-g7')).not.toBeInTheDocument();
    
    // Other devices should still be visible
    expect(screen.getByTestId('device-card-dexcom-g6')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-libre-freestyle-3')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-libre-14-day')).toBeInTheDocument();
    
    // Should show no-preference, not other
    expect(screen.getByTestId('device-card-no-preference')).toBeInTheDocument();
    expect(screen.queryByTestId('device-card-other')).not.toBeInTheDocument();
  });

  it('should show 5 devices (4 CGM devices + no-preference)', () => {
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext}
      />
    );
    
    // Should have 5 devices (4 CGM devices + no-preference, excluding "other")
    const deviceCards = screen.getAllByRole('button');
    expect(deviceCards).toHaveLength(5);
    
    // Check specific devices
    expect(screen.getByTestId('device-card-dexcom-g7')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-dexcom-g6')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-libre-freestyle-3')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-libre-14-day')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-no-preference')).toBeInTheDocument();
    expect(screen.queryByTestId('device-card-other')).not.toBeInTheDocument();
  });

  it('should filter out current device and show no-preference', () => {
    render(
      <DeviceSelection 
        value={null} 
        onChange={mockOnChange} 
        onNext={mockOnNext} 
        currentDevice="libre-freestyle-3"
      />
    );
    
    // Should have 4 devices (5 total - 1 current, with "no-preference" shown)
    const deviceCards = screen.getAllByRole('button');
    expect(deviceCards).toHaveLength(4);
    
    // Specific checks
    expect(screen.queryByTestId('device-card-libre-freestyle-3')).not.toBeInTheDocument();
    expect(screen.getByTestId('device-card-dexcom-g7')).toBeInTheDocument();
    expect(screen.getByTestId('device-card-no-preference')).toBeInTheDocument();
    expect(screen.queryByTestId('device-card-other')).not.toBeInTheDocument();
  });
});

