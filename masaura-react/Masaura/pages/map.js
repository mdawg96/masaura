import React from 'react';
import { StyleSheet, View, Text} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';

const Map = () => {
  const region = {
    latitude: 37.3316850890998,
    longitude: -122.030067374026,
    latitudeDelta: 0.167647972,
    longitudeDelta: 0.354985255,
  };

  const markers = [
    { id: 1, coordinate: { latitude: 37.3316850890998, longitude: -122.030067374026 }, title: "Cupertino", description: "This is Cupertino", image: '🏋️' },
    { id: 2, coordinate: { latitude: 37.3349, longitude: -122.009020 }, title: "Apple Park", description: "Apple's headquarters", image: '📚' },
    { id: 3, coordinate: { latitude: 37.3230, longitude: -122.0310 }, title: "De Anza College", description: "A local community college", image: '🌲' },
  ];

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsCompass={true}
      >
        {markers.map(marker => (
          <Marker key={marker.id} coordinate={marker.coordinate}>
            <View style={styles.customMarker}>
              <Text style={styles.markerText}>{marker.image}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Ensures the map fits inside the parent container
        justifyContent: 'center', // Optional: to center the map within the container
        alignItems: 'center', // Optional: to center the map horizontally
    },
    map: {
        width: 300, // Set the desired width
        height: 450, // Set the desired height
        borderRadius: 10, // Optional: gives rounded corners to the map
    },
    customMarker: {
        backgroundColor: 'transparent', // Set to transparent for the emoji to be visible
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
      },
    markerText: {
        fontSize: 30, // Adjust the size of the emoji
    },
    calloutContainer: {
        width: 150, // Set a width for the Callout container
        padding: 10, // Add padding for more space
        backgroundColor: 'white', // Background color
        borderRadius: 5, // Rounded corners
    },
    calloutTitle: {
        fontSize: 16, // Adjust the font size for the title
        fontWeight: 'bold', // Make the title bold
    },
    calloutDescription: {
        fontSize: 14, // Adjust the font size for the description
    },
});

export default Map;
