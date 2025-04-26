import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import ProblemsListCards from "@/components/problem/ProblemsListCards";
import { clearAuthData, getUserId } from "@/constants/auth"; // Add these to your auth.ts
import { SPRINGPORT8080, getCurrentToken } from "@/constants/apiConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const API_URL = SPRINGPORT8080 + "/api/";
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userProblems, setUserProblems] = useState<{ name: string }[]>([]);

  // Define a type for the image map
  type ProfileImageMap = {
    default: any;
    avatar1: any;
    avatar2: any;
    avatar3: any;
    avatar4: any;
    avatar5: any;
    avatar6: any;
    avatar7: any;
    avatar8: any;
    avatar9: any;
    avatar10: any;
    avatar11: any;
  };

  // Create the map with the type
  const profileImageMap: ProfileImageMap = {
    default: require("../../assets/images/avatar/default.png"),
    avatar1: require("../../assets/images/avatar/avatar1.png"),
    avatar2: require("../../assets/images/avatar/avatar2.png"),
    avatar3: require("../../assets/images/avatar/avatar3.png"),
    avatar4: require("../../assets/images/avatar/avatar4.png"),
    avatar5: require("../../assets/images/avatar/avatar5.png"),
    avatar6: require("../../assets/images/avatar/avatar6.png"),
    avatar7: require("../../assets/images/avatar/avatar7.png"),
    avatar8: require("../../assets/images/avatar/avatar8.png"),
    avatar9: require("../../assets/images/avatar/avatar9.png"),
    avatar10: require("../../assets/images/avatar/avatar10.png"),
    avatar11: require("../../assets/images/avatar/avatar11.png"),
  };

  // Update the getProfileImage function
  const getProfileImage = (imageName?: string) => {
    if (!imageName) return require("../../assets/images/avatar/default.png");

    // Type assertion if you're sure imageName will be a valid key
    return (
      profileImageMap[imageName as keyof ProfileImageMap] ||
      require("../../assets/images/avatar/default.png")
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the token first
        const token = await getCurrentToken();
        setBearerToken(token);

        if (!token) {
          console.error("No authentication token available");
          router.replace("../(app)/index"); // Redirect to login if no token
          return;
        }

        // Get the current user's ID from storage
        const currentUserId = await getUserId();

        if (!currentUserId) {
          console.error("No user ID available");
          router.replace("../(app)/index");
          return;
        }
        // Fetch the current user's data using their ID
        const response = await fetch(`${API_URL}users/${currentUserId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data);

        const userID = data.userID;
        const profileResponse = await fetch(`${API_URL}profiles/${userID}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileResponse.ok) {
          throw new Error(`Error fetching profile: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        setProfile(profileData);

        // Fetch problems
        try {
          const problemsResponse = await fetch(
            `${API_URL}problems/user/${userID}/problems`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!problemsResponse.ok) {
            throw new Error(
              `Error fetching problems: ${problemsResponse.status}`
            );
          }

          const problemsData = await problemsResponse.json();

          if (
            Array.isArray(problemsData) &&
            problemsData.length > 0 &&
            typeof problemsData[0] === "object"
          ) {
            setUserProblems(problemsData);
          } else {
            console.log("No problems returned or unexpected format.");
            setUserProblems([]);
          }
        } catch (err) {
          console.error("Failed to fetch user problems:", err);
        }
      } catch (error) {
        console.error("Failed to fetch user or profile:", error);
      }
    };

    fetchData();
  }, []);

  const calculateAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return "-"; // Return dash or "Not specified" when no date exists

    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  useFocusEffect(
    useCallback(() => {
      setModalVisible(false);
    }, [])
  );

  const handleLogout = async () => {
    try {
      await clearAuthData();

      setBearerToken(null);
      setUser(null);
      setProfile(null);
      setUserProblems([]);

      setModalVisible(false);

      router.replace("../(app)/index");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert(
        "Logout Error",
        "Could not complete logout. Please try again."
      );
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#ffffff", flex: 1 }}>
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
            source={getProfileImage(profile?.profilePictureUri)}
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
              {profile ? calculateAge(profile.dateOfBirth) || "-" : "-"}
              <Text style={styles.infoUnit}> Ys</Text>
            </Text>
            <Text style={styles.infoLabel}>Age</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoNumber}>
              {profile ? profile.weight : "Loading..."}
              <Text style={styles.infoUnit}>Kg</Text>
              {"  "}
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
        <View style={{ width: "87%" }}>
          {userProblems.length > 0 ? (
            <ProblemsListCards
              problemList={userProblems.map((problem) => problem.name)}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 10, color: "#999" }}>
              No problems detected.
            </Text>
          )}
        </View>

        {/* SETTINGS MODAL */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>General Setting</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => router.push("../(profile)/privacy")}
              >
                <Ionicons name="lock-closed" size={20} color="#0CA7BD" />
                <Text style={styles.modalText}>Privacy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalOption}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={20}
                  color="#F39C12"
                />
                <Text style={styles.modalText}>Feedback</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => router.push("../(profile)/help")}
              >
                <Ionicons name="help-circle" size={20} color="#3498db" />
                <Text style={styles.modalText}>Help</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  Alert.alert(
                    "Confirm Logout",
                    "Are you sure you want to sign out?",
                    [
                      {
                        text: "Cancel",
                        style: "cancel",
                      },
                      {
                        text: "Logout",
                        onPress: handleLogout,
                        style: "destructive",
                      },
                    ]
                  );
                }}
              >
                <Ionicons name="log-out" size={20} color="red" />
                <Text style={[styles.modalText, { color: "red" }]}>Logout</Text>
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
      <View style={{ height: 100 }}></View>
    </ScrollView>
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
  container: { alignItems: "center", backgroundColor: "white", height: "100%" },
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
