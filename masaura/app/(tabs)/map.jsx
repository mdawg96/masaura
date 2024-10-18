import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';

const Map = () => {
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [search, setSearch] = useState(null);
  const [allMarkers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [ageFilter, setAgeFilter] = useState(null);
  const [ageFilterOpen, setAgeFilterOpen] = useState(false);
  const [ageFilterOptions, setAgeFilterOptions] = useState([
    { label: 'Everyone', value: 'Everyone' },
    { label: '18+', value: '18+' },
    { label: '21+', value: '21+' },
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      if (location) {
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);

  const fetchMarkers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const fetchedMarkers = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        let imageUrl = '';

        // Set image URL based on the event type
        switch (data.type) {
          case 'Conference':
            imageUrl = '📚';
            break;
          case 'Party':
            imageUrl = '🎉';
            break;
          default:
            imageUrl = '📍';
            break;
        }

        fetchedMarkers.push({
          id: doc.id,
          coordinate: {
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
          },
          title: data.title,
          description: data.address,
          type: data.type,
          image: imageUrl,
          ageRating: data.age,
          eventHash: data.eventHash,
        });
      });

      setMarkers(fetchedMarkers);
      setFilteredMarkers(fetchedMarkers)
    } catch (error) {
      console.error("Error fetching markers: ", error);
    }
  };

  useEffect(() => {
    fetchMarkers();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = allMarkers.filter(marker =>
        marker.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredMarkers(filtered)
    } else {
      setFilteredMarkers(allMarkers)
    }
  }, [search, allMarkers]);

  useEffect(() => {
    let filtered = allMarkers;

    if (ageFilter) {
      filtered = filtered.filter(marker => marker.ageRating === ageFilter);
    }

    setFilteredMarkers(filtered);
  }, [ageFilter, allMarkers]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search location"
          value={search}
          onChangeText={text => setSearch(text)}
        />
        <TouchableOpacity 
          style={styles.plusButton} 
          onPress={() => router.push('/hostEvent')}
        >
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <DropDownPicker
          open={ageFilterOpen}
          value={ageFilter}
          items={ageFilterOptions}
          setOpen={setAgeFilterOpen}
          setValue={setAgeFilter}
          setItems={setAgeFilterOptions}
          style={styles.subFilterDropdown}
          placeholder="Age"
          dropDownContainerStyle={styles.subFilterDropdownList}
          textStyle={styles.dropdownText}
          zIndex={3000}
          zIndexInverse={1000}
          onOpen={() => setAgeFilterOpen(false)}
        />
      </View>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsCompass={true}
        zoomEnabled={true}
      >
        {filteredMarkers.map(marker => (
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
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    position: 'absolute',
    top: 70,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  subHeaderContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: 40,
    paddingLeft: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  plusButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  plusText: {
    color: 'white',
    fontSize: 24,
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
  fullScreenBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  dropdownWrapper: {
    marginBottom: 15,
    width: '100%',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#888',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    width: '100%',
    padding: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-evenly', // Even space between buttons
    width: '100%', // Ensure buttons take the full width of the modal
  },
  filterContainer: {
    position: 'absolute',
    top: '14%',
    left: '5%',
    right: '5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    zIndex: 1,
  },
  subFilterDropdown: {
    backgroundColor: 'white',
    borderColor: '#888',
    width: '48%', // Adjust this value to control the width of each dropdown
  },
  subFilterDropdownList: {
    backgroundColor: 'white',
    borderColor: '#888',
  },
  placeholderStyle: {
    color: '#888',
  },
  dropdownTextStyle: {
    color: '#888',
  },
  dropdownText: {
    fontSize: 12,
    color: 'black',
  },
});

export default Map;
