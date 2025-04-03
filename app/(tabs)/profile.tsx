import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import ForwordHeadIcon from "@/components/svgIcons/problem/ForwordHeadIcon";

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const API_URL = "http://192.168.121.135:8080/api/";
  const BEARER_TOKEN ="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0VXNlciIsImlhdCI6MTc0MjQ1OTMzNywiZXhwIjoxNzQyNTQ1NzM3fQ.g8C__IYmAf_eyDjTCbxEXlkUYnrA_ChOmw2ivHiRh1s";
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user from:", `${API_URL}users/1`);
        const response = await fetch(`${API_URL}users/1`, {
          method: "GET",
          headers: {            Authorization: `Bearer ${BEARER_TOKEN}`,
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

  const profileImages = [
    require("@/assets/images/profile.png"),
    require("@/assets/images/profile2pic.jpg"),
    require("@/assets/images/profile3pic.jpg"),
    require("@/assets/images/profile4pic.jpg"),
    require("@/assets/images/profile6pic.jpg"),
    require("@/assets/images/profile7pic.jpg"),
  ];
  
 const [selectedImage, setSelectedImage] = useState(profileImages[0]);

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    // Adjust the age if the birthday hasn't occurred yet this year
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
    }, [])
  );
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#63c5da", "#ffffff"]}
        style={styles.background}
      />

      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <Image
          source={selectedImage}
          style={styles.profileImage}
        />
        <TouchableOpacity
          style={styles.editIcon}
          onPress={() => router.push("../(profile)/editProfile")}
        >
          <Ionicons name="pencil" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{user ? user.username : "Loading..."}</Text>

      <View style={styles.genderIcon}>
        <Ionicons
          name={profile?.gender === "Female" ? "female" : "male"}
          size={23}
          color="orange"
        />
      </View>

      <Text style={styles.location}>
        {profile ? profile.location + "..." : "Loading..."}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>
            {profile ? calculateAge(profile.dateOfBirth)+" " : "-"}
            <Text style={styles.infoUnit}>Ys</Text>{" "}
            {/* <Text style={styles.or}>|</Text> */}
          </Text>
          <Text style={styles.infoLabel}>Age </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>
            {profile ? profile.weight : "Loading..."}
            <Text style={styles.infoUnit}>Kg</Text>{"  "}
            {/* <Text style={styles.or}>|</Text> */}
          </Text>
          <Text style={styles.infoLabel}>Weight </Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoNumber}>
            {profile ? profile.height : "Loading..."}
            <Text style={styles.infoUnit}>cm</Text>
            <Text style={styles.or}> </Text>
          </Text>
          <Text style={styles.infoLabel}>Height </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Problems</Text>
      <View style={styles.problemList}>
        <TouchableOpacity style={styles.problemItem}>
          <ForwordHeadIcon color="#3498db"></ForwordHeadIcon>
          <Text style={styles.problemText}>Forward Head</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.problemItem}>
          <ForwordHeadIcon color="#3498db"></ForwordHeadIcon>
          <Text style={styles.problemText}>Forward Head</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      {/* SETTINGS MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>General Setting</Text>

            <TouchableOpacity style={styles.modalOption}   onPress={() => router.push("../(profile)/privacy")} >
              <Ionicons name="lock-closed" size={20} color="#0CA7BD" />
              <Text style={styles.modalText}>Privacy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#F39C12" />
              <Text style={styles.modalText}>Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption}  onPress={() => router.push("../(profile)/help")}>
              <Ionicons name="help-circle" size={20} color="#3498db" />
              <Text style={styles.modalText}>Help</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalOption}>
              <Ionicons name="log-out" size={20} color="red" />
              <Text style={styles.modalText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  // Styles...
  container: { flex: 1, alignItems: "center", backgroundColor: "white" },
  background: {
    position: "absolute",
    width: "100%",
    height: "40%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: { position: "absolute", top: 50, left: 20 },
  settingsButton: { position: "absolute", top: 50, right: 20 },
  profileContainer: { marginTop: 100, alignItems: "center" },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "white",
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#63c5da",
    borderRadius: 15,
    padding: 5,
  },
  name: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  location: { color: "#0CA7BD", marginTop: 5, fontSize: 12 },
  genderIcon: {
    position: "absolute",
    top: 249,
    left: 270,
    transform: [{ rotate: "0deg" }],
  },
  infoNumber: { fontSize: 17, fontWeight: "bold" },
  infoUnit: { fontSize: 10, color: "gray", fontWeight: "light" },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 22,
  },
  infoBox: { alignItems: "center" },
  or: { fontSize: 20, color: "#878787", fontWeight: "light" },
  infoLabel: { color: "#0CA7BD", fontSize: 11 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#878787",
    marginTop: 30,
    alignSelf: "flex-start",
    marginLeft: "6%",
  },
  problemList: { width: "90%", marginTop: 10 },
  problemItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f7",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  problemText: { flex: 1, marginLeft: 10, fontSize: 16 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  modalText: { fontSize: 16, marginLeft: 10 },
  closeButton: { marginTop: 15, alignItems: "center" },
  closeButtonText: { fontSize: 16, color: "#3498db" },
});
