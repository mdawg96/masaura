import * as FileSystem from 'expo-file-system';
import React, { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

export default function Add() {
  const [selectedOption, setSelectedOption] = useState('Masaura'); // Always start with Masaura
  const [facing, setFacing] = useState<CameraType>('back'); // Start with back camera
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(true);
  const [backPhoto, setBackPhoto] = useState<string | null>(null); // Store back camera photo
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null); // Store front camera photo
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [galleryImages, setGalleryImages] = useState<MediaLibrary.Asset[]>([]);
  const [resolvedUris, setResolvedUris] = useState<string[]>([]); // Store resolved URIs
  const cameraRef = useRef<CameraView>(null);

  const options = ['Masaura', 'Photos', 'Live']; 

  useEffect(() => {
    (async () => {
      if (!mediaLibraryPermission?.granted) {
        await requestMediaLibraryPermission();
      }
      if (mediaLibraryPermission?.granted) {
        const media = await MediaLibrary.getAssetsAsync({ mediaType: 'photo', first: 20 });
        console.log("Fetched media assets: ", media.assets);
        setGalleryImages(media.assets);
      }
    })();
  }, [mediaLibraryPermission?.granted]);

  useEffect(() => {
    (async () => {
      const uris = await Promise.all(galleryImages.map(async (image) => {
        const info = await FileSystem.getInfoAsync(image.uri);
        return info.exists ? info.uri : null;
      }));
      setResolvedUris(uris.filter(uri => uri !== null));
    })();
  }, [galleryImages]);

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

  const renderPhotos = () => {
    if (!resolvedUris.length) {
      return <Text>No images found</Text>;
    }

    return resolvedUris.map((uri, index) => (
      <Image
        key={index}
        source={{ uri }}
        style={styles.galleryImage}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
    ));
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Masaura':
        return (
          <>
            {showCamera ? (
              <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.button} onPress={takePhoto}>
                    <Text style={styles.text}>Take Photo</Text>
                  </TouchableOpacity>
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
      case 'Photos':
        return (
          <View style={styles.galleryContainer}>
            {mediaLibraryPermission?.granted ? renderPhotos() : (
              <Button 
                title="Grant Media Library Permission" 
                onPress={requestMediaLibraryPermission} 
              />
            )}
          </View>
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
      {/* Header with black background and "Add Post" */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Post</Text>
      </View>

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
  header: {
    width: '100%',
    padding: 15,
    backgroundColor: 'black', // Black background
    alignItems: 'center',
  },
  headerText: {
    color: 'white', // White text for contrast
    fontSize: 20,
    fontWeight: 'bold',
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
  galleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  galleryImage: {
    width: width / 3 - 10,
    height: width / 3 - 10,
    margin: 5,
  },
});
