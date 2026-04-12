import { AlertLevel, SensorSnapshot } from '@/types/system';

function getMessage(level: AlertLevel, sensor: SensorSnapshot) {
  const title =
    level === 'KEBAKARAN'
      ? 'ALERT KEBAKARAN'
      : level === 'POTENSI_KEBAKARAN'
        ? 'Peringatan Potensi Kebakaran'
        : 'Status Normal';

  return [
    `[HYDRANT] ${title}`,
    `Waktu: ${new Date(sensor.timestamp).toLocaleString('id-ID')}`,
    `Sensor Api: ${sensor.firePercent.toFixed(1)}%`,
    `Suhu: ${sensor.temperatureC.toFixed(1)} derajat C`,
    `Tekanan: ${sensor.pressureBar.toFixed(2)} bar`,
    `Flow: ${sensor.flowRateLpm.toFixed(1)} L/menit`,
  ].join('\n');
}

export async function sendTelegramAlert(level: AlertLevel, sensor: SensorSnapshot) {
  if (level === 'NORMAL') {
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram tidak dikirim karena TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID belum di-set.');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: getMessage(level, sensor),
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gagal kirim notifikasi Telegram: ${response.status} ${body}`);
  }
}
