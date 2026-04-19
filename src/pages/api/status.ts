import type { NextApiRequest, NextApiResponse } from 'next';
import { hydrantSystem } from '@/lib/systemState';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  // Use in-memory system state for real-time status (no Hadoop calls)
  // Hadoop is only used for log persistence (write) and historical data (logs API)
  const systemState = hydrantSystem.getState();
  
  res.status(200).json({
    ok: true,
    data: systemState,
    source: 'system-state',
  });
}
