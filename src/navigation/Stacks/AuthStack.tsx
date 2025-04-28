import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from '../../screens/Splash/SplashScreen';
import LoginScreen from '../../screens/auth/login/LoginScreen';
import RegisterScreen from '../../screens/auth/register/RegisterScreeen';
import NotificationPermisisonScreen from '../../screens/app/Permissions/NotificationPermisisonScreen';
import MyDrawer from '../drawer/drawerStack';

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Notificaiton Permissions"
        component={NotificationPermisisonScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="HomeTab" component={MyDrawer} />
    </Stack.Navigator>
  );
};
