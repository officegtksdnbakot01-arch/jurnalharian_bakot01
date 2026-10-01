import React, { useState } from 'react';
import { JurnalHarian, Pegawai, SekolahConfig } from '../types';
import { F4PrintDocument } from './F4PrintDocument';
import { 
  CalendarDays, 
  Pencil, 
  Trash2, 
  FileText, 
  Search, 
  Filter, 
  Clock, 
  User, 
  CheckCircle2, 
  Printer, 
  PlusCircle,
  Layers
} from 'lucide-react';

interface RiwayatHarianProps {
  jurnals: JurnalHarian[];
  pegawaiList: Pegawai[];
  sekolah: SekolahConfig;
  onEditJurnal: (jurnal: JurnalHarian) => void;
  onDeleteJurnal: (id: string) => void;
  onAddNewJurnal: () => void;
}

export const RiwayatHarian: React.FC<RiwayatHarianProps> = ({
  jurnals,
  pegawaiList,
  sekolah,
  onEditJurnal,
  onDeleteJurnal,
  onAddNewJurnal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [previewJurnal, setPreviewJurnal] = useState<JurnalHarian | null>(null);

  // Helper untuk mendapatkan data pegawai dari jurnal
  const getPegawaiInfo = (jurnal: JurnalHarian) => {
    const found = pegawaiList.find((p) => p.id === jurnal.pegawaiId);
    return {
      nama: jurnal.pegawaiNama || found?.nama || '-',
      nip: (found?.nip && found.nip !== '-') ? found.nip : '-',
      status: found?.status || 'PNS',
      pegawai: found,
    };
  };

  // Helper format tanggal Indonesia
  const formatTanggalIndo = (tanggalStr: string) => {
    if (!tanggalStr) return '-';
    try {
      const parts = tanggalStr.split('-');
      if (parts.length !== 3) return tanggalStr;
      const d = parseInt(parts[2], 10);
      const m = parseInt(parts[1], 10);
      const y = parts[0];
      const bulan = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      return `${d} ${bulan[m - 1] || ''} ${y}`;
    } catch {
      return tanggalStr;
    }
  };

  // Filter Data
  const filteredJurnals = jurnals.filter((j) => {
    const info = getPegawaiInfo(j);
    const matchesSearch = 
      info.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.hari.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.tanggal.includes(searchTerm);

    const matchesStatus = filterStatus === 'ALL' || info.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Header Toolbar Riwayat Harian */}
      <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-blue-950 font-bold text-base sm:text-lg">
            <CalendarDays className="w-5 h-5 text-blue-900 shrink-0" />
            <span>Riwayat Jurnal Harian Pegawai</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {jurnals.length} Entri
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Daftar pengisian jurnal harian setiap pegawai yang tersimpan secara teratur dan siap dicetak/diedit.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNewJurnal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-950 active:bg-blue-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Isi Jurnal Baru</span>
        </button>
      </div>

      {/* 2. Filter & Pencarian */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari Nama Pegawai / NIP / Hari..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-all text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-600 font-medium shrink-0">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-xs w-full sm:w-auto cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="PNS">PNS / ASN</option>
            <option value="PPPK">PPPK</option>
            <option value="PPPK PW">PPPK PW</option>
            <option value="Honorer">Honorer</option>
            <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
          </select>
        </div>
      </div>

      {/* 3. Tabel Riwayat Harian (Batas Tampilan 1-10 Baris dengan Scroll Vertikal) */}
      <div className="bg-white border border-slate-900 rounded-xl overflow-hidden shadow-xs">
        {/* Kontainer Scroll: Ditentukan max-height agar 10 baris pertama tampil penuh, sisanya dibuat scroll */}
        <div className="w-full overflow-x-auto max-h-[520px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
          <table className="w-full border-collapse text-xs text-left relative">
            {/* Header Sticky agar tetap terlihat saat scroll melebihi 10 baris */}
            <thead className="sticky top-0 z-10 shadow-xs">
              <tr className="bg-[#1e3a8a] text-white font-bold leading-tight border-b border-slate-900">
                <th className="border border-slate-900 px-3 py-2.5 text-center w-12 bg-[#1e3a8a]">No</th>
                <th className="border border-slate-900 px-3 py-2.5 bg-[#1e3a8a] min-w-[170px]">Hari/Tanggal Input Jurnal</th>
                <th className="border border-slate-900 px-3 py-2.5 bg-[#1e3a8a] min-w-[190px]">Nama Pegawai</th>
                <th className="border border-slate-900 px-3 py-2.5 bg-[#1e3a8a] min-w-[150px]">NIP</th>
                <th className="border border-slate-900 px-3 py-2.5 text-center bg-[#1e3a8a] w-28">Status</th>
                <th className="border border-slate-900 px-3 py-2.5 text-center bg-[#1e3a8a] w-32">Jumlah Kegiatan</th>
                <th className="border border-slate-900 px-3 py-2.5 text-center bg-[#1e3a8a] min-w-[160px]">Edit Jurnal</th>
              </tr>
            </thead>
            <tbody>
              {filteredJurnals.length > 0 ? (
                filteredJurnals.map((jurnal, index) => {
                  const info = getPegawaiInfo(jurnal);
                  const jumlahKegiatan = jurnal.kegiatanList && jurnal.kegiatanList.length > 0
                    ? jurnal.kegiatanList.length
                    : 1;

                  return (
                    <tr
                      key={jurnal.id}
                      className={`hover:bg-blue-50/70 transition-colors ${
                        index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                      }`}
                    >
                      {/* 1. No */}
                      <td className="border border-slate-900 px-3 py-2.5 text-center font-medium text-slate-800">
                        {index + 1}
                      </td>

                      {/* 2. Hari/Tanggal Input Jurnal */}
                      <td className="border border-slate-900 px-3 py-2.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-950">
                          {jurnal.hari}, {formatTanggalIndo(jurnal.tanggal)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{jurnal.jamMulai} - {jurnal.jamSelesai} WIB</span>
                        </div>
                      </td>

                      {/* 3. Nama Pegawai */}
                      <td className="border border-slate-900 px-3 py-2.5 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {info.nama.slice(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[200px]" title={info.nama}>
                            {info.nama}
                          </span>
                        </div>
                      </td>

                      {/* 4. NIP */}
                      <td className="border border-slate-900 px-3 py-2.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {info.nip}
                      </td>

                      {/* 5. Status */}
                      <td className="border border-slate-900 px-3 py-2.5 text-center whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                          info.status === 'PNS' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : info.status.includes('PPPK')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {info.status}
                        </span>
                      </td>

                      {/* 6. Jumlah Kegiatan */}
                      <td className="border border-slate-900 px-3 py-2.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 font-semibold text-[11px]">
                          <Layers className="w-3 h-3 text-indigo-600" />
                          <span>{jumlahKegiatan} Kegiatan</span>
                        </span>
                      </td>

                      {/* 7. Edit Jurnal (Aksi: Edit, Cetak F4, Hapus) */}
                      <td className="border border-slate-900 px-3 py-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol Edit Jurnal */}
                          <button
                            type="button"
                            onClick={() => onEditJurnal(jurnal)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                            title="Edit data isian jurnal ini"
                          >
                            <Pencil className="w-3 h-3" />
                            <span>Edit Jurnal</span>
                          </button>

                          {/* Tombol Lihat / Cetak Dokumen F4 */}
                          <button
                            type="button"
                            onClick={() => setPreviewJurnal(jurnal)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium shadow-xs cursor-pointer transition-colors"
                            title="Lihat & Cetak Lembar F4 Resmi"
                          >
                            <Printer className="w-3 h-3" />
                            <span className="hidden lg:inline">Cetak</span>
                          </button>

                          {/* Tombol Hapus */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Apakah Anda yakin ingin menghapus jurnal harian ${info.nama} tanggal ${jurnal.hari}, ${jurnal.tanggal}?`)) {
                                onDeleteJurnal(jurnal.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                            title="Hapus riwayat jurnal ini"
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
                    <div className="max-w-md mx-auto space-y-2 text-slate-500">
                      <FileText className="w-8 h-8 mx-auto text-slate-400" />
                      <p className="font-semibold text-slate-800 text-sm">
                        Belum Ada Riwayat Jurnal
                      </p>
                      <p className="text-xs text-slate-500">
                        {searchTerm || filterStatus !== 'ALL'
                          ? 'Tidak ada data jurnal yang cocok dengan filter pencarian.'
                          : 'Setiap kali pegawai menginput dan menyimpan Jurnal Harian, riwayatnya akan otomatis muncul pada tabel ini.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info banyaknya data & petunjuk scroll jika > 10 */}
        <div className="px-4 py-2.5 bg-slate-100/80 border-t border-slate-300 text-[11px] text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Menampilkan <strong>{filteredJurnals.length}</strong> riwayat jurnal
            {filteredJurnals.length > 10 && ' (Tampilan batas 10 baris pertama, gulir ke bawah untuk melihat riwayat lainnya)'}
          </span>
          <span className="text-slate-400">
            SIKAWAN SDN Babelan Kota 01 Tahun 2026
          </span>
        </div>
      </div>

      {/* Modal Cetak / Pratinjau Dokumen F4 Resmi dari Riwayat */}
      {previewJurnal && (
        <F4PrintDocument
          jurnal={previewJurnal}
          pegawai={pegawaiList.find((p) => p.id === previewJurnal.pegawaiId)}
          sekolah={sekolah}
          onClose={() => setPreviewJurnal(null)}
          isModal={true}
        />
      )}
    </div>
  );
};
