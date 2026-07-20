import React, { useState, useEffect } from 'react';
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

interface ResetPasswordScreenProps {
  navigation: any;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Strength parameters
  const [strengthLevel, setStrengthLevel] = useState<'none' | 'weak' | 'medium' | 'strong'>('none');
  const [strengthText, setStrengthText] = useState('');
  const [strengthColor, setStrengthColor] = useState(colors.outline);

  // Focus states
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  // Calculate password strength dynamically
  useEffect(() => {
    if (!newPassword) {
      setStrengthLevel('none');
      setStrengthText('');
      setStrengthColor(colors.outline);
      return;
    }

    if (newPassword.length < 6) {
      setStrengthLevel('weak');
      setStrengthText('Weak (Must be 6+ characters)');
      setStrengthColor(colors.error);
    } else {
      const hasNumbers = /\d/.test(newPassword);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      const hasUppercase = /[A-Z]/.test(newPassword);

      if (newPassword.length >= 8 && hasNumbers && hasSpecial && hasUppercase) {
        setStrengthLevel('strong');
        setStrengthText('Strong & Secure');
        setStrengthColor('#2E7D32');
      } else {
        setStrengthLevel('medium');
        setStrengthText('Medium (Add numbers/caps/special symbols)');
        setStrengthColor('#F57C00'); // Orange
      }
    }
  }, [newPassword]);

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword || strengthLevel === 'weak') return;
    setIsLoading(true);
    // Simulate updating password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSuccess(true);
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
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => navigation?.goBack()} 
              style={styles.backButton}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onBackground} />
            </TouchableOpacity>
            <Text style={styles.welcomeTitle}>New Password</Text>
            <Text style={styles.subtitle}>Create a new secure password for your account</Text>
          </View>

          {/* Form wrapper */}
          <View style={styles.formContainer}>
            {isSuccess ? (
              <View style={styles.successCard}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#2E7D32" />
                <View style={styles.successTextContainer}>
                  <Text style={styles.successTitle}>Password Updated</Text>
                  <Text style={styles.successDescription}>
                    Your password has been successfully updated. You can now log in with your new password.
                  </Text>
                </View>
              </View>
            ) : null}

            {/* New Password input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={[styles.inputContainer, isPasswordFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="lock-outline" 
                  size={20} 
                  color={isPasswordFocused ? colors.primary : colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !isSuccess}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.outline} 
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength Indicator */}
              {strengthLevel !== 'none' ? (
                <View style={styles.strengthIndicatorContainer}>
                  <View style={styles.strengthBarBg}>
                    <View 
                      style={[
                        styles.strengthBarActive, 
                        { 
                          width: strengthLevel === 'weak' ? '33%' : strengthLevel === 'medium' ? '66%' : '100%',
                          backgroundColor: strengthColor
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.strengthLabelText, { color: strengthColor }]}>
                    {strengthText}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Confirm Password input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputContainer, isConfirmPasswordFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="lock-check-outline" 
                  size={20} 
                  color={isConfirmPasswordFocused ? colors.primary : colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading && !isSuccess}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.iconButton}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={colors.outline} 
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword && newPassword !== confirmPassword ? (
                <Text style={styles.errorLabelText}>Passwords do not match</Text>
              ) : null}
            </View>

            {/* Action button */}
            <TouchableOpacity 
              style={[
                styles.primaryButton, 
                (isLoading || isSuccess || !newPassword || newPassword !== confirmPassword || strengthLevel === 'weak') && styles.buttonDisabled,
                isSuccess && styles.buttonSuccess
              ]} 
              onPress={isSuccess ? () => navigation?.navigate('Login') : handleUpdatePassword}
              disabled={isLoading || (!isSuccess && (!newPassword || newPassword !== confirmPassword || strengthLevel === 'weak'))}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>
                {isSuccess ? 'Back to Login' : 'Update Password'}
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
    marginBottom: spacing.xl,
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
  formContainer: {
    width: '100%',
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
  iconButton: {
    padding: spacing.xs,
  },
  strengthIndicatorContainer: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  strengthBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.round,
    overflow: 'hidden',
  },
  strengthBarActive: {
    height: '100%',
    borderRadius: radius.round,
  },
  strengthLabelText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    marginTop: spacing.xxs,
    fontWeight: '500',
  },
  errorLabelText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
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
});

export default ResetPasswordScreen;
