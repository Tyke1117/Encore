import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface EventPublishedProps {
  route: any;
  navigation: any;
}

export default function EventPublished({ route, navigation }: EventPublishedProps) {
  const { eventData } = route.params || {};

 const handleClose = () => {
  navigation.navigate('OrganizerTabs', { screen: 'OrganizerDashboard' });
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Close Button */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon */}
        <View style={styles.successIconContainer}>
          <View style={styles.successIconOuter}>
            <View style={styles.successIconInner}>
              <Icon name="check" size={32} color={colors.secondary} />
            </View>
          </View>
        </View>

        {/* Success Header */}
        <Text style={styles.successTitle}>Your event is live!</Text>
        <Text style={styles.successSub}>
          High-fives all around. Your corporate gala has been published and is now accepting registrations.
        </Text>

        {/* Event Card */}
        <View style={[styles.eventCard, shadows.level2]}>
          <View style={styles.cardImageContainer}>
            <Image
              source={{
                uri:
                  eventData?.coverImage ||
                  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
              }}
              style={styles.cardImage}
            />
            {/* Confirmed tag */}
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedBadgeText}>CONFIRMED</Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            {/* Date & Time */}
            <View style={styles.dateRow}>
              <Icon name="calendar" size={14} color={colors.primaryContainer} style={{ marginRight: 6 }} />
              <Text style={styles.dateText}>
                {eventData?.startDate ? eventData.startDate.toUpperCase() : 'OCTOBER 24, 2024'} -{' '}
                {eventData?.startTime || '6:00 PM'}
              </Text>
            </View>

            {/* Event Title */}
            <Text style={styles.eventTitle}>{eventData?.title || 'Future of Fintech: Global Leadership Summit'}</Text>

            {/* Location */}
            <View style={styles.locationRow}>
              <Icon name="map-pin" size={14} color={colors.onSurfaceVariant} style={{ marginRight: 6 }} />
              <Text style={styles.locationText} numberOfLines={1}>
                {eventData?.isVirtual ? 'Virtual Event' : eventData?.venue || 'The Grand Meridian, New York'}
              </Text>
            </View>

            {/* Bottom row of card: Attendees and Privacy Tag */}
            <View style={styles.cardFooterRow}>
              {/* Attendee Avatars */}
              <View style={styles.avatarsContainer}>
                {mockAvatars.map((url, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: url }}
                    style={[styles.avatarImage, { marginLeft: idx > 0 ? -10 : 0 }]}
                  />
                ))}
                <View style={[styles.avatarCountBadge, { marginLeft: -10 }]}>
                  <Text style={styles.avatarCountText}>+12</Text>
                </View>
              </View>

              {/* Public Tag */}
              <View style={styles.publicBadge}>
                <Text style={styles.publicBadgeText}>Public Event</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Invite Participants Button */}
          <TouchableOpacity style={[styles.inviteButton, shadows.level1]}>
            <Icon name="user-plus" size={18} color={colors.onPrimary} style={{ marginRight: 8 }} />
            <Text style={styles.inviteButtonText}>Invite Participants</Text>
          </TouchableOpacity>

          {/* Share Link Button */}
          <TouchableOpacity style={styles.shareButton}>
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
            encore.events/{eventData?.title ? eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'fintech-summit-24'}
          </Text>
          <TouchableOpacity style={styles.copyIconButton} onPress={handleCopyLink}>
            <Icon name="copy" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Small Footer Copyright */}
        <Text style={styles.copyrightText}>© 2026 Encore Technologies Inc. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    paddingBottom: spacing['2xl'],
    alignItems: 'center',
  },
  successIconContainer: {
    marginVertical: spacing.lg,
  },
  successIconOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(113, 42, 226, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(113, 42, 226, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    ...typography.display,
    fontSize: 28,
    textAlign: 'center',
    color: colors.onSurface,
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
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
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
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
  },
  confirmedBadgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
    color: colors.onPrimary,
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
    color: colors.primary,
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
    borderTopColor: colors.slate[100],
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
    borderColor: colors.surfaceContainerLowest,
  },
  avatarCountBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.slate[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerLowest,
  },
  avatarCountText: {
    ...typography.labelSm,
    fontSize: 8,
    fontWeight: '700',
    color: colors.slate[800],
  },
  publicBadge: {
    backgroundColor: colors.slate[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  publicBadgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '600',
    color: colors.slate[800],
  },
  actionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  inviteButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.sm,
  },
  inviteButtonText: {
    ...typography.bodyLg,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  shareButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    paddingVertical: spacing.md,
    borderRadius: radius.button,
    marginBottom: spacing.lg,
  },
  shareButtonText: {
    ...typography.bodyLg,
    color: colors.onSurface,
    fontWeight: '600',
  },
  dashboardLink: {
    paddingVertical: spacing.xs,
  },
  dashboardLinkText: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  copyBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing['2xl'],
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
