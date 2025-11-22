import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrentlyUsingCGM from '../CurrentlyUsingCGM';

describe('CurrentlyUsingCGM', () => {
  const mockOnChange = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
    mockOnNext.mockClear();
  });

  it('should render Yes and No options', () => {
    render(<CurrentlyUsingCGM value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    expect(screen.getByLabelText('Yes')).toBeInTheDocument();
    expect(screen.getByLabelText('No')).toBeInTheDocument();
  });

  it('should call onChange with true when Yes is clicked', async () => {
    const user = userEvent.setup();
    render(<CurrentlyUsingCGM value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    const yesOption = screen.getByLabelText('Yes');
    await user.click(yesOption);
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with false when No is clicked', async () => {
    const user = userEvent.setup();
    render(<CurrentlyUsingCGM value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    const noOption = screen.getByLabelText('No');
    await user.click(noOption);
    
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('should show Yes as checked when value is true', () => {
    render(<CurrentlyUsingCGM value={true} onChange={mockOnChange} onNext={mockOnNext} />);
    
    const yesOption = screen.getByLabelText('Yes') as HTMLInputElement;
    const noOption = screen.getByLabelText('No') as HTMLInputElement;
    
    expect(yesOption.checked).toBe(true);
    expect(noOption.checked).toBe(false);
  });

  it('should show No as checked when value is false', () => {
    render(<CurrentlyUsingCGM value={false} onChange={mockOnChange} onNext={mockOnNext} />);
    
    const yesOption = screen.getByLabelText('Yes') as HTMLInputElement;
    const noOption = screen.getByLabelText('No') as HTMLInputElement;
    
    expect(yesOption.checked).toBe(false);
    expect(noOption.checked).toBe(true);
  });

  it('should show neither option checked when value is null', () => {
    render(<CurrentlyUsingCGM value={null} onChange={mockOnChange} onNext={mockOnNext} />);
    
    const yesOption = screen.getByLabelText('Yes') as HTMLInputElement;
    const noOption = screen.getByLabelText('No') as HTMLInputElement;
    
    expect(yesOption.checked).toBe(false);
    expect(noOption.checked).toBe(false);
  });
});

