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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

interface CreateEventDetailsProps {
  navigation: any;
}

export default function CreateEventDetails({ navigation }: CreateEventDetailsProps) {
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
    // Mock upload by setting a high-quality placeholder image
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
            <Text style={styles.progressText}>Step 1 of 4</Text>
            <Text style={styles.progressPercent}>25% Completed</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '25%' }]} />
          </View>
        </View>

        {/* Stepper Tabs */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepIconContainer, styles.stepIconActive]}>
              <Icon name="file-text" size={16} color={colors.onSecondary} />
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Details</Text>
          </View>
          <View style={styles.stepDivider} />
          
          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Icon name="calendar" size={16} color={colors.outline} />
            </View>
            <Text style={styles.stepLabel}>Schedule</Text>
          </View>
          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Icon name="map-pin" size={16} color={colors.outline} />
            </View>
            <Text style={styles.stepLabel}>Venue</Text>
          </View>
          <View style={styles.stepDivider} />

          <View style={styles.stepItem}>
            <View style={styles.stepIconContainer}>
              <Icon name="check-square" size={16} color={colors.outline} />
            </View>
            <Text style={styles.stepLabel}>Review</Text>
          </View>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Event Details</Text>
        <Text style={styles.pageSubTitle}>
          Define the core identity of your upcoming event. This information will be displayed to all
          potential attendees.
        </Text>

        {/* Form Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Event Title</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Global Innovation Summit 2024"
            placeholderTextColor={colors.outline}
            value={eventTitle}
            onChangeText={setEventTitle}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Category</Text>
          <TouchableOpacity
            style={styles.dropdownTrigger}
            activeOpacity={0.8}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.dropdownValue, !category && { color: colors.outline }]}>
              {category || 'Select an event type'}
            </Text>
            <Icon name={showCategoryPicker ? 'chevron-up' : 'chevron-down'} size={18} color={colors.onSurfaceVariant} />
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={styles.dropdownMenu}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.dropdownItem, category === cat && styles.dropdownItemActive]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, category === cat && styles.dropdownItemTextActive]}>
                    {cat}
                  </Text>
                  {category === cat && <Icon name="check" size={14} color={colors.secondary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Internal Tag</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity
                  onPress={() => setTags(tags.filter((t) => t !== tag))}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Icon name="x" size={12} color={colors.primary} style={{ marginLeft: 4 }} />
                </TouchableOpacity>
              </View>
            ))}

            {showTagInput ? (
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagTextInput}
                  placeholder="Tag name"
                  placeholderTextColor={colors.outline}
                  autoFocus
                  value={newTagInput}
                  onChangeText={setNewTagInput}
                  onSubmitEditing={handleAddTag}
                  onBlur={() => setShowTagInput(false)}
                />
              </View>
            ) : (
              <TouchableOpacity style={styles.addTagButton} onPress={() => setShowTagInput(true)}>
                <Icon name="plus" size={12} color={colors.secondary} />
                <Text style={styles.addTagText}>Add Tag</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.fieldLabel}>Upload Cover Image</Text>
          {coverImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: coverImage }} style={styles.coverImagePreview} />
              <TouchableOpacity style={styles.removeImageButton} onPress={handleMockUpload}>
                <Icon name="trash-2" size={16} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8} onPress={handleMockUpload}>
              <View style={styles.uploadIconCircle}>
                <Icon name="image" size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadTextBold}>Drag and drop artwork</Text>
              <Text style={styles.uploadTextSub}>1600 x 900px recommended (Max 5MB)</Text>
              <View style={styles.browseButton}>
                <Text style={styles.browseButtonText}>Browse Files</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

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
          <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
            <Text style={styles.nextButtonText}>Next Step</Text>
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
  },
  progressPercent: {
    ...typography.labelSm,
    color: colors.primary,
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
    backgroundColor: colors.primaryContainer,
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
  dropdownTrigger: {
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
  dropdownValue: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  dropdownMenu: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.slate[200],
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
    backgroundColor: colors.surfaceContainer,
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
    backgroundColor: colors.primaryFixed,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  tagText: {
    ...typography.labelSm,
    color: colors.onPrimaryFixedVariant,
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
    backgroundColor: colors.surfaceContainerLow,
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
    backgroundColor: colors.surfaceContainerLow,
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
    backgroundColor: colors.primaryFixed,
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
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.slate[200],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.button,
  },
  browseButtonText: {
    ...typography.labelMd,
    color: colors.slate[900],
    fontWeight: '600',
  },
  imagePreviewContainer: {
    height: 180,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.slate[200],
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
    backgroundColor: colors.surfaceContainerLowest,
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
  },
  saveDraftText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryContainer,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.button,
  },
  nextButtonText: {
    ...typography.bodyMd,
    color: colors.onPrimary,
    fontWeight: '600',
  },
  // Bottom navigation styles removed
});
