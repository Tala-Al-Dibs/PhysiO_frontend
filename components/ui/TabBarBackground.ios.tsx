import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlurTabBarBackground() {
  return (
    <View style={styles.container}>
      <View style={styles.background} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,   // Round top-left corner
    borderTopRightRadius: 20,  // Round top-right corner
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,  // Add shadow on Android
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white', // White background
    borderTopLeftRadius: 20,  // Match rounded corners
    borderTopRightRadius: 20, // Match rounded corners
  },
});

export function useBottomTabOverflow() {
  const tabHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  return tabHeight - bottom;
}
