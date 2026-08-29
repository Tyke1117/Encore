import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/fonts';


export default function CustomDrawerContent(props: DrawerContentComponentProps){
  const { navigation } = props ;
  // const { currentUser, logout, setRole } = useAuth();
  const { colors } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const state = props.state;
  const activeRoute = state.routes[state.index];
  const activeRouteName = activeRoute.name;

  let activeTabName = 'Home';
  if (activeRouteName === 'AppTabs' && activeRoute.state) {
    const nestedIndex = activeRoute.state.index ?? 0;
    activeTabName = (activeRoute.state.routeNames && activeRoute.state.routeNames[nestedIndex]) || 'Home';
  }

  const performLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      setIsLoggingOut(false);
      navigation.replace('Login');
    }, 1500);
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Encore?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: performLogout },
      ]
    );
  };

  const name = 'User';
  const email =  'user@encore.edu';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();


  const menuItems = [
    { name: 'Home', label: 'Dashboard', icon: 'grid-outline' as const, isTab: true },
    { name: 'Profile', label: 'My Profile', icon: 'person-outline' as const, isTab: true },
    { name: 'Notifications', label: 'Notifications', icon: 'notifications-outline' as const, isTab: true },
    { name: 'Settings', label: 'Settings', icon: 'settings-outline' as const, isTab: false },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Header Banner with Premium Gradient */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          props.navigation.navigate('AppTabs', { screen: 'Profile' });
          props.navigation.closeDrawer();
        }}
      >
        <LinearGradient
          colors={[colors.secondary, colors.tertiary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.profileContainer}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileTextWrap}>
              <Text style={styles.nameText} numberOfLines={1}>{name}</Text>
              <Text style={styles.emailText} numberOfLines={1}>{email}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Navigation List */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Dynamic Workspace / Role Switcher */}
        <View style={[styles.roleSwitchCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          <View style={styles.roleSwitchTextWrap}>
            <Text style={[styles.roleLabel, { color: colors.onSurfaceVariant }]}>Active Workspace</Text>
            <Text style={[styles.roleValue, { color: colors.onSurface }]}>
              {/* {currentUser?.role === 'organizer' ? 'Organizer Mode' : 'Attendee Mode'} */}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.roleSwitchBtn, { backgroundColor: colors.secondaryContainer }]}
            onPress={() => {
              // const targetRole = currentUser?.role === 'organizer' ? 'attendee' : 'organizer';
              // setRole(targetRole);
              // Navigate Home to make sure the tab views refresh
              props.navigation.navigate('AppTabs', { screen: 'Home' });
              props.navigation.closeDrawer();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="swap-horizontal" size={16} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const isActive = item.isTab 
              ? (activeRouteName === 'AppTabs' && activeTabName === item.name)
              : activeRouteName === item.name;

            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.menuItem,
                  isActive && [styles.menuItemActive, { backgroundColor: colors.surfaceContainerLow }],
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  if (item.isTab) {
                    props.navigation.navigate('AppTabs', { screen: item.name });
                  } else {
                    props.navigation.navigate(item.name);
                  }
                  props.navigation.closeDrawer();
                }}
              >
                <View style={[
                  styles.iconWrap, 
                  isActive && [styles.iconWrapActive, { backgroundColor: colors.secondaryContainer }]
                ]}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={isActive ? colors.secondary : colors.onSurfaceVariant}
                  />
                </View>
                <Text style={[
                  styles.menuLabel, 
                  { color: colors.onSurfaceVariant },
                  isActive && [styles.menuLabelActive, { color: colors.onSurface }]
                ]}>
                  {item.label}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: colors.secondary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <View style={[styles.footer, { borderTopColor: colors.outlineVariant }]}>
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {isLoggingOut && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }]}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={{ marginTop: 16, color: '#ffffff', fontWeight: 'bold', fontSize: 16 }}>Logging you out...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1.5,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.headlineMd,
    color: '#ffffff',
    fontWeight: '700',
  },
  profileTextWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    ...typography.bodyLg,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 2,
  },
  emailText: {
    ...typography.labelSm,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  scrollContent: {
    paddingTop: spacing.sm,
  },
  menuSection: {
    paddingHorizontal: spacing.sm,
    gap: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    position: 'relative',
  },
  menuItemActive: {},
  iconWrap: {
    marginRight: spacing.md,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    borderRadius: 8,
  },
  menuLabel: {
    ...typography.bodyLg,
    fontWeight: '500',
    flex: 1,
  },
  menuLabelActive: {
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: spacing.sm,
    width: 4,
    height: 16,
    borderRadius: radius.full,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom:40,
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  logoutText: {
    ...typography.bodyLg,
    color: '#ba1a1a',
    fontWeight: '600',
  },
  roleSwitchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  roleSwitchTextWrap: {
    flex: 1,
  },
  roleLabel: {
    ...typography.labelSm,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  roleValue: {
    ...typography.bodyMd,
    fontWeight: '700',
    marginTop: 2,
  },
  roleSwitchBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
