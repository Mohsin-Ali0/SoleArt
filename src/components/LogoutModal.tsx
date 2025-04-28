import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {fonts, fontSize} from '../utils/fonts';
import {color} from '../utils/colors';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';
import {Icons} from '../../assets';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  visible,
  onClose,
  onLogout,
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
          <Text style={styles.modalHeading}>Logout</Text>
          <Text style={styles.modalText}>
            Are you sure you want to log out?
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={onLogout}>
              <Text style={styles.buttonText}>Yes, sure</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.logoutButton]}
              onPress={onClose}>
              <Text style={[styles.buttonText, {color: color.primary}]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background overlay
  },
  modalContainer: {
    position: 'absolute',
    width: ScreenWIDTH * 0.9,
    height: ScreenHEIGHT * 0.25,
    backgroundColor: color.white,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 5, // For Android shadow
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ScreenWIDTH * 0.05,
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  modalHeading: {
    fontSize: fontSize.regular2,
    fontWeight: '600',
    marginBottom: 10,
    fontFamily: fonts.urbanistMedium,
    letterSpacing: -0.3,
  },
  modalText: {
    fontSize: fontSize.small,
    fontWeight: '300',
    marginBottom: ScreenHEIGHT * 0.03,
    textAlign: 'center',
    letterSpacing: 0.7,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    width: '45%',
    paddingVertical: 12,
    backgroundColor: color.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButton: {
    // backgroundColor: '#EB5757',
    backgroundColor: color.white,
    borderWidth: 1,
    borderColor: color.primary,
    color: color.primary,
  },
  buttonText: {
    fontSize: fontSize.xxsmall,
    fontWeight: '500',
    color: color.white,
    fontFamily: fonts.urbanistMedium,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
});

export default LogoutModal;
