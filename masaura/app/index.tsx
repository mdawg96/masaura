import React, { useRef, useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, View, Dimensions, Alert, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';  // For navigation

export default function LoadingScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [permissionGranted, setPermissionGranted] = useState(false);
  const router = useRouter();  // Use router for navigation

  useEffect(() => {
    // Start the fade-in animation to 50% opacity
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // After reaching 50% opacity, ask for notification permissions
      requestPermissions();
    });
  }, []);

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setPermissionGranted(true);
    } else {
      Alert.alert('Permission Denied', 'Notification permissions denied.');
    }

    // Continue fading to full opacity after permission is resolved
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Navigate to the main screen after the fade animation completes
      // TODO: navigate to the login screen
      router.replace('/signup')
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
        <Image source={require('../assets/images/mountains.png')} style={styles.imageStyle} />
        <Text> Masaura </Text>
      </Animated.View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: width,
    height: height,
    resizeMode: 'cover',
  },
});
