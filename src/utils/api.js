import {getCookieNames, hasRefreshCookie, logout} from './auth';

// Custom hook for making authenticated API requests
export const useAuthenticatedFetch = () => {
  return async (url, options = {}) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      credentials: 'include', // Include cookies for http-only tokens
    };

    try {
      let response = await fetch(url, config);

      if (response.status !== 401) {
        return response;
      }

      // 401: try refresh flow
      console.log('🚨 Received 401, attempting refresh...');
      const refreshed = await refreshToken();
      if (!refreshed) {
        // If there's no refresh cookie, log out immediately
        if (!hasRefreshCookie()) {
          console.log('🚪 No refresh cookie found, logging out...');
          await logout();
        }
        return response; // propagate original 401
      }

      // retry once after successful refresh
      console.log('🔄 Retrying original request after successful refresh...');
      response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };
};

// Function to refresh token using refresh token from cookie
export const refreshToken = async () => {
  try {
    const { refreshToken } = getCookieNames();
    console.log('🍪 Checking for refresh cookie:', refreshToken);
    console.log('🍪 Document cookies:', document.cookie);
    
    if (!document.cookie.includes(`${refreshToken}=`)) {
      console.log('❌ Refresh cookie not found');
      return false;
    }
    
    console.log('✅ Refresh cookie found, proceeding with refresh...');

    console.log('🔄 Attempting token refresh...');
    const response = await fetch('http://localhost:3000/api/v1/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('🔄 Refresh response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Token refresh successful');
      return true; // backend updates cookies
    }

    console.log('❌ Token refresh failed with status:', response.status);
    
    // If backend indicates no refresh token, auto-logout
    if (response.status === 401 || response.status === 403) {
      console.log('🚪 Auto-logout triggered due to refresh failure');
      await logout();
    }

    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
};

// Helper function to get the correct cookie name
// getCookieNames now lives in auth.js

// Debug function to check all cookies
export const debugCookies = () => {
  console.log('🍪 All cookies:', document.cookie);
  const cookieNames = getCookieNames();
  console.log('🍪 Cookie names:', cookieNames);
  console.log('🍪 Access token present:', document.cookie.includes(cookieNames.accessToken));
  console.log('🍪 Refresh token present:', document.cookie.includes(cookieNames.refreshToken));
  console.log('🍪 Has refresh cookie:', hasRefreshCookie());
};
