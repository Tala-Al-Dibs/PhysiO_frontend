import { getApiUrl, getUserId as getStoredUserId, getToken as getStoredToken } from './auth';

export const SPRINGPORT8080 = "http://192.168.88.7:8080";
export const FASTAPIPORT8000 = "https://a9af-84-242-56-27.ngrok-free.app";

export const getSpringPort = async (): Promise<string> => {
  return (await getApiUrl()) || SPRINGPORT8080;
};

export const getFastApiPort = (): string => {
  return FASTAPIPORT8000;
};

export const getCurrentUserId = async (): Promise<string | null> => {
  return await getStoredUserId();  
};

export const getCurrentToken = async (): Promise<string | null> => {
  return await getStoredToken(); 
};