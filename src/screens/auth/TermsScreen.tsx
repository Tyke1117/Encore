import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ColorsType } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface TermsScreenProps {
  navigation: any;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()} 
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="close" size={24} color={colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: July 2026</Text>

        <Text style={styles.introduction}>
          Welcome to Encore. Please read these Terms of Service ("Terms") carefully before using our mobile application (the "Service") operated by Encore Inc. ("us", "we", or "our").
        </Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.sectionBody}>
          By accessing or using the Service, you agree to be bound by these Terms and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this Service.
        </Text>

        <Text style={styles.sectionTitle}>2. Use License</Text>
        <Text style={styles.sectionBody}>
          Permission is granted to temporarily download one copy of the materials (information or software) on Encore's mobile application for personal, non-commercial transitory viewing only.
        </Text>
        <Text style={styles.sectionBody}>
          Under this license, you may not:
          {"\n"}• Modify or copy the materials.
          {"\n"}• Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).
          {"\n"}• Attempt to decompile or reverse engineer any software contained in the Encore app.
          {"\n"}• Transfer the materials to another person or "mirror" the materials on any other server.
        </Text>

        <Text style={styles.sectionTitle}>3. User Accounts</Text>
        <Text style={styles.sectionBody}>
          When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
        </Text>
        <Text style={styles.sectionBody}>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
        </Text>

        <Text style={styles.sectionTitle}>4. Event Bookings and Payments</Text>
        <Text style={styles.sectionBody}>
          Encore serves as an event management and ticketing platform. All payments made through the Service are subject to our booking fees and cancellation policies. Refund requests must be directed to the respective event organizers.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.sectionBody}>
          In no event shall Encore or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Encore's Service.
        </Text>
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
          style={[styles.primaryButton, { backgroundColor: colors.secondary }]}
        >
          <Text style={styles.primaryButtonText}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: ColorsType) => StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onBackground,
  },
  spacer: {
    width: 40,
  },
  scrollContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  lastUpdated: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  introduction: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
    color: colors.onBackground,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  footerContainer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  primaryButton: {
    borderRadius: radius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ...shadows.level2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default TermsScreen;
