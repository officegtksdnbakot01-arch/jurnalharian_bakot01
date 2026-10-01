import React, { useState } from 'react';
import { SekolahConfig, Pegawai, JurnalHarian } from '../types';
import { GOOGLE_APPS_SCRIPT_CODE } from '../data/initialData';
import { 
  Cloud, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  FileSpreadsheet, 
  FolderLock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { syncToGoogleAppsScript, fetchFromGoogleAppsScript } from '../services/gasApi';

interface GasIntegrationProps {
  sekolah: SekolahConfig;
  pegawaiList: Pegawai[];
  jurnals: JurnalHarian[];
  onUpdateSekolah: (config: SekolahConfig) => void;
  onSyncReceived: (pegawai: Pegawai[], jurnals: JurnalHarian[]) => void;
}

export const GasIntegration: React.FC<GasIntegrationProps> = ({
  sekolah,
  pegawaiList,
  jurnals,
  onUpdateSekolah,
  onSyncReceived,
}) => {
  const [gasUrl, setGasUrl] = useState<string>(sekolah.gasWebAppUrl || '');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveUrl = () => {
    const updated = {
      ...sekolah,
      gasWebAppUrl: gasUrl.trim(),
    };
    onUpdateSekolah(updated);
    setSyncStatus({
      type: 'success',
      message: 'URL Google Apps Script berhasil disimpan di pengaturan aplikasi!',
    });
  };

  const handleTestConnection = async () => {
    if (!gasUrl.trim()) {
      setSyncStatus({
        type: 'error',
        message: 'Mohon masukkan URL Web App Google Apps Script terlebih dahulu.',
      });
      return;
    }

    setTestingConnection(true);
    setSyncStatus(null);

    try {
      const res = await syncToGoogleAppsScript(gasUrl.trim(), 'initSpreadsheet', {});
      const updated = {
        ...sekolah,
        gasWebAppUrl: gasUrl.trim(),
        lastSync: new Date().toLocaleString('id-ID'),
      };
      onUpdateSekolah(updated);
      setSyncStatus({
        type: 'success',
        message:
          'Koneksi Berhasil! Tab DATA_PEGAWAI, JURNAL_HARIAN, dan Folder Google Drive telah aktif.',
      });
    } catch (err) {
      setSyncStatus({
        type: 'error',
        message:
          'Gagal menghubungi Google Apps Script. Pastikan Web App di-deploy dengan akses "Anyone" (Siapa saja).',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Push all existing local teachers & journals to GAS
  const handlePushAllData = async () => {
    if (!gasUrl.trim()) {
      alert('Masukkan URL Web App GAS terlebih dahulu');
      return;
    }
    setTestingConnection(true);
    setSyncStatus({
      type: 'info',
      message: 'Sedang menyinkronkan seluruh data pegawai & jurnal ke Google Spreadsheet...',
    });

    try {
      // Push pegawai
      for (const p of pegawaiList) {
        await syncToGoogleAppsScript(gasUrl.trim(), 'simpanPegawai', {
          ...p,
          fotoBase64: p.fotoUrl,
          ttdBase64: p.ttdUrl,
        });
      }

      // Push journals
      for (const j of jurnals) {
        await syncToGoogleAppsScript(gasUrl.trim(), 'simpanJurnal', {
          ...j,
          fotoDokumentasiBase64: j.fotoDokumentasi,
        });
      }

      setSyncStatus({
        type: 'success',
        message: `Sinkronisasi Selesai! ${pegawaiList.length} data Pegawai dan ${jurnals.length} data Jurnal Harian tersimpan di Google Spreadsheet & Drive.`,
      });
    } catch (e) {
      setSyncStatus({
        type: 'error',
        message: 'Terjadi kendala saat menyinkronkan data. Periksa izin akses Apps Script.',
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Integrasi Google Sheets & Google Drive (Google Apps Script)
            </h2>
            <p className="text-xs text-slate-500">
              Sinkronisasi otomatis penyimpanan jurnal, data guru, foto dokumentasi, dan tanda tangan ke cloud SDN Babelan Kota 01
            </p>
          </div>
        </div>

        {syncStatus && (
          <div
            className={`mt-4 p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
              syncStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : syncStatus.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {syncStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : syncStatus.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            ) : (
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-blue-600" />
            )}
            <span>{syncStatus.message}</span>
          </div>
        )}
      </div>

      {/* URL Input & Sync Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            URL Web App Google Apps Script (Deployment URL)
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={gasUrl}
              onChange={(e) => setGasUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="flex-1 text-xs px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono-code"
            />
            <button
              onClick={handleSaveUrl}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
            >
              Simpan URL
            </button>
            <button
              onClick={handleTestConnection}
              disabled={testingConnection}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
              <span>Tes & Inisialisasi</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Format: harus berakhiran <code className="bg-slate-100 px-1 py-0.5 rounded-sm">/exec</code> dan set permission ke <strong>"Anyone" (Siapa saja)</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-600">
            {sekolah.lastSync ? (
              <span>Terakhir disinkronkan: <strong className="text-slate-900 font-mono-code">{sekolah.lastSync}</strong></span>
            ) : (
              <span>Aplikasi saat ini beroperasi dengan penyimpanan lokal berkecepatan tinggi.</span>
            )}
          </div>

          <button
            onClick={handlePushAllData}
            disabled={testingConnection}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            <Cloud className="w-3.5 h-3.5" />
            Unggah Seluruh Data Lokal ke Google Spreadsheet
          </button>
        </div>
      </div>

      {/* Panduan 4 Langkah Pemasangan Apps Script */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Panduan Praktis Integrasi Google Apps Script (Kode.gs)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] mb-2">
              1
            </span>
            <p className="font-semibold text-slate-900 mb-1">Buat Spreadsheet Baru</p>
            <p className="text-slate-600 text-[11px]">
              Buka Google Sheets di akun Google SDN Babelan Kota 01, beri nama dokumen: <code>JURNAL SIKAWAN 2026</code>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] mb-2">
              2
            </span>
            <p className="font-semibold text-slate-900 mb-1">Buka Editor Apps Script</p>
            <p className="text-slate-600 text-[11px]">
              Klik menu <strong>Ekstensi &gt; Apps Script</strong>. Hapus isi bawaan di berkas <code>Kode.gs</code>.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] mb-2">
              3
            </span>
            <p className="font-semibold text-slate-900 mb-1">Salin Kode.gs di Bawah</p>
            <p className="text-slate-600 text-[11px]">
              Klik tombol 'Salin Seluruh Kode.gs' lalu tempelkan (paste) ke editor Apps Script dan klik Simpan.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-5 h-5 rounded-full bg-blue-700 text-white font-bold flex items-center justify-center text-[10px] mb-2">
              4
            </span>
            <p className="font-semibold text-slate-900 mb-1">Terapkan Sebagai Web App</p>
            <p className="text-slate-600 text-[11px]">
              Pilih <strong>Deploy &gt; New deployment &gt; Web app</strong>. Pilih Akses: <em>Anyone (Siapa saja)</em>. Salin URL-nya ke kolom di atas.
            </p>
          </div>
        </div>

        {/* Source Code Viewer Box */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">
              Berkas Backend: Kode.gs (Google Apps Script)
            </span>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md text-xs font-semibold transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Kode Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Seluruh Kode.gs</span>
                </>
              )}
            </button>
          </div>

          <div className="relative bg-slate-950 text-slate-200 rounded-lg p-4 font-mono-code text-[11px] max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
            <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
