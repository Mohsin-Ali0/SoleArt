import {View} from 'react-native-reanimated/lib/typescript/Animated';
import {useBle} from '../contexts/DeviceContext';
import {Button, Text, TouchableOpacity} from 'react-native';

const DeviceScanner = () => {
  const {scanDevices, devices} = useBle();

  return (
    <View>
      <Button title="Scan for Devices" onPress={scanDevices} />
      {devices.map(device => (
        <TouchableOpacity
          key={device.id}
          onPress={() => connectToDevice(device)}>
          <Text>{device.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
