import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
  BackHandler,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { ColorsType } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface EventPublishedProps {
  route: any;
  navigation: any;
}

export default function EventPublished({ route, navigation }: EventPublishedProps) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const { eventData } = route.params || {};

  // Disable back navigation to event creation wizard once published
  useEffect(() => {
    const onBackPress = () => {
      navigation.navigate('OrganizerDashboard');
      return true; // Prevents default back behavior
    };

    const backSubscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backSubscription.remove();
  }, [navigation]);

  const handleClose = () => {
    navigation.navigate('OrganizerDashboard');
  };

  const handleCopyLink = () => {
    Alert.alert('Success', 'Event link copied to clipboard!');
  };

  const mockAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=60',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Top Close Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={[colors.secondaryContainer, colors.tertiaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successIconOuter}
          >
            <View style={[styles.successIconInner, { backgroundColor: colors.surface }]}>
              <Icon name="check" size={32} color={colors.secondary} />
            </View>
          </LinearGradient>
        </View>

        {/* Success Header */}
        <Text style={styles.successTitle}>Your event is live!</Text>
        <Text style={styles.successSub}>
          High-fives all around. Your event has been published and is now accepting registrations.
        </Text>

        {/* Event Card */}
        <View style={styles.eventCard}>
          <View style={styles.cardImageContainer}>
            <Image
              source={{
                uri:
                  eventData?.coverImage ||
                  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
              }}
              style={styles.cardImage}
            />
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedBadgeText}>Public Event</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>
                {eventData?.startDate || '24 Oct 2024'} at {eventData?.startTime || '19:00'}
              </Text>
            </View>
            <Text style={styles.eventTitle}>{eventData?.title || 'Global Innovation Summit 2024'}</Text>
            <View style={styles.locationRow}>
              <Icon
                name="map-pin"
                size={14}
                color={colors.onSurfaceVariant}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.locationText}>{eventData?.venue || 'Digital Art Pavilion'}</Text>
            </View>

            <View style={styles.cardFooterRow}>
              <View style={styles.avatarsContainer}>
                {mockAvatars.map((uri, index) => (
                  <Image
                    key={index}
                    source={{ uri }}
                    style={[styles.avatarImage, { zIndex: 3 - index, marginLeft: index === 0 ? 0 : -8 }]}
                  />
                ))}
                <View style={[styles.avatarCountBadge, { marginLeft: -8, zIndex: 0 }]}>
                  <Text style={styles.avatarCountText}>+48</Text>
                </View>
              </View>
              <View style={styles.publicBadge}>
                <Text style={styles.publicBadgeText}>
                  {eventData?.ticketType ? eventData.ticketType.toUpperCase() : 'FREE'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Invite Participants Button */}
          <TouchableOpacity
            onPress={() => Alert.alert('Invites', 'Invitations sent successfully!')}
            activeOpacity={0.8}
            style={[styles.inviteButtonTouch, styles.inviteButton, { backgroundColor: colors.secondary, flexDirection: 'row' }, shadows.level1]}
          >
            <Icon name="user-plus" size={18} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.inviteButtonText}>Invite Participants</Text>
          </TouchableOpacity>

          {/* Share Link Button */}
          <TouchableOpacity style={styles.shareButton} onPress={handleCopyLink}>
            <Icon name="share-2" size={18} color={colors.onSurface} style={{ marginRight: 8 }} />
            <Text style={styles.shareButtonText}>Share Link</Text>
          </TouchableOpacity>

          {/* Go to Dashboard text link */}
          <TouchableOpacity style={styles.dashboardLink} onPress={handleClose}>
            <Text style={styles.dashboardLinkText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>

        {/* Link Copy Box */}
        <View style={styles.copyBox}>
          <Icon name="globe" size={16} color={colors.onSurfaceVariant} style={{ marginRight: spacing.sm }} />
          <Text style={styles.copyBoxText} numberOfLines={1}>
            encore.events/
            {eventData?.title
              ? eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
              : 'fintech-summit-24'}
          </Text>
          <TouchableOpacity style={styles.copyIconButton} onPress={handleCopyLink}>
            <Icon name="copy" size={16} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Small Footer Copyright */}
        <Text style={styles.copyrightText}>© 2026 Encore Technologies Inc. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ColorsType) => StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  successIconContainer: {
    marginVertical: spacing.lg,
  },
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    ...typography.headlineLg,
    fontSize: 28,
    textAlign: 'center',
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  successSub: {
    ...typography.bodyMd,
    textAlign: 'center',
    color: colors.onSurfaceVariant,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  eventCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  cardImageContainer: {
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  confirmedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  confirmedBadgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
    color: colors.secondary,
  },
  cardBody: {
    padding: spacing.lg,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateText: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.secondary,
  },
  eventTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing.md,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  avatarCountBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  avatarCountText: {
    ...typography.labelSm,
    fontSize: 8,
    fontWeight: '700',
    color: colors.onSurface,
  },
  publicBadge: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  publicBadgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '600',
    color: colors.onSurface,
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  inviteButtonTouch: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  inviteButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.button,
  },
  inviteButtonText: {
    ...typography.bodyLg,
    color: '#ffffff',
    fontWeight: '700',
  },
  shareButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.lg,
  },
  shareButtonText: {
    ...typography.bodyLg,
    color: colors.onSurface,
    fontWeight: '700',
  },
  dashboardLink: {
    paddingVertical: spacing.xs,
  },
  dashboardLinkText: {
    ...typography.bodyMd,
    color: colors.secondary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  copyBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl,
  },
  copyBoxText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  copyIconButton: {
    padding: spacing.xs,
  },
  copyrightText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },
});
