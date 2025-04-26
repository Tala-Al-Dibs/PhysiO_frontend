import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Physiotherapist } from "@/components/expolre/types/types";

const { width } = Dimensions.get("window");

interface DetailsContainerProps {
  physiotherapist: Physiotherapist;
}

const formatPhoneNumber = (phone?: string) => {
  if (!phone) return "Not available";

  const cleaned = phone.toString().replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `0${cleaned.substring(0, 2)}-${cleaned.substring(
      2,
      5
    )}-${cleaned.substring(5)}`;
  }
  return `0${cleaned}`;
};

const DetailsContainer = ({ physiotherapist }: DetailsContainerProps) => {
  return (
    <View style={styles.container}>
      {/* Phone Number Card */}
      <View style={[styles.card, styles.phoneCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, styles.primaryBg]}>
            <Feather name="phone" size={14} color="white" />
          </View>
          <Text style={styles.cardTitle}>Contact</Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.phoneNumber} selectable>
            {formatPhoneNumber(physiotherapist.phonenumber)}
          </Text>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() =>
              Linking.openURL(`tel:${physiotherapist.phonenumber}`)
            }
          >
            <Feather name="phone-call" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Card */}
      <View style={[styles.card, styles.addressCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, styles.secondaryBg]}>
            <Feather name="map-pin" size={14} color="white" />
          </View>
          <Text style={styles.cardTitle}>Address</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {physiotherapist.address || "Address not specified"}
        </Text>
        <MaterialCommunityIcons
          name="map-outline"
          size={40}
          color="rgba(12, 167, 189, 0.1)"
          style={styles.mapIcon}
        />
      </View>

      {/* Price Card */}
      <View style={[styles.card, styles.priceCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, styles.accentBg]}>
            <FontAwesome name="shekel" size={12} color="white" />
          </View>
          <Text style={styles.cardTitle}>Price Per Session</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceValue}>
            {physiotherapist.price
              ? `₪${physiotherapist.price}`
              : "Not specified"}
          </Text>
        </View>
      </View>

      {/* Location Card */}
      <TouchableOpacity
        style={[styles.card, styles.locationCard]}
        activeOpacity={0.8}
        onPress={() => Linking.openURL(physiotherapist.addressLink)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, styles.darkBg]}>
            <FontAwesome name="map-o" size={14} color="white" />
          </View>
          <Text style={styles.cardTitle}>Location</Text>
        </View>
        <View style={styles.locationAction}>
          <Text style={styles.locationText}>Open Maps</Text>
          <View style={styles.arrowCircle}>
            <Feather name="arrow-up-right" size={14} color="#064D57" />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#064D57",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
    height: 100,
    justifyContent: "space-between",
  },
  phoneCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#0CA7BD",
  },
  addressCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#FFAC33",
    position: "relative",
  },
  priceCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#FF8B33",
  },
  locationCard: {
    borderLeftWidth: 3,
    borderLeftColor: "#064D57",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  primaryBg: {
    backgroundColor: "#0CA7BD",
  },
  secondaryBg: {
    backgroundColor: "#FFAC33",
  },
  accentBg: {
    backgroundColor: "#FF8B33",
  },
  darkBg: {
    backgroundColor: "#064D57",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#064D57",
    letterSpacing: 0.5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0CA7BD",
  },
  callButton: {
    backgroundColor: "#0CA7BD",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0CA7BD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    color: "#333",
    paddingRight: 30,
  },
  mapIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
    opacity: 0.3,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF8B33",
  },
  locationAction: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064D57",
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(6, 77, 87, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DetailsContainer;
