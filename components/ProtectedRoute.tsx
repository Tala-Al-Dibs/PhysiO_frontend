// src/components/ProtectedRoute.tsx
import { useAuth } from "@/app/context/AuthContextType";
import { Redirect, router } from "expo-router";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/(app)");
    }
  }, [isLoading, token]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!token) {
    return <Redirect href="/(app)" />;
  }

  return <>{children}</>;
}
