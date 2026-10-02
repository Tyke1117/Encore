import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/fonts';
import { shadows } from '../theme/shadows';
import {
  UserPreferences,
  getUserPreferences,
  saveUserPreferences,
} from '../services/userPreferencesService';

interface UserPreferencesModalProps {
  visible: boolean;
  userId?: string;
  onClose: () => void;
  onSaved?: (prefs: UserPreferences) => void;
}

export const CATEGORIES_OPTIONS = [
  { id: 'tech', label: 'Tech & AI', icon: 'desktop-outline' },
  { id: 'cultural', label: 'Cultural & Arts', icon: 'sparkles-outline' },
  { id: 'music', label: 'Music & Concerts', icon: 'musical-notes-outline' },
  { id: 'sports', label: 'Sports & Games', icon: 'football-outline' },
  { id: 'general', label: 'Workshops & General', icon: 'school-outline' },
];

export const FORMAT_OPTIONS = [
  { id: 'all', label: 'All Formats' },
  { id: 'in-person', label: 'In-Person' },
  { id: 'virtual', label: 'Virtual Only' },
];

export const PRICE_OPTIONS = [
  { label: 'Any Price', val: 5000 },
  { label: 'Under ₹500', val: 500 },
  { label: 'Free Events Only', val: 0 },
];

export default function UserPreferencesModal({
  visible,
  userId = 'demo-user-123',
  onClose,
  onSaved,
}: UserPreferencesModalProps) {
  const { colors } = useTheme();

  const [categories, setCategories] = useState<string[]>(['tech', 'cultural']);
  const [format, setFormat] = useState<'all' | 'in-person' | 'virtual'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [discountAlerts, setDiscountAlerts] = useState<boolean>(true);
  const [eventAlerts, setEventAlerts] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      loadPreferences();
    }
  }, [visible, userId]);

  const loadPreferences = async () => {
    const current = await getUserPreferences(userId);
    setCategories(current.categories || ['tech', 'cultural']);
    setFormat(current.eventFormat || 'all');
    setMaxPrice(current.maxPrice ?? 5000);
    setDiscountAlerts(current.enableDiscountAlerts ?? true);
    setEventAlerts(current.enableEventAlerts ?? true);
  };

  const toggleCategory = (catId: string) => {
    if (categories.includes(catId)) {
      if (categories.length === 1) return; // keep at least 1
      setCategories(categories.filter((c) => c !== catId));
    } else {
      setCategories([...categories, catId]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await saveUserPreferences(userId, {
        categories,
        eventFormat: format,
        maxPrice,
        enableDiscountAlerts: discountAlerts,
        enableEventAlerts: eventAlerts,
      });
      setIsSaving(false);
      if (onSaved) onSaved(updated);
      onClose();
    } catch (e) {
      console.error('Error saving preferences:', e);
      setIsSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, { borderBottomColor: colors.outlineVariant }]}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Customize Preferences</Text>
              <Text style={[styles.modalSubtitle, { color: colors.onSurfaceVariant }]}>
                Tailor your attendee dashboard & event alerts
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Preferred Categories */}
            <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>
              Favorite Categories
            </Text>
            <Text style={[styles.sectionSub, { color: colors.onSurfaceVariant }]}>
              Select topics you care about to see personalized event recommendations.
            </Text>
            <View style={styles.chipGrid}>
              {CATEGORIES_OPTIONS.map((cat) => {
                const isSelected = categories.includes(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.chip,
                      { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                      isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                    ]}
                    onPress={() => toggleCategory(cat.id)}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={16}
                      color={isSelected ? colors.secondary : colors.onSurfaceVariant}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        { color: colors.onSurfaceVariant },
                        isSelected && { color: colors.secondary, fontWeight: '700' },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Preferred Format */}
            <Text style={[styles.sectionHeading, { color: colors.onSurface, marginTop: spacing.md }]}>
              Event Location Type
            </Text>
            <View style={styles.formatRow}>
              {FORMAT_OPTIONS.map((fmt) => {
                const isSelected = format === fmt.id;
                return (
                  <TouchableOpacity
                    key={fmt.id}
                    style={[
                      styles.formatBtn,
                      { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                      isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                    ]}
                    onPress={() => setFormat(fmt.id as any)}
                  >
                    <Text
                      style={[
                        styles.formatBtnText,
                        { color: colors.onSurfaceVariant },
                        isSelected && { color: colors.secondary, fontWeight: '700' },
                      ]}
                    >
                      {fmt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Ticket Budget */}
            <Text style={[styles.sectionHeading, { color: colors.onSurface, marginTop: spacing.md }]}>
              Ticket Price Preference
            </Text>
            <View style={styles.formatRow}>
              {PRICE_OPTIONS.map((p) => {
                const isSelected = maxPrice === p.val;
                return (
                  <TouchableOpacity
                    key={p.val}
                    style={[
                      styles.formatBtn,
                      { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                      isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                    ]}
                    onPress={() => setMaxPrice(p.val)}
                  >
                    <Text
                      style={[
                        styles.formatBtnText,
                        { color: colors.onSurfaceVariant },
                        isSelected && { color: colors.secondary, fontWeight: '700' },
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notification Toggles */}
            <Text style={[styles.sectionHeading, { color: colors.onSurface, marginTop: spacing.md }]}>
              Notification Alerts
            </Text>

            <View style={[styles.toggleRow, { borderBottomColor: colors.outlineVariant }]}>
              <View style={styles.toggleTextWrap}>
                <Text style={[styles.toggleTitle, { color: colors.onSurface }]}>Ticket Discount Alerts</Text>
                <Text style={[styles.toggleSub, { color: colors.onSurfaceVariant }]}>
                  Get instant notifications when ticket prices drop or promo codes are added.
                </Text>
              </View>
              <Switch
                value={discountAlerts}
                onValueChange={setDiscountAlerts}
                trackColor={{ false: colors.outlineVariant, true: colors.secondary }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextWrap}>
                <Text style={[styles.toggleTitle, { color: colors.onSurface }]}>Event Updates & Reminders</Text>
                <Text style={[styles.toggleSub, { color: colors.onSurfaceVariant }]}>
                  Receive regular updates about event dates, venues, and new announcements.
                </Text>
              </View>
              <Switch
                value={eventAlerts}
                onValueChange={setEventAlerts}
                trackColor={{ false: colors.outlineVariant, true: colors.secondary }}
                thumbColor="#ffffff"
              />
            </View>
          </ScrollView>

          {/* Modal Footer Button */}
          <View style={[styles.modalFooter, { borderTopColor: colors.outlineVariant }]}>
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.secondary }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Preferences</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '85%',
    paddingBottom: spacing.md,
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
  modalSubtitle: {
    ...typography.bodyMd,
    fontSize: 12,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  scrollContent: {
    padding: spacing.md,
  },
  sectionHeading: {
    ...typography.bodyLg,
    fontWeight: '700',
    marginBottom: 2,
  },
  sectionSub: {
    ...typography.bodyMd,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.chip,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  formatRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  formatBtnText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  toggleTextWrap: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  toggleTitle: {
    ...typography.bodyMd,
    fontWeight: '700',
  },
  toggleSub: {
    ...typography.labelSm,
    fontSize: 11,
    marginTop: 2,
  },
  modalFooter: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  saveBtn: {
    height: 50,
    borderRadius: radius.button,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  saveBtnText: {
    color: '#ffffff',
    ...typography.bodyLg,
    fontWeight: '700',
  },
});
