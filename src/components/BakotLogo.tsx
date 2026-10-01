import React from 'react';

interface BakotLogoProps {
  className?: string;
  size?: number | string;
}

export const BakotLogo: React.FC<BakotLogoProps> = ({
  className = 'w-10 h-10',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="Logo SDN Babelan Kota 01"
    >
      {/* 1. Outer Circular Swashes (Cyan / Biru Muda) */}
      <circle
        cx="250"
        cy="250"
        r="234"
        stroke="#00a8e8"
        strokeWidth="32"
        strokeLinecap="round"
        strokeDasharray="1400 70"
        transform="rotate(-25 250 250)"
      />

      {/* 2. Inner Ring (Magenta / Crimson Pink) */}
      <circle
        cx="250"
        cy="250"
        r="200"
        stroke="#d81b60"
        strokeWidth="30"
        strokeLinecap="round"
        strokeDasharray="1200 60"
        transform="rotate(65 250 250)"
      />

      {/* 3. White Base Circle Inside Rings */}
      <circle cx="250" cy="250" r="172" fill="#ffffff" />

      {/* 4. Center Shield Outer Contour (Red & White Border) */}
      <path
        d="M250 110 
           C285 130 325 142 388 155 
           C375 220 370 295 268 400 
           L250 415 
           L232 400 
           C130 295 125 220 112 155 
           C175 142 215 130 250 110 Z"
        fill="#ed1c24"
      />
      <path
        d="M250 116 
           C282 134 320 145 378 158 
           C366 218 361 288 266 388 
           L250 402 
           L234 388 
           C139 288 134 218 122 158 
           C180 145 218 134 250 116 Z"
        fill="#ffffff"
      />

      {/* 5. Center Shield Body (Biru Tua SDN Babelan Kota 01) */}
      <path
        d="M250 122 
           C280 139 316 149 370 161 
           C358 217 353 282 263 378 
           L250 392 
           L237 378 
           C147 282 142 217 130 161 
           C184 149 220 139 250 122 Z"
        fill="#0072bc"
      />

      {/* 6. Typography Inside Shield: "SDN" & "BABELAN KOTA 01" */}
      <text
        x="250"
        y="172"
        fill="#ffffff"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="32"
        letterSpacing="1"
      >
        SDN
      </text>
      <text
        x="250"
        y="196"
        fill="#ffffff"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="17.5"
        letterSpacing="0.8"
      >
        BABELAN KOTA 01
      </text>

      {/* 7. Flanking Rice / Padi (Kuning Keemasan) on Left */}
      <g fill="#ffde00" stroke="#d4af37" strokeWidth="1">
        <path d="M192 216 C190 213 182 214 180 217 C178 221 185 226 188 225 Z" />
        <path d="M185 225 C182 222 174 224 172 228 C170 232 178 236 181 234 Z" />
        <path d="M180 236 C176 233 168 235 166 240 C165 244 173 247 176 245 Z" />
        <path d="M176 248 C172 245 164 248 162 253 C161 257 169 260 172 257 Z" />
        <path d="M174 261 C169 258 162 262 161 267 C160 272 168 273 171 270 Z" />
        <path d="M174 274 C169 272 162 276 161 281 C161 286 169 287 172 283 Z" />
        <path d="M176 288 C171 286 165 291 165 296 C166 301 173 301 176 296 Z" />
        <path d="M182 301 C177 301 172 306 173 311 C175 316 182 314 184 309 Z" />
        <path d="M190 314 C186 314 182 320 184 325 C187 329 193 327 194 321 Z" />
        {/* Rice stalk stem */}
        <path d="M195 214 C175 245 170 295 198 325" fill="none" stroke="#2e7d32" strokeWidth="2.5" />
      </g>

      {/* 8. Flanking Cotton / Kapas (Hijau & Putih) on Right */}
      <g>
        {/* Cotton stalk stem */}
        <path d="M305 214 C325 245 330 295 302 325" fill="none" stroke="#2e7d32" strokeWidth="2.5" />
        {/* Cotton bolls with green calyx and white fluffy heads */}
        <circle cx="310" cy="218" r="5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="318" cy="229" r="5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="324" cy="242" r="5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="328" cy="256" r="5.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="329" cy="271" r="5.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="327" cy="286" r="5.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="321" cy="300" r="5.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="312" cy="313" r="5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
        <circle cx="304" cy="324" r="4.5" fill="#ffffff" stroke="#2e7d32" strokeWidth="1.5" />
      </g>

      {/* 9. Center Emblem: Tut Wuri Handayani (Sayap, Bulu, Api Merah, Buku) */}
      <g>
        {/* Open Book Base */}
        <path
          d="M250 307 
             C232 300 205 305 195 315 
             L198 322 
             C210 314 235 311 250 318 
             C265 311 290 314 302 322 
             L305 315 
             C295 305 268 300 250 307 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Wings (Sayap Kiri dan Kanan) */}
        <path
          d="M250 286
             C225 285 200 270 188 250
             C192 268 202 284 216 295
             C200 293 189 285 184 275
             C188 290 200 303 218 307
             C232 309 242 302 250 298
             C258 302 268 309 282 307
             C300 303 312 290 316 275
             C311 285 300 293 284 295
             C298 284 308 268 312 250
             C300 270 275 285 250 286 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Top Plumage Feathers (Bulu Tegak 5 Lembar) */}
        <path
          d="M250 216 
             L246 256 L254 256 Z 
             M242 220 L240 257 L247 257 Z 
             M258 220 L253 257 L260 257 Z 
             M234 227 L235 258 L241 258 Z 
             M266 227 L259 258 L265 258 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.2"
        />

        {/* Flame / Api Obor Belajar (Merah Menyala) */}
        <path
          d="M250 242 
             C246 250 242 255 244 263 
             C246 271 254 271 256 263 
             C258 255 254 250 250 242 Z"
          fill="#ed1c24"
          stroke="#ffffff"
          strokeWidth="1.2"
        />
      </g>

      {/* 10. Bottom White Ribbon: "KAB. BEKASI" */}
      <g>
        {/* Ribbon Fold Tails */}
        <path d="M190 338 L170 348 L188 356 L186 342 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
        <path d="M310 338 L330 348 L312 356 L314 342 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
        
        {/* Ribbon Banner Body */}
        <path
          d="M185 336 
             C206 331 230 329 250 329 
             C270 329 294 331 315 336 
             L311 358 
             C292 352 270 350 250 350 
             C230 350 208 352 189 358 Z"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="1.5"
        />

        {/* Text "KAB. BEKASI" */}
        <text
          x="250"
          y="346"
          fill="#000000"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontWeight="900"
          fontSize="11.5"
          letterSpacing="0.8"
        >
          KAB. BEKASI
        </text>
      </g>
    </svg>
  );
};
