import AsyncStorage from '@react-native-async-storage/async-storage';
import { CertificateData } from '../types/certificate';
import { saveCertificateMetadata } from './certificateService';

export interface AttendanceRecord {
  id: string;
  studentName: string;
  studentId: string;
  email: string;
  department: string;
  college: string;
  status: 'Present' | 'Absent';
  checkInTime?: string;
  certificateGenerated?: boolean;
}

export interface CandidateNotification {
  id: string;
  studentId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  type: 'certificate' | 'event';
  certificateId?: string;
}

const NOTIFICATIONS_STORAGE_KEY = '@encore_student_notifications';

// Mock initial attendance records for events
export const INITIAL_ATTENDANCE_ROSTER: Record<string, AttendanceRecord[]> = {
  '1': [
    { id: 'att-1', studentName: 'Alex Morgan', studentId: 'CS-2026-01', email: 'alex.m@stanford.edu', department: 'Computer Science', college: 'Stanford University', status: 'Present', checkInTime: '09:15 AM' },
    { id: 'att-2', studentName: 'Rahul Verma', studentId: 'IT-2026-04', email: 'rahul.v@college.edu', department: 'Information Tech', college: 'Encore Institute', status: 'Present', checkInTime: '09:22 AM' },
    { id: 'att-3', studentName: 'Priya Sharma', studentId: 'ECE-2026-09', email: 'priya.s@college.edu', department: 'Electronics', college: 'Encore Institute', status: 'Present', checkInTime: '09:30 AM' },
    { id: 'att-4', studentName: 'Ananya Roy', studentId: 'AI-2026-12', email: 'ananya.r@college.edu', department: 'AI & Data Science', college: 'Encore Institute', status: 'Present', checkInTime: '09:45 AM' },
    { id: 'att-5', studentName: 'Dev Patel', studentId: 'CS-2026-15', email: 'dev.p@college.edu', department: 'Computer Science', college: 'Stanford University', status: 'Absent' },
  ],
  '2': [
    { id: 'att-6', studentName: 'Rohan Mehta', studentId: 'CL-2026-02', email: 'rohan.m@college.edu', department: 'Arts & Music', college: 'Encore Institute', status: 'Present', checkInTime: '06:10 PM' },
    { id: 'att-7', studentName: 'Sneha Kapur', studentId: 'CL-2026-07', email: 'sneha.k@college.edu', department: 'Performing Arts', college: 'Encore Institute', status: 'Present', checkInTime: '06:15 PM' },
  ],
};

/**
 * Dispatches personalized notifications to candidate notification list.
 */
export async function sendPersonalNotification(notification: Omit<CandidateNotification, 'id' | 'read' | 'date'>): Promise<void> {
  const newNotif: CandidateNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false,
  };

  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const list: CandidateNotification[] = raw ? JSON.parse(raw) : [];
    list.unshift(newNotif);
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to send candidate notification:', err);
  }
}

/**
 * Get notifications list.
 */
export async function getCandidateNotifications(): Promise<CandidateNotification[]> {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Auto-Generates certificates for all present candidates in an event roster & sends personal notifications automatically.
 */
export async function autoGenerateCertificatesFromAttendance(
  eventId: string,
  eventName: string,
  eventDate: string,
  venue: string,
  organizerName: string,
  roster: AttendanceRecord[]
): Promise<{ generatedCount: number; certificates: CertificateData[] }> {
  const presentCandidates = roster.filter((candidate) => candidate.status === 'Present');
  const generatedCertificates: CertificateData[] = [];

  for (const candidate of presentCandidates) {
    const certId = `CERT-${eventId}-${candidate.studentId}-${Date.now().toString().slice(-4)}`;

    const certData: CertificateData = {
      participantName: candidate.studentName,
      participantId: candidate.studentId,
      department: candidate.department,
      college: candidate.college,
      email: candidate.email,
      eventName,
      eventType: 'Participation & Completion',
      eventDate,
      venue,
      duration: 'Full Session',
      organizerName,
      hostName: 'Encore Event Portal',
      certificateTitle: 'CERTIFICATE OF PARTICIPATION',
      certificateDescription: `for active attendance and successful completion of ${eventName}.`,
      certificateId: certId,
      issueDate: new Date().toISOString().split('T')[0],
      signatoryName: organizerName || 'Authorized Convener',
      signatoryDesignation: 'Event Chair & Organizer',
      template: 'modern',
    };

    // 1. Save certificate metadata
    await saveCertificateMetadata(certData);
    generatedCertificates.push(certData);

    // 2. Dispatch personal notification to candidate
    await sendPersonalNotification({
      studentId: candidate.studentId,
      title: `🎉 Certificate Issued: ${eventName}`,
      body: `Congratulations ${candidate.studentName}! Your official Certificate of Participation for "${eventName}" has been issued (ID: ${certId}). Tap to view and download.`,
      type: 'certificate',
      certificateId: certId,
    });
  }

  return {
    generatedCount: generatedCertificates.length,
    certificates: generatedCertificates,
  };
}
