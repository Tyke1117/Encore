import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';



import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';


import { useAuth } from '../../context/AuthContext';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const { setRole } = useAuth();

  // Input states
  const [selectedRole, setSelectedRole] = useState<'attendee' | 'organizer'>('attendee');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  
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
  const userEmail = email.trim().toLowerCase();

  if (!fullName.trim()) {
    return Alert.alert("Error", "Enter your full name.");
  }

  if (!userEmail) {
    return Alert.alert("Error", "Enter your email.");
  }

  if (!mobileNumber.trim()) {
    return Alert.alert("Error", "Enter your mobile number.");
  }

  if (password.length < 6) {
    return Alert.alert("Error", "Password must be at least 6 characters.");
  }

  if (password !== confirmPassword) {
    return Alert.alert("Error", "Passwords do not match.");
  }

  if (!agreeTerms) {
    return Alert.alert("Error", "Please accept Terms & Conditions.");
  }

  setIsLoading(true);

  try {
    await setRole(selectedRole);
    const userCredential = await createUserWithEmailAndPassword(
      getAuth(),
      userEmail,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: fullName,
    });

    navigation.replace("AppDrawer");
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        Alert.alert("Email Exists", "An account already exists.");
        break;

      case "auth/invalid-email":
        Alert.alert("Invalid Email");
        break;

      case "auth/weak-password":
        Alert.alert("Weak Password", "Password should be at least 6 characters.");
        break;

      default:
        Alert.alert("Signup Failed", error.message);
    }
  } finally {
    setIsLoading(false);
  }
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Animated Header & Form */}
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
            {/* Top Back and Header */}
            <View style={styles.headerContainer}>
              <TouchableOpacity 
                onPress={() => navigation?.goBack()} 
                style={styles.backButton}
                disabled={isLoading}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color={colors.onBackground} />
              </TouchableOpacity>
              
              <Text style={[styles.welcomeTitle, { marginTop: spacing.sm }]}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up to search, find and book college events</Text>
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

            {/* Full Name */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputContainer, isNameFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="account-outline" 
                  size={20} 
                  color={isNameFocused ? colors.secondary : colors.outline} 
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

            {/* Mobile Number */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Mobile Number</Text>
              <View style={[styles.inputContainer, isMobileFocused && styles.inputFocused]}>
                <MaterialCommunityIcons 
                  name="phone-outline" 
                  size={20} 
                  color={isMobileFocused ? colors.secondary : colors.outline} 
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
                  color={isPasswordFocused ? colors.secondary : colors.outline} 
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
                  color={isConfirmPasswordFocused ? colors.secondary : colors.outline} 
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
                  color={agreeTerms ? colors.secondary : colors.outline} 
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
              onPress={handleSignup}
              disabled={isLoading || !agreeTerms}
              activeOpacity={0.8}
              style={[styles.primaryButton, { backgroundColor: colors.secondary }, (!agreeTerms || isLoading) && styles.buttonDisabled]}
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
          </Animated.View>
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
    ...typography.headlineLgMobile,
    color: colors.onBackground,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.labelMd,
    color: colors.onBackground,
    fontWeight: '600',
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
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
  inputFocused: {
    borderColor: colors.secondary,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.onBackground,
    ...typography.bodyMd,
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
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginLeft: spacing.xs,
    lineHeight: 18,
  },
  linkText: {
    color: colors.secondary,
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: radius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    ...shadows.level2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
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
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  footerLink: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.secondary,
  },
  roleContainer: { flexDirection: 'row', backgroundColor: colors.surfaceContainerLow, borderRadius: radius.button, padding: 4, marginBottom: spacing.md },
  roleTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: radius.button - 2 },
  roleTabActive: { backgroundColor: colors.surface, ...shadows.level1 },
  roleText: { ...typography.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' },
  roleTextActive: { color: colors.secondary, fontWeight: '700' },
});

export default SignupScreen;

