import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {color} from '../utils/colors';
import {fonts, fontSize, fontWeight} from '../utils/fonts';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  style?: object;
  textStyle?: object;
}

const GeneralButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  width = 330,
  height = 56,
  backgroundColor,
  borderColor,
  textColor,
  style,
  textStyle,
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: color.transparent,
          borderWidth: 1,
          borderColor: color.secondary,
        };
      case 'primary':
      default:
        return {
          backgroundColor: color.primary,
          borderWidth: 0,
        };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        getVariantStyle(),
        {
          width,
          height,
          backgroundColor,
          borderColor,
        },
        style,
      ]}>
      <Text
        style={[
          styles.text,
          {
            color: textColor,
          },
          textStyle,
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: fonts.urbanistRegular,
    fontWeight: 700,
    fontSize: fontSize.small,
    textAlign: 'center',
  },
});

export default GeneralButton;
