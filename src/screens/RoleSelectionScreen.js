import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RoleCard from '../components/RoleCard';
import {useApp} from '../context/AppContext';
import {generateId} from '../utils/helpers';
import colors from '../utils/colors';

const RoleSelectionScreen = ({navigation}) => {
  const {
    selectRole,
    offers,
    bookingCompleted,
    loginUser,
    shouldShowOffers,
    getCurrentUserActiveRequest,
    currentUser,
  } = useApp();

  useEffect(() => {
    if (!currentUser) {
      const userId = generateId();
      const userName = 'Guest User';
      loginUser(userId, userName);
      console.log('Auto-logged in user:', userId);
    }
  }, [currentUser, loginUser]);

  const handleRoleSelect = role => {
    if (!currentUser) {
      console.error('User not logged in');
      return;
    }

    selectRole(role);

    if (role === 'user') {
      if (shouldShowOffers()) {
        console.log('Navigating to UserOffers - offers available');
        navigation.navigate('UserOffers');
      } else {
        const activeRequest = getCurrentUserActiveRequest();
        if (activeRequest) {
          console.log(
            'Navigating to SearchingProvider - active request exists',
          );
          navigation.navigate('SearchingProvider');
        } else {
          console.log('Navigating to UserRequest - no active request');
          navigation.navigate('UserRequest');
        }
      }
    } else {
      const acceptedOffers = offers.filter(o => o.status === 'accepted');
      if (acceptedOffers.length > 0 && bookingCompleted) {
        console.log('Navigating to ProviderNotification - booking completed');
        navigation.navigate('ProviderNotification');
      } else {
        console.log('Navigating to ProviderOffer - no completed bookings');
        navigation.navigate('ProviderOffer');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>LOGO</Text>
          </View>
        </View>

        <View style={styles.rolesContainer}>
          <RoleCard
            title="User"
            icon="👤"
            onPress={() => handleRoleSelect('user')}
          />

          <View style={styles.spacing} />

          <RoleCard
            title="Service Provider"
            icon="🚗"
            onPress={() => handleRoleSelect('provider')}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Select your role to continue</Text>
          {currentUser && (
            <Text style={styles.userIdText}>
              User ID: {currentUser.userId.slice(0, 8)}...
            </Text>
          )}
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
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 2,
  },
  rolesContainer: {
    marginBottom: 40,
  },
  spacing: {
    height: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  userIdText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    opacity: 0.6,
  },
});

export default RoleSelectionScreen;

// import React, {useEffect} from 'react';
// import {View, Text, StyleSheet} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import RoleCard from '../components/RoleCard';
// import {useApp} from '../context/AppContext';
// import colors from '../utils/colors';

// const RoleSelectionScreen = ({navigation, route}) => {
//   const {
//     selectRole,
//     offers,
//     bookingCompleted,
//     loginUser,
//     shouldShowOffers,
//     getCurrentUserActiveRequest,
//     getAcceptedOffersForProvider,
//   } = useApp();

//   useEffect(() => {
//     // Auto-login if params provided
//     if (route.params?.userId && route.params?.userName) {
//       loginUser(route.params.userId, route.params.userName);
//     }
//   }, [route.params, loginUser]);

//   const handleRoleSelect = role => {
//     selectRole(role);

//     if (role === 'user') {
//       // Check if user should see offers
//       if (shouldShowOffers()) {
//         navigation.navigate('UserOffers');
//       } else {
//         const activeRequest = getCurrentUserActiveRequest();
//         if (activeRequest) {
//           // User has active request, show searching screen
//           navigation.navigate('SearchingProvider');
//         } else {
//           // No active request, show request form
//           navigation.navigate('UserRequest');
//         }
//       }
//     } else {
//       // Provider role selected
//       // Check if provider has accepted offers
//       const acceptedOffers = offers.filter(o => o.status === 'accepted');
//       if (acceptedOffers.length > 0 && bookingCompleted) {
//         navigation.navigate('ProviderNotification');
//       } else {
//         navigation.navigate('ProviderOffer');
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.logoContainer}>
//           <View style={styles.logoBox}>
//             <Text style={styles.logoText}>LOGO</Text>
//           </View>
//         </View>

//         <View style={styles.rolesContainer}>
//           <RoleCard
//             title="User"
//             icon="👤"
//             onPress={() => handleRoleSelect('user')}
//           />

//           <View style={styles.spacing} />

//           <RoleCard
//             title="Service Provider"
//             icon="🚗"
//             onPress={() => handleRoleSelect('provider')}
//           />
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Select your role to continue</Text>
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
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 60,
//   },
//   logoBox: {
//     width: 120,
//     height: 120,
//     borderRadius: 24,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: colors.shadow,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   logoText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.white,
//     letterSpacing: 2,
//   },
//   rolesContainer: {
//     marginBottom: 40,
//   },
//   spacing: {
//     height: 20,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   footerText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     textAlign: 'center',
//   },
// });

// export default RoleSelectionScreen;

// import React, {useEffect} from 'react';
// import {View, Text, StyleSheet, Image} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import RoleCard from '../components/RoleCard';
// import {useApp} from '../context/AppContext';
// import colors from '../utils/colors';

// const RoleSelectionScreen = ({navigation, route}) => {
//   const {selectRole, offers, bookingCompleted, loginUser} = useApp();

//   useEffect(() => {
//     if (route.params?.userId && route.params?.userName) {
//       loginUser(route.params.userId, route.params.userName);
//     }
//   }, [route.params, loginUser]);

//   const handleRoleSelect = role => {
//     selectRole(role);

//     if (role === 'user') {
//       navigation.navigate('UserRequest');
//     } else {
//       const acceptedOffer = offers.find(o => o.status === 'accepted');
//       if (acceptedOffer && bookingCompleted) {
//         navigation.navigate('ProviderNotification');
//       } else {
//         navigation.navigate('ProviderOffer');
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <View style={styles.logoContainer}>
//           <View style={styles.logoBox}>
//             <Text style={styles.logoText}>LOGO</Text>
//           </View>
//         </View>

//         <View style={styles.rolesContainer}>
//           <RoleCard
//             title="User"
//             icon="👤"
//             onPress={() => handleRoleSelect('user')}
//           />

//           <View style={styles.spacing} />

//           <RoleCard
//             title="Service Provider"
//             icon="🚗"
//             onPress={() => handleRoleSelect('provider')}
//           />
//         </View>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>Select your role to continue</Text>
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
//     paddingHorizontal: 24,
//     justifyContent: 'center',
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 60,
//   },
//   logoBox: {
//     width: 120,
//     height: 120,
//     borderRadius: 24,
//     backgroundColor: colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: colors.shadow,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   logoText: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.white,
//     letterSpacing: 2,
//   },
//   rolesContainer: {
//     marginBottom: 40,
//   },
//   spacing: {
//     height: 20,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingVertical: 20,
//   },
//   footerText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     textAlign: 'center',
//   },
// });

// export default RoleSelectionScreen;
