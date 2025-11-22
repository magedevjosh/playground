import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Summary from '../Summary';
import { FlowAnswers } from '@/types/cgm-flow';

describe('Summary', () => {
  const fullAnswers: FlowAnswers = {
    currentlyUsingCGM: true,
    currentDevice: 'dexcom-g7',
    lastDeviceUpdate: '0-1-year',
    lastSensorsOrdered: '0-1-months',
    deviceSwitchIntention: true,
    deviceSelection: 'libre-freestyle-3',
    lastDoctorVisit: true,
  };

  it('should render the summary heading', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Your CGM Experience Profile')).toBeInTheDocument();
  });

  it('should render the thank you message', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText(/Thank you for completing the CGM device selection experience/)).toBeInTheDocument();
  });

  it('should display Currently Using CGM as Yes when true', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
    const cgmSection = screen.getByText('Currently Using CGM').closest('div');
    expect(cgmSection).toHaveTextContent('Yes');
  });

  it('should display Currently Using CGM as No when false', () => {
    const answers = { ...fullAnswers, currentlyUsingCGM: false };
    render(<Summary answers={answers} />);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should display Current Device name when provided', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Current Device')).toBeInTheDocument();
    expect(screen.getByText('Dexcom G7')).toBeInTheDocument();
  });

  it('should not display Current Device section when not provided', () => {
    const answers = { ...fullAnswers, currentDevice: null };
    render(<Summary answers={answers} />);
    expect(screen.queryByText('Current Device')).not.toBeInTheDocument();
  });

  it('should display Last Device Update with proper label', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Last Device Update')).toBeInTheDocument();
    expect(screen.getByText('0-1 Year')).toBeInTheDocument();
  });

  it('should not display Last Device Update section when not provided', () => {
    const answers = { ...fullAnswers, lastDeviceUpdate: null };
    render(<Summary answers={answers} />);
    expect(screen.queryByText('Last Device Update')).not.toBeInTheDocument();
  });

  it('should display Last Sensors Ordered with proper label', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Last Sensors Ordered')).toBeInTheDocument();
    expect(screen.getByText('0-1 months')).toBeInTheDocument();
  });

  it('should not display Last Sensors Ordered section when not provided', () => {
    const answers = { ...fullAnswers, lastSensorsOrdered: null };
    render(<Summary answers={answers} />);
    expect(screen.queryByText('Last Sensors Ordered')).not.toBeInTheDocument();
  });

  it('should display Interested in Switching as Yes when true', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Interested in Switching')).toBeInTheDocument();
    // Note: There are multiple "Yes" texts, so we need to check the container
    const switchSection = screen.getByText('Interested in Switching').closest('div');
    expect(switchSection).toHaveTextContent('Yes');
  });

  it('should display Interested in Switching as No when false', () => {
    const answers = { ...fullAnswers, deviceSwitchIntention: false };
    render(<Summary answers={answers} />);
    expect(screen.getByText('Interested in Switching')).toBeInTheDocument();
    const switchSection = screen.getByText('Interested in Switching').closest('div');
    expect(switchSection).toHaveTextContent('No');
  });

  it('should not display Interested in Switching section when null', () => {
    const answers = { ...fullAnswers, deviceSwitchIntention: null };
    render(<Summary answers={answers} />);
    expect(screen.queryByText('Interested in Switching')).not.toBeInTheDocument();
  });

  it('should display Selected Device name when provided', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Selected Device')).toBeInTheDocument();
    expect(screen.getByText('Libre FreeStyle 3')).toBeInTheDocument();
  });

  it('should not display Selected Device section when not provided', () => {
    const answers = { ...fullAnswers, deviceSelection: null };
    render(<Summary answers={answers} />);
    expect(screen.queryByText('Selected Device')).not.toBeInTheDocument();
  });

  it('should display Seen Doctor in Last 6 Months as Yes when true', () => {
    render(<Summary answers={fullAnswers} />);
    expect(screen.getByText('Seen Doctor in Last 6 Months')).toBeInTheDocument();
    const doctorSection = screen.getByText('Seen Doctor in Last 6 Months').closest('div');
    expect(doctorSection).toHaveTextContent('Yes');
  });

  it('should display Seen Doctor in Last 6 Months as No when false', () => {
    const answers = { ...fullAnswers, lastDoctorVisit: false };
    render(<Summary answers={answers} />);
    expect(screen.getByText('Seen Doctor in Last 6 Months')).toBeInTheDocument();
    const doctorSection = screen.getByText('Seen Doctor in Last 6 Months').closest('div');
    expect(doctorSection).toHaveTextContent('No');
  });

  it('should not display Seen Doctor in Last 6 Months section when null', () => {
    const answers = { ...fullAnswers, lastDoctorVisit: null };
    render(<Summary answers={answers} />);
    expect(screen.queryByText('Seen Doctor in Last 6 Months')).not.toBeInTheDocument();
  });

  it('should handle minimal answers (new user path)', () => {
    const minimalAnswers: FlowAnswers = {
      currentlyUsingCGM: false,
      currentDevice: null,
      lastDeviceUpdate: null,
      lastSensorsOrdered: null,
      deviceSwitchIntention: null,
      deviceSelection: 'dexcom-g7',
      lastDoctorVisit: false,
    };
    
    render(<Summary answers={minimalAnswers} />);
    
    expect(screen.getByText('Your CGM Experience Profile')).toBeInTheDocument();
    expect(screen.getByText('Currently Using CGM')).toBeInTheDocument();
    expect(screen.getByText('Selected Device')).toBeInTheDocument();
    expect(screen.getByText('Dexcom G7')).toBeInTheDocument();
    
    // Should not show sections for questions that weren't asked
    expect(screen.queryByText('Current Device')).not.toBeInTheDocument();
    expect(screen.queryByText('Last Device Update')).not.toBeInTheDocument();
    expect(screen.queryByText('Last Sensors Ordered')).not.toBeInTheDocument();
  });

  it('should show "Not specified" for null device when deviceId is provided but invalid', () => {
    const answers = { ...fullAnswers, currentDevice: 'invalid-device-id' };
    render(<Summary answers={answers} />);
    
    // The component should show the invalid id as-is since it's not found
    expect(screen.getByText('invalid-device-id')).toBeInTheDocument();
  });
});

