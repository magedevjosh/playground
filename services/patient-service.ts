/**
 * Patient service - Business logic for patient-related API operations
 * This layer handles API calls, data transformation, and validation
 */

import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  PatientDeviceResponse,
  DeviceData,
  mapDeviceDataToDevice,
  filterEligibleDevices,
  isPatientDeviceResponse,
} from '@/types/api';
import { Device } from '@/types/cgm-flow';
import { ValidationError } from '@/lib/api/errors';

/**
 * Fetches eligible devices for a patient from the external API
 * @param patientId - The patient's ID
 * @returns Array of eligible devices in our internal Device format
 * @throws {APIError} If the API request fails
 * @throws {ValidationError} If the response format is invalid
 */
export async function fetchEligibleDevices(patientId: string): Promise<Device[]> {
  // Validate patientId
  if (!patientId || typeof patientId !== 'string') {
    throw new ValidationError('Patient ID is required', 'patientId');
  }

  try {
    // Call external API
    const response = await apiClient.get<unknown>(API_ENDPOINTS.PATIENT_DEVICES, {
      params: { patientId },
    });

    // Validate response structure
    if (!isPatientDeviceResponse(response.data)) {
      throw new ValidationError(
        'Invalid API response format: expected PatientDeviceResponse structure'
      );
    }

    const patientData: PatientDeviceResponse = response.data;

    // Filter to only eligible devices
    const eligibleDeviceData = filterEligibleDevices(patientData.eligibleDevices);

    // Transform API device data to our internal Device format
    const devices = eligibleDeviceData.map(mapDeviceDataToDevice);

    return devices;
  } catch (error) {
    // Re-throw API errors with additional context
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred while fetching eligible devices');
  }
}

/**
 * Fetches customer pricing information for devices
 * @param customerId - The customer's ID
 * @returns Pricing information for eligible devices
 */
export async function fetchCustomerPricing(customerId: string) {
  if (!customerId || typeof customerId !== 'string') {
    throw new ValidationError('Customer ID is required', 'customerId');
  }

  try {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_PRICING, {
      params: { customerId },
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred while fetching customer pricing');
  }
}

/**
 * Validates if a patient is eligible for a specific device
 * @param patientId - The patient's ID
 * @param deviceId - The device ID to check
 * @returns Boolean indicating eligibility
 */
export async function validatePatientDeviceEligibility(
  patientId: string,
  deviceId: string
): Promise<boolean> {
  try {
    const eligibleDevices = await fetchEligibleDevices(patientId);
    return eligibleDevices.some(device => device.id === deviceId);
  } catch {
    // If we can't fetch eligibility, assume not eligible
    return false;
  }
}
