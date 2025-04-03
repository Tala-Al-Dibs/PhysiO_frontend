// components/home/sideList.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { ListIcon } from "../svgIcons/home/homeIcons";

const { width } = Dimensions.get("window");

type MenuItem = {
  name: string;
  icon:
    | "person"
    | "settings"
    | "information-circle"
    | "log-out"
    | "trending-up"
    | "compass";
  action: () => void;
  isLogout?: boolean;
};

const SideList = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;

  const menuItems: MenuItem[] = [
    {
      name: "Profile",
      icon: "person",
      action: () => router.push("/profile"),
    },
    {
      name: "Progress",
      icon: "trending-up",
      action: () => router.push("/progress"),
    },
    {
      name: "Explore",
      icon: "compass",
      action: () => router.push("/explore"),
    },
    {
      name: "Settings",
      icon: "settings",
      action: () => router.push("/(sideList)/settings"),
    },
    {
      name: "About",
      icon: "information-circle",
      action: () => router.push("/(sideList)/about"),
    },
    {
      name: "Logout",
      icon: "log-out",
      action: () => router.push("/(app)"),
      isLogout: true,
    },
  ];

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={styles.menuButton}
      >
        <ListIcon />
      </TouchableOpacity>

      <Modal
        transparent
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        animationType="none"
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <Animated.View
            style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
          >
            <View style={styles.header}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsVisible(false)}
              >
                <Ionicons name="close" size={30} color="#064D57" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItemsContainer}>
              {menuItems
                .filter((item) => !item.isLogout)
                .map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => {
                      item.action();
                      setIsVisible(false);
                    }}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color="#064D57"
                      style={styles.menuIcon}
                    />
                    <Text style={styles.menuText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
              {menuItems
                .filter((item) => item.isLogout)
                .map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.logoutButton}
                    onPress={() => {
                      item.action();
                      setIsVisible(false);
                    }}
                    activeOpacity={0.6}
                  >
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color="#D32F2F"
                      style={styles.menuIcon}
                    />
                    <Text style={styles.logoutText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    padding: 10,
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  sidebar: {
    width: "75%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(6, 77, 87, 0.1)",
    paddingBottom: 20,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#064D57",
  },
  closeButton: {
    padding: 8,
  },
  menuItemsContainer: {
    gap: 8,
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(6, 77, 87, 0.05)",
    marginBottom: 8,
  },
  menuIcon: {
    marginRight: 16,
    width: 24,
    textAlign: "center",
  },
  menuText: {
    fontSize: 16,
    color: "#064D57",
    fontWeight: "500",
  },
  footer: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(6, 77, 87, 0.1)",
    marginTop: 20,
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(211, 47, 47, 0.08)",
  },
  logoutText: {
    fontSize: 16,
    color: "#D32F2F",
    fontWeight: "500",
  },
});

export default SideList;
