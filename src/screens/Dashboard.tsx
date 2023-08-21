import React, {useState, useEffect} from 'react';
import {showMessage} from 'react-native-flash-message';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import Config from 'react-native-config';

const Dashboard = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const route = useRoute();
  const {accessToken} = route.params;

  console.log('++++++++Dashboard++++++++');
  console.log(accessToken);
  console.log('++++++++End Dashboard++++++++');

  useEffect(() => {
    showMessage({
      message: 'Login successful'
    });
    // Fetch data here
    fetchData()
      .then((response) => {
        console.log(response);
        setData(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  const fetchData = async () => {
    const app_url: string = Config.APP_ENDPOINT;
    const apiUrl = app_url + '/services/data/v56.0/sobjects/User__c'
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.recentItems;
    } catch (error) {
      throw error;
    }
  };

  return (
    <View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.Id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', padding: 10 }}>
            <Text style={{ flex: 1}}>{item.Name}</Text>
            <Text style={{ flex: 1, color: 'blue'}} onPress={() => handleRedirect(item)}>{item.attributes.url}</Text>
          </View>
        )}
        // eslint-disable-next-line react/no-unstable-nested-components
        ListHeaderComponent={() => (
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{flexDirection: 'row', padding: 10, borderBottomWidth: 1}}>
            <Text style={{flex: 1, fontWeight: 'bold'}}>Patient Id</Text>
            <Text style={{flex: 1, fontWeight: 'bold'}}>Profile Link</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Dashboard;
