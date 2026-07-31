import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const { colors } = useTheme();

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { icon: 20, fontSize: 18, containerSize: 32 };
      case 'lg':
        return { icon: 40, fontSize: 36, containerSize: 64 };
      default: // md
        return { icon: 26, fontSize: 24, containerSize: 44 };
    }
  };

  const dims = getSizes();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.secondary, colors.tertiary, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.logoIconBg, { width: dims.containerSize, height: dims.containerSize, borderRadius: dims.containerSize / 2 }]}
      >
        <MaterialCommunityIcons name="lightning-bolt" size={dims.icon} color="#ffffff" />
      </LinearGradient>
      {showText && (
        <Text style={[styles.logoText, { fontSize: dims.fontSize, color: colors.onSurface }]}>
          Encore
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoIconBg: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'System',
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});

export default Logo;
