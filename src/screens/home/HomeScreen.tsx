import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Alert,
  Animated,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';
import SkeletonLoader from '../../components/SkeletonLoader';


const { width } = Dimensions.get('window');

interface EventItem {
  id: string;
  name?: string;
  title?: string;
  category: 'music' | 'tech' | 'cultural' | 'sports' | string | string[];
  date?: string;
  time?: string;
  startAt?: any;
  venue?: string;
  price?: string;
  seatsLeft?: number;
  imageIcon?: string;
  imageUrl?: string;
  isExternal?: boolean;
  registrationUrl?: string;
  source?: string;
}

const getEventTitle = (event: EventItem) => event.name || event.title || 'Untitled Event';
const getEventVenue = (event: EventItem) => event.venue || 'Venue TBA';
const getEventPrice = (event: EventItem) => event.price || 'Free';
const getEventDate = (event: EventItem) => {
  if (event.date) return event.date;
  if (event.startAt) {
    if (typeof event.startAt.toDate === 'function') {
      return event.startAt.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    const d = new Date(event.startAt);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
  return 'Date TBA';
};

const eventsList: EventItem[] = [
  {
    id: '1',
    name: 'Encore Hackathon 2026',
    category: 'tech',
    date: '18 Jul 2026',
    time: '9:00 AM',
    venue: 'CL-1 Auditorium',
    price: 'Free',
    seatsLeft: 86,
    imageIcon: 'code-slash',
  },
  {
    id: '2',
    name: 'Cultural Night Gala',
    category: 'cultural',
    date: '22 Jul 2026',
    time: '6:00 PM',
    venue: 'Open Air Theatre',
    price: '₹200',
    seatsLeft: 40,
    imageIcon: 'musical-notes',
  },
  {
    id: '3',
    name: 'AI/ML Hands-on Workshop',
    category: 'tech',
    date: '25 Jul 2026',
    time: '10:00 AM',
    venue: 'Seminar Hall B',
    price: '₹500',
    seatsLeft: 104,
    imageIcon: 'analytics',
  },
  {
    id: '4',
    name: 'College Sports Meet',
    category: 'sports',
    date: '02 Aug 2026',
    time: '8:00 AM',
    venue: 'Main Ground',
    price: 'Free',
    seatsLeft: 15,
    imageIcon: 'trophy',
  },
  {
    id: '5',
    name: 'Acoustic Jam Session',
    category: 'music',
    date: '10 Aug 2026',
    time: '5:30 PM',
    venue: 'Student Lounge',
    price: '₹100',
    seatsLeft: 30,
    imageIcon: 'guitar',
  },
];

const AnimatedEventCard: React.FC<{
  event: EventItem;
  onPress: () => void;
  colors: any;
  shadows: any;
  index: number;
}> = ({ event, onPress, colors, shadows, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, event.id]);

  const title = getEventTitle(event);
  const venue = getEventVenue(event);
  const dateStr = getEventDate(event);
  const priceStr = getEventPrice(event);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], width: '100%' }}>
      <TouchableOpacity
        style={[styles.popularCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={[styles.popularIconBox, { backgroundColor: `${colors.secondary}12` }]}>
          {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={{ width: 28, height: 28, borderRadius: 6 }} resizeMode="cover" />
          ) : (
            <Ionicons name={(event.imageIcon || 'calendar-outline') as any} size={22} color={colors.secondary} />
          )}
        </View>
        <View style={styles.popularInfo}>
          <Text style={[styles.popularName, { color: colors.onSurface }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.popularMeta, { color: colors.onSurfaceVariant }]} numberOfLines={1}>{dateStr} · {venue}</Text>
          <Text style={[styles.popularPrice, { color: colors.tertiary }]}>{priceStr}</Text>
        </View>
        <TouchableOpacity 
          onPress={onPress} 
          activeOpacity={0.8}
          style={[styles.bookActionBtn, { backgroundColor: colors.secondary }]}
        >
          <Text style={styles.bookActionText}>Book</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  
  const [events, setEvents] = useState<EventItem[]>(eventsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFeedLoading, setIsFeedLoading] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, 'events'), limit(100));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as EventItem[];
            setEvents(fetched);
          }
        },
        (error) => {
          console.warn('Firestore events listener error:', error.message);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error attaching Firestore events listener:', e);
    }
  }, []);

  const handleCategorySelect = (categoryKey: string) => {
    setIsFeedLoading(true);
    setTimeout(() => {
      setSelectedCategory(categoryKey);
      setIsFeedLoading(false);
    }, 600);
  };


  const categories = [
    { key: 'all', label: 'All Events', icon: 'grid-outline' },
    { key: 'tech', label: 'Tech', icon: 'desktop-outline' },
    { key: 'cultural', label: 'Cultural', icon: 'sparkles-outline' },
    { key: 'music', label: 'Music', icon: 'musical-notes-outline' },
    { key: 'sports', label: 'Sports', icon: 'football-outline' },
  ];

  const filteredEvents = events.filter((event) => {
    const title = getEventTitle(event);
    const venue = getEventVenue(event);
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          venue.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = selectedCategory === 'all';
    if (!matchesCategory) {
      if (Array.isArray(event.category)) {
        matchesCategory = event.category.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()));
      } else if (typeof event.category === 'string') {
        matchesCategory = event.category.toLowerCase().includes(selectedCategory.toLowerCase());
      }
    }
    return matchesSearch && matchesCategory;
  });

  const handleBook = (event: EventItem) => {
    const title = getEventTitle(event);
    const price = getEventPrice(event);

    if (event.isExternal && event.registrationUrl) {
      Alert.alert(
        'External Event',
        `Book tickets for "${title}" on ${event.source === 'bookmyshow' ? 'BookMyShow' : 'Ticketmaster'}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Booking Page',
            onPress: () => {
              Linking.openURL(event.registrationUrl!).catch(() =>
                Alert.alert('Error', 'Could not open booking URL.')
              );
            },
          },
        ]
      );
      return;
    }

    Alert.alert(
      'Book Ticket',
      `Would you like to book a ticket for ${title}? (${price})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Booking',
          onPress: () => {
            Alert.alert('Booking Confirmed!', `You have booked a slot for ${title}. Check your Notifications tab for updates.`);
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
        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Encore</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileAvatarTouch} 
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.secondary, colors.tertiary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileAvatar}
          >
            <Text style={styles.avatarInitialsText}>{initials}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Text style={[styles.greetingText, { color: colors.onSurface }]}>
          Hi, {user?.name ? user.name.split(' ')[0] : 'Student'} 👋
        </Text>
        <Text style={[styles.subtitleText, { color: colors.onSurfaceVariant }]}>
          Find awesome student summits, hackathons, and concerts.
        </Text>

        {/* Search Input */}
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <Ionicons name="search-outline" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search events, venues..."
            placeholderTextColor={colors.outline}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories Carousel */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryPill,
                    { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                    isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                  ]}
                  onPress={() => handleCategorySelect(cat.key)}
                >
                  <Ionicons name={cat.icon as any} size={16} color={isSelected ? colors.secondary : colors.onSurfaceVariant} />
                  <Text style={[
                    styles.categoryLabel,
                    { color: colors.onSurfaceVariant },
                    isSelected && { color: colors.secondary, fontWeight: '700' },
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Trending Events */}
        {searchQuery === '' && selectedCategory === 'all' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Trending Events</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
              {events.slice(0, 5).map((event) => {
                const title = getEventTitle(event);
                const dateStr = getEventDate(event);
                const venueStr = getEventVenue(event);
                const priceStr = getEventPrice(event);

                return (
                  <TouchableOpacity 
                    key={event.id}
                    style={[styles.trendingCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level2]}
                    activeOpacity={0.9}
                    onPress={() => handleBook(event)}
                  >
                    <LinearGradient
                      colors={[colors.secondary, colors.tertiary, colors.primary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardGradientTop}
                    >
                      {event.imageUrl ? (
                        <Image source={{ uri: event.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : (
                        <Ionicons name={(event.imageIcon || 'sparkles-outline') as any} size={32} color="#ffffff" />
                      )}
                      <View style={styles.priceTag}>
                        <Text style={styles.priceTagText}>{priceStr}</Text>
                      </View>
                    </LinearGradient>
                    
                    <View style={styles.cardBottom}>
                      <Text style={[styles.cardTitle, { color: colors.onSurface }]} numberOfLines={1}>{title}</Text>
                      <View style={styles.cardMetaRow}>
                        <Ionicons name="calendar-outline" size={14} color={colors.onSurfaceVariant} />
                        <Text style={[styles.cardMetaText, { color: colors.onSurfaceVariant }]}>{dateStr}</Text>
                      </View>
                      <View style={styles.cardMetaRow}>
                        <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
                        <Text style={[styles.cardMetaText, { color: colors.onSurfaceVariant }]} numberOfLines={1}>{venueStr}</Text>
                      </View>
                      <View style={styles.cardProgressRow}>
                        <Text style={[styles.seatsText, { color: colors.tertiary }]}>{event.seatsLeft ? `${event.seatsLeft} spots left!` : 'Available'}</Text>
                        <Text style={[styles.bookBtnText, { color: colors.secondary }]}>Book Now →</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {/* Popular Events */}
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          {searchQuery || selectedCategory !== 'all' ? 'Search Results' : 'Popular Events'}
        </Text>
        <View style={styles.popularContainer}>
          {isFeedLoading ? (
            <>
              <SkeletonLoader />
              <SkeletonLoader />
              <SkeletonLoader />
            </>
          ) : (
            filteredEvents.map((event, index) => (
              <AnimatedEventCard
                key={event.id}
                event={event}
                index={index}
                onPress={() => handleBook(event)}
                colors={colors}
                shadows={shadows}
              />
            ))
          )}
          {!isFeedLoading && filteredEvents.length === 0 && (
            <View style={styles.noEventsContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={colors.outline} />
              <Text style={[styles.noEventsText, { color: colors.onSurfaceVariant }]}>No events found matching filters.</Text>
            </View>
          )}
        </View>
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  welcomeSub: {
    ...typography.labelSm,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: -2,
  },
  profileAvatarTouch: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  greetingText: {
    ...typography.headlineLgMobile,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitleText: {
    ...typography.bodyMd,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.input,
    borderWidth: 1,
    height: 48,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...typography.bodyMd,
  },
  categoriesSection: {
    marginBottom: spacing.lg,
  },
  categoriesScroll: {
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  categoryLabel: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: spacing.sm,
  },
  trendingScroll: {
    paddingBottom: spacing.sm,
    gap: 16,
    marginBottom: spacing.lg,
  },
  trendingCard: {
    width: width * 0.65,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardGradientTop: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  priceTag: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  priceTagText: {
    color: '#ffffff',
    ...typography.labelSm,
    fontWeight: '700',
  },
  cardBottom: {
    padding: spacing.md,
  },
  cardTitle: {
    ...typography.bodyLg,
    fontWeight: '800',
    marginBottom: 6,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  cardMetaText: {
    ...typography.labelMd,
    flex: 1,
  },
  cardProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.xs,
  },
  seatsText: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  bookBtnText: {
    ...typography.labelSm,
    fontWeight: '700',
  },
  popularContainer: {
    gap: spacing.sm,
  },
  popularCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: spacing.sm,
  },
  popularIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  popularInfo: {
    flex: 1,
  },
  popularName: {
    ...typography.bodyMd,
    fontWeight: '700',
  },
  popularMeta: {
    ...typography.labelMd,
  },
  popularPrice: {
    ...typography.labelSm,
    fontWeight: '700',
    marginTop: 2,
  },
  bookActionBtn: {
    borderRadius: radius.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  bookActionText: {
    color: '#ffffff',
    ...typography.labelSm,
    fontWeight: '700',
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  noEventsText: {
    ...typography.bodyMd,
  },
  avatarInitialsText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default HomeScreen;
