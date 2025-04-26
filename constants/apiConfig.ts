import {
  getApiUrl,
  getUserId as getStoredUserId,
  getToken as getStoredToken,
} from "./auth";

export const SPRINGPORT8080 = "https://6e17-37-76-220-126.ngrok-free.app";
export const FASTAPIPORT8000 = "https://96fb-37-76-220-126.ngrok-free.app";

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
