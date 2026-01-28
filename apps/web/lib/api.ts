/**
 * API Client with automatic JWT token attachment
 * Base wrapper for all backend API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get JWT token from localStorage
   * Note: localStorage is client-side only, not available during SSR
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  /**
   * Set JWT token in localStorage
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Remove JWT token from localStorage
   */
  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  /**
   * Generic fetch wrapper with automatic token attachment
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Attach Bearer token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // Backend returns error as object with {code, message} structure
        let errorMessage = 'An error occurred';
        
        if (data.error) {
          // If error is an object with message property
          if (typeof data.error === 'object' && data.error.message) {
            errorMessage = data.error.message;
          } 
          // If error is a string
          else if (typeof data.error === 'string') {
            errorMessage = data.error;
          }
        } 
        // Fallback to data.message if no error property
        else if (data.message) {
          errorMessage = data.message;
        }
        
        return {
          error: errorMessage,
        };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiClient(API_BASE_URL);

// Export types for API responses
export interface User {
  _id: string;
  email: string;
  name: string;
  isVerified: boolean;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Deal {
  _id: string;
  title: string;
  slug: string;
  description: string;
  partnerName: string;
  category: string;
  accessLevel: 'public' | 'locked';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  userId: string;
  dealId: string | Deal;
  status: 'pending' | 'approved' | 'rejected';
  claimedAt: string;
  createdAt: string;
  updatedAt: string;
}
