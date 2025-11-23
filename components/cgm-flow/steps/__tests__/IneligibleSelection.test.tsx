import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import IneligibleSelection from '../IneligibleSelection';

describe('IneligibleSelection', () => {
  const mockProps = {
    value: null,
    onChange: vi.fn(),
    onNext: vi.fn(),
  };

  it('should render the ineligibility message', () => {
    render(<IneligibleSelection {...mockProps} />);
    
    expect(screen.getByText('Unable to Provide Equipment at This Time')).toBeInTheDocument();
    expect(screen.getByText(/unable to provide you with equipment at this time/i)).toBeInTheDocument();
    expect(screen.getByText(/have not selected a specific device/i)).toBeInTheDocument();
    expect(screen.getByText(/not been at least 5 years/i)).toBeInTheDocument();
  });

  it('should render the customer support message', () => {
    render(<IneligibleSelection {...mockProps} />);
    
    expect(screen.getByText(/if you have any questions about your eligibility/i)).toBeInTheDocument();
    expect(screen.getByText(/contact our customer support team/i)).toBeInTheDocument();
  });

  it('should render a clickable phone number link', () => {
    render(<IneligibleSelection {...mockProps} />);
    
    const phoneLink = screen.getByRole('link', { name: /1-800-555-0123/i });
    expect(phoneLink).toBeInTheDocument();
  });

  it('should have correct tel: href for phone number', () => {
    render(<IneligibleSelection {...mockProps} />);
    
    const phoneLink = screen.getByRole('link', { name: /1-800-555-0123/i });
    expect(phoneLink).toHaveAttribute('href', 'tel:18005550123');
  });

  it('should style the phone link appropriately', () => {
    render(<IneligibleSelection {...mockProps} />);
    
    const phoneLink = screen.getByRole('link', { name: /1-800-555-0123/i });
    expect(phoneLink).toHaveClass('text-blue-600', 'hover:text-blue-800', 'font-semibold', 'underline');
  });

  it('should render content in a styled container', () => {
    render(<IneligibleSelection {...mockProps} />);
    
    const heading = screen.getByText('Unable to Provide Equipment at This Time');
    const container = heading.closest('div');
    expect(container).toHaveClass('bg-gray-50', 'border', 'border-gray-200', 'rounded-lg');
  });
});

