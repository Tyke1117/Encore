import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';


interface SettingsRowProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  destructive?: boolean;
  valueText?: string;
}

function SettingsRow({ icon, label, onPress, destructive, valueText }: SettingsRowProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.outlineVariant }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={[
        styles.rowIconContainer, 
        { backgroundColor: colors.surfaceContainerLow },
        destructive && { backgroundColor: `${colors.error}12` }
      ]}>
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colors.error : colors.onSurfaceVariant}
        />
      </View>
      <Text style={[
        styles.rowText, 
        { color: colors.onSurface },
        destructive && { color: colors.error, fontWeight: '600' }
      ]}>
        {label}
      </Text>
      {valueText ? (
        <Text style={[styles.valueText, { color: colors.onSurfaceVariant }]}>{valueText}</Text>
      ) : null}
      <Ionicons
        name="chevron-forward-outline"
        size={18}
        color={destructive ? colors.error : colors.outline}
      />
    </TouchableOpacity>
  );
}

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const { logout } = useAuth();
  const { colors, isDark, toggleTheme, themeMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of Encore?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              navigation.replace('Login');
            } catch (e) {
              console.error(e);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Section 1: Account */}
        <Text style={[styles.sectionHeader, { color: colors.secondary }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <SettingsRow
            icon="person-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate('Profile')}
          />
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
          <SettingsRow
            icon="key-outline"
            label="Change Password"
            onPress={() => Alert.alert('Security', 'Password change screen placeholder')}
          />
        </View>

        {/* Section 2: Preferences */}
        <Text style={[styles.sectionHeader, { color: colors.secondary }]}>Preferences</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <SettingsRow
            icon="notifications-outline"
            label="Push Notifications"
            onPress={() => navigation.navigate('Notifications')}
          />
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
          <SettingsRow
            icon="eye-outline"
            label="Privacy & Visibility"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
          <SettingsRow
            icon="color-palette-outline"
            label="App Theme"
            valueText={
              themeMode === 'system'
                ? 'System Default'
                : themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'
            }
            onPress={toggleTheme}
          />
        </View>

        {/* Section 3: Legal & Support */}
        <Text style={[styles.sectionHeader, { color: colors.secondary }]}>Support & Legal</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <SettingsRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => Alert.alert('Support', 'Helpdesk ticket template')}
          />
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
          <SettingsRow
            icon="document-text-outline"
            label="Terms & Conditions"
            onPress={() => navigation.navigate('Terms')}
          />
          <View style={[styles.divider, { backgroundColor: colors.outlineVariant }]} />
          <SettingsRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
        </View>

        {/* Section 4: Actions */}
        <Text style={[styles.sectionHeader, { color: colors.secondary }]}>Actions</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <SettingsRow
            icon="log-out-outline"
            label="Log Out"
            onPress={handleLogout}
            destructive
          />
        </View>

        {/* Build version info */}
        <Text style={[styles.versionText, { color: colors.onSurfaceVariant }]}>Encore v1.0.0 (Production-ready)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 70,
    paddingTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    ...typography.labelSm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  rowIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  rowText: {
    ...typography.bodyLg,
    fontWeight: '500',
    flex: 1,
  },
  valueText: {
    marginRight: spacing.sm,
    ...typography.bodyMd,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: 36 + spacing.md * 2,
  },
  versionText: {
    ...typography.labelSm,
    textAlign: 'center',
    marginTop: spacing.xl,
    opacity: 0.6,
  },
});
