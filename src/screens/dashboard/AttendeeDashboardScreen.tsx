import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useEvents, EventItem } from '../../context/EventsContext';
import Logo from '../../components/Logo';
import UserPreferencesModal from '../../components/UserPreferencesModal';
import {
  UserPreferences,
  getUserPreferences,
} from '../../services/userPreferencesService';
import {
  Announcement,
  getAnnouncements,
} from '../../services/announcementService';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

const { width } = Dimensions.get('window');

export default function AttendeeDashboardScreen({ navigation }: { navigation: any }) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const { events } = useEvents();

  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [prefModalVisible, setPrefModalVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = user?.uid || 'demo-user-123';

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    const prefs = await getUserPreferences(userId);
    setPreferences(prefs);

    // If new user or setup not completed, auto-trigger preference modal
    if (!prefs.setupCompleted) {
      setPrefModalVisible(true);
    }

    const annList = await getAnnouncements();
    setAnnouncements(annList);
    setIsLoading(false);
  };

  const handlePreferencesSaved = (updated: UserPreferences) => {
    setPreferences(updated);
  };

  // Filter events based on user preferences
  const userCategories = preferences?.categories || ['tech', 'cultural', 'music', 'sports'];
  const maxPrice = preferences?.maxPrice ?? 5000;

  const tailoredEvents = events.filter((ev) => {
    const matchesCategory = userCategories.includes(ev.category);
    
    let priceNum = 0;
    if (ev.price && ev.price !== 'Free') {
      priceNum = parseFloat(ev.price.replace(/[^\d.]/g, '')) || 0;
    }
    const matchesPrice = priceNum <= maxPrice;

    return matchesCategory && matchesPrice;
  });

  // Filter discount announcements
  const discountAnnouncements = announcements.filter((a) => a.type === 'discount');

  const userName = user?.name || 'Attendee';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Navigation Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Logo size="sm" />
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Attendee Hub</Text>
        </View>

        <TouchableOpacity
          style={[styles.prefBtn, { backgroundColor: colors.secondaryContainer }]}
          onPress={() => setPrefModalVisible(true)}
        >
          <Ionicons name="options-outline" size={18} color={colors.secondary} />
          <Text style={[styles.prefBtnText, { color: colors.secondary }]}>Preferences</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Banner with User Preference Badges */}
        <LinearGradient
          colors={[colors.secondary, colors.tertiary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerHeaderRow}>
            <View>
              <Text style={styles.welcomeSubtitle}>MY ATTENDEE DASHBOARD</Text>
              <Text style={styles.welcomeTitle}>Welcome back, {userName.split(' ')[0]}! 👋</Text>
            </View>
            <TouchableOpacity style={styles.editIconBtn} onPress={() => setPrefModalVisible(true)}>
              <Ionicons name="pencil" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.bannerDesc}>
            Events and announcements tailored specifically for your selected interests & ticket budget.
          </Text>

          {/* Stored Preference Chips */}
          <View style={styles.prefBadgesRow}>
            {userCategories.map((cat) => (
              <View key={cat} style={styles.badgePill}>
                <Ionicons name="checkmark-circle" size={12} color="#ffffff" />
                <Text style={styles.badgePillText}>{cat.toUpperCase()}</Text>
              </View>
            ))}
            <View style={styles.badgePill}>
              <Text style={styles.badgePillText}>
                {maxPrice === 0 ? 'FREE ONLY' : maxPrice >= 5000 ? 'ANY PRICE' : `UNDER ₹${maxPrice}`}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
            <Ionicons name="sparkles-outline" size={24} color={colors.secondary} />
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{tailoredEvents.length}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Tailored Events</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
            <Ionicons name="pricetag-outline" size={24} color="#2e7d32" />
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{discountAnnouncements.length}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Active Discounts</Text>
          </View>

          <TouchableOpacity
            style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}
            onPress={() => navigation.navigate('Announcements')}
          >
            <Ionicons name="megaphone-outline" size={24} color={colors.tertiary} />
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{announcements.length}</Text>
            <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Announcements</Text>
          </TouchableOpacity>
        </View>

        {/* Special Discounts & Ticket Offers */}
        {discountAnnouncements.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionTitleWrap}>
                <Ionicons name="flame" size={20} color="#e65100" />
                <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Ticket Discounts & Offers</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
                <Text style={[styles.seeAllText, { color: colors.secondary }]}>View All →</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.discountScroll}>
              {discountAnnouncements.map((disc) => (
                <View
                  key={disc.id}
                  style={[
                    styles.discountCard,
                    { backgroundColor: colors.surface, borderColor: colors.secondary },
                    shadows.level2,
                  ]}
                >
                  <View style={styles.discountBadgeHeader}>
                    <Text style={styles.discountBadgeText}>
                      {disc.discountPercentage ? `${disc.discountPercentage}% OFF` : 'SPECIAL OFFER'}
                    </Text>
                  </View>

                  <Text style={[styles.discountTitle, { color: colors.onSurface }]} numberOfLines={2}>
                    {disc.title}
                  </Text>
                  <Text style={[styles.discountContent, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                    {disc.content}
                  </Text>

                  <View style={styles.discountFooter}>
                    <Text style={[styles.discountPrice, { color: colors.tertiary }]}>
                      Price: {disc.ticketPrice || 'Discounted'}
                    </Text>
                    <TouchableOpacity
                      style={[styles.claimBtn, { backgroundColor: colors.secondary }]}
                      onPress={() =>
                        Alert.alert(
                          'Claim Offer',
                          `Offer "${disc.title}" applied! Use promo code ENCORE2026 at checkout.`
                        )
                      }
                    >
                      <Text style={styles.claimBtnText}>Claim Offer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recommended Tailored Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="compass-outline" size={20} color={colors.secondary} />
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Recommended For You</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={[styles.seeAllText, { color: colors.secondary }]}>Browse All →</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : tailoredEvents.length === 0 ? (
            <View style={[styles.emptyBox, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
              <Ionicons name="filter-outline" size={36} color={colors.outline} />
              <Text style={[styles.emptyBoxText, { color: colors.onSurfaceVariant }]}>
                No events match your current budget & filter settings.
              </Text>
              <TouchableOpacity
                style={[styles.resetPrefBtn, { backgroundColor: colors.secondaryContainer }]}
                onPress={() => setPrefModalVisible(true)}
              >
                <Text style={[styles.resetPrefText, { color: colors.secondary }]}>Adjust Preferences</Text>
              </TouchableOpacity>
            </View>
          ) : (
            tailoredEvents.map((ev) => (
              <View
                key={ev.id}
                style={[
                  styles.eventCard,
                  { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                  shadows.level1,
                ]}
              >
                <View style={[styles.eventIconBox, { backgroundColor: `${colors.secondary}15` }]}>
                  <Ionicons name={(ev.imageIcon || 'calendar-outline') as any} size={22} color={colors.secondary} />
                </View>

                <View style={styles.eventInfo}>
                  <View style={styles.categoryRow}>
                    <Text style={[styles.categoryTag, { color: colors.secondary }]}>
                      {ev.category.toUpperCase()}
                    </Text>
                    <Text style={[styles.eventPrice, { color: colors.tertiary }]}>{ev.price}</Text>
                  </View>
                  <Text style={[styles.eventName, { color: colors.onSurface }]}>{ev.name}</Text>
                  <Text style={[styles.eventMeta, { color: colors.onSurfaceVariant }]}>
                    {ev.date} · {ev.venue}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.bookBtn, { backgroundColor: colors.secondary }]}
                  onPress={() =>
                    Alert.alert(
                      'Booking Ticket',
                      `Proceed to book ticket for ${ev.name} (${ev.price})?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Confirm',
                          onPress: () => Alert.alert('Success!', `Ticket booked for ${ev.name}!`),
                        },
                      ]
                    )
                  }
                >
                  <Text style={styles.bookBtnText}>Book</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Latest Announcements Feed Widget */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Latest Announcements</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
              <Text style={[styles.seeAllText, { color: colors.secondary }]}>View Feed →</Text>
            </TouchableOpacity>
          </View>

          {announcements.slice(0, 2).map((ann) => (
            <TouchableOpacity
              key={ann.id}
              style={[
                styles.annWidgetCard,
                { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                shadows.level1,
              ]}
              onPress={() => navigation.navigate('Announcements')}
            >
              <View style={styles.annWidgetHeader}>
                <Ionicons name="megaphone" size={16} color={colors.secondary} />
                <Text style={[styles.annWidgetTitle, { color: colors.onSurface }]} numberOfLines={1}>
                  {ann.title}
                </Text>
              </View>
              <Text style={[styles.annWidgetDesc, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                {ann.content}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Preferences Modal */}
      <UserPreferencesModal
        visible={prefModalVisible}
        userId={userId}
        onClose={() => setPrefModalVisible(false)}
        onSaved={handlePreferencesSaved}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.headlineMd,
    fontSize: 17,
    fontWeight: '700',
  },
  prefBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.chip,
    gap: 4,
  },
  prefBtnText: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  banner: {
    borderRadius: radius.card,
    padding: spacing.md,
  },
  bannerHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeSubtitle: {
    ...typography.labelSm,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1,
    fontWeight: '700',
  },
  welcomeTitle: {
    ...typography.headlineMd,
    color: '#ffffff',
    fontWeight: '800',
    marginTop: 2,
  },
  editIconBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerDesc: {
    ...typography.bodyMd,
    color: '#ffffff',
    fontSize: 13,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  prefBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.chip,
    gap: 4,
  },
  badgePillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statValue: {
    ...typography.headlineMd,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    ...typography.labelSm,
    fontSize: 10,
    textAlign: 'center',
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '800',
  },
  seeAllText: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  discountScroll: {
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  discountCard: {
    width: width * 0.72,
    borderRadius: radius.card,
    borderWidth: 1.5,
    padding: spacing.md,
  },
  discountBadgeHeader: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.chip,
    marginBottom: spacing.xs,
  },
  discountBadgeText: {
    color: '#2e7d32',
    ...typography.labelSm,
    fontWeight: '800',
    fontSize: 10,
  },
  discountTitle: {
    ...typography.bodyLg,
    fontWeight: '800',
    marginBottom: 4,
  },
  discountContent: {
    ...typography.bodyMd,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  discountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.xs,
  },
  discountPrice: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  claimBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: radius.chip,
  },
  claimBtnText: {
    color: '#ffffff',
    ...typography.labelSm,
    fontWeight: '700',
    fontSize: 11,
  },
  emptyBox: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyBoxText: {
    ...typography.bodyMd,
    textAlign: 'center',
    fontSize: 13,
  },
  resetPrefBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.chip,
    marginTop: spacing.xs,
  },
  resetPrefText: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  eventIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  eventInfo: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  categoryTag: {
    ...typography.labelSm,
    fontSize: 10,
    fontWeight: '800',
  },
  eventPrice: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
  },
  eventName: {
    ...typography.bodyMd,
    fontWeight: '700',
  },
  eventMeta: {
    ...typography.labelMd,
    fontSize: 11,
  },
  bookBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.chip,
  },
  bookBtnText: {
    color: '#ffffff',
    ...typography.labelSm,
    fontWeight: '700',
  },
  annWidgetCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  annWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  annWidgetTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
    flex: 1,
  },
  annWidgetDesc: {
    ...typography.bodyMd,
    fontSize: 12,
  },
});
