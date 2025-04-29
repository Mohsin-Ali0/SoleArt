// src/contexts/DeviceContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {BleManager, Device, Characteristic} from 'react-native-ble-plx';
import {
  BLE_SERVICE_UUID,
  BLE_CHARACTERISTICS,
  COMMANDS,
  ERROR_MAP,
} from '../utils/constants';
import {decodeError} from '../utils/errors';
import {requestBluetoothPermissions} from '../utils/permissions';
import {Alert} from 'react-native';

type DeviceContextType = {
  devices: Device[];
  isConnected: boolean;
  cycleStatus: string;
  notifications: string[];
  connectedDevice: Device | null;
  connecting: boolean;
  timer: Number;
  pressure: Number;
  scanDevices: () => void;
  StartCycle: (type: string) => void;
  StopCycle: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
  disconnectDevice: () => Promise<void>;
  connectionError: string | null;
  disconnectError: string | null;
};

const DeviceContext = createContext<DeviceContextType>({} as DeviceContextType);

export const DeviceProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [bleManager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pressure, setPressure] = useState(500);
  const [cycleStatus, setCycleStatus] = useState('Idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);

  // DeviceContext.tsx
  const scanDevices = async () => {
    setIsCheckingPermissions(true);
    clearErrors();
    try {
      const hasPermission = await requestBluetoothPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permissions required',
          'Bluetooth permissions not granted',
        );
        return;
      }

      const state = await bleManager.state();
      if (state !== 'PoweredOn') {
        Alert.alert('Bluetooth Off', 'Please enable Bluetooth to scan');
        return;
      }

      // Clear existing devices
      setDevices([]);

      // Stop any existing scans
      bleManager.stopDeviceScan();

      // Start new scan with error handling
      const subscription = bleManager.onStateChange(async state => {
        if (state === 'PoweredOn') {
          console.log('Bluetooth is powered on, starting scan...');
          // bleManager.startDeviceScan(
          //   [BLE_SERVICE_UUID],
          //   null,
          //   (error, device) => {
          //     console.log('Scanning for devices...', device);
          //     if (error) {
          //       console.error('Scan error:', error);
          //       subscription.remove();
          //       bleManager.stopDeviceScan();
          //       return;
          //     }
          //     console.log('Discovered device:', device);
          //     if (device) {
          //       setDevices(prev => {
          //         const exists = prev.some(d => d.id === device.id);
          //         return exists ? prev : [...prev, device];
          //       });
          //     }
          //   },
          // );

          bleManager.startDeviceScan(
            null, // Remove service UUID filter
            {allowDuplicates: false},
            (error, device) => {
              if (error) {
                console.error('Scan error:', error);
                return;
              }
              // Remove name filter - accept all devices
              if (device && device.isConnectable) {
                setDevices(prev => {
                  const exists = prev.some(d => d.id === device.id);
                  return exists ? prev : [...prev, device];
                });
              }
            },
          );

          console.log('Scanning for devices...', subscription);
          // Stop scanning after 10 seconds
          setTimeout(() => {
            subscription.remove();
            bleManager.stopDeviceScan();
          }, 10000);
        }
      }, true);
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Scan Failed', 'Could not start scanning. Please try again.');
    } finally {
      setIsCheckingPermissions(false);
    }
  };

  // Connect to device
  const connectToDevice = async (device: Device) => {
    try {
      clearErrors();
      setConnecting(true);

      const connected = await device.connect();
      const discovered =
        await connected.discoverAllServicesAndCharacteristics();

      // Subscribe to status updates
      discovered.monitorCharacteristicForService(
        BLE_SERVICE_UUID,
        BLE_CHARACTERISTICS.STATUS,
        (error, characteristic) => {
          if (error || !characteristic?.value) return;
          const status = atob(characteristic.value);
          // setCycleStatus(status);
        },
      );

      // Subscribe to error notifications
      discovered.monitorCharacteristicForService(
        BLE_SERVICE_UUID,
        BLE_CHARACTERISTICS.ERRORS,
        (error, characteristic) => {
          if (error || !characteristic?.value) return;
          const errorCode = atob(characteristic.value);
          setNotifications(prev => [...prev, decodeError(errorCode)]);
        },
      );

      setConnectedDevice(discovered);
      setCycleStatus('Idle');
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionError((error as Error)?.message || 'Connection failed');
    } finally {
      setConnecting(false);
    }
  };

  // Send commands to device
  const sendCommand = async (command: string) => {
    if (!connectedDevice) return;

    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        BLE_SERVICE_UUID,
        BLE_CHARACTERISTICS.COMMAND,
        btoa(command),
      );
    } catch (error) {
      console.error('Command failed:', error);
    }
  };

  const disconnectDevice = async () => {
    try {
      if (!connectedDevice) {
        setDisconnectError('No device connected');
        return;
      }
      if (connectedDevice) {
        await connectedDevice.cancelConnection();
        setConnectedDevice(null);
        setCycleStatus('Idle');
        setNotifications([]);
        console.log('Disconnected from device');
      }
    } catch (error) {
      console.error('Disconnection failed:', error);
      setConnectedDevice(null);
      setCycleStatus('Idle');
      setNotifications([]);
      setConnecting(false);
      setDisconnectError((error as Error)?.message || 'Connection failed');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bleManager.stopDeviceScan();
      connectedDevice?.cancelConnection();
    };
  }, []);

  const intervalRef = useRef(null);

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
  const clearErrors = () => {
    setConnectionError(null);
    setDisconnectError(null);
  };
  return (
    <DeviceContext.Provider
      value={{
        devices,
        isConnected: !!connectedDevice,
        cycleStatus,
        notifications,
        scanDevices,
        connectToDevice,
        sendCommand,
        connectedDevice,
        disconnectDevice,
        connecting,
        timer,
        pressure,
        StopCycle,
        StartCycle,
        connectionError,
        disconnectError,
      }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
