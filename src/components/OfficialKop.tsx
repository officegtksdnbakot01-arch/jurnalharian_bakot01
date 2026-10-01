import React from 'react';
import { SekolahConfig } from '../types';

interface OfficialKopProps {
  sekolah: SekolahConfig;
  className?: string;
  condensed?: boolean;
}

export const OfficialKop: React.FC<OfficialKopProps> = ({ sekolah, className = '', condensed = false }) => {
  if (sekolah.kopSekolahUrl) {
    return (
      <div className={`text-center font-serif-official border-b-[3px] border-double border-slate-900 pb-2 mb-4 ${className}`}>
        <img
          src={sekolah.kopSekolahUrl}
          alt="Kop Surat Resmi"
          className="w-full max-h-36 object-contain mx-auto"
        />
      </div>
    );
  }

  return (
    <div className={`text-center font-serif-official border-b-[3px] border-double border-slate-900 pb-3 mb-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Logo Lambang Daerah Kabupaten Bekasi (Stylized SVG Resmi) */}
        <div className="w-16 h-20 shrink-0 flex items-center justify-center">
          <svg viewBox="0 0 100 120" className="w-16 h-20 drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 5 L88 24 V70 C88 95 50 115 50 115 C50 115 12 95 12 70 V24 Z" fill="#0284c7" stroke="#0f172a" strokeWidth="2.5" />
            <path d="M50 12 L80 28 V68 C80 88 50 106 50 106 C50 106 20 88 20 68 V28 Z" fill="#0369a1" />
            <path d="M22 68 H78 V72 H22 Z" fill="#eab308" />
            <polygon points="50,22 55,34 68,34 57,42 61,54 50,46 39,54 43,42 32,34 45,34" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            <path d="M30 65 Q50 48 70 65" stroke="#f8fafc" strokeWidth="3" fill="none" />
            <circle cx="50" cy="80" r="14" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
            <path d="M42 80 H58 M50 72 V88" stroke="#dc2626" strokeWidth="2.5" />
            <text x="50" y="100" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="sans-serif">BEKASI</text>
          </svg>
        </div>

        {/* Tulisan Kop Resmi */}
        <div className="flex-1 text-center">
          <h4 className="text-[13px] md:text-[14px] font-bold tracking-wider uppercase text-slate-900 leading-tight">
            Pemerintah {sekolah.kabupaten || 'Kabupaten Bekasi'}
          </h4>
          <h3 className="text-[15px] md:text-[16px] font-bold tracking-wider uppercase text-slate-900 leading-tight mt-0.5">
            Dinas Pendidikan
          </h3>
          <h2 className="text-[17px] md:text-[19px] font-extrabold tracking-wide uppercase text-slate-950 leading-tight mt-0.5">
            {sekolah.namaSekolah || 'SD NEGERI BABELAN KOTA 01'}
          </h2>
          <p className="text-[11px] md:text-[12px] text-slate-700 leading-snug mt-1">
            NPSN: <span className="font-semibold text-slate-900">{sekolah.npsn || '20219135'}</span> · {sekolah.alamat}
          </p>
          <p className="text-[10px] md:text-[11px] text-slate-600 leading-tight">
            {sekolah.kecamatan}, {sekolah.kabupaten}, Provinsi {sekolah.provinsi} · Tahun {sekolah.tahunJurnal}
          </p>
        </div>

        {/* Spacer kanan agar teks kop tetap berada di tengah sempurna */}
        <div className="w-16 shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};
