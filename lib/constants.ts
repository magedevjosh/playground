/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.PATIENT_API_BASE_URL || '',
  API_KEY: process.env.PATIENT_API_KEY || '',
  TIMEOUT: 30000, // 30 seconds
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  PATIENT_DEVICES: '/patients/devices',
  CUSTOMER_PRICING: '/customer/pricing',
} as const;

// Test/Demo Configuration
export const TEST_PATIENT_ID = 'demo-patient-12345';

// Feature Flags
export const FEATURES = {
  API_INTEGRATION_ENABLED:
    process.env.NEXT_PUBLIC_ENABLE_API_INTEGRATION === 'true',
} as const;
