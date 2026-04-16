import type { NextApiRequest, NextApiResponse } from 'next';
import { readSensorLogs } from '@/lib/hadoopClient';
import { hydrantSystem } from '@/lib/systemState';
import { SensorLogEntry, SystemState } from '@/types/system';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    // Prefer latest persisted state so status remains consistent across API workers.
    const logs = await readSensorLogs(1);

    if (logs && logs.length > 0) {
      const latestLog = logs[0]; // Most recent entry (reversed order)

      // Convert SensorLogEntry to SystemState
      const systemState: SystemState = {
        controlMode: latestLog.controlMode,
        valveOpen: latestLog.valveOpen,
        lastAction: `Latest: ${new Date(latestLog.timestamp).toLocaleTimeString('id-ID')}`,
        alertLevel: latestLog.alertLevel,
        sensor: {
          timestamp: latestLog.timestamp,
          temperatureC: latestLog.temperatureC,
          firePercent: latestLog.firePercent,
          pressureBar: latestLog.pressureBar,
          flowRateLpm: latestLog.flowRateLpm,
          waterLevelPercent: latestLog.waterLevelPercent,
        },
      };

      return res.status(200).json({
        ok: true,
        data: systemState,
        source: 'hadoop-logs',
      });
    }
  } catch (error) {
    console.warn('[Status API] Failed to read from Hadoop logs, falling back to system state:', error);
  }

  // Fallback to in-memory state for local/dev scenarios.
  res.status(200).json({
    ok: true,
    data: hydrantSystem.getState(),
    source: 'system-state',
  });
}
