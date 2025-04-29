import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Icons, Images} from '../../../../assets';
import {ScreenHEIGHT, ScreenWIDTH} from '../../../utils/dimensions';
import {color} from '../../../utils/colors';
import AppInput from '../../../components/AppInput';
import {fonts, fontSize} from '../../../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  handleFacebookLogin,
  handleGoogleSignIn,
} from '../../../services/SignInServices';
import {useUserContext} from '../../../context/AuthContext';
import {navigate, reset} from '../../../navigation/navigationRef';

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const {setUserId, setIsLoggedIn, storeUserDetails} = useUserContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const HandleText = (text: string, field: string) => {
    // Clear error when user starts typing
    HandleError('', field);

    setFormData(prev => ({
      ...prev,
      [field]: text,
    }));
  };

  const HandleError = (text: string, field: string) => {
    setError(prev => ({
      ...prev,
      [field]: text,
    }));
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const HandleRegister = async () => {
    // Reset errors before validating
    HandleError('', 'name');
    HandleError('', 'email');
    HandleError('', 'password');
    HandleError('', 'confirmPassword');

    // Validate Name
    if (!formData.name) {
      HandleError('Name is required', 'name');
    }

    // Validate Email
    if (!formData.email) {
      HandleError('Email is required', 'email');
    } else if (!validateEmail(formData.email)) {
      HandleError('Valid email is required', 'email');
    }

    // Validate Password
    if (!formData.password) {
      HandleError('Password is required', 'password');
    } else if (!validatePassword(formData.password)) {
      HandleError('Password must be at least 6 characters', 'password');
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      HandleError('Confirm Password is required', 'confirmPassword');
    } else if (formData.password !== formData.confirmPassword) {
      HandleError('Passwords do not match', 'confirmPassword');
    }

    // If all fields are valid, proceed with registration
    if (
      formData.name &&
      formData.email &&
      validateEmail(formData.email) &&
      formData.password &&
      validatePassword(formData.password) &&
      formData.password === formData.confirmPassword
    ) {
      setIsLoading(true);

      try {
        // Check if the email is already registered
        const signInMethods = await auth().fetchSignInMethodsForEmail(
          formData.email.trim(),
        );
        if (signInMethods.length > 0) {
          HandleError('Email already in use', 'email');
          setIsLoading(false);
          return;
        }

        const userCredential = await auth().createUserWithEmailAndPassword(
          formData.email.trim(),
          formData.password,
        );

        const user = userCredential.user;
        const userRef = firestore().collection('users').doc(user.uid);

        const userDoc = await userRef.get();
        if (!userDoc.exists) {
          await userRef.set({
            email: user.email,
            name: formData.name,
            photoURL: user.photoURL || null,
            uid: user.uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
          });
          console.log('User data saved to Firestore');
        } else {
          console.log('User already exists in Firestore');
        }

        setUserId(user.uid);
        setIsLoggedIn(true);
        storeUserDetails({
          email: user.email,
          name: formData.name,
          uid: user.uid,
          photoURL: user.photoURL || null,
        });
        reset([{name: 'AppFlow'}]);
      } catch (err: any) {
        console.error('Registration error:', err);
        HandleError(err.message, 'email');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const ThirdPartyLogin = async (type: string) => {
    switch (type) {
      case 'google':
        // Handle Google login
        await handleGoogleSignIn()
          .then(userCredential => {
            console.log('Google login successful:', userCredential);
            setUserId(userCredential.user.uid);
            setIsLoggedIn(true);
            storeUserDetails({
              email: userCredential.user.email,
              name: userCredential.user.displayName,
              uid: userCredential.user.uid,
              photoURL: userCredential.user.photoURL || null,
            });
            reset([{name: 'AppFlow'}]);
          })
          .catch(err => {
            console.error('Google login error:', err);
          });

        break;
      case 'facebook':
        // Handle Facebook login
        await handleFacebookLogin()
          .then(userCredential => {
            console.log('Facebook login successful:', userCredential);
            setUserId(userCredential.user.uid);
            setIsLoggedIn(true);
            storeUserDetails({
              email: userCredential?.user?.email,
              name: userCredential?.user?.displayName,
              uid: userCredential?.user?.uid,
              photoURL: userCredential?.user?.photoURL || null,
            });
            reset([{name: 'AppFlow'}]);
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

      <ScrollView style={styles.formContainer}>
        <Image source={Images.Logo} style={styles.logo} />

        <View style={styles.inputGroup}>
          <AppInput
            placeholder="Name"
            onChangeText={(text: string) => HandleText(text, 'name')}
            value={formData.name}
            error={error.name}
          />
          <AppInput
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(text: string) => HandleText(text, 'email')}
            value={formData.email}
            error={error.email}
          />
          <AppInput
            placeholder="Password"
            secureTextEntry
            rightIcon={Icons.EyeClosed}
            onChangeText={(text: string) => HandleText(text, 'password')}
            value={formData.password}
            error={error.password}
          />
          <AppInput
            placeholder="Confirm Password"
            secureTextEntry
            rightIcon={Icons.EyeClosed}
            onChangeText={(text: string) => HandleText(text, 'confirmPassword')}
            value={formData.confirmPassword}
            error={error.confirmPassword}
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={HandleRegister}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="large" color={color.white} />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
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
            onPress={() => ThirdPartyLogin('google')}>
            <Image source={Icons.GoogleLogo} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
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
          <Text style={styles.registerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.registerLink}>Login</Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 40,
    gap: 14,
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
    marginVertical: 40,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D0DAEE',
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
    marginTop: ScreenHEIGHT * 0.04,
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

export default RegisterScreen;
