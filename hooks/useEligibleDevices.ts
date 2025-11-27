/**
 * Custom hook for fetching eligible devices from API
 * Manages loading, error, and data states for device fetching
 */

'use client';

import { useState, useEffect } from 'react';
import { Device } from '@/types/cgm-flow';

/**
 * API response structure from /api/patients/devices
 */
interface DevicesAPIResponse {
  success: boolean;
  data?: Device[];
  error?: {
    message: string;
    code: string;
  };
  patientId?: string;
  count?: number;
}

/**
 * Hook return type
 */
export interface UseEligibleDevicesResult {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook options
 */
export interface UseEligibleDevicesOptions {
  patientId?: string;
  enabled?: boolean; // If false, won't fetch automatically
}

/**
 * Custom hook to fetch eligible devices for a patient
 * @param options - Configuration options
 * @returns Object containing devices, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { devices, isLoading, error, refetch } = useEligibleDevices();
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage message={error} onRetry={refetch} />;
 * if (devices.length === 0) return <EmptyState />;
 * return <DeviceList devices={devices} />;
 * ```
 */
export function useEligibleDevices(
  options: UseEligibleDevicesOptions = {}
): UseEligibleDevicesResult {
  const { patientId, enabled = true } = options;

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    // Reset state
    setIsLoading(true);
    setError(null);

    try {
      // Build URL with optional patientId query param
      const url = new URL('/api/patients/devices', window.location.origin);
      if (patientId) {
        url.searchParams.set('patientId', patientId);
      }

      // Fetch from our Next.js API route
      const response = await fetch(url.toString());

      // Parse response
      const data: DevicesAPIResponse = await response.json();

      // Handle error response
      if (!data.success || !response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch eligible devices');
      }

      // Set devices from response
      setDevices(data.data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching devices';

      setError(errorMessage);
      setDevices([]); // Clear devices on error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch devices on mount or when patientId changes
  useEffect(() => {
    if (enabled) {
      fetchDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, enabled]);

  return {
    devices,
    isLoading,
    error,
    refetch: fetchDevices,
  };
}
