import { View, Text, Button, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function signIn() {
    const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
      <Text>Welcome to the App!</Text>
      <TouchableOpacity
        onPress={() => {
          // Navigate to the main tabs screen and update state to hide the intro
          router.push('../(tabs)/index');
        }}
        style={{
          backgroundColor: '#0CA7BD',
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Enter</Text>
      </TouchableOpacity>
    </View>
  );
}

signIn.options = {
    headerShown: false,
  };