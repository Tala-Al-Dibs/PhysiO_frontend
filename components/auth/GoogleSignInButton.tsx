import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { Alert, TouchableOpacity } from "react-native";
import GoogleLogo from "@/components/svgIcons/signin-signup/GoogleLogo";
import { getSpringPort } from "@/constants/apiConfig";
import { storeToken, storeUserId } from "@/constants/auth";
import { useRouter } from "expo-router";
import { makeRedirectUri } from "expo-auth-session";
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignInButton() {
  const router = useRouter();
  const redirectUri = makeRedirectUri({
    useProxy: true,
  } as any);

  console.log("Generated Redirect URI:", redirectUri);

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

  console.log(makeRedirectUri());
  useEffect(() => {
    const processResponse = async () => {
      if (response?.type !== "success") return;

      const token = response.authentication?.accessToken;
      if (!token) {
        Alert.alert("Error", "No access token received");
        return;
      }

      try {
        await handleGoogleSignIn(token);
      } catch (error) {
        console.error("Google sign-in failed:", error);
        Alert.alert("Error", "Failed to authenticate with Google");
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

      const userInfo = await userInfoResponse.json();
      const username = userInfo.email.split("@")[0];

      // Send to your backend
      const backendResponse = await fetch(`${apiUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
        }),
      });

      if (!backendResponse.ok) {
        throw new Error("Google authentication failed");
      }

      const backendData = await backendResponse.json();

      // Store the token and user ID
      await Promise.all([
        storeToken(backendData.accessToken),
        storeUserId(backendData.id.toString()),
      ]);

      // Navigate to main app
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Google sign-in error:", error);
      Alert.alert("Authentication Error", "Failed to sign in with Google");
    }
  };

  return (
    <TouchableOpacity
      className="flex-row justify-center pt-10"
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <GoogleLogo />
    </TouchableOpacity>
  );
}
