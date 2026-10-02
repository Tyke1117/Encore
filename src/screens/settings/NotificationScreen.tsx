import React, { useState, useEffect } from 'react';
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
import { getCandidateNotifications, CandidateNotification } from '../../services/attendanceCertificateService';
import Logo from '../../components/Logo';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  type: 'reminder' | 'update' | 'alert' | 'certificate';
  read: boolean;
  certificateId?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: '🎉 Certificate Issued: Encore Hackathon 2026',
    body: 'Congratulations Alex Morgan! Your official Certificate of Participation has been issued (ID: CERT-1-CS-2026-01). Tap to view and download.',
    timestamp: 'Just now',
    type: 'certificate',
    read: false,
    certificateId: 'CERT-1-CS-2026-01',
  },
  {
    id: '2',
    title: 'Upcoming Hackathon starts in 1 hour!',
    body: 'Get ready for Encore Hackathon 2026. The venue is CL-1 Auditorium.',
    timestamp: '1h ago',
    type: 'reminder',
    read: false,
  },
  {
    id: '3',
    title: 'Venue Change: Cultural Night',
    body: 'Cultural Night venue has been moved to the main Open Air Theatre.',
    timestamp: '3h ago',
    type: 'update',
    read: false,
  },
  {
    id: '4',
    title: 'Registration Confirmed',
    body: 'Bhavika Patel confirmed registration for AI/ML Workshop.',
    timestamp: 'Yesterday',
    type: 'reminder',
    read: true,
  },
];

export default function NotificationScreen({ navigation }: { navigation: any }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'certificate' | 'reminder' | 'update'>('all');
  const { colors, isDark } = useTheme();

  useEffect(() => {
    loadDynamicNotifications();
  }, []);

  const loadDynamicNotifications = async () => {
    const list = await getCandidateNotifications();
    if (list && list.length > 0) {
      const formatted: NotificationItem[] = list.map((item) => ({
        id: item.id,
        title: item.title,
        body: item.body,
        timestamp: item.date,
        type: 'certificate',
        read: item.read,
        certificateId: item.certificateId,
      }));
      setNotifications((prev) => [...formatted, ...prev]);
    }
  };

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
      case 'certificate':
        return 'ribbon-outline';
      case 'reminder':
        return 'time-outline';
      case 'update':
        return 'sparkles-outline';
      case 'alert':
        return 'alert-circle-outline';
      default:
        return 'notifications-outline';
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
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Notifications</Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAll}>
            <Text style={[styles.clearAllText, { color: colors.secondary }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      <View style={[styles.categoryContainer, { borderBottomColor: colors.outlineVariant }]}>
        {[
          { id: 'all', label: 'All' },
          { id: 'certificate', label: 'Certificates' },
          { id: 'reminder', label: 'Reminders' },
          { id: 'update', label: 'Updates' },
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={54} color={colors.outline} />
            <Text style={[styles.emptyTitle, { color: colors.onSurface }]}>No notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.onSurfaceVariant }]}>
              You're all caught up! New event updates and student certificates will appear here.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => toggleRead(item.id)}
            style={[
              styles.notificationCard,
              { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
              !item.read && { backgroundColor: colors.surfaceContainerLow, borderColor: colors.secondary },
              shadows.level1,
            ]}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.type === 'certificate' ? colors.primaryContainer : colors.secondaryContainer }]}>
              <Ionicons
                name={getIconName(item.type)}
                size={22}
                color={item.type === 'certificate' ? colors.primary : colors.secondary}
              />
            </View>

            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.onSurface }, !item.read && { fontWeight: '700' }]}>
                  {item.title}
                </Text>
                <Text style={[styles.timestamp, { color: colors.onSurfaceVariant }]}>
                  {item.timestamp}
                </Text>
              </View>

              <Text style={[styles.body, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                {item.body}
              </Text>

              {item.type === 'certificate' && (
                <View style={styles.certActionBadge}>
                  <Text style={[styles.certActionText, { color: colors.primary }]}>
                    📜 Official Certificate Issued • Tap to View
                  </Text>
                </View>
              )}
            </View>

            {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
          </TouchableOpacity>
        )}
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
  certActionBadge: {
    marginTop: spacing.xs,
  },
  certActionText: {
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
