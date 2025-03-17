import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { useRouter } from "expo-router";
import LoadinfScreen from "./LoadingScreen";
import LoadingScreen from "./LoadingScreen";
import * as Network from "expo-network";
import { FASTAPIPORT8000, SPRINGPORT8080, TOKEN } from "@/constants/apiConfig";

const API_URL = SPRINGPORT8080 + "/api/reports";
const SPRINGURL = SPRINGPORT8080; // Replace with your actual API base URL
const IP = "192.168.1.117";
const USER_ID = 1; // Replace with the dynamic user ID
const ngrokLink = FASTAPIPORT8000;

const getLocalIP = async () => {
  try {
    const ip = await Network.getIpAddressAsync();
    console.log("Device Local IP:", ip);
    return ip;
  } catch (error) {
    console.error("Failed to get local IP:", error);
    return null;
  }
};

const PhotoPreviewSection = ({
  photo,
  handleRetakePhoto,
  scanType,
}: {
  photo: CameraCapturedPicture;
  handleRetakePhoto: () => void;
  scanType: string;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [apiBaseURL, setApiBaseURL] = useState("");

  useEffect(() => {
    (async () => {
      const localIP = await getLocalIP();
      if (localIP) {
        setApiBaseURL(`http://${localIP}:8000`); // Set FastAPI base URL dynamically
      }
    })();
  }, []);

  const uploadImage = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Append the report part with an empty JSON object
      formData.append("report", {
        uri: "data:application/json;base64," + btoa(JSON.stringify({})),
        name: "report.json",
        type: "application/json",
      } as any);

      // Append the image file
      formData.append("image", {
        uri: photo.uri,
        name: "image.jpg",
        type: "image/jpeg",
      } as any);

      console.log("Uploading image...");

      const response = await fetch(`${API_URL}/${USER_ID}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: "application/json",
        },
        body: formData,
      });

      const responseData = await response.json();
      console.log("Upload response:", responseData);

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      // Step 2: Get the image URL from the response
      const imageUrl = responseData.image.url;
      console.log("Image URL:", imageUrl);

      // Step 3: Send the image URL to the FastAPI backend
      const problemResponse = await fetch(`${ngrokLink}/detect-problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_uri: imageUrl, scan_type: scanType }),
      });

      const problemData = await problemResponse.json();
      console.log("Problem Detection Response:", problemData);

      // Step 3: Process problems and save them for the user
      for (const fullProblemName of problemData.problems) {
        const problemName = fullProblemName.split(":")[0].trim(); // Extract name before ":"

        console.log(`Fetching problem ID for: ${problemName}`);

        // Get problem ID from Spring Boot API
        const problemIdResponse = await fetch(
          `${SPRINGURL}/api/problems/name/${encodeURIComponent(problemName)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        if (!problemIdResponse.ok) {
          console.error(`Failed to fetch problem ID for: ${problemName}`);
          continue;
        }

        const problemIdData = await problemIdResponse.json();
        const problemId = problemIdData.problemID;
        console.log(`Problem ID for ${problemName}: ${problemId}`);

        // Step 4: Save problem to user
        console.log(`Saving problem ${problemId} to user ${USER_ID}`);

        const saveProblemResponse = await fetch(
          `${SPRINGURL}/api/problems/user/${USER_ID}/add-problem/${problemId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        if (!saveProblemResponse.ok) {
          console.error(
            `Failed to save problem ${problemId} for user ${USER_ID}`
          );
        } else {
          console.log(`Problem ${problemId} saved for user ${USER_ID}`);
        }
      }
      if (problemResponse.ok) {
        // Step 4: Navigate to the problem page and pass detected problems
        router.push({
          pathname: "../(problem)/report",
          params: {
            problems: JSON.stringify(problemData.problems),
            image_url: imageUrl,
          },
        });
      } else {
        throw new Error(`Problem detection failed: ${problemResponse.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to upload image or detect problems.");
    } finally {
      setLoading(false); // ✅ Ensure loading stops
    }
  };

  if (loading) {
    return <LoadingScreen photo={photo} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <Image style={styles.previewConatiner} source={{ uri: photo.uri }} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
          <Feather name="x" size={40} color="#FF4E33" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={uploadImage}>
          <Feather name="check" size={40} color="#0CA7BD" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    borderRadius: 15,
    padding: 1,
    width: "95%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  previewConatiner: {
    width: "100%",
    height: "95%",
    borderRadius: 15,
    paddingTop: 20,
  },
  buttonContainer: {
    marginTop: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },
  button: {
    borderRadius: 50,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
});

export default PhotoPreviewSection;
