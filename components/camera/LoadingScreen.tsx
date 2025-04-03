import { View, Text, StyleSheet, ActivityIndicator, Animated, Image, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

const LoadingScreen = ({ photo }: { photo: { uri: string } }) => {
  const scannerAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scannerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scannerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const translateY = scannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(15), hp(55)], // Move from top to bottom of the image
  });

  return (
    <ImageBackground source={{ uri: photo.uri }} blurRadius={20} style={styles.loadingContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Feather name="x" size={40} color="#0CA7BD" />
    </TouchableOpacity>
      <View style={styles.imageContainer}>
        {/* Display Captured Image */}
        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
        {/* Scanning Effect */}
        <Animated.View
          style={[
            styles.scannerLine,
            { transform: [{ translateY }] }, // Moves line up and down
          ]}
        />
      </View>

      <ActivityIndicator size="large" color="#0CA7BD" style={styles.loader} />
      <Text style={styles.loadingText}>Scanning Image...</Text>
    </ImageBackground>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  imageContainer: {
    width: wp(90),
    height: hp(70),
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#0CA7BD',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 30, // Adjust according to your layout
    left: 13,
    zIndex: 10, // Ensure it's above other elements
    // backgroundColor: 'rgba(12, 167, 189, 0.5)', // Optional: Adds some background to make it visible
    borderRadius: 50,
    padding: 0,
    alignSelf: 'flex-end',
  },
  scannerLine: {
    position: 'absolute',
    width: '100%',
    height: 5,
    backgroundColor: '#0CA7BD',
    opacity: 0.8,
  },
  loader: {
    marginTop: 20,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 10,
  },
});
