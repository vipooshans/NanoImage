import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CompressScreen from '../screens/CompressScreen';
import ResizeScreen from '../screens/ResizeScreen';
import ConvertScreen from '../screens/ConvertScreen';
import BatchScreen from '../screens/BatchScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {backgroundColor: '#080C14'},
        }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Compress" component={CompressScreen} />
        <Stack.Screen name="Resize" component={ResizeScreen} />
        <Stack.Screen name="Convert" component={ConvertScreen} />
        <Stack.Screen name="Batch" component={BatchScreen} />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{animation: 'fade_from_bottom'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
