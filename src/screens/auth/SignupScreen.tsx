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
  Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();

  // Input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Toggles and checkboxes
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || !password || !fullName.trim() || !mobileNumber.trim() || !agreeTerms) return;
    setIsLoading(true);
    try {
      await signup(email, password, fullName, mobileNumber);
      navigation?.navigate('OTPVerification', { contact: mobileNumber });
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
          {/* Top Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity 
              onPress={() => navigation?.goBack()} 
              style={styles.backButton}
              disabled={isLoading}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onBackground} />
            </TouchableOpacity>
            <Text style={styles.welcomeTitle}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to search, book, and enjoy events</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputContainer, isNameFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="account-outline" 
                  size={20} 
                  color={isNameFocused ? colors.primary : colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Email Address */}
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
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={[styles.inputContainer, isMobileFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="phone-outline" 
                  size={20} 
                  color={isMobileFocused ? colors.primary : colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter mobile number"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  onFocus={() => setIsMobileFocused(true)}
                  onBlur={() => setIsMobileFocused(false)}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputContainer, isPasswordFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="lock-outline" 
                  size={20} 
                  color={isPasswordFocused ? colors.primary : colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
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
            </View>

            {/* Confirm Password */}
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
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.onSurfaceVariant}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
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
            </View>

            {/* Terms and Conditions */}
            <View style={styles.checkboxRow}>
              <TouchableOpacity 
                onPress={() => setAgreeTerms(!agreeTerms)}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons 
                  name={agreeTerms ? "checkbox-marked" : "checkbox-blank-outline"} 
                  size={22} 
                  color={agreeTerms ? colors.primary : colors.outline} 
                />
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                I agree to the{' '}
                <Text style={styles.linkText} onPress={() => navigation?.navigate('Terms')}>
                  Terms & Conditions
                </Text>{' '}
                and{' '}
                <Text style={styles.linkText} onPress={() => navigation?.navigate('PrivacyPolicy')}>
                  Privacy Policy
                </Text>
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, (!agreeTerms || isLoading) && styles.buttonDisabled]} 
              onPress={handleSignup}
              disabled={isLoading || !agreeTerms}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Already have an account row */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.footerLink}>Log In</Text>
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
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: spacing.md,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.lg,
    paddingRight: spacing.md,
  },
  checkboxText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 13,
    color: colors.secondary,
    marginLeft: spacing.xs,
    lineHeight: 18,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  footerText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: colors.secondary,
  },
  footerLink: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default SignupScreen;
