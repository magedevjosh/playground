/**
 * HTTP client wrapper for making API requests
 * Provides centralized configuration, error handling, and type safety
 */

import { API_CONFIG } from '@/lib/constants';
import {
  APIError,
  NetworkError,
  AuthError,
  NotFoundError,
  ServerError,
  ValidationError,
} from '@/lib/api/errors';

/**
 * Request configuration options
 */
export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

/**
 * API Response wrapper
 */
export interface APIResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

/**
 * Creates an AbortController with timeout
 */
function createTimeoutSignal(timeout: number): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return controller.signal;
}

/**
 * Builds query string from params object
 */
function buildQueryString(params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    query.append(key, String(value));
  });

  return `?${query.toString()}`;
}

/**
 * Handles API response errors based on status code
 */
async function handleErrorResponse(response: Response): Promise<never> {
  let errorMessage = `Request failed with status ${response.status}`;
  let errorData: unknown;

  try {
    errorData = await response.json();
    if (errorData && typeof errorData === 'object' && 'message' in errorData) {
      errorMessage = String(errorData.message);
    }
  } catch {
    // Response body is not JSON, use status text
    errorMessage = response.statusText || errorMessage;
  }

  // Throw appropriate error based on status code
  switch (response.status) {
    case 400:
      throw new ValidationError(errorMessage);
    case 401:
    case 403:
      throw new AuthError(errorMessage);
    case 404:
      throw new NotFoundError(errorMessage);
    case 500:
    case 502:
    case 503:
    case 504:
      throw new ServerError(errorMessage, response.status);
    default:
      throw new APIError(errorMessage, response.status, errorData);
  }
}

/**
 * Makes an HTTP request with error handling and type safety
 */
async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<APIResponse<T>> {
  const {
    params,
    timeout = API_CONFIG.TIMEOUT,
    headers = {},
    signal,
    ...restConfig
  } = config;

  // Build URL with query parameters
  const queryString = buildQueryString(params);
  const url = `${API_CONFIG.BASE_URL}${endpoint}${queryString}`;

  // Merge timeout signal with provided signal if any
  const timeoutSignal = createTimeoutSignal(timeout);
  const mergedSignal = signal
    ? (() => {
        const controller = new AbortController();
        signal.addEventListener('abort', () => controller.abort());
        timeoutSignal.addEventListener('abort', () => controller.abort());
        return controller.signal;
      })()
    : timeoutSignal;

  // Prepare request headers
  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_CONFIG.API_KEY}`,
    ...headers,
  };

  try {
    const response = await fetch(url, {
      ...restConfig,
      headers: requestHeaders,
      signal: mergedSignal,
    });

    // Handle error responses
    if (!response.ok) {
      await handleErrorResponse(response);
    }

    // Parse successful response
    const data = await response.json();

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    // Handle network errors (timeout, connection failure, etc.)
    if (error instanceof TypeError || (error as Error).name === 'AbortError') {
      throw new NetworkError(
        'Network request failed. Please check your connection and try again.'
      );
    }

    // Re-throw API errors
    throw error;
  }
}

/**
 * HTTP client with common methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'GET' });
  },

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<APIResponse<T>> {
    return request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<APIResponse<T>> {
    return request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return request<T>(endpoint, { ...config, method: 'DELETE' });
  },

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<APIResponse<T>> {
    return request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
};
