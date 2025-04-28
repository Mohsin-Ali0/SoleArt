// src/contexts/DeviceContext.tsx
import {useAsyncStorage} from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  checkAndRequestPermissions,
  checkPermissions,
  getRequiredPermissions,
} from '../utils/permissions';

type UserContextType = {
  userId: string | null;
  setUserId: (userId: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  isCheckingPermissions: boolean;
  setIsCheckingPermissions: (isCheckingPermissions: boolean) => void;
  isBluetoothEnabled: boolean;
  setIsBluetoothEnabled: (isBluetoothEnabled: boolean) => void;
  isLocationEnabled: boolean;
  setIsLocationEnabled: (isLocationEnabled: boolean) => void;
  isNotificationEnabled: boolean;
  setIsNotificationEnabled: (isNotificationEnabled: boolean) => void;
  fcmToken: string | null;
  setFcmToken: (fcmToken: string | null) => void;
  UserDetails: any;
  setUserDetails: (userDetails: any) => void;
  storeUserDetails: (details: any) => Promise<void>;
  retrieveUserDetails: () => Promise<void>;
  clearUserDetails: () => Promise<void>;
};
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const {getItem, setItem, removeItem} = useAsyncStorage('@userDetails');

  const [userId, setUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [UserDetails, setUserDetails] = useState<any>(null);

  const storeUserDetails = async (details: any) => {
    try {
      await setItem(JSON.stringify(details));
      setUserDetails(details);
    } catch (error) {
      console.error('Error storing user details:', error);
    }
  };

  const retrieveUserDetails = async () => {
    try {
      const userDetails = await getItem();
      if (userDetails) {
        setUserDetails(JSON.parse(userDetails));
      }
    } catch (error) {
      console.error('Error retrieving user details:', error);
    }
  };

  const clearUserDetails = async () => {
    try {
      await removeItem();
      setUserDetails(null);
      setUserId(null);
      setIsLoggedIn(false);
      setIsBluetoothEnabled(false);
      setIsLocationEnabled(false);
      setIsNotificationEnabled(false);
      setFcmToken(null);
    } catch (error) {
      console.error('Error clearing user details:', error);
    }
  };
  useEffect(() => {
    retrieveUserDetails();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await getItem();
      setIsLoggedIn(!!userToken);
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const loadPermissions = async () => {
      const requiredPermissions = getRequiredPermissions();
      console.log('requiredPermissions loaded:', {
        requiredPermissions,
      });
      const allGranted = await checkAndRequestPermissions(requiredPermissions);
      console.log('allGranted loaded:', {allGranted});
      setIsCheckingPermissions(
        !(
          allGranted.bluetooth &&
          allGranted.location &&
          allGranted.notification
        ),
      );

      setIsBluetoothEnabled(allGranted.bluetooth);
      setIsLocationEnabled(allGranted.location);
      setIsNotificationEnabled(allGranted.notification);
    };
    loadPermissions();
  }, [isLoggedIn == true]);

  // console.log('UserDetails:', UserDetails);
  // console.log('userId:', userId);
  // console.log('isLoggedIn:', isLoggedIn);
  // console.log('isCheckingPermissions:', isCheckingPermissions);
  // console.log('isBluetoothEnabled:', isBluetoothEnabled);
  // console.log('isLocationEnabled:', isLocationEnabled);
  // console.log('isNotificationEnabled:', isNotificationEnabled);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        isLoggedIn,
        setIsLoggedIn,
        isCheckingPermissions,
        setIsCheckingPermissions,
        isBluetoothEnabled,
        setIsBluetoothEnabled,
        isLocationEnabled,
        setIsLocationEnabled,
        isNotificationEnabled,
        setIsNotificationEnabled,
        fcmToken,
        setFcmToken,
        UserDetails,
        setUserDetails,
        storeUserDetails,
        retrieveUserDetails,
        clearUserDetails,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
