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
import AppInput from '../../../components/AppInput';
import NotificationBottomSheet from '../../../components/Notification';
import LogoutModal from '../../../components/LogoutModal';
import GeneralModal from '../../../components/GeneralModal';

const DummyText = {
  text: ' nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut. Lorem ipsum dolor sit amet consectetur. Dignissim tortor duis enim lectus diam ut. Nunc tortor pellentesque nunc etiam tellus. Lorem in interdum aliquam eget. Quis eget ornare a interdum ut.',
};

const ContactUsScreen = (props: any) => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState({
    feedback: '',
  });

  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const HandleNotifications = () => {
    setIsLoading(true);
    setIsSheetVisible(true);
    setIsVisible(false);
    setTimeout(() => {
      setIsLoading(false);
      //   navigation.navigate('Splash');
    }, 2000);
  };
  const HandleText = (text: string) => {
    setFeedback(text);
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
        <Image source={Images.ContactUsLogo} style={styles.logo} />

        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.title}>{DummyText.text}</Text>

        <AppInput
          placeholder="e.g., pain point, and troubling in connections, hard to understand, etc."
          keyboardType="default"
          onChangeText={(text: string) => HandleText(text)}
          value={feedback}
          numberOfLines={4}
          multiline={true}
          error={error.feedback} // Pass the error message
          InputStyle={{
            height: ScreenHEIGHT * 0.2,
            alignItems: 'flex-start',
          }}
        />
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => HandleNotifications()}>
          {isLoading ? (
            <ActivityIndicator size="small" color={color.white} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <GeneralModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        onAction={isVisible ? () => setIsVisible(false) : () => {}}
        heading="Important Notice"
        title="This is a sample modal that you can customize with different titles, headings, and logos."
        buttonTitle="Proceed"
        logo={Images.Inturreption2} // Pass the logo here
      />

      {/* <NotificationBottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}>
        {[...Array(9)].map((_, index) => (
          <View key={index} style={styles.notificationContainer}>
            <View style={styles.ellipse} />
            <View style={styles.textContainer}>
              <Text style={styles.notificationText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry.
              </Text>
              <Text style={styles.dateText}>March 20, 2024</Text>
            </View>
          </View>
        ))}
      </NotificationBottomSheet> */}
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

export default ContactUsScreen;
