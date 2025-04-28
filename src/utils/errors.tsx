// src/utils/errors.ts
import { ERROR_MAP } from './constants';

export const decodeError = (errorCode: string): string => {
  return ERROR_MAP[errorCode as keyof typeof ERROR_MAP] || 'Unknown error';
};

export const handleBleError = (error: any) => {
  console.error('BLE Error:', error);
  // Add platform-specific error handling if needed
};