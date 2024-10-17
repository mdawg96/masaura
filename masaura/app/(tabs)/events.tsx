import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Add() {
  const [selectedOption, setSelectedOption] = useState('Masaura');

  const options = ['Masaura', 'Photos', 'Live',];

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipseContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    padding: 15,
    backgroundColor: '#ccc', // Background for the ellipse
    borderRadius: 40, // Makes the container elliptical
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
}); 