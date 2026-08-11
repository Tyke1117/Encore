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
  StatusBar,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import {
  getAuth,
  GoogleAuthProvider,
  AppleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';
import { GOOGLE_WEB_CLIENT_ID } from '../../constants/firebaseConfig';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  // const { login, loginWithGoogleCredential } = useAuth();
  
  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  // Focus states for input borders
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setIsLoading(true);
    try {
      await login(email, password);
     navigation?.navigate('OrganizerTabs', { screen: 'OrganizerDashboard' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  } finally {
    setIsLoading(false);
  }
};
  const handleGoogleAuth = async () => {
  if (googleLoading) return;
  setGoogleLoading(true);
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    try { await GoogleSignin.signOut(); } catch {}

    const signInResult = await GoogleSignin.signIn();
    const idToken = (signInResult as any)?.data?.idToken ?? (signInResult as any)?.idToken;
    if (!idToken) throw new Error('No ID token returned.');

    const tokens = await GoogleSignin.getTokens();
    const googleCredential = GoogleAuthProvider.credential(idToken, tokens?.accessToken);
    await signInWithCredential(getAuth(), googleCredential);

    navigation.replace('AppDrawer');
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) return;
    if (error?.code === statusCodes.IN_PROGRESS) return;
    console.error('Google Sign-In error:', error);
    Alert.alert('Google Sign-In Failed', 'Please try again.');
  } finally {
    setGoogleLoading(false);
  }
};
  const handleAppleAuth = async () => {
  if (Platform.OS !== 'ios') {
    Alert.alert('Not Available', 'Apple Sign-In is only available on iOS.');
    return;
  }
  if (appleLoading) return;
  setAppleLoading(true);
  try {
    const { appleAuth } = require('@invertase/react-native-apple-authentication');

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const { identityToken, nonce } = appleAuthRequestResponse;
    if (!identityToken) throw new Error('No identity token returned from Apple Sign-In.');
    const appleCredential = AppleAuthProvider.credential(identityToken, nonce);
    await signInWithCredential(getAuth(), appleCredential);

    navigation.replace('AppDrawer');
  } catch (error: any) {
    if (error?.code === 1) return; // user cancelled
    console.error('Apple Sign-In error:', error);
    Alert.alert('Apple Sign-In Failed', 'Please try again.');
  } finally {
    setAppleLoading(false);
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
          {/* Top Logo and Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.welcomeTitle}> Welcome Back </Text>
            <Text style={styles.subtitle}>Log in to discover and manage premium events</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Role Selector */}
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[styles.roleTab, selectedRole === 'attendee' && styles.roleTabActive]}
                onPress={() => setSelectedRole('attendee')}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={[styles.roleText, selectedRole === 'attendee' && styles.roleTextActive]}>
                  Attendee
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleTab, selectedRole === 'organizer' && styles.roleTabActive]}
                onPress={() => setSelectedRole('organizer')}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={[styles.roleText, selectedRole === 'organizer' && styles.roleTextActive]}>
                  Organizer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputContainer, isEmailFocused && styles.inputFocused]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={isEmailFocused ? colors.secondary : colors.outline}
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

            {/* Password field */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputContainer, isPasswordFocused && styles.inputFocused]}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={isPasswordFocused ? colors.secondary : colors.outline}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your password"
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
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.outline}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me and Forgot Password row */}
            <View style={styles.optionsRow}>
              <Pressable
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              >
                <MaterialCommunityIcons
                  name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={22}
                  color={rememberMe ? colors.secondary : colors.outline}
                />
                <Text style={styles.checkboxLabel}>Remember Me</Text>
              </Pressable>

              <TouchableOpacity onPress={() => navigation?.navigate('ForgotPassword')} disabled={isLoading}>
                <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Primary Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              style={[styles.primaryButton, { backgroundColor: colors.secondary }, isLoading && styles.buttonDisabled]}
            >
              <Text style={styles.primaryButtonText}>{isLoading ? 'Please wait…' : 'Log In'}</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={[styles.socialButton, googleLoading && styles.buttonDisabled]}
                onPress={handleGoogleAuth}
                activeOpacity={0.8}
                disabled={googleLoading}
              >
                <MaterialCommunityIcons name="google" size={20} color={colors.onBackground} />
                <Text style={styles.socialButtonText}>{googleLoading ? 'Signing in…' : 'Google'}</Text>
              </TouchableOpacity>

              {/* {Platform.OS === 'ios' && ( */}
                <TouchableOpacity
                  style={[styles.socialButton, appleLoading && styles.buttonDisabled]}
                  onPress={handleAppleAuth}
                  activeOpacity={0.8}
                  disabled={appleLoading}
                >
                  <MaterialCommunityIcons name="apple" size={20} color={colors.onBackground} />
                  <Text style={styles.socialButtonText}>{appleLoading ? 'Signing in…' : 'Apple'}</Text>
                </TouchableOpacity>
              {/* )} */}
            </View>
          </View>

          {/* Create Account Button Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Signup')} disabled={isLoading}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: colors.background },
  keyboardContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, justifyContent: 'center' },
  headerContainer: { alignItems: 'center', marginBottom: spacing.xl, marginTop: spacing.lg },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.level2,
    ...shadows.level1,
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
    textAlign: 'center',
    paddingHorizontal: spacing.md,
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
  welcomeTitle: { ...typography.headlineLgMobile, color: colors.onBackground, fontWeight: '700', marginBottom: spacing.xs },
  subtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', paddingHorizontal: spacing.md },
  formContainer: { width: '100%' },
  inputWrapper: { marginBottom: spacing.md },
  inputLabel: { ...typography.labelMd, color: colors.onBackground, fontWeight: '600', marginBottom: spacing.xs, marginLeft: spacing.xs },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputFocused: { borderColor: colors.secondary, borderWidth: 1.5 },
  inputIcon: { marginRight: spacing.sm },
  textInput: { flex: 1, color: colors.onBackground, ...typography.bodyMd, height: '100%' },
  iconButton: { padding: spacing.xs },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { ...typography.bodyMd, color: colors.onBackground, marginLeft: spacing.xs },
  forgotPasswordLink: { ...typography.labelMd, fontWeight: '600', color: colors.secondary },
  primaryButton: { borderRadius: radius.button, height: 56, justifyContent: 'center', alignItems: 'center', width: '100%', ...shadows.level2 },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: colors.onPrimary },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.outlineVariant },
  dividerText: { ...typography.bodyMd, fontSize: 12, color: colors.onSurfaceVariant, paddingHorizontal: spacing.md },
  socialRow: { flexDirection: 'row', gap: spacing.md },
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: colors.onBackground,
    marginLeft: spacing.xs,
  },
  forgotPasswordLink: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level2,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 12,
    color: colors.secondary,
    paddingHorizontal: spacing.md,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.button,
    height: 56,
    gap: spacing.sm,
    ...shadows.level1,
    borderRadius: radius.full,
    height: 56,
    gap: spacing.sm,
    ...shadows.level1,
  },
  socialButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 15,
    fontWeight: '500',
    color: colors.onBackground,
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
  socialButtonText: { ...typography.labelMd, fontWeight: '600', color: colors.onBackground },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xl, paddingBottom: spacing.md },
  footerText: { ...typography.bodyMd, color: colors.onSurfaceVariant },
  footerLink: { ...typography.labelMd, fontWeight: '700', color: colors.secondary },
  roleContainer: { flexDirection: 'row', backgroundColor: colors.surfaceContainerLow, borderRadius: radius.button, padding: 4, marginBottom: spacing.md },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.button - 2 },
  roleTabActive: { backgroundColor: colors.surface, ...shadows.level1 },
  roleText: { ...typography.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' },
  roleTextActive: { color: colors.secondary, fontWeight: '700' },
});

export default LoginScreen;
