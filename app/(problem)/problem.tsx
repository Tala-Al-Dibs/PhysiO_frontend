import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FASTAPIPORT8000,
  SPRINGPORT8080,
  TOKEN,
  USERID,
} from "@/constants/apiConfig";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import IconComponent from "@/components/svgIcons/problems/IconComponent";
import {
  CausesIcon,
  PreventionsIcon,
  SymptomsIcon,
} from "@/components/svgIcons/problems/ProblemDescriptionIcon";

const API_URL = SPRINGPORT8080 + "/api/problems/name/";
const userID = USERID;

export default function Problem() {
  const { problem } = useLocalSearchParams(); // Get problem name from URL
  const problemName = Array.isArray(problem) ? problem[0] : problem;
  const [problemData, setProblemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRouter();
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleStartExercise = async () => {
    try {
      // Check if the user already has this problem
      const userProblemsResponse = await fetch(
        `${SPRINGPORT8080}/api/problems/user/${userID}/problems`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      if (!userProblemsResponse.ok) {
        throw new Error("Failed to fetch user's problems.");
      }

      const userProblems = await userProblemsResponse.json();
      const problemExists = userProblems.some(
        (p: any) => p.problemID === problemData.problemID
      );

      if (!problemExists) {
        // Add problem to user if not already present
        const addProblemResponse = await fetch(
          `${SPRINGPORT8080}/api/problems/user/${userID}/add-problem/${problemData.problemID}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        if (!addProblemResponse.ok) {
          throw new Error("Failed to add problem to user.");
        }
      }

      // Navigate to problem progress page
      route.push({
        pathname: "./problemProgress",
        params: {
          problem: problemData.name,
          problemID: problemData.problemID,
        },
      });
    } catch (error) {
      console.error("Error handling problem:", error);
    }
  };

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        const response = await fetch(
          `${API_URL}${encodeURIComponent(problemName)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch problem details. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setProblemData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDetails();
  }, [problem]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#064D57" />
        <Text>Loading problem details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!problemData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No data found for this problem.</Text>
      </View>
    );
  }

  return (
    <View style={styles.pageContainer}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <View style={styles.headerContainer}>
            <Image
              source={{ uri: problemData.image.url }}
              style={styles.headerImage}
            />
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={30}
                color="white"
              />
            </TouchableOpacity>
          </View>
        }
      >
        <ScrollView style={styles.container}>
          {/* {problemData.image && (
          <Image source={{ uri: problemData.image.url }} style={styles.image} />
        )} */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginBottom: 15,
            }}
          >
            <IconComponent problem={problemData.name} />
            <Text style={styles.title}>{problemData.name}</Text>
          </View>
          <Text style={styles.description}>{problemData.description}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              gap: 9,
            }}
          >
            <CausesIcon />
            <Text style={styles.subtitle}>Causes</Text>
          </View>
          {problemData.causes.map((cause: string, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginLeft: 30,
              }}
            >
              <Octicons name="dot-fill" size={20} color="black" />
              <Text key={index} style={styles.listItem}>
                {cause}
              </Text>
            </View>
          ))}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              gap: 9,
            }}
          >
            <SymptomsIcon />
            <Text style={styles.subtitle}>Symptoms</Text>
          </View>
          {problemData.symptoms.map((symptom: string, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginLeft: 30,
              }}
            >
              <Octicons name="dot-fill" size={20} color="black" />
              <Text key={index} style={styles.listItem}>
                {symptom}
              </Text>
            </View>
          ))}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              gap: 9,
            }}
          >
            <PreventionsIcon />
            <Text style={styles.subtitle}>Prevention</Text>
          </View>
          {problemData.prevention.map((tip: string, index: number) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                marginLeft: 30,
              }}
            >
              <Octicons name="dot-fill" size={20} color="black" />
              <Text key={index} style={styles.listItem}>
                {tip}
              </Text>
            </View>
          ))}
          <View style={{ height: 65 }}></View>
        </ScrollView>
      </ParallaxScrollView>

      <TouchableOpacity
        style={styles.stickyButton}
        onPress={handleStartExercise}
      >
        <Text style={styles.buttonText}>Start Exercise</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    position: "relative",
  },
  headerContainer: {
    height: 280, // Allows the top half of the image to be visible
    overflow: "hidden",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerImage: {
    height: "100%",
    width: "auto",
    resizeMode: "cover",
  },
  closeButton: {
    position: "absolute",
    top: 40, // Adjust as needed for safe area
    left: 30,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    borderRadius: 50,
    padding: 3,
  },
  container: {
    flex: 1,
    marginTop: 10,
    // padding: 20,
    // backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#064D57",

    // textAlign: "center",
    // marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#064D57",
  },
  listItem: {
    fontSize: 16,
    color: "#444",
    marginLeft: 10,
    // marginTop: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  stickyButton: {
    position: "absolute",
    bottom: 30, // 20px from the bottom
    left: 20, // 20px from the left edge
    right: 20, // 20px from the right edge
    backgroundColor: "#0CA7BD",
    width: "90%",
    paddingVertical: 15,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
