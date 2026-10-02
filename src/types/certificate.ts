export type CertificateTemplateId = 'classic' | 'modern' | 'elegant' | 'minimal';

export interface CertificateData {
  // Participant Info
  participantName: string;
  participantId: string;
  department: string;
  college: string;
  email: string;

  // Event Info
  eventName: string;
  eventType: string;
  eventDate: string;
  venue: string;
  duration: string;

  // Organizer Info
  organizerName: string;
  hostName: string;

  // Certificate Meta
  certificateTitle: string;
  certificateDescription: string;
  certificateId: string;
  issueDate: string;

  // Signatory Info
  signatoryName: string;
  signatoryDesignation: string;

  // Visual Template Choice
  template: CertificateTemplateId;

  // Metadata / Timestamps
  id?: string;
  createdAt?: string;
}

export interface ValidationErrors {
  participantName?: string;
  participantId?: string;
  college?: string;
  email?: string;
  eventName?: string;
  eventDate?: string;
  certificateTitle?: string;
  certificateId?: string;
  issueDate?: string;
  signatoryName?: string;
}

export interface TemplateOption {
  id: CertificateTemplateId;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  tag: string;
}
