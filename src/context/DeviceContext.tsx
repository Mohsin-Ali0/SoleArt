// src/contexts/DeviceContext.tsx
import React, {createContext, useContext, useState, useEffect} from 'react';
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
  scanDevices: () => void;
  connectToDevice: (device: Device) => Promise<void>;
  sendCommand: (command: string) => Promise<void>;
  disconnectDevice: () => Promise<void>;
};

const DeviceContext = createContext<DeviceContextType>({} as DeviceContextType);

export const DeviceProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [bleManager] = useState(new BleManager());
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [cycleStatus, setCycleStatus] = useState('DISCONNECTED');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);

  // Scan for PrepShef devices
  const scanDevices = async () => {
    setIsCheckingPermissions(true);
    try {
      const hasPermission = await requestBluetoothPermissions();
      if (!hasPermission) {
        console.error('Bluetooth permissions not granted');
        return;
      }

      // Check Bluetooth state
      const subscription = bleManager.onStateChange(state => {
        if (state === 'PoweredOn') {
          bleManager.startDeviceScan(
            [BLE_SERVICE_UUID],
            null,
            (error, device) => {
              if (error) {
                console.error('Scan error:', error);
                return;
              }
              if (device?.name?.includes('PrepShef')) {
                setDevices(prev => [
                  ...prev.filter(d => d.id !== device.id),
                  device,
                ]);
              }
            },
          );
          subscription.remove(); // stop listening after starting scan
        } else {
          console.warn('Bluetooth not powered on');
          Alert.alert(
            'Bluetooth is Off',
            'Please turn on Bluetooth to scan for devices.',
          );
        }
      }, true);
    } catch (error) {
      console.error('Permission error:', error);
      Alert.alert(
        'Bluetooth Error',
        'Cannot scan without required permissions',
      );
    } finally {
      setIsCheckingPermissions(false);
    }
  };

  // Connect to device
  const connectToDevice = async (device: Device) => {
    try {
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
          setCycleStatus(status);
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
      setCycleStatus('IDLE');
    } catch (error) {
      console.error('Connection failed:', error);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      bleManager.stopDeviceScan();
      connectedDevice?.cancelConnection();
    };
  }, []);

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
        disconnectDevice: async () => {
          await connectedDevice?.cancelConnection();
          setConnectedDevice(null);
          setCycleStatus('DISCONNECTED');
        },
      }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
