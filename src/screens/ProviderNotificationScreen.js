import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useApp} from '../context/AppContext';
import colors from '../utils/colors';

const ProviderNotificationScreen = ({navigation}) => {
  const {offers} = useApp();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const animationsRef = useRef([]);

  useEffect(() => {
    const mainAnimation = Animated.sequence([
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
    ]);
    mainAnimation.start();

    const confettiAnimations = confettiAnims.map((anim, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    animationsRef.current = [mainAnimation, ...confettiAnimations];
    confettiAnimations.forEach(animation => animation.start());

    return () => {
      animationsRef.current.forEach(animation => animation.stop());
      animationsRef.current = [];
    };
  }, []);

  const acceptedOffer = offers.find(o => o.status === 'accepted');

  const handleDone = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.confettiContainer}>
          {confettiAnims.map((anim, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.confettiParticle,
                {
                  left: `${20 + index * 20}%`,
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 150],
                      }),
                    },
                    {
                      rotate: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                  opacity: anim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1, 0],
                  }),
                },
              ]}>
              {index % 2 === 0 ? '🎉' : '✨'}
            </Animated.Text>
          ))}
        </View>

        <Animated.View
          style={[
            styles.successIconContainer,
            {
              transform: [{scale: scaleAnim}],
            },
          ]}>
          <View style={styles.successCheckCircle}>
            <Text style={styles.successCheckmark}>✓</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.successTextContainer, {opacity: fadeAnim}]}>
          <Text style={styles.successTitle}>Hooray!</Text>
          <Text style={styles.successSubtitle}>Booking Accepted</Text>
          {acceptedOffer && (
            <Text style={styles.successDescription}>
              Your offer of {formatCurrency(acceptedOffer.amount)} has been
              accepted! You can now start the service.
            </Text>
          )}
        </Animated.View>

        <Animated.View style={[{opacity: fadeAnim}]}>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Start Job</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const formatCurrency = amount => {
  return `₹${amount}`;
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
  confettiParticle: {
    position: 'absolute',
    fontSize: 28,
  },
  successIconContainer: {
    marginBottom: 32,
  },
  successCheckCircle: {
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
  successCheckmark: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.white,
  },
  successTextContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  successDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  doneButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ProviderNotificationScreen;
