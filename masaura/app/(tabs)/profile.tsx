import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const router = useRouter();

  // State for profile details
  const [followers, setFollowers] = useState(150);
  const [following, setFollowing] = useState(200);
  const [posts, setPosts] = useState(35);
  const [description, setDescription] = useState('Just living my best life!');
  const [username, setUsername] = useState('john_doe');
  const [realName, setRealName] = useState('John Doe'); // Real name state
  const [profilePhoto, setProfilePhoto] = useState(require('../../assets/images/mountains.png')); // Default profile photo

  // Function to handle profile photo change
  const handleProfilePhotoPress = async () => {
    // Show options for taking a photo or selecting from gallery
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => requestCameraPermission() },
        { text: 'Select from Gallery', onPress: () => requestLibraryPermission() },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      openCamera();
    } else {
      Alert.alert('Permission denied', 'Camera permission is required to take a photo.');
    }
  };

  // Request media library permission
  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      openImageLibrary();
    } else {
      Alert.alert('Permission denied', 'Media library permission is required to select a photo.');
    }
  };

  // Open the camera
  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto({ uri: result.assets[0].uri });
    }
  };

  // Open the image library
  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto({ uri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      {/* Icons container */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/addPost')}
        >
          <Ionicons name="create-outline" size={30} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Content section */}
      <View style={styles.contentContainer}>
        {/* Username */}
        <Text style={styles.usernameText}>@{username}</Text>

        {/* Profile Photo (with press functionality) */}
        <TouchableOpacity onPress={handleProfilePhotoPress}>
          <Image source={profilePhoto} style={styles.profilePhoto} />
        </TouchableOpacity>

        {/* Real Name */}
        <Text style={styles.realNameText}>{realName}</Text>

        {/* Stats: Following, Followers, Posts */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.descriptionText}>{description}</Text>

        {/* Horizontal Line */}
        <View style={styles.horizontalLine} />

        {/* Posts Section */}
        <Text style={styles.postsTitle}>Your Posts</Text>
        {/* Layout for displaying posts goes here */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: 10,
    paddingTop: 30,
  },
  iconButton: {
    marginRight:8,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: -20, // Move everything (except settings) up
    width: '100%',  // Make sure content container takes full width
  },
  usernameText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10, // Adjusted for better spacing
  },
  realNameText: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  descriptionText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  horizontalLine: {
    width: '100%', // Ensures the line takes full width
    height: 2, // More appropriate thickness for a horizontal line
    backgroundColor: '#000', // Dark color for visibility
    marginBottom: 20,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
