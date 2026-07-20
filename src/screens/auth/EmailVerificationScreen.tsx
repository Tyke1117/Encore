import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface EmailVerificationScreenProps {
  navigation: any;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ navigation }) => {
  const { sendVerification } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimeLeft, setResendTimeLeft] = useState(0);

  const handleResend = async () => {
    if (resendTimeLeft > 0) return;
    setIsLoading(true);
    try {
      await sendVerification();
      setResendTimeLeft(60);
      // Start cooldown timer
      const interval = setInterval(() => {
        setResendTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Continue to dashboard or Login
    navigation?.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => navigation?.goBack()} 
              style={styles.backButton}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onBackground} />
            </TouchableOpacity>
            <Text style={styles.welcomeTitle}>Verify Email</Text>
            <Text style={styles.subtitle}>We've sent a link to your email address</Text>
          </View>

          {/* Illustration Container */}
          <View style={styles.illustrationWrapper}>
            <View style={styles.illustrationBg}>
              <MaterialCommunityIcons name="email-check-outline" size={64} color={colors.primary} />
            </View>
          </View>

          {/* Informational Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.messageBody}>
              Please click the link inside the verification email to activate your account.
              If you did not receive it, check your spam folder or resend the request below.
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.actionContainer}>
            {/* Continue Button */}
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>

            {/* Resend Email Button */}
            <TouchableOpacity 
              style={[styles.secondaryButton, resendTimeLeft > 0 && styles.buttonDisabled]} 
              onPress={handleResend}
              disabled={isLoading || resendTimeLeft > 0}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                {resendTimeLeft > 0 ? `Resend Email (${resendTimeLeft}s)` : 'Resend Email'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  welcomeTitle: {
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: typography.headlineLgMobile.fontWeight,
    color: colors.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.secondary,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  illustrationBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  messageContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xxl,
  },
  messageBody: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionContainer: {
    width: '100%',
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  primaryButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  secondaryButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default EmailVerificationScreen;
