import React, { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Add() {
  const [selectedOption, setSelectedOption] = useState('Masaura'); // Always start with Masaura
  const [facing, setFacing] = useState<CameraType>('back'); // Start with back camera
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(true);
  const [backPhoto, setBackPhoto] = useState<string | null>(null); // Store back camera photo
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null); // Store front camera photo
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');

  const options = ['Masaura', 'Photos', 'Live']; // Selector options

  useEffect(() => {
    // Handle permission and immediately open image library if "Photos" is selected
    if (selectedOption === 'Photos') {
      (async () => {
        if (!mediaLibraryPermission?.granted) {
          const { status } = await requestMediaLibraryPermission();
          if (status === 'granted') {
            openImageLibrary(); // Open image library if permission granted
          }
        } else {
          openImageLibrary(); // Permission already granted, open image library
        }
      })();
    }
  }, [selectedOption, mediaLibraryPermission]);

  if (!permission || !mediaLibraryPermission) {
    return <View />;
  }

  if (!permission.granted || !mediaLibraryPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera and access photos</Text>
        <Button onPress={() => { requestPermission(); requestMediaLibraryPermission(); }} title="Grant Permissions" />
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      if (facing === 'back') {
        setBackPhoto(photo?.uri ?? null); // Use optional chaining and nullish coalescing
        setFacing('front');
      } else {
        setFrontPhoto(photo?.uri ?? null); // Use optional chaining and nullish coalescing
        setShowCamera(false);
      }
    }
  };

  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set selected image URI
    }
  };

  const toggleFlash = () => {
    setFlashMode(prevMode => prevMode === 'off' ? 'on' : 'off');
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Masaura':
        return (
          <>
            {showCamera ? (
              <CameraView ref={cameraRef} style={styles.camera} facing={facing} flash={flashMode}>
                {/* Flash icon in the top right corner */}
                <TouchableOpacity style={styles.flashIcon} onPress={toggleFlash}>
                  <Ionicons name={flashMode === 'off' ? 'flash-off' : 'flash'} size={30} color="white" />
                </TouchableOpacity>
                {/* Blue circle icon at the bottom */}
                <View style={styles.cameraControls}>
                  <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
                </View>
              </CameraView>
            ) : (
              <View style={styles.superimposedContainer}>
                {backPhoto && <Image source={{ uri: backPhoto }} style={styles.backPhoto} />}
                {frontPhoto && <Image source={{ uri: frontPhoto }} style={styles.frontPhoto} />}
              </View>
            )}
          </>
        );
      case 'Live':
        return (
          <CameraView style={styles.camera} facing={'front' as CameraType}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'front' ? 'back' : 'front')}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>

      {/* Bottom selector in elliptical container positioned at the bottom */}
      <View style={styles.ellipseContainer}>
        <View style={styles.selectorContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.selectorButton}
              onPress={() => setSelectedOption(option)}
            >
              <Text
                style={[
                  styles.selectorText,
                  selectedOption === option && styles.selectedText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // This will push content to top and bottom
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  superimposedContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  backPhoto: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 1,
    borderColor: 'black',
  },
  frontPhoto: {
    width: '45%',
    height: '40%',
    position: 'absolute',
    top: '3.5%',
    left: '3.5%',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'white',
  },
  ellipseContainer: {
    width: '90%',
    padding: 15,
    backgroundColor: 'rgba(204, 204, 204, 0.8)', // Semi-transparent background
    borderRadius: 40,
    marginBottom: 20, // Add some margin at the bottom
    alignItems: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  selectorButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectorText: {
    color: '#888', // Default text color for unselected options
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#007AFF', // Text color for selected option
  },
  flashIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    zIndex: 2,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    borderWidth: 5,
    borderColor: 'white',
  },
});
