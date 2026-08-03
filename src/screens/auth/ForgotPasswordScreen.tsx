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
  Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getAuth, sendPasswordResetEmail } from '@react-native-firebase/auth';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);

  const handleReset = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(getAuth(), trimmedEmail);
      setIsSuccess(true);
    } catch (error: any) {
      console.error(error);
      if (error?.code === 'auth/user-not-found') {
        Alert.alert('No Account', 'No account found with this email.');
      } else if (error?.code === 'auth/invalid-email') {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
      } else {
        Alert.alert('Something Went Wrong', 'Please try again.');
      }
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
            <LinearGradient
              colors={[colors.secondaryContainer, colors.tertiaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.illustrationBg}
            >
              <MaterialCommunityIcons name="shield-key-outline" size={64} color={colors.secondary} />
            </LinearGradient>
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
                  editable={!isLoading && !isSuccess}
                />
              </View>
            </View>

            {/* Send Link Button */}
            <TouchableOpacity 
              onPress={isSuccess ? () => navigation?.navigate('Login') : handleReset}
              disabled={isLoading || (!email.trim() && !isSuccess)}
              activeOpacity={0.8}
              style={[
                styles.primaryButton,
                { backgroundColor: isSuccess ? '#2E7D32' : colors.secondary },
                (isLoading || (!email.trim() && !isSuccess)) && styles.buttonDisabled
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {isSuccess ? 'Back to Login' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Back to Login */}
          <TouchableOpacity 
            style={styles.footerLinkContainer} 
            onPress={() => navigation?.navigate('Login')}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="keyboard-backspace" size={20} color={colors.secondary} />
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
    ...typography.headlineLgMobile,
    color: colors.onBackground,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  illustrationBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level2,
  },
  formContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  successCard: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E9',
    padding: spacing.md,
    borderRadius: radius.card,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  successTextContainer: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  successTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: spacing.xs,
  },
  successDescription: {
    ...typography.bodyMd,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
  inputWrapper: {
    marginBottom: spacing.lg,
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
  footerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  footerLinkText: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.secondary,
  },
});

export default ForgotPasswordScreen;

