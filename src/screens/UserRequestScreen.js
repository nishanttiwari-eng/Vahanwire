import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../components/Header';
import Button from '../components/Button';
import {useApp} from '../context/AppContext';
import {validateName, validateLocation} from '../utils/helpers';
import colors from '../utils/colors';

const UserRequestScreen = ({navigation}) => {
  const {createRequest} = useApp();
  const [name, setName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleFindService = () => {
    const trimmedName = name.trim();
    const trimmedFrom = from.trim();
    const trimmedTo = to.trim();

    const nameValidation = validateName(trimmedName);
    if (!nameValidation.valid) {
      Alert.alert('Invalid Name', nameValidation.message);
      return;
    }

    const fromValidation = validateLocation(trimmedFrom);
    if (!fromValidation.valid) {
      Alert.alert('Invalid Location', fromValidation.message);
      return;
    }

    const toValidation = validateLocation(trimmedTo);
    if (!toValidation.valid) {
      Alert.alert('Invalid Location', toValidation.message);
      return;
    }

    try {
      const request = createRequest(trimmedName, trimmedFrom, trimmedTo);
      if (request) {
        navigation.navigate('SearchingProvider');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create request. Please try again.');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Header title="Service" showBack onBackPress={handleBack} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={colors.darkGray}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>From</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location"
                placeholderTextColor={colors.darkGray}
                value={from}
                onChangeText={setFrom}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>To</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter destination"
                placeholderTextColor={colors.darkGray}
                value={to}
                onChangeText={setTo}
                autoCapitalize="words"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button
            title="Find Service"
            onPress={handleFindService}
            disabled={!name.trim() || !from.trim() || !to.trim()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  form: {
    flex: 1,
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
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.mediumGray,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: colors.background,
  },
});

export default UserRequestScreen;
