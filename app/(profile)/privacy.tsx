import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import {
  SPRINGPORT8080,
  getCurrentToken,
  getCurrentUserId,
} from "@/constants/apiConfig";

const ChangePasswordScreen = () => {
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [previousSecureTextEntry, setPreviousSecureTextEntry] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const API_URL = SPRINGPORT8080 + "/api/";
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getCurrentToken();
        const id = await getCurrentUserId();
        setBearerToken(token);
        setUserId(Number(id)); // Convert to number if needed
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!bearerToken || !userId) return;

        const response = await fetch(`${API_URL}users/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [bearerToken, userId]); // Add dependencies

  const handleChangePassword = async () => {
    try {
      if (!bearerToken || !userId) {
        throw new Error("Authentication token or user ID is missing.");
      }

      if (!user?.userID) {
        throw new Error("User ID is missing.");
      }
      // Step 1: Validate previous password
      // Step 1: Validate previous password
      const validateResponse = await fetch(
        `${API_URL}users/validate-password`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userID,
            password: previousPassword,
          }),
        }
      );

      if (!validateResponse.ok) {
        const validateData = await validateResponse.json();
        throw new Error(
          validateData.message || "Previous password is incorrect."
        );
      }

      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirm password do not match.");
      }

      // Step 3: Update password
      const updateResponse = await fetch(`${API_URL}users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          password: newPassword,
        }),
      });

      if (!updateResponse.ok) {
        const updateData = await updateResponse.json();
        throw new Error(updateData.message || "Failed to update password.");
      }

      Alert.alert("Success", "Your password has been updated successfully.");
      router.push("../(tabs)/profile");
    } catch (error) {
      console.error("Error:", error); // Log the full error object
      Alert.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/password.png")}
        style={styles.icon}
      />
      <Text style={styles.title}>SET YOUR NEW PASSWORD</Text>
      <Text style={styles.subtitle}>
        Your new password should be different from passwords previously used.
      </Text>

      {/* Previous Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Previous Password"
          secureTextEntry={previousSecureTextEntry}
          value={previousPassword}
          onChangeText={setPreviousPassword}
        />
        <TouchableOpacity
          onPress={() => setPreviousSecureTextEntry(!previousSecureTextEntry)}
        >
          <Ionicons
            name={previousSecureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={secureTextEntry}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={confirmSecureTextEntry}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
        >
          <Ionicons
            name={confirmSecureTextEntry ? "eye-off" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>CONFIRM</Text>
      </TouchableOpacity>
    </View>
  );
};
interface User {
  userID: number;
  username: string;
  password: string;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  icon: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0E7E94",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: "100%",
    padding: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 12,
  },
  button: {
    backgroundColor: "#0E7E94",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ChangePasswordScreen;
