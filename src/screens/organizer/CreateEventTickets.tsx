import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface CreateEventTicketsProps {
  route: any;
  navigation: any;
}

export default function CreateEventTickets({ route, navigation }: CreateEventTicketsProps) {
  const { eventData } = route.params || {};

  const [isFree, setIsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState('0.00');
  const [capacity, setCapacity] = useState('50');
  const [enableWaitlist, setEnableWaitlist] = useState(false);

  const handlePublish = () => {
    navigation.navigate('EventPublished', {
      eventData: {
        ...eventData,
        isFree,
        ticketPrice: isFree ? '0.00' : ticketPrice,
        capacity,
        enableWaitlist,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Control Bar */}
        <View style={styles.topControlRow}>
         <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('OrganizerTabs', { screen: 'OrganizerDashboard' })}>
            <Icon name="x" size={22} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
        {/* Step indicators */}
        <View style={styles.stepperContainer}>
          {/* Details (Checked) */}
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconChecked]}>
              <Icon name="check" size={14} color={colors.secondary} />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelChecked]}>Details</Text>
          </View>
          <View style={[styles.stepDivider, styles.stepDividerChecked]} />

          {/* Location (Checked) */}
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconChecked]}>
              <Icon name="check" size={14} color={colors.secondary} />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelChecked]}>Location</Text>
          </View>
          <View style={[styles.stepDivider, styles.stepDividerActive]} />

          {/* Tickets (Active) */}
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconActive]}>
              <Text style={styles.stepNumberActive}>3</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Tickets</Text>
          </View>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Tickets & Capacity</Text>
        <Text style={styles.pageSubTitle}>Set your ticket pricing and attendee limits for this event.</Text>

        {/* Free/Paid selector buttons */}
        <View style={styles.selectorRow}>
          {/* Free Event selector */}
          <TouchableOpacity
            style={[
              styles.selectorCard,
              isFree && styles.selectorCardActive,
              shadows.level1,
            ]}
            onPress={() => {
              setIsFree(true);
              setTicketPrice('0.00');
            }}
          >
            <View style={[styles.selectorIconCircle, isFree && styles.selectorIconCircleActive]}>
              <Icon name="tag" size={20} color={isFree ? colors.primaryContainer : colors.onSurfaceVariant} />
            </View>
            <Text style={styles.selectorTitle}>Free Event</Text>
            <Text style={styles.selectorSub}>No charge for entry</Text>
          </TouchableOpacity>

          {/* Paid Event selector */}
          <TouchableOpacity
            style={[
              styles.selectorCard,
              !isFree && styles.selectorCardActive,
              shadows.level1,
            ]}
            onPress={() => setIsFree(false)}
          >
            <View style={[styles.selectorIconCircle, !isFree && styles.selectorIconCircleActive]}>
              <Icon name="credit-card" size={20} color={!isFree ? colors.primaryContainer : colors.onSurfaceVariant} />
            </View>
            <Text style={styles.selectorTitle}>Paid Event</Text>
            <Text style={styles.selectorSub}>Charge for tickets</Text>
          </TouchableOpacity>
        </View>

        {/* Ticket Price input */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Ticket Price (USD)</Text>
          <View style={[styles.inputWithIcon, isFree && styles.disabledInput]}>
            <Text style={[styles.prefixText, isFree && styles.disabledText]}>$</Text>
            <TextInput
              style={[styles.textInput, isFree && styles.disabledText]}
              placeholder="0.00"
              placeholderTextColor={colors.outline}
              value={ticketPrice}
              onChangeText={setTicketPrice}
              keyboardType="decimal-pad"
              editable={!isFree}
            />
          </View>
        </View>

        {/* Total Capacity input */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Total Capacity</Text>
          <TextInput
            style={styles.textInputFull}
            placeholder="e.g. 100"
            placeholderTextColor={colors.outline}
            value={capacity}
            onChangeText={setCapacity}
            keyboardType="number-pad"
          />
        </View>

        {/* Enable Waitlist card */}
        <View style={[styles.waitlistCard, shadows.level1]}>
          <View style={styles.waitlistIconCircle}>
            <Icon name="clock" size={18} color={colors.secondary} />
          </View>
          <View style={{ flex: 1, paddingRight: spacing.sm }}>
            <Text style={styles.waitlistTitle}>Enable Waitlist</Text>
            <Text style={styles.waitlistSub}>Collect signups even after tickets sell out.</Text>
          </View>
          <Switch
            value={enableWaitlist}
            onValueChange={setEnableWaitlist}
            trackColor={{ false: colors.surfaceDim, true: colors.secondaryContainer }}
            thumbColor={enableWaitlist ? colors.secondary : '#f4f3f4'}
          />
        </View>

        {/* Venue Preview Section */}
        <View style={styles.previewContainer}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
            }}
            style={styles.previewBg}
            imageStyle={{ borderRadius: radius.card }}
          >
            {/* Dark overlay for text contrast */}
            <View style={styles.previewOverlay}>
              <Text style={styles.previewTag}>Venue Preview</Text>
              <Text style={styles.previewTitle}>Grand Hall, Central Plaza</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Tier Chip */}
        <View style={[styles.tierCard, shadows.level1]}>
          <Icon name="tag" size={16} color={colors.primaryContainer} style={{ marginRight: spacing.sm }} />
          <View>
            <Text style={styles.tierTitle}>Tier 1</Text>
            <Text style={styles.tierSub}>Early Access</Text>
          </View>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.saveDraftButton}>
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishButtonText}>Publish Event</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation Removed */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderBottomWidth: 1,
    borderBottomColor: colors.slate[100],
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.primary,
    fontWeight: '700',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.xs,
  },
  iconButton: {
    padding: spacing.xs,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  stepItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  stepIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  stepIconActive: {
    backgroundColor: colors.primaryContainer,
  },
  stepIconChecked: {
    backgroundColor: colors.secondaryFixed,
  },
  stepNumberActive: {
    ...typography.labelSm,
    color: colors.onPrimary,
    fontWeight: '700',
  },
  stepLabel: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  stepLabelChecked: {
    color: colors.secondary,
    fontWeight: '600',
  },
  stepDivider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginHorizontal: spacing.xs,
  },
  stepDividerChecked: {
    backgroundColor: colors.secondary,
  },
  stepDividerActive: {
    backgroundColor: colors.primaryContainer,
  },
  pageTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  pageSubTitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  selectorCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
  },
  selectorCardActive: {
    borderColor: colors.primaryContainer,
    backgroundColor: colors.surfaceContainerLow,
  },
  selectorIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.slate[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectorIconCircleActive: {
    backgroundColor: colors.primaryFixed,
  },
  selectorTitle: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  selectorSub: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
  },
  prefixText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    fontWeight: '600',
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
    ...typography.bodyMd,
  },
  textInputFull: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.onSurface,
    ...typography.bodyMd,
  },
  disabledInput: {
    backgroundColor: colors.surfaceDim,
    borderColor: colors.outlineVariant,
  },
  disabledText: {
    color: colors.onSurfaceVariant,
    opacity: 0.6,
  },
  waitlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryFixed,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  waitlistIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  waitlistTitle: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.onSecondaryFixedVariant,
  },
  waitlistSub: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSecondaryFixedVariant,
    opacity: 0.8,
    marginTop: 2,
  },
  previewContainer: {
    height: 120,
    borderRadius: radius.card,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  previewBg: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(37, 25, 19, 0.45)', // dark transparent wash
    justifyContent: 'flex-end',
    padding: spacing.md,
  },
  previewTag: {
    ...typography.labelSm,
    fontSize: 9,
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.8,
  },
  previewTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryFixed,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  tierTitle: {
    ...typography.labelSm,
    fontWeight: '700',
    color: colors.onPrimaryFixed,
  },
  tierSub: {
    ...typography.labelSm,
    fontSize: 9,
    color: colors.onPrimaryFixedVariant,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  saveDraftButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  saveDraftText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
  },
  publishButtonText: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  // Bottom navigation styles removed
});
