import type { NextApiRequest, NextApiResponse } from 'next';
import { readSensorLogs } from '@/lib/hadoopClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ ok: false, message: 'Method tidak diizinkan' });
  }

  const limit = Number(req.query.limit ?? '50');

  try {
    const logs = await readSensorLogs(Number.isFinite(limit) ? limit : 50);
    return res.status(200).json({ ok: true, data: logs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Gagal membaca log Hadoop' });
  }
}
