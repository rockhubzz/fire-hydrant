import type { NextApiRequest, NextApiResponse } from 'next';
import { hydrantSystem } from '@/lib/systemState';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
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
  return res.status(200).json({ ok: true, data: state });
}
