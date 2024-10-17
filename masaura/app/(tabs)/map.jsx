import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import SHA256 from 'crypto-js/sha256';

const Map = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [search, setSearch] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventTitle, setEventTitle] = useState(null);
  const [eventAddress, setEventAddress] = useState(null);
  const [allMarkers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [ageOpen, setAgeOpen] = useState(false);
  const [ageRestriction, setAgeRestriction] = useState(null);
  const [ageOptions, setAgeOptions] = useState([
    { label: 'Everyone', value: 'Everyone' },
    { label: '18+', value: '18+' },
    { label: '21+', value: '21+' },
  ]);
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [eventOptions, setEventOptions] = useState([
    { label: 'Party', value: 'Party' },
    { label: 'Conference', value: 'Conference' },
    { label: 'Event', value: 'Event' },
  ]);
  const [eventFilter, setEventFilter] = useState(null);
  const [eventFilterOpen, setEventFilterOpen] = useState(null);
  const [eventFilterOptions, setEventFilterOptions] = useState([
    {label: 'Select Type', value: null},
    { label: 'Party', value: 'Party' },
    { label: 'Conference', value: 'Conference' },
    { label: 'Event', value: 'Event' },
  ]);
  const [ageFilter, setAgeFilter] = useState(null);
  const [ageFilterOpen, setAgeFilterOpen] = useState(null);
  const [ageFilterOptions, setAgeFilterOptions] = useState([
    {label: 'Select Age', value: null},
    { label: 'Everyone', value: 'Everyone' },
    { label: '18+', value: '18+' },
    { label: '21+', value: '21+' },
  ]);
  const [hash, eventHash] = useState('');

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

    if (eventFilter) {
      filtered = filtered.filter(marker => marker.type === eventFilter);
    }

    setFilteredMarkers(filtered);
  }, [ageFilter, eventFilter, allMarkers]);

  const addEvent = async () => {
    try {
      if (!eventTitle || !eventAddress) {
        alert('Make sure all fields are filled out.');
        return;
      }

      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(eventAddress)}`
      );

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];

        await addDoc(collection(db, "events"), {
          title: eventTitle,
          address: eventAddress,
          coordinates: {
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
          },
          type: eventType,
          age: ageRestriction,
          eventHash: SHA256(eventTitle).toString(),
        });

        setEventTitle('');
        setEventAddress('');
        setModalVisible(false);
        fetchMarkers();
      } else {
        alert('Address not found. Please enter a valid address.');
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      alert('An error occurred while adding the event. Please try again.');
    }
  };

  if (!region) {
    return (
      <View style={styles.container}>
        <Text>Fetching location...</Text>
      </View>
    );
  }

  const clearEvent = () => {
    setEventTitle(null)
    setEventAddress(null)
    setAgeRestriction(null)
    setModalVisible(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search location"
          value={search}
          onChangeText={text => setSearch(text)}
        />
        <TouchableOpacity style={styles.plusButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.plusText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filterContainer}>
        <View style={{ zIndex: 3000 }}>
          <DropDownPicker
            open={ageFilterOpen}
            value={ageFilter}
            items={ageFilterOptions}
            setOpen={setAgeFilterOpen}
            setValue={setAgeFilter}
            setItems={setAgeFilterOptions}
            style={styles.subFilterDropdown}
            defaultNull={true}  // Add this if supported
            placeholder="Select Age"
            dropDownContainerStyle={styles.subFilterDropdownList}
            textStyle={{
              fontSize: 7,
              padding: 2,
            }}
            zIndex={3000}
            zIndexInverse={1000}
            onOpen={() => setEventTypeOpen(false)}
          />
        </View>
        <View style={{ zIndex: 2000 }}>
          <DropDownPicker
            open={eventFilterOpen}
            value={eventFilter}
            items={eventFilterOptions}
            setOpen={setEventFilterOpen}
            setValue={setEventFilter}
            setItems={setEventFilterOptions}
            style={styles.subFilterDropdown}
            defaultNull={true}  // Add this if supported
            placeholder="Select Type"
            dropDownContainerStyle={styles.subFilterDropdownList}
            textStyle={{
              fontSize: 7,
              padding: 2,
            }}
            zIndex={2000}
            zIndexInverse={2000}
            onOpen={() => setAgeOpen(false)}
          />
        </View>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.fullScreenBlur}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Host an Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={eventTitle}
              onChangeText={setEventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Event Address"
              value={eventAddress}
              onChangeText={setEventAddress}
            />
            <View style={[styles.dropdownWrapper, { zIndex: 3000 }]}>
              <DropDownPicker
                open={ageOpen}
                value={ageRestriction}
                items={ageOptions}
                setOpen={setAgeOpen}
                setValue={setAgeRestriction}
                setItems={setAgeOptions}
                placeholder="Select the Age Restriction"
                placeholderStyle={{
                  color: '#888',
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                zIndex={3000}
                zIndexInverse={1000}
                onOpen={() => setEventTypeOpen(false)}
              />
            </View>
            <View style={[styles.dropdownWrapper, { zIndex: 2000 }]}>
              <DropDownPicker
                open={eventTypeOpen}
                value={eventType}
                items={eventOptions}
                setOpen={setEventTypeOpen}
                setValue={setEventType}
                setItems={setEventOptions}
                placeholder="Select Event Type"
                placeholderStyle={{
                  color: '#888',
                }}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                zIndex={2000}
                zIndexInverse={2000}
                onOpen={() => setAgeOpen(false)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => clearEvent()}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => addEvent()}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
    left: '10%',
    flexDirection: 'row',
    justifyContent: 'left',
    marginTop: 6, // Adjust space between search bar and dropdowns
    zIndex: 1, // Ensures dropdowns display above map
    width: '100%',
  },
  subFilterDropdown: {
    width: '50%', // Ensures each dropdown takes up half of the available width
    minHeight: 10,
    backgroundColor: 'white', // White background
    borderColor: '#888', // Light gray border
    marginHorizontal: -10
  },
  subFilterDropdownList: {
    backgroundColor: 'white', // Background color of the dropdown options
    borderColor: '#888', // Light gray border for the dropdown list
    marginLeft: -10,
    width: '50%'
  },
});

export default Map;