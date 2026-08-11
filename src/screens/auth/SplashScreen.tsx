import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, View, Dimensions, StatusBar, ImageBackground } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
const { width, height } = Dimensions.get('window');
interface SplashScreenProps {
  navigation: any;
}
// TODO: Replace these with your actual full-screen splash image paths.
// Using the same default path for both light and dark for now â€”
// swap in your dedicated light/dark splash images when ready.
const SPLASH_IMAGE_LIGHT = require('../../../assets/splash/splash-light.png');
const SPLASH_IMAGE_DARK = require('../../../assets/splash/splash-dark.png');
export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { isDark } = useTheme();
  const { user, loading } = useAuth();
  // Animation values
  const fade = useRef(new Animated.Value(0)).current;

  // Keep the splash visible for at least 2.2s regardless of how fast
  // Firebase resolves the auth check, so the intro doesn't flash by
  // instantly on a fast session restore.
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Navigate once BOTH the minimum splash time has passed AND
  // Firebase has finished checking for a restored session.
  useEffect(() => {
    if (minTimeElapsed && !loading) {
      navigation.replace(user ? 'AppDrawer' : 'Login');
    }
  }, [minTimeElapsed, loading, user]);

  const splashImageSource = isDark ? SPLASH_IMAGE_DARK : SPLASH_IMAGE_LIGHT;
  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="black" />
      <Animated.View style={[styles.fullScreen, { opacity: fade }]}>
        <ImageBackground
          source={splashImageSource}
          style={styles.fullScreen}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
  },
  fullScreen: {
    width,
    height,
    marginBottom:-100
  },
});
export default SplashScreen;