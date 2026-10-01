import React, { useState, useRef } from 'react';
import { Pegawai, SekolahConfig } from '../types';
import { SignaturePadModal } from './SignaturePadModal';
import { 
  UserPlus, 
  Table2, 
  Save, 
  Pencil, 
  Trash2, 
  PenTool, 
  RotateCcw,
  CheckCircle2,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  FileText,
  X
} from 'lucide-react';
import { syncToGoogleAppsScript } from '../services/gasApi';
import { 
  downloadPegawaiTemplate, 
  exportPegawaiToExcel, 
  importPegawaiFromExcel 
} from '../services/excelService';

interface PegawaiManagerProps {
  pegawaiList: Pegawai[];
  sekolah: SekolahConfig;
  onSavePegawai: (pegawai: Pegawai) => void;
  onDeletePegawai: (id: string) => void;
  onBulkSavePegawai?: (newPegawais: Pegawai[]) => void;
  onClearAllPegawai?: () => void;
}

export const PegawaiManager: React.FC<PegawaiManagerProps> = ({
  pegawaiList,
  sekolah,
  onSavePegawai,
  onDeletePegawai,
  onBulkSavePegawai,
  onClearAllPegawai,
}) => {
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('Guru Kelas / Pendidik');
  const [golongan, setGolongan] = useState('');
  const [status, setStatus] = useState<'PNS' | 'PPPK' | 'PPPK PW' | 'Honorer' | 'Tenaga Kependidikan'>('PNS');
  const [fotoUrl, setFotoUrl] = useState<string | undefined>(undefined);
  const [ttdUrl, setTtdUrl] = useState<string | undefined>(undefined);
  const [fotoFileName, setFotoFileName] = useState<string>('');
  const [ttdFileName, setTtdFileName] = useState<string>('');

  // Signature Modal
  const [sigModalOpen, setSigModalOpen] = useState(false);

  // Excel Actions State
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setNip('');
    setNama('');
    setJabatan('Guru Kelas / Pendidik');
    setGolongan('');
    setStatus('PNS');
    setFotoUrl(undefined);
    setTtdUrl(undefined);
    setFotoFileName('');
    setTtdFileName('');
  };

  const handleStartEdit = (p: Pegawai) => {
    setEditingId(p.id);
    setNip(p.nip && p.nip !== '-' ? p.nip : '');
    setNama(p.nama);
    setJabatan(p.jabatan || 'Guru Kelas / Pendidik');
    setGolongan(p.golongan || '');
    setStatus(p.status || 'PNS');
    setFotoUrl(p.fotoUrl);
    setTtdUrl(p.ttdUrl);
    setFotoFileName(p.fotoUrl ? 'Foto tersimpan' : '');
    setTtdFileName(p.ttdUrl ? 'Tanda tangan tersimpan' : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setFotoUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleTtdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTtdFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setTtdUrl(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      alert('Mohon isi Nama Lengkap Pegawai.');
      return;
    }

    const pegawaiData: Pegawai = {
      id: editingId || `peg-${Date.now()}`,
      nip: nip.trim() || '-',
      nama: nama.trim(),
      jabatan: jabatan.trim() || 'Guru Kelas',
      golongan: golongan.trim() || '-',
      status: status,
      fotoUrl: fotoUrl,
      ttdUrl: ttdUrl,
      unitKerja: sekolah.namaSekolah || 'SD Negeri Babelan Kota 01',
    };

    onSavePegawai(pegawaiData);

    // Sync to Google Apps Script if configured
    if (sekolah.gasWebAppUrl) {
      syncToGoogleAppsScript(sekolah.gasWebAppUrl, 'simpanPegawai', {
        ...pegawaiData,
        fotoBase64: fotoUrl,
        ttdBase64: ttdUrl,
      }).catch((err) => console.warn('GAS sync warning:', err));
    }

    setFeedback(editingId ? `Data ${pegawaiData.nama} berhasil diperbarui!` : `Pegawai ${pegawaiData.nama} berhasil disimpan!`);
    setTimeout(() => setFeedback(null), 3500);

    resetForm();
  };

  const handleDelete = (p: Pegawai) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data pegawai "${p.nama}"?`)) {
      onDeletePegawai(p.id);
      if (editingId === p.id) {
        resetForm();
      }
    }
  };

  // 1. UNDUH TEMPLATE EXCEL
  const handleDownloadTemplate = async () => {
    try {
      await downloadPegawaiTemplate();
      setFeedback('Template Format Data Pegawai (Excel) berhasil diunduh!');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error('Gagal download template:', err);
      alert('Gagal membuat template Excel.');
    }
  };

  // 2. EKSPOR DATA KE EXCEL
  const handleExportExcel = async () => {
    if (pegawaiList.length === 0) {
      alert('Belum ada data pegawai untuk diekspor. Silakan tambahkan pegawai terlebih dahulu atau gunakan Unduh Format untuk mengisi data.');
      return;
    }
    try {
      setIsExporting(true);
      await exportPegawaiToExcel(pegawaiList);
      setFeedback(`Berhasil mengekspor ${pegawaiList.length} data pegawai ke file Excel!`);
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error('Gagal ekspor Excel:', err);
      alert('Gagal mengekspor data pegawai ke Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  // 3. IMPOR DARI FILE EXCEL
  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const imported = await importPegawaiFromExcel(file, sekolah.namaSekolah);
      if (imported.length === 0) {
        alert('File Excel tidak memuat data pegawai yang valid. Pastikan mengisi baris data mulai dari baris 2 di bawah judul kolom.');
        return;
      }

      if (onBulkSavePegawai) {
        onBulkSavePegawai(imported);
      } else {
        imported.forEach((p) => onSavePegawai(p));
      }

      // Sinkronisasi ke Google Apps Script jika URL terkonfigurasi
      const gasUrl = sekolah.gasWebAppUrl;
      if (gasUrl) {
        imported.forEach((p) => {
          syncToGoogleAppsScript(gasUrl, 'simpanPegawai', {
            ...p,
            fotoBase64: p.fotoUrl,
            ttdBase64: p.ttdUrl,
          }).catch((err) => console.warn('GAS bulk sync warning:', err));
        });
      }

      setFeedback(
        `Berhasil mengimpor ${imported.length} data pegawai! Data tersimpan secara permanen di database sekolah dan otomatis tersinkronisasi, sehingga Anda tidak perlu mengulang input kembali di perangkat maupun pengguna lain.`
      );
      setTimeout(() => setFeedback(null), 8000);
    } catch (err: any) {
      console.error('Gagal impor Excel:', err);
      alert(`Gagal mengimpor file Excel: ${err?.message || 'Format file tidak sesuai.'}`);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 4. KOSONGKAN SELURUH DATA PEGAWAI
  const handleClearAll = () => {
    if (pegawaiList.length === 0) {
      alert('Daftar data pegawai sudah kosong.');
      return;
    }

    if (confirm('Apakah Anda yakin ingin MENGHAPUS SELURUH data pegawai bawaan/terdaftar? Anda dapat mengimpor data baru kembali dari Excel kapan saja.')) {
      if (onClearAllPegawai) {
        onClearAllPegawai();
      }
      resetForm();
      setFeedback('Seluruh data pegawai berhasil dihapus/dikosongkan.');
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hidden file input for Excel import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />

      {/* Feedback Toast / Notifikasi Penyimpanan Permanen */}
      {feedback && (
        <div className="p-3.5 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-emerald-950 text-xs sm:text-sm font-semibold flex items-start justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900 mb-0.5">Tersimpan Permanen</p>
              <p className="font-normal text-emerald-800 leading-relaxed">{feedback}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 p-1 rounded-md hover:bg-emerald-100 cursor-pointer transition-colors"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. KARTU FORM TAMBAH / EDIT PEGAWAI BARU                 */}
      {/* Sesuai dengan desain DATA PEGAWAI-1.png                   */}
      {/* ========================================================= */}
      <div className="bg-white border border-blue-200 rounded-xl p-5 sm:p-6 shadow-xs">
        {/* Header Form */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5 text-blue-950 font-bold text-base sm:text-lg">
            <UserPlus className="w-5 h-5 text-blue-900 shrink-0" />
            <span>{editingId ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}</span>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Batal Edit / Tambah Baru
            </button>
          )}
        </div>

        <form onSubmit={handleSaveForm} className="space-y-4">
          {/* Baris 1: NIP, Nama Lengkap & Gelar, Jabatan (3 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                NIP / NI PPPK
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Nomor Induk Pegawai"
                className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Nama Lengkap & Gelar <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Jabatan
              </label>
              <input
                type="text"
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Guru Kelas / Pendidik"
                className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Baris 2: Pangkat / Golongan, Status Pegawai, Foto (3x4) (3 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Pangkat / Golongan
              </label>
              <input
                type="text"
                value={golongan}
                onChange={(e) => setGolongan(e.target.value)}
                placeholder="Contoh: Penata / III.c"
                className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Status Pegawai
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-blue-200 rounded-lg text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all"
              >
                <option value="PNS">PNS / ASN</option>
                <option value="PPPK">PPPK</option>
                <option value="PPPK PW">PPPK PW</option>
                <option value="Honorer">Honorer</option>
                <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">
                Foto (3×4)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="w-full text-xs text-slate-700 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer transition-all"
                />
                {fotoUrl && (
                  <div className="w-8 h-8 rounded-sm overflow-hidden border border-slate-300 shrink-0 bg-slate-100">
                    <img src={fotoUrl} alt="Preview Foto" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              {fotoFileName && (
                <p className="text-[10px] text-blue-700 mt-1 truncate">{fotoFileName}</p>
              )}
            </div>
          </div>

          {/* Baris 3: Ttd Pegawai */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-800">
                Ttd Pegawai
              </label>
              <button
                type="button"
                onClick={() => setSigModalOpen(true)}
                className="text-blue-700 hover:text-blue-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <PenTool className="w-3 h-3" />
                Atau Tulis TTD di Layar
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleTtdFileChange}
                className="w-full max-w-md text-xs text-slate-700 file:mr-2.5 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer transition-all"
              />
              {ttdUrl && (
                <div className="h-8 px-2 border border-slate-300 rounded-sm bg-slate-50 flex items-center shrink-0">
                  <img src={ttdUrl} alt="Preview TTD" className="h-6 max-w-[80px] object-contain mix-blend-multiply" />
                </div>
              )}
            </div>
            {ttdFileName && (
              <p className="text-[10px] text-blue-700 mt-1 truncate">{ttdFileName}</p>
            )}
          </div>

          {/* Baris 4: Tombol Simpan Data Pegawai */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center gap-2 text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data Pegawai</span>
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ========================================================= */}
      {/* 2. TABEL PEGAWAI TERDAFTAR DENGAN ACTION EXCEL             */}
      {/* Ada tombol: Unduh (Template), Impor (Excel), Ekspor (Excel) */}
      {/* ========================================================= */}
      <div className="space-y-3">
        {/* Baris Atas Tabel: Judul & Tombol Ekspor, Impor, Unduh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs">
          <div className="flex items-center gap-2 text-blue-950 font-bold text-base sm:text-lg">
            <Table2 className="w-5 h-5 text-blue-900 shrink-0" />
            <span>Pegawai Terdaftar</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {pegawaiList.length} Pegawai
            </span>
          </div>

          {/* Tombol Aksi: Unduh Format, Impor, Ekspor */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Tombol Unduh Format Template Excel */}
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-900 hover:bg-blue-950 active:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Unduh template Excel berformat tabel/border dan warna resmi (#1e3a8a)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Format</span>
            </button>

            {/* Tombol Impor Data Pegawai dari Excel */}
            <button
              type="button"
              disabled={isImporting}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Impor data pegawai dari file Excel (.xlsx) sesuai format resmi"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isImporting ? 'Mengimpor...' : 'Impor'}</span>
            </button>

            {/* Tombol Ekspor Seluruh Data Pegawai ke Excel */}
            <button
              type="button"
              disabled={isExporting || pegawaiList.length === 0}
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Ekspor seluruh data pegawai ke Excel dengan border dan warna resmi aplikasi"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Mengekspor...' : 'Ekspor'}</span>
            </button>

            {/* Tombol Hapus Seluruh Data (Opsional jika ingin reset bersih) */}
            {pegawaiList.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-1 px-2.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                title="Hapus seluruh data pegawai"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Hapus Semua</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabel Pegawai */}
        <div className="w-full overflow-x-auto rounded-lg border border-slate-900 shadow-xs bg-white">
          <table className="w-full border-collapse border border-slate-900 text-xs sm:text-sm text-left">
            <thead>
              <tr className="bg-[#1e3a8a] text-white font-bold leading-tight">
                <th className="border border-slate-900 px-3 py-2.5 text-center w-12">No</th>
                <th className="border border-slate-900 px-3 py-2.5">NIP</th>
                <th className="border border-slate-900 px-3 py-2.5">Nama Pegawai</th>
                <th className="border border-slate-900 px-3 py-2.5">Jabatan</th>
                <th className="border border-slate-900 px-3 py-2.5">Pangkat/Gol</th>
                <th className="border border-slate-900 px-3 py-2.5 text-center">Status</th>
                <th className="border border-slate-900 px-3 py-2.5 text-center w-32">Edit</th>
              </tr>
            </thead>
            <tbody>
              {pegawaiList.length > 0 ? (
                pegawaiList.map((p, index) => {
                  const isCurrentEditing = editingId === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-blue-50/60 transition-colors ${
                        isCurrentEditing ? 'bg-amber-50/80 font-medium' : index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      <td className="border border-slate-900 px-3 py-2 text-center font-medium">
                        {index + 1}
                      </td>
                      <td className="border border-slate-900 px-3 py-2 font-mono font-bold text-slate-950 whitespace-nowrap">
                        {p.nip && p.nip !== '-' ? p.nip : '-'}
                      </td>
                      <td className="border border-slate-900 px-3 py-2 font-medium text-slate-950">
                        {p.nama}
                      </td>
                      <td className="border border-slate-900 px-3 py-2 text-slate-800">
                        {p.jabatan || 'Guru Kelas'}
                      </td>
                      <td className="border border-slate-900 px-3 py-2 text-slate-800">
                        {p.golongan || '-'}
                      </td>
                      <td className="border border-slate-900 px-3 py-2 text-center font-medium text-slate-900 whitespace-nowrap">
                        {p.status || 'PNS'}
                      </td>
                      <td className="border border-slate-900 px-2 py-2 text-center align-middle whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition-colors"
                            title="Edit data pegawai ini"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p)}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                            title="Hapus data pegawai"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="border border-slate-900 px-4 py-12 text-center bg-slate-50/50">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-900 mx-auto flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-slate-800 text-sm">
                        Belum Ada Pegawai Terdaftar
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Silakan input pegawai baru melalui form di atas atau gunakan tombol <strong>Unduh Format</strong> & <strong>Impor</strong> dari file Excel.
                      </p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleDownloadTemplate}
                          className="px-3.5 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Unduh Format Excel
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Impor dari Excel
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Gambar Tanda Tangan di Layar jika diinginkan */}
      {sigModalOpen && (
        <SignaturePadModal
          isOpen={sigModalOpen}
          onClose={() => setSigModalOpen(false)}
          onSave={(dataUrl) => {
            setTtdUrl(dataUrl);
            setTtdFileName('Tanda Tangan Digambar di Layar');
            setSigModalOpen(false);
          }}
          title={nama ? `Tanda Tangan: ${nama}` : 'Tanda Tangan Pegawai'}
          initialSignature={ttdUrl}
        />
      )}
    </div>
  );
};
