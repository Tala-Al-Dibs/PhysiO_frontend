// utils/auth.ts
import * as SecureStore from 'expo-secure-store';

// Key for storing the token
const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';
const API_URL_KEY = 'api_url';

// Store token
export const storeToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

// Get token
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Add to your existing auth.ts
export const removeToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

export const removeUserId = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_ID_KEY);
};

export const clearAuthData = async (): Promise<void> => {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(USER_ID_KEY),
  ]);
};

// Store user ID
export const storeUserId = async (userId: string | number): Promise<void> => {
  await SecureStore.setItemAsync(USER_ID_KEY, userId.toString());
};

// Get user ID
export const getUserId = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(USER_ID_KEY);
};

// Store API URL
export const storeApiUrl = async (url: string): Promise<void> => {
  await SecureStore.setItemAsync(API_URL_KEY, url);
};

// Get API URL
export const getApiUrl = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(API_URL_KEY);
};