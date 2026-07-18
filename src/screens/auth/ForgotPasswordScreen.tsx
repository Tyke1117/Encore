import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme/theme';
import { validateEmail } from '../../utils/validation';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const { forgotPassword } = useAuth();

  // State variables
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Focus states
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleResetPassword = async () => {
    setEmailError('');
    setGeneralError('');
    setIsSuccess(false);

    if (!email.trim()) {
      setEmailError('Email is required.');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsSuccess(true);
      setEmail('');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      let errorMsg = 'Failed to send password reset email. Please try again.';
      if (error.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      }
      setGeneralError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => navigation?.goBack()} 
              style={styles.backButton}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.onBackground} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>We'll send you instructions to reset it.</Text>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {generalError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}

            {isSuccess ? (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons name="check-circle-outline" size={24} color={theme.colors.success} />
                <View style={styles.successTextContainer}>
                  <Text style={styles.successTitle}>Check your inbox</Text>
                  <Text style={styles.successBody}>
                    A password reset email has been sent if the email is registered.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* Email Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View 
                style={[
                  styles.inputContainer,
                  isEmailFocused && styles.inputFocused,
                  !!emailError && styles.inputErrorBorder
                ]}
              >
                <MaterialCommunityIcons 
                  name="email-outline" 
                  size={20} 
                  color={isEmailFocused ? theme.colors.primary : theme.colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {emailError ? <Text style={styles.validationText}>{emailError}</Text> : null}
            </View>

            {/* Reset Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
              onPress={handleResetPassword}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <TouchableOpacity 
            style={styles.footerLinkContainer} 
            onPress={() => navigation?.navigate('Login')}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="keyboard-backspace" size={20} color={theme.colors.primary} />
            <Text style={styles.footerLinkText}>Back to Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  headerContainer: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fonts.sizes.headlineLarge,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: theme.fonts.sizes.bodyMedium,
    color: theme.colors.secondary,
  },
  formContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.errorContainer,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorBannerText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fonts.sizes.bodySmall,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.onErrorContainer,
  },
  successBanner: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  successTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  successTitle: {
    fontSize: theme.fonts.sizes.bodyLarge,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.xxs,
  },
  successBody: {
    fontSize: theme.fonts.sizes.bodySmall,
    color: theme.colors.secondary,
  },
  inputWrapper: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.fonts.sizes.labelLarge,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  inputErrorBorder: {
    borderColor: theme.colors.error,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    color: theme.colors.onBackground,
    fontSize: theme.fonts.sizes.bodyLarge,
    height: '100%',
  },
  validationText: {
    fontSize: theme.fonts.sizes.bodySmall,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadows.md,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: theme.fonts.sizes.titleMedium,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.onPrimary,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.md,
  },
  footerLinkText: {
    fontSize: theme.fonts.sizes.bodyMedium,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
  },
});
export default ForgotPasswordScreen;
