/**
 * Tests for useEligibleDevices hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEligibleDevices } from '../useEligibleDevices';
import { Device } from '@/types/cgm-flow';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useEligibleDevices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch devices successfully', async () => {
    const mockDevices: Device[] = [
      { id: 'dexcom-g7', name: 'Dexcom G7', description: 'Latest Dexcom', image: '📱' },
      { id: 'libre-3', name: 'Libre 3', description: 'FreeStyle Libre 3', image: '📱' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockDevices,
        count: 2,
      }),
    });

    const { result } = renderHook(() => useEligibleDevices());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.devices).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Check final state
    expect(result.current.devices).toEqual(mockDevices);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch errors', async () => {
    const errorMessage = 'Failed to fetch eligible devices';

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: { message: errorMessage },
      }),
    });

    const { result } = renderHook(() => useEligibleDevices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.devices).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useEligibleDevices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.devices).toEqual([]);
    expect(result.current.error).toBeTruthy();
  });

  it('should refetch when refetch is called', async () => {
    const mockDevices: Device[] = [
      { id: 'dexcom-g7', name: 'Dexcom G7', description: 'Latest Dexcom', image: '📱' },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockDevices,
        count: 1,
      }),
    });

    const { result } = renderHook(() => useEligibleDevices());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should use custom patientId when provided', async () => {
    const customPatientId = 'custom-patient-123';

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        count: 0,
      }),
    });

    renderHook(() => useEligibleDevices({ patientId: customPatientId }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    const fetchCall = mockFetch.mock.calls[0][0];
    expect(fetchCall).toContain(`patientId=${customPatientId}`);
  });

  it('should not fetch when enabled is false', async () => {
    const { result } = renderHook(() =>
      useEligibleDevices({ enabled: false })
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
