import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CertificateTemplateId, TemplateOption } from '../../types/certificate';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface Props {
  selectedTemplate: CertificateTemplateId;
  onSelectTemplate: (id: CertificateTemplateId) => void;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Accent',
    description: 'Vibrant Encore purple/orange design with modern layout',
    primaryColor: '#7B2CBF',
    accentColor: '#FF5E1A',
    tag: 'POPULAR',
  },
  {
    id: 'classic',
    name: 'Classic Formal',
    description: 'Traditional double gold border & ornate font hierarchy',
    primaryColor: '#8B6B23',
    accentColor: '#D4AF37',
    tag: 'ACADEMIC',
  },
  {
    id: 'elegant',
    name: 'Elegant Dark',
    description: 'Sleek luxury dark theme with glowing neon highlights',
    primaryColor: '#9D4EDD',
    accentColor: '#FF3399',
    tag: 'PREMIUM',
  },
  {
    id: 'minimal',
    name: 'Minimal Mono',
    description: 'High contrast black & white clean grid typography',
    primaryColor: '#111111',
    accentColor: '#666666',
    tag: 'CLEAN',
  },
];

export const CertificateTemplateSelector: React.FC<Props> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>
        Select Certificate Template
      </Text>
      <Text style={[styles.sectionSubtitle, { color: colors.onSurfaceVariant }]}>
        Tap a style to instantly switch live preview
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TEMPLATE_OPTIONS.map((item) => {
          const isSelected = selectedTemplate === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => onSelectTemplate(item.id)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.primary : colors.outlineVariant,
                  borderWidth: isSelected ? 2 : 1,
                },
                isSelected ? shadows.interactive : shadows.level1,
              ]}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.primaryColor },
                  ]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: item.accentColor, marginLeft: -6 },
                  ]}
                />
                <View style={[styles.tagBadge, { backgroundColor: colors.surfaceVariant }]}>
                  <Text style={[styles.tagText, { color: colors.onSurfaceVariant }]}>
                    {item.tag}
                  </Text>
                </View>
                {isSelected && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={14} color="#ffffff" />
                  </View>
                )}
              </View>

              <Text style={[styles.templateName, { color: colors.onSurface }]}>
                {item.name}
              </Text>

              <Text style={[styles.templateDesc, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                {item.description}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
  },
  sectionSubtitle: {
    ...typography.bodyMd,
    fontSize: 13,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  card: {
    width: 170,
    padding: spacing.md,
    borderRadius: radius.card,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.chip,
    marginLeft: spacing.xs,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  checkCircle: {
    marginLeft: 'auto',
    width: 22,
    height: 22,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateName: {
    ...typography.bodyLg,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  templateDesc: {
    ...typography.labelSm,
    fontSize: 11,
    lineHeight: 14,
  },
});
