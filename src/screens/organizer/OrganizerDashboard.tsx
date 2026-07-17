import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface OrganizerDashboardProps {
  navigation: any;
}

export default function OrganizerDashboard({ navigation }: OrganizerDashboardProps) {
  const handleCreateEvent = () => {
    navigation.navigate('CreateEventDetails');
  };

  const stats = [
    { label: 'Active Events', value: '4', icon: 'activity', color: colors.secondary },
    { label: 'Tickets Sold', value: '1,248', icon: 'tag', color: colors.primaryContainer },
    { label: 'Total Revenue', value: '$24,850', icon: 'dollar-sign', color: colors.tertiary },
  ];

  const recentEvents = [
    {
      title: 'Global Fintech Summit 2026',
      date: 'Aug 24, 2026',
      tickets: '350/500',
      status: 'Live',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&auto=format&fit=crop&q=60',
    },
    {
      title: 'AI Product Workshop',
      date: 'Sep 12, 2026',
      tickets: '82/100',
      status: 'Selling',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&auto=format&fit=crop&q=60',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, Organizer</Text>
          <Text style={styles.welcomeSub}>Here is how your events are performing today.</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <View key={idx} style={[styles.statCard, shadows.level1]}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                <Icon name={stat.icon} size={16} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Create Event Prompt Card */}
        <View style={[styles.promptCard, shadows.level2]}>
          <View style={styles.promptTextContainer}>
            <Text style={styles.promptTitle}>Host your next masterpiece</Text>
            <Text style={styles.promptSub}>Create details, set schedule, add tickets, and publish.</Text>
          </View>
          <TouchableOpacity style={styles.createButton} activeOpacity={0.9} onPress={handleCreateEvent}>
            <Icon name="plus" size={18} color={colors.onPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.createButtonText}>Create Event</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Events Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Events</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsList}>
          {recentEvents.map((evt, idx) => (
            <View key={idx} style={[styles.eventRow, shadows.level1]}>
              <Image source={{ uri: evt.image }} style={styles.eventImage} />
              <View style={styles.eventInfo}>
                <Text style={evt.status === 'Live' ? styles.eventRowTitleLive : styles.eventRowTitle} numberOfLines={1}>
                  {evt.title}
                </Text>
                <Text style={styles.eventRowSub}>
                  {evt.date} • {evt.tickets} tickets
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: colors.primaryFixed }]}>
                <Text style={styles.statusText}>{evt.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: '700',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  welcomeSection: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
  },
  welcomeSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.card,
    padding: spacing.md,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  promptCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.card,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  promptTextContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  promptTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  promptSub: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
  },
  createButtonText: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  seeAllText: {
    ...typography.bodyMd,
    color: colors.primary,
    fontWeight: '600',
  },
  eventsList: {
    gap: spacing.sm,
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  eventImage: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
  },
  eventInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  eventRowTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  eventRowTitleLive: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.primary, // visually highlight live event
  },
  eventRowSub: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  statusText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '600',
    color: colors.onPrimaryFixedVariant,
  },
});