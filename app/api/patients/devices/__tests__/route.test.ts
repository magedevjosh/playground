/**
 * Tests for /api/patients/devices API route
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import * as patientService from '@/services/patient-service';
import { TEST_PATIENT_ID } from '@/lib/constants';
import { Device } from '@/types/cgm-flow';

// Mock the patient service
vi.mock('@/services/patient-service');

describe('/api/patients/devices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return eligible devices successfully', async () => {
    // Mock devices data
    const mockDevices: Device[] = [
      { id: 'dexcom-g7', name: 'Dexcom G7', description: 'Latest Dexcom', image: '📱' },
      { id: 'libre-3', name: 'Libre 3', description: 'FreeStyle Libre 3', image: '📱' },
    ];

    // Mock the service to return devices
    vi.mocked(patientService.fetchEligibleDevices).mockResolvedValue(mockDevices);

    // Create mock request
    const request = new NextRequest(
      new URL('http://localhost:3000/api/patients/devices')
    );

    // Call the API route
    const response = await GET(request);
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockDevices);
    expect(data.count).toBe(2);
    expect(data.patientId).toBe(TEST_PATIENT_ID);
    expect(patientService.fetchEligibleDevices).toHaveBeenCalledWith(TEST_PATIENT_ID);
  });

  it('should use provided patientId from query params', async () => {
    const mockDevices: Device[] = [];
    vi.mocked(patientService.fetchEligibleDevices).mockResolvedValue(mockDevices);

    const customPatientId = 'custom-patient-123';
    const request = new NextRequest(
      new URL(`http://localhost:3000/api/patients/devices?patientId=${customPatientId}`)
    );

    await GET(request);

    expect(patientService.fetchEligibleDevices).toHaveBeenCalledWith(customPatientId);
  });

  it('should handle errors and return error response', async () => {
    // Mock service to throw error
    const errorMessage = 'API connection failed';
    vi.mocked(patientService.fetchEligibleDevices).mockRejectedValue(
      new Error(errorMessage)
    );

    const request = new NextRequest(
      new URL('http://localhost:3000/api/patients/devices')
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error.message).toBe(errorMessage);
  });

  it('should return empty array when no devices are eligible', async () => {
    vi.mocked(patientService.fetchEligibleDevices).mockResolvedValue([]);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/patients/devices')
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual([]);
    expect(data.count).toBe(0);
  });
});
