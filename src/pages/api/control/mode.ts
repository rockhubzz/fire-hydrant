import type { NextApiRequest, NextApiResponse } from 'next';
import { hydrantSystem } from '@/lib/systemState';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, message: 'Method tidak diizinkan' });
  }

  const mode = req.body?.mode;
  if (mode !== 'AUTO' && mode !== 'MANUAL') {
    return res.status(400).json({ ok: false, message: 'mode harus AUTO atau MANUAL' });
  }

  const state = hydrantSystem.setMode(mode);
  return res.status(200).json({ ok: true, data: state });
}
