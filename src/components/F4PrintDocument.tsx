import React, { useRef, useState } from 'react';
import { JurnalHarian, Pegawai, SekolahConfig } from '../types';
import { OfficialKop } from './OfficialKop';
import { OfficialStamp } from './OfficialStamp';
import { X, Download, FileText, User } from 'lucide-react';
import { downloadF4Pdf } from '../services/pdfExporter';

interface F4PrintDocumentProps {
  jurnal: JurnalHarian;
  pegawai?: Pegawai;
  sekolah: SekolahConfig;
  onClose?: () => void;
  isModal?: boolean;
}

export const F4PrintDocument: React.FC<F4PrintDocumentProps> = ({
  jurnal,
  pegawai,
  sekolah,
  onClose,
  isModal = false,
}) => {
  const printContentRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPdf = async () => {
    if (!printContentRef.current) return;
    try {
      setIsExporting(true);
      await downloadF4Pdf(
        printContentRef.current,
        jurnal.pegawaiNama || pegawai?.nama,
        pegawai?.nip || jurnal.pegawaiId
      );
    } catch (err) {
      console.error('Gagal mengunduh PDF:', err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const formatIndonesianDate = (dateStr: string) => {
    try {
      if (!dateStr) return '-';
      const [year, month, day] = dateStr.split('-');
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const mIdx = parseInt(month, 10) - 1;
      return `${parseInt(day, 10)} ${months[mIdx] || ''} ${year}`;
    } catch {
      return dateStr;
    }
  };

  const rawNama = jurnal.pegawaiNama || pegawai?.nama || 'Pegawai';
  const namaClean = rawNama.trim().replace(/\s+/g, '_');
  const rawNip = (pegawai?.nip && pegawai.nip !== '-') ? pegawai.nip : (jurnal.pegawaiId || '-');
  const nipClean = rawNip.trim().replace(/\s+/g, '');
  const footerNamaFile = `Jurnal_Harian_${namaClean}_${nipClean}`;

  const documentContent = (
    <div
      ref={printContentRef}
      id="f4-print-sheet"
      className="bg-white text-slate-900 font-serif-official w-full max-w-[210mm] min-h-[330mm] mx-auto p-[12mm] border-none shadow-none print:shadow-none print:border-none print:p-0 box-border overflow-hidden flex flex-col justify-between"
      style={{
        boxSizing: 'border-box',
        padding: '12mm',
        width: '100%',
        maxWidth: '210mm',
        minHeight: '330mm',
        backgroundColor: '#ffffff',
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {/* 1. KOP SURAT RESMI KABUPATEN BEKASI */}
      <OfficialKop sekolah={sekolah} />

      {/* 2. JUDUL LEMBAR KERJA */}
      <div className="text-center mt-3 mb-[10mm]">
        <h2 className="text-[15px] md:text-[16px] font-bold tracking-wider uppercase underline text-slate-950">
          JURNAL KERJA HARIAN
        </h2>
      </div>

      {/* 3. IDENTITAS PEGAWAI & KOTAK FOTO 3X4 */}
      <div className="mb-4 text-[12px] w-full flex items-start justify-between gap-4">
        {/* Kolom Kiri: Data Identitas Pegawai */}
        <div className="flex-1 min-w-0">
          <table className="w-full table-fixed border-collapse border-spacing-0" style={{ lineHeight: '1.15' }}>
            <tbody>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="w-32 sm:w-36 font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>Nama</td>
                <td className="w-3 text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="font-bold text-slate-950 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>{jurnal.pegawaiNama || pegawai?.nama || '-'}</td>
              </tr>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>NIP</td>
                <td className="text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="font-mono text-slate-900 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>
                  {(pegawai?.nip && pegawai.nip !== '-' ? pegawai.nip : '-')}
                </td>
              </tr>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>Jabatan</td>
                <td className="text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="py-0 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>{pegawai?.jabatan || 'Guru Kelas'}</td>
              </tr>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>Unit Kerja</td>
                <td className="text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="py-0 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>{sekolah.namaSekolah || 'SD Negeri Babelan Kota 01'}</td>
              </tr>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>Pangkat/Gol</td>
                <td className="text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="py-0 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>{pegawai?.golongan || '-'}</td>
              </tr>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>Status Pegawai</td>
                <td className="text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="py-0 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>{pegawai?.status || 'PNS'}</td>
              </tr>
              <tr style={{ lineHeight: '1.15' }}>
                <td className="font-semibold text-slate-800" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>Hari/Tanggal</td>
                <td className="text-center" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>:</td>
                <td className="font-medium text-slate-900 break-words" style={{ paddingTop: '1pt', paddingBottom: '1pt' }}>
                  {jurnal.hari}, {formatIndonesianDate(jurnal.tanggal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Kolom Kanan: Kotak Foto 2,5x3,5 Sejajar dengan Kolom Ket (Sisi Kanan Tabel) */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-[25mm] h-[35mm] border border-slate-900 bg-slate-50 rounded-xs overflow-hidden flex flex-col items-center justify-center relative shadow-xs">
            {pegawai?.fotoUrl ? (
              <img
                src={pegawai.fotoUrl}
                alt="Foto Pegawai 2,5x3,5"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-slate-50">
                <div className="w-6 h-6 rounded-full bg-slate-200/90 flex items-center justify-center text-slate-500 mb-1">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider leading-tight">
                  FOTO
                </span>
                <span className="text-[8.5px] font-semibold text-slate-500 leading-tight">
                  2,5 × 3,5
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. TABEL URAIAN KEGIATAN HARIAN */}
      <div className="my-3 w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse border border-slate-900 text-[11px] text-left">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-900 text-center font-bold">
              <th className="border border-slate-900 p-2 w-[7%] text-center">No</th>
              <th className="border border-slate-900 p-2 w-[18%] text-center">Waktu</th>
              <th className="border border-slate-900 p-2 w-[48%]">Kegiatan</th>
              <th className="border border-slate-900 p-2 w-[20%] text-center">Bukti Dukung</th>
              <th className="border border-slate-900 p-2 w-[7%] text-center">Ket.</th>
            </tr>
          </thead>
          <tbody>
            {jurnal.kegiatanList && jurnal.kegiatanList.length > 0 ? (
              jurnal.kegiatanList.map((item, idx) => (
                <tr key={item.id || idx} className="align-top">
                  <td className="border border-slate-900 p-2 text-center font-medium">{idx + 1}</td>
                  <td className="border border-slate-900 p-2 text-center font-mono-code font-medium whitespace-nowrap text-[10.5px]">
                    {item.jamMulaiJam}:{item.jamMulaiMenit} - {item.jamSelesaiJam}:{item.jamSelesaiMenit}
                  </td>
                  <td className="border border-slate-900 p-2 leading-relaxed break-words whitespace-normal">
                    <p className="font-medium text-slate-950 break-words">{item.uraian || 'Belum diisi...'}</p>
                  </td>
                  <td className="border border-slate-900 p-1.5 text-center align-middle">
                    {item.fotoBase64 ? (
                      <div className="mx-auto border border-slate-300 rounded-xs overflow-hidden bg-slate-50 w-24 h-16 flex items-center justify-center">
                        <img
                          src={item.fotoBase64}
                          alt={`Bukti Foto ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">-</span>
                    )}
                  </td>
                  <td className="border border-slate-900 p-2 text-center align-middle"></td>
                </tr>
              ))
            ) : (
              <tr className="align-top">
                <td className="border border-slate-900 p-2.5 text-center font-medium">1</td>
                <td className="border border-slate-900 p-2.5 text-center font-mono-code font-medium whitespace-nowrap text-[10.5px]">
                  {jurnal.jamMulai} - {jurnal.jamSelesai}
                </td>
                <td className="border border-slate-900 p-2.5 leading-relaxed break-words whitespace-normal">
                  <p className="font-medium text-slate-950 mb-1 break-words">{jurnal.uraianKegiatan || 'Belum diisi...'}</p>
                </td>
                <td className="border border-slate-900 p-1.5 text-center align-middle">
                  {jurnal.fotoDokumentasi ? (
                    <div className="mx-auto border border-slate-300 rounded-xs overflow-hidden bg-slate-50 w-24 h-16 flex items-center justify-center">
                      <img
                        src={jurnal.fotoDokumentasi}
                        alt="Bukti Foto"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-400 text-[11px]">-</span>
                  )}
                </td>
                <td className="border border-slate-900 p-2.5 text-center align-middle"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 5. AREA PENGESAHAN DAN TANDA TANGAN RESMI */}
      <div className="mt-8 pt-2 flex items-start justify-between text-[11.5px] leading-relaxed relative w-full px-1">
        {/* Kolom Kiri: Kepala Sekolah */}
        <div className="text-center w-56 sm:w-64 relative">
          <p className="text-slate-800">Mengetahui,</p>
          <p className="font-semibold text-slate-950">Kepala SD Negeri Babelan Kota 01</p>
          
          <div className="relative h-[18mm] flex items-end justify-center mb-0 mt-0.5">
            {/* Stempel Sekolah Melingkar Ukuran 43x43mm */}
            <div className="absolute left-[-2mm] top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none">
              {sekolah.stempelSekolahUrl ? (
                <img
                  src={sekolah.stempelSekolahUrl}
                  alt="Stempel Sekolah"
                  className="w-[43mm] h-[43mm] object-contain opacity-85 rotate-[-8deg]"
                />
              ) : (
                <OfficialStamp size="43mm" />
              )}
            </div>

            {/* Tanda Tangan Kepsek dengan tinggi 18mm menempel pada nama */}
            {sekolah.kepalaSekolahTtd ? (
              <img
                src={sekolah.kepalaSekolahTtd}
                alt="TTD Kepala Sekolah"
                referrerPolicy="no-referrer"
                className="h-[18mm] max-h-[18mm] max-w-[180px] object-contain relative z-20 mix-blend-multiply translate-y-0.5"
              />
            ) : (
              <div className="relative z-20 flex items-end justify-center mix-blend-multiply translate-y-0.5">
                <svg viewBox="0 0 180 90" className="w-38 h-[18mm] text-slate-900" fill="none" stroke="currentColor">
                  <path
                    d="M 14 62 C 24 30, 35 10, 50 32 C 62 56, 72 12, 78 40 C 85 68, 94 20, 108 36 C 122 46, 134 24, 150 40 C 160 54, 168 44, 176 28 M 28 60 Q 78 84, 168 64"
                    strokeWidth="3.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="-mt-2 relative z-30">
            <p className="font-bold text-slate-950 underline leading-tight break-words">
              {sekolah.kepalaSekolahNama || 'LAILATUL FAJRIAH, S.Pd.SD'}
            </p>
            <p className="text-[11px] text-slate-800">
              NIP. {sekolah.kepalaSekolahNIP || '197808202008012005'}
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Pegawai yang Bersangkutan */}
        <div className="text-center w-56 sm:w-64">
          <p className="text-slate-800">Babelan, {formatIndonesianDate(jurnal.tanggal)}</p>
          <p className="font-semibold text-slate-950">Pegawai yang Bersangkutan,</p>
          
          <div className="h-[18mm] flex items-end justify-center mb-0 mt-0.5">
            {pegawai?.ttdUrl ? (
              <img
                src={pegawai.ttdUrl}
                alt="TTD Pegawai"
                referrerPolicy="no-referrer"
                className="h-[18mm] max-h-[18mm] max-w-[155px] object-contain mix-blend-multiply"
              />
            ) : (
              <div className="text-slate-300 italic text-[11px] h-[18mm] flex items-center justify-center">
                [Tanda Tangan Pegawai]
              </div>
            )}
          </div>

          <div className="-mt-2 relative z-30">
            <p className="font-bold text-slate-950 underline leading-tight break-words">
              {jurnal.pegawaiNama || pegawai?.nama || '[Nama Pegawai]'}
            </p>
            <p className="text-[11px] text-slate-800">
              NIP. {pegawai?.nip && pegawai.nip !== '-' ? pegawai.nip : '-'}
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* 6. FOOTER LEMBAR JURNAL HARIAN F4 */}
      {/* Garis atas, sebelah kiri: Jurnal_Harian_nama pegawai_nip, sebelah kanan: Dicetak oleh SDN Babelan Kota 01, margin bawah: 1cm (10mm) */}
      <div
        className="w-full pt-1.5 border-t border-slate-900 text-slate-700 flex items-center justify-between"
        style={{
          borderTop: '1px solid #0f172a',
          paddingTop: '3px',
          marginBottom: '10mm', // margin bawah: 1cm
          marginTop: 'auto',
          fontSize: '9.5px',
          lineHeight: '1.2',
        }}
      >
        <span className="font-mono text-slate-800 tracking-tight">
          {footerNamaFile}
        </span>
        <span className="font-sans font-medium text-slate-700">
          Dicetak oleh SDN Babelan Kota 01
        </span>
      </div>
    </div>
  );

  if (!isModal) {
    return documentContent;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-4 md:p-8 flex items-center justify-center backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm">Pratinjau Lembar F4 (Ukuran Folio Kedinasan)</h3>
              <p className="text-xs text-slate-400">
                SD Negeri Babelan Kota 01 · {jurnal.pegawaiNama} ({jurnal.tanggal})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Memproses PDF...' : 'Simpan PDF'}</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1.5 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="p-4 md:p-8 overflow-y-auto bg-slate-100 flex-1">
          {documentContent}
        </div>
      </div>
    </div>
  );
};
