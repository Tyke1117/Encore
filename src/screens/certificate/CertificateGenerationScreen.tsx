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
import { CertificateData, CertificateTemplateId, ValidationErrors } from '../../types/certificate';
import { CertificateTemplateSelector } from '../../components/certificate/CertificateTemplateSelector';
import { CertificatePreview } from '../../components/certificate/CertificatePreview';
import { CertificateForm } from '../../components/certificate/CertificateForm';
import { generateCertificatePDF, saveCertificateMetadata } from '../../services/certificateService';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

export const CertificateGenerationScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  const [data, setData] = useState<CertificateData>({
    participantName: 'Alex Johnson',
    participantId: 'PART-2026-90',
    department: 'Computer Science',
    college: 'Stanford University',
    email: 'alex.j@example.com',
    eventName: 'Global AI & Web3 Summit',
    eventType: 'Participation',
    eventDate: '2026-10-15',
    venue: 'Tech Auditorium B',
    duration: '2 Days',
    organizerName: 'Encore Team',
    hostName: 'Encore Global',
    certificateTitle: 'CERTIFICATE OF PARTICIPATION',
    certificateDescription: 'for active participation and successful completion of all workshops & developer hackathon sessions.',
    certificateId: 'ENC-2026-9901',
    issueDate: '2026-10-15',
    signatoryName: 'Dr. Marcus Vance',
    signatoryDesignation: 'Executive Director',
    template: 'modern',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFieldChange = (field: keyof CertificateData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field as keyof ValidationErrors]: undefined }));
    }
  };

  const handleSelectTemplate = (template: CertificateTemplateId) => {
    setData((prev) => ({ ...prev, template }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!data.participantName.trim()) newErrors.participantName = 'Participant Name is required';
    if (!data.participantId.trim()) newErrors.participantId = 'Participant ID is required';
    if (!data.college.trim()) newErrors.college = 'College/Institution is required';
    if (!data.eventName.trim()) newErrors.eventName = 'Event Name is required';
    if (!data.eventDate.trim()) newErrors.eventDate = 'Event Date is required';
    if (!data.certificateTitle.trim()) newErrors.certificateTitle = 'Certificate Title is required';
    if (!data.certificateId.trim()) newErrors.certificateId = 'Certificate ID is required';
    if (!data.issueDate.trim()) newErrors.issueDate = 'Issue Date is required';
    if (!data.signatoryName.trim()) newErrors.signatoryName = 'Signatory Name is required';

    if (data.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeneratePDF = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all mandatory fields before generating.');
      return;
    }

    setIsGenerating(true);
    try {
      // 1. Save metadata locally & structurally for Firestore
      const certId = await saveCertificateMetadata(data);
      const updatedData = { ...data, id: certId };

      // 2. Compile Real PDF via expo-print
      const pdfResult = await generateCertificatePDF(updatedData);

      setIsGenerating(false);

      // 3. Navigate to preview success screen
      navigation.navigate('CertificatePreviewScreen', {
        certificateData: updatedData,
        pdfUri: pdfResult.uri,
        htmlContent: pdfResult.html,
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      setIsGenerating(false);
      Alert.alert('Generation Failed', 'Could not generate PDF. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navigation Top Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.onSurface }]}>Certificate Generator</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Live Certificate Preview Box */}
        <View style={styles.previewHeaderRow}>
          <Text style={[styles.sectionHeading, { color: colors.onSurface }]}>Live Certificate Preview</Text>
          <View style={[styles.liveBadge, { backgroundColor: colors.secondaryContainer }]}>
            <View style={[styles.liveDot, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.liveText, { color: colors.secondary }]}>REAL-TIME</Text>
          </View>
        </View>

        <CertificatePreview data={data} />

        {/* Template Selector Cards */}
        <CertificateTemplateSelector
          selectedTemplate={data.template}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Certificate Form Accordion */}
        <CertificateForm data={data} onChange={handleFieldChange} errors={errors} />

        {/* Action Button */}
        <View style={styles.actionWrap}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleGeneratePDF}
            disabled={isGenerating}
            style={[
              styles.generateBtn,
              { backgroundColor: colors.primary },
              shadows.interactive,
            ]}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="document-text" size={20} color="#ffffff" />
                <Text style={styles.generateBtnText}>Generate Real Certificate PDF</Text>
              </>
            )}
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
  topBarTitle: {
    ...typography.headlineMd,
    fontSize: 17,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  previewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  sectionHeading: {
    ...typography.headlineMd,
    fontSize: 16,
    fontWeight: '700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.chip,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionWrap: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  generateBtn: {
    height: 52,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  generateBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
