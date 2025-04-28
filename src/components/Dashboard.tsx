// Dashboard.js
import {Button, Text, TouchableOpacity} from 'react-native';

const Dashboard = () => {
    const { cycleStatus, temperature, timeRemaining } = useBle();
  
    return (
      <View>
        <Text>Status: {cycleStatus}</Text>
        <Text>Temperature: {temperature}°F</Text>
        <Text>Time Remaining: {timeRemaining} hours</Text>
      </View>
    );
  };