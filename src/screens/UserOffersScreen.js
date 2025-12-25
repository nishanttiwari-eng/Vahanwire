import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import {useApp} from '../context/AppContext';
import {formatCurrency, getAvatarColor} from '../utils/helpers';
import colors from '../utils/colors';

const UserOffersScreen = ({navigation}) => {
  const {getCurrentUserActiveRequest, getOffersForRequest, acceptOffer} =
    useApp();

  const activeRequest = getCurrentUserActiveRequest();
  const pendingOffers = activeRequest
    ? getOffersForRequest(activeRequest.id, 'pending')
    : [];
  const acceptedOffers = activeRequest
    ? getOffersForRequest(activeRequest.id, 'accepted')
    : [];

  useEffect(() => {
    if (acceptedOffers.length > 0) {
      const timer = setTimeout(() => {
        navigation.navigate('Success');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [acceptedOffers.length, navigation]);

  const handleAcceptOffer = offerId => {
    acceptOffer(offerId);
  };

  const handleBack = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Service" showBack onBackPress={handleBack} />

      <ScrollView contentContainerStyle={styles.content}>
        {!activeRequest ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Active Request</Text>
            <Text style={styles.emptyText}>
              You don't have any active service requests at the moment.
            </Text>
          </View>
        ) : pendingOffers.length === 0 && acceptedOffers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>⏳</Text>
            <Text style={styles.emptyTitle}>Waiting for Offers</Text>
            <Text style={styles.emptyText}>
              Service providers are reviewing your request. Offers will appear
              here shortly.
            </Text>
          </View>
        ) : (
          <View style={styles.offersContainer}>
            {pendingOffers.length > 0 &&
              pendingOffers.map(offer => (
                <Card key={offer.id} style={styles.offerCard}>
                  <View style={styles.offerContent}>
                    <View style={styles.providerSection}>
                      <View
                        style={[
                          styles.avatar,
                          {
                            backgroundColor: getAvatarColor(offer.providerName),
                          },
                        ]}
                      />
                      <Text style={styles.providerName}>
                        {offer.providerName}
                      </Text>
                    </View>

                    <Text style={styles.amount}>
                      {formatCurrency(offer.amount)}
                    </Text>
                  </View>

                  <Button
                    title="Accept"
                    onPress={() => handleAcceptOffer(offer.id)}
                    style={styles.acceptButton}
                  />
                </Card>
              ))}

            {acceptedOffers.length > 0 &&
              acceptedOffers.map(offer => (
                <Card key={offer.id} style={styles.offerCard}>
                  <View style={styles.offerContent}>
                    <View style={styles.providerSection}>
                      <View
                        style={[
                          styles.avatar,
                          {
                            backgroundColor: getAvatarColor(offer.providerName),
                          },
                        ]}
                      />
                      <Text style={styles.providerName}>
                        {offer.providerName}
                      </Text>
                    </View>

                    <Text style={styles.amount}>
                      {formatCurrency(offer.amount)}
                    </Text>
                  </View>

                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedText}>✓ Accepted</Text>
                  </View>
                </Card>
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  offersContainer: {
    flex: 1,
  },
  offerCard: {
    marginBottom: 16,
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  acceptButton: {
    marginTop: 0,
  },
  acceptedBadge: {
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 0,
    alignItems: 'center',
  },
  acceptedText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserOffersScreen;

// import React, {useEffect} from 'react';
// import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import Header from '../components/Header';
// import Card from '../components/Card';
// import Button from '../components/Button';
// import {useApp} from '../context/AppContext';
// import {formatCurrency, getAvatarColor} from '../utils/helpers';
// import colors from '../utils/colors';

// const UserOffersScreen = ({navigation}) => {
//   const {
//     getCurrentUserActiveRequest,
//     getOffersForRequest,
//     acceptOffer,
//     rejectOffer,
//   } = useApp();

//   const activeRequest = getCurrentUserActiveRequest();
//   const pendingOffers = activeRequest
//     ? getOffersForRequest(activeRequest.id, 'pending')
//     : [];
//   const acceptedOffers = activeRequest
//     ? getOffersForRequest(activeRequest.id, 'accepted')
//     : [];

//   useEffect(() => {
//     if (acceptedOffers.length > 0) {
//       const timer = setTimeout(() => {
//         navigation.navigate('Success');
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [acceptedOffers.length, navigation]);

//   const handleAcceptOffer = offerId => {
//     Alert.alert('Accept Offer', 'Are you sure you want to accept this offer?', [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Accept',
//         onPress: () => {
//           acceptOffer(offerId);
//         },
//       },
//     ]);
//   };

//   const handleRejectOffer = offerId => {
//     Alert.alert('Reject Offer', 'Are you sure you want to reject this offer?', [
//       {
//         text: 'Cancel',
//         style: 'cancel',
//       },
//       {
//         text: 'Reject',
//         style: 'destructive',
//         onPress: () => {
//           rejectOffer(offerId);
//         },
//       },
//     ]);
//   };

//   const handleBack = () => {
//     navigation.navigate('RoleSelection');
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
//       <Header title="Service" showBack onBackPress={handleBack} />

//       <ScrollView contentContainerStyle={styles.content}>
//         {!activeRequest ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyIcon}>📭</Text>
//             <Text style={styles.emptyTitle}>No Active Request</Text>
//             <Text style={styles.emptyText}>
//               You don't have any active service requests at the moment.
//             </Text>
//           </View>
//         ) : pendingOffers.length === 0 && acceptedOffers.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyIcon}>⏳</Text>
//             <Text style={styles.emptyTitle}>Waiting for Offers</Text>
//             <Text style={styles.emptyText}>
//               Service providers are reviewing your request. Offers will appear
//               here shortly.
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.offersContainer}>
//             {acceptedOffers.length > 0 && (
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>✓ Accepted Offer</Text>
//                 {acceptedOffers.map(offer => (
//                   <Card key={offer.id} style={styles.offerCard}>
//                     <View style={styles.offerRow}>
//                       <View style={styles.providerInfo}>
//                         <View
//                           style={[
//                             styles.avatar,
//                             {
//                               backgroundColor: getAvatarColor(
//                                 offer.providerName,
//                               ),
//                             },
//                           ]}
//                         />
//                         <Text style={styles.providerName}>
//                           {offer.providerName}
//                         </Text>
//                       </View>
//                       <Text style={styles.amount}>
//                         {formatCurrency(offer.amount)}
//                       </Text>
//                     </View>
//                     <View style={styles.acceptedBadge}>
//                       <Text style={styles.acceptedText}>✓ Accepted</Text>
//                     </View>
//                   </Card>
//                 ))}
//               </View>
//             )}

//             {pendingOffers.length > 0 && (
//               <View style={styles.section}>
//                 <Text style={styles.sectionTitle}>
//                   Available Offers ({pendingOffers.length})
//                 </Text>
//                 {pendingOffers.map(offer => (
//                   <Card key={offer.id} style={styles.offerCard}>
//                     <View style={styles.offerRow}>
//                       <View style={styles.providerInfo}>
//                         <View
//                           style={[
//                             styles.avatar,
//                             {
//                               backgroundColor: getAvatarColor(
//                                 offer.providerName,
//                               ),
//                             },
//                           ]}
//                         />
//                         <Text style={styles.providerName}>
//                           {offer.providerName}
//                         </Text>
//                       </View>
//                       <Text style={styles.amount}>
//                         {formatCurrency(offer.amount)}
//                       </Text>
//                     </View>

//                     <View style={styles.actionButtons}>
//                       <Button
//                         title="Accept"
//                         onPress={() => handleAcceptOffer(offer.id)}
//                         style={[styles.acceptButton, {marginRight: 12}]}
//                       />
//                       <Button
//                         title="Reject"
//                         onPress={() => handleRejectOffer(offer.id)}
//                         style={styles.rejectButton}
//                         variant="secondary"
//                       />
//                     </View>
//                   </Card>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   content: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingVertical: 24,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyIcon: {
//     fontSize: 64,
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginBottom: 8,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   offersContainer: {
//     flex: 1,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginBottom: 16,
//   },
//   offerCard: {
//     marginBottom: 16,
//   },
//   offerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   providerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   avatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     marginRight: 12,
//   },
//   providerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//   },
//   amount: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.textPrimary,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     marginTop: 12,
//   },
//   acceptButton: {
//     flex: 1,
//   },
//   rejectButton: {
//     flex: 1,
//   },
//   acceptedBadge: {
//     backgroundColor: colors.success,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginTop: 12,
//     alignItems: 'center',
//   },
//   acceptedText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default UserOffersScreen;
