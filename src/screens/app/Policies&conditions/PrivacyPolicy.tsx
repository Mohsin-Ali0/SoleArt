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
import {useNavigation} from '@react-navigation/native';
import {color} from '../../../utils/colors';
import {Icons, Images} from '../../../../assets';
import {ScreenHEIGHT, ScreenWIDTH} from '../../../utils/dimensions';
import {fonts, fontSize} from '../../../utils/fonts';

const DummyText = {
  text: 'Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut.   Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut.',
};

const PrivacyPolicy = (props: any) => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);

  const HandleNotifications = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      //   navigation.navigate('Splash');
    }, 2000);
  };
  return (
    <LinearGradient
      colors={[color.secondary, color.primary]}
      style={styles.gradient}
      start={{x: 0, y: 1.1}}
      end={{x: 2, y: 1}}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => props.navigation.toggleDrawer()}>
        <Image source={Icons.BackIcon} style={styles.backIcon} />
      </TouchableOpacity>

      <ScrollView
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}>
        <Image source={Images.PolicyLogo} style={styles.logo} />

        <Text style={styles.heading}>Privacy & Policy</Text>
        <Text style={styles.title}>{DummyText.text}</Text>
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
    lineHeight: 16,
    letterSpacing: 0.7,
    marginBottom: ScreenHEIGHT * 0.05,
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

export default PrivacyPolicy;
