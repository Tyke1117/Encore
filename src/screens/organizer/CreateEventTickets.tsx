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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../context/ThemeContext';
import { ColorsType } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface CreateEventTicketsProps {
  route: any;
  navigation: any;
}

export default function CreateEventTickets({ route, navigation }: CreateEventTicketsProps) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const { eventData } = route.params || {};

  const [ticketType, setTicketType] = useState<'free' | 'paid' | 'invite'>('free');
  const [ticketPrice, setTicketPrice] = useState('0');
  const [ticketQuantity, setTicketQuantity] = useState(100);
  const [ticketName, setTicketName] = useState('General Admission');
  const [enableWaitlist, setEnableWaitlist] = useState(false);
  const [isTransferable, setIsTransferable] = useState(true);

  const handlePublish = () => {
    navigation.navigate('EventPublished', {
      eventData: {
        ...eventData,
        ticketType,
        ticketPrice: ticketType === 'free' ? '0' : ticketPrice,
        ticketQuantity,
        ticketName,
        enableWaitlist,
        isTransferable,
      },
    });
  };

  const adjustQuantity = (amount: number) => {
    setTicketQuantity(Math.max(1, ticketQuantity + amount));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Control Bar */}
        <View style={styles.topControlRow}>
         <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('OrganizerTabs', { screen: 'OrganizerDashboard' })}>
            <Icon name="x" size={22} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Progress Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Create Event</Text>
            <Text style={styles.progressPercent}>99% Complete</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '99%' }]} />
          </View>
        </View>

        {/* Stepper Tabs */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconChecked]}>
              <Icon name="check" size={14} color={colors.secondary} />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelChecked]}>Details</Text>
          </View>
          <View style={[styles.stepDivider, styles.stepDividerChecked]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconChecked]}>
              <Icon name="check" size={14} color={colors.secondary} />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelChecked]}>Time & Location</Text>
          </View>
          <View style={[styles.stepDivider, styles.stepDividerChecked]} />
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconActive]}>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>3</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Tickets</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Ticket Setup</Text>
        <Text style={styles.pageSubTitle}>Set ticket pricing and quantity limitations for registrations.</Text>

        {/* Ticket Selector Row */}
        <View style={styles.selectorRow}>
          <TouchableOpacity
            style={[styles.selectorCard, ticketType === 'free' && styles.selectorCardActive]}
            onPress={() => setTicketType('free')}
            activeOpacity={0.8}
          >
            <View style={[styles.selectorIconCircle, ticketType === 'free' && styles.selectorIconCircleActive]}>
              <Icon name="gift" size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.selectorTitle, ticketType === 'free' && styles.selectorTitleActive]}>Free</Text>
            <Text style={styles.selectorSub}>Guests register for free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectorCard, ticketType === 'paid' && styles.selectorCardActive]}
            onPress={() => setTicketType('paid')}
            activeOpacity={0.8}
          >
            <View style={[styles.selectorIconCircle, ticketType === 'paid' && styles.selectorIconCircleActive]}>
              <Icon name="credit-card" size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.selectorTitle, ticketType === 'paid' && styles.selectorTitleActive]}>Paid</Text>
            <Text style={styles.selectorSub}>Guests pay a ticket fee</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectorCard, ticketType === 'invite' && styles.selectorCardActive]}
            onPress={() => setTicketType('invite')}
            activeOpacity={0.8}
          >
            <View style={[styles.selectorIconCircle, ticketType === 'invite' && styles.selectorIconCircleActive]}>
              <Icon name="mail" size={18} color={colors.secondary} />
            </View>
            <Text style={[styles.selectorTitle, ticketType === 'invite' && styles.selectorTitleActive]}>Invite</Text>
            <Text style={styles.selectorSub}>Requires explicit approval</Text>
          </TouchableOpacity>
        </View>

        {/* Details Card */}
        <View style={styles.card}>
          {/* Ticket Name */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Ticket Name</Text>
            <TextInput
              style={styles.textInput}
              value={ticketName}
              onChangeText={setTicketName}
              placeholder="e.g. General Admission"
              placeholderTextColor={colors.outline}
            />
          </View>

          {/* Ticket Price (Paid only) */}
          {ticketType === 'paid' && (
            <View style={styles.formGroup}>
              <Text style={styles.fieldLabel}>Ticket Price</Text>
              <View style={styles.priceInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[styles.textInput, styles.priceInput]}
                  value={ticketPrice}
                  onChangeText={setTicketPrice}
                  keyboardType="numeric"
                  placeholder="299"
                  placeholderTextColor={colors.outline}
                />
              </View>
            </View>
          )}

          {/* Quantity limitation counter */}
          <View style={styles.formGroup}>
            <Text style={styles.fieldLabel}>Quantity Available</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity style={styles.quantityBtn} onPress={() => adjustQuantity(-10)} activeOpacity={0.7}>
                <Icon name="minus" size={16} color={colors.secondary} />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityVal}>{ticketQuantity}</Text>
                <Text style={styles.quantityLabel}>Tickets</Text>
              </View>
              <TouchableOpacity style={styles.quantityBtn} onPress={() => adjustQuantity(10)} activeOpacity={0.7}>
                <Icon name="plus" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Transferability Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsTransferable(!isTransferable)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, isTransferable && styles.checkboxChecked]}>
              {isTransferable && <Icon name="check" size={14} color="#ffffff" />}
            </View>
            <Text style={styles.checkboxLabel}>Tickets are transferable to other students</Text>
          </TouchableOpacity>
        </View>

        {/* Waitlist settings */}
        <View style={styles.waitlistCard}>
          <View style={styles.waitlistIconCircle}>
            <Icon name="users" size={16} color={colors.secondary} />
            <Icon name="clock" size={18} color={colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.waitlistTitle}>Waitlist Registration</Text>
            <Text style={styles.waitlistSub}>Open waitlist queue when tickets sell out</Text>
          </View>
          <Switch
            value={enableWaitlist}
            onValueChange={setEnableWaitlist}
            trackColor={{ false: colors.surfaceDim, true: colors.surfaceDim }}
            thumbColor={enableWaitlist ? colors.secondary : '#f4f3f4'}
          />
        </View>

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handlePublish} 
            activeOpacity={0.8}
            style={[styles.publishButton, { backgroundColor: colors.secondary, flexDirection: 'row' }]}
          >
            <Text style={styles.publishText}>Publish Event</Text>
            <Icon name="check" size={16} color={colors.onPrimary} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: ColorsType) => StyleSheet.create({
  container: {
    flex: 1,
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
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontWeight: '700',
  },
  progressPercent: {
    ...typography.labelSm,
    color: colors.secondary,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.secondary,
    borderRadius: radius.sm,
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
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepIconActive: {
    backgroundColor: colors.secondary,
  },
  stepIconChecked: {
    backgroundColor: colors.secondaryContainer,
  },
  stepLabel: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  stepLabelActive: {
    color: colors.secondary,
    fontWeight: '600',
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
    marginBottom: 14,
  },
  stepDividerChecked: {
    backgroundColor: colors.secondary,
  },
  pageTitle: {
    ...typography.headlineLg,
    color: colors.onSurface,
    fontWeight: '700',
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
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  selectorCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
  },
  selectorCardActive: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondaryContainer,
    borderWidth: 1.5,
  },
  selectorIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceContainerLow,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  selectorIconCircleActive: {
    backgroundColor: colors.surface,
  },
  selectorTitle: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 2,
  },
  selectorTitleActive: {
    color: colors.secondary,
  },
  selectorSub: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 48,
    color: colors.onSurface,
    ...typography.bodyMd,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  currencySymbol: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 1,
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  priceInput: {
    paddingLeft: 30,
    flex: 1,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingVertical: spacing.xs,
  },
  quantityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityVal: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  quantityLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  checkboxChecked: {
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  checkboxLabel: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  waitlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.card,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: `${colors.secondary}1a`,
  },
  waitlistIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  waitlistTitle: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.onSecondaryContainer,
  },
  waitlistSub: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSecondaryContainer,
    opacity: 0.8,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom:50
  },
  backText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  publishButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    ...shadows.level1,
    marginBottom:50
  },
  publishText: {
    ...typography.bodyMd,
    color: '#ffffff',
    fontWeight: '600',
  },
});
