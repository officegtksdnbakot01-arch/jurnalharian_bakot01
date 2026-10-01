import ExcelJS from 'exceljs';
import { Pegawai, SekolahConfig } from '../types';

const APP_BLUE = 'FF1E3A8A'; // #1e3a8a
const BORDER_BLACK: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FF000000' } },
  left: { style: 'thin', color: { argb: 'FF000000' } },
  bottom: { style: 'thin', color: { argb: 'FF000000' } },
  right: { style: 'thin', color: { argb: 'FF000000' } },
};

/* ========================================================================= */
/* 1. DATA PEGAWAI: UNDUH FORMAT, EKSPOR, & IMPOR DENGAN BASE64               */
/* ========================================================================= */

/**
 * Mengunduh file template Excel kosong berformat resmi
 * dengan border dan warna header biru #1e3a8a sesuai aplikasi,
 * mencakup kolom Foto Profil (Base64) dan Ttd Pegawai (Base64).
 */
export const downloadPegawaiTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIKAWAN SDN Babelan Kota 01';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Data_Pegawai', {
    views: [{ showGridLines: true }],
  });

  // Setup Kolom
  worksheet.columns = [
    { header: 'No', key: 'no', width: 8 },
    { header: 'NIP / NI PPPK', key: 'nip', width: 26 },
    { header: 'Nama Lengkap & Gelar', key: 'nama', width: 34 },
    { header: 'Jabatan', key: 'jabatan', width: 28 },
    { header: 'Pangkat / Golongan', key: 'golongan', width: 22 },
    { header: 'Status Pegawai', key: 'status', width: 22 },
    { header: 'Foto Profil (Base64)', key: 'fotoBase64', width: 40 },
    { header: 'Ttd Pegawai (Base64)', key: 'ttdBase64', width: 40 },
  ];

  // Format Header (Baris 1)
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: APP_BLUE },
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = BORDER_BLACK;
  });

  // Contoh data template
  const sampleData = [
    {
      no: 1,
      nip: '198105102025211008',
      nama: 'SAMSUDIN',
      jabatan: 'Tendik',
      golongan: 'V',
      status: 'PPPK',
      fotoBase64: '',
      ttdBase64: '',
    },
    {
      no: 2,
      nip: '198503122010012015',
      nama: 'SITI NURJANAH, S.Pd.',
      jabatan: 'Guru Kelas',
      golongan: 'Penata (III/c)',
      status: 'PNS',
      fotoBase64: '',
      ttdBase64: '',
    },
    {
      no: 3,
      nip: '199208152023212009',
      nama: 'RATNA DEWI, S.Pd.',
      jabatan: 'Guru Kelas',
      golongan: 'IX',
      status: 'PPPK PW',
      fotoBase64: '',
      ttdBase64: '',
    },
  ];

  sampleData.forEach((item) => {
    const row = worksheet.addRow(item);
    row.height = 22;
    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
      };
      cell.border = BORDER_BLACK;
      cell.alignment = {
        vertical: 'middle',
        horizontal: colNumber === 1 || colNumber === 6 ? 'center' : colNumber === 2 ? 'center' : 'left',
      };
      if (colNumber === 2 || colNumber === 7 || colNumber === 8) {
        cell.numFmt = '@'; // Force text format
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Template_Format_Data_Pegawai.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Ekspor seluruh data pegawai saat ini ke file Excel,
 * menyimpan foto profil dan TTD dalam format base64 langsung (bukan link URL drive).
 */
export const exportPegawaiToExcel = async (pegawaiList: Pegawai[]) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIKAWAN SDN Babelan Kota 01';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Data_Pegawai', {
    views: [{ showGridLines: true }],
  });

  worksheet.columns = [
    { header: 'No', key: 'no', width: 8 },
    { header: 'NIP / NI PPPK', key: 'nip', width: 26 },
    { header: 'Nama Lengkap & Gelar', key: 'nama', width: 34 },
    { header: 'Jabatan', key: 'jabatan', width: 28 },
    { header: 'Pangkat / Golongan', key: 'golongan', width: 22 },
    { header: 'Status Pegawai', key: 'status', width: 22 },
    { header: 'Foto Profil (Base64)', key: 'fotoBase64', width: 45 },
    { header: 'Ttd Pegawai (Base64)', key: 'ttdBase64', width: 45 },
  ];

  // Header format
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: APP_BLUE },
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = BORDER_BLACK;
  });

  pegawaiList.forEach((p, index) => {
    const row = worksheet.addRow({
      no: index + 1,
      nip: p.nip && p.nip !== '-' ? p.nip : '-',
      nama: p.nama,
      jabatan: p.jabatan || 'Guru Kelas',
      golongan: p.golongan || '-',
      status: p.status || 'PNS',
      fotoBase64: p.fotoUrl || '',
      ttdBase64: p.ttdUrl || '',
    });

    row.height = 22;
    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
        bold: colNumber === 2,
      };
      cell.border = BORDER_BLACK;
      cell.alignment = {
        vertical: 'middle',
        horizontal: colNumber === 1 || colNumber === 6 ? 'center' : colNumber === 2 ? 'center' : 'left',
      };
      if (colNumber === 2 || colNumber === 7 || colNumber === 8) {
        cell.numFmt = '@';
      }
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `Data_Pegawai_SDNBakot01_${dateStr}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Impor data pegawai dari file Excel (.xlsx),
 * membaca foto dan TTD langsung dari nilai cell string data:image/png;base64.
 */
export const importPegawaiFromExcel = async (
  file: File,
  namaSekolah: string = 'SD Negeri Babelan Kota 01'
): Promise<Pegawai[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Lembar kerja Excel kosong atau tidak terbaca.');
  }

  const result: Pegawai[] = [];

  worksheet.eachRow((row, rowNumber) => {
    // Lewati baris 1 (Header)
    if (rowNumber === 1) return;

    const nipVal = row.getCell(2).value;
    const namaVal = row.getCell(3).value;
    const jabatanVal = row.getCell(4).value;
    const golonganVal = row.getCell(5).value;
    const statusVal = row.getCell(6).value;
    const fotoVal = row.getCell(7).value;
    const ttdVal = row.getCell(8).value;

    const nama = namaVal ? String(namaVal).trim() : '';
    if (!nama) return;

    let rawNip = nipVal !== null && nipVal !== undefined ? String(nipVal).trim() : '-';
    if (typeof nipVal === 'object' && nipVal && 'result' in nipVal) {
      rawNip = String((nipVal as any).result || '-');
    }

    const jabatan = jabatanVal ? String(jabatanVal).trim() : 'Guru Kelas';
    const golongan = golonganVal ? String(golonganVal).trim() : '-';
    
    // Normalisasi status
    let status: 'PNS' | 'PPPK' | 'PPPK PW' | 'Honorer' | 'Tenaga Kependidikan' = 'PNS';
    const statusStr = statusVal ? String(statusVal).toUpperCase().trim() : '';
    if (statusStr.includes('PPPK PW') || statusStr.includes('PPPK-PW') || statusStr.includes('PW')) {
      status = 'PPPK PW';
    } else if (statusStr.includes('PPPK')) {
      status = 'PPPK';
    } else if (statusStr.includes('HONORER')) {
      status = 'Honorer';
    } else if (statusStr.includes('TENDIK') || statusStr.includes('TENAGA') || statusStr.includes('KEPENDIDIKAN')) {
      status = 'Tenaga Kependidikan';
    } else {
      status = 'PNS';
    }

    // Ambil string base64 untuk Foto dan TTD jika ada
    const fotoUrl = fotoVal ? String(fotoVal).trim() : undefined;
    const ttdUrl = ttdVal ? String(ttdVal).trim() : undefined;

    result.push({
      id: `peg-${Date.now()}-${rowNumber}`,
      nip: rawNip,
      nama: nama,
      jabatan: jabatan,
      golongan: golongan,
      status: status,
      fotoUrl: fotoUrl && fotoUrl.length > 20 ? fotoUrl : undefined,
      ttdUrl: ttdUrl && ttdUrl.length > 20 ? ttdUrl : undefined,
      unitKerja: namaSekolah,
    });
  });

  return result;
};


/* ========================================================================= */
/* 2. PROFIL SEKOLAH: UNDUH FORMAT, EKSPOR, & IMPOR DENGAN BASE64            */
/* Menggunakan format Key-Value ["Kunci", "Nilai", "Keterangan"]             */
/* ========================================================================= */

/**
 * Mengunduh file template Excel resmi untuk Profil Sekolah
 * dengan format Key-Value ["Kunci", "Nilai", "Keterangan"]
 * dan warna header biru #1e3a8a sesuai aplikasi.
 */
export const downloadSekolahTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIKAWAN SDN Babelan Kota 01';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('PROFIL_SEKOLAH', {
    views: [{ showGridLines: true }],
  });

  worksheet.columns = [
    { header: 'Kunci', key: 'kunci', width: 28 },
    { header: 'Nilai', key: 'nilai', width: 65 },
    { header: 'Keterangan', key: 'keterangan', width: 38 },
  ];

  // Header format
  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: APP_BLUE },
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = BORDER_BLACK;
  });

  const defaultRows = [
    {
      kunci: 'namaSekolah',
      nilai: 'SD NEGERI BABELAN KOTA 01',
      keterangan: 'Nama Resmi Satuan Pendidikan',
    },
    {
      kunci: 'npsn',
      nilai: '20219135',
      keterangan: 'Nomor Pokok Sekolah Nasional',
    },
    {
      kunci: 'alamat',
      nilai: 'Jl. Raya Babelan No. 01, Kel. Babelan Kota, Kec. Babelan, Kab. Bekasi 17610',
      keterangan: 'Alamat Lengkap Sekolah',
    },
    {
      kunci: 'kecamatan',
      nilai: 'Kecamatan Babelan',
      keterangan: 'Kecamatan',
    },
    {
      kunci: 'kabupaten',
      nilai: 'Kabupaten Bekasi',
      keterangan: 'Kabupaten / Kota',
    },
    {
      kunci: 'provinsi',
      nilai: 'Jawa Barat',
      keterangan: 'Provinsi',
    },
    {
      kunci: 'tahunJurnal',
      nilai: '2026',
      keterangan: 'Tahun Pelaporan Jurnal',
    },
    {
      kunci: 'kepalaSekolahNama',
      nilai: 'LAILATUL FAJRIAH, S.Pd.SD',
      keterangan: 'Nama Lengkap & Gelar Kepala Sekolah',
    },
    {
      kunci: 'kepalaSekolahNIP',
      nilai: '197808202008012005',
      keterangan: 'NIP Kepala Sekolah',
    },
    {
      kunci: 'kepalaSekolahGolongan',
      nilai: 'Pembina Tk. I (IV/b)',
      keterangan: 'Pangkat / Golongan Kepala Sekolah',
    },
    {
      kunci: 'kepalaSekolahTtd',
      nilai: '',
      keterangan: 'Tanda Tangan Kepala Sekolah (data:image/png;base64,...)',
    },
    {
      kunci: 'kopSekolahUrl',
      nilai: '',
      keterangan: 'Berkas Gambar KOP Surat Resmi (data:image/png;base64,...)',
    },
    {
      kunci: 'stempelSekolahUrl',
      nilai: '',
      keterangan: 'Berkas Stempel Resmi Sekolah (data:image/png;base64,...)',
    },
    {
      kunci: 'gasWebAppUrl',
      nilai: '',
      keterangan: 'URL Google Apps Script Web App (Opsional)',
    },
  ];

  defaultRows.forEach((item) => {
    const row = worksheet.addRow(item);
    row.height = 24;
    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
        bold: colNumber === 1,
      };
      cell.border = BORDER_BLACK;
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };
      cell.numFmt = '@';
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Template_Format_Profil_Sekolah.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Ekspor Profil Sekolah ke file Excel dengan format ["Kunci", "Nilai", "Keterangan"],
 * menyertakan Kop, Stempel, dan TTD Kepala Sekolah secara utuh dalam base64.
 */
export const exportSekolahToExcel = async (sekolah: SekolahConfig) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'SIKAWAN SDN Babelan Kota 01';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('PROFIL_SEKOLAH', {
    views: [{ showGridLines: true }],
  });

  worksheet.columns = [
    { header: 'Kunci', key: 'kunci', width: 28 },
    { header: 'Nilai', key: 'nilai', width: 65 },
    { header: 'Keterangan', key: 'keterangan', width: 38 },
  ];

  const headerRow = worksheet.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: APP_BLUE },
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
    cell.border = BORDER_BLACK;
  });

  const rows = [
    {
      kunci: 'namaSekolah',
      nilai: sekolah.namaSekolah || 'SD NEGERI BABELAN KOTA 01',
      keterangan: 'Nama Resmi Satuan Pendidikan',
    },
    {
      kunci: 'npsn',
      nilai: sekolah.npsn || '20219135',
      keterangan: 'Nomor Pokok Sekolah Nasional',
    },
    {
      kunci: 'alamat',
      nilai: sekolah.alamat || '',
      keterangan: 'Alamat Lengkap Sekolah',
    },
    {
      kunci: 'kecamatan',
      nilai: sekolah.kecamatan || 'Kecamatan Babelan',
      keterangan: 'Kecamatan',
    },
    {
      kunci: 'kabupaten',
      nilai: sekolah.kabupaten || 'Kabupaten Bekasi',
      keterangan: 'Kabupaten / Kota',
    },
    {
      kunci: 'provinsi',
      nilai: sekolah.provinsi || 'Jawa Barat',
      keterangan: 'Provinsi',
    },
    {
      kunci: 'tahunJurnal',
      nilai: String(sekolah.tahunJurnal || 2026),
      keterangan: 'Tahun Pelaporan Jurnal',
    },
    {
      kunci: 'kepalaSekolahNama',
      nilai: sekolah.kepalaSekolahNama || 'LAILATUL FAJRIAH, S.Pd.SD',
      keterangan: 'Nama Lengkap & Gelar Kepala Sekolah',
    },
    {
      kunci: 'kepalaSekolahNIP',
      nilai: sekolah.kepalaSekolahNIP || '197808202008012005',
      keterangan: 'NIP Kepala Sekolah',
    },
    {
      kunci: 'kepalaSekolahGolongan',
      nilai: sekolah.kepalaSekolahGolongan || 'Pembina Tk. I (IV/b)',
      keterangan: 'Pangkat / Golongan Kepala Sekolah',
    },
    {
      kunci: 'kepalaSekolahTtd',
      nilai: sekolah.kepalaSekolahTtd || '',
      keterangan: 'Tanda Tangan Kepala Sekolah (Base64 Transparan)',
    },
    {
      kunci: 'kopSekolahUrl',
      nilai: sekolah.kopSekolahUrl || '',
      keterangan: 'KOP Surat Sekolah (Base64)',
    },
    {
      kunci: 'stempelSekolahUrl',
      nilai: sekolah.stempelSekolahUrl || '',
      keterangan: 'Stempel Resmi Sekolah (Base64)',
    },
    {
      kunci: 'gasWebAppUrl',
      nilai: sekolah.gasWebAppUrl || '',
      keterangan: 'URL Google Apps Script Web App',
    },
  ];

  rows.forEach((item, index) => {
    const row = worksheet.addRow(item);
    row.height = 24;
    row.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Calibri',
        size: 11,
        bold: colNumber === 1,
      };
      cell.border = BORDER_BLACK;
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
      };
      cell.numFmt = '@';
      if (index % 2 === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF8FAFC' },
        };
      }
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const npsnStr = sekolah.npsn || '20219135';
  a.download = `Profil_Sekolah_${npsnStr}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Impor Profil Sekolah dari file Excel (.xlsx),
 * membaca nilai Key-Value dan menyimpan Kop, Stempel, serta TTD dalam format base64 langsung.
 */
export const importSekolahFromExcel = async (
  file: File,
  currentConfig: SekolahConfig
): Promise<SekolahConfig> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Lembar kerja Excel Profil Sekolah kosong.');
  }

  const updatedConfig: SekolahConfig = { ...currentConfig };

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Lewati header
    const keyVal = row.getCell(1).value;
    const valueVal = row.getCell(2).value;

    if (!keyVal) return;
    const key = String(keyVal).trim();
    const val = valueVal !== null && valueVal !== undefined ? String(valueVal).trim() : '';

    switch (key) {
      case 'namaSekolah':
        if (val) updatedConfig.namaSekolah = val;
        break;
      case 'npsn':
        if (val) updatedConfig.npsn = val;
        break;
      case 'alamat':
        if (val) updatedConfig.alamat = val;
        break;
      case 'kecamatan':
        if (val) updatedConfig.kecamatan = val;
        break;
      case 'kabupaten':
        if (val) updatedConfig.kabupaten = val;
        break;
      case 'provinsi':
        if (val) updatedConfig.provinsi = val;
        break;
      case 'tahunJurnal':
        if (val) updatedConfig.tahunJurnal = parseInt(val, 10) || 2026;
        break;
      case 'kepalaSekolahNama':
        if (val) updatedConfig.kepalaSekolahNama = val;
        break;
      case 'kepalaSekolahNIP':
        if (val) updatedConfig.kepalaSekolahNIP = val;
        break;
      case 'kepalaSekolahGolongan':
        if (val) updatedConfig.kepalaSekolahGolongan = val;
        break;
      case 'kepalaSekolahTtd':
        if (val) updatedConfig.kepalaSekolahTtd = val;
        break;
      case 'kopSekolahUrl':
        if (val) updatedConfig.kopSekolahUrl = val;
        break;
      case 'stempelSekolahUrl':
        if (val) updatedConfig.stempelSekolahUrl = val;
        break;
      case 'gasWebAppUrl':
        if (val) updatedConfig.gasWebAppUrl = val;
        break;
      default:
        break;
    }
  });

  return updatedConfig;
};
