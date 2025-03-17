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
import { FASTAPIPORT8000, SPRINGPORT8080, TOKEN } from "@/constants/apiConfig";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useNavigation } from "@react-navigation/native";
import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import IconComponent from "@/components/svgIcons/problems/IconComponent";
import {
  CausesIcon,
  PhysiotherapistIcon,
  PreventionsIcon,
  SymptomsIcon,
} from "@/components/svgIcons/problems/ProblemDescriptionIcon";
import {
  DurationSumIcon,
  ExerciseNumberIcon,
} from "@/components/svgIcons/progress/progressExercisesIcons";

const API_URL = SPRINGPORT8080 + "/api/problems/name/";
const API_PROGRESS_EXERCISES = SPRINGPORT8080 + "/api/progresses/";

interface Exercise {
  exerciseID: number;
  image: { url: string };
  exerciseDescription: string;
}

export default function ProblemExercise() {
  const userID = 1;
  const { problem, progressID } = useLocalSearchParams(); // Get problem name from URL
  const problemName = Array.isArray(problem) ? problem[0] : problem;
  const [problemData, setProblemData] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [progressSize, setProgressSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRouter();
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  useEffect(() => {
    if (!progressID) return;

    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `${API_PROGRESS_EXERCISES}${progressID}/exercises`,
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
            `Failed to fetch exercises. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setExercises(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchExercises();
  }, [progressID]);

  useEffect(() => {
    if (!userID || !problemData) return;

    const fetchProgress = async () => {
      try {
        const response = await fetch(
          `${API_PROGRESS_EXERCISES}user/${userID}/problem/${problemData.problemID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${TOKEN}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok)
          throw new Error(
            `Failed to fetch progress. Status: ${response.status}`
          );

        const progressList = await response.json();
        setProgressSize(progressList.length); // Store the size of the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchProgress();
  }, [userID, problemData]);

  const getWeekAndDay = (size: number | null) => {
    if (size === null) return "Loading progress...";
    const week = Math.floor((size - 1) / 7) + 1;
    const day = ((size - 1) % 7) + 1;
    return `WEEK ${week} DAY ${day}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `0${minutes}:${remainingSeconds} Minutes`;
  };

  const getExerciseDuration = (size: number | null) => {
    if (size === null) return 0;
    const week = Math.floor((size - 1) / 7) + 1;
    if (week === 1) return 15;
    if (week === 2) return 30;
    if (week === 3) return 45;
    return 60; // Week 4 and beyond
  };

  // Calculate total exercise duration
  const exerciseDuration = getExerciseDuration(progressSize);
  const totalDurationSum = exercises.length * exerciseDuration + 20;

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
          <Text style={styles.progressText}>{getWeekAndDay(progressSize)}</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              alignItems: "center",
              paddingVertical: 15,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <DurationSumIcon />
              <Text style={{ color: "#0CA7BD", fontSize: 16 }}>
                {formatDuration(totalDurationSum)}
              </Text>
            </View>
            <Octicons name="dot-fill" size={16} color="#0CA7BD" />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <ExerciseNumberIcon />
              <Text style={{ color: "#0CA7BD", fontSize: 16 }}>
                5 exercises
              </Text>
            </View>
          </View>

          <View style={styles.PhysiotherapContainer}>
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
          </View>
          {/* Exercises Section */}
          <Text style={styles.sectionTitle}>Exercises list </Text>
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <View key={exercise.exerciseID} style={styles.exerciseCard}>
                <Image
                  source={{ uri: exercise.image.url }}
                  style={styles.exerciseImage}
                />
                <View
                  style={{
                    width: "70%",
                    height: 100,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(56, 56, 56, 0.23)",
                    justifyContent: "center",
                  }}
                >
                  <Text style={[styles.exerciseTitle, { flexWrap: "wrap" }]}>
                    {exercise.exerciseDescription}
                  </Text>
                  <Text style={styles.exerciseDuration}>
                    00:{exerciseDuration} minutes
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noExercisesText}>
              No exercises found for this progress.
            </Text>
          )}
          <View style={{ height: 65 }}></View>
        </ScrollView>
      </ParallaxScrollView>
      <TouchableOpacity
        style={styles.stickyButton}
        onPress={() =>
          route.push({
            pathname: "./ExerciseSession",
            params: {
              exercises: JSON.stringify(exercises),
              progressID,
              exerciseDuration: getExerciseDuration(progressSize),
              problem,
            },
          })
        }
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#064D57",
    paddingVertical: 15,
  },
  exerciseCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    // padding: 15,
    marginVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  exerciseImage: {
    width: 100,
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#064D57",
    flexWrap: "wrap",
    width: "100%",
  },
  noExercisesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 10,
  },
  progressText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0CA7BD",
    marginTop: 5,
  },
  exerciseDuration: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(6, 77, 87, 0.60)",
    marginTop: 10,
  },
});
