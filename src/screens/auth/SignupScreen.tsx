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
import { validateEmail, validatePassword, validateFullName } from '../../utils/validation';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { signup } = useAuth();

  // State variables
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'organizer'>('user');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validation errors
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Focus states
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

  const handleSignup = async () => {
    // Reset errors
    setFullNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validate Name
    if (!fullName.trim()) {
      setFullNameError('Full Name is required.');
      hasError = true;
    } else if (!validateFullName(fullName)) {
      setFullNameError('Please enter a valid name (at least 2 characters).');
      hasError = true;
    }

    // Validate Email
    if (!email.trim()) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    // Validate Password
    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else {
      const passVal = validatePassword(password);
      if (!passVal.isValid) {
        setPasswordError(passVal.message);
        hasError = true;
      }
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      await signup(email, password, fullName, role);
      // Success - Context will update user session automatically
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMsg = 'Failed to create account. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email address is already in use.';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak.';
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
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>Join EventVibe today</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {generalError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
                <Text style={styles.errorBannerText}>{generalError}</Text>
              </View>
            ) : null}

            {/* Name Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View 
                style={[
                  styles.inputContainer,
                  isNameFocused && styles.inputFocused,
                  !!fullNameError && styles.inputErrorBorder
                ]}
              >
                <MaterialCommunityIcons 
                  name="account-outline" 
                  size={20} 
                  color={isNameFocused ? theme.colors.primary : theme.colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setIsNameFocused(true)}
                  onBlur={() => setIsNameFocused(false)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {fullNameError ? <Text style={styles.validationText}>{fullNameError}</Text> : null}
            </View>

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

            {/* Role Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Choose Account Type</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === 'user' && styles.roleOptionSelected
                  ]}
                  onPress={() => setRole('user')}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons 
                    name="account-card-outline" 
                    size={20} 
                    color={role === 'user' ? theme.colors.primary : theme.colors.secondary} 
                  />
                  <Text style={[
                    styles.roleOptionText,
                    role === 'user' && styles.roleOptionTextSelected
                  ]}>Attendee</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleOption,
                    role === 'organizer' && styles.roleOptionSelected
                  ]}
                  onPress={() => setRole('organizer')}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons 
                    name="briefcase-outline" 
                    size={20} 
                    color={role === 'organizer' ? theme.colors.primary : theme.colors.secondary} 
                  />
                  <Text style={[
                    styles.roleOptionText,
                    role === 'organizer' && styles.roleOptionTextSelected
                  ]}>Organizer</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View 
                style={[
                  styles.inputContainer,
                  isPasswordFocused && styles.inputFocused,
                  !!passwordError && styles.inputErrorBorder
                ]}
              >
                <MaterialCommunityIcons 
                  name="lock-outline" 
                  size={20} 
                  color={isPasswordFocused ? theme.colors.primary : theme.colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
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
                  style={styles.passwordToggle}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.colors.outline} 
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.validationText}>{passwordError}</Text> : null}
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View 
                style={[
                  styles.inputContainer,
                  isConfirmPasswordFocused && styles.inputFocused,
                  !!confirmPasswordError && styles.inputErrorBorder
                ]}
              >
                <MaterialCommunityIcons 
                  name="lock-check-outline" 
                  size={20} 
                  color={isConfirmPasswordFocused ? theme.colors.primary : theme.colors.outline} 
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={theme.colors.onSurfaceVariant}
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
                  style={styles.passwordToggle}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons 
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.colors.outline} 
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? <Text style={styles.validationText}>{confirmPasswordError}</Text> : null}
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
              onPress={handleSignup}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Login Footer */}
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
  passwordToggle: {
    padding: theme.spacing.xs,
  },
  validationText: {
    fontSize: theme.fonts.sizes.bodySmall,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
  },
  roleOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
    borderWidth: 2,
  },
  roleOptionText: {
    fontSize: theme.fonts.sizes.bodyMedium,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.secondary,
  },
  roleOptionTextSelected: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: theme.fonts.weights.semibold,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  footerText: {
    fontSize: theme.fonts.sizes.bodyMedium,
    color: theme.colors.secondary,
  },
  footerLink: {
    fontSize: theme.fonts.sizes.bodyMedium,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
  },
});
export default SignupScreen;
