import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

console.log('BASE_URL', BASE_URL);
let tokenCache: string | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(newToken: string) => void> = [];

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const subscribeTokenRefresh = (callback: (newToken: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post(`${BASE_URL}/refresh`, {
    refreshToken,
  });

  const { access_token, refreshToken: newRefreshToken } = response.data;

  localStorage.setItem('authToken', access_token);
  localStorage.setItem('refreshToken', newRefreshToken);

  tokenCache = access_token;

  return access_token;
};

apiClient.interceptors.request.use(
  (config) => {
    if (!tokenCache) {
      tokenCache = localStorage.getItem('authToken');
    }

    if (tokenCache) {
      config.headers.Authorization = `Bearer ${tokenCache}`;
    }
    console.log('Request sent:', config);
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  async (error) => {
    console.error('Error in response:', error);

    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      console.log('Unauthorized! Attempting token refresh...');

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          isRefreshing = false;
          onTokenRefreshed(newToken);
        } catch (refreshError) {
          isRefreshing = false;
          console.error('Failed to refresh token:', refreshError);

          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
