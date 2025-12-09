import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { notification } from 'antd';
import { useAuthStore } from "../store/auth"; // Corrected path based on your store file

// --- Type definition for the queued promises ---
interface QueuedPromise {
    resolve: (value: string) => void; // Resolve with the new access token (string)
    reject: (reason?: AxiosError) => void;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://13.233.37.21:5188",
  withCredentials: true, 
});

// --- State for Token Refresh Handling (outside of the client) ---
let isRefreshing = false;
let failedQueue: QueuedPromise[] = [];

// Function to process the queue after token refresh is complete
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      // Resolve the promise with the new token so the request can be retried
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 1. REQUEST INTERCEPTOR (Adds Token) ---
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken; 
    if (token) {
      // Prevent sending the access token to the refresh endpoint itself
      if (!config.url?.endsWith('/api/auth/refresh')) { 
          config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 2. RESPONSE INTERCEPTOR (Token Refresh and Retry Logic) ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    // Cast config to include our custom properties
    const originalRequest = error.config as InternalAxiosRequestConfig & { 
      'axios-retry-count'?: number; 
      _retry?: boolean; // Used by the token refresh logic
    };
    const authStore = useAuthStore.getState();

    // ------------------------------------
    // 🅰️ Token Refresh Logic (Handles 401)
    // ------------------------------------
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If no refresh token exists, log out and notify immediately
      if (!authStore.refreshToken) {
        authStore.clearAuth();
        notification.error({ 
            title: 'Authentication Failed', 
            description: 'Your session has expired. Please log in again.',
            duration: 4.5
        });
        return Promise.reject(error);
      }

      // 1. If we are already refreshing, queue the current failed request
      if (isRefreshing) {
        // We type the promise resolution value as string (the new access token)
        return new Promise<string>(function(resolve, reject) {
          failedQueue.push({ resolve, reject } as QueuedPromise);
        })
        .then(token => {
          // Retry the request with the new token
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return apiClient(originalRequest);
        })
        .catch(err => {
          // If refresh failed while we were waiting, propagate the failure
          return Promise.reject(err);
        });
      }

      // 2. Start the refresh process
      originalRequest._retry = true; // Mark as retried once for 401
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post<{ accessToken: string; refreshToken?: string }>( // Explicitly typing the response data
          `${originalRequest.baseURL}/api/auth/refresh`, // 💡 ADJUST ENDPOINT URL
          { refreshToken: authStore.refreshToken },
          { withCredentials: true }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

        // Update the store with the new access token and the new refresh token (if present)
        authStore.setTokens({ 
            accessToken: newAccessToken, 
            refreshToken: newRefreshToken 
        });

        // Process the queue with the new access token
        processQueue(null, newAccessToken);
        
        // Retry the original request
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return apiClient(originalRequest);

      } catch (refreshError) {
        // If refresh fails (e.g., refresh token is also invalid)
        authStore.clearAuth();
        processQueue(refreshError as AxiosError);
        notification.error({ // 🚨 ANTD NOTIFICATION
            title: 'Session Expired', 
            description: 'Failed to refresh token. Please log in.',
            duration: 4.5
        });
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ------------------------------------
    // 🅱️ Transient Network Retry Logic (Handles other errors)
    // ------------------------------------
    const shouldRetry = (
      error.code === 'ECONNABORTED' || // Timeout
      error.code === 'ERR_NETWORK' || // Network issues
      error.response?.status === 500 // Server errors
    );
    
    const currentRetryCount = originalRequest['axios-retry-count'] || 0;
    const MAX_RETRIES = 3; 

    if (shouldRetry && currentRetryCount < MAX_RETRIES) {
        originalRequest['axios-retry-count'] = currentRetryCount + 1;
        
        // Exponential backoff: 1s, 2s, 4s delay
        const delay = Math.pow(2, currentRetryCount) * 1000;
        
        console.warn(`Retrying request: ${originalRequest.url} (Attempt ${currentRetryCount + 1}) after ${delay / 1000}s`);

        return new Promise((resolve) => {
            // Delay the re-execution of the original request
            setTimeout(() => resolve(apiClient(originalRequest)), delay);
        });
    }

    // For any unhandled error status (e.g., 400, 403, 404, 503 after max retries)
    return Promise.reject(error);
  }
);