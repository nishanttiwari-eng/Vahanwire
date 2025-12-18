import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import colors from '../utils/colors';

const Header = ({title, showBack = false, onBackPress}) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.backIcon}>
              {Platform.OS === 'ios' ? '‹' : '←'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightSection} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        paddingTop: 16,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 50,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  backIcon: {
    fontSize: 32,
    color: colors.white,
    fontWeight: Platform.OS === 'ios' ? '400' : 'bold',
    lineHeight: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
  },
});

export default Header;