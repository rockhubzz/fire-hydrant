import fs from 'fs/promises';
import path from 'path';
import { SensorLogEntry } from '@/types/system';

const LOG_DIR = path.join(process.cwd(), 'logs');
const FALLBACK_LOG_FILE = path.join(LOG_DIR, 'hadoop-sensor-log.jsonl');

async function ensureFallbackFile() {
  await fs.mkdir(LOG_DIR, { recursive: true });
  try {
    await fs.access(FALLBACK_LOG_FILE);
  } catch {
    await fs.writeFile(FALLBACK_LOG_FILE, '', 'utf8');
  }
}

async function parseJsonLines(raw: string): Promise<SensorLogEntry[]> {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as SensorLogEntry);
}

async function webhdfsWrite(line: string) {
  const base = process.env.HADOOP_WEBHDFS_URL;
  const remotePath = process.env.HADOOP_LOG_PATH || '/fire-hydrant/sensor-log.jsonl';

  if (!base) {
    throw new Error('HADOOP_WEBHDFS_URL belum di-set.');
  }

  const appendInit = await fetch(`${base}${remotePath}?op=APPEND`, {
    method: 'POST',
    redirect: 'manual',
  });

  const appendLocation = appendInit.headers.get('location');

  if (!appendLocation) {
    const createInit = await fetch(`${base}${remotePath}?op=CREATE&overwrite=false`, {
      method: 'PUT',
      redirect: 'manual',
    });
    const createLocation = createInit.headers.get('location');

    if (!createLocation) {
      throw new Error('Gagal membuat file log di WebHDFS.');
    }

    await fetch(createLocation, {
      method: 'PUT',
      body: line,
      headers: { 'content-type': 'application/octet-stream' },
    });
    return;
  }

  await fetch(appendLocation, {
    method: 'POST',
    body: line,
    headers: { 'content-type': 'application/octet-stream' },
  });
}

async function webhdfsRead(): Promise<SensorLogEntry[]> {
  const base = process.env.HADOOP_WEBHDFS_URL;
  const remotePath = process.env.HADOOP_LOG_PATH || '/fire-hydrant/sensor-log.jsonl';

  if (!base) {
    throw new Error('HADOOP_WEBHDFS_URL belum di-set.');
  }

  const response = await fetch(`${base}${remotePath}?op=OPEN`);
  if (!response.ok) {
    throw new Error(`Gagal membaca log WebHDFS. Status ${response.status}`);
  }

  const raw = await response.text();
  return parseJsonLines(raw);
}

export async function appendSensorLog(entry: SensorLogEntry) {
  const line = `${JSON.stringify(entry)}\n`;
  const mode = process.env.HADOOP_MODE || 'local';

  if (mode.toLowerCase() === 'webhdfs') {
    try {
      await webhdfsWrite(line);
      return;
    } catch (error) {
      console.error('WebHDFS gagal, fallback ke file lokal:', error);
    }
  }

  await ensureFallbackFile();
  await fs.appendFile(FALLBACK_LOG_FILE, line, 'utf8');
}

export async function readSensorLogs(limit = 100): Promise<SensorLogEntry[]> {
  const mode = process.env.HADOOP_MODE || 'local';

  if (mode.toLowerCase() === 'webhdfs') {
    try {
      const data = await webhdfsRead();
      return data.slice(-limit).reverse();
    } catch (error) {
      console.error('Baca WebHDFS gagal, fallback ke file lokal:', error);
    }
  }

  await ensureFallbackFile();
  const raw = await fs.readFile(FALLBACK_LOG_FILE, 'utf8');
  const parsed = await parseJsonLines(raw);
  return parsed.slice(-limit).reverse();
}
