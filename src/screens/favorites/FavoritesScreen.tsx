import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
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

interface Event {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  image: string;
  rating?: number;
}

const INITIAL_FAVORITES: Event[] = [
  {
    id: 'fav-1',
    title: 'Symphony of Lights Music Festival',
    category: 'Music',
    location: 'Grand Arena, Downtown',
    date: 'Sat, Oct 24, 2026',
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400',
  },
  {
    id: 'fav-2',
    title: 'Future of AI Conference 2026',
    category: 'Technology',
    location: 'Tech Hub Center',
    date: 'Oct 28, 2026',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400',
  },
];

const RECOMMENDED_EVENTS: Event[] = [
  {
    id: 'rec-1',
    title: 'Culinary Arts Masterclass',
    category: 'Workshop',
    location: 'The Cooking Studio',
    date: 'Oct 25, 2026',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400',
    rating: 4.8,
  },
  {
    id: 'rec-2',
    title: 'React Native Speed Coding',
    category: 'Hackathon',
    location: 'Innovation Lab Room 2',
    date: 'Nov 02, 2026',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400',
    rating: 4.9,
  },
];

const RECENTLY_VIEWED: Event[] = [
  {
    id: 'recent-1',
    title: 'Global Start-Up Summit',
    category: 'Business',
    location: 'Convention Center',
    date: 'Nov 15, 2026',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400',
  },
  {
    id: 'recent-2',
    title: 'Neon Nights Electro Festival',
    category: 'Music',
    location: 'Metro Dome',
    date: 'Nov 08, 2026',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400',
  },
];

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const [favorites, setFavorites] = useState<Event[]>(INITIAL_FAVORITES);
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});

  // --- ACTIONS ---
  const handleRemoveBookmark = (eventId: string, title: string) => {
    Alert.alert(
      'Remove Bookmark',
      `Are you sure you want to remove:\n"${title}" from your bookmarks?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setFavorites((prev) => prev.filter((item) => item.id !== eventId));
          },
        },
      ]
    );
  };

  const handleRegister = (eventId: string, title: string) => {
    if (registeredEvents[eventId]) {
      setRegisteredEvents((prev) => ({ ...prev, [eventId]: false }));
    } else {
      setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
      Alert.alert('Registration Success', `You have registered for:\n"${title}"`);
    }
  };

  const resetMockData = () => {
    setFavorites(INITIAL_FAVORITES);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Search', 'Search bookmarks pressed.')}
          >
            <Feather name="search" size={22} color={colors.onBackground} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Filter', 'Filter bookmarks pressed.')}
          >
            <Ionicons name="options-outline" size={22} color={colors.onBackground} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          // 3. Empty State
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="bookmark-outline" size={44} color={colors.primary} />
            </View>
            <Text style={styles.emptyHeading}>No saved events yet</Text>
            <Text style={styles.emptySubtext}>
              Explore events and tap the bookmark icon to save them here for later.
            </Text>
            <TouchableOpacity style={styles.resetButton} onPress={resetMockData}>
              <Text style={styles.resetButtonText}>Restore Demo Favorites</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Favorites Event Cards List
          <View style={styles.favoritesSection}>
            {favorites.map((event) => {
              const isRegistered = !!registeredEvents[event.id];
              return (
                <View key={event.id} style={styles.favoriteCard}>
                  <Image source={{ uri: event.image }} style={styles.cardImage} />

                  <TouchableOpacity
                    style={styles.removeBookmarkBtn}
                    onPress={() => handleRemoveBookmark(event.id, event.title)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>

                  <View style={styles.cardBody}>
                    <View style={styles.categoryRow}>
                      <Text style={styles.categoryText}>{event.category}</Text>
                    </View>

                    <Text style={styles.cardTitle}>{event.title}</Text>

                    <View style={styles.metaRow}>
                      <Feather name="calendar" size={13} color={colors.onSurfaceVariant} style={styles.metaIcon} />
                      <Text style={styles.metaText}>{event.date}</Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Feather name="map-pin" size={13} color={colors.onSurfaceVariant} style={styles.metaIcon} />
                      <Text style={styles.metaText} numberOfLines={1}>{event.location}</Text>
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity
                      style={[
                        styles.registerButton,
                        isRegistered && styles.registerButtonActive,
                      ]}
                      onPress={() => handleRegister(event.id, event.title)}
                    >
                      <Text
                        style={[
                          styles.registerButtonText,
                          isRegistered && styles.registerButtonTextActive,
                        ]}
                      >
                        {isRegistered ? 'Registered ✓' : 'Register Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Recommended Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Events</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {RECOMMENDED_EVENTS.map((event) => (
              <View key={event.id} style={styles.recommendedCard}>
                <Image source={{ uri: event.image }} style={styles.recImage} />
                <View style={styles.recBody}>
                  <View style={styles.recHeader}>
                    <Text style={styles.recCategory}>{event.category}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={10} color="#fbbf24" style={styles.starIcon} />
                      <Text style={styles.ratingText}>{event.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.recTitle} numberOfLines={1}>{event.title}</Text>
                  <Text style={styles.recLocation} numberOfLines={1}>{event.location}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Recently Viewed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Viewed</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {RECENTLY_VIEWED.map((event) => (
              <View key={event.id} style={styles.recentlyViewedCard}>
                <Image source={{ uri: event.image }} style={styles.rvImage} />
                <View style={styles.rvBody}>
                  <Text style={styles.rvCategory}>{event.category}</Text>
                  <Text style={styles.rvTitle} numberOfLines={1}>{event.title}</Text>
                  <Text style={styles.rvDate}>{event.date.split(',')[0]}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
  favoritesSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  favoriteCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    ...shadows.level1,
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  removeBookmarkBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  cardBody: {
    padding: spacing.md,
  },
  categoryRow: {
    marginBottom: 4,
  },
  categoryText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  cardTitle: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaIcon: {
    marginRight: spacing.sm,
  },
  metaText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.outlineVariant,
    marginVertical: spacing.md,
  },
  registerButton: {
    backgroundColor: colors.primaryContainer,
    height: 42,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.interactive,
  },
  registerButtonActive: {
    backgroundColor: colors.slate[100],
    borderColor: colors.slate[300],
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    ...typography.labelMd,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },
  registerButtonTextActive: {
    color: colors.slate[500],
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyHeading: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  resetButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    ...shadows.interactive,
  },
  resetButtonText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  horizontalScroll: {
    paddingRight: spacing.margin,
    paddingVertical: 2,
  },
  recommendedCard: {
    width: 200,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 2,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.level1,
  },
  recImage: {
    width: '100%',
    height: 100,
  },
  recBody: {
    padding: spacing.sm,
  },
  recHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  recCategory: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurface,
    fontWeight: '700',
  },
  recTitle: {
    ...typography.bodyMd,
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  recLocation: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  recentlyViewedCard: {
    width: 160,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 4,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginRight: spacing.md,
    overflow: 'hidden',
    ...shadows.level1,
  },
  rvImage: {
    width: '100%',
    height: 80,
  },
  rvBody: {
    padding: spacing.sm,
  },
  rvCategory: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  rvTitle: {
    ...typography.bodyMd,
    fontSize: 12,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  rvDate: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.onSurfaceVariant,
  },
});
