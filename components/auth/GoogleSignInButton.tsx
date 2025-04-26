import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { Alert, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import GoogleLogo from "@/components/svgIcons/signin-signup/GoogleLogo";
import { getSpringPort } from "@/constants/apiConfig";
import { storeToken, storeUserId } from "@/constants/auth";
import { useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

interface BackendAuthResponse {
  accessToken: string;
  id: string | number;
  username: string;
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const redirectUri = makeRedirectUri({
    native: "com.yourcompany.yourapp:/redirect", // For standalone iOS/Android
    path: "redirect",
  });

  console.log("Using Redirect URI:", redirectUri); // Verify this matches Google Cloud!

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "195447108077-6g10qjd8mj68n2cqqjknoofohhli8mgr.apps.googleusercontent.com",
    iosClientId:
      "195447108077-l5a0nsv3cmj0hgh852q5ohrh67kk7fs8.apps.googleusercontent.com",
    androidClientId:
      "195447108077-d3dkkf2tc9mchvsrem8dhdie1kloe0mo.apps.googleusercontent.com",
    redirectUri,
    scopes: ["openid", "profile", "email"],
  });

  useEffect(() => {
    const processResponse = async () => {
      if (response?.type !== "success") {
        if (response?.type === "error") {
          console.error("Google Auth Error:", response.error);
          Alert.alert(
            "Authentication Error",
            response.error?.message || "Failed to authenticate with Google"
          );
        }
        return;
      }

      const token = response.authentication?.accessToken;
      if (!token) {
        Alert.alert("Error", "No access token received");
        return;
      }

      try {
        setLoading(true);
        await handleGoogleSignIn(token);
      } catch (error) {
        console.error("Google sign-in failed:", error);
        Alert.alert("Error", "Failed to authenticate with Google");
      } finally {
        setLoading(false);
      }
    };

    processResponse();
  }, [response]);

  const handleGoogleSignIn = async (token: string) => {
    try {
      const apiUrl = await getSpringPort();

      // Get user info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error("Failed to fetch user info from Google");
      }

      const userInfo: GoogleUserInfo = await userInfoResponse.json();
      const username = userInfo.email.split("@")[0];

      // Send to your backend
      const backendResponse = await fetch(`${apiUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email: userInfo.email,
          name: userInfo.name,
          googleId: userInfo.sub,
          profilePicture: userInfo.picture,
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Google authentication failed on backend"
        );
      }

      const backendData: BackendAuthResponse = await backendResponse.json();

      // Store the token and user ID
      await Promise.all([
        storeToken(backendData.accessToken),
        storeUserId(backendData.id.toString()),
      ]);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      Alert.alert(
        "Authentication Error",
        error.message || "Failed to sign in with Google"
      );
      throw error;
    }
  };

  return (
    <TouchableOpacity
      className="flex-row justify-center items-center pt-10"
      onPress={() => {
        if (!loading) {
          promptAsync();
        }
      }}
      disabled={!request || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <>
          <GoogleLogo />
          <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "500" }}>
            Continue with Google
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
