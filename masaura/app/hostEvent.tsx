import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, ImageSourcePropType, Switch } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter, useLocalSearchParams } from 'expo-router';  // For navigation
import { Dropdown } from 'react-native-element-dropdown';
import { Picker } from '@react-native-picker/picker';

// Mapping the images with IDs
const imageMap: { [key: string]: ImageSourcePropType } = {
  '1': require('./images/image1.png'),
  '2': require('./images/image2.png'),
  '3': require('./images/image3.png'),
  '4': require('./images/image4.png'),
  '5': require('./images/image5.png'),
  '6': require('./images/image6.png'),
  '7': require('./images/image7.png'),
  '8': require('./images/image8.png'),
  '9': require('./images/image9.png'),
  '10': require('./images/image10.png'),
  '11': require('./images/image11.png'),
  '12': require('./images/image12.png'),
  '13': require('./images/image13.png'),
  '14': require('./images/image14.png'),
};

export default function HostEvent() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  
  // Set default image to image 14 initially
  const [selectedFlyer, setSelectedFlyer] = useState<ImageSourcePropType>(imageMap['14']);
  
  const router = useRouter();
  const { selectedImageId } = useLocalSearchParams();

  // React to the selectedImageId when it changes
  useEffect(() => {
    if (selectedImageId && typeof selectedImageId === 'string' && selectedImageId in imageMap) {
      setSelectedFlyer(imageMap[selectedImageId]);
    } else {
      setSelectedFlyer(imageMap['14']);  // Fallback to default if invalid or no selection
    }
    console.log(`Selected Image ID: ${selectedImageId}`); // Debugging log
  }, [selectedImageId]);

  // Minimum date is today
  const today = new Date();

  const onChangeStartDate = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
  };

  const [requireHostApproval, setRequireHostApproval] = useState(false);
  const [allowComments, setAllowComments] = useState(true);
  const [guestListVisibility, setGuestListVisibility] = useState('Everyone');
  const [eventVisibility, setEventVisibility] = useState('Public');

  const guestListOptions = [
    { label: 'Everyone', value: 'Everyone' },
    { label: 'Friends', value: 'Friends' },
    { label: 'Nobody', value: 'Nobody' },
  ];
  const eventVisibilityOptions = [
    { label: 'Public', value: 'Public' },
    { label: 'Invite Only', value: 'Invite Only' },
    { label: 'Friends', value: 'Friends' },
  ];

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} 
      style={styles.scrollView}
    >
      <View style={styles.Container}>
        <View style={styles.eventContainer}>
          <Text style={styles.headerStyle}>Event</Text>
          <TextInput 
            style={styles.titleStyle} 
            placeholder="Event Title"
            placeholderTextColor="white" 
          />
          <TextInput 
            style={styles.titleStyle} 
            placeholder="Description"
            placeholderTextColor="white" 
          />
          <TextInput 
            style={styles.titleStyle} 
            placeholder="Host"
            placeholderTextColor="white" 
          />
          <TextInput 
            style={styles.titleStyle} 
            placeholder="Event Type"
            placeholderTextColor="white" 
          />
          <TouchableOpacity 
            style={styles.flyerContainer} 
            onPress={() => router.push('/chooseFlyer')}
          >
            <Text style={styles.chooseFlyerText}>Choose flyer</Text>
            <Image source={selectedFlyer} style={styles.flyerImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.detailContainer}>
          <Text style={styles.headerStyle}>Details</Text>
          <TextInput 
            style={styles.titleStyle} 
            placeholder="Location"
            placeholderTextColor="white" 
          />

          <TextInput 
            style={styles.titleStyle} 
            placeholder="Capacity"
            placeholderTextColor="white" 
            keyboardType="numeric"
          />

          {/* Wrapper for Start Date and End Date inside titleStyle */}
          <View style={styles.titleStyle}>
            <Text style={styles.headerStyle}>Start Date</Text>
            <DateTimePicker
              value={startDate}
              mode="datetime"
              display="default"
              onChange={onChangeStartDate}
              minimumDate={today} // Prevent selecting past dates
              style={styles.picker} // Apply the picker style
            />

            <Text style={styles.headerStyle}>End Date</Text>
            <DateTimePicker
              value={endDate}
              mode="datetime"
              display="default"
              onChange={onChangeEndDate}
              minimumDate={startDate} // Ensure end date is after start date
              style={styles.picker} // Apply the picker style
            />
          </View>
        </View>
        <View style={styles.customContainer}>
          <Text style={styles.headerStyle}>Customizations</Text>
          
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Require Host Approval</Text>
            <Switch
              value={requireHostApproval}
              onValueChange={setRequireHostApproval}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={requireHostApproval ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>Allow Comments</Text>
            <Switch
              value={allowComments}
              onValueChange={setAllowComments}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={allowComments ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Guest List Visibility:</Text>
            <Dropdown
              style={styles.dropdown}
              data={guestListOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Guest List Visibility"
              value={guestListVisibility}
              onChange={item => setGuestListVisibility(item.value)}
            />
          </View>

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Event Open To:</Text>
            <Dropdown
              style={styles.dropdown}
              data={eventVisibilityOptions}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Event Visibility"
              value={eventVisibility}
              onChange={item => setEventVisibility(item.value)}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
    minHeight: '100%',
  },
  titleStyle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    margin: 5,
    width: '90%',
    textAlign: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    padding: 10,
    marginRight: 60,
  },
  eventContainer: {
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'white',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(2, 2, 1)',
    padding: 10,
    marginBottom: 20,
  },
  headerStyle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#000000',
  },
  scrollView: {
    backgroundColor: '#000000',
  },
  detailContainer: {
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'white',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(2, 2, 1, 0.8)',
    padding: 10,
  },
  flyerContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chooseFlyerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  flyerImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  customContainer: {
    justifyContent: 'center',
    borderRadius: 0,
    borderWidth: 1,
    borderColor: 'white',
    width: '95%',
    alignSelf: 'center',
    backgroundColor: 'rgba(2, 2, 1, 0.8)',
    padding: 15,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  toggleText: {
    color: 'white',
    fontSize: 16,
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: 'white',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
