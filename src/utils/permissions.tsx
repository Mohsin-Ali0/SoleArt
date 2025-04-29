import {Platform, Linking, Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// Dynamic function to check and request permissions
export const checkAndRequestPermissions = async (permissions: string[]) => {
  const statuses = await Promise.all(
    permissions.map(permission =>
      Platform.OS === 'android' ? check(permission) : request(permission),
    ),
  );

  const results = permissions.reduce((acc, permission, index) => {
    acc[permission] = statuses[index];
    return acc;
  }, {} as Record<string, string>);

  const blocked = Object.values(results).some(
    status => status === RESULTS.BLOCKED,
  );

  if (blocked) {
    Alert.alert(
      'Permissions Required',
      'Some permissions are blocked. Please enable them in app settings.',
      [{text: 'Open Settings', onPress: () => Linking.openSettings()}],
    );
  }

  return {
    bluetooth: results[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED,
    location:
      results[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === RESULTS.GRANTED,
    notification:
      results[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED,
  };
};

// Helper function to get platform-specific permissions
export const getRequiredPermissions = () => {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    return apiLevel >= 31
      ? [
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          // PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
        ]
      : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];
  } else if (Platform.OS === 'ios') {
    return [
      PERMISSIONS.IOS.BLUETOOTH,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.PHOTO_LIBRARY,
    ];
  }
  return [];
};

// OLD CODE

// This function requests permissions for both Android and iOS platforms

// permissions.tsx
export const requestBluetoothPermissions = async () => {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    const permissions = apiLevel >= 31
      ? [
          PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
          PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ]
      : [
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.BLUETOOTH,
          PERMISSIONS.ANDROID.BLUETOOTH_ADMIN,
        ];

    const statuses = await requestMultiplePermissions(permissions);
    const granted = Object.values(statuses).every(s => s === RESULTS.GRANTED);
    
    // Special handling for Android 12+
    if (apiLevel >= 31) {
      return granted && 
             statuses[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] === RESULTS.GRANTED &&
             statuses[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] === RESULTS.GRANTED;
    }
    return granted;
  }
  return true; // iOS handles permissions differently
};

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return handleAndroidResults({
      [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: status,
    });
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return handleiOSResult(status);
  }
  return false;
};
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const status = await request(PERMISSIONS.ANDROID.CAMERA);
    return handleAndroidResults({
      [PERMISSIONS.ANDROID.CAMERA]: status,
    });
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await request(PERMISSIONS.IOS.CAMERA);
    return handleiOSResult(status);
  }
  return false;
};
export const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const status = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return handleAndroidResults({
      [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]: status,
    });
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return handleiOSResult(status);
  }
  return false;
};

// Helper functions
const requestMultiplePermissions = async (permissions: any[]) => {
  const results = await Promise.all(permissions.map(p => request(p)));
  return permissions.reduce((acc, perm, index) => {
    acc[perm] = results[index];
    return acc;
  }, {});
};

const handleAndroidResults = (statuses: Record<string, string>) => {
  const blocked = Object.values(statuses).some(s => s === RESULTS.BLOCKED);
  const granted = Object.values(statuses).every(s => s === RESULTS.GRANTED);

  if (blocked) {
    Alert.alert(
      'Permissions Required',
      'Please enable Bluetooth permissions in app settings',
      [{text: 'Open Settings', onPress: () => Linking.openSettings()}],
    );
  }
  return granted;
};

const handleiOSResult = (status: string) => {
  if (status === RESULTS.BLOCKED) {
    Alert.alert('Permission Required', 'Please enable Bluetooth in Settings', [
      {text: 'Open Settings', onPress: () => Linking.openSettings()},
    ]);
  }
  return status === RESULTS.GRANTED;
};

// This function checks if the required permissions are granted
export const checkPermissions = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const apiLevel = Platform.Version;

    const permissions =
      apiLevel >= 31
        ? [
            PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    const statuses = await checkMultiplePermissions(permissions);
    return handleAndroidResults(statuses);
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await check(PERMISSIONS.IOS.BLUETOOTH);
    return handleiOSResult(status);
  }
  return false;
};

const checkMultiplePermissions = async (permissions: any[]) => {
  const results = await Promise.all(permissions.map(p => check(p)));
  return permissions.reduce((acc, perm, index) => {
    acc[perm] = results[index];
    return acc;
  }, {});
};
export const checkLocationPermission = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    return handleAndroidResults({
      [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]: status,
    });
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return handleiOSResult(status);
  }
  return false;
};
export const checkCameraPermission = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const status = await check(PERMISSIONS.ANDROID.CAMERA);
    return handleAndroidResults({
      [PERMISSIONS.ANDROID.CAMERA]: status,
    });
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await check(PERMISSIONS.IOS.CAMERA);
    return handleiOSResult(status);
  }
  return false;
};
export const checkStoragePermission = async () => {
  if (Platform.OS === 'android') {
    // Android-specific logic
    const status = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    return handleAndroidResults({
      [PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]: status,
    });
  } else if (Platform.OS === 'ios') {
    // iOS-specific logic
    const status = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    return handleiOSResult(status);
  }
  return false;
};
