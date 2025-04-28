import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Image} from 'react-native';
import {
  Animated,
  Modal,
  StyleSheet,
  View,
  Pressable,
  Text,
  ScrollView,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import {color} from '../utils/colors';
import {ScreenHEIGHT, ScreenWIDTH} from '../utils/dimensions';
import {fonts, fontSize} from '../utils/fonts';
import {Icons} from '../../assets';

const {height: screenHeight} = Dimensions.get('window');

// Define snap points (e.g., 80%, 50%, and closed)
const SNAP_POINTS = [screenHeight * 0.85, screenHeight * 0.2, screenHeight];

const NotificationBottomSheet = ({
  visible,
  onClose,
  ReadNotifications,
  isLoading,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  ReadNotifications: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}) => {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(1); // Start at mid-level
  const slideAnim = useRef(
    new Animated.Value(SNAP_POINTS[currentSnapIndex]),
  ).current;

  const show = () => {
    Animated.timing(slideAnim, {
      toValue: SNAP_POINTS[currentSnapIndex],
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const hide = () => {
    Animated.timing(slideAnim, {
      toValue: SNAP_POINTS[2], // Moves it completely off-screen
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      onClose();
    });
  };

  useEffect(() => {
    if (visible) {
      show();
    } else {
      hide();
    }
  }, [visible, currentSnapIndex]);

  // **PanResponder for Dragging & Resizing**
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 10,
      onPanResponderMove: (_, gestureState) => {
        slideAnim.setValue(SNAP_POINTS[currentSnapIndex] + gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If dragged down enough, close it
          hide();
        } else {
          // Snap to closest position
          let newIndex = currentSnapIndex;

          if (gestureState.dy < -50 && currentSnapIndex > 0) {
            newIndex--; // Move up
          } else if (
            gestureState.dy > 50 &&
            currentSnapIndex < SNAP_POINTS.length - 1
          ) {
            newIndex++; // Move down
          }

          setCurrentSnapIndex(newIndex);
          Animated.spring(slideAnim, {
            toValue: SNAP_POINTS[newIndex],
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      statusBarTranslucent>
      {/* Background Overlay */}
      <Pressable style={styles.overlay} onPress={hide} />

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.sheet, {height: SNAP_POINTS[0], top: slideAnim}]}
        {...panResponder.panHandlers} // Attach swipe-to-close & resizing
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} onPress={hide}>
            <Image
              source={Icons.BackIcon}
              resizeMode="contain"
              style={styles.chatIcon}
              height={ScreenHEIGHT * 0.03}
              width={ScreenHEIGHT * 0.03}
            />
          </TouchableOpacity>

          <View style={styles.headerTitle}>
            <Text style={styles.title}>Notifications</Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.content}>{children}</ScrollView>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => ReadNotifications()}>
          {isLoading ? (
            <ActivityIndicator size="large" color={color.white} />
          ) : (
            <Text style={styles.buttonText}>Mark as read</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

export default NotificationBottomSheet;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: color.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: ScreenWIDTH * 0.05,
    paddingTop: ScreenHEIGHT * 0.025,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: ScreenWIDTH * 0.1,
  },
  headerTitle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: ScreenWIDTH * 0.8,
  },
  title: {
    color: color.black,
    fontSize: fontSize.regular2,
    fontWeight: '600',
    fontFamily: fonts.urbanistMedium,
    marginLeft: ScreenWIDTH * -0.08,
    textAlign: 'center',
  },
  content: {
    marginTop: ScreenHEIGHT * 0.03,
    marginBottom: ScreenHEIGHT * 0.05,
  },
  chatIcon: {
    height: ScreenHEIGHT * 0.05,
    tintColor: color.black,
  },

  loginButton: {
    height: ScreenHEIGHT * 0.07,
    width: ScreenWIDTH * 0.9,
    backgroundColor: color.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: ScreenHEIGHT * 0.02,
    alignSelf: 'center',
    marginBottom: ScreenHEIGHT * 0.02,
  },
  buttonText: {
    fontFamily: fonts.urbanistMedium,
    fontWeight: '700',
    fontSize: fontSize.small,
    color: color.white,
  },
});
