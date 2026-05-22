/**
 * Pure TypeScript PDF Generator for Certificates.
 * Generates a valid PDF-1.4 landscape US Letter certificate.
 * Zero external dependencies.
 */

interface CertificateData {
  certificateNo: string;
  studentName: string;
  courseTitle: string;
  quizScore: number;
  issuedAt: Date;
  verificationUrl: string;
}

/**
 * Escapes special characters for PDF text syntax (parentheses and backslashes).
 */
function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Generates a US Letter landscape PDF (792x612 points) as a Buffer.
 */
export function generateCertificatePdf(data: CertificateData): Buffer {
  const name = escapePdfText(data.studentName);
  const title = escapePdfText(data.courseTitle);
  const dateStr = data.issuedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const certNo = escapePdfText(data.certificateNo);
  const verifyUrl = escapePdfText(data.verificationUrl);
  const scoreStr = `${data.quizScore.toFixed(1)}%`;

  // Define contents block
  const contents = [
    'q',
    // Border rectangle: line width 4, inset by 30 pt
    '4 w',
    '0.1 0.3 0.6 RG', // Navy blue stroke
    '30 30 732 552 re S',
    // Inset border rectangle: line width 1, inset by 36 pt
    '1 w',
    '36 36 720 540 re S',
    'Q',
    // Text blocks
    'BT',
    // Title
    '/F2 32 Tf',
    '0.1 0.2 0.4 rg', // Deep navy
    '1 0 0 1 100 480 Tm',
    '(CERTIFICATE OF COMPLETION) Tj',
    'ET',
    'BT',
    // Sub-header
    '/F1 16 Tf',
    '0.4 0.4 0.4 rg', // Gray
    '1 0 0 1 100 420 Tm',
    '(This is to certify that) Tj',
    'ET',
    'BT',
    // Recipient Name
    '/F2 26 Tf',
    '0.8 0.1 0.2 rg', // Rich red/burgundy accent
    '1 0 0 1 100 360 Tm',
    `(${name}) Tj`,
    'ET',
    'BT',
    // Middle text
    '/F1 16 Tf',
    '0.4 0.4 0.4 rg',
    '1 0 0 1 100 310 Tm',
    '(has successfully completed the curriculum and learning track for) Tj',
    'ET',
    'BT',
    // Course Title
    '/F2 22 Tf',
    '0.1 0.3 0.6 rg', // Blue
    '1 0 0 1 100 250 Tm',
    `(${title}) Tj`,
    'ET',
    'BT',
    // Details
    '/F1 12 Tf',
    '0.2 0.2 0.2 rg',
    '1 0 0 1 100 180 Tm',
    `(Date: ${dateStr}   |   Quiz Score: ${scoreStr}   |   Certificate No: ${certNo}) Tj`,
    'ET',
    'BT',
    // Verification
    '/F1 10 Tf',
    '0.5 0.5 0.5 rg',
    '1 0 0 1 100 120 Tm',
    `(Verify authenticity online at: ${verifyUrl}) Tj`,
    'ET',
  ].join('\n');

  const contentsBuffer = Buffer.from(contents, 'utf-8');
  const streamLength = contentsBuffer.length;

  // Build PDF objects
  const objects: string[] = [];
  const offsets: number[] = [];

  // Helper to register object
  function addObject(obj: string): number {
    const id = objects.length + 1;
    objects.push(obj);
    return id;
  }

  // 1: Catalog
  const catId = addObject('<< /Type /Catalog /Pages 2 0 R >>');
  // 2: Pages
  const pagesId = addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  // 3: Page
  const pageId = addObject(
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>'
  );
  // 4: Regular Font (Helvetica)
  const font1Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  // 5: Bold Font (Helvetica-Bold)
  const font2Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  // 6: Contents stream
  const streamObj = `<< /Length ${streamLength} >>\nstream\n${contents}\nendstream`;
  const streamId = addObject(streamObj);

  // Compile full PDF
  let pdfString = '%PDF-1.4\n';
  
  // Calculate offsets
  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.from(pdfString, 'utf-8').length);
    pdfString += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = Buffer.from(pdfString, 'utf-8').length;
  pdfString += 'xref\n';
  pdfString += `0 ${objects.length + 1}\n`;
  pdfString += '0000000000 65535 f \n';
  
  for (let i = 0; i < offsets.length; i++) {
    const offsetStr = String(offsets[i]).padStart(10, '0');
    pdfString += `${offsetStr} 00000 n \n`;
  }

  pdfString += 'trailer\n';
  pdfString += `<< /Root 1 0 R /Size ${objects.length + 1} >>\n`;
  pdfString += 'startxref\n';
  pdfString += `${xrefOffset}\n`;
  pdfString += '%%EOF\n';

  return Buffer.from(pdfString, 'utf-8');
}
