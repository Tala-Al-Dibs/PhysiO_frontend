import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from "react-native";

const HelpScreen = () => {
    const [search, setSearch] = useState("");
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigation = useNavigation();
  
  React.useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  
  const faqs = [
    { question: "How do I reset my password?", answer: "Go to Settings > Change Password and follow the instructions." },
    { question: "How do I contact support?", answer: "You can email us at support@example.com or use the chat feature." },
    { question: "How do I update my profile?", answer: "Go to Profile > Edit Profile to update your details." },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How Can We Help You?</Text>
      
      <TextInput 
        style={styles.searchBar} 
        placeholder="Search for help..." 
        value={search} 
        onChangeText={setSearch} 
      />

      <ScrollView style={styles.faqContainer}>
        {faqs.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.faqItem} 
            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
          >
            <Text style={styles.faqQuestion}>{item.question}</Text>
            {expandedIndex === index && <Text style={styles.faqAnswer}>{item.answer}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0E7E94",
    textAlign: "center",
    marginTop:60 , 
    marginBottom: 20,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    marginBottom: 15,
  },
  faqContainer: {
    flex: 1,
  },
  faqItem: {
    backgroundColor: "#F0F0F0",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "bold",
  },
  faqAnswer: {
    fontSize: 12,
    marginTop: 5,
    color: "#555",
  },
  contactButton: {
    backgroundColor: "#0E7E94",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 100,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default HelpScreen;
