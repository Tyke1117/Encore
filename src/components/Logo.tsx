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
        return { icon: 42, fontSize: 36, containerSize: 72 };
      default: // md
        return { icon: 26, fontSize: 24, containerSize: 48 };
    }
  };

  const dims = getSizes();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.tertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.logoIconBg,
          { width: dims.containerSize, height: dims.containerSize, borderRadius: dims.containerSize / 2 }
        ]}
      >
        <MaterialCommunityIcons name="music-circle" size={dims.icon} color="#ffffff" />
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
    gap: 12,
  },
  logoIconBg: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  logoText: {
    fontWeight: '900',
    letterSpacing: -1.2,
    fontStyle: 'italic',
  },
});

export default Logo;
