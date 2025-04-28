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
  text: 'Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut.   Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut.',
};

const PermissionsScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const {
    setIsBluetoothEnabled,
    setIsLocationEnabled,
    setIsNotificationEnabled,
  } = useUserContext();

  const AllowPermissions = async () => {
    setIsLoading(true);
    try {
      const requiredPermissions = getRequiredPermissions();
      let allPermissionsGranted = true;

      for (const permission of requiredPermissions) {
        // Check the current status of the permission
        const status = await check(permission);

        if (status !== RESULTS.GRANTED) {
          // Request the permission if not already granted
          const requestResult = await request(permission);

          // If any permission is denied or blocked, set the flag to false
          if (requestResult !== RESULTS.GRANTED) {
            allPermissionsGranted = false;
            Alert.alert(
              'Permission Required',
              `The app requires ${permission} permission to function properly.`,
              [{text: 'OK'}],
            );
            break; // Stop requesting further permissions if one is denied
          }
        }
      }

      // If all permissions are granted, update the states
      if (allPermissionsGranted) {
        setIsBluetoothEnabled(true);
        setIsLocationEnabled(true);
        setIsNotificationEnabled(true);

        Alert.alert('Success', 'All permissions have been granted.', [
          {text: 'OK'},
        ]);
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert(
        'Error',
        'An error occurred while requesting permissions. Please try again.',
        [{text: 'OK'}],
      );
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
          onPress={AllowPermissions}
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
