import React from 'react';

interface OfficialStampProps {
  className?: string;
  size?: number | string;
}

export const OfficialStamp: React.FC<OfficialStampProps> = ({ className = '', size = '43mm' }) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  return (
    <div 
      className={`relative inline-block pointer-events-none select-none opacity-85 rotate-[-8deg] ${className}`}
      style={{ width: dimension, height: dimension }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full text-indigo-800" fill="currentColor">
        {/* Lingkaran Luar */}
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Lingkaran Dalam */}
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* Bintang Tengah */}
        <polygon 
          points="100,74 103,83 112,83 105,88 108,97 100,92 92,97 95,88 88,83 97,83" 
          fill="currentColor" 
        />

        {/* Tulisan Tengah */}
        <text 
          x="100" 
          y="112" 
          textAnchor="middle" 
          fontFamily="'Plus Jakarta Sans', sans-serif" 
          fontSize="11" 
          fontWeight="bold" 
          letterSpacing="1"
        >
          BABELAN
        </text>
        <text 
          x="100" 
          y="126" 
          textAnchor="middle" 
          fontFamily="'Plus Jakarta Sans', sans-serif" 
          fontSize="10" 
          fontWeight="bold" 
          letterSpacing="0.8"
        >
          KOTA 01
        </text>

        {/* Teks Melingkar Atas & Bawah */}
        <path id="curveTop" d="M 22 100 A 78 78 0 0 1 178 100" fill="none" />
        <path id="curveBottom" d="M 178 100 A 78 78 0 0 1 22 100" fill="none" />

        <text fontSize="10.5" fontWeight="bold" letterSpacing="2.2" fill="currentColor">
          <textPath href="#curveTop" startOffset="50%" textAnchor="middle">
            PEMERINTAH KAB. BEKASI
          </textPath>
        </text>

        <text fontSize="10.5" fontWeight="bold" letterSpacing="2.2" fill="currentColor">
          <textPath href="#curveBottom" startOffset="50%" textAnchor="middle">
            ★ DINAS PENDIDIKAN ★
          </textPath>
        </text>
      </svg>
    </div>
  );
};
