import React from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import {useApp} from '../context/AppContext';
import {formatCurrency, getAvatarColor} from '../utils/helpers';
import colors from '../utils/colors';

const UserOffersScreen = ({navigation}) => {
  const {offers, acceptOffer} = useApp();

  const handleAcceptOffer = offerId => {
    Alert.alert('Accept Offer', 'Are you sure you want to accept this offer?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Accept',
        onPress: () => {
          acceptOffer(offerId);
          navigation.navigate('Success');
        },
      },
    ]);
  };

  const handleBack = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Header title="Service" showBack onBackPress={handleBack} />

      <ScrollView contentContainerStyle={styles.content}>
        {offers.length === 0 ? (
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
            <Text style={styles.sectionTitle}>Available Offers</Text>

            {offers.map((offer, index) => (
              <Card key={offer.id} style={styles.offerCard}>
                <View style={styles.offerRow}>
                  <View style={styles.providerInfo}>
                    <View
                      style={[
                        styles.avatar,
                        {backgroundColor: getAvatarColor(index)},
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

                {!offer.accepted && (
                  <Button
                    title="Accept"
                    onPress={() => handleAcceptOffer(offer.id)}
                    style={styles.acceptButton}
                  />
                )}

                {offer.accepted && (
                  <View style={styles.acceptedBadge}>
                    <Text style={styles.acceptedText}>✓ Accepted</Text>
                  </View>
                )}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  offerCard: {
    marginBottom: 16,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  providerInfo: {
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
    marginTop: 8,
  },
  acceptedBadge: {
    backgroundColor: colors.success,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
  },
  acceptedText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserOffersScreen;