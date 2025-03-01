import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, Text, View, ActivityIndicator } from 'react-native';


const API_URL = 'http://192.168.1.117:8080/api/problems'; // Replace with your machine's IP address
const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0VXNlciIsImlhdCI6MTc0MDg1MDM1OSwiZXhwIjoxNzQwOTM2NzU5fQ.xaqC1BmG2eoVErIbvgjY-yzBzSGSPLpMeYm9Pv15lM0'; // Replace with actual token (retrieve it dynamically in production)

export default function TabTwoScreen() {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        console.log('Fetching problem from:', `${API_URL}/1`); // Log the URL
        const response = await fetch(`${API_URL}/1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Response status:', response.status); // Log the status
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Response data:', data); // Log the response data
        setProblem(data);
      } catch (error) {
        console.error('Failed to fetch problem:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, []); // Empty dependency array

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!problem) {
    return <Text style={styles.errorText}>Problem not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{problem.name}</Text>
      <Text style={styles.description}>{problem.description}</Text>

      {problem.image && (
        <Image
          source={{ uri: problem.image.url }} // Assuming the image URL is part of the problem object
          style={styles.image}
        />
      )}
    </View>
  );
}

interface Problem {
  id: number;
  name: string;
  description: string;
  image?: { url: string }; // Optional field
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});