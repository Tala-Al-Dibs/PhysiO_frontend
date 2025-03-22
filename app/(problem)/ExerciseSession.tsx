import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SPRINGPORT8080, TOKEN } from "@/constants/apiConfig";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface Exercise {
  exerciseID: number;
  image: { url: string };
  exerciseDescription: string;
}

const ExerciseSession: React.FC = () => {
  const { exercises, progressID, exerciseDuration, problem } =
    useLocalSearchParams();
  const parsedExercises: Exercise[] = JSON.parse(exercises as string);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [key, setKey] = useState(0); // Key to reset the timer
  const router = useRouter();
  const navigation = useNavigation();

  const currentExercise = parsedExercises[currentExerciseIndex];
  const nextExercise = parsedExercises[currentExerciseIndex + 1]; // Get the next exercise
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const motivationalMessages = [
    "Time for a Rest",
    "Take it easy",
    "You're Doing Great!",
    "Keep it up!",
    "Stay strong, you've got this!",
    "One step at a time!",
    "Let's take a quick break",
  ];

  const [motivationalMessage, setMotivationalMessage] = useState(
    motivationalMessages[0]
  );

  const handleTimerEnd = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
    } else {
      if (currentExerciseIndex < parsedExercises.length - 1) {
        setIsBreak(true);
        setMotivationalMessage(
          motivationalMessages[
            Math.floor(Math.random() * motivationalMessages.length)
          ]
        );
      } else {
        router.back(); // Go back to the previous screen after all exercises are done
      }
    }
    setKey((prevKey) => prevKey + 1); // Reset the timer
  }, [isBreak, currentExerciseIndex, parsedExercises.length, router]);

  const updateProgress = async () => {
    try {
      const completedExercises = currentExerciseIndex + (isBreak ? 0 : 1);
      const response = await fetch(
        `${SPRINGPORT8080}/api/progresses/${progressID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ percentag: completedExercises }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update progress. Status: ${response.status}`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isBreak && currentExerciseIndex < parsedExercises.length) {
      updateProgress();
    }
  }, [currentExerciseIndex, isBreak, parsedExercises.length]);

  const handlePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const handleStop = useCallback(() => {
    router.back(); // Navigate back to the previous screen
  }, [router]);

  const timerInitialTime = isBreak ? 10 : Number(exerciseDuration); // 5-second break or exercise duration

  return (
    <View style={[styles.container, isBreak && styles.breakContainer]}>
      {currentExercise ? (
        <>
          {isBreak ? (
            // Rest Screen
            <>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={styles.restText}>{motivationalMessage}</Text>
                <FontAwesome6 name="face-smile-beam" size={24} color="white" />
              </View>
              <CountdownCircleTimer
                key={key} // Reset the timer when the key changes
                isPlaying={!isPaused}
                duration={timerInitialTime}
                colors={["#FFFFFF", "#F7B801", "#A30000"]}
                colorsTime={[timerInitialTime, timerInitialTime / 2, 0]}
                onComplete={handleTimerEnd}
                size={200}
                strokeWidth={12}
              >
                {({ remainingTime }) => (
                  <Text style={styles.timerText}>{remainingTime}</Text>
                )}
              </CountdownCircleTimer>
              <Text style={styles.nextExerciseTitle}>Next</Text>
              {nextExercise && (
                <>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: nextExercise.image.url }}
                      style={styles.nextExerciseImage}
                    />
                    {/* <View style={styles.exerciseNumberCircle}>
                      <Text style={styles.exerciseNumberText}>
                        {currentExerciseIndex + 2}
                      </Text>
                    </View> */}
                  </View>
                  <Text style={styles.nextExerciseDescription}>
                    {nextExercise.exerciseDescription}
                  </Text>
                </>
              )}
            </>
          ) : (
            // Exercise Screen
            <>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: currentExercise.image.url }}
                  style={styles.exerciseImage}
                />
                <View style={styles.exerciseNumberCircle}>
                  <Text style={styles.exerciseNumberText}>
                    {currentExerciseIndex + 1}
                  </Text>
                </View>
              </View>
              <View style={{ width: 350 }}>
                <Text style={styles.exerciseProgressText}>
                  {currentExerciseIndex + 1}/{parsedExercises.length}
                </Text>
                <View
                  style={{
                    height: 0.5,
                    backgroundColor: "rgba(56, 56, 56, 0.36)",
                    marginVertical: 10,
                  }}
                ></View>
              </View>
              <Text style={[styles.exerciseDescription, { marginBottom: 30 }]}>
                {currentExercise.exerciseDescription}
              </Text>

              <CountdownCircleTimer
                key={key} // Reset the timer when the key changes
                isPlaying={!isPaused}
                duration={timerInitialTime}
                colors={["#0CA7BD", "#F7B801", "#A30000"]}
                colorsTime={[timerInitialTime, timerInitialTime / 2, 0]}
                onComplete={handleTimerEnd}
                size={120}
                strokeWidth={10}
              >
                {({ remainingTime }) => (
                  <Text style={styles.timerText}>{remainingTime}</Text>
                )}
              </CountdownCircleTimer>
            </>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: 350,
            }}
          >
            <TouchableOpacity style={styles.iconButton} onPress={handlePause}>
              <FontAwesome6
                name={isPaused ? "play" : "pause"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconButton, styles.stopButton]}
              onPress={handleStop}
            >
              <FontAwesome6 name="stop" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.completedText}>All exercises completed!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Default background color
  },
  breakContainer: {
    backgroundColor: "#0CA7BD", // Background color for the rest screen
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
  },
  exerciseImage: {
    width: 350,
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 10,
  },
  exerciseNumberCircle: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0CA7BD",
  },
  exerciseNumberText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0CA7BD",
  },
  exerciseDescription: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 20,
    color: "#383838", // Default text color
  },
  exerciseProgressText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#383838",
    marginVertical: 15,
    // marginTop: 10,
  },
  timerText: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#383838", // Default text color
  },
  pauseButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#0CA7BD",
    borderRadius: 5,
  },
  pauseButtonText: {
    color: "white",
    fontSize: 18,
  },
  iconButton: {
    padding: 15,
    backgroundColor: "#0CA7BD",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    elevation: 5, // Adds shadow on Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  stopButton: {
    backgroundColor: "#FF0000",
  },

  stopButtonText: {
    color: "white",
    fontSize: 18,
  },
  completedText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  restText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF", // Text color for the rest screen
    marginBottom: 20,
  },
  nextExerciseTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#383838", // Text color for the rest screen
    marginTop: 100,
  },
  nextExerciseImage: {
    width: 100,
    aspectRatio: 1,
    resizeMode: "contain",
    borderRadius: 10,
  },
  nextExerciseDescription: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Text color for the rest screen
    marginTop: 10,
    textAlign: "center",
  },
});

export default ExerciseSession;
