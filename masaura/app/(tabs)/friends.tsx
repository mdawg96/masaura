import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Friends() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Masaura!</Text>
      {/* Add any other content you want for the home screen */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
