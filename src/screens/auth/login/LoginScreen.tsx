import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icons, Images} from '../../../../assets';
import {ScreenHEIGHT, ScreenWIDTH} from '../../../utils/dimensions';
import {color} from '../../../utils/colors';
import AppInput from '../../../components/AppInput';
import {fonts, fontSize, fontWeight} from '../../../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  handleFacebookLogin,
  handleGoogleSignIn,
} from '../../../services/SignInServices';
import {useUserContext} from '../../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigate, reset} from '../../../navigation/navigationRef';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const {setUserId, setIsLoggedIn, storeUserDetails} = useUserContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const HandleText = (text: string, field: string) => {
    // Clear error when user starts typing
    HandleError('', field);

    setFormData(prev => ({
      ...prev,
      [field]: text,
    }));

    // If it's the email field, validate the email format
    if (field === 'email' && text) {
      const isValidEmail = validateEmail(text);
      if (isValidEmail) {
        HandleError('', 'email'); // Clear error if valid email
      }
    }
  };

  const validateEmail = (email: string) => {
    // Simple email validation regex
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const HandleError = (text: string, field: string) => {
    setError(prev => ({
      ...prev,
      [field]: text,
    }));
  };

  const HandleLogin = async () => {
    HandleError('', 'email');
    HandleError('', 'password');

    if (!formData.email) {
      HandleError('Email is required', 'email');
    } else if (!validateEmail(formData.email)) {
      HandleError('Valid email is required', 'email');
    }

    if (!formData.password) {
      HandleError('Password is required', 'password');
    } else if (formData.password.length < 6) {
      HandleError('Password must be at least 6 characters', 'password');
    }

    if (
      formData.email &&
      formData.password &&
      validateEmail(formData.email) &&
      formData.password.length >= 6
    ) {
      try {
        setIsLoading(true);
        const userCredential = await auth().signInWithEmailAndPassword(
          formData.email.trim(),
          formData.password,
        );
        console.log('User logged in:', userCredential.user);
        setUserId(userCredential.user.uid);
        setIsLoggedIn(true);
        storeUserDetails({
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          uid: userCredential.user.uid,
          photoURL: userCredential.user.photoURL || null,
        });
        reset([{name: 'AppFlow'}])
      } catch (err: any) {
        console.error('Login error:', err);
        HandleError(err.message, 'email'); // Customize error field as needed
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ThirdPartyLogin = async (type: string) => {
    switch (type) {
      case 'google':
        // Handle Google login
        try {
          await handleGoogleSignIn()
            .then(async userCredential => {
              console.log('Google login successful:', userCredential);
              setUserId(userCredential.user.uid);
              setIsLoggedIn(true);
              storeUserDetails({
                email: userCredential.user.email,
                name: userCredential.user.displayName,
                uid: userCredential.user.uid,
                photoURL: userCredential.user.photoURL || null,
              });
              reset([{name: 'AppFlow'}])
            })
            .catch(err => {
              console.error('Google login error:', err);
            });
        } catch (error) {
          console.error('Google login error:', error);
        }
        break;
      case 'apple':
        // Handle Apple login
        break;
      case 'facebook':
        // Handle Facebook login
        await handleFacebookLogin()
          .then(userCredential => {
            console.log('Facebook login successful:', userCredential);
            setUserId(userCredential.user.uid);
            setIsLoggedIn(true);
            storeUserDetails({
              email: userCredential?.user.email,
              name: userCredential?.user.displayName,
              uid: userCredential?.user.uid,
              photoURL: userCredential?.user.photoURL || null,
            });
            reset([{name: 'AppFlow'}])
            // navigation.reset([{name: 'AppFlow'}])
          })
          .catch(err => {
            console.error('Facebook login error:', err);
          });
        break;
      default:
        break;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[color.secondary, color.primary]}
        style={styles.gradient}
        start={{x: 0, y: 1.1}}
        end={{x: 2, y: 1}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Splash')}>
          <Image source={Icons.BackIcon} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Image source={Images.Logo} style={styles.logo} />

          <View style={styles.inputGroup}>
            <AppInput
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={(text: string) => HandleText(text, 'email')}
              value={formData.email}
              error={error.email} // Pass the error message
            />

            <AppInput
              placeholder="Password"
              secureTextEntry
              rightIcon={Icons.EyeClosed}
              onChangeText={(text: string) => HandleText(text, 'password')}
              value={formData.password}
              error={error.password}
            />
          </View>

          {/* Login Button */}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={HandleLogin}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="large" color={color.white} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Separator */}
          <View style={styles.separator}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>Or login with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              // onPress={() => handleGoogleSignOut()}
              onPress={() => ThirdPartyLogin('google')}>
              <Image source={Icons.GoogleLogo} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => ThirdPartyLogin('apple')}>
              <Image source={Icons.AppleLogo} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => ThirdPartyLogin('facebook')}>
              <Image source={Icons.FacebookLogo} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>

          {/* Registration Link */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
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
    height: ScreenHEIGHT * 0.2,
    alignSelf: 'center',
  },
  formContainer: {
    height: '85%',
    width: '100%',
    backgroundColor: color.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: ScreenWIDTH * 0.04,
  },
  inputGroup: {
    marginTop: ScreenHEIGHT * 0.05,
    gap: ScreenHEIGHT * 0.02,
  },
  loginButton: {
    height: ScreenHEIGHT * 0.07,
    backgroundColor: color.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenHEIGHT * 0.05,
  },
  buttonText: {
    fontFamily: fonts.urbanistMedium,
    fontWeight: '700',
    fontSize: fontSize.small,
    color: color.white,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: ScreenHEIGHT * 0.04,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: color.grey0,
    // opacity: 0.5,
  },
  separatorText: {
    fontFamily: fonts.urbanistMedium,
    fontSize: fontSize.xxsmall,
    color: color.grey1,
    marginHorizontal: ScreenWIDTH * 0.02,
    backgroundColor: color.white,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  socialButton: {
    width: ScreenWIDTH * 0.15,
    height: ScreenHEIGHT * 0.07,
    backgroundColor: color.lightgray,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: ScreenWIDTH * 0.1,
    height: ScreenHEIGHT * 0.03,
    resizeMode: 'contain',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: ScreenHEIGHT * 0.04,
  },
  registerText: {
    fontFamily: fonts.urbanistMedium,
    fontSize: fontSize.xxsmall,
    color: color.grey1,
  },
  registerLink: {
    fontSize: fontSize.xxsmall,
    fontWeight: '600',
    color: color.secondary,
    borderBottomWidth: 0.8,
    borderBottomColor: color.secondary,
  },
});

export default LoginScreen;
