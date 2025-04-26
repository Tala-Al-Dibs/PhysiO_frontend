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
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import moment from "moment";
import WeightIcon from "@/components/svgIcons/profile/weight";
import HeightIcon from "@/components/svgIcons/profile/height";
import {
  SPRINGPORT8080,
  getCurrentToken,
  getCurrentUserId,
} from "@/constants/apiConfig";

const EditProfile = () => {
  const backgroundImage = require("../../assets/images/avatar/back.jpeg");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [location, setLocation] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userLocation, setUserLocation] = useState("Location");
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const API_URL = SPRINGPORT8080 + "/api/";
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("Loading...");
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const [activeModal, setActiveModal] = useState<
    "day" | "month" | "year" | "gender" | "location" | null
  >(null);

  useEffect(() => {
    if (profile) {
      setGender(profile.gender);
      setLocation(profile.location);
      setHeight(profile.height?.toString() || "");
      setWeight(profile.weight?.toString() || ""); // Set weight

      if (profile.dateOfBirth) {
        const date = moment(profile.dateOfBirth);
        setSelectedDay(date.format("D"));
        setSelectedMonth(months[date.month()]);
        setSelectedYear(date.format("YYYY"));
        setSelectedDate(date);
      } else {
        // Clear date fields if no date exists
        setSelectedDay("");
        setSelectedMonth("");
        setSelectedYear("");
        setSelectedDate(null);
      }

      if (profile.profilePictureUri) {
        const currentImage = profileImages.find(
          (img) => img.name === profile.profilePictureUri
        );
        if (currentImage) {
          setSelectedImage(currentImage);
        } else {
          console.warn(
            `Image ${profile.profilePictureUri} not found in assets`
          );
          setSelectedImage(profileImages[0]);
        }
      }
    }
  }, [profile]);

  const SelectionModal = () => {
    const data = {
      day: days,
      month: months,
      year: years,
      gender: ["MALE", "FEMALE"],
      location: countries,
    };

    const currentValue = {
      day: selectedDay,
      month: selectedMonth,
      year: selectedYear,
      gender: gender,
      location: location,
    };

    const titles = {
      day: "Select Day",
      month: "Select Month",
      year: "Select Year",
      gender: "Select Gender",
      location: "Select Location",
    };

    const handleSelect = (value: string) => {
      if (activeModal === "day") setSelectedDay(value);
      if (activeModal === "month") setSelectedMonth(value);
      if (activeModal === "year") setSelectedYear(value);
      if (activeModal === "gender") setGender(value);
      if (activeModal === "location") setLocation(value);
      setActiveModal(null);
    };

    return (
      <Modal
        visible={!!activeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {activeModal && titles[activeModal]}
            </Text>
            <ScrollView>
              {activeModal &&
                data[activeModal].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.modalItem,
                      currentValue[activeModal] === item && styles.selectedItem,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  ).reverse();
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  type ProfileImage = {
    name: string;
    source: any; // You can refine this later to a more specific type like ImageSourcePropType
  };

  const profileImages = [
    {
      name: "default",
      source: require("../../assets/images/avatar/default.png"),
    },
    {
      name: "avatar1",
      source: require("../../assets/images/avatar/avatar1.png"),
    },
    {
      name: "avatar2",
      source: require("../../assets/images/avatar/avatar2.png"),
    },
    {
      name: "avatar3",
      source: require("../../assets/images/avatar/avatar3.png"),
    },
    {
      name: "avatar4",
      source: require("../../assets/images/avatar/avatar4.png"),
    },
    {
      name: "avatar5",
      source: require("../../assets/images/avatar/avatar5.png"),
    },
    {
      name: "avatar6",
      source: require("../../assets/images/avatar/avatar6.png"),
    },
    {
      name: "avatar7",
      source: require("../../assets/images/avatar/avatar7.png"),
    },
    {
      name: "avatar8",
      source: require("../../assets/images/avatar/avatar8.png"),
    },
    {
      name: "avatar9",
      source: require("../../assets/images/avatar/avatar9.png"),
    },
    {
      name: "avatar10",
      source: require("../../assets/images/avatar/avatar10.png"),
    },
    {
      name: "avatar11",
      source: require("../../assets/images/avatar/avatar11.png"),
    },
  ];

  const [selectedImage, setSelectedImage] = useState<ProfileImage>(
    profileImages[0]
  );

  const selectImage = (imageObj: ProfileImage) => {
    setSelectedImage(imageObj);
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
    const initializeAuth = async () => {
      try {
        const token = await getCurrentToken();
        const id = await getCurrentUserId();

        setBearerToken(token);
        setUserId(id);

        if (token && id) {
          await fetchUser(token, id); // Pass the values directly
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      }
    };

    initializeAuth();
  }, []);

  const fetchUser = async (token: string, userId: string) => {
    try {
      const response = await fetch(`${SPRINGPORT8080}/api/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

      const profileResponse = await fetch(
        `${SPRINGPORT8080}/api/profiles/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error(`Error fetching profile: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      console.log("Profile data:", profileData);
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to fetch user or profile:", error);
    }
  };

  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const monthIndex = months.indexOf(selectedMonth);
      const dateString = `${selectedYear}-${(monthIndex + 1)
        .toString()
        .padStart(2, "0")}-${selectedDay.padStart(2, "0")}`;
      setSelectedDate(moment(dateString));
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  // Update your handleSave function
  const handleSave = async () => {
    try {
      if (!bearerToken || !userId) {
        throw new Error("Authentication token or user ID is missing");
      }

      // Step 1: Update Username in Users API
      const updatedUser = {
        username: username,
      };

      console.log("Updating username with data:", updatedUser);

      const userResponse = await fetch(
        `${SPRINGPORT8080}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!userResponse.ok) {
        const errorData = await userResponse.text();
        console.error(
          "Error updating username:",
          userResponse.status,
          errorData
        );
        throw new Error(`Error updating username: ${userResponse.status}`);
      }

      console.log("Username updated successfully!");

      let dateOfBirth = null;
      if (selectedDay && selectedMonth && selectedYear) {
        const monthIndex = months.indexOf(selectedMonth);
        dateOfBirth = `${selectedYear}-${(monthIndex + 1)
          .toString()
          .padStart(2, "0")}-${selectedDay.padStart(2, "0")}`;
      }

      // Step 2: Update Profile in Profiles API
      const updatedProfile = {
        gender: gender || "FEMALE",
        weight: parseInt(weight),
        height: parseInt(height),
        location,
        profilePictureUri: selectedImage.name,
        dateOfBirth: dateOfBirth || profile?.dateOfBirth || null,
      };

      console.log("Updating profile with data:", updatedProfile);

      const profileResponse = await fetch(
        `${SPRINGPORT8080}/api/profiles/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        }
      );

      if (!profileResponse.ok) {
        const errorData = await profileResponse.text();
        console.error(
          "Error saving profile:",
          profileResponse.status,
          errorData
        );
        throw new Error(`Error saving profile: ${profileResponse.status}`);
      }

      console.log("Profile updated successfully!");
      router.push("../(tabs)/profile"); // Using router instead of navigation
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(199, 245, 255, 0.7)", "rgba(0, 161, 198, 0.7)"]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image source={selectedImage.source} style={styles.profileImage} />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>
            {user ? user.username : "Loading..."}
          </Text>

          {/* <LinearGradient
          colors={["#63c5da", "#ffffff"]}
          style={styles.background}
        /> */}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.saveText} onPress={handleSave}>
              Save
            </Text>
          </TouchableOpacity>

          {/* Profile Image & Camera Button */}
          {/* <View style={styles.profileContainer}>
          <Image source={selectedImage.source} style={styles.profileImage} />
          <TouchableOpacity
            style={styles.cameraIcon}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="camera" size={20} color="white" />
          </TouchableOpacity>
        </View> */}

          {/* <Text style={styles.title}>{user ? user.username : "Loading..."}</Text> */}

          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent2}>
                <Text style={styles.modalTitle}>Choose a Profile Picture</Text>

                {/* Grid Layout */}
                <View style={styles.imageGrid}>
                  {profileImages.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.imageContainer}
                      onPress={() => selectImage(image)}
                    >
                      <Image source={image.source} style={styles.modalImage} />
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.closeButton2}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText2}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.inputContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Your Location</Text>
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setActiveModal("location")}
                >
                  <Ionicons
                    style={styles.icon}
                    name="location-outline"
                    size={18}
                    color="#00838f"
                  />

                  <Text style={styles.input}>
                    {location || "Select Location"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.halfWidth}>
                <Text style={styles.label}>Your Gender</Text>
                <TouchableOpacity
                  style={styles.inputBox}
                  onPress={() => setActiveModal("gender")}
                >
                  <Ionicons
                    name={gender === "FEMALE" ? "female" : "male"}
                    size={20}
                    color="gray"
                    style={styles.icon}
                  />
                  <Text style={styles.input}>{gender || "Select Gender"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.label}>Your Birthday</Text>
            <View style={styles.dateBoxContainer}>
              {/* Day Box */}
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setActiveModal("day")}
              >
                <Text style={styles.dateBoxText}>{selectedDay || "Day"}</Text>
              </TouchableOpacity>

              {/* Month Box */}
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setActiveModal("month")}
              >
                <Text style={styles.dateBoxText}>
                  {selectedMonth || "Month"}
                </Text>
              </TouchableOpacity>

              {/* Year Box */}
              <TouchableOpacity
                style={styles.dateBox}
                onPress={() => setActiveModal("year")}
              >
                <Text style={styles.dateBoxText}>{selectedYear || "Year"}</Text>
              </TouchableOpacity>
            </View>

            {/* Render the modal */}
            <SelectionModal />

            <Text style={styles.label}>Your Weight</Text>
            <View style={styles.inputBox}>
              <WeightIcon size={5} color="#00838f" />
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
              />
            </View>

            <Text style={styles.label}>Your Height</Text>
            <View style={styles.inputBox}>
              <HeightIcon size={5} color="#00838f" />
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
    </ImageBackground>
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
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    padding: 5,
    paddingTop: 60,
    alignItems: "center",
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  datePicker: {
    flex: 1,
    marginHorizontal: 2,
    backgroundColor: "#f4f6f7",
    borderRadius: 10,
    height: 60,
    justifyContent: "center",
  },
  datePickerItem: {
    height: 50,
    width: "100%",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
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
  dateBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  dateBox: {
    flex: 1,
    marginHorizontal: 3,
    backgroundColor: "#f4f6f7",
    borderRadius: 50,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  dateBoxText: {
    fontSize: 10,
    color: "black",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#f0f8ff",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#63c5da",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgb(0, 144, 177)",
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    width: "90%",
    marginTop: 90,
  },
  label: {
    fontSize: 9,
    color: "#575757",
    marginBottom: 4,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 6,
    borderRadius: 50,
    marginBottom: 7,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 9,
    color: "black",
    marginLeft: 12,
    paddingVertical: 3, // Add some padding for better touch area
  },
  selectTextStyle: {
    fontSize: 16,
    color: "#333", // Text color for selected item
  },
  initValueTextStyle: {
    fontSize: 16,
    color: "#888", // Text color for initial value (placeholder)
  },
  icon: {
    marginLeft: 5,
    color: "#3498db",
  },
  picker: {
    flex: 1,
    fontSize: 10,
    overflow: "hidden",
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 0,
    textAlign: "center",
    color: "white",
  },
  weIcon: {
    marginTop: 55,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Add transparency for background
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
  modalContent2: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "90%", // Adjust width as needed
    maxHeight: "80%", // Limit height
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginVertical: 10,
  },
  imageContainer: {
    width: "33%", // 3 columns (adjust as needed)
    padding: 5,
    aspectRatio: 1, // Keep images square
  },
  modalImage: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  // container: {
  //   backgroundColor: '#00bcd4',
  //   padding: 5,
  //   paddingTop: 60,
  //   alignItems: 'center',
  // },
  profileContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    marginTop: 22,
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: "#fff",
    borderWidth: 5,
  },
});

export default EditProfile;
