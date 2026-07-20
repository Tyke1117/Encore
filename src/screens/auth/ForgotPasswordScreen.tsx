import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
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

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
          {/* Header & Back Action */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => navigation?.goBack()} 
              style={styles.backButton}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onBackground} />
            </TouchableOpacity>
            <Text style={styles.welcomeTitle}>Reset Password</Text>
            <Text style={styles.subtitle}>Enter your email to receive recovery instructions</Text>
          </View>

          {/* Illustration Container */}
          <View style={styles.illustrationWrapper}>
            <View style={styles.illustrationBg}>
              <MaterialCommunityIcons name="shield-key-outline" size={64} color={colors.primary} />
            </View>
          </View>

          {/* Form / Content */}
          <View style={styles.formContainer}>
            {isSuccess ? (
              <View style={styles.successCard}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#2E7D32" />
                <View style={styles.successTextContainer}>
                  <Text style={styles.successTitle}>Instructions Sent</Text>
                  <Text style={styles.successDescription}>
                    Check your email inbox for a link to reset your account password.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputContainer, isEmailFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="email-outline" 
                  size={20} 
                  color={isEmailFocused ? colors.primary : colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="name@domain.com"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !isSuccess}
                />
              </View>
            </View>

            {/* Send Link Button */}
            <TouchableOpacity 
              style={[
                styles.primaryButton, 
                (isLoading || !email.trim()) && styles.buttonDisabled,
                isSuccess && styles.buttonSuccess
              ]} 
              onPress={isSuccess ? () => navigation?.navigate('ResetPassword') : handleReset}
              disabled={isLoading || (!email.trim() && !isSuccess)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isSuccess ? 'Proceed to Update' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Back to Login */}
          <TouchableOpacity 
            style={styles.footerLinkContainer} 
            onPress={() => navigation?.navigate('Login')}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="keyboard-backspace" size={20} color={colors.primary} />
            <Text style={styles.footerLinkText}>Back to Login</Text>
          </TouchableOpacity>
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
    marginVertical: spacing.lg,
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
  formContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  successCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  successTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  successTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: spacing.xxs,
  },
  successDescription: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 13,
    color: colors.secondary,
    lineHeight: 18,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onBackground,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.onBackground,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    height: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonSuccess: {
    backgroundColor: '#2E7D32',
  },
  primaryButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  footerLinkText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default ForgotPasswordScreen;
