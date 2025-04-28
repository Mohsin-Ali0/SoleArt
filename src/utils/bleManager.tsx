import {Alert} from 'react-native';

// utils/bleManager.js
export const handleErrors = errorCode => {
  const errors = {
    VACUUM_LOW: 'Inadequate Vacuum: Check hose connections.',
    TEMP_OUT_OF_RANGE: 'Room temperature outside 40–80°F.',
    POWER_FAILURE: 'Power interruption detected. Resume or restart cycle.',
  };
  Alert.alert('Error', errors[errorCode] || 'Unknown error');
};
