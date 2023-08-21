import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

const Profile = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [user, setData] = useState([]);

  const route = useRoute();
  const accessToken = route.params.params.accessToken;
  const Id = route.params.params.Id;
  const url = route.params.params.url;

  console.log('++++++++Profile++++++++')
  console.log(accessToken)
  console.log('++++++++End Profile++++++++')

  const getCurrentUser = async () => {
    const apiUrl = 'https://tiatros4.my.salesforce.com' + url;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error calling API:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCurrentUser();
    });
  }, []);

  const handleEdit = (user) => {
    const params = {
      accessToken: accessToken,
      user: user
    };
    navigation.navigate('EditForm', { params });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../images/avatar4.jpg')}
        style={styles.profileImage}
      />

      <Text style={styles.name}>
        {user.First_Name__c} {user.Last_Name__c}
      </Text>
      <Text style={styles.email}>{user.Email__c}</Text>

      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => handleEdit(user)}>
        <Text style={styles.buttonTextStyle}>Edit</Text>
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
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
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

export default Profile;