import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CertificateData, CertificateTemplateId } from '../types/certificate';

const CERTIFICATES_STORAGE_KEY = '@encore_generated_certificates';

// Safe dynamic imports for Expo native modules to prevent Expo Go phone crashes
let PrintModule: any = null;
let SharingModule: any = null;

try {
  PrintModule = require('expo-print');
} catch (e) {
  console.warn('expo-print native module not available in current Expo Go runtime:', e);
}

try {
  SharingModule = require('expo-sharing');
} catch (e) {
  console.warn('expo-sharing native module not available in current Expo Go runtime:', e);
}

/**
 * Generates an HTML string for the given certificate data and template.
 */
export function buildCertificateHTML(data: CertificateData): string {
  const {
    participantName = 'Participant Name',
    participantId = 'PART-0000',
    department = 'Department',
    college = 'University / College',
    eventName = 'Event Name',
    eventType = 'Participation',
    eventDate = '2026-10-02',
    venue = 'Main Auditorium',
    duration = '1 Day',
    organizerName = 'Event Organizer',
    hostName = 'Host Organization',
    certificateTitle = 'CERTIFICATE OF PARTICIPATION',
    certificateDescription = 'for outstanding participation and successful completion of all sessions.',
    certificateId = 'ENC-2026-0001',
    issueDate = '2026-10-02',
    signatoryName = 'Authorized Signatory',
    signatoryDesignation = 'Director',
    template = 'modern',
  } = data;

  const fontStack = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;

  if (template === 'classic') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: landscape; margin: 0; }
          body {
            font-family: 'Georgia', serif;
            background-color: #fdfbf7;
            margin: 0;
            padding: 30px;
            box-sizing: border-box;
            color: #1a1a1a;
          }
          .outer-border {
            border: 12px double #8b6b23;
            padding: 24px;
            background: #ffffff;
            height: calc(100vh - 108px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: center;
            position: relative;
          }
          .corner-decor {
            position: absolute;
            font-size: 24px;
            color: #8b6b23;
          }
          .tl { top: 8px; left: 12px; }
          .tr { top: 8px; right: 12px; }
          .bl { bottom: 8px; left: 12px; }
          .br { bottom: 8px; right: 12px; }
          
          .brand-header {
            font-family: ${fontStack};
            font-size: 14px;
            letter-spacing: 4px;
            color: #8b6b23;
            font-weight: 700;
            text-transform: uppercase;
          }
          .cert-title {
            font-size: 32px;
            color: #8b6b23;
            margin: 12px 0 6px 0;
            letter-spacing: 2px;
            text-transform: uppercase;
          }
          .subtitle {
            font-style: italic;
            font-size: 16px;
            color: #555555;
          }
          .recipient-name {
            font-size: 40px;
            font-weight: bold;
            color: #1a1f36;
            margin: 16px 0;
            border-bottom: 2px solid #8b6b23;
            display: inline-block;
            padding: 0 30px 4px 30px;
          }
          .description {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            max-width: 80%;
            margin: 0 auto;
          }
          .event-meta {
            font-size: 14px;
            margin-top: 10px;
            color: #666;
          }
          .footer-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 20px;
            padding: 0 40px;
          }
          .sig-box {
            text-align: center;
            width: 220px;
          }
          .sig-line {
            border-top: 1px solid #8b6b23;
            margin-top: 40px;
            padding-top: 4px;
            font-weight: bold;
            font-size: 14px;
          }
          .sig-desig {
            font-size: 12px;
            color: #666;
          }
          .badge-seal {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: radial-gradient(circle, #d4af37, #8b6b23);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            letter-spacing: 1px;
          }
          .cert-id {
            font-family: ${fontStack};
            font-size: 10px;
            color: #888;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="outer-border">
          <span class="corner-decor tl">❖</span>
          <span class="corner-decor tr">❖</span>
          <span class="corner-decor bl">❖</span>
          <span class="corner-decor br">❖</span>

          <div>
            <div class="brand-header">ENCORE EVENT MANAGEMENT</div>
            <div class="cert-title">${certificateTitle}</div>
            <div class="subtitle">This is proudly presented to</div>
          </div>

          <div>
            <div class="recipient-name">${participantName}</div>
            <div class="description">
              ${certificateDescription}
            </div>
            <div class="event-meta">
              <strong>Event:</strong> ${eventName} (${eventType}) | <strong>Date:</strong> ${eventDate} | <strong>Venue:</strong> ${venue}
            </div>
            <div class="event-meta" style="font-size: 12px;">
              ${department ? `Dept: ${department} | ` : ''} ${college ? `Institution: ${college} | ` : ''} Participant ID: ${participantId}
            </div>
          </div>

          <div class="footer-row">
            <div class="sig-box">
              <div style="font-family: 'Brush Script MT', cursive; font-size: 26px; color: #1a1a1a;">${signatoryName}</div>
              <div class="sig-line">${signatoryName}</div>
              <div class="sig-desig">${signatoryDesignation}</div>
            </div>

            <div class="badge-seal">
              OFFICIAL<br/>SEAL
            </div>

            <div class="sig-box">
              <div style="font-size: 14px; font-weight: bold; margin-bottom: 20px;">${issueDate}</div>
              <div class="sig-line">Issue Date</div>
              <div class="sig-desig">Hosted by ${hostName}</div>
            </div>
          </div>

          <div class="cert-id">Certificate Verification ID: ${certificateId}</div>
        </div>
      </body>
      </html>
    `;
  }

  if (template === 'elegant') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: landscape; margin: 0; }
          body {
            font-family: ${fontStack};
            background-color: #120e18;
            margin: 0;
            padding: 30px;
            box-sizing: border-box;
            color: #f7f2fa;
          }
          .card-wrapper {
            background: #1c1626;
            border: 2px solid #9d4edd;
            border-radius: 16px;
            height: calc(100vh - 60px);
            box-sizing: border-box;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
          }
          .glow-bg {
            position: absolute;
            top: -100px;
            right: -100px;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(157, 78, 221, 0.3) 0%, rgba(0,0,0,0) 70%);
            border-radius: 50%;
          }
          .top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .brand-badge {
            background: linear-gradient(135deg, #ff7b40, #ff3399, #9d4edd);
            padding: 6px 16px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 12px;
            letter-spacing: 2px;
            color: #ffffff;
            text-transform: uppercase;
          }
          .cert-title {
            font-size: 34px;
            font-weight: 800;
            background: linear-gradient(90deg, #ff7b40, #ff3399, #9d4edd);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .recipient-section {
            text-align: center;
            margin: 10px 0;
          }
          .presented-to {
            font-size: 14px;
            color: #a69fb0;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          .name {
            font-size: 42px;
            font-weight: 800;
            color: #ffffff;
            margin: 10px 0;
            text-shadow: 0 4px 12px rgba(157, 78, 221, 0.4);
          }
          .desc {
            font-size: 15px;
            color: #edeaf0;
            max-width: 750px;
            margin: 0 auto;
            line-height: 1.6;
          }
          .meta-chips {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 14px;
          }
          .chip {
            background: #272230;
            border: 1px solid #484450;
            padding: 6px 14px;
            border-radius: 8px;
            font-size: 12px;
            color: #edeaf0;
          }
          .bottom-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 20px;
            border-top: 1px solid #322d3d;
          }
          .sig-block {
            text-align: left;
          }
          .sig-name {
            font-size: 18px;
            font-weight: bold;
            color: #ff7b40;
          }
          .sig-sub {
            font-size: 12px;
            color: #a69fb0;
          }
          .id-tag {
            font-size: 11px;
            color: #a69fb0;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="card-wrapper">
          <div class="glow-bg"></div>

          <div class="top-row">
            <div>
              <div class="brand-badge">ENCORE CERTIFIED</div>
              <div class="cert-title">${certificateTitle}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #a69fb0;">Host / Organization</div>
              <div style="font-size: 16px; font-weight: bold; color: #ffffff;">${hostName}</div>
            </div>
          </div>

          <div class="recipient-section">
            <div class="presented-to">This certificate is awarded to</div>
            <div class="name">${participantName}</div>
            <div class="desc">${certificateDescription}</div>
            
            <div class="meta-chips">
              <div class="chip">🎓 ${college || 'Institution'} (${department || 'General'})</div>
              <div class="chip">📅 ${eventDate}</div>
              <div class="chip">📍 ${venue}</div>
              <div class="chip">⏱️ ${duration}</div>
            </div>
          </div>

          <div class="bottom-row">
            <div class="sig-block">
              <div class="sig-name">${signatoryName}</div>
              <div class="sig-sub">${signatoryDesignation}</div>
              <div class="sig-sub" style="margin-top: 4px;">Organizer: ${organizerName}</div>
            </div>

            <div style="text-align: center;">
              <div style="font-size: 14px; font-weight: bold; color: #9d4edd;">VALIDATED CERTIFICATE</div>
              <div class="id-tag">ID: ${certificateId}</div>
            </div>

            <div style="text-align: right;">
              <div style="font-size: 14px; font-weight: bold; color: #ffffff;">${issueDate}</div>
              <div style="font-size: 12px; color: #a69fb0;">Date of Issuance</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  if (template === 'minimal') {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { size: landscape; margin: 0; }
          body {
            font-family: ${fontStack};
            background-color: #ffffff;
            margin: 0;
            padding: 40px;
            box-sizing: border-box;
            color: #111111;
          }
          .minimal-container {
            border-left: 6px solid #111111;
            padding-left: 40px;
            height: calc(100vh - 80px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .cert-header {
            font-size: 12px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #666;
            font-weight: 600;
          }
          .cert-title {
            font-size: 36px;
            font-weight: 900;
            letter-spacing: -1px;
            margin: 12px 0;
            text-transform: uppercase;
          }
          .recipient-name {
            font-size: 46px;
            font-weight: 800;
            color: #000000;
            margin: 20px 0 10px 0;
          }
          .cert-desc {
            font-size: 16px;
            color: #444444;
            max-width: 650px;
            line-height: 1.6;
          }
          .details-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eeeeee;
          }
          .detail-label {
            font-size: 11px;
            text-transform: uppercase;
            color: #888888;
            letter-spacing: 1px;
          }
          .detail-val {
            font-size: 14px;
            font-weight: 600;
            color: #111111;
            margin-top: 4px;
          }
          .footer-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .cert-id {
            font-family: monospace;
            font-size: 11px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="minimal-container">
          <div>
            <div class="cert-header">ENCORE ARCHITECTURE // ${hostName}</div>
            <div class="cert-title">${certificateTitle}</div>
          </div>

          <div>
            <div style="font-size: 14px; color: #777;">PRESENTED TO</div>
            <div class="recipient-name">${participantName}</div>
            <div class="cert-desc">${certificateDescription}</div>

            <div class="details-grid">
              <div>
                <div class="detail-label">EVENT</div>
                <div class="detail-val">${eventName}</div>
              </div>
              <div>
                <div class="detail-label">DATE & VENUE</div>
                <div class="detail-val">${eventDate} (${venue})</div>
              </div>
              <div>
                <div class="detail-label">INSTITUTION</div>
                <div class="detail-val">${college || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="footer-section">
            <div>
              <div style="font-size: 16px; font-weight: 700;">${signatoryName}</div>
              <div style="font-size: 12px; color: #666;">${signatoryDesignation}</div>
            </div>

            <div style="text-align: right;">
              <div class="cert-id">VERIFICATION: ${certificateId}</div>
              <div style="font-size: 12px; color: #666; margin-top: 2px;">ISSUED: ${issueDate}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Modern Template (Default - Orange/Purple Encore Vibe)
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page { size: landscape; margin: 0; }
        body {
          font-family: ${fontStack};
          background: #faf9fb;
          margin: 0;
          padding: 30px;
          box-sizing: border-box;
          color: #1a161f;
        }
        .cert-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e5e0ea;
          box-shadow: 0 10px 30px rgba(0,0,0,0.06);
          height: calc(100vh - 60px);
          box-sizing: border-box;
          padding: 36px 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .brand-text {
          font-size: 22px;
          font-weight: 900;
          color: #ff5e1a;
          letter-spacing: -0.5px;
        }
        .brand-text span {
          color: #7b2cbf;
        }
        .cert-tag {
          background: #f1e4ff;
          color: #3d0070;
          font-size: 12px;
          font-weight: bold;
          padding: 4px 12px;
          border-radius: 12px;
        }
        .hero-title {
          font-size: 32px;
          font-weight: 800;
          color: #1a161f;
          text-align: center;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .main-content {
          text-align: center;
          margin: 10px 0;
        }
        .present-text {
          font-size: 14px;
          color: #6f687a;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }
        .participant-title {
          font-size: 40px;
          font-weight: 800;
          color: #7b2cbf;
          margin: 4px 0 12px 0;
        }
        .body-desc {
          font-size: 15px;
          color: #4a4453;
          max-width: 720px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .event-highlight {
          display: inline-block;
          background: #ffede6;
          color: #8b2900;
          padding: 8px 18px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 14px;
          margin-top: 14px;
        }
        .footer-grid {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 16px;
          border-top: 1px solid #ebe7f0;
        }
        .sig-container {
          text-align: left;
        }
        .sig-title {
          font-size: 16px;
          font-weight: 700;
          color: #1a161f;
        }
        .sig-sub {
          font-size: 12px;
          color: #6f687a;
        }
        .seal-circle {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff5e1a, #7b2cbf);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="cert-card">
        <div class="header-bar">
          <div class="brand-text">ENCORE<span>.APP</span></div>
          <div class="cert-tag">${eventType.toUpperCase()}</div>
        </div>

        <div class="hero-title">${certificateTitle}</div>

        <div class="main-content">
          <div class="present-text">PROUDLY PRESENTED TO</div>
          <div class="participant-title">${participantName}</div>
          <div class="body-desc">${certificateDescription}</div>
          <div class="event-highlight">🎉 ${eventName} — ${eventDate} @ ${venue}</div>
        </div>

        <div class="footer-grid">
          <div class="sig-container">
            <div class="sig-title">${signatoryName}</div>
            <div class="sig-sub">${signatoryDesignation} (${hostName})</div>
            <div class="sig-sub" style="margin-top: 2px;">Organizer: ${organizerName}</div>
          </div>

          <div class="seal-circle">VERIFIED<br/>ENCORE</div>

          <div style="text-align: right;">
            <div style="font-size: 12px; color: #6f687a;">ID: ${certificateId}</div>
            <div style="font-size: 13px; font-weight: 700; color: #1a161f; margin-top: 4px;">Issued: ${issueDate}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates a PDF file from the certificate data safely without crashing Expo Go.
 */
export async function generateCertificatePDF(data: CertificateData): Promise<{ uri: string; html: string }> {
  const html = buildCertificateHTML(data);

  if (Platform.OS === 'web' || !PrintModule || typeof PrintModule.printToFileAsync !== 'function') {
    try {
      if (PrintModule && typeof PrintModule.printToFileAsync === 'function') {
        const result = await PrintModule.printToFileAsync({ html, width: 842, height: 595 });
        if (result && result.uri) return { uri: result.uri, html };
      }
    } catch (e) {
      console.warn('PrintToFileAsync fallback:', e);
    }
    return { uri: '', html };
  }

  try {
    const result = await PrintModule.printToFileAsync({
      html,
      width: 842,
      height: 595,
    });
    return { uri: result.uri, html };
  } catch (err) {
    console.warn('Native Print error:', err);
    return { uri: '', html };
  }
}

/**
 * Shares or downloads the certificate PDF safely without crashing Expo Go.
 */
export async function shareOrDownloadCertificate(
  uri: string,
  htmlContent?: string,
  fileName: string = 'Encore_Certificate.pdf'
): Promise<boolean> {
  if (Platform.OS === 'web' || !SharingModule || typeof SharingModule.isAvailableAsync !== 'function') {
    if (htmlContent && typeof window !== 'undefined') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
        return true;
      }
    }
    if (typeof window !== 'undefined') window.print();
    return true;
  }

  try {
    const isAvailable = await SharingModule.isAvailableAsync();
    if (isAvailable && uri) {
      await SharingModule.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share / Download Certificate PDF',
        UTI: 'com.adobe.pdf',
      });
      return true;
    }
  } catch (err) {
    console.warn('Sharing error:', err);
  }

  return false;
}

/**
 * Save Certificate Metadata locally (AsyncStorage) and prepared structurally for Firestore.
 */
export async function saveCertificateMetadata(data: CertificateData): Promise<string> {
  const newId = data.id || `CERT-${Date.now()}`;
  const newCertificate: CertificateData = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  try {
    const existingRaw = await AsyncStorage.getItem(CERTIFICATES_STORAGE_KEY);
    const existingList: CertificateData[] = existingRaw ? JSON.parse(existingRaw) : [];
    existingList.unshift(newCertificate);
    await AsyncStorage.setItem(CERTIFICATES_STORAGE_KEY, JSON.stringify(existingList));
  } catch (err) {
    console.error('Failed to save certificate locally:', err);
  }

  return newId;
}

/**
 * Retrieve saved certificates list.
 */
export async function getSavedCertificates(): Promise<CertificateData[]> {
  try {
    const raw = await AsyncStorage.getItem(CERTIFICATES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to get saved certificates:', err);
    return [];
  }
}
