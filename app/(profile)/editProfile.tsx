import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";

const EditProfile = () => {
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("55");
  const [height, setHeight] = useState("160");
  const [location, setLocation] = useState("BETHLEHEM");
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const API_URL = "http://192.168.121.135:8080/api/";
  const BEARER_TOKEN ="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0VXNlciIsImlhdCI6MTc0MjQ1OTMzNywiZXhwIjoxNzQyNTQ1NzM3fQ.g8C__IYmAf_eyDjTCbxEXlkUYnrA_ChOmw2ivHiRh1s";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("Loading...");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const profileImages = [
    require("../(profileimages)/profile.png"),
    require("../(profileimages)/profile2pic.jpg"),
    require("../(profileimages)/profile3pic.jpg"),
    require("../(profileimages)/profile4pic.jpg"),
    require("../(profileimages)/profile6pic.jpg"),
    require("../(profileimages)/profile7pic.jpg"),

  ];

  const [selectedImage, setSelectedImage] = useState(profileImages[0]);


  const selectImage = (image: string) => {
    setSelectedImage(image);
    setModalVisible(false);
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);  

  const router = useRouter();

  const countries = [
    "BETHLEHEM",
    "HEBRON",
    "RAMALLAH",
    "NABLUS",
    "JENIN",
    "JERICHO",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user from:", `${API_URL}users/1`);
        const response = await fetch(`${API_URL}users/1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response data:", data);
        setUser(data);

        const userID = data.userID;
        console.log("Fetching profile for user ID:", userID);
        const profileResponse = await fetch(`${API_URL}profiles/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileResponse.ok) {
          throw new Error(`Error fetching profile: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log("Profile data:", profileData);
        setProfile(profileData); // Store the profile data
      } catch (error) {
        console.error("Failed to fetch user or profile:", error);
      }
    };

    fetchUser();
  }, []);

  
  const handleSave = async () => {
    try {
      if (!user?.userID) {
        throw new Error("User ID is missing");
      }
  
      // Step 1: Update Username in Users API
      const updatedUser = {
        username: username,
      };
  
      console.log("Updating username with data:", updatedUser);
  
      const userResponse = await fetch(`${API_URL}users/${user?.userID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      if (!userResponse.ok) {
        const errorData = await userResponse.text();
        console.error("Error updating username:", userResponse.status, errorData);
        throw new Error(`Error updating username: ${userResponse.status}`);
      }
  
      console.log("Username updated successfully!");
  
      // Step 2: Update Profile in Profiles API
      const updatedProfile = {
        gender: gender || "FEMALE",
        weight: parseInt(weight),
        height: parseInt(height),
        location,
        dateOfBirth: selectedDate ? selectedDate.format("YYYY-MM-DD") : "2003-08-03",
      };
  
      console.log("Updating profile with data:", updatedProfile);
  
      const profileResponse = await fetch(`${API_URL}profiles/${user?.userID}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!profileResponse.ok) {
        const errorData = await profileResponse.text();
        console.error("Error saving profile:", profileResponse.status, errorData);
        throw new Error(`Error saving profile: ${profileResponse.status}`);
      }
  
      console.log("Profile updated successfully!");
      router.push("../(tabs)/profile"); 
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      <LinearGradient
        colors={["#63c5da", "#ffffff"]}
        style={styles.background}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingsButton}>
        <Text style={styles.saveText} onPress={handleSave}>Save</Text>
      </TouchableOpacity>

{/* Profile Image & Camera Button */}
<View style={styles.profileContainer}>
  <Image source={selectedImage} style={styles.profileImage} />
  <TouchableOpacity style={styles.cameraIcon} onPress={() => setModalVisible(true)}>
    <Ionicons name="camera" size={20} color="white" />
  </TouchableOpacity>
</View>

{/* Modal for Selecting Profile Picture */}
<Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent2}>
      <Text style={styles.modalTitle}>Choose a Profile Picture</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
        {profileImages.map((image, index) => (
          <TouchableOpacity key={index} onPress={() => selectImage(image)}>
            <Image source={image} style={styles.modalImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.closeButton2} onPress={() => setModalVisible(false)}>
        <Text style={styles.closeButtonText2}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name</Text>
        <View style={styles.inputBox} >
          <Ionicons
            name="person-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={username}
            editable={false}           />
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Your Location</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name="location-outline"
                size={20}
                color="gray"
                style={styles.icon}
              />
              <Picker
                selectedValue={
                  profile ? profile.location + "..." : "Loading..."
                }
                style={styles.picker}
                onValueChange={(itemValue) => setLocation(itemValue)}
              >
                {countries.map((country) => (
                  <Picker.Item label={country} value={country} key={country} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Your Gender</Text>
            <View style={styles.inputBox}>
              <Ionicons
                name={profile?.gender === "Female" ? "female" : "male"}
                size={20}
                color="gray"
                style={styles.icon}
              />
              <Picker
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="MALE" value="MALE" />
                <Picker.Item label="FEMALE" value="FEMALE" />
              </Picker>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Your Birthday</Text>
        <TouchableOpacity
          style={styles.inputBox}
          onPress={() => setShowCalendar(true)}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <Text style={styles.input}>
            {selectedDate ? selectedDate.format("YYYY-MM-DD") : "Select Date"}
          </Text>
        </TouchableOpacity>

       {/* Modal for Calendar */}
<Modal
  visible={showCalendar}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowCalendar(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <CalendarPicker
        onDateChange={(date) => {
          const momentDate = moment(date);
          setSelectedDate(momentDate);
          setShowCalendar(false);
        }}
        width={300} 
        height={300} 
        selectedDayStyle={{
          backgroundColor: '#3498db', 
          borderRadius: 20,
        }}
        selectedDayTextStyle={{ color: 'white', fontSize: 16 }}  
      />
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setShowCalendar(false)}
      >
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



        <Text style={styles.label}>Your Weight</Text>
        <View style={styles.inputBox}>
          <Ionicons
            name="fitness-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={(text) => setWeight(text)}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Your Height</Text>
        <View style={styles.inputBox}>
          <Ionicons
            name="trending-up-outline"
            size={20}
            color="gray"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={(text) => setHeight(text)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
    </ScrollView>
  );
};

interface User {
  userID: number;
  username: string;
  password: string;
  profile: Profile;
}

enum Gender {
  MALE = "Male",
  FEMALE = "Female",
}

enum Location {
  BETHLEHEM = "Bethlehem",
  JERUSALEM = "Jerusalem",
  RAMALLAH = "Ramallah",
  GAZA = "Gaza",
  NABLUS = "Nablus",
  JENIN = "Jenin",
  TULKAREM = "Tulkarem",
  QALQILIA = "Qalqilia",
  JERICHO = "Jericho",
  HEBRON = "Hebron",
  OTHER = "Other",
}

interface Profile {
  profileID: number;
  bio: string;
  profilePictureUri: string;
  height: number;
  weight: number;
  dateOfBirth: string;
  gender: Gender;
  location: Location;
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "40%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  settingsButton: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  profileContainer: {
    marginTop: 100,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#3498db",
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    width: "90%",
    marginTop: 20,
  },
  label: {
    fontSize: 11,
    color: "gray",
    marginBottom: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f7",
    padding: 5,
    borderRadius: 10,
    marginBottom: 9,
    height: 60,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: 'black', // Ensure the text color is visible
  },
  picker: {
    flex: 1,
    fontSize: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  saveText: {
    color: "#0d6976",
    fontSize: 15,
  },

  closeButton: {
    marginTop: 10,
    backgroundColor: "#63c5da",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add transparency for background
  },
  modalContent: {
    width: 320, // Set the width of the modal content
    height: 400, // Set the height of the modal content
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,  // Add some padding for spacing
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent2: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageScroll: {
    flexDirection: "row",
    marginVertical: 10,
  },
  modalImage: {
    width: 80,
    height: 80,
    marginHorizontal: 5,
    borderRadius: 40,
  },
  closeButton2: {
    marginTop: 10,
    backgroundColor: "#3498db",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText2: {
    color: "white",
    fontWeight: "bold",
  },
  

});
export default EditProfile;