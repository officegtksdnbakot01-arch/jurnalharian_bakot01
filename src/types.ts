export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  golongan: string;
  status: 'PNS' | 'PPPK' | 'PPPK PW' | 'Honorer' | 'Tenaga Kependidikan';
  fotoUrl?: string;
  ttdUrl?: string;
  unitKerja: string;
  noTelepon?: string;
  email?: string;
}

export interface KegiatanItem {
  id: string;
  jamMulaiJam: string;
  jamMulaiMenit: string;
  jamSelesaiJam: string;
  jamSelesaiMenit: string;
  uraian: string;
  buktiDukung: string;
  fotoBase64?: string;
  kategori?: string;
}

export interface JurnalHarian {
  id: string;
  pegawaiId: string;
  pegawaiNama: string;
  tanggal: string; // YYYY-MM-DD
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  kategori: string;
  uraianKegiatan: string;
  outputHasil: string;
  volumeOutput: string;
  kendala?: string;
  tindakLanjut?: string;
  fotoDokumentasi?: string;
  kegiatanList?: KegiatanItem[];
  statusVerifikasi: 'Disetujui' | 'Menunggu Verifikasi' | 'Perlu Revisi';
  catatanKepalaSekolah?: string;
  createdAt: string;
}

export interface SekolahConfig {
  namaSekolah: string;
  npsn: string;
  alamat: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  tahunJurnal: number;
  kepalaSekolahNama: string;
  kepalaSekolahNIP: string;
  kepalaSekolahGolongan: string;
  kepalaSekolahTtd?: string;
  kepalaSekolahFoto?: string;
  kopSekolahUrl?: string;
  stempelSekolahUrl?: string;
  gasWebAppUrl?: string;
  lastSync?: string;
}

export type ActiveTab = 'input' | 'pegawai' | 'sekolah' | 'riwayat';
