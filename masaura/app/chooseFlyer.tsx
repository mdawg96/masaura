import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, TouchableOpacity, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

type ImageItem = {
  id: string;
  source: number;
};

const ImageSelector = () => {
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageItem>({ id: '1', source: require('./images/image1.png') });

  useEffect(() => {
    const loadedImages = [
        { id: '1', source: require('./images/image1.png') },
        { id: '2', source: require('./images/image2.png') },
        { id: '3', source: require('./images/image3.png') },
        { id: '4', source: require('./images/image4.png') },
        { id: '5', source: require('./images/image5.png') },
        { id: '6', source: require('./images/image6.png') },
        { id: '7', source: require('./images/image7.png') },
        { id: '8', source: require('./images/image8.png') },
        { id: '9', source: require('./images/image9.png') },
        { id: '10', source: require('./images/image10.png') },
        { id: '11', source: require('./images/image11.png') },
        { id: '12', source: require('./images/image12.png') },
        { id: '13', source: require('./images/image13.png') },
        { id: '14', source: require('./images/image14.png') }
    ];
    setImages(loadedImages);
  }, []);

  const { width } = Dimensions.get('window');
  const imageSize = (width - 40) / 3; // 40 accounts for margins and padding

  const handleImageSelection = (item: ImageItem) => {
    setSelectedImage(item);
    // Set params and then go back
    router.setParams({ selectedImageId: item.id });
    router.back();
  };

  const renderImage = ({ item }: { item: ImageItem }) => (
    <TouchableOpacity onPress={() => handleImageSelection(item)}>
      <Image source={item.source} style={[styles.image, { width: imageSize, height: imageSize }]} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.selectedContainer}>
        <Image source={selectedImage.source} style={styles.selectedImage} />
      </View>
      <FlatList
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  selectedContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedImage: {
    width: 380,
    height: 400,
    borderRadius: 10,
  },
  optionsText: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 10,
  },
  flatListContent: {
    padding: 5,
  },
  image: {
    margin: 5,
  },
});

export default ImageSelector;
