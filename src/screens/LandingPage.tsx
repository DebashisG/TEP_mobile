import React, {useEffect} from 'react';
import {Linking} from 'react-native';
import URL from 'url-parse';
import Config from 'react-native-config';

const app_url: string = Config.APP_ENDPOINT;
const client_id: string = Config.CLIENT_ID;
const client_secret: string = Config.CLIENT_SECRET;
const redirect_uri: string = Config.REDIRECT_URI;
const tokenEndpoint = app_url + '/services/oauth2/token';
const clientId = client_id;
const clientSecret = client_secret;
const redirectUri = redirect_uri; // Replace with your custom URI scheme

const exchangeAuthorizationCodeForToken = async (authorizationCode: string) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', authorizationCode);
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error('Token exchange request failed');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(
      'Error exchanging authorization code for access token:',
      error,
    );
    return null;
  }
};

const InitiateSalesforceAuth = ({ navigation }) => {

  const authorizeUrl =
    app_url +
    '/services/oauth2/authorize?' +
    'response_type=code&client_id=' +
    client_id +
    '&redirect_uri=' +
    redirect_uri;

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = new URL(event.url, true);
      const authorizationCode = url.query.code;

      // Function to get access token
      const accessToken = await exchangeAuthorizationCodeForToken(authorizationCode);

      if (accessToken) {
        console.log('++++++++Landing++++++++');
        console.log(accessToken);
        console.log('++++++++End Landing++++++++');
        console.log('----------', app_url);
        console.log('----------', client_id);

        navigation.navigate('Dashboard', {accessToken});
      }
    };

    // Listener for incoming deep links
    Linking.addEventListener('url', handleDeepLink);

    // Clean up the listener when the component unmounts
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  });

  Linking.openURL(authorizeUrl);
};

export default InitiateSalesforceAuth;
