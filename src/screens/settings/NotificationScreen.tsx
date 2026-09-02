import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'reminder' | 'update' | 'alert';
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Upcoming Hackathon starts in 1 hour!',
    body: 'Get ready for Encore Hackathon 2026. The venue is CL-1 Auditorium.',
    timestamp: '1h ago',
    type: 'reminder',
    read: false,
  },
  {
    id: '2',
    title: 'Venue Change: Cultural Night',
    body: 'Cultural Night venue has been moved to the main Open Air Theatre.',
    timestamp: '3h ago',
    type: 'update',
    read: false,
  },
  {
    id: '3',
    title: 'Registration Confirmed',
    body: 'Bhavika Patel confirmed registration for AI/ML Workshop.',
    timestamp: 'Yesterday',
    type: 'reminder',
    read: true,
  },
  {
    id: '4',
    title: 'Security Alert',
    body: 'Your account password was updated successfully.',
    timestamp: '2 days ago',
    type: 'alert',
    read: true,
  },
  {
    id: '5',
    title: 'New Feature Available',
    body: 'Check out the new AI Insights tab in your event dashboard!',
    timestamp: '5 days ago',
    type: 'update',
    read: true,
  },
];

export default function NotificationScreen({ navigation }: { navigation: any }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'reminder' | 'update' | 'alert'>('all');
  const { colors, isDark } = useTheme();

  const filteredNotifications = notifications.filter((notif) => {
    return selectedCategory === 'all' || notif.type === selectedCategory;
  });

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };


  const clearAll = () => {
    setNotifications([]);
  };

  const getIconName = (type: NotificationItem['type']) => {
    switch (type) {
      case 'reminder':
        return 'time-outline';
      case 'update':
        return 'sparkles-outline';
      case 'alert':
        return 'alert-circle-outline';
    }
  };

  const getIconColor = (type: NotificationItem['type']) => {
    switch (type) {
      case 'reminder':
        return colors.primary;
      case 'update':
        return colors.secondary;
      case 'alert':
        return colors.tertiary;
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const iconName = getIconName(item.type);
    const iconColor = getIconColor(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
          !item.read && [styles.unreadCard, { backgroundColor: colors.surfaceContainerLowest, borderColor: `${colors.tertiary}33` }],
          shadows.level1,
        ]}
        onPress={() => toggleRead(item.id)}
        activeOpacity={0.8}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}12` }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        <View style={styles.contentWrap}>
          <View style={styles.titleRow}>
            <Text 
              style={[
                styles.title, 
                { color: colors.onSurfaceVariant },
                !item.read && [styles.unreadTitle, { color: colors.onSurface }]
              ]} 
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!item.read && <View style={[styles.unreadBadge, { backgroundColor: colors.tertiary }]} />}
          </View>
          <Text style={[styles.body, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
            {item.body}
          </Text>
          <Text style={[styles.timestamp, { color: colors.onSurfaceVariant }]}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Premium Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Notifications</Text>
        {notifications.length > 0 ? (
          <TouchableOpacity style={styles.markAllButton} onPress={clearAll}>
            <Text style={[styles.markAllText, { color: colors.tertiary }]}>Clear All</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* Category Filter Chips */}
      <View style={[styles.categoryContainer, { borderBottomColor: colors.outlineVariant }]}>
        {(['all', 'reminder', 'update', 'alert'] as const).map((cat) => {
          const isActive = selectedCategory === cat;
          const label = cat === 'all' ? 'All' : cat === 'reminder' ? 'Reminders' : cat === 'update' ? 'Updates' : 'Alerts';
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryTab,
                { borderColor: colors.outlineVariant },
                isActive && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryTabText, { color: colors.onSurfaceVariant }, isActive && { color: colors.onPrimary }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceContainer }]}>
              <Ionicons name="notifications-off-outline" size={36} color={colors.onSurfaceVariant} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>All caught up!</Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>No new notifications at this time.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

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
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  markAllText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  listContainer: {
    padding: spacing.md,
    gap: spacing.sm,
    flexGrow: 1,
  },
  card: {
    flexDirection: 'row',
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  unreadCard: {
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  contentWrap: {
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
    fontWeight: '500',
    flex: 1,
    paddingRight: spacing.sm,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadBadge: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  body: {
    ...typography.bodyMd,
    lineHeight: 18,
    marginBottom: 6,
  },
  timestamp: {
    ...typography.labelSm,
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 100,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.bodyMd,
    textAlign: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    gap: spacing.sm,
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
});

