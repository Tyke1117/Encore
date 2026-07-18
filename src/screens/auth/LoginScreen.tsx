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
import { validateEmail, validatePassword } from '../../utils/validation';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Form input focus states for styling
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    // Clear errors
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    let hasError = false;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    // Validate password
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

    if (hasError) return;

    setIsLoading(true);
    try {
      await login(email, password);
      // Success - Context will handle auth state updates and redirect
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMsg = 'Failed to sign in. Please check your credentials.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMsg = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = 'Too many attempts. Please try again later.';
      }
      setGeneralError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignInPlaceholder = () => {
    setGeneralError('Google Sign-In is not configured for this environment.');
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
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIconBg}>
              <MaterialCommunityIcons 
                name="calendar-heart" 
                size={40} 
                color={theme.colors.primary} 
              />
            </View>
            <Text style={styles.appName}>EventVibe</Text>
            <Text style={styles.welcomeText}>Your premium event companion</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {generalError ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
                <Text style={styles.errorBannerText}>{generalError}</Text>
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
                  placeholder="Enter your password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity 
              onPress={() => navigation?.navigate('ForgotPassword')}
              style={styles.forgotPasswordContainer}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.colors.onPrimary} size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Log In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In (UI Placeholder) */}
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={handleGoogleSignInPlaceholder}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="google" size={20} color={theme.colors.onBackground} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Create Account Link Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation?.navigate('Signup')}
              disabled={isLoading}
            >
              <Text style={styles.footerLink}>Sign Up</Text>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.md,
  },
  logoIconBg: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  appName: {
    fontSize: theme.fonts.sizes.headlineLarge,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.onBackground,
    marginBottom: theme.spacing.xs,
  },
  welcomeText: {
    fontSize: theme.fonts.sizes.bodyMedium,
    fontWeight: theme.fonts.weights.regular,
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
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordText: {
    fontSize: theme.fonts.sizes.bodyMedium,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.round,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  dividerText: {
    fontSize: theme.fonts.sizes.bodySmall,
    color: theme.colors.secondary,
    paddingHorizontal: theme.spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.round,
    height: 56,
    ...theme.shadows.sm,
  },
  socialButtonText: {
    fontSize: theme.fonts.sizes.titleMedium,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.onBackground,
    marginLeft: theme.spacing.sm,
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
export default LoginScreen;
