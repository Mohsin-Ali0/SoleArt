import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {Icons} from '../../assets';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';
import {color} from '../utils/colors';
import {fonts, fontSize} from '../utils/fonts';

interface GeneralModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: () => void;
  heading: string;
  title: string;
  buttonTitle: string;
  logo: any;
}

const GeneralModal: React.FC<GeneralModalProps> = ({
  visible,
  onClose,
  onAction,
  heading,
  title,
  buttonTitle,
  logo,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Image
              source={Icons.Close} // Replace with your close icon
              resizeMode="contain"
              style={{width: 13, height: 13}}
            />
          </TouchableOpacity>

          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.title}>{title}</Text>
          <Image
            source={logo}
            resizeMode="contain"
            style={{width: 250, height: 250, marginBottom: ScreenHEIGHT * 0.02}}
          />
          <TouchableOpacity style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
          </TouchableOpacity>
          {/* SCANNDEVICES LIST HERE */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.transparent, // semi-transparent background overlay
  },

  modalContainer: {
    position: 'absolute',
    width: ScreenWIDTH * 0.9,
    backgroundColor: color.white,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 5, // For Android shadow
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ScreenHEIGHT * 0.02,
    paddingHorizontal: ScreenWIDTH * 0.05,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    height: ScreenHEIGHT * 0.03,
    width: ScreenHEIGHT * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: fontSize.regular2,
    fontWeight: '600',
    color: color.black0,
    marginBottom: ScreenHEIGHT * 0.01,
    textAlign: 'center',
  },
  title: {
    fontSize: fontSize.xxsmall,
    fontWeight: '400',
    color: color.black0,
    textAlign: 'center',
    lineHeight: 14,
    letterSpacing: 0.7,
    marginBottom: ScreenHEIGHT * 0.005,
    fontFamily: fonts.urbanistMedium,
  },
  button: {
    width: ScreenWIDTH * 0.5,
    height: ScreenHEIGHT * 0.06,
    backgroundColor: '#2CB78D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: ScreenHEIGHT * 0.02,
  },
  buttonText: {
    fontSize: fontSize.xxsmall,
    fontWeight: '700',
    color: color.white,
    fontFamily: fonts.urbanistMedium,
    textAlign: 'center',
  },
});

export default GeneralModal;
