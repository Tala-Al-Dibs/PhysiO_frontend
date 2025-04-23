// src/context/AuthContext.tsx
import {
  useState,
  createContext,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

interface User {
  id: string;
  username: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const loadAuthState = async () => {
      const storedToken = await SecureStore.getItemAsync("authToken");
      const storedUser = await SecureStore.getItemAsync("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    loadAuthState();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Login failed");

      const data = await response.json();
      await storeAuthData(data.token, { id: data.id, username: data.username });
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Login Error",
        error instanceof Error ? error.message : "Failed to login"
      );
    }
  };

  const googleLogin = async () => {
    try {
      // Open Google OAuth in browser and redirect back to your backend
      const result = await WebBrowser.openAuthSessionAsync(
        "http://localhost:8080/api/oauth2/authorization/google",
        "yourapp://oauthredirect" // Your custom scheme
      );

      if (result.type === "success") {
        // Extract token from the redirect URL
        const url = new URL(result.url);
        const token = url.searchParams.get("token");

        if (token) {
          // Verify token with your backend
          const userResponse = await fetch(
            "http://your-backend-url/api/auth/user",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (userResponse.ok) {
            const userData = await userResponse.json();
            await storeAuthData(token, userData);
            router.replace("/(tabs)");
          }
        }
      }
    } catch (error) {
      Alert.alert("Google Login Error", "Failed to login with Google");
    }
  };

  const storeAuthData = async (token: string, user: User) => {
    await SecureStore.setItemAsync("authToken", token);
    await SecureStore.setItemAsync("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("user");
    setToken(null);
    setUser(null);
    router.replace("/(app)");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isLoading, login, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
