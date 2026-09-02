import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/fonts';
import { shadows } from '../theme/shadows';

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectTime: (formatted24hTime: string) => void;
  initialTimeStr?: string; // "HH:MM" in 24h
  title?: string;
}

const DIAL_SIZE = 240;
const CENTER = DIAL_SIZE / 2; // 120
const RADIUS = 88;
const ITEM_SIZE = 36;

const HOURS_LIST = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const MINUTES_LIST = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function TimePickerModal({
  visible,
  onClose,
  onSelectTime,
  initialTimeStr,
  title = 'Select Time',
}: TimePickerModalProps) {
  const { colors } = useTheme();

  // Parse initial time
  const parseInitial = () => {
    let h = 7;
    let m = 0;
    let p: 'AM' | 'PM' = 'PM';

    if (initialTimeStr && initialTimeStr.includes(':')) {
      const parts = initialTimeStr.split(':').map((x) => parseInt(x, 10));
      if (parts.length >= 2 && !isNaN(parts[0])) {
        const rawH = parts[0];
        p = rawH >= 12 ? 'PM' : 'AM';
        h = rawH % 12 === 0 ? 12 : rawH % 12;
        m = isNaN(parts[1]) ? 0 : parts[1];
      }
    }
    return { h, m, p };
  };

  const initial = parseInitial();
  const [mode, setMode] = useState<'hours' | 'minutes'>('hours');
  const [selectedHour, setSelectedHour] = useState<number>(initial.h);
  const [selectedMinute, setSelectedMinute] = useState<number>(initial.m);
  const [period, setPeriod] = useState<'AM' | 'PM'>(initial.p);

  const handleSelectHour = (h: number) => {
    setSelectedHour(h);
    // Smoothly transition to minute selection
    setMode('minutes');
  };

  const handleSelectMinute = (m: number) => {
    setSelectedMinute(m);
  };

  const handleConfirm = () => {
    let hours24 = selectedHour;
    if (period === 'PM' && selectedHour < 12) {
      hours24 = selectedHour + 12;
    } else if (period === 'AM' && selectedHour === 12) {
      hours24 = 0;
    }

    const hh = String(hours24).padStart(2, '0');
    const mm = String(selectedMinute).padStart(2, '0');
    onSelectTime(`${hh}:${mm}`);
    onClose();
  };

  // Calculate pointer angle
  const activeAngleDeg =
    mode === 'hours'
      ? (selectedHour % 12) * 30
      : (selectedMinute / 60) * 360;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header Title */}
          <View style={styles.headerRow}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="x" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Digital Time & AM/PM Selector */}
          <View style={styles.digitalHeaderRow}>
            {/* Hour & Minute Display Box */}
            <View style={styles.timeDigitGroup}>
              <TouchableOpacity
                style={[
                  styles.digitBox,
                  { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant },
                  mode === 'hours' && [styles.digitBoxActive, { backgroundColor: `${colors.secondary}18`, borderColor: colors.secondary }],
                ]}
                onPress={() => setMode('hours')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.digitText,
                    { color: mode === 'hours' ? colors.secondary : colors.onSurface },
                  ]}
                >
                  {String(selectedHour).padStart(2, '0')}
                </Text>
              </TouchableOpacity>

              <Text style={[styles.colonText, { color: colors.onSurface }]}>:</Text>

              <TouchableOpacity
                style={[
                  styles.digitBox,
                  { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant },
                  mode === 'minutes' && [styles.digitBoxActive, { backgroundColor: `${colors.secondary}18`, borderColor: colors.secondary }],
                ]}
                onPress={() => setMode('minutes')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.digitText,
                    { color: mode === 'minutes' ? colors.secondary : colors.onSurface },
                  ]}
                >
                  {String(selectedMinute).padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* AM / PM Toggle Pill */}
            <View style={[styles.ampmPill, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
              <TouchableOpacity
                style={[
                  styles.ampmBtn,
                  period === 'AM' && [styles.ampmBtnActive, { backgroundColor: colors.secondary }],
                ]}
                onPress={() => setPeriod('AM')}
                activeOpacity={0.8}
              >
                <Text style={[styles.ampmText, period === 'AM' ? styles.ampmTextActive : { color: colors.onSurfaceVariant }]}>
                  AM
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ampmBtn,
                  period === 'PM' && [styles.ampmBtnActive, { backgroundColor: colors.secondary }],
                ]}
                onPress={() => setPeriod('PM')}
                activeOpacity={0.8}
              >
                <Text style={[styles.ampmText, period === 'PM' ? styles.ampmTextActive : { color: colors.onSurfaceVariant }]}>
                  PM
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mode Switcher Indicator */}
          <View style={styles.modeTabsRow}>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'hours' && [styles.modeTabActive, { borderBottomColor: colors.secondary }]]}
              onPress={() => setMode('hours')}
            >
              <Text style={[styles.modeTabText, mode === 'hours' ? { color: colors.secondary, fontWeight: '700' } : { color: colors.onSurfaceVariant }]}>
                Select Hour
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeTab, mode === 'minutes' && [styles.modeTabActive, { borderBottomColor: colors.secondary }]]}
              onPress={() => setMode('minutes')}
            >
              <Text style={[styles.modeTabText, mode === 'minutes' ? { color: colors.secondary, fontWeight: '700' } : { color: colors.onSurfaceVariant }]}>
                Select Minute
              </Text>
            </TouchableOpacity>
          </View>

          {/* Analog Clock Face Dial */}
          <View style={styles.clockContainer}>
            <View style={[styles.clockDial, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
              {/* Rotating Clock Hand */}
              <View
                style={[
                  styles.clockHandRotator,
                  {
                    transform: [{ rotate: `${activeAngleDeg}deg` }],
                  },
                ]}
                pointerEvents="none"
              >
                <View style={[styles.clockHandLine, { backgroundColor: colors.secondary }]} />
                <View style={[styles.clockHandBulb, { backgroundColor: colors.secondary }]} />
              </View>

              {/* Center Pivot Point */}
              <View style={[styles.centerPivot, { backgroundColor: colors.secondary }]} />

              {/* Clock Face Numbers */}
              {mode === 'hours'
                ? HOURS_LIST.map((h) => {
                    const angleRad = (h % 12) * (Math.PI / 6);
                    const x = CENTER + RADIUS * Math.sin(angleRad) - ITEM_SIZE / 2;
                    const y = CENTER - RADIUS * Math.cos(angleRad) - ITEM_SIZE / 2;
                    const isSelected = selectedHour === h;

                    return (
                      <TouchableOpacity
                        key={`hour-${h}`}
                        style={[
                          styles.numberCell,
                          { left: x, top: y },
                        ]}
                        onPress={() => handleSelectHour(h)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.numberText,
                            { color: isSelected ? '#ffffff' : colors.onSurface },
                            isSelected && { fontWeight: '700' },
                          ]}
                        >
                          {h}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                : MINUTES_LIST.map((m) => {
                    const angleRad = (m / 60) * (2 * Math.PI);
                    const x = CENTER + RADIUS * Math.sin(angleRad) - ITEM_SIZE / 2;
                    const y = CENTER - RADIUS * Math.cos(angleRad) - ITEM_SIZE / 2;
                    const isSelected = selectedMinute === m;

                    return (
                      <TouchableOpacity
                        key={`minute-${m}`}
                        style={[
                          styles.numberCell,
                          { left: x, top: y },
                        ]}
                        onPress={() => handleSelectMinute(m)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.numberText,
                            { color: isSelected ? '#ffffff' : colors.onSurface },
                            isSelected && { fontWeight: '700' },
                          ]}
                        >
                          {String(m).padStart(2, '0')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
            </View>
          </View>

          {/* Footer Actions */}
          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={[styles.cancelBtnText, { color: colors.onSurfaceVariant }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: colors.secondary }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Confirm Time</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.level2,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  modalTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  closeBtn: {
    padding: spacing.xs,
  },
  digitalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  timeDigitGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  digitBox: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.md,
    borderWidth: 1.5,
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digitBoxActive: {
    borderWidth: 1.5,
  },
  digitText: {
    fontSize: 26,
    fontWeight: '800',
  },
  colonText: {
    fontSize: 24,
    fontWeight: '800',
  },
  ampmPill: {
    flexDirection: 'column',
    borderRadius: radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  ampmBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ampmBtnActive: {},
  ampmText: {
    ...typography.labelSm,
    fontWeight: '700',
    fontSize: 12,
  },
  ampmTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  modeTabsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: spacing.md,
  },
  modeTab: {
    paddingVertical: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingHorizontal: spacing.sm,
  },
  modeTabActive: {},
  modeTabText: {
    ...typography.labelSm,
    fontSize: 13,
  },
  clockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  clockDial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPivot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  clockHandRotator: {
    position: 'absolute',
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 5,
  },
  clockHandLine: {
    position: 'absolute',
    top: CENTER - RADIUS,
    width: 2.5,
    height: RADIUS,
  },
  clockHandBulb: {
    position: 'absolute',
    top: CENTER - RADIUS - ITEM_SIZE / 2,
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    ...shadows.level1,
  },
  numberCell: {
    position: 'absolute',
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 8,
  },
  numberText: {
    ...typography.bodyMd,
    fontSize: 14,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cancelBtnText: {
    ...typography.labelMd,
    fontWeight: '600',
  },
  confirmBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
  },
  confirmBtnText: {
    color: '#ffffff',
    ...typography.labelMd,
    fontWeight: '700',
  },
});
