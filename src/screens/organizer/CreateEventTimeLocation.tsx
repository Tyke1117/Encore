import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface CreateEventTimeLocationProps {
  route: any;
  navigation: any;
}

export default function CreateEventTimeLocation({ route, navigation }: CreateEventTimeLocationProps) {
  const { eventData } = route.params || {};

  const [startDate, setStartDate] = useState('24-10-2024');
  const [startTime, setStartTime] = useState('19:00');
  const [endDate, setEndDate] = useState('24-10-2024');
  const [endTime, setEndTime] = useState('22:30');
  const [selectedDuration, setSelectedDuration] = useState('3 Hours');
  const [venueSearch, setVenueSearch] = useState('Digital Art Pavilion');
  const [isVirtual, setIsVirtual] = useState(false);

  const durationOptions = ['1 Hour', '3 Hours', 'All Day'];

  const handleDurationSelect = (duration: string) => {
    setSelectedDuration(duration);
    if (duration === '1 Hour') {
      setEndTime('20:00');
    } else if (duration === '3 Hours') {
      setEndTime('22:00');
    } else if (duration === 'All Day') {
      setEndTime('23:59');
    }
  };

  const handleContinue = () => {
    navigation.navigate('CreateEventTickets', {
      eventData: {
        ...eventData,
        startDate,
        startTime,
        endDate,
        endTime,
        selectedDuration,
        venue: venueSearch,
        isVirtual,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Control Bar */}
        <View style={styles.topControlRow}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('OrganizerDashboard')}>
            <Icon name="x" size={22} color={colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
        {/* Progress Header */}
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>STEP 2 OF 4</Text>
            <Text style={styles.progressPercent}>Date & Location</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '50%' }]} />
          </View>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>When and where?</Text>
        <Text style={styles.pageSubTitle}>Set the timeline and pick a venue for your masterpiece.</Text>

        {/* Schedule Card */}
        <View style={[styles.card, shadows.level1]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIconContainer}>
              <Icon name="calendar" size={18} color={colors.primaryContainer} />
            </View>
            <Text style={styles.cardHeaderText}>Schedule</Text>
          </View>

          {/* Starts Row */}
          <View style={styles.timeRow}>
            <View style={[styles.timeCol, { marginRight: spacing.sm }]}>
              <Text style={styles.timeInputLabel}>Starts</Text>
              <View style={styles.timeInputBox}>
                <TextInput
                  style={styles.timeTextInput}
                  value={startDate}
                  onChangeText={setStartDate}
                />
                <Icon name="calendar" size={16} color={colors.outline} />
              </View>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeInputLabel}> </Text>
              <View style={styles.timeInputBox}>
                <TextInput
                  style={styles.timeTextInput}
                  value={startTime}
                  onChangeText={setStartTime}
                />
                <Icon name="clock" size={16} color={colors.outline} />
              </View>
            </View>
          </View>

          {/* Ends Row */}
          <View style={[styles.timeRow, { marginTop: spacing.md }]}>
            <View style={[styles.timeCol, { marginRight: spacing.sm }]}>
              <Text style={styles.timeInputLabel}>Ends</Text>
              <View style={styles.timeInputBox}>
                <TextInput
                  style={styles.timeTextInput}
                  value={endDate}
                  onChangeText={setEndDate}
                />
                <Icon name="calendar" size={16} color={colors.outline} />
              </View>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeInputLabel}> </Text>
              <View style={styles.timeInputBox}>
                <TextInput
                  style={styles.timeTextInput}
                  value={endTime}
                  onChangeText={setEndTime}
                />
                <Icon name="clock" size={16} color={colors.outline} />
              </View>
            </View>
          </View>

          {/* Duration Chips */}
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Duration suggestions</Text>
            <View style={styles.chipsRow}>
              {durationOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.chip, selectedDuration === opt && styles.chipActive]}
                  onPress={() => handleDurationSelect(opt)}
                >
                  <Text style={[styles.chipText, selectedDuration === opt && styles.chipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Timezone banner */}
        <View style={styles.timezoneBanner}>
          <View style={styles.timezoneIconContainer}>
            <Icon name="globe" size={16} color={colors.secondary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timezoneTitle}>Timezone: Central European Time</Text>
            <Text style={styles.timezoneSub}>Automatically detected from location</Text>
          </View>
        </View>

        {/* Venue Card */}
        <View style={[styles.card, shadows.level1, { marginTop: spacing.lg }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIconContainer}>
              <Icon name="map-pin" size={18} color={colors.primaryContainer} />
            </View>
            <Text style={styles.cardHeaderText}>Venue</Text>
          </View>

          <View style={styles.searchBoxContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a venue or address..."
              placeholderTextColor={colors.outline}
              value={venueSearch}
              onChangeText={setVenueSearch}
              editable={!isVirtual}
            />
            <Icon name="search" size={18} color={colors.outline} style={styles.searchIcon} />
          </View>

          {/* Styled Map Preview using SVG */}
          {!isVirtual && (
            <View style={styles.mapContainer}>
              <Svg height="100%" width="100%" viewBox="0 0 300 150">
                {/* Background map land */}
                <Rect x="0" y="0" width="300" height="150" fill="#E8ECE9" />
                {/* Green park zones */}
                <Path d="M 0,0 L 80,0 L 50,70 L 0,40 Z" fill="#D2E2D6" />
                <Path d="M 180,150 L 300,100 L 300,150 Z" fill="#D2E2D6" />
                {/* River water body */}
                <Path d="M 0,110 C 100,120 150,80 300,90 L 300,150 L 0,150 Z" fill="#CADCF2" />
                {/* Streets/Roads lines */}
                <Path d="M 0,60 L 300,60" stroke="#FFFFFF" strokeWidth="8" />
                <Path d="M 100,0 L 100,150" stroke="#FFFFFF" strokeWidth="6" />
                <Path d="M 220,0 L 220,150" stroke="#FFFFFF" strokeWidth="5" />
                <Path d="M 0,110 Q 150,50 300,110" stroke="#FFFFFF" strokeWidth="4" />
                {/* Secondary inner road lines */}
                <Path d="M 0,60 L 300,60" stroke="#E1E5E2" strokeWidth="2" />
                <Path d="M 100,0 L 100,150" stroke="#E1E5E2" strokeWidth="2" />
                {/* Custom target location label bubble */}
                <Rect x="70" y="25" width="160" height="28" rx="6" fill="#FFFFFF" />
                <Circle cx="82" cy="39" r="6" fill={colors.primaryContainer} />
                {/* Venue Name Text inside map bubble */}
                <Path d="M 144,32 L 152,32 L 152,44 L 144,44 Z" fill="none" />
              </Svg>
              <View style={styles.mapOverlayLabel}>
                <View style={styles.mapIndicatorDot} />
                <Text style={styles.mapOverlayText}>Digital Art Pavilion</Text>
                <Text style={styles.mapOverlaySub}>12 Tech Plaza, Creative District</Text>
              </View>
            </View>
          )}

          {/* Virtual checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            activeOpacity={0.8}
            onPress={() => setIsVirtual(!isVirtual)}
          >
            <View style={[styles.checkbox, isVirtual && styles.checkboxChecked]}>
              {isVirtual && <Icon name="check" size={14} color={colors.onPrimary} />}
            </View>
            <Text style={styles.checkboxLabel}>This is a virtual event</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
            <Icon name="arrow-right" size={16} color={colors.onPrimary} style={{ marginLeft: 8 }} />
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
    color: colors.onSurface,
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
    backgroundColor: colors.primaryContainer,
    borderRadius: radius.sm,
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
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardHeaderIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryFixed,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cardHeaderText: {
    ...typography.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
  },
  timeRow: {
    flexDirection: 'row',
  },
  timeCol: {
    flex: 1,
  },
  timeInputLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  timeInputBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timeTextInput: {
    ...typography.bodyMd,
    color: colors.onSurface,
    padding: 0,
    flex: 1,
  },
  durationContainer: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.slate[100],
    paddingTop: spacing.md,
  },
  durationLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.button,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
  },
  chipActive: {
    backgroundColor: colors.primaryFixed,
    borderColor: colors.primaryContainer,
  },
  chipText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.onPrimaryFixedVariant,
  },
  timezoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryFixed,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  timezoneIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceContainerLowest,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  timezoneTitle: {
    ...typography.labelMd,
    fontWeight: '600',
    color: colors.onSecondaryFixedVariant,
  },
  timezoneSub: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSecondaryFixedVariant,
    opacity: 0.8,
    marginTop: 2,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchInput: {
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
    flex: 1,
  },
  searchIcon: {
    marginLeft: spacing.sm,
  },
  mapContainer: {
    height: 150,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate[200],
    position: 'relative',
  },
  mapOverlayLabel: {
    position: 'absolute',
    top: 25,
    left: 80,
    backgroundColor: colors.surfaceContainerLowest,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.slate[200],
    ...shadows.level1,
  },
  mapIndicatorDot: {
    position: 'absolute',
    left: -12,
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryContainer,
  },
  mapOverlayText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurface,
    fontWeight: '700',
  },
  mapOverlaySub: {
    ...typography.labelSm,
    fontSize: 8,
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
    borderColor: colors.primaryContainer,
    backgroundColor: colors.primaryContainer,
  },
  checkboxLabel: {
    ...typography.bodyMd,
    color: colors.onSurface,
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
  },
  backText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
  },
  continueText: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  // Bottom navigation styles removed
});
