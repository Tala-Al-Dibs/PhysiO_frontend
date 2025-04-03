import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  isSearchExpanded: boolean;
  onToggleSearch: () => void;
  animation: Animated.Value;
  onBackPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  isSearchExpanded,
  onToggleSearch,
  animation,
  onBackPress,
}) => {
  return (
    <Animated.View style={styles.searchContainer}>
      {isSearchExpanded && (
        <TouchableOpacity style={styles.arrowButton} onPress={onBackPress}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
      )}

      <View style={styles.searchBarWrapper}>
        <Feather
          name="search"
          size={20}
          color="#000"
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.searchBar,
            isSearchExpanded && styles.searchBarExpanded,
          ]}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={onToggleSearch}
          onSubmitEditing={onSearchSubmit}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    width: "100%",
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchBar: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
    paddingLeft: 10,
    borderRadius: 25,
    textAlign: "left",
  },
  searchBarExpanded: {
    height: 50,
    borderRadius: 10,
  },
  arrowButton: {
    marginRight: 10,
  },
});

export default SearchBar;
