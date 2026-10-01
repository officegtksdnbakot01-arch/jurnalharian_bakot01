import React, { useState, useRef } from 'react';
import { SekolahConfig } from '../types';
import { SignaturePadModal } from './SignaturePadModal';
import { OfficialStamp } from './OfficialStamp';
import { OfficialKop } from './OfficialKop';
import { 
  UserCheck, 
  Save, 
  PenTool, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  ImageIcon, 
  Stamp, 
  FileText,
  Download,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { syncToGoogleAppsScript } from '../services/gasApi';
import { 
  downloadSekolahTemplate, 
  exportSekolahToExcel, 
  importSekolahFromExcel 
} from '../services/excelService';

interface SekolahSettingsProps {
  sekolah: SekolahConfig;
  onSaveSekolah: (config: SekolahConfig) => void;
}

export const SekolahSettings: React.FC<SekolahSettingsProps> = ({
  sekolah,
  onSaveSekolah,
}) => {
  const [formData, setFormData] = useState<SekolahConfig>({ ...sekolah });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sigModalOpen, setSigModalOpen] = useState(false);

  // Excel Actions State
  const importFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSekolah(formData);

    // Sync to GAS if URL configured
    if (formData.gasWebAppUrl) {
      await syncToGoogleAppsScript(formData.gasWebAppUrl, 'simpanSekolah', {
        ...formData,
        fotoKepsekBase64: formData.kepalaSekolahFoto,
        ttdKepsekBase64: formData.kepalaSekolahTtd,
        stempelBase64: formData.stempelSekolahUrl,
        kopBase64: formData.kopSekolahUrl,
      });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDownloadSekolahTemplate = async () => {
    try {
      await downloadSekolahTemplate();
      setFeedback('Template Format Profil Sekolah (Excel) berhasil diunduh!');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error('Gagal unduh template profil sekolah:', err);
      alert('Gagal mengunduh template Excel Profil Sekolah.');
    }
  };

  const handleExportSekolah = async () => {
    try {
      setIsExporting(true);
      await exportSekolahToExcel(formData);
      setFeedback('Profil Sekolah beserta berkas resmi (TTD, Kop, Stempel Base64) berhasil diekspor ke Excel!');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err) {
      console.error('Gagal ekspor profil sekolah:', err);
      alert('Gagal mengekspor profil sekolah ke Excel.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportSekolahFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const updated = await importSekolahFromExcel(file, formData);
      setFormData(updated);
      onSaveSekolah(updated);

      if (updated.gasWebAppUrl) {
        syncToGoogleAppsScript(updated.gasWebAppUrl, 'simpanSekolah', {
          ...updated,
          fotoKepsekBase64: updated.kepalaSekolahFoto,
          ttdKepsekBase64: updated.kepalaSekolahTtd,
          stempelBase64: updated.stempelSekolahUrl,
          kopBase64: updated.kopSekolahUrl,
        }).catch((err) => console.warn('GAS sync warning:', err));
      }

      setFeedback('Profil Sekolah berhasil diimpor dari Excel dan tersimpan secara permanen!');
      setTimeout(() => setFeedback(null), 5000);
    } catch (err: any) {
      console.error('Gagal impor profil sekolah:', err);
      alert(`Gagal mengimpor Profil Sekolah: ${err?.message || 'Format file Excel tidak sesuai.'}`);
    } finally {
      setIsImporting(false);
      if (importFileInputRef.current) {
        importFileInputRef.current.value = '';
      }
    }
  };

  const handleSaveKepsekSignature = (dataUrl: string) => {
    const updated = {
      ...formData,
      kepalaSekolahTtd: dataUrl,
    };
    setFormData(updated);
    onSaveSekolah(updated);
  };

  const handleUploadFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'kepalaSekolahTtd' | 'stempelSekolahUrl' | 'kopSekolahUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Ukuran file maksimal 4 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;

      if (field === 'kepalaSekolahTtd') {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            try {
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const data = imgData.data;
              for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                if (r > 215 && g > 215 && b > 215) {
                  data[i + 3] = 0;
                }
              }
              ctx.putImageData(imgData, 0, 0);
              const transparentPng = canvas.toDataURL('image/png');
              setFormData((prev) => ({
                ...prev,
                [field]: transparentPng,
              }));
              return;
            } catch {
              // fallback below
            }
          }
          setFormData((prev) => ({
            ...prev,
            [field]: dataUrl,
          }));
        };
        img.src = dataUrl;
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hidden file input for Excel import */}
      <input
        type="file"
        ref={importFileInputRef}
        onChange={handleImportSekolahFile}
        accept=".xlsx, .xls"
        className="hidden"
      />

      {/* Feedback Toast / Notifikasi Impor & Simpan */}
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

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Pengaturan Berhasil Disimpan!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card: Data Kepala Sekolah (Pejabat Penilai) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5 text-xs">
          {/* Header Card Sejajar dengan Tombol Unduh Format, Impor, Ekspor */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <UserCheck className="w-5 h-5 text-blue-700 shrink-0" />
              <span>Pejabat Penilai</span>
            </div>

            {/* Tombol Aksi Profil Sekolah: Unduh Format, Impor, Ekspor */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={handleDownloadSekolahTemplate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-950 active:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title="Unduh format template Profil Sekolah (Excel)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Format</span>
              </button>

              <button
                type="button"
                disabled={isImporting}
                onClick={() => importFileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Impor profil sekolah dari Excel (.xlsx)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isImporting ? 'Mengimpor...' : 'Impor'}</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={handleExportSekolah}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                title="Ekspor profil sekolah & berkas base64 ke Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Mengekspor...' : 'Ekspor'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Nama Kepala Sekolah */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.kepalaSekolahNama}
                onChange={(e) =>
                  setFormData({ ...formData, kepalaSekolahNama: e.target.value })
                }
                placeholder="Contoh: LAILATUL FAJRIAH, S.Pd.SD"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-semibold text-xs"
                required
              />
            </div>

            {/* 2. NIP Kepala Sekolah */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 text-xs">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={formData.kepalaSekolahNIP}
                onChange={(e) =>
                  setFormData({ ...formData, kepalaSekolahNIP: e.target.value })
                }
                placeholder="Contoh: 197808202008012005"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono-code text-xs"
                required
              />
            </div>
          </div>

          {/* 3. Upload Tanda Tangan Kepala Sekolah */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="font-semibold text-slate-800 text-xs">
                Upload Tanda Tangan Kepala Sekolah
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSigModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-blue-700 bg-white border border-slate-300 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Tulis / Goreskan TTD</span>
                </button>
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Unggah Berkas Gambar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadFile(e, 'kepalaSekolahTtd')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="h-28 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center relative overflow-hidden">
              {formData.kepalaSekolahTtd ? (
                <div className="relative group flex items-center justify-center w-full h-full p-2">
                  <img
                    src={formData.kepalaSekolahTtd}
                    alt="TTD Kepala Sekolah"
                    className="max-h-24 max-w-[200px] object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, kepalaSekolahTtd: '' })}
                    className="absolute top-2 right-2 p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md transition-colors"
                    title="Hapus Tanda Tangan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-slate-400 italic text-xs">
                  Belum ada tanda tangan. Klik 'Tulis TTD' atau 'Unggah Berkas Gambar'.
                </span>
              )}
            </div>
          </div>

          {/* 4. Upload Stempel Sekolah */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-semibold text-slate-800 text-xs block">
                  Upload Stempel Sekolah
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File Stempel</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadFile(e, 'stempelSekolahUrl')}
                    className="hidden"
                  />
                </label>
                {formData.stempelSekolahUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, stempelSekolahUrl: '' })}
                    className="p-1.5 bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Gunakan stempel standar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="h-28 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center p-2">
              {formData.stempelSekolahUrl ? (
                <img
                  src={formData.stempelSekolahUrl}
                  alt="Stempel Sekolah Kustom"
                  className="max-h-24 max-w-[140px] object-contain"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <OfficialStamp size={70} />
                  <span className="text-slate-400 text-xs">
                    (Menggunakan stempel dinas SDN Babelan Kota 01 bawaan sistem)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 5. Upload Kop Sekolah */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="font-semibold text-slate-800 text-xs block">
                  Upload Kop Sekolah
                </label>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Pilih File Kop</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUploadFile(e, 'kopSekolahUrl')}
                    className="hidden"
                  />
                </label>
                {formData.kopSekolahUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, kopSekolahUrl: '' })}
                    className="p-1.5 bg-white border border-slate-300 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Gunakan kop surat standar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-white border border-dashed border-slate-300 rounded-lg flex items-center justify-center min-h-28">
              {formData.kopSekolahUrl ? (
                <div className="w-full flex items-center justify-center">
                  <img
                    src={formData.kopSekolahUrl}
                    alt="Kop Surat Kustom"
                    className="max-h-24 max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full">
                  <OfficialKop sekolah={formData} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Simpan Perubahan */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs md:text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>

      {/* Signature Modal Kepsek */}
      {sigModalOpen && (
        <SignaturePadModal
          isOpen={sigModalOpen}
          onClose={() => setSigModalOpen(false)}
          onSave={handleSaveKepsekSignature}
          title="Tanda Tangan Digital Kepala Sekolah"
          initialSignature={formData.kepalaSekolahTtd}
        />
      )}
    </div>
  );
};
