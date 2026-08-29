import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();

  const [name, setName] = useState('User');
  const [email, setEmail] = useState('user@encore.edu');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [bio, setBio] = useState('Lead Student Coordinator & Event Organizer. Passionate about bringing creative students together.');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Saved', 'Your profile details have been updated successfully.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editHeaderBtn} 
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={[styles.editHeaderText, { color: colors.secondary }]}>
            {isEditing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Banner */}
        <View style={[styles.profileHeaderCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <LinearGradient
            colors={[colors.secondary, colors.tertiary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bannerGradient}
          />
          <View style={styles.profileAvatarWrapper}>
            <View style={[styles.avatarOutline, { borderColor: colors.surface }]}>
              <LinearGradient
                colors={[colors.secondaryContainer, colors.tertiaryContainer]}
                style={styles.avatarGradient}
              >
                <Text style={[styles.avatarInitials, { color: colors.secondary }]}>
                  {name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
            <TouchableOpacity style={[styles.changeAvatarBtn, { backgroundColor: colors.secondary }]}>
              <Ionicons name="camera" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.profileName, { color: colors.onSurface }]}>{name}</Text>
          <Text style={[styles.profileRole, { color: colors.onSurfaceVariant }]}>Event Organizer</Text>
        </View>

        {/* Inputs / Fields */}
        <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Personal Information</Text>
        
        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.formGroup}>
            <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>Full Name</Text>
            <View style={[
              styles.inputBox, 
              { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
              !isEditing && styles.readOnlyInput
            ]}>
              <Ionicons name="person-outline" size={18} color={colors.onSurfaceVariant} style={styles.fieldIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.onSurface }]}
                value={name}
                onChangeText={setName}
                editable={isEditing}
                placeholder="Enter your name"
                placeholderTextColor={colors.outline}
              />
            </View>
          </View>

          {/* Email Address */}
          <View style={styles.formGroup}>
            <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>Email Address</Text>
            <View style={[
              styles.inputBox, 
              { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
              !isEditing && styles.readOnlyInput
            ]}>
              <Ionicons name="mail-outline" size={18} color={colors.onSurfaceVariant} style={styles.fieldIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.onSurface }]}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={colors.outline}
              />
            </View>
          </View>

          {/* Mobile Number */}
          <View style={styles.formGroup}>
            <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>Mobile Number</Text>
            <View style={[
              styles.inputBox, 
              { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
              !isEditing && styles.readOnlyInput
            ]}>
              <Ionicons name="call-outline" size={18} color={colors.onSurfaceVariant} style={styles.fieldIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.onSurface }]}
                value={phone}
                onChangeText={setPhone}
                editable={isEditing}
                keyboardType="phone-pad"
                placeholder="Enter phone number"
                placeholderTextColor={colors.outline}
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.formGroup}>
            <Text style={[styles.fieldLabel, { color: colors.onSurface }]}>Bio</Text>
            {isEditing ? (
              <View style={[
                styles.inputBox, 
                styles.bioBox,
                { backgroundColor: colors.surface, borderColor: colors.outlineVariant }
              ]}>
                <Ionicons name="document-text-outline" size={18} color={colors.onSurfaceVariant} style={[styles.fieldIcon, { marginTop: 4 }]} />
                <TextInput
                  style={[styles.textInput, styles.bioInput, { color: colors.onSurface }]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  placeholder="Write something about yourself..."
                  placeholderTextColor={colors.outline}
                />
              </View>
            ) : (
              <View style={[
                styles.bioDisplayCard,
                { backgroundColor: colors.surface, borderColor: colors.outlineVariant }
              ]}>
                <Ionicons name="quote" size={20} color={colors.secondary} style={styles.quoteIcon} />
                <Text style={[styles.bioDisplayText, { color: colors.onSurface }]}>{bio || 'No bio written yet.'}</Text>
              </View>
            )}
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity 
            onPress={handleSave} 
            activeOpacity={0.8} 
            style={[styles.saveBtnTouch, styles.saveBtn, { backgroundColor: colors.secondary }, shadows.level2]}
          >
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

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
  editHeaderBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  editHeaderText: {
    ...typography.bodyLg,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  profileHeaderCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: spacing.lg,
    marginBottom: spacing.lg,
  },
  bannerGradient: {
    height: 90,
    width: '100%',
  },
  profileAvatarWrapper: {
    marginTop: -45,
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatarOutline: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: '700',
  },
  changeAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileName: {
    ...typography.headlineLgMobile,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  profileRole: {
    ...typography.labelMd,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.labelSm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  formContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  formGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.labelMd,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.input,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  bioBox: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: spacing.xs,
  },
  readOnlyInput: {
    opacity: 0.8,
  },
  fieldIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.bodyMd,
    height: '100%',
  },
  bioInput: {
    textAlignVertical: 'top',
    height: '100%',
  },
  saveBtnTouch: {
    width: '100%',
  },
  saveBtn: {
    borderRadius: radius.button,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  saveBtnText: {
    ...typography.bodyLg,
    color: '#ffffff',
    fontWeight: '700',
  },
  bioDisplayCard: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  quoteIcon: {
    marginTop: -2,
  },
  bioDisplayText: {
    flex: 1,
    ...typography.bodyMd,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});


export default ProfileScreen;
