import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ProblemsListCards from "@/components/problem/ProblemsListCards";
import {
  ProblemFound,
  ProblemNotFound,
} from "@/components/svgIcons/problems/problemResult";
import { FASTAPIPORT8000, SPRINGPORT8080, TOKEN } from "@/constants/apiConfig";

const API_URL = SPRINGPORT8080 + "/api/problems/user"; // Replace with your actual API base URL
const USER_ID = 1; // Replace with the dynamic user ID
const ngrokLink = FASTAPIPORT8000;

export default function Report() {
  const { problems, image_url } = useLocalSearchParams();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Parse the JSON string
  const problemList = problems ? JSON.parse(problems as string) : [];

  // Ensure image_url is a string
  const imageUri = Array.isArray(image_url) ? image_url[0] : image_url;

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image source={{ uri: imageUri }} style={styles.headerImage} />
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="keyboard-arrow-left" size={30} color="white" />
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.contentContainer}>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.title}>The Scan is Done!</Text>
          <Text style={{ color: "#383838", fontSize: 16 }}>
            Here are your results
          </Text>
        </View>
        {problemList.length === 0 ? (
          <View style={[styles.problemCount, styles.problemNotFound]}>
            <ProblemNotFound />
            <View style={{ height: "100%", justifyContent: "center", gap: 5 }}>
              <Text style={styles.noProblemsText}>No Problems Found</Text>
              <Text style={styles.adviceText}>Your posture is great!</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={[styles.problemCount, styles.problemFound]}>
              <ProblemFound />
              <View
                style={{ height: "100%", justifyContent: "center", gap: 5 }}
              >
                <Text style={styles.problemText}>
                  {problemList.length}{" "}
                  {problemList.length === 1
                    ? "Problem was found!"
                    : "Problems were found!"}
                </Text>
                <Text style={styles.adviceText}>
                  Read more about your problems below
                </Text>
              </View>
            </View>
            <ProblemsListCards problemList={problemList} />
          </>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 280, // Allows the top half of the image to be visible
    overflow: "hidden",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerImage: {
    height: "130%",
    width: "auto",
    resizeMode: "stretch",
  },
  closeButton: {
    position: "absolute",
    top: 40, // Adjust as needed for safe area
    left: 30,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent background
    borderRadius: 50,
    padding: 3,
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: "yellow",
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 10, // Pull up slightly to overlap with the header
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    elevation: 5,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0CA7BD",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  problemText: {
    fontSize: 16,
    color: "#FF4E33",
    fontWeight: "bold",
  },
  noProblemsText: {
    fontSize: 16,
    color: "#0BB296",
    fontWeight: "bold",
  },
  adviceText: {
    fontSize: 12,
    color: "rgba(56, 56, 56, 0.79)",
  },
  problemCount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 10, // Add padding if necessary
    paddingBottom: 10,
    paddingLeft: 19,
    paddingRight: 19,
    borderRadius: 14,
    height: 68,
    flex: 1,
    flexDirection: "row",
    gap: 15,
  },
  problemFound: {
    backgroundColor: "rgba(255, 172, 51, 0.44)",
  },
  problemNotFound: {
    backgroundColor: "rgba(12, 167, 189, 0.2)",
  },
});
