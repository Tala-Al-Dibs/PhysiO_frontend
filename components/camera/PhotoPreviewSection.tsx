import { View, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Feather, FontAwesome6, Fontisto, Ionicons } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import { useRouter } from 'expo-router';


const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) => {
    const router = useRouter();  // ✅ Move useRouter() inside the component

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Image
                    style={styles.previewConatiner}
                    source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                    <Feather name='x' size={40} color='#FF4E33' />
                </TouchableOpacity>
                <TouchableOpacity
  style={styles.button}
  onPress={() => router.push({
    pathname: "/(camera)/ScanImage",
    params: { uri: photo.uri } // Send only the URI
  })}
>
                    <Feather name='check' size={40} color='#0CA7BD' />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '95%',
        height: 'auto',
        // backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewConatiner: {
        width: '100%',
        height: '95%',
        borderRadius: 15,
        paddingTop:20,
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "space-between",
        width: '90%',
        marginBottom:20,
    },
    button: {
        // backgroundColor: '#0CA7BD',
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    }

});


export default PhotoPreviewSection;