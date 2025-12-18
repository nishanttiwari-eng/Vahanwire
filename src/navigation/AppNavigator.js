import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import UserRequestScreen from '../screens/UserRequestScreen';
import SearchingProviderScreen from '../screens/SearchingProviderScreen';
import ProviderOfferScreen from '../screens/ProviderOfferScreen';
import UserOffersScreen from '../screens/UserOffersScreen';
import SuccessScreen from '../screens/SuccessScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RoleSelection"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
