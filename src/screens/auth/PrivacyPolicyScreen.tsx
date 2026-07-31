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

interface PrivacyPolicyScreenProps {
  navigation: any;
}

export const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.spacer} />
      </View>

      {/* Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: July 2026</Text>

        <Text style={styles.introduction}>
          At Encore, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
        </Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.sectionBody}>
          We may collect information about you in a variety of ways. The information we may collect via the Application includes:
          {"\n"}• **Personal Data**: Demographic and other personally identifiable information (such as your name, email address, and mobile number) that you voluntarily give to us when choosing to participate in various activities related to the Application.
          {"\n"}• **Device Information**: Device information, such as your mobile device ID, model, manufacturer, and operating system.
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.sectionBody}>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
          {"\n"}• Create and manage your account.
          {"\n"}• Deliver tickets and notifications related to events you register for.
          {"\n"}• Process bookings and transactions.
          {"\n"}• Email/text you regarding your account or booking confirmation.
          {"\n"}• Prevent fraudulent transactions and monitor against theft.
        </Text>

        <Text style={styles.sectionTitle}>3. Disclosure of Your Information</Text>
        <Text style={styles.sectionBody}>
          We may share information we have collected about you in certain situations. Your information may be disclosed to Event Organizers when you register for their specific events, so that they can manage entry and event updates. We do not sell or rent your personal information to third-party advertisers.
        </Text>

        <Text style={styles.sectionTitle}>4. Security of Your Information</Text>
        <Text style={styles.sectionBody}>
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that no security measures are perfect or impenetrable.
        </Text>

        <Text style={styles.sectionTitle}>5. Policy for Children</Text>
        <Text style={styles.sectionBody}>
          We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us immediately.
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

export default PrivacyPolicyScreen;
