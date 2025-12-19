import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import UserRequestScreen from '../screens/UserRequestScreen';
import SearchingProviderScreen from '../screens/SearchingProviderScreen';
import ProviderOfferScreen from '../screens/ProviderOfferScreen';
import UserOffersScreen from '../screens/UserOffersScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ProviderNotificationScreen from '../screens/ProviderNotificationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="RoleSelection"
          component={RoleSelectionScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="UserRequest" component={UserRequestScreen} />

        <Stack.Screen
          name="SearchingProvider"
          component={SearchingProviderScreen}
        />
        <Stack.Screen name="ProviderOffer" component={ProviderOfferScreen} />
        <Stack.Screen name="UserOffers" component={UserOffersScreen} />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="ProviderNotification"
          component={ProviderNotificationScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
