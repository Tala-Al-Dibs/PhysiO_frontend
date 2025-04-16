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
import { getSpringPort, getCurrentToken, getCurrentUserId} from "@/constants/apiConfig";

const DUMMY_USER_LOCATION = "BETHLEHEM";

const explore: React.FC = () => {
  const [API_URL, setAPI_URL] = useState("");
  const [BEARER_TOKEN, setBEARER_TOKEN] = useState<string | null>(null); 
  const [DUMMY_USER_ID, setDUMMY_USER_ID] = useState<string | null>(null); // Explicit type

  // Initialize auth data when component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      const springPort = await getSpringPort();
      setAPI_URL(`${springPort}/api`);
      
      const token = await getCurrentToken();
      setBEARER_TOKEN(token);
      
      const userId = await getCurrentUserId();
      setDUMMY_USER_ID(userId);
    };

    initializeAuth();
  }, []);
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
    try {
      const response = await fetch(
        `${API_URL}/problems/${DUMMY_USER_ID}/problems`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${BEARER_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUserProblems(data);
    } catch (error) {
      setUserProblems([]);
    }
  };

  const fetchAllProblems = async () => {
    try {
      const response = await fetch(`${API_URL}/problems`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAllProblems(data);
    } catch (error) {
      setAllProblems([]);
    }
  };

  const fetchPhysiotherapists = async () => {
    try {
      const response = await fetch(`${API_URL}/physiotherapists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setPhysiotherapists(data);
      setFilteredPhysiotherapists(data);
    } catch (error) {
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
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredProblems(allProblems);
      setFilteredPhysiotherapists(physiotherapists);
      setShowResults(false);
      setSuggestions([]);
      return;
    }

    const filteredProblems = allProblems.filter((problem) =>
      problem.name.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredProblems(filteredProblems);

    const filteredPhysiotherapists = physiotherapists.filter(
      (physiotherapist) =>
        physiotherapist.clinicName.toLowerCase().startsWith(query.toLowerCase())
    );
    setFilteredPhysiotherapists(filteredPhysiotherapists);

    const combinedSuggestions = [
      ...filteredProblems,
      ...filteredPhysiotherapists,
    ];
    setSuggestions(combinedSuggestions);

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

    if (searchQuery.trim() === "") {
      setFilteredProblems(allProblems);
      setFilteredPhysiotherapists(physiotherapists);
      setShowResults(true);
      return;
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
          physiotherapist.location === DUMMY_USER_LOCATION &&
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
          params: { physiotherapistID: item.physiotherapistID.toString() },
        });
      } else {
        addToLatestSearches(item.name);
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
