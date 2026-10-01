import React, { useState } from 'react';
import { Pegawai, JurnalHarian, SekolahConfig, ActiveTab } from './types';
import {
  getSekolahConfig,
  saveSekolahConfig,
  getPegawaiList,
  savePegawaiList,
  upsertPegawai,
  deletePegawai,
  clearAllPegawai,
  saveBulkPegawai,
  getJurnalList,
  addJurnal,
  updateJurnal,
  deleteJurnal,
} from './services/storage';

import { JurnalInputForm } from './components/JurnalInputForm';
import { PegawaiManager } from './components/PegawaiManager';
import { SekolahSettings } from './components/SekolahSettings';
import { RiwayatHarian } from './components/RiwayatHarian';
import { BakotLogo } from './components/BakotLogo';

import {
  FileText,
  Users,
  Building,
  CalendarDays,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('input');
  const [editingJurnal, setEditingJurnal] = useState<JurnalHarian | null>(null);

  // Application Data State
  const [sekolah, setSekolah] = useState<SekolahConfig>(getSekolahConfig);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(getPegawaiList);
  const [jurnals, setJurnals] = useState<JurnalHarian[]>(getJurnalList);

  // Sync state to local storage when modified
  const handleJurnalSaved = (newJurnal: JurnalHarian) => {
    const updated = updateJurnal(newJurnal);
    setJurnals(updated);
    setEditingJurnal(null);
  };

  const handleDeleteJurnal = (id: string) => {
    const updated = deleteJurnal(id);
    setJurnals(updated);
    if (editingJurnal?.id === id) {
      setEditingJurnal(null);
    }
  };

  const handleEditJurnalFromRiwayat = (jurnal: JurnalHarian) => {
    setEditingJurnal(jurnal);
    setActiveTab('input');
  };

  const handleSavePegawai = (pegawai: Pegawai) => {
    const updated = upsertPegawai(pegawai);
    setPegawaiList(updated);
  };

  const handleDeletePegawai = (id: string) => {
    const updated = deletePegawai(id);
    setPegawaiList(updated);
  };

  const handleBulkSavePegawai = (newPegawais: Pegawai[]) => {
    const updated = saveBulkPegawai(newPegawais);
    setPegawaiList(updated);
  };

  const handleClearAllPegawai = () => {
    const updated = clearAllPegawai();
    setPegawaiList(updated);
  };

  const handleSaveSekolah = (config: SekolahConfig) => {
    saveSekolahConfig(config);
    setSekolah(config);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* ========================================================= */}
      {/* 1. TOP HEADER BRAND BANNER (Sticky at top, tidak ketarik saat scroll) */}
      {/* ========================================================= */}
      <header className="no-print sticky top-0 z-40 bg-gradient-to-r from-slate-950 via-blue-950 to-blue-900 text-white shadow-md border-b border-blue-800/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex items-center gap-3">
              <BakotLogo className="w-10 h-10 object-contain shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base md:text-lg font-extrabold tracking-tight">
                    JURNAL HARIAN SIKAWAN 2026
                  </h1>
                  <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    NPSN: {sekolah.npsn || '20219135'}
                  </span>
                </div>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  {sekolah.namaSekolah || 'SD NEGERI BABELAN KOTA 01'} · KABUPATEN BEKASI · TAHUN {sekolah.tahunJurnal || 2026}
                </p>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="flex items-center gap-2 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-200 font-medium">
                  Sistem Aktif · Siap Cetak F4
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Bar Tabs */}
          <nav className="mt-2.5 pt-2 border-t border-blue-800/60 flex items-center gap-1 overflow-x-auto text-xs font-semibold no-scrollbar">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'input'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Input Jurnal</span>
            </button>

            <button
              onClick={() => setActiveTab('pegawai')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'pegawai'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Pegawai</span>
            </button>

            <button
              onClick={() => setActiveTab('sekolah')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'sekolah'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Profil Sekolah</span>
            </button>

            <button
              onClick={() => setActiveTab('riwayat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'riwayat'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-100 hover:bg-blue-800/40 hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Riwayat Harian</span>
            </button>
          </nav>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. MAIN VIEWPORT */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'input' && (
          <JurnalInputForm
            pegawaiList={pegawaiList}
            sekolah={sekolah}
            onJurnalSaved={handleJurnalSaved}
            editingJurnal={editingJurnal}
            onCancelEdit={() => setEditingJurnal(null)}
          />
        )}

        {activeTab === 'pegawai' && (
          <PegawaiManager
            pegawaiList={pegawaiList}
            sekolah={sekolah}
            onSavePegawai={handleSavePegawai}
            onDeletePegawai={handleDeletePegawai}
            onBulkSavePegawai={handleBulkSavePegawai}
            onClearAllPegawai={handleClearAllPegawai}
          />
        )}

        {activeTab === 'sekolah' && (
          <SekolahSettings
            sekolah={sekolah}
            onSaveSekolah={handleSaveSekolah}
          />
        )}

        {activeTab === 'riwayat' && (
          <RiwayatHarian
            jurnals={jurnals}
            pegawaiList={pegawaiList}
            sekolah={sekolah}
            onEditJurnal={handleEditJurnalFromRiwayat}
            onDeleteJurnal={handleDeleteJurnal}
            onAddNewJurnal={() => {
              setEditingJurnal(null);
              setActiveTab('input');
            }}
          />
        )}
      </main>

      {/* ========================================================= */}
      {/* 3. FOOTER */}
      {/* ========================================================= */}
      <footer className="no-print bg-white border-t border-slate-200 mt-auto py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {sekolah.tahunJurnal || 2026} {sekolah.namaSekolah || 'SD NEGERI BABELAN KOTA 01'} · Aplikasi dibuat oleh SAMSUDIN
          </p>
        </div>
      </footer>
    </div>
  );
}
