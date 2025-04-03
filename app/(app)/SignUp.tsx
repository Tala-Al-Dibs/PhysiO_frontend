import { View, Text, TouchableOpacity, TouchableWithoutFeedback, TextInput, Alert, StyleSheet, ImageBackground, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import CustomKeyboardView from '@/components/CustomKeyboardView';
import { StatusBar } from 'expo-status-bar';
import { Feather, FontAwesome6, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import "../../global.css"
import GoogleLogo from '@/components/svgIcons/signin-signup/GoogleLogo';
import { useNavigation } from '@react-navigation/native';
import LogoSvg from '@/components/svgIcons/logo/LogoSvg';

export default function SignUp() {
    const router = useRouter();
    const userRef = useRef("");
    const passwordRef = useRef("");
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigation = useNavigation();
React.useLayoutEffect(() => {
  navigation.setOptions({ headerShown: false });
}, [navigation]);
  
    const handleRegister = async () => {
      if(!userRef.current || !passwordRef.current) {
        Alert.alert("Sign In", "Please fill all the fields")
        return;
      } 
      
  
      //login process
      
    }
  
    return (
      <ImageBackground source={require("../../assets/images/sign in.png")} // Replace with your image path
      style={styles.background}>
      <TouchableWithoutFeedback>
        <CustomKeyboardView>
        <StatusBar style="dark" />
      
      <View style={{paddingTop: hp(8), paddingHorizontal: wp(5)}} className="flex-1 gap-1">
          <View className="items-center">
            {/* <Image style={{ height: hp(35), aspectRatio: 1 }} source={require("../assets/images/login.png")} resizeMode="contain"/> */}
          </View>
          <View className="gap-10">
          <View style={{ paddingHorizontal: wp(5) }} className="flex-1 justify-start items-end pt-20">
          <LogoSvg />
        </View>

          <View className='flex-1 gap-2 pl-2'>
          <Text style={{fontSize: hp(5), color: '#0B96AA'}} className="font-bold tracking-wider text-start ">Ya Hala!</Text>
          <Text style={{fontSize: hp(2), color: '#383838'}} className="font-light tracking-wider text-start ">Join us by filling the form!</Text>
         </View>
            {/* inputs */}
            <View className="gap-4 flex-1">
            <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Feather name="user" size={hp(2.7)} color="gray" />
              <TextInput onChange={(e) => (userRef.current = e.nativeEvent.text)} style={{fontSize: hp(2)}} className="flex-1 font-semibold text-neutral-700" placeholder="Username" placeholderTextColor={"gray"}/>
            </View>
  
            <View className="gap-3">
              <View style={{height: hp(7)}} className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-2xl">
              <Feather name="lock" size={hp(2.7)} color="gray" />
              <TextInput secureTextEntry={!passwordVisible} onChange={(e) => (passwordRef.current = e.nativeEvent.text)} style={{fontSize: hp(2)}} className="flex-1 font-semibold text-neutral-700" placeholder="Password" placeholderTextColor={"gray"}/>
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
      <Feather name={passwordVisible ? "eye" : "eye-off"} size={hp(2.7  )} color="gray" />
    </TouchableOpacity>
            </View>
            </View>            
  
              <View>
                  <TouchableOpacity onPress={() => {
            // Navigate to the main tabs screen and update state to hide the intro
            router.push('../(tabs)');
          }} style={[
            { height: hp(6.5) }, // Inline style
            styles.SignInButton, // Style from StyleSheet
          ]} className="rounded-xl justify-center items-center">
                    <Text style={{fontSize: hp(2.7)}} className="text-white font-bold tracking-wider">
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                  {/* )
                } */}
              </View>
            
  
            {/* signup text */}
            <View className="flex-row">
              <Text style={{fontSize: hp(1.8)}} className="text-neutral-500 font-semibold">Already have an account? </Text>
              <Pressable onPress={()=> router.replace("/(app)")} >
                <Text style={[{fontSize: hp(1.8)}, styles.SignUpText]} className="font-bold">Sign In</Text>
              </Pressable>
              
            </View></View>
            <View className="flex-row justify-center gap-5">
            <View style={{ height: 1, backgroundColor: '#0CA7BD', width: '41%', marginVertical: 10 }} />
              <Text style={styles.ortext}>OR</Text>
              <View style={{ height: 1, backgroundColor: '#0CA7BD', width: '41%', marginVertical: 10 }} />
              </View>
            
          </View>
          <TouchableOpacity className="flex-row justify-center pt-10">
          <GoogleLogo /></TouchableOpacity>
        </View>
      </CustomKeyboardView>
      </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
  
  const styles = StyleSheet.create({
    SignInButton :{
      backgroundColor: '#0CA7BD',
    },
    SignUpText :{
      color: '#0CA7BD',
    },
    background: {
      flex: 1,
      resizeMode: "cover", // Makes sure the image covers the whole screen
      justifyContent: "center",
    },
    ortext: {
      color: '#0CA7BD',
    },
  })

  