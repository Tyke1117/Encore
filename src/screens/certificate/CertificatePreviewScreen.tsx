import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CertificateData } from '../../types/certificate';
import { CertificatePreview } from '../../components/certificate/CertificatePreview';
import { shareOrDownloadCertificate } from '../../services/certificateService';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

export const CertificatePreviewScreen = ({ route, navigation }: any) => {
  const { colors } = useTheme();

  const certificateData: CertificateData = route.params?.certificateData || {};
  const pdfUri: string = route.params?.pdfUri || '';
  const htmlContent: string = route.params?.htmlContent || '';

  const [isSharing, setIsSharing] = useState(false);

  const handleShareOrDownload = async () => {
    setIsSharing(true);
    try {
      const success = await shareOrDownloadCertificate(pdfUri, htmlContent, `Certificate_${certificateData.certificateId || 'Encore'}.pdf`);
      setIsSharing(false);
      if (success) {
        Alert.alert('Success', 'Certificate shared / download initiated successfully!');
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      setIsSharing(false);
      Alert.alert('Sharing Error', 'Failed to share certificate. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.onSurface }]}>Generated Certificate</Text>
        <TouchableOpacity onPress={handleShareOrDownload} style={styles.headerIconBtn}>
          <Ionicons name="share-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Banner */}
        <View style={[styles.successBanner, { backgroundColor: colors.primaryContainer }]}>
          <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="checkmark" size={24} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.successTitle, { color: colors.onPrimaryContainer }]}>
              Certificate Ready!
            </Text>
            <Text style={[styles.successSub, { color: colors.onPrimaryContainer }]}>
              ID: {certificateData.certificateId || 'ENC-2026-CERT'}
            </Text>
          </View>
        </View>

        {/* Certificate Visual Preview */}
        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.onSurface }]}>Certificate Preview</Text>
          <CertificatePreview data={certificateData} />
        </View>

        {/* Details Card */}
        <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <Text style={[styles.cardHeading, { color: colors.onSurface }]}>Certificate Information</Text>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.onSurfaceVariant }]}>Recipient Name:</Text>
            <Text style={[styles.detailValue, { color: colors.onSurface }]}>{certificateData.participantName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.onSurfaceVariant }]}>Participant ID:</Text>
            <Text style={[styles.detailValue, { color: colors.onSurface }]}>{certificateData.participantId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.onSurfaceVariant }]}>Event Title:</Text>
            <Text style={[styles.detailValue, { color: colors.onSurface }]}>{certificateData.eventName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.onSurfaceVariant }]}>Institution:</Text>
            <Text style={[styles.detailValue, { color: colors.onSurface }]}>{certificateData.college || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.onSurfaceVariant }]}>Issue Date:</Text>
            <Text style={[styles.detailValue, { color: colors.onSurface }]}>{certificateData.issueDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.onSurfaceVariant }]}>Signatory:</Text>
            <Text style={[styles.detailValue, { color: colors.onSurface }]}>{certificateData.signatoryName} ({certificateData.signatoryDesignation})</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleShareOrDownload}
            disabled={isSharing}
            style={[styles.primaryBtn, { backgroundColor: colors.primary }, shadows.interactive]}
          >
            {isSharing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="download-outline" size={20} color="#ffffff" />
                <Text style={styles.primaryBtnText}>Download / Print Certificate PDF</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('CertificateGenerationScreen')}
            style={[styles.secondaryBtn, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.onSurface} />
            <Text style={[styles.secondaryBtnText, { color: colors.onSurface }]}>Generate Another Certificate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtn: {
    padding: spacing.xs,
  },
  topBarTitle: {
    ...typography.headlineMd,
    fontSize: 17,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.card,
    gap: spacing.md,
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
  },
  successSub: {
    ...typography.labelSm,
    fontSize: 12,
  },
  sectionWrap: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
  },
  detailsCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    gap: spacing.sm,
  },
  cardHeading: {
    ...typography.headlineMd,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  detailLabel: {
    ...typography.bodyMd,
    fontSize: 13,
  },
  detailValue: {
    ...typography.bodyMd,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: '55%',
    textAlign: 'right',
  },
  buttonGroup: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  primaryBtn: {
    height: 52,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    height: 50,
    borderRadius: radius.button,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
