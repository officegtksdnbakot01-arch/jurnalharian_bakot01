import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export const formatPdfFileName = (namaPegawai?: string, nip?: string): string => {
  const rawName = (namaPegawai || 'Pegawai')
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_');
  
  const rawNip = (nip && nip !== '-' ? nip : '')
    .trim()
    .replace(/[^0-9]/g, '');

  const nipPart = rawNip || 'Tanpa_NIP';
  return `Jurnal_Harian_${rawName}_${nipPart}.pdf`;
};

export const downloadF4Pdf = async (
  element: HTMLElement,
  namaPegawai?: string,
  nip?: string
): Promise<void> => {
  const fileName = formatPdfFileName(namaPegawai, nip);

  // Use html-to-image (toPng), which renders through native browser SVG foreignObject.
  // We specify skipFonts: true and fontEmbedCSS: '' to avoid CORS SecurityError when reading external stylesheet rules.
  const imgData = await toPng(element, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
    skipFonts: true,
    fontEmbedCSS: '',
  });

  const img = new Image();
  img.src = imgData;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Gagal memuat render gambar dokumen.'));
  });

  // F4 Paper Dimensions in millimeters: 210mm x 330mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [210, 330],
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 330;
  const imgHeight = (img.height * pageWidth) / img.width;

  if (imgHeight <= pageHeight + 5) {
    // Fits single F4 sheet cleanly
    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, Math.min(imgHeight, pageHeight));
  } else {
    // Multi-page F4 handling
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft);
      pdf.addPage([210, 330], 'portrait');
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }
  }

  pdf.save(fileName);
};

