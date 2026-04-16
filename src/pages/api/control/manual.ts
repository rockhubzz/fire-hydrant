import type { NextApiRequest, NextApiResponse } from 'next';
import { appendSensorLog } from '@/lib/hadoopClient';
import { hydrantSystem } from '@/lib/systemState';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, message: 'Method tidak diizinkan' });
  }

  const open = req.body?.open;
  const operator = req.body?.operator || 'Petugas';

  if (typeof open !== 'boolean') {
    return res.status(400).json({ ok: false, message: 'open harus boolean' });
  }

  const state = hydrantSystem.setManualValve(open, operator);

  try {
    await appendSensorLog({
      ...state.sensor,
      timestamp: new Date().toISOString(),
      alertLevel: state.alertLevel,
      controlMode: state.controlMode,
      valveOpen: state.valveOpen,
    });
  } catch (error) {
    // Jangan gagalkan aksi kontrol jika sinkronisasi log gagal
    console.error('[API /control/manual] Gagal sinkronisasi log:', error);
  }

  return res.status(200).json({ ok: true, data: state });
}
