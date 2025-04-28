// src/screens/HomeScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useDevice} from '../context/DeviceContext';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';
import {Icons} from '../../assets';
import {color} from '../utils/colors';
import {fonts, fontSize} from '../utils/fonts';
import NotificationBottomSheet from '../components/Notification';
import LottieView from 'lottie-react-native';
import BluetoothModal from '../components/BluetoothModal';

const HomeScreen = (props: any) => {
  // const {isConnected, cycleStatus, scanDevices, devices, connectToDevice} =
  //   useDevice();
  const [isConnected, setIsConnected] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pressure, setPressure] = useState(500);
  const [cycleStatus, setCycleStatus] = useState('Idle');
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [showDevices, setshowDevices] = useState(false);

  const intervalRef = useRef(null); // Ref to hold the interval ID

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const StartCycle = (type: String) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    switch (type) {
      case 'Begin Conditioning':
        setCycleStatus('Conditioning');
        setTimer(0);
        RunTimer();

        break;
      case 'Begin Freeze Drying':
        setCycleStatus('Freeze Drying');
        setTimer(0);
        RunTimer();
        break;
      default:
        break;
    }
  };

  const StopCycle = () => {
    setCycleStatus('Idle');
    setTimer(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };
  const RunTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
  };
  const scanDevices = () => {};
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.IconContainer}>
          <TouchableOpacity
            style={styles.IconPressable}
            onPress={() => props.navigation.toggleDrawer()}>
            <Image source={Icons.Drawer} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.IconPressable}
            onPress={() => {
              setIsSheetVisible(true);
            }}>
            <Image source={Icons.Notification} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.BluetoothContainer,
            isConnected
              ? {backgroundColor: color.secondary}
              : {
                  backgroundColor: color.white,
                  borderColor: color.secondary,
                  borderWidth: 2,
                },
          ]}
          onPress={() => {
            setshowDevices(true);
          }}>
          <Image
            source={isConnected ? Icons.Bluetooth : Icons.BluetoothOff}
            style={[
              styles.BluetoothIcon,
              isConnected
                ? {tintColor: color.white}
                : {tintColor: color.secondary},
            ]}
          />
          {isConnected ? (
            <Text style={[styles.BluetoothText, {color: color.white}]}>
              Connected
            </Text>
          ) : (
            <Text style={[styles.BluetoothText, {color: color.secondary}]}>
              Connect Now
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.timerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={[
              styles.ellipse,
              cycleStatus === 'Idle' && {backgroundColor: color.disable},
              cycleStatus === 'Conditioning' && {backgroundColor: color.yellow},
              cycleStatus === 'Freeze Drying' && {
                backgroundColor: color.primary,
              },
            ]}
          />
          <Text style={styles.beginningConditionsText}>
            Beginning Conditions
          </Text>
        </View>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
      </View>

      {cycleStatus !== 'Idle' && (
        <LottieView
          source={require('../../assets/icons/ripple.json')}
          autoPlay
          loop
          style={styles.lottie}
          speed={0.5}
          resizeMode="center"
        />
      )}

      <View style={styles.buttonContainer}>
        {cycleStatus === 'Conditioning' ? (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: color.red3}]} // Begin Conditioning Button
            onPress={() => StopCycle()}
            disabled={cycleStatus !== 'Idle' && cycleStatus !== 'Conditioning'}>
            <Text style={styles.buttonText}>Stop Conditioning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              cycleStatus === 'Idle' && {
                backgroundColor: color.yellow,
              },
              cycleStatus === 'Conditioning' && {
                backgroundColor: color.disable,
              },
              cycleStatus === 'Freeze Drying' && {
                backgroundColor: color.disable,
              },
            ]} // Begin Conditioning Button
            onPress={() => StartCycle('Begin Conditioning')}
            disabled={cycleStatus !== 'Idle' && cycleStatus !== 'Conditioning'}>
            <Text style={styles.buttonText}>Begin Conditioning</Text>
          </TouchableOpacity>
        )}

        {cycleStatus === 'Freeze Drying' ? (
          <TouchableOpacity
            style={[styles.button, {backgroundColor: color.red3}]}
            onPress={() => StopCycle()}
            disabled={
              cycleStatus !== 'Freeze Drying' && cycleStatus !== 'Idle'
            }>
            <Text style={styles.buttonText}>Stop Freeze Drying</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              cycleStatus === 'Idle' && {
                backgroundColor: color.primary,
              },
              cycleStatus === 'Conditioning' && {
                backgroundColor: color.disable,
              },
            ]}
            onPress={() => StartCycle('Begin Freeze Drying')}
            disabled={
              cycleStatus !== 'Freeze Drying' && cycleStatus !== 'Idle'
            }>
            <Text style={styles.buttonText}>Begin Freeze Drying</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.pressureContainer}>
        <Text style={styles.pressureText}>Pressure</Text>
        <Text style={styles.pressureValue}>
          {pressure} <Text style={styles.pressureUnit}>Microns</Text>
        </Text>
      </View>
      <NotificationBottomSheet
        visible={isSheetVisible}
        onClose={() => setIsSheetVisible(false)}
        ReadNotifications={() => {}}
        isLoading={false}>
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
      </NotificationBottomSheet>

      <BluetoothModal
        visible={showDevices}
        onClose={() => setshowDevices(false)}
        onAction={() => {}}
        heading="Scan for Devices"
        title="Please turn on Bluetooth to scan for devices."
        buttonTitle="Scan"
        logo={Icons.Bluetooth}>
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
      </BluetoothModal>
    </View>
  );

  return (
    <View style={{padding: 20}}>
      <Text>
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
      <Text>Cycle Status: {cycleStatus}</Text>

      <Button title="Scan for Devices" onPress={scanDevices} />

      {devices.map(device => (
        <Button
          key={device.id}
          title={`Connect to ${device.name}`}
          onPress={() => connectToDevice(device)}
        />
      ))}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: ScreenHEIGHT * 0.1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  IconContainer: {
    width: '30%',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  IconPressable: {
    width: '50%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: ScreenWIDTH * 0.07,
    height: ScreenHEIGHT * 0.08,
    tintColor: color.black0,
    resizeMode: 'contain',
  },

  BluetoothContainer: {
    width: '35%',
    height: '65%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    marginRight: ScreenWIDTH * 0.03,
  },
  BluetoothIcon: {
    width: ScreenWIDTH * 0.05,
    height: ScreenHEIGHT * 0.05,
    tintColor: color.white,
    resizeMode: 'contain',
  },
  BluetoothText: {
    color: color.white,
    fontSize: fontSize.xxxsmall,
    fontFamily: fonts.urbanistMedium,
    fontWeight: '600',
    marginLeft: 5,
  },
  ContentContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },

  //
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ScreenHEIGHT * 0.04,
  },
  beginningConditionsText: {
    fontSize: fontSize.small,
    color: color.black0,
    fontWeight: '500',
    marginLeft: 10,
    fontFamily: fonts.urbanistMedium,
  },
  timer: {
    fontSize: 46,
    color: color.black0,
    fontWeight: '700',
    fontFamily: fonts.urbanistMedium,
  },
  buttonContainer: {
    marginTop: ScreenHEIGHT * 0.12,
    marginBottom: ScreenHEIGHT * 0.2,
  },
  button: {
    height: ScreenHEIGHT * 0.1,
    width: ScreenWIDTH * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: ScreenHEIGHT * 0.05,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: fontSize.medium,
    color: color.white,
    fontWeight: '600',
  },
  lottie: {
    position: 'absolute',
    width: ScreenWIDTH * 2,
    height: ScreenHEIGHT * 2,
    top: -ScreenHEIGHT * 0.5,
    left: -180,
    zIndex: -1, // So it does not block the text
  },
  pressureContainer: {
    alignItems: 'center',
    height: ScreenHEIGHT * 0.1,
    width: ScreenWIDTH * 0.9,
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: color.white,
    alignSelf: 'center',
    flexDirection: 'row',
    elevation: 5,
  },
  pressureText: {
    fontSize: fontSize.regular2,
    color: color.black0,
    fontWeight: '500',
    marginLeft: ScreenWIDTH * 0.05,
    fontFamily: fonts.urbanistMedium,
  },
  pressureValue: {
    fontSize: 40,
    color: color.primary,
    fontWeight: '700',
    fontFamily: fonts.urbanistMedium,
    marginRight: ScreenWIDTH * 0.05,
  },
  pressureUnit: {
    fontSize: fontSize.regular,
    color: color.primary,
    fontWeight: '400',
    fontFamily: fonts.urbanistThin,
  },
  //
  //   BOTTOM SHEET

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
});
