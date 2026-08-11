export interface UserInfo {
  uid: string;
  name: string;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

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
