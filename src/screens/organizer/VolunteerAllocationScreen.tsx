import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

type AllocationStatus = 'Unassigned' | 'Assigned' | 'Rejected';

interface Applicant {
  id: string;
  name: string;
  event: string;
  preferredRole: string;
  assignedRole: string | null;
  status: AllocationStatus;
}

const initialApplicants: Applicant[] = [
  { id: '1', name: 'Aarav Mehta', event: 'Encore Hackathon 2026', preferredRole: 'Registration Desk', assignedRole: null, status: 'Unassigned' },
  { id: '2', name: 'Bhavika Patel', event: 'Cultural Night', preferredRole: 'Stage Coordination', assignedRole: null, status: 'Unassigned' },
  { id: '3', name: 'Rohan Iyer', event: 'AI/ML Workshop', preferredRole: 'Tech Support', assignedRole: 'Tech Support', status: 'Assigned' },
  { id: '4', name: 'Diya Shah', event: 'Cultural Night', preferredRole: 'Crowd Management', assignedRole: null, status: 'Unassigned' },
];

const roleOptions = ['Registration Desk', 'Stage Coordination', 'Tech Support', 'Crowd Management', 'Hospitality'];

function initialsOf(name: string): string {
  return name.split(' ').map((p) => p.charAt(0)).join('').slice(0, 2).toUpperCase();
}

function statusColor(status: AllocationStatus): string {
  if (status === 'Assigned') return colors.tertiary;
  if (status === 'Rejected') return colors.error;
  return colors.onSurfaceVariant;
}

function ApplicantCard({
  item,
  activeRolePicker,
  onTogglePicker,
  onAssignRole,
  onReject,
}: {
  item: Applicant;
  activeRolePicker: boolean;
  onTogglePicker: () => void;
  onAssignRole: (role: string) => void;
  onReject: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialsOf(item.name)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.eventText}>{item.event}</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: `${statusColor(item.status)}1F` }]}>
          <Text style={[styles.statusChipText, { color: statusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.preferredText}>
        Preferred role: <Text style={styles.preferredTextBold}>{item.preferredRole}</Text>
      </Text>

      <TouchableOpacity style={styles.rolePickerTrigger} onPress={onTogglePicker}>
        <Text style={styles.rolePickerValue}>
          {item.assignedRole ?? 'Select role to assign'}
        </Text>
        <Icon name={activeRolePicker ? 'chevron-up' : 'chevron-down'} size={16} color={colors.onSurfaceVariant} />
      </TouchableOpacity>

      {activeRolePicker && (
        <View style={styles.rolePickerMenu}>
          {roleOptions.map((role) => (
            <TouchableOpacity key={role} style={styles.rolePickerItem} onPress={() => onAssignRole(role)}>
              <Text style={styles.rolePickerItemText}>{role}</Text>
              {item.assignedRole === role && <Icon name="check" size={14} color={colors.secondary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.rejectButtonText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => onAssignRole(item.assignedRole ?? item.preferredRole)}
        >
          <Icon name="check" size={14} color={colors.onPrimary} />
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function VolunteerAllocationScreen() {
  const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
  const [openPickerId, setOpenPickerId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const handleAssign = (id: string, role: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, assignedRole: role, status: 'Assigned' } : a))
    );
    setOpenPickerId(null);
  };

  const handleReject = (id: string) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Rejected', assignedRole: null } : a))
    );
  };

  const filtered = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.event.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Volunteer Allocation</Text>
      </View>

      <View style={styles.searchWrap}>
        <Icon name="search" size={16} color={colors.onSurfaceVariant} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search volunteers or events..."
          placeholderTextColor={colors.outline}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filtered.map((item) => (
          <ApplicantCard
            key={item.id}
            item={item}
            activeRolePicker={openPickerId === item.id}
            onTogglePicker={() => setOpenPickerId(openPickerId === item.id ? null : item.id)}
            onAssignRole={(role) => handleAssign(item.id, role)}
            onReject={() => handleReject(item.id)}
          />
        ))}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.onSurface,
    ...typography.bodyMd,
    padding: 0,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.level1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    color: colors.onSecondary,
    ...typography.labelMd,
    fontWeight: '600',
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  eventText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  statusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  statusChipText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  preferredText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  preferredTextBold: {
    color: colors.onSurface,
    fontWeight: '600',
  },
  rolePickerTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  rolePickerValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  rolePickerMenu: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  rolePickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rolePickerItemText: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rejectButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  rejectButtonText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: radius.button,
    backgroundColor: colors.primaryContainer,
  },
  confirmButtonText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
});