import { Pegawai, JurnalHarian, SekolahConfig } from '../types';
import { INITIAL_SEKOLAH, INITIAL_PEGAWAI, INITIAL_JURNAL } from '../data/initialData';

const KEYS = {
  SEKOLAH: 'sikawan_sdnbakot01_sekolah_v5',
  PEGAWAI: 'sikawan_sdnbakot01_pegawai_v3',
  JURNAL: 'sikawan_sdnbakot01_jurnal_v3',
};

export const getSekolahConfig = (): SekolahConfig => {
  try {
    const raw = localStorage.getItem(KEYS.SEKOLAH);
    if (!raw) return INITIAL_SEKOLAH;
    return { ...INITIAL_SEKOLAH, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading sekolah config', e);
    return INITIAL_SEKOLAH;
  }
};

export const saveSekolahConfig = (config: SekolahConfig): void => {
  try {
    localStorage.setItem(KEYS.SEKOLAH, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving sekolah config', e);
  }
};

export const getPegawaiList = (): Pegawai[] => {
  try {
    const raw = localStorage.getItem(KEYS.PEGAWAI);
    if (!raw) {
      localStorage.setItem(KEYS.PEGAWAI, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading pegawai list', e);
    return [];
  }
};

export const savePegawaiList = (list: Pegawai[]): void => {
  try {
    localStorage.setItem(KEYS.PEGAWAI, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving pegawai list', e);
  }
};

export const clearAllPegawai = (): Pegawai[] => {
  localStorage.setItem(KEYS.PEGAWAI, JSON.stringify([]));
  return [];
};

export const saveBulkPegawai = (newPegawais: Pegawai[]): Pegawai[] => {
  const current = getPegawaiList();
  const updated = [...current];
  newPegawais.forEach((newP) => {
    const existingIdx = updated.findIndex(
      (p) => (p.nip !== '-' && p.nip === newP.nip) || p.nama.toLowerCase().trim() === newP.nama.toLowerCase().trim()
    );
    if (existingIdx >= 0) {
      updated[existingIdx] = { ...updated[existingIdx], ...newP, id: updated[existingIdx].id };
    } else {
      updated.push(newP);
    }
  });
  savePegawaiList(updated);
  return updated;
};

export const upsertPegawai = (pegawai: Pegawai): Pegawai[] => {
  const current = getPegawaiList();
  const index = current.findIndex((p) => p.id === pegawai.id);
  let updated: Pegawai[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = pegawai;
  } else {
    updated = [pegawai, ...current];
  }
  savePegawaiList(updated);
  return updated;
};

export const deletePegawai = (id: string): Pegawai[] => {
  const current = getPegawaiList();
  const updated = current.filter((p) => p.id !== id);
  savePegawaiList(updated);
  return updated;
};

export const getJurnalList = (): JurnalHarian[] => {
  try {
    const raw = localStorage.getItem(KEYS.JURNAL);
    if (!raw) {
      localStorage.setItem(KEYS.JURNAL, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading jurnal list', e);
    return [];
  }
};

export const saveJurnalList = (list: JurnalHarian[]): void => {
  try {
    localStorage.setItem(KEYS.JURNAL, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving jurnal list', e);
  }
};

export const addJurnal = (jurnal: JurnalHarian): JurnalHarian[] => {
  const current = getJurnalList();
  const updated = [jurnal, ...current];
  saveJurnalList(updated);
  return updated;
};

export const updateJurnal = (jurnal: JurnalHarian): JurnalHarian[] => {
  const current = getJurnalList();
  const index = current.findIndex((j) => j.id === jurnal.id);
  let updated: JurnalHarian[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = jurnal;
  } else {
    updated = [jurnal, ...current];
  }
  saveJurnalList(updated);
  return updated;
};

export const deleteJurnal = (id: string): JurnalHarian[] => {
  const current = getJurnalList();
  const updated = current.filter((j) => j.id !== id);
  saveJurnalList(updated);
  return updated;
};

// Export to CSV helper
export const exportJurnalToCSV = (jurnals: JurnalHarian[]): void => {
  const headers = [
    'No',
    'ID Jurnal',
    'Nama Pegawai',
    'Tanggal',
    'Hari',
    'Waktu Mulai',
    'Waktu Selesai',
    'Kategori Aktivitas',
    'Uraian Kegiatan',
    'Output Hasil',
    'Volume',
    'Kendala',
    'Tindak Lanjut',
    'Status Verifikasi'
  ];

  const escapeCSV = (str: string | undefined) => {
    if (!str) return '""';
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = jurnals.map((j, index) => [
    index + 1,
    escapeCSV(j.id),
    escapeCSV(j.pegawaiNama),
    escapeCSV(j.tanggal),
    escapeCSV(j.hari),
    escapeCSV(j.jamMulai),
    escapeCSV(j.jamSelesai),
    escapeCSV(j.kategori),
    escapeCSV(j.uraianKegiatan),
    escapeCSV(j.outputHasil),
    escapeCSV(j.volumeOutput),
    escapeCSV(j.kendala || '-'),
    escapeCSV(j.tindakLanjut || '-'),
    escapeCSV(j.statusVerifikasi)
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `REKAP_JURNAL_SIKAWAN_SDN_BABELAN_KOTA_01_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
