import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const { isDark } = useTheme();

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { width: 90, height: 30 };
      case 'lg':
        return { width: 180, height: 70 };
      default: // md
        return { width: 130, height: 50 };
    }
  };

  const dims = getSizes();

  return (
    <View style={[styles.container, isDark && styles.darkBadge]}>
      <Image
        source={require('../../assets/logo.jpg')}
        style={{ width: dims.width, height: dims.height }}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkBadge: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
});

export default Logo;
