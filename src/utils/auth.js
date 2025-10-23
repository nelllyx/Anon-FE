// Minimal client-side helpers. Server handles authentication via HTTP-only cookies.


export const getCookieNames = () => ({
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
});

export const hasRefreshCookie = () => {
  const { refreshToken } = getCookieNames();
  return document.cookie.includes(`${refreshToken}=`);
};

// Optional: store lightweight user info if backend returns it after login
export const setUserData = (userData) => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = () => {
  localStorage.removeItem('userData');
};

// Token management
export const setToken = () => {
  // Tokens are managed by the server via HTTP-only cookies
  console.log('Tokens managed via HTTP-only cookies');
};

export const getToken = () => {
  // Not accessible on client
  return null;
};

// Role helper based on locally cached user data (optional)
export const hasRole = (requiredRole) => {
  const userData = getUserData();
  return userData?.role === requiredRole;
};

// Clear all auth data
export const clearAuth = () => {
  removeUserData();
  window.location.href = '/login';
}; 

// Call backend logout to clear HTTP-only cookies, then clear client state
export const logout = async () => {
  try {
    await fetch('http://localhost:3000/api/v1/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    // ignore network errors; still clear client state
  } finally {
    clearAuth();
  }
};