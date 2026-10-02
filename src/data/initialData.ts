import { Pegawai, JurnalHarian, SekolahConfig } from '../types';

// =========================================================================
// ASSET BAWAAN RESMI TERSIMPAN PERMANEN DI APLIKASI UNTUK SEMUA PERANGKAT
// =========================================================================

// 1. Tanda Tangan Resmi Kepala Sekolah (Lailatul Fajriah, S.Pd.SD)
export const DEFAULT_TTD_KEPSEK = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 100" width="240" height="100">
  <path d="M 22 72 C 34 32, 46 12, 62 38 C 74 62, 82 16, 92 42 C 100 68, 110 22, 124 40 C 138 52, 150 28, 168 44 C 180 56, 192 46, 202 30 M 32 68 Q 98 92, 212 68 M 112 48 Q 144 26, 164 50" 
        fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
`)}`;

// 2. Stempel Resmi SDN Babelan Kota 01 (Kabupaten Bekasi - Dinas Pendidikan)
export const DEFAULT_STEMPEL_SEKOLAH = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <path id="curveTop" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
    <path id="curveBottom" d="M 178 100 A 78 78 0 0 1 22 100" fill="none" />
  </defs>
  <circle cx="100" cy="100" r="95" fill="none" stroke="#312e81" stroke-width="3" />
  <circle cx="100" cy="100" r="89" fill="none" stroke="#312e81" stroke-width="1.2" />
  <circle cx="100" cy="100" r="63" fill="none" stroke="#312e81" stroke-width="1.2" />
  <circle cx="100" cy="100" r="57" fill="none" stroke="#312e81" stroke-width="1.2" />
  <polygon points="100,74 103,83 112,83 105,88 108,97 100,92 92,97 95,88 88,83 97,83" fill="#312e81" />
  <text x="100" y="112" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="11" font-weight="900" fill="#312e81" letter-spacing="1.2">BABELAN</text>
  <text x="100" y="126" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="10.5" font-weight="900" fill="#312e81" letter-spacing="1">KOTA 01</text>
  <text font-size="10" font-weight="bold" letter-spacing="2.2" fill="#312e81" font-family="Arial, sans-serif">
    <textPath href="#curveTop" startOffset="50%" text-anchor="middle">PEMERINTAH KAB. BEKASI</textPath>
  </text>
  <text font-size="9" font-weight="bold" letter-spacing="2" fill="#312e81" font-family="Arial, sans-serif">
    <textPath href="#curveBottom" startOffset="50%" text-anchor="middle">★ DINAS PENDIDIKAN ★</textPath>
  </text>
</svg>
`)}`;

// 3. Kop Surat Resmi SDN Babelan Kota 01 (Lengkap Lambang Daerah Bekasi)
export const DEFAULT_KOP_SEKOLAH = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 135" width="800" height="135">
  <g transform="translate(15, 8)">
    <path d="M50 5 L88 24 V70 C88 95 50 115 50 115 C50 115 12 95 12 70 V24 Z" fill="#0284c7" stroke="#0f172a" stroke-width="2.5" />
    <path d="M50 12 L80 28 V68 C80 88 50 106 50 106 C50 106 20 88 20 68 V28 Z" fill="#0369a1" />
    <path d="M22 68 H78 V72 H22 Z" fill="#eab308" />
    <polygon points="50,22 55,34 68,34 57,42 61,54 50,46 39,54 43,42 32,34 45,34" fill="#fbbf24" stroke="#d97706" stroke-width="0.5" />
    <path d="M30 65 Q50 48 70 65" stroke="#f8fafc" stroke-width="3" fill="none" />
    <circle cx="50" cy="80" r="14" fill="#f8fafc" stroke="#0f172a" stroke-width="1" />
    <path d="M42 80 H58 M50 72 V88" stroke="#dc2626" stroke-width="2.5" />
    <text x="50" y="100" text-anchor="middle" fill="#ffffff" font-size="7" font-weight="bold" font-family="sans-serif">BEKASI</text>
  </g>
  <g transform="translate(430, 24)" text-anchor="middle" font-family="'Times New Roman', Times, serif">
    <text x="0" y="0" font-size="16" font-weight="bold" fill="#0f172a" letter-spacing="1.5">PEMERINTAH KABUPATEN BEKASI</text>
    <text x="0" y="20" font-size="18" font-weight="bold" fill="#0f172a" letter-spacing="1.5">DINAS PENDIDIKAN</text>
    <text x="0" y="44" font-size="22" font-weight="900" fill="#0284c7" letter-spacing="1">SD NEGERI BABELAN KOTA 01</text>
    <text x="0" y="62" font-size="12" fill="#334155" font-family="Arial, sans-serif">NPSN: 20219135 · Jl. Raya Babelan No. 01, Kel. Babelan Kota, Kec. Babelan, Kab. Bekasi 17610</text>
    <text x="0" y="77" font-size="11" fill="#64748b" font-family="Arial, sans-serif">Kecamatan Babelan, Kabupaten Bekasi, Provinsi Jawa Barat · Tahun 2026</text>
  </g>
</svg>
`)}`;

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
  kepalaSekolahTtd: DEFAULT_TTD_KEPSEK,
  stempelSekolahUrl: DEFAULT_STEMPEL_SEKOLAH,
  kopSekolahUrl: DEFAULT_KOP_SEKOLAH,
  isLocked: true,
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
    label: '1. Kegiatan Pagi Ceria dan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat,',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '06:45',
    jamSelesai: '07:30',
    uraian: 'Kegiatan Pagi Ceria dan Gerakan Tujuh Kebiasaan Anak Indonesia Hebat,',
    output: 'Dokumentasi Foto Kegiatan & Presensi Siswa',
    volume: '1 Kegiatan Pembiasaan'
  },
  {
    label: '2. Melaksanakan Kegiatan Gerakan Literasi Sekolah (GLS)',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '07:00',
    jamSelesai: '07:30',
    uraian: 'Melaksanakan Kegiatan Gerakan Literasi Sekolah (GLS)',
    output: 'Jurnal Membaca Siswa & Foto Kegiatan GLS',
    volume: '1 Sesi GLS'
  },
  {
    label: '3. Mengikuti kegiatan Pembiasaan Senam Pagi Bersama',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '06:45',
    jamSelesai: '07:30',
    uraian: 'Mengikuti kegiatan Pembiasaan Senam Pagi Bersama',
    output: 'Dokumentasi Foto Senam Bersama & Presensi',
    volume: '1 Sesi Senam Bersama'
  },
  {
    label: '4. Melaksanakan Upacara bendera Setiap Hari Senin pagi yang diikuti Semua Guru, Tendik dan Siswa',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '07:00',
    jamSelesai: '07:45',
    uraian: 'Melaksanakan Upacara bendera Setiap Hari Senin pagi yang diikuti Semua Guru, Tendik dan Siswa',
    output: 'Dokumentasi Upacara & Presensi Pegawai/Siswa',
    volume: '1 Kegiatan Upacara'
  },
  {
    label: '5. Melaksanakan Kegiatan  Jum’at Bersih semua siswa',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '07:00',
    jamSelesai: '07:45',
    uraian: 'Melaksanakan Kegiatan  Jum’at Bersih semua siswa',
    output: 'Dokumentasi Foto Jum’at Bersih & Lembar Observasi Lingkungan',
    volume: '1 Sesi Jum’at Bersih'
  },
  {
    label: '6. Melaksanakan Kegaiatan Sholat Dhua Berjama’ah yang di Ikuti oleh semua siswa',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '07:00',
    jamSelesai: '07:45',
    uraian: 'Melaksanakan Kegaiatan Sholat Dhua Berjama’ah yang di Ikuti oleh semua siswa',
    output: 'Dokumentasi Foto Sholat Dhuha & Buku Pembiasaan Ibadah Siswa',
    volume: '1 Sesi Sholat Dhuha'
  },
  {
    label: '7. Melaksanakan kegiatan pagi ceria dan G7KIH, kegiatan.pembelajaran bahasa indonesia dan legiatan refleksi',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '07:00',
    jamSelesai: '11:30',
    uraian: 'Melaksanakan kegiatan pagi ceria dan G7KIH, kegiatan.pembelajaran bahasa indonesia dan legiatan refleksi',
    output: 'Modul Ajar, Lembar Refleksi Siswa, Dokumentasi Foto',
    volume: '1 Sesi KBM'
  },
  {
    label: '8. Melaksanakan kegiatan.pagi ceria & G7KAIH , Kegiatan pembelajaran Bahasa Indonesia dan PJOK , Latiahan sholawat',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '07:00',
    jamSelesai: '12:00',
    uraian: 'Melaksanakan kegiatan.pagi ceria & G7KAIH , Kegiatan pembelajaran Bahasa Indonesia dan PJOK , Latiahan sholawat',
    output: 'Modul Ajar PJOK/Bahasa Indonesia & Dokumentasi Kegiatan',
    volume: '1 Sesi KBM'
  },
  {
    label: '9. Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Asesmen Sumatuf Tengah Semester 1 :',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '07:00',
    jamSelesai: '12:00',
    uraian: 'Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Asesmen Sumatuf Tengah Semester 1 :',
    output: 'Naskah Soal ASTS 1, Berita Acara & Daftar Nilai Siswa',
    volume: '1 Sesi Asesmen'
  },
  {
    label: '10. Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Asesmen Sumatuf Tengah Semester 2',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '07:00',
    jamSelesai: '12:00',
    uraian: 'Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Asesmen Sumatuf Tengah Semester 2',
    output: 'Naskah Soal ASTS 2, Berita Acara & Daftar Nilai Siswa',
    volume: '1 Sesi Asesmen'
  },
  {
    label: '11. Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Penilaian Akhir Sumatif Semester 1',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '07:00',
    jamSelesai: '12:00',
    uraian: 'Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Penilaian Akhir Sumatif Semester 1',
    output: 'Naskah Soal PAS 1, Berita Acara & Rekap Nilai Siswa',
    volume: '1 Sesi Penilaian'
  },
  {
    label: '12. Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Penilaian Akhir Sumatif Semester 2',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '07:00',
    jamSelesai: '12:00',
    uraian: 'Melaksanakan kegiatan pagi ceria dan G7KAIH , kegiatan Penilaian Akhir Sumatif Semester 2',
    output: 'Naskah Soal PAS 2, Berita Acara & Rekap Nilai Siswa',
    volume: '1 Sesi Penilaian'
  },
  {
    label: '13. Mengikuti dan membimbing peserta didik dalam upacara bendera/apel pagi guna pembiasaan disiplin dan karakter profil pelajar Pancasila.',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '07:00',
    jamSelesai: '07:45',
    uraian: 'Mengikuti dan membimbing peserta didik dalam upacara bendera/apel pagi guna pembiasaan disiplin dan karakter profil pelajar Pancasila.',
    output: 'Foto Dokumentasi Upacara & Buku Pembiasaan Karakter',
    volume: '1 Kegiatan Upacara/Apel'
  },
  {
    label: '14. Melaksanakan kegiatan belajar mengajar sesuai modul ajar Kurikulum Merdeka, penjelasan materi, dan pendampingan peserta didik.',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '07:30',
    jamSelesai: '11:30',
    uraian: 'Melaksanakan kegiatan belajar mengajar sesuai modul ajar Kurikulum Merdeka, penjelasan materi, dan pendampingan peserta didik.',
    output: 'Modul Ajar, Lembar Kerja Siswa (LKPD), Jurnal Mengajar',
    volume: '1 Sesi KBM / 30 Siswa'
  },
  {
    label: '15. Menyusun dan mengembangkan perangkat ajar, lembar kerja peserta didik (LKPD), serta bahan ajar tematik.',
    kategori: 'Penyusunan Perangkat / Modul Ajar',
    jamMulai: '11:30',
    jamSelesai: '13:00',
    uraian: 'Menyusun dan mengembangkan perangkat ajar, lembar kerja peserta didik (LKPD), serta bahan ajar tematik.',
    output: 'Dokumen Perangkat Ajar & Bahan Ajar Tematik',
    volume: '1 Dokumen Modul Ajar'
  },
  {
    label: '16. Sosialisasi tentang In House Training yang diikuti oleh Guru dan Tendik.',
    kategori: 'Pengembangan Keprofesian (KKG/PMM)',
    jamMulai: '13:00',
    jamSelesai: '15:00',
    uraian: 'Sosialisasi tentang In House Training yang diikuti oleh Guru dan Tendik.',
    output: 'Daftar Hadir IHT, Notula Sosialisasi, Foto Kegiatan',
    volume: '1 Kegiatan IHT'
  },
  {
    label: '17. Melaksanakan pengelolaan surat-menyurat dinas, pengarsipan berkas sekolah, dan pelayanan administrasi kependidikan.',
    kategori: 'Pelayanan Administrasi Sekolah',
    jamMulai: '07:30',
    jamSelesai: '14:30',
    uraian: 'Melaksanakan pengelolaan surat-menyurat dinas, pengarsipan berkas sekolah, dan pelayanan administrasi kependidikan.',
    output: 'Buku Agenda Surat Masuk/Keluar, Berkas Arsip Sekolah',
    volume: '1 Berkas Administrasi'
  },
  {
    label: '18. Pemeriksaan kedisiplinan pakaian seragam dan kerapian siswa,',
    kategori: 'Pembiasaan Karakter & Upacara Bendera',
    jamMulai: '06:45',
    jamSelesai: '07:15',
    uraian: 'Pemeriksaan kedisiplinan pakaian seragam dan kerapian siswa,',
    output: 'Buku Catatan Ketertiban & Kerapian Siswa',
    volume: '1 Sesi Pemeriksaan'
  },
  {
    label: '19. Pelaksanaan KBM tatap muka materi inti sesuai Modul Ajar,',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '07:30',
    jamSelesai: '11:00',
    uraian: 'Pelaksanaan KBM tatap muka materi inti sesuai Modul Ajar,',
    output: 'Buku Agenda Kelas, Modul Ajar, Presensi Siswa',
    volume: '1 Sesi KBM'
  },
  {
    label: '20. Pembelajaran interaktif, diskusi kelompok terarah, dan presentasi siswa,',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '08:30',
    jamSelesai: '11:30',
    uraian: 'Pembelajaran interaktif, diskusi kelompok terarah, dan presentasi siswa,',
    output: 'Lembar Observasi Diskusi, LKPD Kelompok, Dokumentasi KBM',
    volume: '1 Sesi Diskusi'
  },
  {
    label: '21. Pelaksanaan kegiatan Projek Penguatan Profil Pelajar Pancasila (P5),',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '09:30',
    jamSelesai: '12:00',
    uraian: 'Pelaksanaan kegiatan Projek Penguatan Profil Pelajar Pancasila (P5),',
    output: 'Modul Projek P5, Jurnal Aktivitas Siswa, Dokumentasi Karya',
    volume: '1 Sesi Projek P5'
  },
  {
    label: '22. Pendampingan aktivitas belajar siswa dan tanya jawab pemahaman materi,',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
    jamMulai: '10:00',
    jamSelesai: '12:00',
    uraian: 'Pendampingan aktivitas belajar siswa dan tanya jawab pemahaman materi,',
    output: 'Catatan Observasi Pembelajaran & Catatan Refleksi',
    volume: '1 Sesi Pendampingan'
  },
  {
    label: '23. Bimbingan remedial bagi siswa yang belum mencapai tujuan pembelajaran,',
    kategori: 'Bimbingan Siswa & Ekstrakurikuler',
    jamMulai: '12:30',
    jamSelesai: '13:30',
    uraian: 'Bimbingan remedial bagi siswa yang belum mencapai tujuan pembelajaran,',
    output: 'Daftar Nilai Remedial & Lembar Soal Perbaikan',
    volume: '1 Sesi Remedial'
  },
  {
    label: '24. Pendampingan khusus literasi dan numerasi terbimbing di pojok baca,',
    kategori: 'Bimbingan Siswa & Ekstrakurikuler',
    jamMulai: '07:00',
    jamSelesai: '07:30',
    uraian: 'Pendampingan khusus literasi dan numerasi terbimbing di pojok baca,',
    output: 'Jurnal Pojok Baca & Catatan Progres Membaca Siswa',
    volume: '1 Sesi Literasi/Numerasi'
  },
  {
    label: '25. Pelaksanaan asesmen formatif harian dan untuk pemahaman materi,',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '08:00',
    jamSelesai: '09:30',
    uraian: 'Pelaksanaan asesmen formatif harian dan untuk pemahaman materi,',
    output: 'Lembar Asesmen Formatif & Buku Nilai Harian',
    volume: '1 Dokumen Asesmen'
  },
  {
    label: '26. Pelaksanaan asesmen sumatif materi / ulangan harian,',
    kategori: 'Penilaian & Evaluasi Asesmen',
    jamMulai: '07:30',
    jamSelesai: '09:30',
    uraian: 'Pelaksanaan asesmen sumatif materi / ulangan harian,',
    output: 'Naskah Soal Sumatif, Lembar Jawaban & Daftar Nilai',
    volume: '1 Sesi Asesmen Sumatif'
  },
  {
    label: '27. Pengembangan media pembelajaran interaktif dan bahan tayang digital, Penyusunan instrumen kisi-kisi soal dan rubrik penilaian asesmen,',
    kategori: 'Penyusunan Perangkat / Modul Ajar',
    jamMulai: '13:00',
    jamSelesai: '15:00',
    uraian: 'Pengembangan media pembelajaran interaktif dan bahan tayang digital, Penyusunan instrumen kisi-kisi soal dan rubrik penilaian asesmen,',
    output: 'Slide Bahan Tayang, Kisi-kisi Soal & Rubrik Penilaian',
    volume: '1 Perangkat Media/Asesmen'
  },
  {
    label: '28. Pengisian administrasi presensi siswa dan rekapitulasi ketidakhadiran,',
    kategori: 'Pelayanan Administrasi Sekolah',
    jamMulai: '07:15',
    jamSelesai: '08:00',
    uraian: 'Pengisian administrasi presensi siswa dan rekapitulasi ketidakhadiran,',
    output: 'Buku Presensi Harian & Rekap Absensi Bulanan',
    volume: '1 Rekapitulasi Presensi'
  },
  {
    label: '29. Kegiatan Komunitas Belajar (Kombel) intra-sekolah / KKG guru,',
    kategori: 'Pengembangan Keprofesian (KKG/PMM)',
    jamMulai: '13:30',
    jamSelesai: '15:30',
    uraian: 'Kegiatan Komunitas Belajar (Kombel) intra-sekolah / KKG guru,',
    output: 'Daftar Hadir Kombel/KKG, Notula Kegiatan, Foto Dokumentasi',
    volume: '1 Pertemuan Kombel/KKG'
  },
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
