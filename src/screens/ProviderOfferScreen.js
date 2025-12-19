import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import {useApp} from '../context/AppContext';
import {validateAmount, getAvatarColor} from '../utils/helpers';
import colors from '../utils/colors';

const getButtonTitle = (providerName, hasExistingOffer, isRejected) => {
  if (!providerName) return 'Submit Offer';
  if (hasExistingOffer) return isRejected ? 'Re-offer' : 'Update Offer';
  return 'Submit Offer';
};

const ProviderOfferScreen = ({navigation}) => {
  const {
    getAvailableRequests,
    submitOffer,
    currentUser,
    hasRejectedOffer,
    getOffersForRequest,
  } = useApp();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [providerName, setProviderName] = useState('');

  const availableRequests = useMemo(
    () => getAvailableRequests(),
    [getAvailableRequests],
  );

  const handleOfferPress = request => {
    setSelectedRequest(request);
    setOfferAmount('');
    setModalVisible(true);
  };

  const handleSubmitOffer = () => {
    if (!selectedRequest || !providerName.trim()) {
      Alert.alert('Missing Information', 'Please enter your provider name.');
      return;
    }

    const validation = validateAmount(offerAmount);
    if (!validation.valid) {
      Alert.alert('Invalid Amount', validation.message);
      return;
    }

    const offer = submitOffer(
      selectedRequest.id,
      providerName.trim(),
      offerAmount,
    );
    if (offer) {
      setModalVisible(false);
      setSuccessModalVisible(true);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Service" showBack onBackPress={handleBack} />

      <ScrollView contentContainerStyle={styles.content}>
        {availableRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Active Requests</Text>
            <Text style={styles.emptyText}>
              There are currently no service requests available. Please check
              back later.
            </Text>
          </View>
        ) : (
          <View style={styles.requestsContainer}>
            <Text style={styles.sectionTitle}>Available Requests</Text>

            {availableRequests.map((request, index) => {
              const existingOffers = getOffersForRequest(request.id);
              const hasExistingOffer = providerName
                ? existingOffers.some(o => o.providerName === providerName)
                : false;
              const isRejected = providerName
                ? hasRejectedOffer(request.id, providerName)
                : false;

              return (
                <Card key={request.id} style={styles.requestCard}>
                  <View style={styles.requestRow}>
                    <View style={styles.requestInfo}>
                      <View
                        style={[
                          styles.avatar,
                          {backgroundColor: getAvatarColor(request.userName)},
                        ]}
                      />
                      <View style={styles.requestDetails}>
                        <Text style={styles.userName}>{request.userName}</Text>
                        <Text style={styles.route}>
                          {request.from} → {request.to}
                        </Text>
                        {existingOffers.length > 0 && (
                          <Text style={styles.offerCount}>
                            {existingOffers.length} offer
                            {existingOffers.length > 1 ? 's' : ''} received
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <Button
                    title={getButtonTitle(
                      providerName,
                      hasExistingOffer,
                      isRejected,
                    )}
                    onPress={() => handleOfferPress(request)}
                    style={styles.offerButton}
                    variant={isRejected ? 'secondary' : 'primary'}
                  />
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Offer Price</Text>

            {selectedRequest && (
              <View style={styles.requestDetailsModal}>
                <View style={styles.detailsRow}>
                  <View
                    style={[
                      styles.avatar,
                      {backgroundColor: colors.avatarBlue},
                    ]}
                  />
                  <View style={styles.detailsText}>
                    <Text style={styles.detailName}>
                      {selectedRequest.userName}
                    </Text>
                    <Text style={styles.detailLocation}>
                      From: {selectedRequest.from}
                    </Text>
                    <Text style={styles.detailLocation}>
                      To: {selectedRequest.to}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Provider Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.darkGray}
                value={providerName}
                onChangeText={setProviderName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="₹ 485"
                placeholderTextColor={colors.darkGray}
                value={offerAmount}
                onChangeText={setOfferAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Offer Price"
                onPress={handleSubmitOffer}
                style={styles.submitButton}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessModal
        visible={successModalVisible}
        onClose={() => {
          setSuccessModalVisible(false);
          setProviderName('');
          setOfferAmount('');
          navigation.navigate('RoleSelection');
        }}
      />
    </SafeAreaView>
  );
};

const SuccessModal = ({visible, onClose}) => {
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
    if (visible) {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      confettiAnims.forEach(anim => anim.setValue(0));

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
    }

    return () => {
      animationsRef.current.forEach(animation => animation.stop());
      animationsRef.current = [];
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.successModalOverlay}>
        <View style={styles.successModalContent}>
          <View style={styles.modalHandle} />

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
            <Text style={styles.successTitle}>Offer Submitted!</Text>
            <Text style={styles.successSubtitle}>
              Waiting for User Response
            </Text>
          </Animated.View>

          <Animated.View style={[{opacity: fadeAnim}]}>
            <TouchableOpacity
              style={styles.successCloseButton}
              onPress={onClose}>
              <Text style={styles.successCloseText}>Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
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
  requestsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  requestCard: {
    marginBottom: 16,
  },
  providerRow: {
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
  offerButton: {
    marginTop: 8,
  },
  requestRow: {
    marginBottom: 16,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  requestDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  route: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  offerCount: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.mediumGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  requestDetailsModal: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    flex: 1,
    marginLeft: 12,
  },
  detailName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  detailLocation: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
  },
  modalButtons: {
    gap: 12,
  },
  submitButton: {
    marginBottom: 8,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  successModalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 32,
    paddingBottom: 48,
    alignItems: 'center',
    minHeight: 400,
  },
  confettiContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 200,
  },
  confettiParticle: {
    position: 'absolute',
    fontSize: 28,
  },
  successIconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  successCheckCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
  },
  successTextContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  successCloseButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  successCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ProviderOfferScreen;
