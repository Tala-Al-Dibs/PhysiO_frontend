import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
// import "D:/A Graduation Project/cam-app/global.css"
import { AntDesign } from '@expo/vector-icons';
import HomeIcon from '@/components/svgIcons/bottomBar/HomeIcon';
import ExploreIcon from '@/components/svgIcons/bottomBar/ExploreIcon';
import ProgressIcon from '@/components/svgIcons/bottomBar/ProgressIcon';
import ProfileIcon from '@/components/svgIcons/bottomBar/ProfileIcon';
import ScanIconBar from '@/components/svgIcons/bottomBar/ScanIconBar';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0CA7BD",  // Active color
        tabBarInactiveTintColor: "#383838", 
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0, // Remove default border
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <HomeIcon color={color}/>,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <ExploreIcon color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="camera"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <ScanIconBar />,
          //<ScanIcon/>,
          tabBarStyle: {
            display: 'none', 
            height: 0,
          //   zIndex: -1,
          }
        }}
      />

<Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <ProgressIcon color={color} />,
        }}
      />

<Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon color={color} />,
        }}
      />
    </Tabs>
    
  );
}
