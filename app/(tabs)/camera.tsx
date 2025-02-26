import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import ScanIcon from '@/components/svgIcons/camera/ScanIcon';
import { AntDesign, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState, useEffect } from 'react';
import { Animated, Button, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const navigation = useNavigation();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [fadeAnim] = useState(new Animated.Value(1)); // Opacity animation
  const [scaleAnim] = useState(new Animated.Value(1)); // Scale animation
  const insets = useSafeAreaInsets();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>We need your permission to show the camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const animateCountdown = () => {
    fadeAnim.setValue(1); // Reset fade to fully visible
    scaleAnim.setValue(1); // Reset scale
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.5, // Scale up effect
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    if (isTimerActive) {
      let timeLeft = 5;
      setCountdown(timeLeft); // Start the countdown

      const timer = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        animateCountdown();

        if (timeLeft <= 0) {
          clearInterval(timer);
          setCountdown(null); // Hide countdown
          takePhoto(); // Take the photo after countdown
        }
      }, 1000);
    } else {
      await takePhoto();
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const options = { quality: 1, base64: true, exif: false };
    const takenPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(takenPhoto);
  };

  const handleRetakePhoto = () => setPhoto(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    // Now base64 should be available
    if (!result.canceled) {
      const base64 = result.assets[0].base64;
      setPhoto(result.assets[0]); // Set the photo state with the selected image
    }
    // 
  };

  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />;

  return (
    <View style={styles.container}>
      <View style={styles.upperButtons}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Feather name="x" size={44} color="#0CA7BD" />
      </TouchableOpacity>

      {/* Timer Button (Top Right) */}
      <TouchableOpacity 
        style={styles.timerButton} 
        onPress={() => setIsTimerActive(prev => !prev)}
      >
        <MaterialIcons 
          name="timer" 
          size={44} 
          color={isTimerActive ? "#0CA7BD" : "white"} 
        />
      </TouchableOpacity>
      </View>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
      {countdown !== null && (
          <Animated.View style={[styles.countdownContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </Animated.View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={44} color="#0CA7BD" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <ScanIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Feather name="image" size={44} color="#0CA7BD" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust according to your layout
    left: 40,
    zIndex: 10, // Ensure it's above other elements
    // backgroundColor: 'rgba(12, 167, 189, 0.5)', // Optional: Adds some background to make it visible
    borderRadius: 50,
    padding: 0,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // upperButtons: {
  //   flex: 1,
  //   flexDirection: 'row',
  // },
  upperButtons: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 10,
    backgroundColor: 'transparent', // This ensures there's no unwanted background
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  timerButton: {
    position: 'absolute',
    top: 40,
    right: 40, // Position it on the right side
    zIndex: 10,
    // backgroundColor: 'rgba(12, 167, 189, 0)',
    borderRadius: 50,
    padding: 10,
  },
  countdownContainer: {
    position: 'absolute',
    top: '35%',
    left: '33%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    // backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark semi-transparent background
    borderRadius: 50,
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  countdownText: {
    fontSize: 150, // Larger for better visibility
    color: 'white',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  permissionText: {
    color: 'white',
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: '#0CA7BD',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  
});
