import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RoleCard from '../components/RoleCard';
import {useApp} from '../context/AppContext';
import colors from '../utils/colors';

const RoleSelectionScreen = ({navigation}) => {
  const {selectRole} = useApp();

  const handleRoleSelect = role => {
    selectRole(role);
    if (role === 'user') {
      navigation.navigate('UserRequest');
    } else {
      navigation.navigate('ProviderOffer');
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
});

export default RoleSelectionScreen;
