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

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (formattedDate: string) => void;
  initialDateStr?: string; // "DD-MM-YYYY"
  title?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS_HEADER = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePickerModal({
  visible,
  onClose,
  onSelectDate,
  initialDateStr,
  title = 'Select Date',
}: DatePickerModalProps) {
  const { colors } = useTheme();

  // Parse initial date or default to today
  const parseInitialDate = () => {
    if (initialDateStr) {
      const parts = initialDateStr.split(/[-/]/).map((p) => parseInt(p, 10));
      if (parts.length === 3) {
        if (parts[0] > 1000) {
          return new Date(parts[0], parts[1] - 1, parts[2]);
        }
        return new Date(parts[2], parts[1] - 1, parts[0]);
      }
    }
    return new Date();
  };

  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(parseInitialDate);
  const [selectedDate, setSelectedDate] = useState<Date>(parseInitialDate);

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Days in month calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const chosen = new Date(year, month, day);
    setSelectedDate(chosen);
  };

  const handleConfirm = () => {
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const y = selectedDate.getFullYear();
    onSelectDate(`${d}-${m}-${y}`);
    onClose();
  };

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Build grid cells
  const gridCells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    gridCells.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    gridCells.push(d);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="x" size={20} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Month Navigation */}
          <View style={styles.monthNavRow}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navArrowBtn}>
              <Icon name="chevron-left" size={20} color={colors.onSurface} />
            </TouchableOpacity>
            <Text style={[styles.monthYearText, { color: colors.onSurface }]}>
              {MONTH_NAMES[month]} {year}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navArrowBtn}>
              <Icon name="chevron-right" size={20} color={colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Days of Week Header */}
          <View style={styles.daysHeaderRow}>
            {DAYS_HEADER.map((d, index) => (
              <Text key={index} style={[styles.dayHeaderCell, { color: colors.onSurfaceVariant }]}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.gridContainer}>
            {gridCells.map((dayNum, index) => {
              if (dayNum === null) {
                return <View key={index} style={styles.dayCell} />;
              }

              const isSelected =
                selectedDate.getFullYear() === year &&
                selectedDate.getMonth() === month &&
                selectedDate.getDate() === dayNum;

              const isToday = isCurrentMonth && today.getDate() === dayNum;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isSelected && [styles.dayCellSelected, { backgroundColor: colors.secondary }],
                    !isSelected && isToday && [styles.dayCellToday, { borderColor: colors.secondary }],
                  ]}
                  onPress={() => handleSelectDay(dayNum)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayCellText,
                      { color: isSelected ? '#ffffff' : colors.onSurface },
                      isSelected && { fontWeight: '700' },
                      !isSelected && isToday && { color: colors.secondary, fontWeight: '700' },
                    ]}
                  >
                    {dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
              <Text style={styles.confirmBtnText}>Confirm Date</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.level2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  closeBtn: {
    padding: spacing.xs,
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  monthYearText: {
    ...typography.bodyMd,
    fontWeight: '700',
    fontSize: 16,
  },
  navArrowBtn: {
    padding: spacing.xs,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.xs,
  },
  dayHeaderCell: {
    width: 38,
    textAlign: 'center',
    ...typography.labelSm,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dayCell: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
    borderRadius: radius.full,
  },
  dayCellSelected: {
    borderRadius: 19,
  },
  dayCellToday: {
    borderWidth: 1.5,
    borderRadius: 19,
  },
  dayCellText: {
    ...typography.bodyMd,
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
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
