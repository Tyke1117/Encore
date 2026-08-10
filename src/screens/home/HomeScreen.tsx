import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

const { width } = Dimensions.get('window');

interface EventItem {
  id: string;
  name: string;
  category: 'music' | 'tech' | 'cultural' | 'sports';
  date: string;
  time: string;
  venue: string;
  price: string;
  seatsLeft: number;
  imageIcon: string;
}

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

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  // const { currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All Events', icon: 'grid-outline' },
    { key: 'tech', label: 'Tech', icon: 'desktop-outline' },
    { key: 'cultural', label: 'Cultural', icon: 'sparkles-outline' },
    { key: 'music', label: 'Music', icon: 'musical-notes-outline' },
    { key: 'sports', label: 'Sports', icon: 'football-outline' },
  ];

  const filteredEvents = eventsList.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.venue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBook = (event: EventItem) => {
    Alert.alert(
      'Book Ticket',
      `Would you like to book a ticket for ${event.name}? (${event.price})`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Booking',
          onPress: () => {
            Alert.alert('Booking Confirmed!', `You have booked a slot for ${event.name}. Check your Notifications tab for updates.`);
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
            
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <Text style={[styles.greetingText, { color: colors.onSurface }]}>
          {/* Hi, {currentUser?.name ? currentUser.name.split(' ')[0] : 'User'} 👋 */}
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
                  onPress={() => setSelectedCategory(cat.key)}
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
              {eventsList.slice(0, 3).map((event) => (
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
                    <Ionicons name={event.imageIcon as any} size={32} color="#ffffff" />
                    <View style={styles.priceTag}>
                      <Text style={styles.priceTagText}>{event.price}</Text>
                    </View>
                  </LinearGradient>
                  
                  <View style={styles.cardBottom}>
                    <Text style={[styles.cardTitle, { color: colors.onSurface }]} numberOfLines={1}>{event.name}</Text>
                    <View style={styles.cardMetaRow}>
                      <Ionicons name="calendar-outline" size={14} color={colors.onSurfaceVariant} />
                      <Text style={[styles.cardMetaText, { color: colors.onSurfaceVariant }]}>{event.date}</Text>
                    </View>
                    <View style={styles.cardMetaRow}>
                      <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
                      <Text style={[styles.cardMetaText, { color: colors.onSurfaceVariant }]} numberOfLines={1}>{event.venue}</Text>
                    </View>
                    <View style={styles.cardProgressRow}>
                      <Text style={[styles.seatsText, { color: colors.tertiary }]}>{event.seatsLeft} spots left!</Text>
                      <Text style={[styles.bookBtnText, { color: colors.secondary }]}>Book Now →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Popular Events */}
        <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
          {searchQuery || selectedCategory !== 'all' ? 'Search Results' : 'Popular Events'}
        </Text>
        <View style={styles.popularContainer}>
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.popularCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}
              activeOpacity={0.8}
              onPress={() => handleBook(event)}
            >
              <View style={[styles.popularIconBox, { backgroundColor: `${colors.secondary}12` }]}>
                <Ionicons name={event.imageIcon as any} size={22} color={colors.secondary} />
              </View>
              <View style={styles.popularInfo}>
                <Text style={[styles.popularName, { color: colors.onSurface }]}>{event.name}</Text>
                <Text style={[styles.popularMeta, { color: colors.onSurfaceVariant }]}>{event.date} · {event.venue}</Text>
                <Text style={[styles.popularPrice, { color: colors.tertiary }]}>{event.price}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => handleBook(event)} 
                activeOpacity={0.8}
                style={[styles.bookActionBtn, { backgroundColor: colors.secondary }]}
              >
                <Text style={styles.bookActionText}>Book</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          {filteredEvents.length === 0 && (
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
// --- DATA STRUCTURES & MOCK DATA ---

interface Event {
  id: string;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  image?: string;
  rating?: number;
  distance?: string;
  attendees?: number;
  seats?: number;
  venue?: string;
}

interface Category {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'music', label: 'Music', icon: 'music' },
  { id: 'tech', label: 'Technology', icon: 'laptop' },
  { id: 'workshop', label: 'Workshop', icon: 'hammer' },
  { id: 'hackathon', label: 'Hackathon', icon: 'code-braces' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'festival', label: 'Festival', icon: 'party-popper' },
  { id: 'sports', label: 'Sports', icon: 'trophy' },
  { id: 'college', label: 'College', icon: 'school' },
];

const FEATURED_EVENT: Event = {
  id: 'feat-1',
  title: 'Symphony of Lights Music Festival',
  category: 'Music',
  location: 'Grand Arena, Downtown',
  date: 'Sat, Oct 24',
  time: '19:00 - 23:00',
  image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800',
};

const NEARBY_EVENTS: Event[] = [
  {
    id: 'near-1',
    title: 'Future of AI Conference 2026',
    category: 'Technology',
    location: 'Tech Hub Center',
    distance: '1.2 km',
    rating: 4.9,
    date: 'Oct 28',
    time: '10:00 - 17:00',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600',
  },
  {
    id: 'near-2',
    title: 'Culinary Arts Workshop',
    category: 'Workshop',
    location: 'The Cooking Studio',
    distance: '3.5 km',
    rating: 4.7,
    date: 'Oct 25',
    time: '11:00 - 14:00',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600',
  },
  {
    id: 'near-3',
    title: 'Urban Soundscape Concert',
    category: 'Music',
    location: 'Riverside Park',
    distance: '4.8 km',
    rating: 4.8,
    date: 'Oct 30',
    time: '20:00 - 22:30',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600',
  },
];

const TRENDING_EVENTS: Event[] = [
  {
    id: 'trend-1',
    title: 'Neon Nights Electro Festival',
    category: 'Music',
    location: 'Metro Dome',
    date: 'Nov 08',
    time: '21:00 - 03:00',
    attendees: 1420,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600',
  },
  {
    id: 'trend-2',
    title: 'Global Start-Up Summit',
    category: 'Business',
    location: 'Convention Center',
    date: 'Nov 15',
    time: '09:00 - 18:00',
    attendees: 850,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=600',
  },
];

const UPCOMING_EVENTS: Event[] = [
  {
    id: 'up-1',
    title: 'CodeSprint Hackathon 2026',
    category: 'Hackathon',
    location: 'Innovation Lab',
    venue: 'Lab 3, Science Block',
    date: 'Nov 02',
    time: '09:00',
    seats: 45,
  },
  {
    id: 'up-2',
    title: 'Creative Design Masterclass',
    category: 'Workshop',
    location: 'Arts Academy',
    venue: 'Studio 5, Ground Floor',
    date: 'Nov 05',
    time: '14:00',
    seats: 12,
  },
];

const RECOMMENDED_EVENTS: Event[] = [
  {
    id: 'rec-1',
    title: 'Mindfulness & Yoga Session',
    category: 'Sports',
    location: 'Zen Garden',
    date: 'Oct 29',
    time: '07:30 - 09:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600',
  },
  {
    id: 'rec-2',
    title: 'College Robotics Exhibition',
    category: 'College',
    location: 'Engineering Auditorium',
    date: 'Nov 12',
    time: '10:00 - 15:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600',
  },
];

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.72;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // --- INTERACTION STATES ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedEvents, setBookmarkedEvents] = useState<Record<string, boolean>>({
    'feat-1': true, // Pre-bookmark featured event
  });
  const [registeredEvents, setRegisteredEvents] = useState<Record<string, boolean>>({});
  const [notificationsCount, setNotificationsCount] = useState(3);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // --- ACTIONS ---
  const toggleBookmark = (eventId: string) => {
    setBookmarkedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleRegister = (eventId: string, title: string) => {
    if (registeredEvents[eventId]) {
      // Unregister
      setRegisteredEvents((prev) => ({
        ...prev,
        [eventId]: false,
      }));
    } else {
      // Register
      setRegisteredEvents((prev) => ({
        ...prev,
        [eventId]: true,
      }));
      Alert.alert(
        'Registration Success',
        `You have successfully registered for:\n"${title}"`
      );
    }
  };

  const clearNotifications = () => {
    if (notificationsCount > 0) {
      setNotificationsCount(0);
      Alert.alert('Notifications', 'Cleared all notifications.');
    } else {
      Alert.alert('Notifications', 'You have no new notifications.');
    }
  };

  const filteredNearby = NEARBY_EVENTS.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // --- SECTION RENDERERS ---

  // 1. Welcome Header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
          }}
          style={styles.avatar}
        />
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Good morning,</Text>
          <Text style={styles.userNameText}>Sakshi Bechara</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={clearNotifications}
        activeOpacity={0.7}
      >
        <Feather name="bell" size={22} color={colors.onBackground} />
        {notificationsCount > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{notificationsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  // 2. Search Bar
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBarWrapper}>
        <Feather
          name="search"
          size={18}
          color={colors.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search events, festivals..."
          placeholderTextColor={colors.onSurfaceVariant + '80'}
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x" size={16} color={colors.onSurfaceVariant} style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => Alert.alert('Filters', 'Advanced filter menu opened.')}
      >
        <Ionicons name="options-outline" size={20} color={colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );

  // 3. AI Recommendation Banner
  const renderAIBanner = () => (
    <TouchableOpacity
      style={styles.aiBannerCard}
      onPress={() => setIsAssistantOpen(true)}
      activeOpacity={0.9}
    >
      <View style={styles.aiBannerGradientOverlay} />
      <View style={styles.aiBannerContent}>
        <View style={styles.aiIconWrapper}>
          <MaterialCommunityIcons name="auto-fix" size={20} color={colors.onSecondaryContainer} />
        </View>
        <View style={styles.aiBannerTextContainer}>
          <Text style={styles.aiBannerTag}>AI RECOMMENDATION</Text>
          <Text style={styles.aiBannerTitle}>
            AI found 5 events you'll love this weekend.
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color={colors.onSecondaryContainer} />
      </View>
      <View style={styles.aiBannerAccentLine} />
    </TouchableOpacity>
  );

  // 5. Categories
  const renderCategories = () => (
    <View style={styles.categoriesSection}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={category.icon}
                size={16}
                color={isSelected ? colors.onPrimary : colors.onSurfaceVariant}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.categoryTextSelected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  // 4. Featured Event
  const renderFeaturedEvent = () => {
    const isBookmarked = !!bookmarkedEvents[FEATURED_EVENT.id];
    const isRegistered = !!registeredEvents[FEATURED_EVENT.id];
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Featured Event</Text>
        <View style={styles.featuredCard}>
          <Image
            source={{ uri: FEATURED_EVENT.image }}
            style={styles.featuredImage}
          />
          <View style={styles.featuredGradient} />

          {/* Bookmark & Category Floating Elements */}
          <View style={styles.featuredFloatingTop}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{FEATURED_EVENT.category}</Text>
            </View>
            <TouchableOpacity
              style={styles.bookmarkBadge}
              onPress={() => toggleBookmark(FEATURED_EVENT.id)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={isBookmarked ? colors.primaryContainer : colors.slate[900]}
              />
            </TouchableOpacity>
          </View>

          {/* Featured Content Area */}
          <View style={styles.featuredCardBottom}>
            <View style={styles.featuredInfoBlock}>
              <View style={styles.featuredDateBadge}>
                <Ionicons name="calendar-outline" size={14} color={colors.onPrimary} style={styles.miniIcon} />
                <Text style={styles.featuredDateText}>{FEATURED_EVENT.date}</Text>
              </View>
              <Text style={styles.featuredTitle}>{FEATURED_EVENT.title}</Text>
              <View style={styles.featuredLocationBlock}>
                <Ionicons name="location-outline" size={14} color={colors.slate[300]} style={styles.miniIcon} />
                <Text style={styles.featuredLocationText}>{FEATURED_EVENT.location}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.featuredRegisterButton,
                isRegistered && styles.registerButtonActive,
              ]}
              onPress={() => handleRegister(FEATURED_EVENT.id, FEATURED_EVENT.title)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.featuredRegisterButtonText,
                  isRegistered && styles.registerButtonTextActive,
                ]}
              >
                {isRegistered ? 'Registered ✓' : 'Register Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // 6. Nearby Events
  const renderNearbyEvents = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Nearby Events</Text>
        <TouchableOpacity onPress={() => Alert.alert('Nearby', 'Showing all nearby events.')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {filteredNearby.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={32} color={colors.outline} style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No matching events found nearby.</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalListContainer}
        >
          {filteredNearby.map((event) => {
            const isBookmarked = !!bookmarkedEvents[event.id];
            return (
              <View key={event.id} style={styles.nearbyCard}>
                <Image source={{ uri: event.image }} style={styles.nearbyCardImage} />
                <TouchableOpacity
                  style={styles.nearbyBookmarkButton}
                  onPress={() => toggleBookmark(event.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={16}
                    color={isBookmarked ? colors.primaryContainer : colors.slate[900]}
                  />
                </TouchableOpacity>

                <View style={styles.nearbyCardBody}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardCategoryText}>{event.category}</Text>
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={12} color="#fbbf24" style={styles.miniIcon} />
                      <Text style={styles.ratingText}>{event.rating}</Text>
                    </View>
                  </View>

                  <Text style={styles.nearbyCardTitle} numberOfLines={1}>
                    {event.title}
                  </Text>

                  <Text style={styles.nearbyCardDate}>{event.date}</Text>

                  <View style={styles.cardFooterRow}>
                    <View style={styles.cardFooterInfo}>
                      <Ionicons name="location" size={12} color={colors.onSurfaceVariant} style={styles.miniIcon} />
                      <Text style={styles.cardFooterText} numberOfLines={1}>
                        {event.location}
                      </Text>
                    </View>
                    <Text style={styles.distanceText}>{event.distance}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  // 7. Trending Events
  const renderTrendingEvents = () => (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Trending Events</Text>
        <TouchableOpacity onPress={() => Alert.alert('Trending', 'Showing all trending events.')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalListContainer}
      >
        {TRENDING_EVENTS.map((event, index) => {
          const isBookmarked = !!bookmarkedEvents[event.id];
          return (
            <View key={event.id} style={styles.trendingCard}>
              <Image source={{ uri: event.image }} style={styles.trendingCardImage} />

              <View style={styles.trendingBadgeContainer}>
                <Text style={styles.trendingBadgeText}>Trending #{index + 1}</Text>
              </View>

              <TouchableOpacity
                style={styles.trendingBookmarkButton}
                onPress={() => toggleBookmark(event.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={16}
                  color={isBookmarked ? colors.primaryContainer : colors.slate[900]}
                />
              </TouchableOpacity>

              <View style={styles.trendingCardBody}>
                <Text style={styles.trendingCardCategory}>{event.category}</Text>
                <Text style={styles.trendingCardTitle} numberOfLines={1}>
                  {event.title}
                </Text>

                <View style={styles.trendingFooter}>
                  <View style={styles.attendeesContainer}>
                    <Ionicons name="people" size={14} color={colors.primary} style={styles.miniIcon} />
                    <Text style={styles.attendeesText}>{event.attendees?.toLocaleString()} going</Text>
                  </View>
                  <Text style={styles.trendingCardDate}>{event.date}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  // 8. Upcoming Events
  const renderUpcomingEvents = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
      <View style={styles.upcomingList}>
        {UPCOMING_EVENTS.map((event) => {
          const isRegistered = !!registeredEvents[event.id];
          return (
            <View key={event.id} style={styles.upcomingCard}>
              {/* Left Date indicator */}
              <View style={styles.upcomingDateBox}>
                <Text style={styles.upcomingDateMonth}>
                  {event.date.split(' ')[0].toUpperCase()}
                </Text>
                <Text style={styles.upcomingDateDay}>
                  {event.date.split(' ')[1]}
                </Text>
              </View>

              {/* Main Info */}
              <View style={styles.upcomingInfoContainer}>
                <View style={styles.upcomingCategoryRow}>
                  <Text style={styles.upcomingCategoryText}>{event.category}</Text>
                  <View style={styles.upcomingSeatsBadge}>
                    <Text style={styles.upcomingSeatsText}>
                      {event.seats} seats left
                    </Text>
                  </View>
                </View>

                <Text style={styles.upcomingCardTitle} numberOfLines={1}>
                  {event.title}
                </Text>

                <View style={styles.upcomingMetaRow}>
                  <Feather name="clock" size={12} color={colors.onSurfaceVariant} style={styles.miniIcon} />
                  <Text style={styles.upcomingMetaText}>{event.time}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Ionicons name="location-outline" size={12} color={colors.onSurfaceVariant} style={styles.miniIcon} />
                  <Text style={styles.upcomingMetaText} numberOfLines={1}>
                    {event.venue}
                  </Text>
                </View>
              </View>

              {/* Register Action */}
              <TouchableOpacity
                style={[
                  styles.upcomingRegisterBtn,
                  isRegistered && styles.registerButtonActive,
                ]}
                onPress={() => handleRegister(event.id, event.title)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.upcomingRegisterBtnText,
                    isRegistered && styles.registerButtonTextActive,
                  ]}
                >
                  {isRegistered ? '✓' : 'RSVP'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );

  // 9. Recommended Events
  const renderRecommendedEvents = () => (
    <View style={[styles.sectionContainer, styles.bottomSpacing]}>
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <View style={styles.recommendedGrid}>
        {RECOMMENDED_EVENTS.map((event) => {
          const isBookmarked = !!bookmarkedEvents[event.id];
          return (
            <View key={event.id} style={styles.recommendedCard}>
              <Image source={{ uri: event.image }} style={styles.recommendedImage} />
              <TouchableOpacity
                style={styles.recommendedBookmarkBtn}
                onPress={() => toggleBookmark(event.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={14}
                  color={isBookmarked ? colors.primaryContainer : colors.slate[900]}
                />
              </TouchableOpacity>

              <View style={styles.recommendedBody}>
                <View style={styles.recommendedTopRow}>
                  <Text style={styles.recommendedCategory}>{event.category}</Text>
                  <View style={styles.recommendedRating}>
                    <Ionicons name="star" size={10} color="#fbbf24" style={styles.miniIcon} />
                    <Text style={styles.recommendedRatingText}>{event.rating}</Text>
                  </View>
                </View>
                <Text style={styles.recommendedTitle} numberOfLines={1}>
                  {event.title}
                </Text>
                <Text style={styles.recommendedLocation} numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  // 10. Floating AI Assistant Modal Screen & Button
  const renderFloatingAIAssistant = () => (
    <>
      <TouchableOpacity
        style={styles.floatingAIButton}
        onPress={() => setIsAssistantOpen(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="auto-fix" size={24} color={colors.onSecondaryContainer} />
      </TouchableOpacity>

      <Modal
        visible={isAssistantOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAssistantOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBgDismiss}
            activeOpacity={1}
            onPress={() => setIsAssistantOpen(false)}
          />
          <View style={[styles.modalSheetContainer, { paddingBottom: insets.bottom + spacing.md }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <View style={styles.modalHeaderIconContainer}>
                  <MaterialCommunityIcons name="auto-fix" size={22} color={colors.onSecondaryContainer} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Encore AI Assistant</Text>
                  <Text style={styles.modalSubtitle}>Personalized Event Recommender</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setIsAssistantOpen(false)}
              >
                <Feather name="x" size={20} color={colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalScrollBody} showsVerticalScrollIndicator={false}>
              {/* Welcome Message */}
              <View style={styles.assistantBubble}>
                <Text style={styles.assistantBubbleText}>
                  Hi Sakshi! Based on your interest in <Text style={styles.accentTextBold}>electronic music</Text>, <Text style={styles.accentTextBold}>technology workshops</Text>, and <Text style={styles.accentTextBold}>hackathons</Text>, here are 5 events tailored for you this weekend:
                </Text>
              </View>

              {/* Recommended items lists */}
              <View style={styles.recommendationList}>
                <TouchableOpacity
                  style={styles.recommendationItem}
                  onPress={() => {
                    setIsAssistantOpen(false);
                    Alert.alert('AI Recommendation', 'Opening "Symphony of Lights Music Festival" details.');
                  }}
                >
                  <View style={styles.recItemHeader}>
                    <Text style={styles.recItemCategory}>MUSIC • 98% Match</Text>
                    <Text style={styles.recItemDate}>Sat, Oct 24</Text>
                  </View>
                  <Text style={styles.recItemTitle}>Symphony of Lights Music Festival</Text>
                  <Text style={styles.recItemReason}>Matches your passion for EDM and live festivals.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.recommendationItem}
                  onPress={() => {
                    setIsAssistantOpen(false);
                    Alert.alert('AI Recommendation', 'Opening "Future of AI Conference 2026" details.');
                  }}
                >
                  <View style={styles.recItemHeader}>
                    <Text style={styles.recItemCategory}>TECH • 95% Match</Text>
                    <Text style={styles.recItemDate}>Oct 28</Text>
                  </View>
                  <Text style={styles.recItemTitle}>Future of AI Conference 2026</Text>
                  <Text style={styles.recItemReason}>Includes deep dives into Neural Networks and Agentic systems.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.recommendationItem}
                  onPress={() => {
                    setIsAssistantOpen(false);
                    Alert.alert('AI Recommendation', 'Opening "CodeSprint Hackathon" details.');
                  }}
                >
                  <View style={styles.recItemHeader}>
                    <Text style={styles.recItemCategory}>HACKATHON • 90% Match</Text>
                    <Text style={styles.recItemDate}>Nov 02</Text>
                  </View>
                  <Text style={styles.recItemTitle}>CodeSprint Hackathon 2026</Text>
                  <Text style={styles.recItemReason}>48-hour build challenge. Great for team projects.</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.assistantPromptOffer}>
                <Text style={styles.offerText}>Would you like me to find events on another date or in a different city?</Text>
                <View style={styles.chipOptionContainer}>
                  <TouchableOpacity
                    style={styles.optionChip}
                    onPress={() => Alert.alert('AI Search', 'Finding events next weekend...')}
                  >
                    <Text style={styles.optionChipText}>Next weekend</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.optionChip}
                    onPress={() => Alert.alert('AI Search', 'Finding outdoor workshops...')}
                  >
                    <Text style={styles.optionChipText}>Outdoor events</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Input Bar */}
            <View style={styles.modalInputRow}>
              <TextInput
                placeholder="Ask AI assistant..."
                placeholderTextColor={colors.onSurfaceVariant + '80'}
                style={styles.modalTextInput}
              />
              <TouchableOpacity
                style={styles.modalSendBtn}
                onPress={() => Alert.alert('AI Chat', 'AI Agent is analysis processing...')}
              >
                <Feather name="send" size={16} color={colors.onSecondaryContainer} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + spacing.sm },
        ]}
      >
        {renderHeader()}
        {renderSearchBar()}
        {renderAIBanner()}
        {renderCategories()}
        {renderFeaturedEvent()}
        {renderNearbyEvents()}
        {renderTrendingEvents()}
        {renderUpcomingEvents()}
        {renderRecommendedEvents()}
      </ScrollView>
      {renderFloatingAIAssistant()}
    </View>
  );
}

// --- STYLE SHEET CREATION ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.xxl + 40, // Space for floating button
  },
  bottomSpacing: {
    marginBottom: spacing.xl,
  },

  // 1. Welcome Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.outlineVariant,
  },
  greetingContainer: {
    justifyContent: 'center',
  },
  greetingText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
  userNameText: {
    ...typography.headlineMd,
    color: colors.onSurface,
    lineHeight: 24,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primaryContainer,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  notificationBadgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
    color: colors.onPrimaryContainer,
  },

  // 2. Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    height: 50,
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
    ...typography.bodyMd,
    color: colors.onSurface,
    height: '100%',
  },
  clearIcon: {
    padding: 4,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: radius.input,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    ...shadows.interactive,
  },

  // 3. AI Recommendation Banner
  aiBannerCard: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
    ...shadows.level2,
  },
  aiBannerGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    opacity: 0.05,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.onSecondaryContainer + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  aiBannerTextContainer: {
    flex: 1,
  },
  aiBannerTag: {
    ...typography.labelSm,
    color: colors.onSecondaryContainer,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  aiBannerTitle: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSecondaryContainer,
    lineHeight: 22,
  },
  aiBannerAccentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.secondary,
  },

  // 5. Categories
  categoriesSection: {
    marginHorizontal: -spacing.margin,
    marginBottom: spacing.lg,
  },
  categoriesList: {
    paddingHorizontal: spacing.margin,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip * 2.5,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    marginRight: spacing.xs,
  },
  categoryText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  categoryTextSelected: {
    color: colors.onPrimary,
    fontWeight: '600',
  },

  // 4. Featured Event
  sectionContainer: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.headlineMd,
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
  featuredCard: {
    height: 250,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
    ...shadows.level2,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  featuredFloatingTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.tag,
  },
  categoryBadgeText: {
    ...typography.labelSm,
    color: colors.surfaceContainerLowest,
    fontWeight: '600',
  },
  bookmarkBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  featuredCardBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  featuredInfoBlock: {
    flex: 1,
    marginRight: spacing.md,
  },
  featuredDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featuredDateText: {
    ...typography.labelSm,
    color: colors.primaryContainer,
    fontWeight: '700',
  },
  featuredTitle: {
    ...typography.headlineMd,
    fontSize: 19,
    color: colors.surfaceContainerLowest,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredLocationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredLocationText: {
    ...typography.labelMd,
    color: colors.slate[300],
  },
  featuredRegisterButton: {
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.interactive,
  },
  featuredRegisterButtonText: {
    ...typography.labelMd,
    color: colors.onPrimaryContainer,
    fontWeight: '700',
  },

  // 6. Nearby Events
  horizontalListContainer: {
    paddingLeft: 2,
    paddingRight: spacing.margin,
  },
  nearbyCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    ...shadows.level1,
  },
  nearbyCardImage: {
    width: '100%',
    height: 120,
  },
  nearbyBookmarkButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  nearbyCardBody: {
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardCategoryText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...typography.labelSm,
    color: colors.onSurface,
    fontWeight: '600',
    marginLeft: 2,
  },
  nearbyCardTitle: {
    ...typography.bodyLg,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
  },
  nearbyCardDate: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: colors.outlineVariant,
    paddingTop: 8,
  },
  cardFooterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.xs,
  },
  cardFooterText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  distanceText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },

  // 7. Trending Events
  trendingCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    ...shadows.level2,
  },
  trendingCardImage: {
    width: '100%',
    height: 130,
  },
  trendingBookmarkButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  trendingBadgeContainer: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.tag,
  },
  trendingBadgeText: {
    ...typography.labelSm,
    fontSize: 10,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  trendingCardBody: {
    padding: spacing.md,
  },
  trendingCardCategory: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  trendingCardTitle: {
    ...typography.bodyLg,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 6,
  },
  trendingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeesText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  trendingCardDate: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },

  // 8. Upcoming Events
  upcomingList: {
    gap: spacing.sm,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 2,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  upcomingDateBox: {
    backgroundColor: colors.surfaceContainerLow,
    width: 50,
    height: 60,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  upcomingDateMonth: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.primary,
    fontWeight: '700',
  },
  upcomingDateDay: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    fontWeight: '700',
  },
  upcomingInfoContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  upcomingCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  upcomingCategoryText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  upcomingSeatsBadge: {
    backgroundColor: colors.primaryContainer + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  upcomingSeatsText: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  upcomingCardTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
  },
  upcomingMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingMetaText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    maxWidth: 90,
  },
  metaDot: {
    marginHorizontal: 4,
    color: colors.onSurfaceVariant,
    fontSize: 8,
  },
  upcomingRegisterBtn: {
    paddingHorizontal: spacing.md,
    height: 38,
    borderRadius: radius.button,
    borderWidth: 1.5,
    borderColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingRegisterBtnText: {
    ...typography.labelMd,
    color: colors.primaryContainer,
    fontWeight: '700',
  },

  // 9. Recommended Events
  recommendedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  recommendedCard: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 2,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    overflow: 'hidden',
    ...shadows.level1,
  },
  recommendedImage: {
    width: '100%',
    height: 100,
  },
  recommendedBookmarkBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  recommendedBody: {
    padding: spacing.sm,
  },
  recommendedTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  recommendedCategory: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  recommendedRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedRatingText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurface,
    fontWeight: '600',
    marginLeft: 2,
  },
  recommendedTitle: {
    ...typography.bodyMd,
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  recommendedLocation: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },

  // 10. Floating AI Assistant
  floatingAIButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondaryContainer,
    ...shadows.interactive,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBgDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheetContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.card + 6,
    borderTopRightRadius: radius.card + 6,
    maxHeight: '80%',
    minHeight: '50%',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.interactive,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.outlineVariant,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryContainer + '20',
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
});

export default HomeScreen;
  modalTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
    color: colors.onSurface,
    lineHeight: 20,
  },
  modalSubtitle: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontSize: 11,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollBody: {
    padding: spacing.margin,
  },
  assistantBubble: {
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.md,
    borderRadius: radius.card - 4,
    borderTopLeftRadius: 4,
    marginBottom: spacing.md,
    borderWidth: 0.5,
    borderColor: colors.outlineVariant,
  },
  assistantBubbleText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    lineHeight: 20,
  },
  accentTextBold: {
    fontWeight: '700',
    color: colors.secondary,
  },
  recommendationList: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  recommendationItem: {
    backgroundColor: colors.surfaceContainerLowest,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  recItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recItemCategory: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '700',
  },
  recItemDate: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  recItemTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
  },
  recItemReason: {
    ...typography.labelMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  assistantPromptOffer: {
    marginBottom: spacing.xl,
  },
  offerText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  chipOptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  optionChip: {
    backgroundColor: colors.surfaceContainerLow,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip * 2,
    borderWidth: 0.5,
    borderColor: colors.outline,
  },
  optionChipText: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '500',
  },
  modalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.outlineVariant,
  },
  modalTextInput: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    height: 44,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    color: colors.onSurface,
    ...typography.bodyMd,
  },
  modalSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    ...shadows.interactive,
  },

  // Active / Interacted states modifiers
  registerButtonActive: {
    backgroundColor: colors.slate[100],
    borderColor: colors.slate[300],
    borderWidth: 1,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonTextActive: {
    color: colors.slate[500],
  },
  emptyContainer: {
    paddingVertical: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  miniIcon: {
    marginRight: 4,
  },
});
