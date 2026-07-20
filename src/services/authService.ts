export const login = async (email: string, password: string): Promise<{ success: boolean; user?: { email: string } }> => {
  // Placeholder stub - No implementation
  return Promise.resolve({ success: true, user: { email } });
};

export const signup = async (
  email: string, 
  password: string, 
  fullName: string, 
  mobileNumber: string
): Promise<{ success: boolean; user?: { email: string; fullName: string; mobileNumber: string } }> => {
  // Placeholder stub - No implementation
  return Promise.resolve({ success: true, user: { email, fullName, mobileNumber } });
};

export const logout = async (): Promise<{ success: boolean }> => {
  // Placeholder stub - No implementation
  return Promise.resolve({ success: true });
};

export const resetPassword = async (email: string): Promise<{ success: boolean }> => {
  // Placeholder stub - No implementation
  return Promise.resolve({ success: true });
};

export const sendVerification = async (): Promise<{ success: boolean }> => {
  // Placeholder stub - No implementation
  return Promise.resolve({ success: true });
};
