// src/utils/constants.ts
export const BLE_SERVICE_UUID = '0000abcd-0000-1000-8000-00805f9b34fb';

export const BLE_CHARACTERISTICS = {
  STATUS: '0000beef-0000-1000-8000-00805f9b34fb', // Read/Notify
  COMMAND: '0000deaf-0000-1000-8000-00805f9b34fb', // Write
  ERRORS: '0000feed-0000-1000-8000-00805f9b34fb'  // Notify
};

export const COMMANDS = {
  START_CONDITIONING: 'CONDITION_START',
  START_DRYING: 'DRY_START',
  ABORT_CYCLE: 'ABORT'
};

export const ERROR_MAP = {
  E001: 'Inadequate Vacuum: Check hose connections',
  E002: 'Temperature out of range (40-80°F required)',
  E003: 'Power interruption detected',
  E004: 'Vacuum pump oil degraded'
};