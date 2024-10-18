import { View, Text, Button, Stylesheet, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { auth } from './firebase'

const Login = () => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    const handleLogin = async () => {
        if (phoneNumber === '1234567890' && password === 'password') {
          // Store login data and navigate to Home screen
          await AsyncStorage.setItem('userToken', 'abc123');
          navigation.navigate('Home');
        } else {
          Alert.alert('Invalid credentials', 'Please check your phone number or password');
        }
      };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={() => alert('Login pressed')} />
        </View>
    );
};

export default Login;