import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../components/Logo';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';
import {
  DynamicNotification,
  getDynamicNotifications,
  markNotificationAsRead,
  clearAllNotifications,
  triggerRegularNotificationCheck,
} from '../../services/notificationService';

export default function NotificationScreen({ navigation }: { navigation: any }) {
  const [notifications, setNotifications] = useState<DynamicNotification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'certificate' | 'reminder' | 'update' | 'discount'
  >('all');
  const [refreshing, setRefreshing] = useState(false);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    loadNotifications();

    // Trigger regular dynamic check on load to simulate live user notifications
    triggerRegularNotificationCheck().then(() => loadNotifications());

    // Setup periodic polling interval for dynamic notifications
    const interval = setInterval(async () => {
      await triggerRegularNotificationCheck();
      await loadNotifications();
    }, 15000); // Check every 15 seconds for regular live notifications

    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    const list = await getDynamicNotifications();
    setNotifications(list);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await triggerRegularNotificationCheck();
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (item: DynamicNotification) => {
    await markNotificationAsRead(item.id);
    await loadNotifications();

    if (item.type === 'certificate' && item.certificateId) {
      navigation.navigate('CertificatePreviewScreen', { certificateId: item.certificateId });
    }
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((notif) => {
    return selectedCategory === 'all' || notif.type === selectedCategory;
  });

  const getIconName = (type: DynamicNotification['type']) => {
    switch (type) {
      case 'certificate':
        return 'ribbon-outline';
      case 'reminder':
        return 'time-outline';
      case 'discount':
        return 'pricetag-outline';
      case 'update':
        return 'sparkles-outline';
      case 'alert':
      default:
        return 'notifications-outline';
    }
  };

  const getIconColors = (type: DynamicNotification['type']) => {
    switch (type) {
      case 'certificate':
        return { bg: colors.primaryContainer, color: colors.primary };
      case 'discount':
        return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'reminder':
        return { bg: '#fff3e0', color: '#e65100' };
      case 'update':
      default:
        return { bg: colors.secondaryContainer, color: colors.secondary };
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header with Logo */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
          <Logo size="sm" />
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Live Notifications</Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll}>
            <Text style={[styles.clearAllText, { color: colors.secondary }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      <View style={[styles.categoryContainer, { borderBottomColor: colors.outlineVariant }]}>
        {[
          { id: 'all', label: 'All' },
          { id: 'discount', label: 'Discounts' },
          { id: 'reminder', label: 'Reminders' },
          { id: 'update', label: 'Updates' },
          { id: 'certificate', label: 'Certificates' },
        ].map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.categoryTab,
                { borderColor: colors.outlineVariant },
                isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
              ]}
              onPress={() => setSelectedCategory(tab.id as any)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  { color: colors.onSurfaceVariant },
                  isSelected && { color: colors.secondary, fontWeight: '700' },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.secondary]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={54} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              You're all caught up! New dynamic event alerts, announcements, and discounts will arrive regularly.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const iconTheme = getIconColors(item.type);

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleNotificationPress(item)}
              style={[
                styles.notificationCard,
                { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                !item.read && { backgroundColor: colors.surfaceContainerLow, borderColor: colors.secondary },
                shadows.level1,
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: iconTheme.bg }]}>
                <Ionicons name={getIconName(item.type)} size={20} color={iconTheme.color} />
              </View>

              <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                  <Text
                    style={[styles.title, { color: colors.onSurface }, !item.read && { fontWeight: '700' }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text style={[styles.timestamp, { color: colors.onSurfaceVariant }]}>{item.timestamp}</Text>
                </View>

                <Text style={[styles.body, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                  {item.body}
                </Text>

                {item.type === 'certificate' && (
                  <View style={styles.actionBadge}>
                    <Text style={[styles.actionBadgeText, { color: colors.primary }]}>
                      📜 Official Certificate Issued • Tap to View
                    </Text>
                  </View>
                )}

                {item.type === 'discount' && (
                  <View style={styles.actionBadge}>
                    <Text style={[styles.actionBadgeText, { color: '#2e7d32' }]}>
                      🏷️ Exclusive Ticket Offer • Tap for details
                    </Text>
                  </View>
                )}
              </View>

              {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.secondary }]} />}
            </TouchableOpacity>
          );
        }}
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
  clearAllText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.xs,
  },
  categoryTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTabText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'flex-start',
    position: 'relative',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    ...typography.bodyLg,
    fontSize: 14,
    flex: 1,
    paddingRight: spacing.xs,
  },
  timestamp: {
    ...typography.labelSm,
    fontSize: 11,
  },
  body: {
    ...typography.bodyMd,
    fontSize: 13,
    lineHeight: 18,
  },
  actionBadge: {
    marginTop: spacing.xs,
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: radius.full,
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
});
