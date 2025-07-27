// User data management
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
export const setToken = (token) => {
  sessionStorage.setItem('token', token);
};

export const getToken = () => {
  return sessionStorage.getItem('token');
};

export const removeToken = () => {
  sessionStorage.removeItem('token');
};

// Auth check - checks for token and user data
export const isAuthenticated = () => {
  const token = getToken();
  const userData = getUserData();
  return !!token && !!userData;
};

// Role check - gets role from user data
export const hasRole = (requiredRole) => {
  const userData = getUserData();
  return userData?.role === requiredRole;
};

// Clear all auth data
export const clearAuth = () => {
  removeToken();
  removeUserData();
}; 