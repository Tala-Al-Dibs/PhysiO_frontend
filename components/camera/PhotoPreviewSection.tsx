import { View, Text, TouchableOpacity, SafeAreaView, Image, StyleSheet, Alert } from 'react-native';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.1.117:8080/api/reports'; // Replace with your actual API base URL
const USER_ID = 1; // Replace with the dynamic user ID

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJUZXN0VXNlciIsImlhdCI6MTc0MDg1MDM1OSwiZXhwIjoxNzQwOTM2NzU5fQ.xaqC1BmG2eoVErIbvgjY-yzBzSGSPLpMeYm9Pv15lM0"; // Replace with dynamic token

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
}) => {
    const router = useRouter();

    const uploadImage = async () => {
        try {
            const formData = new FormData();
    
            // Append the report part with Content-Type: application/json
            formData.append("report", {
                uri: "data:application/json;base64," + btoa(JSON.stringify({})), // Empty JSON object
                name: 'report.json', // Name of the file
                type: 'application/json', // MIME type of the file
            } as any); // Cast the object to `any` to bypass TypeScript errors
    
            // Append the image file
            formData.append("image", {
                uri: photo.uri, // Use the URI of the captured photo
                name: 'image.jpg', // Name of the file
                type: 'image/jpeg', // MIME type of the file
            } as any); // Cast the object to `any` to bypass TypeScript errors
    
            console.log("Uploading image...");
    
            const response = await fetch(`${API_URL}/${USER_ID}/image`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    "Accept": "application/json",
                    // Do NOT set "Content-Type": "multipart/form-data" manually
                },
                body: formData,
            });
    
            const responseData = await response.json();
            console.log("Upload response:", responseData);
    
            if (response.ok) {
                Alert.alert("Success", "Image uploaded successfully!");
                router.push("/(camera)/ScanImage");
            } else {
                throw new Error(`Upload failed: ${response.status}`);
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            Alert.alert("Error", "Failed to upload image.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                <Image style={styles.previewConatiner} source={{ uri: photo.uri }} />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                    <Feather name='x' size={40} color='#FF4E33' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={uploadImage}>
                    <Feather name='check' size={40} color='#0CA7BD' />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
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
        justifyContent: 'center',
        alignItems: "center",
    },
    previewConatiner: {
        width: '100%',
        height: '95%',
        borderRadius: 15,
        paddingTop: 20,
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "space-between",
        width: '90%',
        marginBottom: 20,
    },
    button: {
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    }
});

export default PhotoPreviewSection;