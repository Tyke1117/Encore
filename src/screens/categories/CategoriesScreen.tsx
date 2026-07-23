import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

// --- DATA STRUCTURES & MOCK DATA ---

interface CategoryItem {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  count: number;
}

interface Event {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  rating: number;
  image: string;
}

const CATEGORY_ITEMS: CategoryItem[] = [
  { id: 'tech', label: 'Technology', icon: 'laptop', color: colors.tertiary, count: 28 },
  { id: 'hackathon', label: 'Hackathon', icon: 'code-braces', color: colors.primary, count: 12 },
  { id: 'workshop', label: 'Workshop', icon: 'hammer', color: colors.secondary, count: 19 },
  { id: 'music', label: 'Music', icon: 'music', color: '#ec4899', count: 34 },
  { id: 'business', label: 'Business', icon: 'briefcase', color: colors.outline, count: 15 },
  { id: 'sports', label: 'Sports', icon: 'trophy', color: '#10b981', count: 22 },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad-variant', color: '#6366f1', count: 18 },
  { id: 'cultural', label: 'Cultural', icon: 'theater', color: '#f59e0b', count: 14 },
  { id: 'festival', label: 'Festival', icon: 'party-popper', color: colors.primaryContainer, count: 25 },
  { id: 'college', label: 'College', icon: 'school', color: '#06b6d4', count: 30 },
];

const CATEGORY_EVENTS: Record<string, Event[]> = {
  tech: [
    {
      id: 'e-tech-1',
      title: 'DevOps & Cloud Summit 2026',
      category: 'Technology',
      location: 'Science Auditorium',
      date: 'Oct 28',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400',
    },
    {
      id: 'e-tech-2',
      title: 'Cybersecurity Masterclass',
      category: 'Technology',
      location: 'Main Campus Hall',
      date: 'Nov 04',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400',
    },
  ],
  hackathon: [
    {
      id: 'e-hack-1',
      title: 'EduTech 48H Hackathon',
      category: 'Hackathon',
      location: 'Design Studio B',
      date: 'Nov 12',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400',
    },
  ],
  music: [
    {
      id: 'e-music-1',
      title: 'Electro beats Live Stage',
      category: 'Music',
      location: 'Riverside Amphitheater',
      date: 'Oct 31',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400',
    },
  ],
  workshop: [
    {
      id: 'e-work-1',
      title: 'UX/UI Wireframing Seminar',
      category: 'Workshop',
      location: 'Design Hub Room 4',
      date: 'Nov 02',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400',
    },
  ],
};

// Fallback category events for general use
const GENERAL_EVENTS: Event[] = [
  {
    id: 'e-gen-1',
    title: 'Future Leadership Forum',
    category: 'Business',
    location: 'Grand Ballroom',
    date: 'Nov 18',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400',
  },
  {
    id: 'e-gen-2',
    title: 'Inter-College Robotics League',
    category: 'College',
    location: 'Sports Complex Arena',
    date: 'Nov 24',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400',
  },
];

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - spacing.margin * 2 - spacing.md) / 2;

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategoryId, setSelectedCategoryId] = useState('tech');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Record<string, boolean>>({});

  // --- ACTIONS ---
  const handleSearchPress = () => {
    Alert.alert('Search', 'Redirecting to Search Screen (Visual Only).');
  };

  const handleNotificationPress = () => {
    Alert.alert('Notifications', 'Announcements categories alerts.');
  };

  const toggleBookmark = (eventId: string) => {
    setBookmarkedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const activeCategory = CATEGORY_ITEMS.find((c) => c.id === selectedCategoryId) || CATEGORY_ITEMS[0];
  const activeEvents = CATEGORY_EVENTS[selectedCategoryId] || GENERAL_EVENTS;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.headerTitle}>Browse Categories</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSearchPress}>
            <Feather name="search" size={22} color={colors.onBackground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleNotificationPress}>
            <Feather name="bell" size={22} color={colors.onBackground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Trending Category Banner */}
        <TouchableOpacity
          style={styles.trendingBanner}
          onPress={() => setSelectedCategoryId('hackathon')}
          activeOpacity={0.9}
        >
          <View style={styles.trendingTag}>
            <MaterialCommunityIcons name="trending-up" size={14} color={colors.onPrimary} style={styles.bannerBadgeIcon} />
            <Text style={styles.trendingTagText}>TRENDING CATEGORY</Text>
          </View>
          <Text style={styles.trendingBannerTitle}>Hackathons & Build Challenges</Text>
          <Text style={styles.trendingBannerSubtitle}>
            12 new coding and design sprints added this week. Grab team slots now!
          </Text>
          <View style={styles.trendingBannerBottom}>
            <Text style={styles.exploreText}>Explore Category</Text>
            <Feather name="arrow-right" size={16} color={colors.onBackground} />
          </View>
        </TouchableOpacity>

        {/* Featured Categories (Horizontal Scroll) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {CATEGORY_ITEMS.slice(0, 4).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.featuredCard,
                  { backgroundColor: category.color + '15', borderColor: category.color + '40' },
                  selectedCategoryId === category.id && styles.featuredCardSelected,
                ]}
                onPress={() => setSelectedCategoryId(category.id)}
              >
                <View style={[styles.featuredIconBox, { backgroundColor: category.color }]}>
                  <MaterialCommunityIcons name={category.icon} size={20} color={colors.onPrimary} />
                </View>
                <Text style={styles.featuredLabel}>{category.label}</Text>
                <Text style={styles.featuredCount}>{category.count} Events</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Grid (All Categories) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <View style={styles.gridContainer}>
            {CATEGORY_ITEMS.map((category) => {
              const isSelected = selectedCategoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.gridItemCard,
                    isSelected && styles.gridItemCardSelected,
                  ]}
                  onPress={() => setSelectedCategoryId(category.id)}
                >
                  <View style={styles.gridItemRow}>
                    <View style={[styles.gridIconCircle, { backgroundColor: category.color + '15' }]}>
                      <MaterialCommunityIcons name={category.icon} size={20} color={category.color} />
                    </View>
                    <View style={styles.gridTextContainer}>
                      <Text style={styles.gridLabel} numberOfLines={1}>{category.label}</Text>
                      <Text style={styles.gridCount}>{category.count} Listings</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Recommended & Nearby category chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity style={styles.recommendedChip} onPress={() => setSelectedCategoryId('tech')}>
              <Text style={styles.chipText}>Based on Tech Interests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recommendedChip} onPress={() => setSelectedCategoryId('music')}>
              <Text style={styles.chipText}>Nearby in Seattle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Events inside selected category */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Popular in {activeCategory.label}</Text>
            <TouchableOpacity onPress={() => Alert.alert('Explore', `Showing all ${activeCategory.label} events.`)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.eventsContainer}>
            {activeEvents.map((event) => {
              const isBookmarked = !!bookmarkedEvents[event.id];
              return (
                <View key={event.id} style={styles.eventCard}>
                  <Image source={{ uri: event.image }} style={styles.eventCardImage} />
                  <TouchableOpacity
                    style={styles.bookmarkButton}
                    onPress={() => toggleBookmark(event.id)}
                  >
                    <Ionicons
                      name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                      size={18}
                      color={isBookmarked ? colors.primaryContainer : colors.slate[900]}
                    />
                  </TouchableOpacity>

                  <View style={styles.eventCardBody}>
                    <View style={styles.eventCardHeader}>
                      <Text style={styles.eventCategory}>{event.category}</Text>
                      <View style={styles.ratingRow}>
                        <Ionicons name="star" size={12} color="#fbbf24" style={styles.starIcon} />
                        <Text style={styles.ratingText}>{event.rating}</Text>
                      </View>
                    </View>

                    <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>

                    <View style={styles.eventFooter}>
                      <View style={styles.metaRow}>
                        <Feather name="calendar" size={12} color={colors.onSurfaceVariant} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{event.date}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <Feather name="map-pin" size={12} color={colors.onSurfaceVariant} style={styles.metaIcon} />
                        <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// --- STYLE SHEET CREATION ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.outlineVariant,
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onBackground,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  scrollContainer: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  trendingBanner: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.level1,
  },
  trendingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.tag,
    marginBottom: spacing.sm,
  },
  bannerBadgeIcon: {
    marginRight: 4,
  },
  trendingTagText: {
    ...typography.labelSm,
    color: colors.onPrimary,
    fontWeight: '700',
    fontSize: 9,
  },
  trendingBannerTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: 4,
  },
  trendingBannerSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  trendingBannerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: colors.outlineVariant,
    paddingTop: spacing.sm,
  },
  exploreText: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '600',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  horizontalScroll: {
    paddingRight: spacing.margin,
    paddingVertical: 4,
  },
  featuredCard: {
    width: 120,
    padding: spacing.md,
    borderRadius: radius.card - 4,
    marginRight: spacing.sm,
    borderWidth: 1,
    alignItems: 'center',
    ...shadows.level1,
  },
  featuredCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  featuredIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featuredLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  featuredCount: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItemCard: {
    width: GRID_ITEM_WIDTH,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 6,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.sm,
    ...shadows.level1,
  },
  gridItemCardSelected: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  gridItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  gridTextContainer: {
    flex: 1,
  },
  gridLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '700',
  },
  gridCount: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  recommendedChip: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip * 2,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  eventsContainer: {
    gap: spacing.md,
  },
  eventCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    ...shadows.level1,
  },
  eventCardImage: {
    width: '100%',
    height: 120,
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  eventCardBody: {
    padding: spacing.md,
  },
  eventCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventCategory: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 4,
  },
  ratingText: {
    ...typography.labelSm,
    color: colors.onSurface,
    fontWeight: '700',
  },
  eventTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: colors.outlineVariant,
    paddingTop: 8,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    maxWidth: width * 0.35,
  },
});
