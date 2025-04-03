import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function profile() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
          <Text>Say Bye!</Text>
          <TouchableOpacity
            onPress={() => {
              // Navigate to the main tabs screen and update state to hide the intro
              router.push('../(app)');
            }}
            style={{
              backgroundColor: '#0CA7BD',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              marginTop: 20,
            }}
          >
            <Text style={{ color: 'white', fontSize: 18 }}>Leave</Text>
          </TouchableOpacity>
        </View>
  )
}