import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SPRINGPORT8080, TOKEN } from "@/constants/apiConfig";

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

  const currentExercise = parsedExercises[currentExerciseIndex];

  const handleTimerEnd = useCallback(() => {
    if (isBreak) {
      setIsBreak(false);
      setCurrentExerciseIndex((prevIndex) => prevIndex + 1);
    } else {
      if (currentExerciseIndex < parsedExercises.length - 1) {
        setIsBreak(true);
      } else {
        router.back(); // Go back to the previous screen after all exercises are done
      }
    }
    setKey((prevKey) => prevKey + 1); // Reset the timer
  }, [isBreak, currentExerciseIndex, parsedExercises.length, router]);

  const updateProgress = async () => {
    try {
      const response = await fetch(
        `${SPRINGPORT8080}/api/progresses/${progressID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ percentag: 1 }),
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

  const timerInitialTime = isBreak ? 5 : Number(exerciseDuration); // 5-second break or exercise duration

  return (
    <View style={styles.container}>
      {currentExercise ? (
        <>
          <Image
            source={{ uri: currentExercise.image.url }}
            style={styles.exerciseImage}
          />
          <Text style={styles.exerciseDescription}>
            {currentExercise.exerciseDescription}
          </Text>
          <CountdownCircleTimer
            key={key} // Reset the timer when the key changes
            isPlaying={!isPaused}
            duration={timerInitialTime}
            colors={["#0CA7BD", "#F7B801", "#A30000"]}
            colorsTime={[timerInitialTime, timerInitialTime / 2, 0]}
            onComplete={handleTimerEnd}
            size={200}
            strokeWidth={12}
          >
            {({ remainingTime }) => (
              <Text style={styles.timerText}>{remainingTime} seconds</Text>
            )}
          </CountdownCircleTimer>
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Text style={styles.pauseButtonText}>
              {isPaused ? "Resume" : "Pause"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
            <Text style={styles.stopButtonText}>Stop</Text>
          </TouchableOpacity>
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
  },
  exerciseImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  exerciseDescription: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
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
  stopButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
  },
  stopButtonText: {
    color: "white",
    fontSize: 18,
  },
  completedText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ExerciseSession;
