/**
 * Next.js API Route: GET /api/patients/devices
 * Fetches eligible devices for a patient from external API
 *
 * This server-side route acts as a secure proxy to the external API,
 * keeping API keys secure and never exposing them to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchEligibleDevices } from '@/services/patient-service';
import { TEST_PATIENT_ID } from '@/lib/constants';
import { isAPIError, getErrorMessage } from '@/lib/api/errors';

/**
 * GET handler for /api/patients/devices
 * Query params:
 *   - patientId (optional): Patient ID to fetch devices for. Defaults to TEST_PATIENT_ID
 */
export async function GET(request: NextRequest) {
  try {
    // Extract patientId from query params (or use test ID)
    const searchParams = request.nextUrl.searchParams;
    const patientId = searchParams.get('patientId') || TEST_PATIENT_ID;

    // Fetch eligible devices
    const devices = await fetchEligibleDevices(patientId);

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: devices,
        patientId,
        count: devices.length,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error('Error fetching eligible devices:', error);

    // Determine appropriate status code
    let statusCode = 500;
    if (isAPIError(error)) {
      statusCode = error.statusCode || 500;
    }

    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: {
          message: getErrorMessage(error),
          code: isAPIError(error) ? error.name : 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: statusCode }
    );
  }
}
