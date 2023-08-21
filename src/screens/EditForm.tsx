import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const EditFormScreen = ({ route, navigation }) => {
  const accessToken = route.params.params.accessToken;
  const user = route.params.params.user;

  const [email, setEmail] = useState(user.Email__c);
  const [firstName, setFirstName] = useState(user.First_Name__c);
  const [lastName, setLastName] = useState(user.Last_Name__c);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const updateRecord = async (accessToken, userId, updatedData) => {
    const apiUrl = 'https://tiatros4.my.salesforce.com'+user.attributes.url

    try {
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        return true;
      } else{
        throw new Error('Record update request failed');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      return null;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const handleUpdate = async() => {
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      return;
    }

    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      return;
    }

    if (!email.trim()) {
      setLastNameError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    const userId = user.Id;
    const updatedData = {
      'First_Name__c': firstName,
      'Last_Name__c': lastName,
      'Email__c': email,
    };

    const updatedRecord = await updateRecord(accessToken, userId, updatedData);

    if (updatedRecord) {
      navigation.goBack();
    }
  };

  return (
    <View style={{padding: 10}}>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
        autoCapitalize="none"
      />
      {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={(text) => setLastName(text)}
        value={lastName}
        autoCapitalize="none"
      />
      {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TouchableOpacity style={styles.buttonStyle} onPress={handleUpdate}>
        <Text style={styles.buttonTextStyle}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  buttonStyle: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default EditFormScreen;
