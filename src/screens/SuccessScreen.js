import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../components/Button';
import {useApp} from '../context/AppContext';
import colors from '../utils/colors';

const SuccessScreen = ({navigation}) => {
  const {resetApp} = useApp();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const confettiLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(confettiAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    confettiLoop.start();

    return () => {
      confettiLoop.stop();
    };
  }, []);

  const handleDone = () => {
    resetApp();
    navigation.navigate('RoleSelection');
  };

  const confettiRotate = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.confettiContainer}>
          <Animated.Text
            style={[
              styles.confetti,
              {
                transform: [
                  {rotate: confettiRotate},
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 100],
                    }),
                  },
                ],
                opacity: confettiAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1, 0],
                }),
              },
            ]}>
            🎉
          </Animated.Text>
          <Animated.Text
            style={[
              styles.confetti,
              {
                left: '70%',
                transform: [
                  {rotate: confettiRotate},
                  {
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 120],
                    }),
                  },
                ],
                opacity: confettiAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 1, 0],
                }),
              },
            ]}>
            ✨
          </Animated.Text>
        </View>

        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.messageContainer, {opacity: fadeAnim}]}>
          <Text style={styles.title}>Hooray!</Text>
          <Text style={styles.subtitle}>Booking Accepted</Text>
          <Text style={styles.description}>
            Your booking has been confirmed successfully. The service provider
            will contact you shortly.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, {opacity: fadeAnim}]}>
          <Button title="Done" onPress={handleDone} variant="secondary" />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  confettiContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    height: 200,
  },
  confetti: {
    position: 'absolute',
    fontSize: 32,
    left: '30%',
  },
  iconContainer: {
    marginBottom: 32,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  checkmark: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.white,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
  },
});

export default SuccessScreen;
