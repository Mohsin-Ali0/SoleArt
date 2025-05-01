import React, {forwardRef, useState} from 'react';
import {
  Image,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {Icons} from '../../assets';
import {fonts, fontSize} from '../utils/fonts';
import {color} from '../utils/colors';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';

interface AppInputProps {
  label?: string;
  required?: boolean;
  containerStyle?: object;
  InputStyle?: object;
  style?: object;
  placeholder?: string;
  value?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  rightIcon?: any;
  leftIcon?: any;
  disabled?: boolean;
  onPressRightIcon?: () => void;
  keyboardType?: string;
  maxLength?: number;
  error?: string;
  [key: string]: any; // Allow additional props
}

const AppInput = forwardRef<TextInput, AppInputProps>((props, ref) => {
  const {
    label,
    required,
    containerStyle,
    InputStyle,
    style,
    placeholder,
    value,
    placeholderTextColor = color.grey1,
    secureTextEntry,
    onChangeText,
    rightIcon,
    leftIcon,
    disabled,
    onPressRightIcon,
    keyboardType,
    maxLength,
    error,
    ...restProps
  } = props;

  const [showPassword, setShowPassword] = useState(secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}>*</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          disabled && styles.disabled,
          error && {borderColor: color.red}, // Change border color on error
          InputStyle,
        ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Image source={leftIcon} style={styles.icon} />
          </View>
        )}

        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={showPassword}
          editable={!disabled}
          keyboardType={keyboardType}
          maxLength={maxLength}
          {...restProps}
        />

        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={
              secureTextEntry
                ? () => setShowPassword(!showPassword)
                : onPressRightIcon
            }>
            <Image
              source={
                secureTextEntry
                  ? showPassword
                    ? Icons.EyeClosed
                    : Icons.EyeOpen
                  : rightIcon
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: ScreenHEIGHT * 0.02,
    width: '100%',
  },
  labelContainer: {
    marginBottom: ScreenHEIGHT * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.urbanistMedium,
    fontSize: fontSize.xsmall,
    color: color.grey1,
  },
  required: {
    color: color.red,
    marginLeft: ScreenWIDTH * 0.01,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ScreenHEIGHT * 0.07,
    borderWidth: 1,
    borderColor: '#D0DAEE',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: ScreenWIDTH * 0.04,
  },
  input: {
    height: '100%',
    width: '85%',
    fontFamily: fonts.urbanistMedium,
    fontSize: fontSize.xsmall,
    color: color.grey1,
    paddingVertical: ScreenHEIGHT * 0.01,
    marginHorizontal: ScreenWIDTH * 0.02,
  },
  iconContainer: {
    padding: ScreenWIDTH * 0.02,
    justifyContent: 'center',
  },
  icon: {
    width: ScreenWIDTH * 0.05,
    height: ScreenHEIGHT * 0.03,
    tintColor: color.grey1,
    resizeMode: 'contain',
  },
  disabled: {
    backgroundColor: '#F4F8FF',
    opacity: 0.7,
  },
  errorText: {
    fontFamily: fonts.urbanistMedium,
    fontSize: fontSize.xxsmall,
    color: color.red,
    marginTop: ScreenHEIGHT * 0.01,
  },
});

export default AppInput;
