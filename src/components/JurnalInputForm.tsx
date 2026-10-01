import React, { useState } from 'react';
import { Pegawai, JurnalHarian, SekolahConfig, KegiatanItem } from '../types';
import { F4PrintDocument } from './F4PrintDocument';
import { 
  Upload, 
  CheckCircle2, 
  Clock, 
  Printer, 
  Trash2, 
  Camera, 
  Sparkles, 
  User, 
  Calendar, 
  ChevronDown,
  Layers,
  ImageIcon,
  Plus,
  X,
  Download
} from 'lucide-react';
import { syncToGoogleAppsScript } from '../services/gasApi';
import { downloadF4Pdf } from '../services/pdfExporter';

interface JurnalInputFormProps {
  pegawaiList: Pegawai[];
  sekolah: SekolahConfig;
  onJurnalSaved: (jurnal: JurnalHarian) => void;
  editingJurnal?: JurnalHarian | null;
  onCancelEdit?: () => void;
}

const SHIFTS = [
  {
    id: 'guru-pagi',
    label: 'Guru: Shift Pagi (06.30 - 14.00)',
    jamMulaiJam: '06',
    jamMulaiMenit: '30',
    jamSelesaiJam: '14',
    jamSelesaiMenit: '00',
  },
  {
    id: 'guru-siang',
    label: 'Guru: Shift Siang (10.00 - 17.30)',
    jamMulaiJam: '10',
    jamMulaiMenit: '00',
    jamSelesaiJam: '17',
    jamSelesaiMenit: '30',
  },
  {
    id: 'tendik-pagi',
    label: 'Tenaga Kependidikan: Shift Pagi (07.00 - 15.30)',
    jamMulaiJam: '07',
    jamMulaiMenit: '00',
    jamSelesaiJam: '15',
    jamSelesaiMenit: '30',
  },
];

const HOURS = ['06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

const TEMPLATES_KEGIATAN = [
  {
    label: 'KBM Tatap Muka Sesuai Modul Ajar',
    uraian: 'Melaksanakan kegiatan belajar mengajar sesuai modul ajar Kurikulum Merdeka, penjelasan materi, dan pendampingan peserta didik.',
    buktiDukung: 'Modul Ajar, Jurnal KBM, Presensi Siswa',
    kategori: 'Pelaksanaan Pembelajaran (KBM)',
  },
  {
    label: 'Penyusunan Perangkat & RPP / Modul',
    uraian: 'Menyusun dan mengembangkan perangkat ajar, lembar kerja peserta didik (LKPD), serta bahan ajar tematik.',
    buktiDukung: '',
    kategori: 'Perencanaan Pembelajaran',
  },
  {
    label: 'Penilaian & Evaluasi Asesmen Siswa',
    uraian: 'Melaksanakan penilaian harian/formatif, mengoreksi tugas peserta didik, dan menganalisis capaian asesmen siswa.',
    buktiDukung: 'Buku Nilai, Instrumen Asesmen Siswa',
    kategori: 'Penilaian / Evaluasi Hasil Belajar',
  },
  {
    label: 'Piket Sekolah & Presensi Siswa',
    uraian: 'Melaksanakan tugas guru piket, menyambut kedatangan siswa, memantau ketertiban lingkungan sekolah, dan presensi harian.',
    buktiDukung: 'Buku Jurnal Piket Harian',
    kategori: 'Tugas Tambahan / Piket',
  },
  {
    label: 'Upacara Bendera / Apel Pagi',
    uraian: 'Mengikuti dan membimbing peserta didik dalam upacara bendera/apel pagi guna pembiasaan disiplin dan karakter profil pelajar Pancasila.',
    buktiDukung: 'Foto Dokumentasi Upacara & Presensi',
    kategori: 'Pembiasaan Karakter / Apel',
  },
  {
    label: 'Pelayanan Administrasi Sekolah',
    uraian: 'Melaksanakan pengelolaan surat-menyurat dinas, pengarsipan berkas sekolah, dan pelayanan administrasi kependidikan.',
    buktiDukung: 'Buku Agenda Surat & Arsip Berkas',
    kategori: 'Pelayanan Administrasi Sekolah',
  },
];

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getHariFromDateString = (dateVal: string): string => {
  try {
    const d = new Date(dateVal + 'T00:00:00');
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return dayNames[d.getDay()] || 'Senin';
  } catch {
    return 'Senin';
  }
};

export const JurnalInputForm: React.FC<JurnalInputFormProps> = ({
  pegawaiList,
  sekolah,
  onJurnalSaved,
  editingJurnal,
  onCancelEdit,
}) => {
  // Form State - Dimulai terhitung dari Hari & Tanggal Hari Ini
  const initialToday = getTodayDateString();
  const [selectedPegawaiId, setSelectedPegawaiId] = useState<string>(
    pegawaiList.length > 0 ? pegawaiList[0]?.id : ''
  );
  const [tanggal, setTanggal] = useState<string>(initialToday);
  const [hari, setHari] = useState<string>(getHariFromDateString(initialToday));
  const [selectedShift, setSelectedShift] = useState<string>('guru-pagi');

  // Multi Kegiatan State (sesuai kegiatan.png)
  const [kegiatanList, setKegiatanList] = useState<KegiatanItem[]>([
    {
      id: 'keg-1',
      jamMulaiJam: '07',
      jamMulaiMenit: '00',
      jamSelesaiJam: '08',
      jamSelesaiMenit: '00',
      uraian: '',
      buktiDukung: '',
      fotoBase64: '',
      kategori: 'Pelaksanaan Pembelajaran (KBM)',
    },
  ]);

  // Efek ketika memuat jurnal untuk diedit dari Riwayat Harian
  React.useEffect(() => {
    if (editingJurnal) {
      setSelectedPegawaiId(editingJurnal.pegawaiId);
      setTanggal(editingJurnal.tanggal);
      setHari(editingJurnal.hari);
      if (editingJurnal.kegiatanList && editingJurnal.kegiatanList.length > 0) {
        setKegiatanList(editingJurnal.kegiatanList);
      } else {
        const [jmH = '07', jmM = '00'] = (editingJurnal.jamMulai || '07:00').split(':');
        const [jsH = '14', jsM = '00'] = (editingJurnal.jamSelesai || '14:00').split(':');
        setKegiatanList([
          {
            id: 'keg-1',
            jamMulaiJam: jmH,
            jamMulaiMenit: jmM,
            jamSelesaiJam: jsH,
            jamSelesaiMenit: jsM,
            uraian: editingJurnal.uraianKegiatan || '',
            buktiDukung: editingJurnal.volumeOutput || '',
            fotoBase64: editingJurnal.fotoDokumentasi || '',
            kategori: editingJurnal.kategori || 'Pelaksanaan Pembelajaran (KBM)',
          },
        ]);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [editingJurnal]);

  // Modal template picker state
  const [templateModalTargetIndex, setTemplateModalTargetIndex] = useState<number | null>(null);

  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExportingDirect, setIsExportingDirect] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleDirectDownloadPdf = async () => {
    try {
      setIsExportingDirect(true);
      const sheet = document.getElementById('f4-print-sheet');
      if (sheet) {
        await downloadF4Pdf(
          sheet,
          draftJurnal.pegawaiNama || currentPegawai?.nama,
          currentPegawai?.nip || draftJurnal.pegawaiId
        );
      } else {
        setShowPrintModal(true);
      }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setShowPrintModal(true);
    } finally {
      setIsExportingDirect(false);
    }
  };

  const handleModalDownloadPdf = async () => {
    try {
      setIsExportingDirect(true);
      const sheet =
        document.querySelector('#modal-f4-wrapper #f4-print-sheet') ||
        document.getElementById('f4-print-sheet');
      if (sheet) {
        await downloadF4Pdf(
          sheet as HTMLElement,
          draftJurnal.pegawaiNama || currentPegawai?.nama,
          currentPegawai?.nip || draftJurnal.pegawaiId
        );
      }
    } catch (err) {
      console.error('Error downloading PDF from modal:', err);
      window.print();
    } finally {
      setIsExportingDirect(false);
    }
  };

  // Automatically update day when date changes
  const handleDateChange = (dateVal: string) => {
    setTanggal(dateVal);
    try {
      const d = new Date(dateVal + 'T00:00:00');
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      setHari(dayNames[d.getDay()] || 'Senin');
    } catch {
      // keep current
    }
  };

  const handleSetToday = () => {
    const today = new Date().toISOString().split('T')[0];
    handleDateChange(today);
  };

  const currentPegawai = pegawaiList.find((p) => p.id === selectedPegawaiId) || pegawaiList[0];

  // Select shift
  const handleSelectShift = (shift: typeof SHIFTS[0]) => {
    setSelectedShift(shift.id);
    if (kegiatanList.length > 0) {
      setKegiatanList((prev) => {
        const copy = [...prev];
        copy[0] = {
          ...copy[0],
          jamMulaiJam: shift.jamMulaiJam,
          jamMulaiMenit: shift.jamMulaiMenit,
        };
        return copy;
      });
    }
  };

  const handleApplyShiftTemplate = () => {
    const shift = SHIFTS.find((s) => s.id === selectedShift) || SHIFTS[0];
    handleSelectShift(shift);

    // Populate rows with structured schedule
    if (shift.id === 'tendik-pagi') {
      setKegiatanList([
        {
          id: 'keg-1',
          jamMulaiJam: '07',
          jamMulaiMenit: '00',
          jamSelesaiJam: '09',
          jamSelesaiMenit: '30',
          uraian: 'Membuka pelayanan administrasi persuratan dinas dan presensi harian pegawai.',
          buktiDukung: 'Buku Agenda Surat Masuk/Keluar',
          kategori: 'Pelayanan Administrasi Sekolah',
        },
        {
          id: 'keg-2',
          jamMulaiJam: '09',
          jamMulaiMenit: '30',
          jamSelesaiJam: '12',
          jamSelesaiMenit: '00',
          uraian: 'Pengarsipan dokumen kesiswaan, kepegawaian, dan pemutakhiran data Dapodik.',
          buktiDukung: 'Berkas Arsip & Laporan Dapodik',
          kategori: 'Pengelolaan Data & Berkas',
        },
        {
          id: 'keg-3',
          jamMulaiJam: '13',
          jamMulaiMenit: '00',
          jamSelesaiJam: '15',
          jamSelesaiMenit: '30',
          uraian: 'Rekapitulasi berkas operasional sekolah dan penataan inventaris sarana prasarana.',
          buktiDukung: 'Buku Inventaris & Rekap Operasional',
          kategori: 'Sarana & Prasarana',
        },
      ]);
    } else {
      setKegiatanList([
        {
          id: 'keg-1',
          jamMulaiJam: shift.jamMulaiJam,
          jamMulaiMenit: shift.jamMulaiMenit,
          jamSelesaiJam: '08',
          jamSelesaiMenit: '10',
          uraian: 'Melaksanakan pembiasaan pagi, apel/literasi, dan menyambut siswa di gerbang sekolah.',
          buktiDukung: 'Buku Presensi Siswa & Jurnal Pembiasaan',
          kategori: 'Pembiasaan Karakter / Apel',
        },
        {
          id: 'keg-2',
          jamMulaiJam: '08',
          jamMulaiMenit: '10',
          jamSelesaiJam: '11',
          jamSelesaiMenit: '30',
          uraian: 'Melaksanakan kegiatan belajar mengajar sesuai modul ajar Kurikulum Merdeka dan pendampingan siswa.',
          buktiDukung: 'Modul Ajar, Jurnal KBM, LKPD',
          kategori: 'Pelaksanaan Pembelajaran (KBM)',
        },
        {
          id: 'keg-3',
          jamMulaiJam: '12',
          jamMulaiMenit: '30',
          jamSelesaiJam: shift.jamSelesaiJam,
          jamSelesaiMenit: shift.jamSelesaiMenit,
          uraian: 'Melaksanakan penilaian formatif, mengoreksi tugas peserta didik, dan refleksi pembelajaran.',
          buktiDukung: 'Lembar Penilaian & Buku Nilai Siswa',
          kategori: 'Penilaian / Evaluasi Hasil Belajar',
        },
      ]);
    }

    setSubmitStatus({
      type: 'success',
      message: `Template shift ${shift.label} berhasil diterapkan!`,
    });
    setTimeout(() => setSubmitStatus(null), 3500);
  };

  // Add new activity row
  const handleAddKegiatan = () => {
    const last = kegiatanList[kegiatanList.length - 1];
    let nextStartHour = last ? last.jamSelesaiJam : '08';
    let nextStartMin = last ? last.jamSelesaiMenit : '00';
    let nextEndHour = String(Math.min(18, parseInt(nextStartHour, 10) + 1)).padStart(2, '0');

    setKegiatanList([
      ...kegiatanList,
      {
        id: 'keg-' + Date.now(),
        jamMulaiJam: nextStartHour,
        jamMulaiMenit: nextStartMin,
        jamSelesaiJam: nextEndHour,
        jamSelesaiMenit: nextStartMin,
        uraian: '',
        buktiDukung: '',
        fotoBase64: '',
        kategori: 'Pelaksanaan Pembelajaran (KBM)',
      },
    ]);
  };

  // Remove activity row
  const handleRemoveKegiatan = (index: number) => {
    if (kegiatanList.length === 1) {
      // If only 1 row, just reset fields
      setKegiatanList([
        {
          id: 'keg-1',
          jamMulaiJam: '07',
          jamMulaiMenit: '00',
          jamSelesaiJam: '08',
          jamSelesaiMenit: '00',
          uraian: '',
          buktiDukung: '',
          fotoBase64: '',
          kategori: 'Pelaksanaan Pembelajaran (KBM)',
        },
      ]);
      return;
    }
    setKegiatanList(kegiatanList.filter((_, i) => i !== index));
  };

  // Update specific field on activity row
  const handleUpdateItem = (index: number, field: keyof KegiatanItem, val: string) => {
    setKegiatanList((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: val,
      };
      return copy;
    });
  };

  // Upload photo for specific activity row
  const handleUploadPhotoForItem = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      handleUpdateItem(index, 'fotoBase64', result);
    };
    reader.readAsDataURL(file);
  };

  // Apply template to specific activity row
  const handleApplyTemplateToItem = (itemIndex: number, tmpl: typeof TEMPLATES_KEGIATAN[0]) => {
    setKegiatanList((prev) => {
      const copy = [...prev];
      copy[itemIndex] = {
        ...copy[itemIndex],
        uraian: tmpl.uraian,
        buktiDukung: tmpl.buktiDukung,
        kategori: tmpl.kategori,
      };
      return copy;
    });
    setTemplateModalTargetIndex(null);
  };

  // Determine overall start & end hours for the document header
  const overallStart = kegiatanList[0] 
    ? `${kegiatanList[0].jamMulaiJam}:${kegiatanList[0].jamMulaiMenit}` 
    : '07:00';
  const overallEnd = kegiatanList[kegiatanList.length - 1] 
    ? `${kegiatanList[kegiatanList.length - 1].jamSelesaiJam}:${kegiatanList[kegiatanList.length - 1].jamSelesaiMenit}` 
    : '14:00';

  // Construct draft object for live preview
  const draftJurnal: JurnalHarian = {
    id: 'draft-prev',
    pegawaiId: currentPegawai?.id || '',
    pegawaiNama: currentPegawai?.nama || 'Nama Pegawai',
    tanggal: tanggal,
    hari: hari,
    jamMulai: overallStart,
    jamSelesai: overallEnd,
    kategori: kegiatanList[0]?.kategori || 'Pelaksanaan Pembelajaran (KBM)',
    uraianKegiatan: kegiatanList.map((k, i) => `${i + 1}. ${k.uraian}`).join('\n') || 'Belum ada uraian kegiatan harian.',
    outputHasil: kegiatanList.map((k) => k.buktiDukung).filter(Boolean).join(', ') || '1 Dokumen Kegiatan Terlaksana',
    volumeOutput: `${kegiatanList.length} Kegiatan`,
    kendala: 'Tidak ada kendala',
    tindakLanjut: 'Selesai',
    fotoDokumentasi: kegiatanList.find((k) => !!k.fotoBase64)?.fotoBase64 || '',
    kegiatanList: kegiatanList,
    statusVerifikasi: 'Disetujui',
    catatanKepalaSekolah: 'Jurnal harian disetujui.',
    createdAt: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasUraian = kegiatanList.some((k) => k.uraian.trim().length > 0);
    if (!hasUraian) {
      alert('Mohon isi minimal satu uraian kegiatan kerja hari ini.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const firstPhoto = kegiatanList.find((k) => !!k.fotoBase64)?.fotoBase64 || '';

    const newJurnal: JurnalHarian = {
      id: editingJurnal?.id || ('jurnal-' + Date.now()),
      pegawaiId: currentPegawai?.id || 'pg-1',
      pegawaiNama: currentPegawai?.nama || 'Nama Pegawai',
      tanggal,
      hari,
      jamMulai: overallStart,
      jamSelesai: overallEnd,
      kategori: kegiatanList[0]?.kategori || 'Pelaksanaan Pembelajaran (KBM)',
      uraianKegiatan: kegiatanList.map((k, i) => `${i + 1}. ${k.uraian}`).join('\n'),
      outputHasil: kegiatanList.map((k) => k.buktiDukung).filter(Boolean).join(', ') || '1 Dokumen Terlaksana',
      volumeOutput: `${kegiatanList.length} Kegiatan`,
      kendala: 'Tidak ada kendala',
      tindakLanjut: 'Tuntas',
      fotoDokumentasi: firstPhoto,
      kegiatanList: kegiatanList,
      statusVerifikasi: 'Disetujui',
      catatanKepalaSekolah: 'Jurnal harian disetujui.',
      createdAt: editingJurnal?.createdAt || new Date().toISOString(),
    };

    try {
      onJurnalSaved(newJurnal);

      if (sekolah.gasWebAppUrl) {
        await syncToGoogleAppsScript(sekolah.gasWebAppUrl, 'simpanJurnal', {
          ...newJurnal,
          fotoDokumentasiBase64: firstPhoto,
        });
        setSubmitStatus({
          type: 'success',
          message: 'Berhasil! Jurnal telah tersimpan ke Google Sheets & Foto ke Google Drive.',
        });
      } else {
        setSubmitStatus({
          type: 'success',
          message: 'Berhasil tersimpan ke sistem SIKAWAN 2026! Siap dicetak format F4.',
        });
      }

      // Reset
      setKegiatanList([
        {
          id: 'keg-1',
          jamMulaiJam: '07',
          jamMulaiMenit: '00',
          jamSelesaiJam: '08',
          jamSelesaiMenit: '00',
          uraian: '',
          buktiDukung: '',
          fotoBase64: '',
          kategori: 'Pelaksanaan Pembelajaran (KBM)',
        },
      ]);
    } catch (err) {
      console.error(err);
      setSubmitStatus({
        type: 'error',
        message: 'Data tersimpan di perangkat lokal. Gagal sinkron ke Google Drive/Sheets.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ========================================================= */}
      {/* KOLOM KIRI: FORM INPUT JURNAL HARIAN */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight">Input Jurnal Harian Pegawai</h2>
          </div>
          <span className="text-xs font-mono font-medium text-blue-200 bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
            Tahun 2026
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Status Alert */}
          {submitStatus && (
            <div
              className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                submitStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{submitStatus.message}</span>
            </div>
          )}

          {/* Banner Mode Edit dari Riwayat */}
          {editingJurnal && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold">Mode Edit Jurnal:</span>
                <span>{editingJurnal.pegawaiNama} ({editingJurnal.hari}, {editingJurnal.tanggal})</span>
              </div>
              {onCancelEdit && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded text-amber-900 text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Batal Edit
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ========================================================= */}
            {/* KARTU 1: PILIH SHIFT KERJA (Sesuai Mockup SHIFT_1.png) */}
            {/* ========================================================= */}
            <div className="rounded-2xl border-2 border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Clock className="w-4 h-4" />
                  </div>
                  <label className="font-bold text-slate-800 text-xs tracking-tight">
                    Pilih Shift Kerja
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleApplyShiftTemplate}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-700 hover:from-blue-900 hover:to-indigo-800 text-white text-[11px] font-semibold rounded-lg shadow-xs transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Terapkan Template</span>
                </button>
              </div>

              <div className="relative">
                <select
                  value={selectedShift}
                  onChange={(e) => {
                    const found = SHIFTS.find((s) => s.id === e.target.value);
                    if (found) handleSelectShift(found);
                  }}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 shadow-2xs cursor-pointer appearance-none pr-8"
                >
                  {SHIFTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* ========================================================= */}
            {/* KARTU 2: PILIH PEGAWAI (Sesuai Mockup SHIFT_1.png) */}
            {/* ========================================================= */}
            <div className="rounded-2xl border-2 border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/40 p-4 shadow-xs">
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <User className="w-4 h-4" />
                </div>
                <label className="font-bold text-slate-800 text-xs tracking-tight">
                  Pilih Pegawai
                </label>
              </div>

              <div className="relative">
                <select
                  value={selectedPegawaiId}
                  onChange={(e) => setSelectedPegawaiId(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 shadow-2xs cursor-pointer appearance-none pr-8"
                  required
                >
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>

              <div className="mt-2.5 pt-2 border-t border-blue-100/90 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-600 text-[11px]">
                  NIP: {currentPegawai?.nip && currentPegawai.nip !== '-' ? currentPegawai.nip : '196805121991031005'}
                </span>
                <span className="px-2.5 py-0.5 rounded-md font-semibold text-[11px] bg-blue-100 text-blue-800 border border-blue-200">
                  Aktif
                </span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* KARTU 3: HARI / TANGGAL (Sesuai Mockup SHIFT_1.png) */}
            {/* ========================================================= */}
            <div className="rounded-2xl border-2 border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/40 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <label className="font-bold text-slate-800 text-xs tracking-tight">
                    Hari / Tanggal
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="px-3 py-1 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white rounded-lg text-[11px] font-semibold transition-all shadow-2xs cursor-pointer"
                >
                  Hari Ini
                </button>
              </div>

              <div className="relative">
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white border border-blue-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-slate-800 shadow-2xs cursor-pointer"
                  required
                />
              </div>

              <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between px-0.5">
                <span>Hari: <strong className="text-slate-700">{hari}</strong></span>
                <span>Rentang Waktu: <strong className="text-blue-700 font-mono">{overallStart} - {overallEnd} WIB</strong></span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* KARTU 4: KEGIATAN HARI INI (Sesuai Desain Gambar kegiatan.png) */}
            {/* Ditempatkan tepat di bawah Hari/Tanggal dengan tema biru gradasi */}
            {/* ========================================================= */}
            <div className="rounded-2xl border-2 border-blue-200/90 bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-indigo-50/50 p-4 shadow-xs space-y-3">
              {/* Header Kegiatan Hari Ini */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-2xs">
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                      Kegiatan Hari Ini
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    *Atur Jam Mulai & Selesai dan Uraian Kegiatan masing-masing.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs">
                  {kegiatanList.length} Kegiatan
                </span>
              </div>

              {/* Daftar Baris Kegiatan */}
              <div className="space-y-3">
                {kegiatanList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white border border-blue-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-2xs transition-all hover:border-blue-300"
                  >
                    {/* Baris 1: Nomor, Mulai HH:MM, Selesai HH:MM, dan Hapus */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>

                        <span className="text-slate-600 font-medium">Mulai:</span>
                        <div className="flex items-center gap-1">
                          <select
                            value={item.jamMulaiJam}
                            onChange={(e) => handleUpdateItem(idx, 'jamMulaiJam', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                          >
                            {HOURS.map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <span className="font-bold text-slate-500">:</span>
                          <select
                            value={item.jamMulaiMenit}
                            onChange={(e) => handleUpdateItem(idx, 'jamMulaiMenit', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                          >
                            {MINUTES.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>

                        <span className="text-slate-600 font-medium ml-1">Selesai:</span>
                        <div className="flex items-center gap-1">
                          <select
                            value={item.jamSelesaiJam}
                            onChange={(e) => handleUpdateItem(idx, 'jamSelesaiJam', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                          >
                            {HOURS.map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                          <span className="font-bold text-slate-500">:</span>
                          <select
                            value={item.jamSelesaiMenit}
                            onChange={(e) => handleUpdateItem(idx, 'jamSelesaiMenit', e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-600 focus:outline-hidden"
                          >
                            {MINUTES.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Tombol Hapus Baris */}
                      <button
                        type="button"
                        onClick={() => handleRemoveKegiatan(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus baris kegiatan ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Baris 2: Textarea Uraian Kegiatan */}
                    <textarea
                      value={item.uraian}
                      onChange={(e) => handleUpdateItem(idx, 'uraian', e.target.value)}
                      rows={2}
                      placeholder="Ketik uraian kegiatan kerja..."
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-50/60 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 resize-y"
                      required
                    />

                    {/* Baris 3: Tombol Upload Foto & Template */}
                    <div className="flex items-center gap-2">
                      <label className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-xl transition-all cursor-pointer shadow-2xs ${
                        item.fotoBase64
                          ? 'text-blue-800 bg-blue-50 border border-blue-300'
                          : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-100'
                      }`}>
                        <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{item.fotoBase64 ? 'Ganti Foto' : 'Upload Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadPhotoForItem(idx, e)}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => setTemplateModalTargetIndex(idx)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Template</span>
                      </button>

                      {item.fotoBase64 && (
                        <button
                          type="button"
                          onClick={() => handleUpdateItem(idx, 'fotoBase64', '')}
                          className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 px-2 py-1 rounded-lg hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer ml-auto"
                          title="Hapus foto kegiatan ini"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hapus Foto</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tombol + + Tambah Baris Baru (Dashed) */}
              <button
                type="button"
                onClick={handleAddKegiatan}
                className="w-full py-2.5 border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-2xl bg-white/70 hover:bg-blue-50/80 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baris Baru</span>
              </button>
            </div>

            {/* Tombol Simpan Form */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 hover:from-blue-950 hover:to-blue-800 text-white font-semibold rounded-xl text-xs md:text-sm shadow-xs transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Upload className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan Jurnal...' : 'Simpan Jurnal Harian'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectDownloadPdf}
                disabled={isExportingDirect}
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold rounded-xl text-xs md:text-sm border border-emerald-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
                title="Download langsung file PDF F4"
              >
                <Download className="w-4 h-4 text-emerald-100" />
                <span>{isExportingDirect ? 'Membuat PDF...' : 'Simpan PDF'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* KOLOM KANAN: PRATINJAU LANGSUNG DOKUMEN F4 */}
      {/* ========================================================= */}
      <div className="lg:col-span-6 lg:sticky lg:top-[124px]">
        <div className="bg-slate-900 text-white px-4 py-2.5 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold tracking-wide uppercase">
              Pratinjau Langsung Lembar F4 Resmi
            </span>
          </div>
          <button
            onClick={() => setShowPrintModal(true)}
            className="flex items-center gap-1 text-[11px] font-medium bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Simpan PDF
          </button>
        </div>

        <div className="bg-white border-x border-b border-slate-300 rounded-b-xl overflow-hidden shadow-lg p-2 max-h-[820px] overflow-y-auto">
          <div className="w-full flex justify-center overflow-x-auto">
            <F4PrintDocument
              jurnal={draftJurnal}
              pegawai={currentPegawai}
              sekolah={sekolah}
            />
          </div>
        </div>
      </div>

      {/* MODAL DIALOG TEMPLATE KEGIATAN PER BARIS */}
      {templateModalTargetIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-800">
                  Pilih Template Kegiatan (Baris {templateModalTargetIndex + 1})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setTemplateModalTargetIndex(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {TEMPLATES_KEGIATAN.map((tmpl, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => handleApplyTemplateToItem(templateModalTargetIndex, tmpl)}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/60 transition-all cursor-pointer group"
                >
                  <p className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                    {tmpl.label}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {tmpl.uraian}
                  </p>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setTemplateModalTargetIndex(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DIALOG CETAK LEMBAR F4 */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-bold text-sm md:text-base">
                  Cetak Lmbar Jurnal Harian
                </h3>
                <p className="text-xs text-slate-400">
                  Dokumen resmi kedinasan siap dicetak langsung atau disimpan ke PDF
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleModalDownloadPdf}
                  disabled={isExportingDirect}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  title="Unduh langsung file PDF F4"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExportingDirect ? 'Mengunduh PDF...' : 'Simpan PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 md:p-6 overflow-y-auto bg-slate-200/90 flex justify-center">
              <div id="modal-f4-wrapper" className="bg-white shadow-xl w-full max-w-[210mm] min-h-[330mm] overflow-hidden">
                <F4PrintDocument
                  jurnal={draftJurnal}
                  pegawai={currentPegawai}
                  sekolah={sekolah}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
