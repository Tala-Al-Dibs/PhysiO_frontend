import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import ScanIcon from '@/components/svgIcons/camera/ScanIcon';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

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
    if (cameraRef.current) {
      const options = {
        quality: 1,
        base64: true,
        exif: false,
      };
      const takedPhoto = await cameraRef.current.takePictureAsync(options);
      setPhoto(takedPhoto);
    }
  };

  const handleRetakePhoto = () => setPhoto(null);

  const handlePickImage = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: true,
    };
  
    console.log('Opening Image Picker...');
    launchImageLibrary(options, (response: ImagePickerResponse) => {
      console.log('Image Picker Response: ', response);
  
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // User selected an image, set the photo state
        const source = response.assets[0];
        if (source) {
          console.log('Image Selected: ', source.uri);
          setPhoto(source);
        }
      } else {
        console.log('No image selected or unexpected response:', response);
      }
    }).catch((error) => {
      console.error('Error launching image picker:', error);
    });
    const result = await launchImageLibrary(options);
  };

  if (photo) return <PhotoPreviewSection photo={photo} handleRetakePhoto={handleRetakePhoto} />;

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={44} color="#0CA7BD" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <ScanIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
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
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 50,
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
});
