import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { CertificateData, ValidationErrors } from '../../types/certificate';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/fonts';

interface Props {
  data: CertificateData;
  onChange: (field: keyof CertificateData, value: string) => void;
  errors: ValidationErrors;
}

export const CertificateForm: React.FC<Props> = ({ data, onChange, errors }) => {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = React.useState<'participant' | 'event' | 'organizer' | 'cert' | 'signatory'>('participant');

  const renderSectionHeader = (
    key: 'participant' | 'event' | 'organizer' | 'cert' | 'signatory',
    title: string,
    iconName: React.ComponentProps<typeof Ionicons>['name'],
    hasError: boolean
  ) => {
    const isExpanded = activeSection === key;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setActiveSection(isExpanded ? ('' as any) : key)}
        style={[
          styles.accordionHeader,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: hasError ? colors.error : colors.outlineVariant,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: colors.secondaryContainer }]}>
            <Ionicons name={iconName} size={18} color={colors.secondary} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>{title}</Text>
          {hasError && (
            <View style={[styles.errorDot, { backgroundColor: colors.error }]} />
          )}
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    );
  };

  const renderInput = (
    field: keyof CertificateData,
    label: string,
    placeholder: string,
    error?: string,
    keyboardType: 'default' | 'email-address' | 'numeric' = 'default',
    multiline: boolean = false
  ) => {
    return (
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.onSurface }]}>
          {label} <Text style={{ color: colors.error }}>*</Text>
        </Text>
        <TextInput
          value={data[field] as string}
          onChangeText={(val) => onChange(field, val)}
          placeholder={placeholder}
          placeholderTextColor={colors.onSurfaceVariant + '80'}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            {
              backgroundColor: colors.surface,
              color: colors.onSurface,
              borderColor: error ? colors.error : colors.outlineVariant,
            },
          ]}
        />
        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : null}
      </View>
    );
  };

  const hasParticipantError = !!(errors.participantName || errors.participantId || errors.college || errors.email);
  const hasEventError = !!(errors.eventName || errors.eventDate);
  const hasCertError = !!(errors.certificateTitle || errors.certificateId || errors.issueDate);
  const hasSigError = !!errors.signatoryName;

  return (
    <View style={styles.container}>
      {/* 1. Participant Info */}
      {renderSectionHeader('participant', '1. Participant Information', 'person', hasParticipantError)}
      {activeSection === 'participant' && (
        <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          {renderInput('participantName', 'Participant Name', 'e.g. Alex Morgan', errors.participantName)}
          {renderInput('participantId', 'Participant ID / Roll No', 'e.g. ENC-2026-88', errors.participantId)}
          {renderInput('college', 'College / University', 'e.g. Stanford University', errors.college)}
          {renderInput('department', 'Department / Branch', 'e.g. Computer Science')}
          {renderInput('email', 'Participant Email', 'alex@example.com', errors.email, 'email-address')}
        </View>
      )}

      {/* 2. Event Info */}
      {renderSectionHeader('event', '2. Event Information', 'calendar', hasEventError)}
      {activeSection === 'event' && (
        <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          {renderInput('eventName', 'Event Name', 'e.g. Global Tech Summit 2026', errors.eventName)}
          {renderInput('eventType', 'Event Type', 'e.g. Workshop, Hackathon, Conference')}
          {renderInput('eventDate', 'Event Date', 'YYYY-MM-DD or Oct 15, 2026', errors.eventDate)}
          {renderInput('venue', 'Venue', 'e.g. Auditorium A or Online')}
          {renderInput('duration', 'Duration', 'e.g. 3 Days / 15 Hours')}
        </View>
      )}

      {/* 3. Organizer Info */}
      {renderSectionHeader('organizer', '3. Organizer Information', 'business', false)}
      {activeSection === 'organizer' && (
        <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          {renderInput('organizerName', 'Organizer Name', 'e.g. Jane Doe')}
          {renderInput('hostName', 'Host / Organization Name', 'e.g. Encore Tech Community')}
        </View>
      )}

      {/* 4. Certificate Meta */}
      {renderSectionHeader('cert', '4. Certificate Details', 'ribbon', hasCertError)}
      {activeSection === 'cert' && (
        <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          {renderInput('certificateTitle', 'Certificate Title', 'CERTIFICATE OF EXCELLENCE', errors.certificateTitle)}
          {renderInput('certificateDescription', 'Description / Statement', 'For outstanding performance...', undefined, 'default', true)}
          {renderInput('certificateId', 'Certificate ID', 'ENC-CERT-9081', errors.certificateId)}
          {renderInput('issueDate', 'Issue Date', 'YYYY-MM-DD', errors.issueDate)}
        </View>
      )}

      {/* 5. Signatory Info */}
      {renderSectionHeader('signatory', '5. Signature Block', 'create', hasSigError)}
      {activeSection === 'signatory' && (
        <View style={[styles.sectionContent, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
          {renderInput('signatoryName', 'Signatory Name', 'Dr. Sarah Connor', errors.signatoryName)}
          {renderInput('signatoryDesignation', 'Designation / Title', 'Program Chair & Director')}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    fontSize: 15,
    fontWeight: '700',
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    marginLeft: 4,
  },
  sectionContent: {
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1,
    marginTop: -4,
    gap: spacing.md,
  },
  inputGroup: {
    gap: 4,
  },
  label: {
    ...typography.labelMd,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    fontSize: 14,
  },
  multilineInput: {
    height: 80,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorText: {
    ...typography.labelSm,
    fontSize: 11,
  },
});
