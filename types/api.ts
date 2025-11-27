/**
 * API response type definitions
 * These types define the expected structure of external API responses
 */

import { Device } from '@/types/cgm-flow';

/**
 * Generic API error response structure
 */
export interface APIErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Patient device eligibility response
 * NOTE: This structure is flexible since we don't know the exact API format yet
 * Adjust this interface once you see the actual API response
 */
export interface PatientDeviceResponse {
  patientId: string;
  eligibleDevices: DeviceData[];
  metadata?: {
    lastUpdated?: string;
    source?: string;
  };
}

/**
 * Device data from external API
 * This may differ from our internal Device type
 */
export interface DeviceData {
  // Common fields we expect
  id?: string;
  deviceId?: string;
  name?: string;
  deviceName?: string;
  manufacturer?: string;
  model?: string;
  description?: string;
  imageUrl?: string;

  // Eligibility information
  eligible?: boolean;
  eligibilityReason?: string;

  // Additional fields that might be present
  [key: string]: unknown;
}

/**
 * Customer pricing response
 * For the customer pricing API endpoint
 */
export interface CustomerPricingResponse {
  customerId: string;
  pricing: {
    deviceId: string;
    price: number;
    currency: string;
    coverage?: {
      insuranceCovered: boolean;
      copay?: number;
    };
  }[];
}

/**
 * Maps external API device data to our internal Device type
 * This function handles the transformation of unknown API formats
 */
export function mapDeviceDataToDevice(deviceData: DeviceData): Device {
  // Extract ID (try multiple possible field names)
  const id = deviceData.id || deviceData.deviceId || deviceData.model || 'unknown';

  // Extract name (try multiple possible field names)
  const name = deviceData.name || deviceData.deviceName || deviceData.model || 'Unknown Device';

  // Extract description
  const description = deviceData.description || `${deviceData.manufacturer || ''} ${deviceData.model || ''}`.trim() || 'No description available';

  // Use imageUrl if provided, otherwise use placeholder emoji
  const image = deviceData.imageUrl || '📱';

  return {
    id,
    name,
    description,
    image,
  };
}

/**
 * Filters only eligible devices from API response
 */
export function filterEligibleDevices(devices: DeviceData[]): DeviceData[] {
  return devices.filter(device => {
    // If eligible field exists, use it
    if ('eligible' in device) {
      return device.eligible === true;
    }

    // Otherwise assume device is eligible if it's in the response
    return true;
  });
}

/**
 * Type guard to check if response matches expected structure
 */
export function isPatientDeviceResponse(data: unknown): data is PatientDeviceResponse {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const response = data as Record<string, unknown>;

  return (
    typeof response.patientId === 'string' &&
    Array.isArray(response.eligibleDevices)
  );
}
