import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Icons} from '../../assets';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';
import {color} from '../utils/colors';
import {fonts, fontSize} from '../utils/fonts';
import {useDevice} from '../context/DeviceContext';
import LogoutModal from './LogoutModal';

interface BluetoothModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: () => void;
  heading: string;
  title: string;
  buttonTitle: string;
  logo: any; // The image or logo to display in the modal
}

const BluetoothModal: React.FC<BluetoothModalProps> = ({
  visible,
  onClose,
  onAction,
  heading,
  title,
  buttonTitle,
}) => {
  const {
    scanDevices,
    devices,
    connectToDevice,
    connecting,
    isConnected,
    connectedDevice,
    disconnectDevice,
    connectionError,
    disconnectError,
  } = useDevice();

  const [showModal, setShowModal] = useState(false);

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
              source={Icons.Close}
              resizeMode="contain"
              style={{width: 13, height: 13}}
            />
          </TouchableOpacity>

          <Text style={styles.heading}>{heading}</Text>
          {/* Device List */}
          <View
            style={{
              width: '100%',
              maxHeight: ScreenHEIGHT * 0.4,
            }}>
            {isConnected ? (
              <>
                <Text style={styles.title}>Connected Device</Text>

                <TouchableOpacity
                  style={styles.notificationContainer}
                  onPress={() => {
                    setShowModal(true);
                  }}>
                  <View style={[styles.ellipse, {backgroundColor: 'green'}]} />
                  <View style={styles.textContainer}>
                    <Text style={styles.notificationText}>
                      {connectedDevice?.name
                        ? connectedDevice?.name
                        : ' Unknown Device'}
                    </Text>
                    <Text style={styles.dateText}>
                      {connectedDevice?.id} • RSSI: {connectedDevice?.rssi}
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <ScrollView>
                {connecting ? (
                  <>
                    <View style={styles.connectingContainer}>
                      <ActivityIndicator size="large" color={color.primary} />
                      <Text style={styles.connectingText}>Connecting...</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.title}>{title}</Text>
                    {!isConnected && (connectionError || disconnectError) && (
                      <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                          {connectionError || disconnectError}
                        </Text>
                      </View>
                    )}
                    {devices.map((device, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.notificationContainer}
                        onPress={() => connectToDevice(device)}>
                        <View style={styles.textContainer}>
                          <Text style={styles.notificationText}>
                            {device.name || 'Unknown Device'}{' '}
                          </Text>
                          <Text style={styles.dateText}>
                            {' '}
                            {device.id} • RSSI: {device.rssi}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </ScrollView>
            )}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={
              isConnected ? () => setShowModal(true) : () => scanDevices()
            }>
            <Text style={styles.buttonText}>
              {isConnected ? 'Disconnect' : buttonTitle}
            </Text>
          </TouchableOpacity>

          <LogoutModal
            visible={showModal}
            onClose={() => setShowModal(false)} // Close the modal
            onPress={() => {
              disconnectDevice();
              setShowModal(false);
            }}
            heading="Disconnect Device"
            title="Are you sure you want to Disconnect?"
            buttonTitle1="Yes, sure"
            buttonTitle2="Cancel"
          />
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

  //  // Add any additional styles you need for the modal here

  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ScreenHEIGHT * 0.01,
    gap: 16,
    borderWidth: 1,
    borderColor: color.grey0,
    borderRadius: 6,
    paddingBottom: ScreenHEIGHT * 0.01,
    marginBottom: ScreenHEIGHT * 0.01,
  },
  ellipse: {
    width: ScreenWIDTH * 0.02,
    height: ScreenHEIGHT * 0.01,
    backgroundColor: color.red1,
    borderRadius: 4,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    width: '85%',
  },
  notificationText: {
    fontFamily: fonts.urbanistMedium,
    fontWeight: '500',
    fontSize: fontSize.xxxsmall,
    lineHeight: 16,
    letterSpacing: 0.02,
    color: color.black0,
  },
  dateText: {
    fontFamily: fonts.urbanistMedium,
    fontWeight: '500',
    fontSize: fontSize.xxxsmall,
    lineHeight: 12,
    letterSpacing: 0.02,
    color: color.grey0,
  },

  errorContainer: {
    backgroundColor: color.red1 + '20',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: color.red3,
    fontSize: fontSize.xxxsmall,
    textAlign: 'center',
    fontFamily: fonts.urbanistMedium,
  },
  connectingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  connectingText: {
    marginTop: 10,
    color: color.primary,
    fontSize: fontSize.xxsmall,
  },
});

export default BluetoothModal;
