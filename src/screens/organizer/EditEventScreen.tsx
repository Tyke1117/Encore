import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface EditEventScreenProps {
  navigation: any;
  route: any;
}

type EventStatus = 'Draft' | 'Live' | 'Completed';

export default function EditEventScreen({ navigation, route }: EditEventScreenProps) {
  const existing = route?.params?.event ?? {
    name: 'Encore Hackathon 2026',
    category: 'Hackathon',
    date: '18 Jul 2026',
    venue: 'CL-1 Auditorium',
    description: '24-hour build sprint open to all departments.',
    status: 'Live' as EventStatus,
  };

  const [eventTitle, setEventTitle] = useState(existing.name);
  const [category, setCategory] = useState(existing.category);
  const [date, setDate] = useState(existing.date);
  const [venue, setVenue] = useState(existing.venue);
  const [description, setDescription] = useState(existing.description);
  const [status, setStatus] = useState<EventStatus>(existing.status);

  const statusOptions: EventStatus[] = ['Draft', 'Live', 'Completed'];

  const handleSave = () => {
    // No backend wired yet — this just confirms the intended save action for now.
    Alert.alert('Event updated', `${eventTitle} has been saved.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert('Delete event?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Event</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
          <Icon name="trash-2" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Event Title</Text>
          <TextInput
            style={styles.textInput}
            value={eventTitle}
            onChangeText={setEventTitle}
            placeholderTextColor={colors.outline}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Category</Text>
          <TextInput
            style={styles.textInput}
            value={category}
            onChangeText={setCategory}
            placeholderTextColor={colors.outline}
          />
        </View>

        <View style={styles.rowGroup}>
          <View style={[styles.formGroup, styles.halfField]}>
            <Text style={styles.fieldLabel}>Date</Text>
            <View style={styles.inputWithIcon}>
              <Icon name="calendar" size={16} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.inputWithIconText}
                value={date}
                onChangeText={setDate}
                placeholderTextColor={colors.outline}
              />
            </View>
          </View>
          <View style={[styles.formGroup, styles.halfField]}>
            <Text style={styles.fieldLabel}>Venue</Text>
            <View style={styles.inputWithIcon}>
              <Icon name="map-pin" size={16} color={colors.onSurfaceVariant} />
              <TextInput
                style={styles.inputWithIconText}
                value={venue}
                onChangeText={setVenue}
                placeholderTextColor={colors.outline}
              />
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={colors.outline}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Status</Text>
          <View style={styles.statusRow}>
            {statusOptions.map((opt) => {
              const active = status === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[styles.statusChip, active && styles.statusChipActive]}
                  onPress={() => setStatus(opt)}
                >
                  <Text style={[styles.statusChipText, active && styles.statusChipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Icon name="check" size={16} color={colors.onPrimary} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
  },
  fieldLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.onSurface,
    ...typography.bodyMd,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputWithIconText: {
    flex: 1,
    color: colors.onSurface,
    ...typography.bodyMd,
    padding: 0,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statusChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.slate[200],
    backgroundColor: colors.surfaceContainerLow,
  },
  statusChipActive: {
    backgroundColor: colors.primaryContainer,
    borderColor: colors.primaryContainer,
  },
  statusChipText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  statusChipTextActive: {
    color: colors.onPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cancelButtonText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    ...shadows.level1,
  },
  saveButtonText: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
});