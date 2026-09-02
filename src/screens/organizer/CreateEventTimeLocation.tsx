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
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Svg, { Rect, Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
import { useTheme } from '../../context/ThemeContext';
import { ColorsType } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import DatePickerModal from '../../components/DatePickerModal';
import TimePickerModal from '../../components/TimePickerModal';

interface CreateEventTimeLocationProps {
  route: any;
  navigation: any;
}

const getTodayFormatted = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const getSampleStartTime = () => {
  const d = new Date();
  let h = d.getHours() + 1;
  if (h >= 24) h = 10;
  return `${String(h).padStart(2, '0')}:00`;
};

const getSampleEndTime = (start: string) => {
  const parts = start.split(':').map((x) => parseInt(x, 10));
  const h = (parts[0] + 3) % 24;
  return `${String(h).padStart(2, '0')}:00`;
};

export default function CreateEventTimeLocation({ route, navigation }: CreateEventTimeLocationProps) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const { eventData } = route.params || {};

  const defaultStartTime = getSampleStartTime();
  const [startDate, setStartDate] = useState(getTodayFormatted());
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endDate, setEndDate] = useState(getTodayFormatted());
  const [endTime, setEndTime] = useState(getSampleEndTime(defaultStartTime));
  const [selectedDuration, setSelectedDuration] = useState('3 Hours');
  const [venueSearch, setVenueSearch] = useState('Digital Art Pavilion');
  const [isVirtual, setIsVirtual] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<'start' | 'end' | null>(null);
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end' | null>(null);

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
        venue: isVirtual ? 'Virtual Event' : venueSearch,
        isVirtual,
      },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

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
            <Text style={styles.progressText}>Create Event</Text>
            <Text style={styles.progressPercent}>66% Complete</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '66%' }]} />
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
            <View style={[styles.stepIconContainer, styles.stepIconActive]}>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>2</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Time & Location</Text>
          </View>
          <View style={styles.stepDivider} />
          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Tickets</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Date, Time & Location</Text>
        <Text style={styles.pageSubTitle}>Schedule your event and select where attendees will gather.</Text>

        {/* Date & Time Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIconContainer}>
              <Icon name="calendar" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.cardHeaderText}>Date & Time</Text>
          </View>

          <View style={styles.timeRow}>
            <View style={[styles.timeCol, { marginRight: spacing.sm }]}>
              <Text style={styles.timeInputLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.timeInputBox}
                onPress={() => setPickerTarget('start')}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeTextInput, { lineHeight: 46 }]}>{startDate}</Text>
                <Icon name="calendar" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeInputLabel}>Start Time</Text>
              <TouchableOpacity
                style={styles.timeInputBox}
                onPress={() => setTimePickerTarget('start')}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeTextInput, { lineHeight: 46 }]}>{startTime}</Text>
                <Icon name="clock" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.timeRow, { marginTop: spacing.md }]}>
            <View style={[styles.timeCol, { marginRight: spacing.sm }]}>
              <Text style={styles.timeInputLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.timeInputBox}
                onPress={() => setPickerTarget('end')}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeTextInput, { lineHeight: 46 }]}>{endDate}</Text>
                <Icon name="calendar" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.timeCol}>
              <Text style={styles.timeInputLabel}>End Time</Text>
              <TouchableOpacity
                style={styles.timeInputBox}
                onPress={() => setTimePickerTarget('end')}
                activeOpacity={0.7}
              >
                <Text style={[styles.timeTextInput, { lineHeight: 46 }]}>{endTime}</Text>
                <Icon name="clock" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Duration Chips */}
          <View style={styles.durationContainer}>
            <Text style={styles.durationLabel}>Suggested Durations</Text>
            <View style={styles.chipsRow}>
              {durationOptions.map((option) => {
                const isActive = selectedDuration === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => handleDurationSelect(option)}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Timezone Banner */}
          <View style={styles.timezoneBanner}>
            <View style={styles.timezoneIconContainer}>
              <Icon name="globe" size={14} color={colors.secondary} />
            </View>
            <View>
              <Text style={styles.timezoneTitle}>Indian Standard Time (IST)</Text>
              <Text style={styles.timezoneSub}>Coordinated Universal Time UTC +05:30</Text>
            </View>
          </View>
        </View>

        {/* Location Card */}
        <View style={[styles.card, { marginTop: spacing.md }]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderIconContainer}>
              <Icon name="map-pin" size={16} color={colors.secondary} />
            </View>
            <Text style={styles.cardHeaderText}>Location</Text>
          </View>

          {!isVirtual && (
            <>
              {/* Search Location */}
              <View style={styles.searchBoxContainer}>
                <TextInput
                  style={styles.searchInput}
                  value={venueSearch}
                  onChangeText={setVenueSearch}
                  placeholder="Search for venue address..."
                  placeholderTextColor={colors.outline}
                />
                <Icon name="search" size={16} color={colors.onSurfaceVariant} style={styles.searchIcon} />
              </View>

              {/* Vector Map Illustration */}
              <View style={styles.mapContainer}>
                <Svg height="150" width={width - spacing.md * 4} style={StyleSheet.absoluteFill}>
                  <Rect x="0" y="0" width="100%" height="100%" fill={isDark ? '#1C1824' : '#F4F2F7'} />
                  {/* Styled Vector Roads */}
                  <Path d="M 0 40 L 400 40" stroke={isDark ? '#2D2837' : '#E5E0EA'} strokeWidth="12" />
                  <Path d="M 0 110 L 400 110" stroke={isDark ? '#2D2837' : '#E5E0EA'} strokeWidth="12" />
                  <Path d="M 80 0 L 80 150" stroke={isDark ? '#2D2837' : '#E5E0EA'} strokeWidth="16" />
                  <Path d="M 280 0 L 280 150" stroke={isDark ? '#2D2837' : '#E5E0EA'} strokeWidth="16" />
                  {/* River or Green block */}
                  <Rect x="120" y="60" width="120" height="30" fill={isDark ? '#14251C' : '#E8F5E9'} rx="6" />
                </Svg>

                {/* Floating Map Label */}
                <View style={styles.mapOverlayLabel}>
                  <View style={styles.mapIndicatorDot} />
                  <Text style={styles.mapOverlayText}>Digital Art Pavilion</Text>
                  <Text style={styles.mapOverlaySub}>Symphony Plaza, Sector 4</Text>
                </View>
              </View>
            </>
          )}

          {/* Virtual Event Switch Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setIsVirtual(!isVirtual)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, isVirtual && styles.checkboxChecked]}>
              {isVirtual && <Icon name="check" size={14} color="#ffffff" />}
            </View>
            <Text style={styles.checkboxLabel}>This is a virtual event (Zoom/Meet)</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={16} color={colors.onSurfaceVariant} style={{ marginRight: 8 }} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleContinue} 
            activeOpacity={0.8}
            style={[styles.continueButton, { backgroundColor: colors.secondary, flexDirection: 'row' }]}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Icon name="arrow-right" size={16} color={colors.onPrimary} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker Calendar Modal */}
      <DatePickerModal
        visible={pickerTarget !== null}
        title={pickerTarget === 'start' ? 'Select Start Date' : 'Select End Date'}
        initialDateStr={pickerTarget === 'start' ? startDate : endDate}
        onSelectDate={(newDate) => {
          if (pickerTarget === 'start') {
            setStartDate(newDate);
            setEndDate(newDate);
          } else {
            setEndDate(newDate);
          }
        }}
        onClose={() => setPickerTarget(null)}
      />

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={timePickerTarget !== null}
        title={timePickerTarget === 'start' ? 'Select Start Time' : 'Select End Time'}
        initialTimeStr={timePickerTarget === 'start' ? startTime : endTime}
        onSelectTime={(newTime) => {
          if (timePickerTarget === 'start') {
            setStartTime(newTime);
            setEndTime(getSampleEndTime(newTime));
          } else {
            setEndTime(newTime);
          }
        }}
        onClose={() => setTimePickerTarget(null)}
      />
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
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
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
    backgroundColor: colors.secondaryContainer,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    height: 48,
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
    borderTopColor: colors.outlineVariant,
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
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  chipActive: {
    backgroundColor: colors.secondaryContainer,
    borderColor: colors.secondary,
  },
  chipText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.secondary,
  },
  timezoneBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.secondary}1a`,
  },
  timezoneIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  timezoneTitle: {
    ...typography.labelMd,
    fontWeight: '600',
    color: colors.onSecondaryContainer,
  },
  timezoneSub: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSecondaryContainer,
    opacity: 0.8,
    marginTop: 2,
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    height: 48,
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
    borderColor: colors.outlineVariant,
    position: 'relative',
  },
  mapOverlayLabel: {
    position: 'absolute',
    top: 25,
    left: 80,
    backgroundColor: colors.surface,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  mapIndicatorDot: {
    position: 'absolute',
    left: -12,
    top: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
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
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
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
    marginBottom:50
  },
  backText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  continueButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    ...shadows.level1,
    marginBottom:50
  },
  continueText: {
    ...typography.bodyMd,
    color: '#ffffff',
    fontWeight: '600',
  },
});
