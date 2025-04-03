
import {
  Image,
  StyleSheet,
  Platform,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import ProgressRing from "@/components/progress/ProgressRing";
import React from "react";
import ProgressCalender from "@/components/progress/ProgressCalender";
import ProgressWeekly from "@/components/progress/ProgressWeekly";
import ProgressHeader from "@/components/progress/ProgressHeader";
import IndividualProblemProgress from "@/components/progress/IndividualProblemProgress";
import ProgressParallaxScrollView from "@/components/ProgressParallaxScrollView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import GoToPrize from "@/components/progress/GoToPrize";

export default function progress() {
  const [selected, setSelected] = useState("Month");
  const today = new Date();

  return (

    <ProgressParallaxScrollView
      headerImage={<ProgressHeader />}
      headerBackgroundColor={{ dark: "#063E46", light: "#E0F7FA" }}
    >
      <ScrollView>
        {/* <ProgressHeader /> */}
        <View
          style={{ paddingTop: hp(0), paddingHorizontal: wp(5) }}
          className="flex-1 gap-1"
        >
          <View style={styles.container}>
            {/* Toggle Slider */}
            <View style={styles.toggleContainer}>
              {["Day", "Week", "Month"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.toggleButton,
                    selected === option && styles.selectedButton,
                  ]}
                  onPress={() => setSelected(option)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      selected === option && styles.selectedText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.container}>
              {/* Content Below Slider */}
              <View style={styles.contentContainer}>
                {selected === "Day" && (
                  <View style={{ left: 15 }}>
                    <Text style={styles.contentText}>
                      Today is {today.toDateString()}
                    </Text>
                    <ProgressRing type={"progress"} />
                  </View>
                )}
                {selected === "Week" && <ProgressWeekly />}
                {selected === "Month" && <ProgressCalender />}
              </View>
            </View>
          </View>
          <GoToPrize />
          <IndividualProblemProgress />
        </View>
        <View style={{ height: 150 }}></View>
      </ScrollView>
    </ProgressParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 30,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#D3EEF7",
    borderRadius: 50,
    padding: 5,
    width: "100%",
    justifyContent: "space-between",
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedButton: {
    backgroundColor: "#0CA7BD",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0CA7BD",
  },
  selectedText: {
    color: "white",
  },
  contentContainer: {
    marginTop: 10,
    height: hp(40),
  },
  contentText: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "transparent",
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  apiButton: {
    marginTop: 20,
    backgroundColor: "#0CA7BD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  apiButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
