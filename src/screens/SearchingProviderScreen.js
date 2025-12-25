import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {useApp} from '../context/AppContext';
import colors from '../utils/colors';

const SearchingProviderScreen = ({navigation}) => {
  const {getCurrentUserActiveRequest, getOffersForRequest} = useApp();
  const [offerCount, setOfferCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const hasNavigatedRef = useRef(false);
  const pollIntervalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('RoleSelection');
        return true;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const checkForOffers = () => {
      const currentRequest = getCurrentUserActiveRequest();

      if (!currentRequest) {
        console.log('No active request found');
        return;
      }

      const currentOffers = getOffersForRequest(currentRequest.id, 'pending');

      console.log(`Checking offers... Found: ${currentOffers.length}`);

      if (currentOffers.length > 0) {
        setOfferCount(currentOffers.length);

        if (!hasNavigatedRef.current && !isNavigating) {
          hasNavigatedRef.current = true;
          setIsNavigating(true);

          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }),
          ]).start();

          setTimeout(() => {
            navigation.replace('UserOffers');
          }, 1500);
        }
      }
    };

    checkForOffers();

    pollIntervalRef.current = setInterval(checkForOffers, 500);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [
    navigation,
    getCurrentUserActiveRequest,
    getOffersForRequest,
    fadeAnim,
    scaleAnim,
    isNavigating,
  ]);

  const handleBack = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Service" showBack onBackPress={handleBack} />

      <View style={styles.content}>
        <View style={styles.loadingContainer}>
          {offerCount === 0 ? (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.title}>Searching for Providers</Text>
              <Text style={styles.subtitle}>
                Please wait while we find the best service providers for you...
              </Text>
            </>
          ) : (
            <Animated.View
              style={[
                styles.successContainer,
                {
                  opacity: fadeAnim,
                  transform: [{scale: scaleAnim}],
                },
              ]}>
              <View style={styles.checkCircle}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.successTitle}>Offers Found!</Text>
              <Text style={styles.successSubtitle}>
                {offerCount} provider{offerCount > 1 ? 's' : ''} submitted{' '}
                {offerCount > 1 ? 'offers' : 'an offer'}
              </Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionIcon}>💡</Text>
          <Text style={styles.instructionText}>
            Tip: Switch to Service Provider mode to submit offers for this
            request
          </Text>
        </View>
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
    paddingHorizontal: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  successContainer: {
    alignItems: 'center',
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.success,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    textAlign: 'center',
  },
  instructionsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    alignItems: 'center',
  },
  instructionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default SearchingProviderScreen;

// import React, {useEffect, useMemo} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   BackHandler,
// } from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Header from '../components/Header';
// import {useApp} from '../context/AppContext';
// import colors from '../utils/colors';

// const SearchingProviderScreen = ({navigation}) => {
//   const {getCurrentUserActiveRequest, getOffersForRequest} = useApp();

//   const activeRequest = useMemo(
//     () => getCurrentUserActiveRequest(),
//     [getCurrentUserActiveRequest],
//   );
//   const pendingOffers = useMemo(
//     () =>
//       activeRequest ? getOffersForRequest(activeRequest.id, 'pending') : [],
//     [activeRequest, getOffersForRequest],
//   );

//   useEffect(() => {
//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       () => {
//         navigation.navigate('RoleSelection');
//         return true;
//       },
//     );

//     return () => backHandler.remove();
//   }, [navigation]);

//   useEffect(() => {
//     if (pendingOffers.length > 0) {
//       const timer = setTimeout(() => {
//         navigation.replace('UserOffers');
//       }, 1500);

//       return () => clearTimeout(timer);
//     }
//   }, [pendingOffers.length, navigation, activeRequest]);

//   const handleBack = () => {
//     navigation.navigate('RoleSelection');
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['bottom']}>
//       <Header title="Service" showBack onBackPress={handleBack} />

//       <View style={styles.content}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.primary} />
//           <Text style={styles.title}>Searching for Providers</Text>
//           <Text style={styles.subtitle}>
//             Please wait while we find the best service providers for you...
//           </Text>

//           {pendingOffers.length > 0 && (
//             <Text style={styles.foundText}>
//               Found {pendingOffers.length} offer
//               {pendingOffers.length > 1 ? 's' : ''}!
//             </Text>
//           )}
//         </View>

//         <View style={styles.instructionsContainer}>
//           <Text style={styles.instructionText}>
//             Tip: Switch to Service Provider mode to view and accept this request
//           </Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 24,
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     marginBottom: 60,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginTop: 24,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginTop: 12,
//     textAlign: 'center',
//     lineHeight: 20,
//     paddingHorizontal: 20,
//   },
//   foundText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.success,
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   instructionsContainer: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     borderLeftWidth: 4,
//     borderLeftColor: colors.accent,
//   },
//   instructionText: {
//     fontSize: 14,
//     color: colors.textPrimary,
//     lineHeight: 20,
//   },
// });

// export default SearchingProviderScreen;
