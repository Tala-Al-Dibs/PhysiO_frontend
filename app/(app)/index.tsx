import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomKeyboardView from "@/components/CustomKeyboardView";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import "../../global.css";
import GoogleLogo from "@/components/svgIcons/signin-signup/GoogleLogo";
import LogoSvg from "@/components/svgIcons/logo/LogoSvg";
import { storeToken, storeUserId } from "@/constants/auth";
import { getCurrentToken, getSpringPort } from "@/constants/apiConfig";

export default function IntroScreen() {
  const router = useRouter();
  const userRef = useRef("");
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSignIn = async () => {
    if (!userRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please fill all the fields");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = await getSpringPort(); // Use your getSpringPort function
      const response = await fetch(`${apiUrl}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userRef.current,
          password: passwordRef.current,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user ID from the response
        await storeToken(data.accessToken); // Changed from data.jwt to data.accessToken
        await storeUserId(data.id.toString()); // Ensure ID is string

        // Optional: Verify the token was stored
        const storedToken = await getCurrentToken();

        // Navigate to the main app screen
        router.push("../(tabs)");
      } else {
        // Handle error
        Alert.alert(
          "Sign In Failed",
          data.message || "Invalid username or password"
        );
      }
    } catch (error) {
      console.error("SignIn error:", error);
      Alert.alert(
        "Error",
        "An error occurred during sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/sign up.png")} // Replace with your image path
      style={styles.background}
    >
      <TouchableWithoutFeedback>
        <CustomKeyboardView>
          <StatusBar style="dark" />

          <View
            style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
            className="flex-1 gap-1"
          >
            <View className="items-center"></View>
            <View className="gap-10">
              <View
                style={{ paddingHorizontal: wp(5) }}
                className="flex-1 justify-end items-start pt-20"
              >
                <LogoSvg />
              </View>

              <View className="flex-1 gap-2 pl-2">
                <Text
                  style={{ fontSize: hp(5), color: "#0B96AA" }}
                  className="font-bold tracking-wider text-start "
                >
                  Welcome Back!
                </Text>
                <Text
                  style={{ fontSize: hp(2), color: "#383838" }}
                  className="font-light tracking-wider text-start "
                >
                  We are so happy you are back!
                </Text>
              </View>
              {/* inputs */}
              <View className="gap-4 flex-1">
                <View
                  style={{ height: hp(7) }}
                  className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl"
                >
                  <Feather name="user" size={hp(2.7)} color="gray" />
                  <TextInput
                    onChange={(e) => (userRef.current = e.nativeEvent.text)}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-700"
                    placeholder="Username"
                    placeholderTextColor={"gray"}
                  />
                </View>

                <View className="gap-3">
                  <View
                    style={{ height: hp(7) }}
                    className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl"
                  >
                    <Feather name="lock" size={hp(2.7)} color="gray" />
                    <TextInput
                      secureTextEntry={!passwordVisible}
                      onChange={(e) =>
                        (passwordRef.current = e.nativeEvent.text)
                      }
                      style={{ fontSize: hp(2) }}
                      className="flex-1 font-semibold text-neutral-700"
                      placeholder="Password"
                      placeholderTextColor={"gray"}
                    />
                    <TouchableOpacity
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Feather
                        name={passwordVisible ? "eye" : "eye-off"}
                        size={hp(2.7)}
                        color="gray"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{ fontSize: hp(1.8) }}
                    className="text-right font-semibold text-neutral-500"
                  >
                    Forgot passeord?
                  </Text>
                </View>

                <View>
                  <TouchableOpacity
                    onPress={handleSignIn}
                    style={[{ height: hp(6.5) }, styles.SignInButton]}
                    className="rounded-xl justify-center items-center"
                    disabled={loading}
                  >
                    <Text
                      style={{ fontSize: hp(2.7) }}
                      className="text-white font-bold tracking-wider"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* signup text */}
                <View className="flex-row">
                  <Text
                    style={{ fontSize: hp(1.8) }}
                    className="text-neutral-500 font-semibold"
                  >
                    Don't have an account?{" "}
                  </Text>
                  <Pressable onPress={() => router.replace("/SignUp")}>
                    <Text
                      style={[{ fontSize: hp(1.8) }, styles.SignUpText]}
                      className="font-bold"
                    >
                      Sign Up
                    </Text>
                  </Pressable>
                </View>
              </View>
              <View className="flex-row justify-center gap-5">
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#0CA7BD",
                    width: "41%",
                    marginVertical: 10,
                  }}
                />
                <Text style={styles.ortext}>OR</Text>
                <View
                  style={{
                    height: 1,
                    backgroundColor: "#0CA7BD",
                    width: "41%",
                    marginVertical: 10,
                  }}
                />
              </View>
            </View>
            <TouchableOpacity className="flex-row justify-center pt-10">
              <GoogleLogo />
            </TouchableOpacity>
          </View>
        </CustomKeyboardView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  SignInButton: {
    backgroundColor: "#0CA7BD",
  },
  SignUpText: {
    color: "#0CA7BD",
  },
  background: {
    flex: 1,
    resizeMode: "cover", // Makes sure the image covers the whole screen
    justifyContent: "center",
  },
  ortext: {
    color: "#0CA7BD",
  },
});
