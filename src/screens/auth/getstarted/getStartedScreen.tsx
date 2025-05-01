import {View, Image, Text, StyleSheet, ImageBackground} from 'react-native';
import GeneralButton from '../../../components/GeneralButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {color} from '../../../utils/colors';
import {Screen} from 'react-native-screens';
import {ScreenHEIGHT} from '../../../utils/dimensions';
import {fontSize} from '../../../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../../../assets';

const getStartedScreen = () => {
  const navigation = useNavigation<any>();
  const HandleNavigation = (type: string) => {
    switch (type) {
      case 'login':
        navigation.navigate('Login');
        console.log('Login Pressed');
        break;
      case 'register':
        navigation.navigate('Register');
        console.log('Register Pressed');
        break;
      default:
        console.log('Default Pressed');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={Images.Splash} style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={Images.Logo} style={styles.image} />
        </View>
        <View style={styles.buttonsContainer}>
          <GeneralButton
            title="Login"
            onPress={() => HandleNavigation('login')}
            variant="primary"
            width={330}
            height={56}
            backgroundColor={color.primary}
            borderColor={color.primary}
            textColor={color.white}
            textStyle={{fontSize: fontSize.small}}
          />
          <GeneralButton
            title="Register Now"
            onPress={() => HandleNavigation('register')}
            variant="secondary"
            width={330}
            height={56}
            // backgroundColor={color.transparent}
            borderColor={color.secondary}
            textColor={color.secondary}
            textStyle={{fontSize: fontSize.small}}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
export default getStartedScreen;

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
  buttonsContainer: {
    width: '100%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
