import { Image, StyleSheet, Platform, Text, View, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
// import "D:/A Graduation Project/cam-app/global.css"

export default function HomeScreen() {
  const [username, setUsername] = useState('Tala Al Dibs');
  const [selected, setSelected] = useState("Month");

  const getGreeting = () => {
    const hour = new Date().getHours();
  
    if (hour >= 5 && hour < 12) {
      return { message: "Good morning", icon: "sunny" as const }; // 🌞
    } else if (hour >= 12 && hour < 18) {
      return { message: "Good afternoon", icon: "partly-sunny" as const }; // 🌅
    } else {
      return { message: "Good evening", icon: "moon" as const }; // 🌙
    }
  };

  const { message, icon } = getGreeting();

  const getContent = () => {
    const today = new Date();
    if (selected === "Day") {
      return <Text style={styles.contentText}>Today is {today.toDateString()}</Text>;
    } else if (selected === "Week") {
      return <Text style={styles.contentText}>Week 1</Text>;
    } else {
      return <Text style={styles.contentText}>Month: {today.toLocaleString('default', { month: 'long' })}</Text>;
    }
  };

  return (
    <View style={{paddingTop: hp(8), paddingHorizontal: wp(5)}} className="flex-1 gap-1">
      <View style={styles.topContainer}>
      <View style={styles.greetingContainer}>
      <Text style={{ fontSize: 20, fontWeight: 'light', color: '#6C6C6C'}}>
        {message}!
      </Text>
      <Ionicons name={icon} size={20} color="#FFA500" />
      </View>
      <Text style={{fontSize: 30, fontWeight:'medium'}}>
        {username}
      </Text>
      </View>
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
            <Text style={[styles.toggleText, selected === option && styles.selectedText]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content Below Slider */}
      <View style={styles.contentContainer}>{getContent()}</View>
    </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  topContainer: {
    flexDirection: 'column',
    gap: 10
  },
  container: {
    alignItems: "center",
    marginTop: 30,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#D3EEF7",
    borderRadius: 50,
    padding: 5,
    width: '100%',
    justifyContent: 'space-between',
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
    marginTop: 20,
  },
  contentText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

});
