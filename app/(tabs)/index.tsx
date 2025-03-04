import { Image, StyleSheet, Platform, Text, View, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Feather, Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Calendar } from "react-native-calendars";
import ProgressRing from '@/components/progress/ProgressRing';
// import PieChart from "react-native-pie-chart";
// import "D:/A Graduation Project/cam-app/global.css"

export default function HomeScreen() {
  const [username, setUsername] = useState('Tala Al Dibs');
  const [selected, setSelected] = useState("Month");
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

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

  const generateMarkedDates = () => {
    let markedDates: { [key: string]: any } = {};

    for (let i = 1; i <= 31; i++) {
      let date = new Date(today.getFullYear(), today.getMonth(), i);
      let dateString = date.toISOString().split("T")[0];

      if (date > today) {
        // Upcoming days: Black text
        markedDates[dateString] = { textColor: "black" };
      } else if (date.toDateString() === today.toDateString()) {
        // Today's date: Red circle
        markedDates[dateString] = {
          selected: true,
          selectedColor: "#0CA7BD",
        };
      } else if (date < today && date.getDay() !== 0 && date.getMonth()===today.getMonth()) {
        // Past Saturdays: Green
        markedDates[dateString] = { selected: true, selectedColor: "#CEEDF2" };
      } else {
        // Other past days: Blue
        markedDates[dateString] = { marked: true, dotColor: "blue" };
      }
    }

    return markedDates;
  };

  const widthAndHeight = 120;
  const series = [
    { value: 50, color: "#003f5c" }, // Sad
    { value: 75, color: "#7aabd4" }, // Neutral
    { value: 80, color: "#ffd700" }, // Happy
  ];
  const sliceColor = ["#003f5c", "#7aabd4", "#ffd700"];

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
      
      <View style={styles.container}>
        
      {/* <PieChart
        widthAndHeight={widthAndHeight}
        series={series}
        // sliceColor={sliceColor}
        // coverRadius={0.6} // Creates a donut effect
        // coverFill={"#FFF"}
        cover={0.45}
      /> */}
      {/* <Text style={styles.label}>Emotion Analysis</Text> */}
    </View>
      {/* Content Below Slider */}
      <View style={styles.contentContainer}>
        {selected === "Day" && <View>
          <Text style={styles.contentText}>Today is {today.toDateString()}</Text>
          <ProgressRing/>
          </View>}
        {selected === "Week" && <Text style={styles.contentText}>Week 1</Text>}
        {selected === "Month" && (
          <Calendar
          current={todayStr}
          markedDates={generateMarkedDates()}
          theme={{
            todayTextColor: "#0CA7BD",
            arrowColor: "#0CA7BD",
            calendarBackground: "transparent", // Makes the background transparent
            dayTextColor: "#333", // General text color
            textDisabledColor: "#A9A9A9", // Disabled dates
          }}
          style={{ backgroundColor: "transparent",  width: wp(90), // Adjust width to 90% of screen width
            height: hp(60), }} // Ensures transparency
        />
        )}
      </View>
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
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

});
