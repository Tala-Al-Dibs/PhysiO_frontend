import { View, Text } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import progressAnimation from "@/assets/animations/progress.json";

export default function Progress({ size }: any) {
  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <LottieView
        style={{ flex: 1 }}
        source={progressAnimation}
        autoPlay
        loop
      />
    </View>
  );
}
