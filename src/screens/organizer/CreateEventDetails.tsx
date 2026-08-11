import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../../context/ThemeContext';
import { ColorsType } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';


interface CreateEventDetailsProps {
  navigation: any;
}

export default function CreateEventDetails({ navigation }: CreateEventDetailsProps) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [eventTitle, setEventTitle] = useState('');
  const [category, setCategory] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [tags, setTags] = useState(['High Priority']);
  const [newTagInput, setNewTagInput] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const categories = ['Conference', 'Summit', 'Webinar', 'Meetup', 'Workshop', 'Gala'];

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowTagInput(false);
    }
  };

  const handleMockUpload = () => {
    if (coverImage) {
      setCoverImage(null);
    } else {
      setCoverImage(
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'
      );
    }
  };

  const handleNextStep = () => {
    navigation.navigate('CreateEventTimeLocation', {
      eventData: {
        title: eventTitle || 'Global Innovation Summit 2024',
        category: category || 'Summit',
        tags,
        coverImage,
        description,
      },
    });
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
            <Text style={styles.progressPercent}>33% Complete</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '33%' }]} />
          </View>
        </View>

        {/* Stepper Tabs */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconActive]}>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>1</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Details</Text>
          </View>
          <View style={styles.stepDivider} />
          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>2</Text>
            </View>
            <Text style={styles.stepLabel}>Time & Location</Text>
          </View>
          <View style={styles.stepDivider} />
          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Text style={{ color: colors.onSurfaceVariant, fontSize: 12 }}>3</Text>
            </View>
            <Text style={styles.stepLabel}>Tickets</Text>
          </View>
        </View>

        <Text style={styles.pageTitle}>Event Details</Text>
        <Text style={styles.pageSubTitle}>Tell us about your event. Make it sound exciting and clear.</Text>

        {/* Cover Image Upload */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Cover Image</Text>
          {coverImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: coverImage }} style={styles.coverImagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={handleMockUpload}>
                <Icon name="trash-2" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} onPress={handleMockUpload} activeOpacity={0.7}>
              <View style={[styles.uploadIconCircle, { backgroundColor: colors.primaryContainer }]}>
                <Icon name="image" size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadTextBold}>Upload Cover Image</Text>
              <Text style={styles.uploadTextSub}>PNG, JPG up to 10MB (Suggested 16:9)</Text>
              <View style={styles.browseButton}>
                <Text style={styles.browseButtonText}>Browse Files</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Event Title */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Event Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Global Innovation Summit 2024"
            placeholderTextColor={colors.outline}
            value={eventTitle}
            onChangeText={setEventTitle}
          />
        </View>

        {/* Category Picker */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            activeOpacity={0.8}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.dropdownValue, !category && { color: colors.outline }]}>
              {category || 'Select category'}
            </Text>
            <Icon name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={styles.dropdownMenu}>
              {categories.map((cat) => {
                const isActive = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.dropdownItem, isActive && styles.dropdownItemActive]}
                    onPress={() => {
                      setCategory(cat);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <Text style={[styles.dropdownItemText, isActive && styles.dropdownItemTextActive]}>
                      {cat}
                    </Text>
                    {isActive && <Icon name="check" size={16} color={colors.secondary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Event Tags */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Event Tags</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  onPress={() => setTags(tags.filter((t) => t !== tag))}
                  style={{ marginLeft: 6 }}
                >
                  <Icon name="x" size={12} color={colors.onPrimaryFixedVariant} />
                </TouchableOpacity>
              </View>
            ))}

            {showTagInput ? (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagTextInput}
                  placeholder="Tag..."
                  placeholderTextColor={colors.outline}
                  value={newTagInput}
                  onChangeText={setNewTagInput}
                  onSubmitEditing={handleAddTag}
                  autoFocus
                  onBlur={() => setShowTagInput(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.addTagButton} onPress={() => setShowTagInput(true)}>
                <Icon name="plus" size={14} color={colors.secondary} />
                <Text style={styles.addTagText}>Add Tag</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Event Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Briefly describe the purpose and goals of your event..."
            placeholderTextColor={colors.outline}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Footer Actions */}
        <View style={styles.footerRow}>
          <TouchableOpacity style={styles.saveDraftButton}>
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleNextStep} 
            activeOpacity={0.8}
            style={[styles.nextButton, { backgroundColor: colors.secondary, flexDirection: 'row' }]}
          >
            <Text style={styles.nextButtonText}>Next Step</Text>
            <Icon name="arrow-right" size={16} color={colors.onPrimary} style={{ marginLeft: 8 }} />
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
  },
  progressPercent: {
    ...typography.labelSm,
    color: colors.secondary,
    fontWeight: '600',
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
  stepLabel: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  stepLabelActive: {
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
  formGroup: {
    marginBottom: spacing.md,
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
    paddingVertical: spacing.sm,
    color: colors.onSurface,
    ...typography.bodyMd,
    height: 48,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  dropdownTrigger: {
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
  dropdownValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  dropdownMenu: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    marginTop: 4,
    paddingVertical: spacing.xs,
    ...shadows.level1,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  dropdownItemActive: {
    backgroundColor: colors.surfaceContainerLow,
  },
  dropdownItemText: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  dropdownItemTextActive: {
    color: colors.secondary,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  tagText: {
    ...typography.labelSm,
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  addTagText: {
    ...typography.labelSm,
    color: colors.secondary,
    fontWeight: '600',
    marginLeft: 4,
  },
  tagInputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: radius.chip,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.surface,
  },
  tagTextInput: {
    ...typography.labelSm,
    padding: 0,
    width: 80,
    color: colors.onSurface,
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderStyle: 'dashed',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  uploadTextBold: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 4,
  },
  uploadTextSub: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  browseButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.button,
  },
  browseButtonText: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    height: 180,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  coverImagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.level1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveDraftButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom:50
  },
  saveDraftText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  nextButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
    ...shadows.level1,
    marginBottom:50,
  },
  nextButtonText: {
    ...typography.bodyMd,
    color: '#ffffff',
    fontWeight: '600',
  },
});
