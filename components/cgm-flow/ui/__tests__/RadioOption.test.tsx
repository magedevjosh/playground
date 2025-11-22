import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioOption from '../RadioOption';

describe('RadioOption', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render the label text', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('should render the radio input', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const input = screen.getByTestId('radio-input-test-value');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'radio');
  });

  it('should associate label with input using id', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const label = screen.getByText('Test Option').closest('label');
    const input = screen.getByTestId('radio-input-test-value');
    
    expect(label).toHaveAttribute('for', 'test-option');
    expect(input).toHaveAttribute('id', 'test-option');
  });

  it('should render as checked when checked prop is true', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={true}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const input = screen.getByTestId('radio-input-test-value') as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it('should render as unchecked when checked prop is false', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const input = screen.getByTestId('radio-input-test-value') as HTMLInputElement;
    expect(input.checked).toBe(false);
  });

  it('should call onChange with value when clicked', async () => {
    const user = userEvent.setup();
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const input = screen.getByTestId('radio-input-test-value');
    await user.click(input);
    
    expect(mockOnChange).toHaveBeenCalledWith('test-value');
  });

  it('should call onChange when label is clicked', async () => {
    const user = userEvent.setup();
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const label = screen.getByText('Test Option');
    await user.click(label);
    
    expect(mockOnChange).toHaveBeenCalledWith('test-value');
  });

  it('should have the correct name attribute', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const input = screen.getByTestId('radio-input-test-value');
    expect(input).toHaveAttribute('name', 'test-group');
  });

  it('should have the correct value attribute', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const input = screen.getByTestId('radio-input-test-value');
    expect(input).toHaveAttribute('value', 'test-value');
  });

  it('should render with correct test-ids', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="my-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    expect(screen.getByTestId('radio-option-my-value')).toBeInTheDocument();
    expect(screen.getByTestId('radio-input-my-value')).toBeInTheDocument();
  });

  it('should apply different styles when checked', () => {
    const { rerender } = render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const label = screen.getByTestId('radio-option-test-value');
    expect(label).toHaveClass('bg-white');
    
    rerender(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={true}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    expect(label).toHaveClass('bg-primary-light');
  });

  it('should have cursor-pointer class for clickability', () => {
    render(
      <RadioOption
        id="test-option"
        label="Test Option"
        value="test-value"
        checked={false}
        onChange={mockOnChange}
        name="test-group"
      />
    );
    
    const label = screen.getByTestId('radio-option-test-value');
    expect(label).toHaveClass('cursor-pointer');
  });
});

