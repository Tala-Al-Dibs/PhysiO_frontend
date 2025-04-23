import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SPRINGPORT8080, getCurrentToken, getCurrentUserId } from "@/constants/apiConfig";
import IconComponent from "@/components/svgIcons/problems/ProblemsIconsWithColor";
import {
  PremiumPrize,
  GoldPrize,
  BronzePrize,
  SilverPrize,
} from "@/components/svgIcons/prize/PrizeIcons";
import { ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface Prize {
  prizeID: number;
  prizeDescriprion: string | null;
  day: string;
  month: string;
  prizeType: "BRONZE" | "SILVER" | "GOLD" | "PREMIUM";
  problem: {
    problemID: number;
    name: string;
    image: {
      url: string;
    };
  };
}

export default function Prizes() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getCurrentToken();
        const id = await getCurrentUserId();
        setBearerToken(token);
        setUserId(Number(id));
      } catch (error) {
        console.error("Error initializing auth:", error);
        setError("Failed to initialize authentication");
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

   useEffect(() => {
    const fetchPrizes = async () => {
      if (!bearerToken || !userId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${SPRINGPORT8080}/api/prizes/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch prizes: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Expected array but got different data structure");
        }

        setPrizes(data);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error("Error fetching prizes:", error);
        setError(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, [bearerToken, userId, fadeAnim]);

  const getMedalIcon = (type: string) => {
    const iconSize = 24;
    switch (type) {
      case "BRONZE":
        return <BronzePrize />;
      case "SILVER":
        return <SilverPrize />;
      case "GOLD":
        return <GoldPrize />;
      case "PREMIUM":
        return <PremiumPrize />;
      default:
        return <BronzePrize />;
    }
  };

  const getPrizeColor = (type: string) => {
    switch (type) {
      case "BRONZE":
        return "#f8e9d1";
      case "SILVER":
        return "#f5f5f5";
      case "GOLD":
        return "#fff9e6";
      case "PREMIUM":
        return "#e6f7ff";
      default:
        return "#f8e9d1";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0CA7BD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!prizes || prizes.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="trophy-outline" size={48} color="#0CA7BD" />
        <Text style={styles.emptyText}>
          No rewards yet. Keep up your exercises!
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={{ backgroundColor: "white", height: 400 }}>
        <ImageBackground
          source={require("../../assets/images/Prizes-header-image.png")}
          style={styles.headerImage}
          resizeMode="cover"
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="keyboard-arrow-left" size={50} color="white" />
          </TouchableOpacity>
          <View style={styles.overlayCard}>
            {/* Total Count - Large and Prominent */}
            <View style={styles.totalCountContainer}>
              <Ionicons name="trophy" size={28} color="#FFD700" />
              <Text style={styles.totalCountText}>{prizes.length}</Text>
              <Text style={styles.totalCountLabel}>Total Rewards</Text>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Tier Breakdown */}
            <View style={styles.rewardsStats}>
              <View style={styles.rewardStat}>
                <PremiumPrize />
                <Text style={styles.rewardCount}>
                  {prizes.filter((p) => p.prizeType === "PREMIUM").length}
                </Text>
                <Text style={styles.rewardLabel}>Diamond</Text>
              </View>

              <View style={styles.rewardStat}>
                <GoldPrize />
                <Text style={styles.rewardCount}>
                  {prizes.filter((p) => p.prizeType === "GOLD").length}
                </Text>
                <Text style={styles.rewardLabel}>Gold</Text>
              </View>

              <View style={styles.rewardStat}>
                <SilverPrize />
                <Text style={styles.rewardCount}>
                  {prizes.filter((p) => p.prizeType === "SILVER").length}
                </Text>
                <Text style={styles.rewardLabel}>Silver</Text>
              </View>

              <View style={styles.rewardStat}>
                <BronzePrize />
                <Text style={styles.rewardCount}>
                  {prizes.filter((p) => p.prizeType === "BRONZE").length}
                </Text>
                <Text style={styles.rewardLabel}>Bronze</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header Image with Overlay Card */}

          {/* Tier Cards */}
          <View style={styles.tierContainer}>
            <View style={[styles.tierCard, styles.diamondCard]}>
              <PremiumPrize />
              <Text style={styles.tierText}>DIAMOND</Text>
            </View>

            <View style={[styles.tierCard, styles.goldCard]}>
              <GoldPrize />
              <Text style={styles.tierText}>GOLD</Text>
            </View>

            <View style={[styles.tierCard, styles.silverCard]}>
              <SilverPrize />
              <Text style={styles.tierText}>SILVER</Text>
            </View>

            <View style={[styles.tierCard, styles.bronzeCard]}>
              <BronzePrize />
              <Text style={styles.tierText}>BRONZE</Text>
            </View>
          </View>

          {/* Greeting */}
          <View
            style={{
              borderLeftWidth: 4,
              borderLeftColor: "#0CA7BD",
              marginHorizontal: 20,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Text style={styles.greeting}>Your Rewards</Text>
          </View>
          {prizes.map((prize) => (
            <Animated.View
              key={prize.prizeID}
              style={[
                styles.prizeCard,
                {
                  backgroundColor: getPrizeColor(prize.prizeType),
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.cardHeader}>
                {getMedalIcon(prize.prizeType)}
                <Text style={styles.prizeType}>{prize.prizeType}</Text>
                <Text style={styles.prizeDate}>{formatDate(prize.day)}</Text>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.iconWrapper}>
                  <IconComponent problem={prize.problem.name} />
                </View>
                <View style={styles.textContent}>
                  <Text style={styles.problemName}>{prize.problem.name}</Text>
                  {prize.prizeDescriprion && (
                    <Text style={styles.prizeDescription}>
                      {prize.prizeDescriprion}
                    </Text>
                  )}
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#064D57",
    marginBottom: 24,
    textAlign: "center",
  },
  prizeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginHorizontal: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 12,
  },
  prizeType: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
    color: "#333",
    textTransform: "capitalize",
  },
  prizeDate: {
    fontSize: 13,
    color: "#666",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  textContent: {
    flex: 1,
  },
  problemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064D57",
    marginBottom: 4,
  },
  prizeDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    maxWidth: "80%",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4757",
    textAlign: "center",
    marginTop: 16,
  },
  headerImage: {
    width: "100%",
    height: 200,
    marginBottom: 60, // Space for the overlay card to extend
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },

  rewardsTitle: {
    fontSize: 16,
    color: "#666",
  },
  rewardsAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#064D57",
    marginTop: 4,
  },
  tierContainer: {
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tierCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  diamondCard: {
    backgroundColor: "#e6f7ff",
    borderLeftWidth: 4,
    borderLeftColor: "#4facfe",
  },
  goldCard: {
    backgroundColor: "#fff9e6",
    borderLeftWidth: 4,
    borderLeftColor: "#ffd700",
  },
  silverCard: {
    backgroundColor: "#f5f5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#c0c0c0",
  },
  bronzeCard: {
    backgroundColor: "#f8e9d1",
    borderLeftWidth: 4,
    borderLeftColor: "#cd7f32",
  },
  tierText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 20,
  },
  overlayCard: {
    position: "absolute",
    bottom: -170,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
  },
  totalCountContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  totalCountText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#064D57",
    marginVertical: 4,
  },
  totalCountLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.08)",
    marginBottom: 16,
  },
  rewardsStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rewardStat: {
    alignItems: "center",
    minWidth: 60,
  },
  rewardCount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#064D57",
    marginVertical: 4,
  },
  rewardLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textTransform: "uppercase",
  },
});
