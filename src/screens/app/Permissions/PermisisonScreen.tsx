import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {color} from '../../../utils/colors';
import {ScreenWIDTH, ScreenHEIGHT} from '../../../utils/dimensions';
import AppInput from '../../../components/AppInput';
import {Icons, Images} from '../../../../assets';
import {fonts, fontSize} from '../../../utils/fonts';
import {
  checkAndRequestPermissions,
  getRequiredPermissions,
} from '../../../utils/permissions';
import {useUserContext} from '../../../context/AuthContext';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {reset} from '../../../navigation/navigationRef';

const DummyText = {
  text: '  To provide you with the best experience, we need to access your notifications. This will help us keep you updated with the latest information and alerts.',
};

const PermissionsScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setIsBluetoothEnabled,
    setIsLocationEnabled,
    setIsNotificationEnabled,
  } = useUserContext();

  const verifyPermissions = async () => {
    const requiredPermissions = getRequiredPermissions();
    const statuses = await Promise.all(requiredPermissions.map(p => check(p)));
    return statuses.every(status => status === RESULTS.GRANTED);
  };

  const handleOpenSettings = () => Linking.openSettings();

  const handlePermissionRequest = async () => {
    setIsLoading(true);
    try {
      const requiredPermissions = getRequiredPermissions();
      let blockedPermissions = false;

      // Request permissions sequentially
      for (const permission of requiredPermissions) {
        const status = await check(permission);

        if (status === RESULTS.BLOCKED) {
          blockedPermissions = true;
          continue;
        }

        if (status !== RESULTS.GRANTED) {
          const result = await request(permission);
          if (result === RESULTS.BLOCKED) blockedPermissions = true;
        }
      }

      console.log('Permissions Status:', requiredPermissions);
      console.log('Blocked Permissions:', blockedPermissions);
      // Check if any permissions are permanently denied

      if (blockedPermissions) {
        Alert.alert(
          'Permissions Required',
          'Some permissions are permanently denied. Please enable them in settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: handleOpenSettings},
          ],
        );
        return;
      }

      const allGranted = await verifyPermissions();

      if (allGranted) {
        setIsBluetoothEnabled(true);
        setIsLocationEnabled(true);
        setIsNotificationEnabled(true);
        // reset([{name: 'AppFlow'}]); // Navigate directly to main app
      } else {
        Alert.alert(
          'Permissions Needed',
          'All permissions are required to use the app',
          [{text: 'Try Again', onPress: handlePermissionRequest}],
        );
      }
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert('Error', 'Failed to request permissions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LinearGradient
      colors={[color.secondary, color.primary]}
      style={styles.gradient}
      start={{x: 0, y: 1.1}}
      end={{x: 2, y: 1}}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          reset([{name: 'Auth'}]);
        }}>
        <Image source={Icons.BackIcon} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}>
        <Image source={Images.PermissionsLogo} style={styles.logo} />

        <Text style={styles.heading}>Notifications</Text>
        <Text style={styles.title}>{DummyText.text}</Text>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handlePermissionRequest}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="large" color={color.white} />
          ) : (
            <Text style={styles.buttonText}>Allow Permissions</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginLeft: ScreenWIDTH * 0.05,
    height: '15%',
    width: ScreenWIDTH,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    width: ScreenWIDTH * 0.05,
    height: ScreenHEIGHT * 0.03,
  },
  logo: {
    width: ScreenWIDTH * 1,
    height: ScreenHEIGHT * 0.25,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: ScreenHEIGHT * 0.02,
  },
  formContainer: {
    height: '85%',
    width: '100%',
    backgroundColor: color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: ScreenWIDTH * 0.04,
  },
  heading: {
    fontFamily: fonts.urbanistBold,
    fontWeight: '600',
    fontSize: 22,
    color: color.black,
    marginTop: ScreenHEIGHT * 0.02,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.urbanistRegular,
    fontWeight: '300',
    fontSize: fontSize.xxsmall,
    color: color.black,
    marginTop: ScreenHEIGHT * 0.02,
    textAlign: 'justify',
  },
  loginButton: {
    height: ScreenHEIGHT * 0.07,
    width: ScreenWIDTH * 0.9,
    backgroundColor: color.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenHEIGHT * 0.02,
    alignSelf: 'center',
    marginBottom: ScreenHEIGHT * 0.02,
  },
  buttonText: {
    fontFamily: fonts.urbanistMedium,
    fontWeight: '700',
    fontSize: fontSize.small,
    color: color.white,
  },
});

export default PermissionsScreen;
