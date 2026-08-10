

export interface UserInfo {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Maps the raw Firebase Auth user object into the shape the rest of
 * the app (Profile screen, etc.) consumes. This is the "API" that
 * hands the authenticated user's info to the frontend — since we're
 * using the native Firebase SDK directly rather than a separate
 * backend server, this function is that boundary.
 */
export function getCurrentUserInfo(firebaseUser: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}): UserInfo {
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
  };
}