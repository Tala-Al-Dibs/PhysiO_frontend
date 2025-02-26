import { View, Text, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ScanImage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const uri = Array.isArray(params.uri) ? params.uri[0] : params.uri; // Ensure it's a string

  // Automatically navigate after 5 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("../(app)"); // Redirect to index.tsx
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup to avoid memory leaks
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: 'white', fontSize: 20 }}>Processing Image...</Text>
      {uri && <Image source={{ uri }} style={{ width: 300, height: 400, marginTop: 20 }} />}
    </View>
  );
}
