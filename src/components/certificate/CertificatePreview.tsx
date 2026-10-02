import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CertificateData } from '../../types/certificate';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface Props {
  data: CertificateData;
}

export const CertificatePreview: React.FC<Props> = ({ data }) => {
  const { colors, isDark } = useTheme();

  const {
    participantName,
    participantId,
    department,
    college,
    eventName,
    eventType,
    eventDate,
    venue,
    certificateTitle,
    certificateDescription,
    certificateId,
    issueDate,
    signatoryName,
    signatoryDesignation,
    hostName,
    template,
  } = data;

  const displayParticipant = participantName.trim() || 'Participant Full Name';
  const displayEvent = eventName.trim() || 'Event Name Here';
  const displayTitle = certificateTitle.trim() || 'CERTIFICATE OF PARTICIPATION';
  const displayDesc =
    certificateDescription.trim() ||
    'For active participation and successful completion of all event activities.';
  const displayId = certificateId.trim() || 'ENC-2026-XXXX';
  const displaySignatory = signatoryName.trim() || 'Signatory Name';
  const displayDesignation = signatoryDesignation.trim() || 'Designation';

  if (template === 'classic') {
    return (
      <View style={[styles.container, shadows.level2, { backgroundColor: '#FDFBF7', borderColor: '#8B6B23', borderWidth: 4 }]}>
        <View style={styles.classicInner}>
          <Text style={styles.classicBrand}>ENCORE ACADEMIC</Text>
          <Text style={styles.classicTitle}>{displayTitle}</Text>
          <Text style={styles.classicSubtitle}>This certificate is proudly awarded to</Text>

          <Text style={styles.classicName}>{displayParticipant}</Text>
          <Text style={styles.classicDesc} numberOfLines={3}>
            {displayDesc}
          </Text>

          <View style={styles.classicMeta}>
            <Text style={styles.classicMetaText}>
              Event: {displayEvent} | Date: {eventDate || '2026-10-02'}
            </Text>
            {college ? (
              <Text style={styles.classicMetaSub}>
                {college} {department ? `(${department})` : ''} | ID: {participantId || 'PART-001'}
              </Text>
            ) : null}
          </View>

          <View style={styles.classicFooter}>
            <View style={styles.sigBox}>
              <Text style={styles.classicSigFont}>{displaySignatory}</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>{displayDesignation}</Text>
            </View>

            <View style={styles.sealCircle}>
              <Ionicons name="ribbon" size={24} color="#8B6B23" />
            </View>

            <View style={styles.sigBox}>
              <Text style={styles.classicDate}>{issueDate || '2026-10-02'}</Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>Issue Date</Text>
            </View>
          </View>

          <Text style={styles.certIdTag}>Verification ID: {displayId}</Text>
        </View>
      </View>
    );
  }

  if (template === 'elegant') {
    return (
      <View style={[styles.container, shadows.level2, { backgroundColor: '#16131A', borderColor: '#9D4EDD', borderWidth: 1.5 }]}>
        <View style={styles.elegantTop}>
          <View style={[styles.badge, { backgroundColor: '#9D4EDD' }]}>
            <Text style={styles.badgeText}>PREMIUM VERIFIED</Text>
          </View>
          <Text style={styles.elegantTitle}>{displayTitle}</Text>
        </View>

        <Text style={styles.elegantSub}>PRESENTED TO</Text>
        <Text style={styles.elegantName}>{displayParticipant}</Text>
        <Text style={styles.elegantDesc} numberOfLines={3}>
          {displayDesc}
        </Text>

        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>🎉 {displayEvent}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>📍 {venue || 'Main Venue'}</Text>
          </View>
        </View>

        <View style={styles.elegantFooter}>
          <View>
            <Text style={styles.sigNameDark}>{displaySignatory}</Text>
            <Text style={styles.sigSubDark}>{displayDesignation}</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.sigNameDark}>{issueDate || '2026-10-02'}</Text>
            <Text style={styles.sigSubDark}>ID: {displayId}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (template === 'minimal') {
    return (
      <View style={[styles.container, shadows.level2, { backgroundColor: '#ffffff', borderLeftWidth: 6, borderLeftColor: '#111111' }]}>
        <Text style={styles.minimalBrand}>ENCORE // CERTIFICATION</Text>
        <Text style={styles.minimalTitle}>{displayTitle}</Text>

        <View style={{ marginVertical: 8 }}>
          <Text style={styles.minimalSub}>RECIPIENT</Text>
          <Text style={styles.minimalName}>{displayParticipant}</Text>
          <Text style={styles.minimalDesc} numberOfLines={2}>{displayDesc}</Text>
        </View>

        <View style={styles.minimalGrid}>
          <View>
            <Text style={styles.minimalGridLabel}>EVENT</Text>
            <Text style={styles.minimalGridVal} numberOfLines={1}>{displayEvent}</Text>
          </View>
          <View>
            <Text style={styles.minimalGridLabel}>SIGNATORY</Text>
            <Text style={styles.minimalGridVal} numberOfLines={1}>{displaySignatory}</Text>
          </View>
        </View>

        <View style={styles.minimalFooter}>
          <Text style={styles.minimalId}>ID: {displayId}</Text>
          <Text style={styles.minimalId}>DATE: {issueDate || '2026-10-02'}</Text>
        </View>
      </View>
    );
  }

  // Modern Default (Orange / Purple Vibe)
  return (
    <View style={[styles.container, shadows.level2, { backgroundColor: colors.surface, borderColor: colors.outlineVariant, borderWidth: 1 }]}>
      <View style={styles.modernHeader}>
        <View style={styles.brandRow}>
          <Text style={[styles.modernBrand, { color: colors.primary }]}>
            ENCORE<Text style={{ color: colors.secondary }}>.APP</Text>
          </Text>
          <View style={[styles.modernTag, { backgroundColor: colors.secondaryContainer }]}>
            <Text style={[styles.modernTagText, { color: colors.secondary }]}>
              {eventType.toUpperCase() || 'PARTICIPATION'}
            </Text>
          </View>
        </View>
        <Text style={[styles.modernTitle, { color: colors.onSurface }]}>
          {displayTitle}
        </Text>
      </View>

      <View style={styles.modernCenter}>
        <Text style={[styles.modernPresented, { color: colors.onSurfaceVariant }]}>
          PROUDLY PRESENTED TO
        </Text>
        <Text style={[styles.modernName, { color: colors.secondary }]}>
          {displayParticipant}
        </Text>
        <Text style={[styles.modernDesc, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
          {displayDesc}
        </Text>

        <View style={[styles.modernHighlight, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[styles.modernHighlightText, { color: colors.onPrimaryContainer }]} numberOfLines={1}>
            🏆 {displayEvent} — {eventDate || '2026-10-02'}
          </Text>
        </View>
      </View>

      <View style={[styles.modernFooter, { borderTopColor: colors.outlineVariant }]}>
        <View>
          <Text style={[styles.sigName, { color: colors.onSurface }]}>{displaySignatory}</Text>
          <Text style={[styles.sigSub, { color: colors.onSurfaceVariant }]}>
            {displayDesignation} {hostName ? `(${hostName})` : ''}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.sigSub, { color: colors.onSurfaceVariant }]}>
            ID: {displayId}
          </Text>
          <Text style={[styles.sigName, { color: colors.onSurface, fontSize: 12 }]}>
            Issue: {issueDate || '2026-10-02'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.card,
    padding: spacing.md,
    minHeight: 220,
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  // Classic Template Styles
  classicInner: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  classicBrand: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#8B6B23',
    fontWeight: '700',
  },
  classicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B6B23',
    textAlign: 'center',
    marginVertical: 2,
  },
  classicSubtitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#666666',
  },
  classicName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1f36',
    marginVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#8B6B23',
    paddingBottom: 2,
  },
  classicDesc: {
    fontSize: 11,
    textAlign: 'center',
    color: '#444444',
    lineHeight: 15,
  },
  classicMeta: {
    alignItems: 'center',
    marginVertical: 4,
  },
  classicMetaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333333',
  },
  classicMetaSub: {
    fontSize: 10,
    color: '#666666',
  },
  classicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  sigBox: {
    alignItems: 'center',
    width: 90,
  },
  classicSigFont: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sigLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#8B6B23',
    marginVertical: 2,
  },
  sigLabel: {
    fontSize: 9,
    color: '#666666',
  },
  sealCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: '#8B6B23',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF9',
  },
  classicDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  certIdTag: {
    fontSize: 9,
    color: '#888888',
    marginTop: 4,
  },

  // Elegant Template Styles
  elegantTop: {
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  elegantTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
  },
  elegantSub: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#a69fb0',
    textAlign: 'center',
  },
  elegantName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginVertical: 4,
  },
  elegantDesc: {
    fontSize: 11,
    color: '#edeaf0',
    textAlign: 'center',
    lineHeight: 15,
  },
  pillRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 6,
  },
  pill: {
    backgroundColor: '#272230',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.chip,
  },
  pillText: {
    fontSize: 10,
    color: '#edeaf0',
  },
  elegantFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#322d3d',
    paddingTop: 8,
  },
  sigNameDark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  sigSubDark: {
    fontSize: 10,
    color: '#a69fb0',
  },

  // Minimal Template Styles
  minimalBrand: {
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '800',
    color: '#666',
  },
  minimalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
  },
  minimalSub: {
    fontSize: 9,
    letterSpacing: 1,
    color: '#888',
  },
  minimalName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
  },
  minimalDesc: {
    fontSize: 11,
    color: '#444444',
  },
  minimalGrid: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 6,
  },
  minimalGridLabel: {
    fontSize: 8,
    color: '#888',
    fontWeight: '700',
  },
  minimalGridVal: {
    fontSize: 11,
    fontWeight: '600',
    color: '#111',
  },
  minimalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 6,
  },
  minimalId: {
    fontSize: 9,
    color: '#666',
    fontFamily: 'monospace',
  },

  // Modern Template Styles
  modernHeader: {
    gap: 2,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modernBrand: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  modernTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.chip,
  },
  modernTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  modernTitle: {
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 2,
  },
  modernCenter: {
    alignItems: 'center',
    marginVertical: 4,
  },
  modernPresented: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
  modernName: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 2,
  },
  modernDesc: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 15,
  },
  modernHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.chip,
    marginTop: 6,
  },
  modernHighlightText: {
    fontSize: 11,
    fontWeight: '700',
  },
  modernFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  sigName: {
    fontSize: 12,
    fontWeight: '700',
  },
  sigSub: {
    fontSize: 10,
  },
});
