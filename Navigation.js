
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import About from './About';
import Examples from './Examples';
import App from './App';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="App">
        <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Examples" component={Examples} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
