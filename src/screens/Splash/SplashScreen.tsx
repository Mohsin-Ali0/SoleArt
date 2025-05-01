import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  Animated,
} from 'react-native';
import GeneralButton from '../../components/GeneralButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color} from '../../utils/colors';
import {Screen} from 'react-native-screens';
import {ScreenHEIGHT} from '../../utils/dimensions';
import {fontSize} from '../../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../../assets';
import {useEffect, useRef} from 'react';
import {useUserContext} from '../../context/AuthContext';

const SplashScreen = () => {
  const navigation = useNavigation<any>();
  const {isLoggedIn} = useUserContext();
  const fadeAnim = useRef(new Animated.Value(1)).current; // Use useRef

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Longer duration for better visibility
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          // Navigate after animation completes
          if (isLoggedIn) {
            navigation.reset({
              index: 0,
              routes: [{name: 'AppFlow'}],
            });
            // navigation.navigate('AppFlow');
          } else {
            navigation.reset({
              index: 0,
              routes: [{name: 'Auth', params: {screen: 'getStarted'}}],
            }); 
            // navigation.navigate('Auth', {screen: 'getStarted'});
          }
        }
      });
    }, 1500); // Initial delay before starting animation

    return () => {
      clearTimeout(animationTimer);
      fadeAnim.stopAnimation();
    };
  }, [navigation, isLoggedIn, fadeAnim]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={Images.Splash} style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.8],
                  }),
                },
              ],
            },
          ]}>
          <Image source={Images.Logo} style={styles.image} />
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
