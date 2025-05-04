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
import { getCurrentToken, SPRINGPORT8080 } from "@/constants/apiConfig";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import IconComponent from "@/components/svgIcons/problems/IconComponent";
import { PhysiotherapistIcon } from "@/components/svgIcons/problems/ProblemDescriptionIcon";
import { getCurrentUserId } from "@/constants/apiConfig";
const API_URL = SPRINGPORT8080 + "/api/problems/name/";
const API_URL2 = SPRINGPORT8080 + "/api/progresses";

export default function Problem() {
  const { problem, problemID } = useLocalSearchParams();
  const problemName = Array.isArray(problem) ? problem[0] : problem;
  const [problemData, setProblemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<number>(0);
  const navigation = useNavigation();
  const route = useRouter();
  const [token, setToken] = useState<string>(""); // Added token state
  const [id, setUserId] = useState<number | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const initializeToken = async () => {
      try {
        const id = await getCurrentUserId();
        const token = await getCurrentToken();
        if (token) {
          setToken(token);
        } else {
          setError("Authentication token not available");
        }
        if (id) {
          setUserId(Number(id));
        } else {
          setError("User ID not available");
        }
      } catch (err) {
        setError("Failed to initialize authentication");
      }
    };

    initializeToken();
  }, []);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      if (!token || !problem) return; // <--- ADD THIS GUARD

      try {
        const response = await fetch(
          `${API_URL}${encodeURIComponent(problemName)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
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
  }, [token, problem]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token || !problemID) {
        return; // Don't fetch if token or problemID not ready
      }
      try {
        const response = await fetch(
          `${API_URL2}/user/${id}/problem/${problemID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch progress. Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setProgressData(data.length);
        } else {
          console.error("Unexpected progress data format:", data);
          setProgressData(0);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load progress data");
      }
    };

    fetchProgress();
  }, [token, problemID]);

  const handleStartExercise = async () => {
    try {
      const response = await fetch(
        `${API_URL2}/user/${id}/problem/${problemID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            percentage: 0, // Ensure the correct key is used
          }),
        }
      );

      if (!response.ok) {
        console.log(
          `${SPRINGPORT8080}/api/progresses/user/${id}/problem/${problemID}`
        );
        throw new Error(
          `Failed to create progress. Status: ${response.status}`
        );
      }

      const progressData = await response.json(); // Get the response from API
      console.log("Progress Created:", progressData);

      // Navigate to problemExercises screen with problem details
      route.push({
        pathname: "./problemExercises",
        params: {
          problem: problemData.name,
          progressID: progressData.progressID, // Send only the problem name
        },
      });
    } catch (error) {
      console.error("Error creating progress:", error);
    }
  };

  const renderProgress = () => {
    const weeks = Array.from({ length: 4 }, (_, weekIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => dayIndex + 1)
    );

    return (
      <View style={styles.progressContainer}>
        {weeks.map((week, weekIndex) => {
          const completedDays = progressData - weekIndex * 7;
          const weekCompleted = completedDays >= 7;

          return (
            <View key={weekIndex} style={styles.weekContainer}>
              {/* Week Label */}
              <Text style={styles.weekLabel}>Week {weekIndex + 1}</Text>

              {/* Row 1: Days 1-4 */}
              <View style={styles.weekRow}>
                {week.slice(0, 4).map((day) => {
                  const absoluteDay = weekIndex * 7 + day; // Overall progress tracking
                  return (
                    <View
                      key={day}
                      style={[
                        styles.dayCircle,
                        absoluteDay <= progressData
                          ? {
                              backgroundColor: "rgba(12, 167, 189, 0.23)",
                              borderColor: "#0CA7BD",
                              borderWidth: 2,
                            } // Progress days
                          : { borderColor: "#CCCCCC", borderWidth: 2 }, // No progress
                      ]}
                    >
                      <Text style={styles.dayText}>{day}</Text>
                    </View>
                  );
                })}
              </View>

              {/* Row 2: Prize + Days 5-7 */}
              <View style={styles.weekRow}>
                <View
                  style={[
                    styles.prizeCircle,
                    weekCompleted
                      ? {
                          backgroundColor: "#FFD700",
                          borderColor: "#B8860B",
                          borderWidth: 2,
                        }
                      : { borderColor: "#CCCCCC", borderWidth: 2 },
                  ]}
                >
                  <View>
                    {weekCompleted ? (
                      <Image
                        source={require("@/assets/images/PrizeWon.png")}
                        style={{ width: 53, height: 53, resizeMode: "contain" }}
                      />
                    ) : (
                      <Image
                        source={require("@/assets/images/PrizeDefault.png")}
                        style={{ width: 53, height: 53, resizeMode: "contain" }}
                      />
                    )}
                  </View>
                </View>
                {week
                  .slice(4, 7)
                  .reverse()
                  .map((day) => {
                    const absoluteDay = weekIndex * 7 + day;
                    return (
                      <View
                        key={day}
                        style={[
                          styles.dayCircle,
                          absoluteDay <= progressData
                            ? {
                                backgroundColor: "rgba(12, 167, 189, 0.23)",
                                borderColor: "#0CA7BD",
                                borderWidth: 2,
                              }
                            : { borderColor: "#CCCCCC", borderWidth: 2 },
                        ]}
                      >
                        <Text style={styles.dayText}>{day}</Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

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

          <TouchableOpacity
            style={styles.PhysiotherapContainer}
            onPress={() => route.push("../(physiotherapist)/physiotherapistsN")}
          >
            <View style={styles.PhysiotherapContainerIcon}>
              <PhysiotherapistIcon />
              <Text style={styles.PhysiotherapText}>Find Physiotherapist</Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={37}
              color="rgba(12, 167, 189, 0.59)"
              //   style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <Text
            style={{
              paddingTop: 15,
              fontSize: 24,
              fontWeight: "bold",
              color: "#0CA7BD",
            }}
          >
            Start your treatment plan!
          </Text>
          {renderProgress()}

          <View style={{ height: 65 }}></View>
        </ScrollView>
      </ParallaxScrollView>
      {/* <TouchableOpacity
        style={styles.stickyButton}
        onPress={() =>
          route.push({
            pathname: "./problemExercises",
            params: {
              problem: problemData.name, // Send only the problem name
            },
          })
        }
      >
        <Text style={styles.buttonText}>Start Exercise</Text>
      </TouchableOpacity> */}
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
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    marginBottom: 15,
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
  PhysiotherapText: {
    color: "rgba(12, 167, 189, 0.75)",
    fontSize: 18,
  },
  PhysiotherapContainerIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  PhysiotherapContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(12, 167, 189, 0.23)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    marginVertical: 15,
  },
  progressContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  weekContainer: {
    alignItems: "center",
    marginBottom: 20,
    gap: 20,
  },
  weekLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 60,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  prizeCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: "center",
    justifyContent: "center",
  },
  prizeText: {
    fontSize: 20,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333", // Dark text for visibility
    textAlign: "center",
  },
});
