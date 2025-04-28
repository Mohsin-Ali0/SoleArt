import {color} from '@utils/colors';
import {ScreenHEIGHT, ScreenWIDTH} from '@utils/dimensions';
import React, {ReactNode} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BackgroundWrapperProps {
  children: ReactNode;
  backgroundStyle?: ImageStyle;
  containerStyle?: ViewStyle;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  backgroundStyle,
  containerStyle,
}) => {
  return (
    <ImageBackground
      source={require('@assets/splash.png')} // Ensure this image exists
      style={[styles.background, backgroundStyle]}>
      <SafeAreaView style={[styles.container, containerStyle]}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: color.black,
    paddingTop: ScreenHEIGHT / 18,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
});

export default BackgroundWrapper;
