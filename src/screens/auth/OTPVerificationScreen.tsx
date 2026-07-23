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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface OTPVerificationScreenProps {
  navigation: any;
  route?: any;
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimeLeft, setResendTimeLeft] = useState(59);
  const [errorMsg, setErrorMsg] = useState('');

  // References to switch inputs automatically
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  // Mobile number fallback for display
  const targetContact = route?.params?.contact || '+1 (555) 019-2834';

  useEffect(() => {
    if (resendTimeLeft <= 0) return;
    const timer = setInterval(() => {
      setResendTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    setErrorMsg('');

    // If a digit is entered, auto-focus next box
    if (value.length > 0 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // If backspace is pressed on an empty box, auto-focus previous box
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResend = () => {
    if (resendTimeLeft > 0) return;
    setResendTimeLeft(59);
    setOtp(['', '', '', '']);
    setErrorMsg('');
    inputRefs[0].current?.focus();
  };

  const handleVerify = async () => {
    const enteredCode = otp.join('');
    if (enteredCode.length < 4) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Simulate API verification call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (enteredCode === '1234') { // Mock success code
        // Successful verification
        navigation?.navigate('ResetPassword');
      } else {
        setErrorMsg('Invalid verification code. Please try again.');
      }
    } catch (e) {
      setErrorMsg('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isOtpComplete = otp.every((val) => val.length === 1);

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
            <Text style={styles.welcomeTitle}>Verification Code</Text>
            <Text style={styles.subtitle}>Enter the 4-digit code sent to {targetContact}</Text>
          </View>

          {/* Illustration Icon */}
          <View style={styles.illustrationWrapper}>
            <View style={styles.illustrationBg}>
              <MaterialCommunityIcons name="message-processing-outline" size={64} color={colors.primary} />
            </View>
          </View>

          {/* Code Inputs */}
          <View style={styles.otpFormContainer}>
            <View style={styles.otpRowContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={[
                    styles.otpBox,
                    digit !== '' && styles.otpBoxFilled,
                    errorMsg !== '' && styles.otpBoxError,
                  ]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  editable={!isLoading}
                  selectTextOnFocus
                />
              ))}
            </View>

            {errorMsg !== '' ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : null}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[
                styles.primaryButton, 
                (!isOtpComplete || isLoading) && styles.buttonDisabled
              ]} 
              onPress={handleVerify}
              disabled={!isOtpComplete || isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Verify & Continue</Text>
            </TouchableOpacity>

            {/* Resend Cooldown */}
            <View style={styles.resendWrapper}>
              <Text style={styles.resendLabel}>Didn't receive the code? </Text>
              <TouchableOpacity 
                onPress={handleResend}
                disabled={resendTimeLeft > 0 || isLoading}
              >
                <Text 
                  style={[
                    styles.resendLink, 
                    resendTimeLeft > 0 && styles.resendLinkDisabled
                  ]}
                >
                  {resendTimeLeft > 0 ? `Resend in ${resendTimeLeft}s` : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
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
    lineHeight: 20,
  },
  illustrationWrapper: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  illustrationBg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  otpFormContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  otpRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    maxWidth: 280,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.onBackground,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  otpBoxError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  actionContainer: {
    width: '100%',
    marginTop: 'auto',
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
  primaryButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  resendWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  resendLabel: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: colors.secondary,
  },
  resendLink: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  resendLinkDisabled: {
    color: colors.outline,
    fontWeight: '400',
  },
});

export default OTPVerificationScreen;
