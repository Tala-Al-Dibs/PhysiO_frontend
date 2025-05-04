import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Animated,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Tabs from "@/components/expolre/Tabs";
import FilterDropdown from "@/components/expolre/FilterDropdown";
import ProblemItem from "@/components/expolre/ProblemItem";
import PhysiotherapistItem from "@/components/expolre/PhysiotherapistItem";
import SearchBar from "@/components/expolre/SearchBar";

import { Problem, Physiotherapist } from "@/components/expolre/types/types";
import { useRouter } from "expo-router";
import {
  getSpringPort,
  getCurrentToken,
  getCurrentUserId,
} from "@/constants/apiConfig";
const LocationPrompt = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={styles.locationPromptContainer}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.locationPromptContent}>
      <Feather name="map-pin" size={24} color="#0CA7BD" />
      <View style={styles.locationPromptTextContainer}>
        <Text style={styles.locationPromptTitle}>Location Required</Text>
        <Text style={styles.locationPromptMessage}>
          Please set your location to see nearby physiotherapists
        </Text>
      </View>
      <Feather name="chevron-right" size={24} color="#0CA7BD" />
    </View>
  </TouchableOpacity>
);
const explore: React.FC = () => {
  const [API_URL, setAPI_URL] = useState("");
  const [BEARER_TOKEN, setBEARER_TOKEN] = useState<string | null>(null);
  const [USER_ID, set_USER_ID] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [userLocation, setUserLocation] = useState<string | null>(null); // Add state for user location

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const springPort = await getSpringPort();
        setAPI_URL(`${springPort}/api`);

        const token = await getCurrentToken();
        setBEARER_TOKEN(token);

        const userId = await getCurrentUserId();
        set_USER_ID(userId);
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchUserProblems(),
          fetchAllProblems(),
          fetchPhysiotherapists(),
          fetchUserProfile(), // Add fetching user profile
        ]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };
    if (API_URL && BEARER_TOKEN && USER_ID) {
      fetchData();
    }
  }, [API_URL, BEARER_TOKEN, USER_ID]);
  // Add function to fetch user profile
  const fetchUserProfile = async () => {
    if (!USER_ID || !BEARER_TOKEN) return;

    try {
      const response = await fetch(`${API_URL}/profiles/${USER_ID}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserLocation(data.location); // Set the user's location from profile
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };
  const [userProblems, setUserProblems] = useState<Problem[]>([]);
  const [allProblems, setAllProblems] = useState<Problem[]>([]);
  const [physiotherapists, setPhysiotherapists] = useState<Physiotherapist[]>(
    []
  );
  const router = useRouter();
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [filteredPhysiotherapists, setFilteredPhysiotherapists] = useState<
    Physiotherapist[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [latestSearches, setLatestSearches] = useState<string[]>([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"problems" | "physiotherapists">(
    "problems"
  );
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<Problem | Physiotherapist>
  >([]);
  const [isFilteredByLocation, setIsFilteredByLocation] = useState(false);
  const [filterOption, setFilterOption] = useState<"location" | "price" | null>(
    null
  );
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const fetchUserProblems = async () => {
    if (!USER_ID || !BEARER_TOKEN) return;

    try {
      const response = await fetch(
        `${API_URL}/problems/user/${USER_ID}/problems`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserProblems(data);
    } catch (error) {
      console.error("Failed to fetch user problems:", error);
      setUserProblems([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchUserProblems(),
          fetchAllProblems(),
          fetchPhysiotherapists(),
        ]);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    };

    if (API_URL && BEARER_TOKEN && USER_ID) {
      fetchData();
    }
  }, [API_URL, BEARER_TOKEN, USER_ID]);
  const fetchAllProblems = async () => {
    if (!BEARER_TOKEN) return;

    try {
      const response = await fetch(`${API_URL}/problems`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAllProblems(data);
    } catch (error) {
      console.error("Failed to fetch all problems:", error);
      setAllProblems([]);
    }
  };

  const fetchPhysiotherapists = async () => {
    if (!BEARER_TOKEN) return;

    try {
      const response = await fetch(`${API_URL}/physiotherapists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPhysiotherapists(data);
      setFilteredPhysiotherapists(data);
    } catch (error) {
      console.error("Failed to fetch physiotherapists:", error);
      setPhysiotherapists([]);
      setFilteredPhysiotherapists([]);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchUserProblems();
      await fetchAllProblems();
      await fetchPhysiotherapists();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);

    if (trimmedQuery === "") {
      setFilteredProblems(allProblems);
      setFilteredPhysiotherapists(physiotherapists);
      setShowResults(false);
      setSuggestions([]);
      return;
    }

    const lowerCaseQuery = trimmedQuery.toLowerCase();

    // Filter problems - now using startsWith instead of includes
    const filteredProblems = allProblems.filter((problem) =>
      problem.name.toLowerCase().startsWith(lowerCaseQuery)
    );
    setFilteredProblems(filteredProblems);

    // Filter physiotherapists - now using startsWith instead of includes
    const filteredPhysiotherapists = physiotherapists.filter(
      (physiotherapist) =>
        physiotherapist.clinicName.toLowerCase().startsWith(lowerCaseQuery)
    );
    setFilteredPhysiotherapists(filteredPhysiotherapists);

    // Combine suggestions
    const combinedSuggestions = [
      ...filteredProblems,
      ...filteredPhysiotherapists,
    ];
    setSuggestions(combinedSuggestions);

    // Auto-switch tabs if no results in current tab
    if (
      activeTab === "problems" &&
      filteredProblems.length === 0 &&
      filteredPhysiotherapists.length > 0
    ) {
      setActiveTab("physiotherapists");
    } else if (
      activeTab === "physiotherapists" &&
      filteredPhysiotherapists.length === 0 &&
      filteredProblems.length > 0
    ) {
      setActiveTab("problems");
    }
  };
  const handleSearchSubmit = () => {
    Keyboard.dismiss();

    // If empty query, show all results
    if (searchQuery.trim() === "") {
      setFilteredProblems(allProblems);
      setFilteredPhysiotherapists(physiotherapists);
    }

    setShowResults(true);
  };

  const addToLatestSearches = (name: string) => {
    setLatestSearches((prev) =>
      [name, ...prev.filter((item) => item !== name)].slice(0, 3)
    );
  };
  const deleteLatestSearchItem = (index: number) => {
    setLatestSearches((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFilterByLocation = () => {
    if (!userLocation) {
      // Don't proceed with filtering if no location
      return;
    }

    if (isFilteredByLocation) {
      const originalResults = physiotherapists.filter((physiotherapist) =>
        physiotherapist.clinicName
          .toLowerCase()
          .startsWith(searchQuery.toLowerCase())
      );
      setFilteredPhysiotherapists(originalResults);
    } else {
      const filtered = physiotherapists.filter(
        (physiotherapist) =>
          physiotherapist.location === userLocation &&
          physiotherapist.clinicName
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase())
      );
      setFilteredPhysiotherapists(filtered);
    }
    setIsFilteredByLocation(!isFilteredByLocation);
  };
  const handleSortByPrice = () => {
    const sortedByPrice = [...filteredPhysiotherapists].sort(
      (a, b) => a.price - b.price
    );
    setFilteredPhysiotherapists(sortedByPrice);
  };
  const onBackPress = () => {
    setIsSearchExpanded(false);
    setSearchQuery("");
    setShowResults(false);
    setSuggestions([]);
  };

  const handleShowAll = () => {
    setIsFilteredByLocation(false);
    setFilterOption(null);
    if (activeTab === "physiotherapists") {
      const filtered = physiotherapists.filter((physiotherapist) =>
        physiotherapist.clinicName
          .toLowerCase()
          .startsWith(searchQuery.toLowerCase())
      );
      setFilteredPhysiotherapists(filtered);
    } else if (activeTab === "problems") {
      const filtered = allProblems.filter((problem) =>
        problem.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
      setFilteredProblems(filtered);
    }
  };
  const onToggleSearch = () => {
    setIsSearchExpanded(true);
    setShowResults(false);
    setSuggestions([]);
  };

  const renderSuggestionItem = ({
    item,
  }: {
    item: Problem | Physiotherapist;
  }) => {
    const handlePress = () => {
      if ("clinicName" in item) {
        addToLatestSearches(item.clinicName);
        router.push({
          pathname: "/PhysiotherapistDetails",
          params: {
            physiotherapistID: item.physiotherapistID.toString(),
            token: BEARER_TOKEN, // Pass the current token
          },
        });
      } else {
        addToLatestSearches(item.name);
        router.push({
          pathname: "../(problem)/problem",
          params: {
            problem: item.name,
          },
        });
      }
    };

    return (
      <TouchableOpacity style={styles.suggestionItem} onPress={handlePress}>
        <Text style={styles.suggestionText}>
          {"clinicName" in item ? item.clinicName : item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onSearchSubmit={handleSearchSubmit}
        isSearchExpanded={isSearchExpanded}
        onToggleSearch={onToggleSearch}
        animation={animation}
        onBackPress={onBackPress}
      />

      {!isSearchExpanded && (
        <>
          <Text style={styles.sectionTitle}>Your Problems</Text>
          <FlatList
            data={userProblems}
            keyExtractor={(item, index) =>
              `${item?.id?.toString()}-${index}` || index.toString()
            }
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => (
              <ProblemItem
                item={item}
                onPress={() => {
                  addToLatestSearches(item.name),
                    router.push({
                      pathname: "../(problem)/problem",
                      params: {
                        problem: item.name, // Send only the problem name
                      },
                    });
                }}
                index={index}
              />
            )}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Feather name="alert-circle" size={80} color="#888" />
                <Text style={styles.noResultsText}>No problems found</Text>
              </View>
            }
          />
        </>
      )}

      {isSearchExpanded && (
        <>
          {/* Before Typing: Latest Searches */}
          {!showResults && searchQuery === "" && (
            <>
              <View style={styles.recentHeader}>
                <Text style={styles.sectionTitle}>Recent</Text>
                <TouchableOpacity onPress={() => setLatestSearches([])}>
                  <Text style={styles.deleteHistoryText}>Delete History</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.latestSearchesContainer}>
                {latestSearches.map((item, index) => (
                  <View key={index} style={styles.latestSearchItem}>
                    <Text style={styles.latestSearchText}>{item}</Text>
                    <TouchableOpacity
                      onPress={() => deleteLatestSearchItem(index)}
                    >
                      <Feather name="x" size={16} color="#666" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* After Typing: Search Results */}
          {showResults && (
            <>
              <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
              {activeTab === "problems" ? (
                <FlatList
                  data={filteredProblems}
                  keyExtractor={(item, index) =>
                    `${item?.id?.toString()}-${index}` || index.toString()
                  }
                  contentContainerStyle={{ paddingBottom: 100 }}
                  renderItem={({ item, index }) => (
                    <ProblemItem
                      item={item}
                      onPress={() => {
                        addToLatestSearches(item.name),
                          router.push({
                            pathname: "../(problem)/problem",
                            params: {
                              problem: item.name, // Send only the problem name
                            },
                          });
                      }}
                      index={index}
                    />
                  )}
                  ListEmptyComponent={
                    <View style={styles.noResultsContainer}>
                      <Feather name="search" size={80} color="#888" />
                      <Text style={styles.noResultsText}>
                        No problems found
                      </Text>
                    </View>
                  }
                />
              ) : (
                <>
                  <FilterDropdown
                    isDropdownVisible={isDropdownVisible}
                    onToggleDropdown={() =>
                      setIsDropdownVisible(!isDropdownVisible)
                    }
                    onShowAll={handleShowAll}
                    onFilterByLocation={handleFilterByLocation}
                    onSortByPrice={handleSortByPrice}
                  />

                  {/* Show location prompt if no location is set */}
                  {!userLocation && (
                    <LocationPrompt
                      onPress={() => router.push("../(profile)/editProfile")}
                    />
                  )}
                  <FlatList
                    data={filteredPhysiotherapists}
                    keyExtractor={(item, index) =>
                      `${item?.physiotherapistID?.toString()}-${index}` ||
                      index.toString()
                    }
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => (
                      <PhysiotherapistItem
                        item={item}
                        onPress={() => addToLatestSearches(item.clinicName)}
                      />
                    )}
                    ListEmptyComponent={
                      <View style={styles.noResultsContainer}>
                        <Feather name="user-x" size={80} color="#888" />
                        <Text style={styles.noResultsText}>
                          No physiotherapists found
                        </Text>
                      </View>
                    }
                  />
                </>
              )}
            </>
          )}

          {/* Suggestions */}
          {!showResults && searchQuery !== "" && (
            <>
              <Text style={styles.sectionTitle}>Suggestions</Text>
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) =>
                  ("clinicName" in item ? item.clinicName : item.name) +
                  index.toString()
                }
                renderItem={renderSuggestionItem}
                contentContainerStyle={styles.suggestionsList}
                ListEmptyComponent={
                  <View style={styles.noSuggestionsContainer}>
                    <Text style={styles.noSuggestionsText}>
                      No suggestions found
                    </Text>
                  </View>
                }
              />
            </>
          )}
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  locationPromptContainer: {
    backgroundColor: "#f0f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#d1f0f5",
  },
  locationPromptContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationPromptTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  locationPromptTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#064D57",
    marginBottom: 4,
  },
  locationPromptMessage: {
    fontSize: 14,
    color: "#666",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  noSuggestionsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  noSuggestionsText: {
    fontSize: 16,
    color: "#888",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  noResultsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 10,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  deleteHistoryText: {
    color: "#ff4444",
    fontSize: 14,
  },
  latestSearchesContainer: {
    paddingVertical: 10,
  },
  latestSearchItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  latestSearchText: {
    fontSize: 16,
    color: "#555",
  },
  suggestionsList: {
    paddingVertical: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default explore;
