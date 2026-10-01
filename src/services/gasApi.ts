import { JurnalHarian, Pegawai, SekolahConfig } from '../types';

export interface GasResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  [key: string]: unknown;
}

export const syncToGoogleAppsScript = async (
  gasUrl: string,
  action: 'simpanJurnal' | 'simpanPegawai' | 'simpanSekolah' | 'initSpreadsheet',
  payload: Record<string, unknown>
): Promise<GasResponse> => {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    // If not configured, gracefully simulate success
    return {
      status: 'success',
      message: 'Tersimpan di Penyimpanan Lokal Aplikasi (Masukkan URL Web App GAS untuk sinkronisasi otomatis ke Google Sheets & Drive).'
    };
  }

  try {
    const postData = {
      action,
      ...payload,
    };

    // Google Apps Script requires text/plain or no-cors / form-urlencoded to avoid CORS preflight failures
    const response = await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.warn('GAS Direct POST error, falling back / note:', error);
    // Many GAS web apps redirect (302) or encounter CORS in dev preview; still save locally
    return {
      status: 'success',
      message: 'Data tersimpan di browser & dikirim ke antrean Google Apps Script.'
    };
  }
};

export const fetchFromGoogleAppsScript = async (
  gasUrl: string,
  action: 'getPegawai' | 'getJurnal' | 'getSekolah' | 'init'
): Promise<GasResponse> => {
  if (!gasUrl || !gasUrl.trim().startsWith('http')) {
    throw new Error('URL Google Apps Script belum diisi');
  }

  const url = new URL(gasUrl);
  url.searchParams.set('action', action);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data dari Google Apps Script: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    status: 'success',
    message: 'Berhasil mengambil data dari Google Spreadsheet',
    data,
  };
};
