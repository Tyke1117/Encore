import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';
import {
  Announcement,
  getAnnouncements,
  addAnnouncement,
} from '../../services/announcementService';

export default function AnnouncementsScreen({ navigation }: { navigation: any }) {
  const { colors, isDark } = useTheme();
  const { role } = useAuth();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  
  // Admin role override toggle so the user can easily test both Admin and Attendee views
  const [isAdminMode, setIsAdminMode] = useState<boolean>(role === 'organizer');

  // Add Announcement Modal State (Admin Only)
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [annType, setAnnType] = useState<
    'event_added' | 'event_modified' | 'ticket_price' | 'discount' | 'admin_broadcast'
  >('discount');
  const [eventName, setEventName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [isImportant, setIsImportant] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    loadAnnouncementsData();
  }, []);

  const loadAnnouncementsData = async () => {
    setIsLoading(true);
    const data = await getAnnouncements();
    setAnnouncements(data);
    setIsLoading(false);
  };

  const filteredAnnouncements = announcements.filter((ann) => {
    if (filterType === 'all') return true;
    return ann.type === filterType;
  });

  const handleCreateAnnouncement = async () => {
    if (!title.trim() || !content.trim()) {
      return Alert.alert('Error', 'Please provide a title and announcement message.');
    }

    setIsPublishing(true);
    try {
      const created = await addAnnouncement({
        title: title.trim(),
        content: content.trim(),
        type: annType,
        eventName: eventName.trim() || undefined,
        ticketPrice: ticketPrice.trim() || undefined,
        originalPrice: originalPrice.trim() || undefined,
        discountPercentage: discountPercentage ? Number(discountPercentage) : undefined,
        eventDate: eventDate.trim() || undefined,
        venue: venue.trim() || undefined,
        authorName: 'Encore Admin',
        important: isImportant,
      });

      setAnnouncements((prev) => [created, ...prev]);
      setModalVisible(false);
      resetForm();
      Alert.alert(
        'Announcement Broadcasted! 📢',
        'Your announcement has been published to all users and dynamic notifications have been triggered.'
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to publish announcement.');
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setAnnType('discount');
    setEventName('');
    setTicketPrice('');
    setOriginalPrice('');
    setDiscountPercentage('');
    setEventDate('');
    setVenue('');
    setIsImportant(true);
  };

  const getBadgeStyle = (type: Announcement['type']) => {
    switch (type) {
      case 'discount':
        return { label: 'Ticket Discount', bg: '#e8f5e9', text: '#2e7d32', icon: 'pricetag-outline' };
      case 'event_added':
        return { label: 'New Event', bg: '#e3f2fd', text: '#1565c0', icon: 'sparkles-outline' };
      case 'event_modified':
        return { label: 'Event Update', bg: '#fff3e0', text: '#e65100', icon: 'time-outline' };
      case 'ticket_price':
        return { label: 'Ticket Price', bg: '#f3e5f5', text: '#6a1b9a', icon: 'card-outline' };
      case 'admin_broadcast':
      default:
        return { label: 'Admin Broadcast', bg: '#ffebee', text: '#c62828', icon: 'megaphone-outline' };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Top Navigation Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Logo size="sm" />
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Announcements</Text>
        </View>

        {/* Mode Toggle for Admin testing */}
        <TouchableOpacity
          style={[
            styles.roleBadge,
            { backgroundColor: isAdminMode ? colors.secondaryContainer : colors.surfaceContainerHigh },
          ]}
          onPress={() => setIsAdminMode(!isAdminMode)}
        >
          <Ionicons
            name={isAdminMode ? 'shield-checkmark' : 'person'}
            size={14}
            color={isAdminMode ? colors.secondary : colors.onSurfaceVariant}
          />
          <Text style={[styles.roleBadgeText, { color: isAdminMode ? colors.secondary : colors.onSurfaceVariant }]}>
            {isAdminMode ? 'Admin' : 'Attendee'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs & Admin Post Action */}
      <View style={[styles.filterBar, { borderBottomColor: colors.outlineVariant }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {[
            { id: 'all', label: 'All' },
            { id: 'discount', label: 'Discounts' },
            { id: 'event_added', label: 'New Events' },
            { id: 'event_modified', label: 'Updates' },
            { id: 'ticket_price', label: 'Ticket Info' },
          ].map((tab) => {
            const isSelected = filterType === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.filterTab,
                  { borderColor: colors.outlineVariant },
                  isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                ]}
                onPress={() => setFilterType(tab.id)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    { color: colors.onSurfaceVariant },
                    isSelected && { color: colors.secondary, fontWeight: '700' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Admin Notice Banner / Action Button */}
      {isAdminMode ? (
        <View style={[styles.adminBanner, { backgroundColor: colors.secondaryContainer }]}>
          <View style={styles.adminBannerTextWrap}>
            <Ionicons name="shield-checkmark" size={18} color={colors.secondary} />
            <Text style={[styles.adminBannerText, { color: colors.secondary }]}>
              Admin Mode Active: You can publish official announcements.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.postBtn, { backgroundColor: colors.secondary }]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.postBtnText}>Post Announcement</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.readOnlyBanner, { backgroundColor: colors.surfaceContainerLow }]}>
          <Ionicons name="information-circle-outline" size={18} color={colors.onSurfaceVariant} />
          <Text style={[styles.readOnlyBannerText, { color: colors.onSurfaceVariant }]}>
            Official Encore Announcements Feed • View Only Mode
          </Text>
        </View>
      )}

      {/* Announcement List */}
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={[styles.loaderText, { color: colors.onSurfaceVariant }]}>Loading announcements...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredAnnouncements}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="megaphone-outline" size={54} color={colors.outline} />
              <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No announcements</Text>
              <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
                New event details, ticket prices, and discount updates will appear here!
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const badge = getBadgeStyle(item.type);
            const timeAgo = new Date(item.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                  item.important && { borderColor: colors.secondary, borderWidth: 1.5 },
                  shadows.level1,
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeaderRow}>
                  <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon as any} size={14} color={badge.text} />
                    <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
                  </View>
                  <Text style={[styles.cardTime, { color: colors.onSurfaceVariant }]}>{timeAgo}</Text>
                </View>

                {/* Title */}
                <Text style={[styles.cardTitle, { color: colors.onSurface }]}>{item.title}</Text>

                {/* Content */}
                <Text style={[styles.cardContent, { color: colors.onSurfaceVariant }]}>{item.content}</Text>

                {/* Event Details Grid (Ticket Price, Discount, Dates, Venue) */}
                {(item.eventName || item.ticketPrice || item.eventDate || item.discountPercentage) && (
                  <View style={[styles.eventDetailsBox, { backgroundColor: colors.surfaceContainerLow }]}>
                    {item.eventName && (
                      <View style={styles.metaDetailRow}>
                        <Ionicons name="calendar-outline" size={14} color={colors.secondary} />
                        <Text style={[styles.metaDetailText, { color: colors.onSurface }]}>
                          <Text style={{ fontWeight: '700' }}>Event:</Text> {item.eventName}
                        </Text>
                      </View>
                    )}

                    <View style={styles.gridTwoCol}>
                      {item.ticketPrice && (
                        <View style={styles.metaDetailRow}>
                          <Ionicons name="card-outline" size={14} color={colors.tertiary} />
                          <Text style={[styles.metaDetailText, { color: colors.onSurface }]}>
                            <Text style={{ fontWeight: '700' }}>Price:</Text> {item.ticketPrice}
                            {item.originalPrice ? ` (Was ${item.originalPrice})` : ''}
                          </Text>
                        </View>
                      )}

                      {item.discountPercentage && item.discountPercentage > 0 && (
                        <View style={styles.metaDetailRow}>
                          <Ionicons name="pricetag-outline" size={14} color="#2e7d32" />
                          <Text style={[styles.metaDetailText, { color: '#2e7d32', fontWeight: '700' }]}>
                            Discount: {item.discountPercentage}% OFF
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.gridTwoCol}>
                      {item.eventDate && (
                        <View style={styles.metaDetailRow}>
                          <Ionicons name="time-outline" size={14} color={colors.onSurfaceVariant} />
                          <Text style={[styles.metaDetailText, { color: colors.onSurfaceVariant }]}>
                            {item.eventDate}
                          </Text>
                        </View>
                      )}

                      {item.venue && (
                        <View style={styles.metaDetailRow}>
                          <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
                          <Text style={[styles.metaDetailText, { color: colors.onSurfaceVariant }]}>
                            {item.venue}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Author Footer */}
                <View style={styles.cardFooter}>
                  <View style={styles.authorTag}>
                    <Ionicons name="checkmark-circle" size={14} color={colors.secondary} />
                    <Text style={[styles.authorText, { color: colors.secondary }]}>
                      Posted by {item.authorName} ({item.authorRole.toUpperCase()})
                    </Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Admin Add Announcement Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.outlineVariant }]}>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Publish Announcement</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.label, { color: colors.onSurface }]}>Announcement Title *</Text>
              <TextInput
                style={[styles.input, { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
                placeholder="e.g. Early Bird Discount: 30% Off Tech Summit"
                placeholderTextColor={colors.outline}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={[styles.label, { color: colors.onSurface }]}>Category / Type</Text>
              <View style={styles.typeSelectorRow}>
                {[
                  { id: 'discount', label: 'Ticket Discount' },
                  { id: 'event_added', label: 'New Event' },
                  { id: 'event_modified', label: 'Event Update' },
                  { id: 'ticket_price', label: 'Price Change' },
                  { id: 'admin_broadcast', label: 'Broadcast' },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[
                      styles.typeChip,
                      { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                      annType === t.id && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                    ]}
                    onPress={() => setAnnType(t.id as any)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        { color: colors.onSurfaceVariant },
                        annType === t.id && { color: colors.secondary, fontWeight: '700' },
                      ]}
                    >
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={[styles.label, { color: colors.onSurface }]}>Announcement Content / Message *</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface },
                ]}
                placeholder="Detail the announcement, discount details, or schedule change..."
                placeholderTextColor={colors.outline}
                multiline
                numberOfLines={4}
                value={content}
                onChangeText={setContent}
              />

              <Text style={[styles.label, { color: colors.onSurface }]}>Event Name (Optional)</Text>
              <TextInput
                style={[styles.input, { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
                placeholder="e.g. Encore Hackathon 2026"
                placeholderTextColor={colors.outline}
                value={eventName}
                onChangeText={setEventName}
              />

              <View style={styles.rowTwoInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.onSurface }]}>Ticket Price</Text>
                  <TextInput
                    style={[styles.input, { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
                    placeholder="e.g. ₹200 or Free"
                    placeholderTextColor={colors.outline}
                    value={ticketPrice}
                    onChangeText={setTicketPrice}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.onSurface }]}>Discount %</Text>
                  <TextInput
                    style={[styles.input, { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
                    placeholder="e.g. 25"
                    keyboardType="numeric"
                    placeholderTextColor={colors.outline}
                    value={discountPercentage}
                    onChangeText={setDiscountPercentage}
                  />
                </View>
              </View>

              <View style={styles.rowTwoInputs}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.onSurface }]}>Event Date</Text>
                  <TextInput
                    style={[styles.input, { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
                    placeholder="e.g. 25 Jul 2026"
                    placeholderTextColor={colors.outline}
                    value={eventDate}
                    onChangeText={setEventDate}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.onSurface }]}>Venue</Text>
                  <TextInput
                    style={[styles.input, { color: colors.onSurface, borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}
                    placeholder="e.g. Seminar Hall B"
                    placeholderTextColor={colors.outline}
                    value={venue}
                    onChangeText={setVenue}
                  />
                </View>
              </View>

              <View style={styles.switchRow}>
                <Text style={[styles.label, { color: colors.onSurface, marginBottom: 0 }]}>
                  Mark as High Priority / Important
                </Text>
                <Switch
                  value={isImportant}
                  onValueChange={setIsImportant}
                  trackColor={{ false: colors.outlineVariant, true: colors.secondary }}
                  thumbColor="#ffffff"
                />
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { borderTopColor: colors.outlineVariant }]}>
              <TouchableOpacity
                style={[styles.publishBtn, { backgroundColor: colors.secondary }]}
                onPress={handleCreateAnnouncement}
                disabled={isPublishing}
              >
                {isPublishing ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.publishBtnText}>Publish Broadcast</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  roleBadgeText: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
  },
  filterBar: {
    borderBottomWidth: 1,
    paddingVertical: spacing.xs,
  },
  filterScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  filterTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  filterTabText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  adminBannerTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: spacing.xs,
  },
  adminBannerText: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.chip,
    gap: 4,
  },
  postBtnText: {
    color: '#ffffff',
    ...typography.labelSm,
    fontWeight: '700',
  },
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  readOnlyBannerText: {
    ...typography.labelSm,
    fontSize: 11,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: spacing.sm,
    ...typography.bodyMd,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.chip,
    gap: 4,
  },
  badgeText: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '700',
  },
  cardTime: {
    ...typography.labelSm,
    fontSize: 11,
  },
  cardTitle: {
    ...typography.bodyLg,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardContent: {
    ...typography.bodyMd,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  eventDetailsBox: {
    padding: spacing.sm,
    borderRadius: radius.md,
    gap: 6,
    marginBottom: spacing.sm,
  },
  metaDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDetailText: {
    ...typography.labelSm,
    fontSize: 12,
  },
  gridTwoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing.xs,
  },
  authorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorText: {
    ...typography.labelSm,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    gap: spacing.sm,
  },
  emptyTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  emptySubtitle: {
    ...typography.bodyMd,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...typography.headlineMd,
    fontWeight: '800',
  },
  modalScroll: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  label: {
    ...typography.labelMd,
    fontWeight: '700',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 48,
    ...typography.bodyMd,
  },
  textArea: {
    height: 90,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  typeChipText: {
    ...typography.labelSm,
    fontSize: 11,
  },
  rowTwoInputs: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  modalFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  publishBtn: {
    height: 50,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishBtnText: {
    color: '#ffffff',
    ...typography.bodyLg,
    fontWeight: '700',
  },
});
