/**
 * Validates whether the given string is a correctly formatted email address.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength.
 * Requirements: Minimum 6 characters (as required by Firebase by default).
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long.',
    };
  }
  return { isValid: true, message: '' };
};

/**
 * Validates full name.
 * Requirements: Not empty and contains at least a first name.
 */
export const validateFullName = (name: string): boolean => {
  return name.trim().length >= 2;
};
