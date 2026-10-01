import { Pegawai, JurnalHarian, SekolahConfig } from '../types';

export const INITIAL_SEKOLAH: SekolahConfig = {
  namaSekolah: 'SD NEGERI BABELAN KOTA 01',
  npsn: '20219135',
  alamat: 'Jl. Raya Babelan No. 01, Kel. Babelan Kota, Kec. Babelan, Kab. Bekasi 17610',
  kecamatan: 'Kecamatan Babelan',
  kabupaten: 'Kabupaten Bekasi',
  provinsi: 'Jawa Barat',
  tahunJurnal: 2026,
  kepalaSekolahNama: 'LAILATUL FAJRIAH, S.Pd.SD',
  kepalaSekolahNIP: '197808202008012005',
  kepalaSekolahGolongan: 'Pembina Tk. I (IV/b)',
  gasWebAppUrl: '',
};

export const INITIAL_PEGAWAI: Pegawai[] = [];

export const INITIAL_JURNAL: JurnalHarian[] = [];

export const KATEGORI_AKTIVITAS = [
  'Pelaksanaan Pembelajaran (KBM)',
  'Penyusunan Perangkat / Modul Ajar',
  'Penilaian & Evaluasi Asesmen',
  'Bimbingan Siswa & Ekstrakurikuler',
  'Tugas Tambahan / Kepanitiaan',
  'Pengembangan Keprofesian (KKG/PMM)',
  'Pelayanan Administrasi Sekolah',
  'Pembiasaan Karakter & Upacara Bendera',
  'Rapat Dinas / Koordinasi Sekolah',
  'Piket Sekolah & Manajemen Lingkungan'
];

export const PRESET_KEGIATAN = [
  {
    label: 'KBM Tematik / Kurikulum Merdeka',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '07:00',
    jamSelesai: '14:30',
    uraian: 'Melaksanakan kegiatan belajar mengajar sesuai jadwal, apersepsi materi, pendampingan kerja kelompok peserta didik, serta refleksi pembelajaran.',
    output: 'Terlaksananya KBM dan lembar kerja peserta didik',
    volume: '1 Sesi KBM / 30 Siswa'
  },
  {
    label: 'Penyusunan Modul Ajar / RPP',
    kategori: 'Penyusunan Perangkat / Modul Ajar',
    jamMulai: '07:30',
    jamSelesai: '14:30',
    uraian: 'Menyusun rancangan Modul Ajar Kurikulum Merdeka, menyusun rubrik asesmen, dan media ajar interaktif untuk materi bab berikutnya.',
    output: 'Dokumen Modul Ajar lengkap dengan LKPD',
    volume: '1 Dokumen Modul Ajar'
  },
  {
    label: 'Pelaksanaan Asesmen Sumatif / Formatif',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '07:30',
    jamSelesai: '13:30',
    uraian: 'Melaksanakan asesmen formatif/sumatif lingkup materi, mengoreksi lembar jawaban peserta didik, dan menginput hasil nilai ke buku nilai.',
    output: 'Daftar nilai formatif dan analisis ketercapaian tujuan pembelajaran',
    volume: 'Daftar Nilai / 32 Siswa'
  },
  {
    label: 'Pembiasaan Karakter & Sholat Dhuha / Senam',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '06:45',
    jamSelesai: '08:00',
    uraian: 'Mendampingi peserta didik dalam pembiasaan pagi (senam sehat/sholat dhuha bersama, pembacaan Asmaul Husna, dan literasi 15 menit).',
    output: 'Terlaksananya pembiasaan karakter peserta didik dengan tertib',
    volume: '1 Kegiatan Pembiasaan'
  },
  {
    label: 'Kegiatan Ekstrakurikuler Pramuka',
    kategori: 'Bimbingan Siswa & Ekstrakurikuler',
    jamMulai: '14:00',
    jamSelesai: '16:00',
    uraian: 'Melatih dan mendampingi kegiatan kepramukaan golongan Siaga/Penggalang mengenai tali-temali, sandi, dan penanaman dasa darma.',
    output: 'Presensi latihan kepramukaan dan dokumentasi kegiatan',
    volume: '1 Sesi Latihan / 45 Siswa'
  },
  {
    label: 'Pelayanan Tata Usaha / Operator Dapodik',
    kategori: 'Pelayanan Administrasi Sekolah',
    jamMulai: '07:30',
    jamSelesai: '15:30',
    uraian: 'Menginput dan memutakhirkan data kepegawaian PTK, presensi online, kelengkapan arsip surat masuk/keluar, dan layanan administrasi sekolah.',
    output: 'Arsip administrasi dan laporan pemutakhiran data',
    volume: '1 Berkas Administrasi'
  }
];

export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * JURNAL HARIAN SIKAWAN - SD NEGERI BABELAN KOTA 01 TAHUN 2026
 * Backend Script (Kode.gs) - Google Apps Script
 * =========================================================================
 * Fitur:
 * 1. Penyimpanan Data Pegawai & Jurnal Harian ke Google Spreadsheet
 * 2. Penyimpanan Foto Pegawai & TTD Pegawai ke Google Drive Folder
 * 3. Penyimpanan Foto Dokumentasi Kegiatan ke Google Drive Folder
 * 4. API Endpoint (doGet & doPost) untuk web application
 * =========================================================================
 */

// Nama Folder Utama di Google Drive
const ROOT_FOLDER_NAME = "SIKAWAN_SDN_BABELAN_KOTA_01_2026";

// Nama Tab / Sheet di Spreadsheet aktif
const SHEET_PEGAWAI = "DATA_PEGAWAI";
const SHEET_JURNAL = "JURNAL_HARIAN";
const SHEET_SEKOLAH = "DATA_SEKOLAH";

/**
 * 1. Web App Entrypoint (GET)
 */
function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : "";
  
  if (action === "getPegawai") {
    return createJsonResponse(getPegawaiList());
  } else if (action === "getJurnal") {
    const pegawaiId = e.parameter.pegawaiId || "";
    return createJsonResponse(getJurnalList(pegawaiId));
  } else if (action === "getSekolah") {
    return createJsonResponse(getSekolahData());
  } else if (action === "init") {
    initSpreadsheet();
    return createJsonResponse({ status: "success", message: "Inisialisasi Spreadsheet & Folder Drive SDN Babelan Kota 01 Berhasil!" });
  }

  // Tampilkan JSON selamat datang jika diakses langsung
  return createJsonResponse({
    status: "active",
    app: "SIKAWAN SDN BABELAN KOTA 01",
    version: "2026.1",
    endpoints: ["getPegawai", "getJurnal", "getSekolah", "init"]
  });
}

/**
 * 2. Web App Entrypoint (POST)
 */
function doPost(e) {
  try {
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    const action = data.action;

    if (action === "simpanPegawai") {
      const result = simpanPegawai(data);
      return createJsonResponse(result);
    } else if (action === "simpanJurnal") {
      const result = simpanJurnal(data);
      return createJsonResponse(result);
    } else if (action === "simpanSekolah") {
      const result = simpanSekolahData(data);
      return createJsonResponse(result);
    } else if (action === "initSpreadsheet") {
      initSpreadsheet();
      return createJsonResponse({ status: "success", message: "Struktur Spreadsheet Berhasil Disiapkan!" });
    }

    return createJsonResponse({ status: "error", message: "Action tidak dikenal: " + action });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

/**
 * 3. Mengelola Folder Google Drive untuk Foto dan TTD Pegawai
 */
function getOrCreateFolder(folderName, parentFolder) {
  const parent = parentFolder || DriveApp.getRootFolder();
  const folders = parent.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  }
  return parent.createFolder(folderName);
}

function getAppFolders() {
  const root = getOrCreateFolder(ROOT_FOLDER_NAME);
  const fotoFolder = getOrCreateFolder("FOTO_PEGAWAI", root);
  const ttdFolder = getOrCreateFolder("TTD_PEGAWAI", root);
  const dokFolder = getOrCreateFolder("DOKUMENTASI_KEGIATAN", root);
  
  try {
    fotoFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    ttdFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    dokFolder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch(err) {
    Logger.log("Gagal set sharing folder: " + err);
  }

  return { root, fotoFolder, ttdFolder, dokFolder };
}

/**
 * 4. Helper Simpan Base64 Image ke Google Drive
 */
function saveBase64ToDrive(base64Data, fileName, folder) {
  if (!base64Data || !base64Data.includes("base64,")) {
    return base64Data || "";
  }
  
  const parts = base64Data.split("base64,");
  const contentType = parts[0].split(":")[1].split(";")[0];
  const decodedData = Utilities.base64Decode(parts[1]);
  const blob = Utilities.newBlob(decodedData, contentType, fileName);
  
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return "https://lh3.googleusercontent.com/d/" + file.getId();
}

/**
 * 5. Simpan / Perbarui Data Pegawai ke Spreadsheet
 * Menggunakan base64 langsung (bukan link Google Drive) agar dapat tampil langsung
 */
function simpanPegawai(pegawai) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_PEGAWAI);
  if (!sheet) {
    initSpreadsheet();
    sheet = ss.getSheetByName(SHEET_PEGAWAI);
  }

  const timestamp = new Date().getTime();
  const fotoBase64 = pegawai.fotoBase64 || pegawai.fotoUrl || "";
  const ttdBase64 = pegawai.ttdBase64 || pegawai.ttdUrl || "";

  const pegawaiId = pegawai.id || ("PEG-" + timestamp);
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;

  for (let i = 1; i < data.length; i++) {
    if (data[i][8] == pegawaiId || (data[i][1] && data[i][1] == pegawai.nip && pegawai.nip !== "-")) {
      rowIndex = i + 1;
      break;
    }
  }

  const rowValues = [
    rowIndex > 0 ? rowIndex - 1 : data.length,
    pegawai.nip || "-",
    pegawai.nama,
    pegawai.jabatan,
    pegawai.golongan,
    pegawai.status,
    fotoBase64,
    ttdBase64,
    pegawaiId,
    new Date()
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return {
    status: "success",
    message: "Data pegawai " + pegawai.nama + " berhasil disimpan!",
    pegawai: {
      id: pegawaiId,
      nama: pegawai.nama,
      nip: pegawai.nip,
      fotoUrl: fotoBase64,
      ttdUrl: ttdBase64
    }
  };
}

/**
 * 6. Simpan Jurnal Harian ke Spreadsheet
 */
function simpanJurnal(jurnal) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_JURNAL);
  if (!sheet) {
    initSpreadsheet();
    sheet = ss.getSheetByName(SHEET_JURNAL);
  }

  const folders = getAppFolders();
  const timestamp = new Date().getTime();
  const safeDate = (jurnal.tanggal || "2026-00-00");

  let fotoDokUrl = jurnal.fotoDokumentasi || "";
  if (jurnal.fotoDokumentasiBase64) {
    fotoDokUrl = saveBase64ToDrive(jurnal.fotoDokumentasiBase64, "DOK_" + safeDate + "_" + timestamp + ".jpg", folders.dokFolder);
  }

  const jurnalId = jurnal.id || ("JUR-" + timestamp);

  const rowValues = [
    jurnalId,
    jurnal.pegawaiId,
    jurnal.pegawaiNama || "",
    jurnal.tanggal,
    jurnal.hari,
    jurnal.jamMulai,
    jurnal.jamSelesai,
    jurnal.kategori,
    jurnal.uraianKegiatan,
    jurnal.outputHasil,
    jurnal.volumeOutput || "1 Dokumen",
    jurnal.kendala || "Tidak ada kendala",
    jurnal.tindakLanjut || "Selesai",
    fotoDokUrl,
    jurnal.statusVerifikasi || "Disetujui",
    jurnal.catatanKepalaSekolah || "",
    new Date()
  ];

  sheet.appendRow(rowValues);

  return {
    status: "success",
    message: "Jurnal Harian SIKAWAN tanggal " + jurnal.tanggal + " berhasil dicatat!",
    jurnalId: jurnalId,
    fotoDokumentasi: fotoDokUrl
  };
}

/**
 * 7. Baca Daftar Pegawai dari Spreadsheet
 */
function getPegawaiList() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PEGAWAI);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[0]) continue;
    list.push({
      no: row[0],
      nip: row[1],
      nama: row[2],
      jabatan: row[3],
      golongan: row[4],
      status: row[5],
      fotoUrl: row[6],
      ttdUrl: row[7],
      id: row[8] || ("peg-" + i),
      unitKerja: "SD Negeri Babelan Kota 01"
    });
  }
  return list;
}

/**
 * 8. Baca Daftar Jurnal Harian
 */
function getJurnalList(pegawaiId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_JURNAL);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const list = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row[0]) continue;
    if (pegawaiId && row[1] !== pegawaiId) continue;

    list.push({
      id: row[0],
      pegawaiId: row[1],
      pegawaiNama: row[2],
      tanggal: row[3] instanceof Date ? Utilities.formatDate(row[3], Session.getScriptTimeZone(), "yyyy-MM-dd") : row[3],
      hari: row[4],
      jamMulai: row[5],
      jamSelesai: row[6],
      kategori: row[7],
      uraianKegiatan: row[8],
      outputHasil: row[9],
      volumeOutput: row[10],
      kendala: row[11],
      tindakLanjut: row[12],
      fotoDokumentasi: row[13],
      statusVerifikasi: row[14],
      catatanKepalaSekolah: row[15]
    });
  }
  return list;
}

/**
 * 9. Inisialisasi Header dan Struktur Spreadsheet SDN Babelan Kota 01
 */
function initSpreadsheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Tab 1: DATA_PEGAWAI
  let sPegawai = ss.getSheetByName(SHEET_PEGAWAI);
  if (!sPegawai) {
    sPegawai = ss.insertSheet(SHEET_PEGAWAI);
  }
  const headersPegawai = [
    "NO", "NIP_PEGAWAI", "NAMA_PEGAWAI", "JABATAN", "PANGKAT_GOLONGAN",
    "STATUS", "LINK_FOTO_DRIVE", "LINK_TTD_DRIVE", "ID_PEGAWAI", "TIMESTAMP_UPDATE"
  ];
  sPegawai.getRange(1, 1, 1, headersPegawai.length).setValues([headersPegawai]);
  formatHeaderRange(sPegawai.getRange(1, 1, 1, headersPegawai.length));

  // Tab 2: JURNAL_HARIAN
  let sJurnal = ss.getSheetByName(SHEET_JURNAL);
  if (!sJurnal) {
    sJurnal = ss.insertSheet(SHEET_JURNAL);
  }
  const headersJurnal = [
    "ID_JURNAL", "ID_PEGAWAI", "NAMA_PEGAWAI", "TANGGAL", "HARI",
    "JAM_MULAI", "JAM_SELESAI", "KATEGORI_KEGIATAN", "URAIAN_KEGIATAN",
    "OUTPUT_HASIL", "VOLUME_OUTPUT", "KENDALA", "TINDAK_LANJUT",
    "LINK_FOTO_DOKUMENTASI", "STATUS_VERIFIKASI", "CATATAN_KEPSEK", "TIMESTAMP_INPUT"
  ];
  sJurnal.getRange(1, 1, 1, headersJurnal.length).setValues([headersJurnal]);
  formatHeaderRange(sJurnal.getRange(1, 1, 1, headersJurnal.length));

  // Tab 3: DATA_SEKOLAH
  let sSekolah = ss.getSheetByName(SHEET_SEKOLAH);
  if (!sSekolah) {
    sSekolah = ss.insertSheet(SHEET_SEKOLAH);
  }
  const headersSekolah = ["PARAMETER", "NILAI_DATA"];
  sSekolah.getRange(1, 1, 1, headersSekolah.length).setValues([headersSekolah]);
  formatHeaderRange(sSekolah.getRange(1, 1, 1, headersSekolah.length));

  const sekolahData = [
    ["NAMA_SEKOLAH", "SD NEGERI BABELAN KOTA 01"],
    ["NPSN", "20219135"],
    ["ALAMAT", "Jl. Raya Babelan No. 01, Kel. Babelan Kota, Kec. Babelan, Kab. Bekasi"],
    ["KABUPATEN", "Kabupaten Bekasi"],
    ["PROVINSI", "Jawa Barat"],
    ["TAHUN_ANGGARAN", "2026"],
    ["NAMA_KEPALA_SEKOLAH", "LAILATUL FAJRIAH, S.Pd.SD"],
    ["NIP_KEPALA_SEKOLAH", "197808202008012005"],
    ["GOLONGAN_KEPALA_SEKOLAH", "Pembina Tk. I (IV/b)"]
  ];
  sSekolah.getRange(2, 1, sekolahData.length, 2).setValues(sekolahData);

  getAppFolders();
}

/**
 * 10. Simpan Profil Sekolah ke Spreadsheet (Format Key-Value Base64 Langsung)
 */
function simpanSekolahData(sekolah) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_SEKOLAH);
  if (!sheet) {
    initSpreadsheet();
    sheet = ss.getSheetByName(SHEET_SEKOLAH);
  }

  const keyValues = [
    ["namaSekolah", sekolah.namaSekolah || "SD NEGERI BABELAN KOTA 01"],
    ["npsn", sekolah.npsn || "20219135"],
    ["alamat", sekolah.alamat || ""],
    ["kecamatan", sekolah.kecamatan || "Kecamatan Babelan"],
    ["kabupaten", sekolah.kabupaten || "Kabupaten Bekasi"],
    ["provinsi", sekolah.provinsi || "Jawa Barat"],
    ["tahunJurnal", String(sekolah.tahunJurnal || 2026)],
    ["kepalaSekolahNama", sekolah.kepalaSekolahNama || "LAILATUL FAJRIAH, S.Pd.SD"],
    ["kepalaSekolahNIP", sekolah.kepalaSekolahNIP || "197808202008012005"],
    ["kepalaSekolahGolongan", sekolah.kepalaSekolahGolongan || "Pembina Tk. I (IV/b)"],
    ["kepalaSekolahTtd", sekolah.ttdKepsekBase64 || sekolah.kepalaSekolahTtd || ""],
    ["kopSekolahUrl", sekolah.kopBase64 || sekolah.kopSekolahUrl || ""],
    ["stempelSekolahUrl", sekolah.stempelBase64 || sekolah.stempelSekolahUrl || ""]
  ];

  const existingData = sheet.getDataRange().getValues();
  const mapIndex = {};
  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][0]) {
      mapIndex[existingData[i][0].toString().trim()] = i + 1;
    }
  }

  keyValues.forEach(pair => {
    const key = pair[0];
    const val = pair[1];
    if (mapIndex[key]) {
      sheet.getRange(mapIndex[key], 2).setValue(val);
    } else {
      sheet.appendRow([key, val]);
    }
  });

  return {
    status: "success",
    message: "Profil Sekolah dan Berkas Resmi (Base64) berhasil disimpan ke Spreadsheet!"
  };
}

function formatHeaderRange(range) {
  range.setBackground("#1e3a8a");
  range.setFontColor("#ffffff");
  range.setFontWeight("bold");
  range.setHorizontalAlignment("center");
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
