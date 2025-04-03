import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Feather, FontAwesome } from "@expo/vector-icons";
import AddressLinkIcon from "@/components/svgIcons/location/AddressLinkIcon";
import { Physiotherapist } from "@/app/types/types";

interface DetailsContainerProps {
  physiotherapist: Physiotherapist;
}

const DetailsContainer = ({ physiotherapist }: DetailsContainerProps) => {
  return (
    <View style={styles.detailsContainer}>
      {/* Phone Number */}
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Feather name="phone" size={24} color="#0CA7BD" style={styles.icon} />
          <View>
            <Text style={styles.detailLabel}>Phone Number</Text>
            <Text style={styles.detailValue}>
              {physiotherapist.phonenumber || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Location (City) */}
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Feather
            name="map-pin"
            size={24}
            color="#0CA7BD"
            style={styles.icon}
          />
          <View>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={[styles.detailValue, styles.address]}>
              {physiotherapist.address || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Price */}
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <FontAwesome
            name="money"
            size={24}
            color="#0CA7BD"
            style={styles.icon}
          />
          <View>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>
              ₪{physiotherapist.price || "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Address Link (Google Maps) */}
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <AddressLinkIcon style={[styles.icon]} />
          <View>
            <Text style={styles.detailLabel}>Location</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(physiotherapist.addressLink)}
              style={styles.linkContainer}
            >
              <Text style={[styles.detailValue]}>Open Map</Text>
              <Feather
                name="arrow-right"
                size={20}
                color="#0CA7BD"
                style={styles.arrowIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  address: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 12,
    paddingTop: 5,
    fontWeight: "bold",
    color: "rgba(56, 56, 56, 0.7)",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  detailBox: {
    width: "48%",
    height: "40%",
    padding: 16,
    paddingTop: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "rgba(12, 167, 189, 0.2)",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  icon: {
    marginRight: 10,
    marginTop: 25,
  },
  detailLabel: {
    fontSize: 15,
    color: "rgba(56, 56, 56, 0.7)",
    marginBottom: 6,
    marginLeft: -35,
  },
  detailValue: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    fontSize: 16,
    paddingTop: 5,
    fontWeight: "bold",
    color: "rgba(56, 56, 56, 0.7)",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrowIcon: {
    marginLeft: 5,
    paddingTop: 5,
  },
});

export default DetailsContainer;
