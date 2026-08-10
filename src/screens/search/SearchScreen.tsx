import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
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

interface Event {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  rating: number;
  image: string;
}

const SEARCH_RESULTS: Event[] = [
  {
    id: 's-1',
    title: 'Design Systems Hackathon',
    category: 'Hackathon',
    location: 'Silicon Lab, Phase 1',
    date: 'Oct 30, 2026',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400',
  },
  {
    id: 's-2',
    title: 'Sunset Acoustic Sessions',
    category: 'Music',
    location: 'The Sound Garden',
    date: 'Nov 02, 2026',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400',
  },
  {
    id: 's-3',
    title: 'React Native Deep Dive Workshop',
    category: 'Workshop',
    location: 'Digital Center Hall B',
    date: 'Nov 05, 2026',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400',
  },
  {
    id: 's-4',
    title: 'AI Product Strategy Summit',
    category: 'Business',
    location: 'Metropolitan Hotel',
    date: 'Nov 12, 2026',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400',
  },
  {
    id: 's-5',
    title: 'Youth Tech Festival 2026',
    category: 'Festival',
    location: 'State University Arena',
    date: 'Nov 20, 2026',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400',
  },
];

const RECENT_SEARCHES = ['Hackathon', 'Music Night', 'Workshop', 'AI Summit', 'Tech Fest'];
const POPULAR_SEARCHES = ['Design', 'Concert', 'Startup', 'Sports', 'Outdoor', 'Coding', 'Art'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Record<string, boolean>>({});
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const [notificationsCount, setNotificationsCount] = useState(2);

  // --- ACTIONS ---
  const handleVoiceSearch = () => {
    Alert.alert('Voice Search', 'Listening for keywords...', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Simulate "Hackathon"', onPress: () => setSearchQuery('Hackathon') },
    ]);
  };

  const handleFilterPress = () => {
    Alert.alert('Filter', 'Filter options modal opened visual placeholder.');
  };

  const handleRegister = (eventId: string, title: string) => {
    if (registeredEvents[eventId]) {
      setRegisteredEvents((prev) => ({ ...prev, [eventId]: false }));
    } else {
      setRegisteredEvents((prev) => ({ ...prev, [eventId]: true }));
      Alert.alert('Registration Success', `You have registered for:\n"${title}"`);
    }
  };

  const toggleBookmark = (eventId: string) => {
    setBookmarkedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const handleNotificationPress = () => {
    setNotificationsCount(0);
    Alert.alert('Notifications', 'Cleared search alerts.');
  };

  // --- FILTER LOGIC ---
  const filteredResults = SEARCH_RESULTS.filter((event) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return false;
    return (
      event.title.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      {/* 1. Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => Alert.alert('Navigation', 'Back button pressed (Visual Only).')}
        >
          <Feather name="arrow-left" size={24} color={colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Events</Text>
        <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
          <Feather name="bell" size={22} color={colors.onBackground} />
          {notificationsCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* 2. Large Search Bar */}
        <View style={styles.searchBarRow}>
          <View style={styles.searchBarContainer}>
            <Feather name="search" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search events, workshops, hackathons..."
              placeholderTextColor={colors.onSurfaceVariant + '80'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Feather name="x" size={16} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleVoiceSearch} style={styles.micButton}>
              <Feather name="mic" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {/* 5. Filter Button */}
          <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
            <Ionicons name="options-outline" size={20} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>

        {searchQuery.trim().length === 0 ? (
          // Default State (Recent and Popular)
          <View style={styles.defaultStateContainer}>
            {/* 3. Recent Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentList}
              >
                {RECENT_SEARCHES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.recentChip}
                    onPress={() => setSearchQuery(item)}
                  >
                    <Feather name="clock" size={12} color={colors.onSurfaceVariant} style={styles.chipIcon} />
                    <Text style={styles.recentText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* 4. Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Tags</Text>
              <View style={styles.popularContainer}>
                {POPULAR_SEARCHES.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={styles.popularChip}
                    onPress={() => setSearchQuery(tag)}
                  >
                    <Text style={styles.popularText}>#{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 7. Empty Search State */}
            <View style={styles.emptySearchContainer}>
              <View style={styles.emptyIconCircle}>
                <Feather name="search" size={40} color={colors.primary} />
              </View>
              <Text style={styles.emptySearchHeading}>Discover amazing experiences</Text>
              <Text style={styles.emptySearchSubtext}>
                Start searching for workshops, music festivals, coding hackathons, and more.
              </Text>
            </View>
          </View>
        ) : (
          // 6. Search Results State
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCountText}>
                {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found for "{searchQuery}"
              </Text>
            </View>

            {filteredResults.length === 0 ? (
              // No Results Empty State
              <View style={styles.noResultsContainer}>
                <Feather name="alert-circle" size={48} color={colors.outline} style={styles.noResultsIcon} />
                <Text style={styles.noResultsText}>No events match your search.</Text>
                <Text style={styles.noResultsSubtext}>
                  Try checking your spelling or looking up a different keyword.
                </Text>
              </View>
            ) : (
              filteredResults.map((event) => {
                const isBookmarked = !!bookmarkedEvents[event.id];
                const isRegistered = !!registeredEvents[event.id];
                return (
                  <View key={event.id} style={styles.resultCard}>
                    <Image source={{ uri: event.image }} style={styles.cardImage} />
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

                    <View style={styles.cardBody}>
                      <View style={styles.cardHeaderRow}>
                        <View style={styles.categoryBadge}>
                          <Text style={styles.categoryBadgeText}>{event.category}</Text>
                        </View>
                        <View style={styles.ratingRow}>
                          <Ionicons name="star" size={14} color="#fbbf24" style={styles.starIcon} />
                          <Text style={styles.ratingText}>{event.rating}</Text>
                        </View>
                      </View>

                      <Text style={styles.cardTitle}>{event.title}</Text>

                      <View style={styles.metaRow}>
                        <Feather name="calendar" size={13} color={colors.onSurfaceVariant} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{event.date}</Text>
                      </View>

                      <View style={styles.metaRow}>
                        <Feather name="map-pin" size={13} color={colors.onSurfaceVariant} style={styles.metaIcon} />
                        <Text style={styles.metaText}>{event.location}</Text>
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
              })
            )}
          </View>
        )}
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onBackground,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 2,
    backgroundColor: colors.primaryContainer,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
    color: colors.onPrimaryContainer,
  },
  scrollContainer: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  searchBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    height: 52,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
    height: '100%',
  },
  clearButton: {
    padding: spacing.xs,
  },
  micButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: radius.input,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    ...shadows.interactive,
  },
  defaultStateContainer: {
    gap: spacing.lg,
  },
  section: {
    marginHorizontal: -spacing.margin,
    paddingHorizontal: spacing.margin,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  recentList: {
    paddingRight: spacing.margin,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip * 2.5,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipIcon: {
    marginRight: 6,
  },
  recentText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '500',
  },
  popularContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  popularChip: {
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip * 2,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  popularText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '600',
  },
  emptySearchContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
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
  emptySearchHeading: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySearchSubtext: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsContainer: {
    gap: spacing.md,
  },
  resultsHeader: {
    marginBottom: spacing.xs,
  },
  resultsCountText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    ...shadows.level1,
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  bookmarkButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  cardBody: {
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primaryContainer + '15',
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    borderRadius: radius.tag,
  },
  categoryBadgeText: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
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
  cardTitle: {
    ...typography.headlineMd,
    fontSize: 18,
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
    height: 44,
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
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  noResultsIcon: {
    marginBottom: spacing.md,
  },
  noResultsText: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  noResultsSubtext: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
