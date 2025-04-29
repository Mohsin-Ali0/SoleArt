// src/navigation/AppNavigator.js
import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import TermsAndConditionsScreen from '../screens/app/Policies&conditions/TermsAndConditions';
import PrivacyPolicy from '../screens/app/Policies&conditions/PrivacyPolicy';
// import ContactUsScreen from '../screens/app/ContactUsScreen';
// import MicronsScreen from '../screens/app/MicronsScreen';
import {Icons, Images} from '../../assets';
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/auth/login/LoginScreen';
import RegisterScreen from '../screens/auth/register/RegisterScreeen';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';
import {color} from '../utils/colors';
import {fonts, fontSize} from '../utils/fonts';
import ContactUsScreen from '../screens/app/Policies&conditions/ContactUs';
import LogoutModal from '../components/LogoutModal';
import {useUserContext} from '../context/AuthContext';
import PermissionsScreen from '../screens/app/Permissions/PermisisonScreen';
import {handleSignOut} from '../services/SignInServices';
import {reset} from './navigationRef';

const Drawer = createDrawerNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();
const AppStack = createStackNavigator();

const CustomDrawerContent = ({navigation}: DrawerContentComponentProps) => {
  const {clearUserDetails} = useUserContext();
  const [showModal, setShowModal] = useState(false);
  const menuItems = [
    {
      name: 'Home',
      label: 'Home',
    },
    {
      name: 'TermsAndConditions',
      label: 'Terms & conditions',
    },
    {name: 'PrivacyPolicy', label: 'Privacy & policy'},
    {name: 'ContactUs', label: 'Contact us'},
  ];
  const handleLogout = async () => {
    console.log('User logged out');
    await handleSignOut(clearUserDetails);
    setShowModal(false);
    // reset([{name: 'Auth'}]);
  };

  const handleLogoutRequest = () => {
    navigation.closeDrawer(); // Close the drawer
    setShowModal(true); // Show the logout modal
  };
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.header}>
        <Image source={Images.Logo} style={styles.logo} />
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.name}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.name)}>
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogoutRequest}>
        <Image source={Icons.Logout} style={styles.LogoutIcon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <LogoutModal
        visible={showModal}
        onClose={() => setShowModal(false)} // Close the modal
        onPress={handleLogout} // Handle the logout action
        heading="Logout"
        title="Are you sure you want to log out?"
        buttonTitle1="Yes, sure"
        buttonTitle2="Cancel"
      />
    </View>
  );
};

const AppDrawer = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'slide',
      drawerStyle: {width: '70%'},
    }}>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="ContactUs" component={ContactUsScreen} />
    <Drawer.Screen
      name="TermsAndConditions"
      component={TermsAndConditionsScreen}
    />
    <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
  </Drawer.Navigator>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Splash" component={SplashScreen} />
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen
      name="Permissions"
      component={PermissionsScreen} // permissions ko AuthStack me daal dena aur Login/Register ke ander conditional navigate karna HAI...................................
      options={{gestureEnabled: false}}
    />
  </AuthStack.Navigator>
);

const AppNavigator = () => {
  const {isLoggedIn, isBluetoothEnabled, isNotificationEnabled} =
    useUserContext();
  const arePermissionsGranted = isBluetoothEnabled && isNotificationEnabled;
  return (
    <AppStack.Navigator screenOptions={{headerShown: false}}>
      {isLoggedIn && arePermissionsGranted ? (
        <AppStack.Screen name="AppDrawer" component={AppDrawer} />
      ) : (
        <AppStack.Screen
          name="Permissions"
          component={PermissionsScreen}
          options={{gestureEnabled: false}}
        />
      )}
    </AppStack.Navigator>
  );
};
const RootNavigator = () => {
  const {isLoggedIn} = useUserContext();
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      {!isLoggedIn ? (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <RootStack.Screen name="AppFlow" component={AppNavigator} />
      )}
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: color.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    width: ScreenWIDTH * 0.7,
    height: ScreenHEIGHT * 0.2,
    resizeMode: 'contain',
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ScreenHEIGHT * 0.02,
    paddingHorizontal: ScreenWIDTH * 0.05,
  },

  menuText: {
    fontFamily: fonts.urbanistMedium,
    fontSize: fontSize.regular,
    color: color.black0,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.primary,
    height: ScreenHEIGHT * 0.07,
    width: '85%',
    borderRadius: 10,
    marginBottom: ScreenHEIGHT * 0.05,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  LogoutIcon: {
    width: ScreenWIDTH * 0.05,
    height: ScreenHEIGHT * 0.05,
    tintColor: color.white,
    resizeMode: 'contain',
  },
  logoutText: {
    fontFamily: fonts.urbanistSemiBold,
    fontSize: fontSize.small,
    color: color.white,
    marginLeft: 15,
    fontWeight: '700',
  },
});

export default RootNavigator;
