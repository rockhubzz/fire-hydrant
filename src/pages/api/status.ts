import type { NextApiRequest, NextApiResponse } from 'next';
import { hydrantSystem } from '@/lib/systemState';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    ok: true,
    data: hydrantSystem.getState(),
  });
}
