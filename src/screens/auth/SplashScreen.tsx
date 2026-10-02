import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Animated, View, Text, TouchableOpacity, Dimensions, StatusBar, Platform } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, loading } = useAuth();
  const fade = useRef(new Animated.Value(0)).current;
  const [navigated, setNavigated] = useState(false);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // On Web or native, navigate to AppDrawer after 1 second max
    const timer = setTimeout(() => {
      if (!navigated) {
        setNavigated(true);
        navigation.replace('AppDrawer');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !navigated) {
      const timer = setTimeout(() => {
        setNavigated(true);
        navigation.replace('AppDrawer');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="black" />
      <LinearGradient
        colors={[colors.secondary, colors.tertiary, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fade }]}>
          <Text style={styles.logoTitle}>ENCORE</Text>
          <Text style={styles.logoSub}>Event Management & Certificates</Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.replace('AppDrawer')}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Enter App →</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
  },
  logoSub: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    marginVertical: 12,
  },
  btn: {
    marginTop: 24,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  btnText: {
    color: '#1a161f',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default SplashScreen;