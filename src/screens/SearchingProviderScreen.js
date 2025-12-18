import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import {useApp} from '../context/AppContext';
import colors from '../utils/colors';

const SearchingProviderScreen = ({navigation}) => {
  const {offers, shouldShowOffers} = useApp();

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
    if (offers.length > 0) {
      const timer = setTimeout(() => {
        navigation.replace('UserOffers');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [offers, navigation]);

  const handleBack = () => {
    navigation.navigate('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Service" showBack onBackPress={handleBack} />

      <View style={styles.content}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.title}>Searching for Providers</Text>
          <Text style={styles.subtitle}>
            Please wait while we find the best service providers for you...
          </Text>

          {offers.length > 0 && (
            <Text style={styles.foundText}>
              Found {offers.length} provider{offers.length > 1 ? 's' : ''}!
            </Text>
          )}
        </View>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            Tip: Switch to Service Provider mode to view and accept this request
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
  foundText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.success,
    marginTop: 16,
    textAlign: 'center',
  },
  instructionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});

export default SearchingProviderScreen;
