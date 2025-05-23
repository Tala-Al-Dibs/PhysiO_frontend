import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SPRINGPORT8080 } from "@/constants/apiConfig";
import IconComponent from "../svgIcons/problems/ProblemsIconsWithColor";
import { ProblemColors } from "@/constants/Colors";
import { useRouter } from "expo-router";

interface Problem {
  problemID: number;
  name: string;
}

interface Progress {
  progressID: number;
  percentag: number;
  problem: Problem;
  // Add other properties if needed
}

interface IndividualProblemProgressProps {
  bearerToken: string | null;
  userId: number | null;
}

const IndividualProblemProgress = ({
  bearerToken,
  userId,
}: IndividualProblemProgressProps) => {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [userProblems, setUserProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const api_problem = `${SPRINGPORT8080}/api/problems`;
  const api_progress = `${SPRINGPORT8080}/api/progresses`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!bearerToken || !userId) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        // Fetch user's problems
        const problemsResponse = await fetch(
          `${api_problem}/user/${userId}/problems`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!problemsResponse.ok) {
          const errorData = await problemsResponse.json();
          throw new Error(errorData.message || "Failed to fetch user problems");
        }

        const problemsData = await problemsResponse.json();
        setUserProblems(problemsData);

        // Fetch today's progress
        const progressResponse = await fetch(
          `${api_progress}/${userId}/daily`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${bearerToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!progressResponse.ok) {
          const errorData = await progressResponse.json();
          throw new Error(
            errorData.message || "Failed to fetch today's progress"
          );
        }

        const progressData = await progressResponse.json();
        setProgressData(progressData);
      } catch (err) {
        console.error("Fetch error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (bearerToken && userId) {
      fetchData();
    }
  }, [bearerToken, userId]); // Add dependencies

  // Combine progress data with all user problems to show 0% for problems without progress
  const getCombinedProgress = () => {
    return userProblems.map((problem) => {
      const progress = progressData.find(
        (p) => p.problem.problemID === problem.problemID
      );
      const problemColor = ProblemColors[problem.name] || "#0CA7BD"; // Default color if not found

      return {
        problem: problem.name,
        percentage: progress ? (progress.percentag / 5) * 100 : 0,
        color: problemColor, // Add the problem-specific color
        icon: problem.name,
      };
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0CA7BD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {getCombinedProgress().map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => {
            const problemId = userProblems.find(
              (p) => p.name === item.problem
            )?.problemID;
            if (problemId) {
              router.push({
                pathname: "/problemProgress", // Adjusted path
                params: {
                  problem: item.problem,
                  problemID: problemId,
                  color: item.color, // Pass the color if needed
                },
              });
            } else {
              console.error("Problem ID not found for:", item.problem);
              Alert.alert("Error", "Could not open this problem");
            }
          }}
        >
          <View style={styles.iconContainer}>
            <IconComponent problem={item.problem} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.problemText}>{item.problem}</Text>
            <Text style={styles.exerciseText}>Progress</Text>
          </View>
          <View style={styles.percentageContainer}>
            <Text style={styles.percentageText}>
              {Math.round(item.percentage)}%
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${item.percentage}%`,
                    backgroundColor: item.color, // Use the problem-specific color
                  },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  problemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#063E46",
  },
  exerciseText: {
    fontSize: 14,
    color: "#6C6C6C",
  },
  percentageContainer: {
    alignItems: "flex-end",
    minWidth: 80,
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0CA7BD",
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    width: 80,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    // backgroundColor: "#FFAC33",
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#FF0000",
    fontSize: 16,
    textAlign: "center",
  },
});

export default IndividualProblemProgress;
