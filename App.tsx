// App.tsx
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import HomeScreen from './src/screens/HomeScreen';
import {DeviceProvider} from './src/context/DeviceContext';
import RootNavigator from './src/navigation/AppNavigator';
import {UserProvider} from './src/context/AuthContext';
import {navigationRef} from './src/navigation/navigationRef';

export default function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <UserProvider>
        <DeviceProvider>
          <RootNavigator />
        </DeviceProvider>
      </UserProvider>
    </NavigationContainer>
  );
}
