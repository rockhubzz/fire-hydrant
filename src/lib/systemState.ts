import { appendSensorLog } from '@/lib/hadoopClient';
import { sendTelegramAlert } from '@/lib/telegram';
import { AlertLevel, SystemState } from '@/types/system';

const SENSOR_INTERVAL_MS = 5_000;
const LOG_INTERVAL_MS = 60_000;

function randomStep(current: number, min: number, max: number, step = 2) {
  const delta = (Math.random() * step * 2) - step;
  const next = current + delta;
  return Math.min(max, Math.max(min, next));
}

function resolveAlertLevel(temperatureC: number, firePercent: number): AlertLevel {
  if (firePercent >= 100 && temperatureC >= 60) {
    return 'KEBAKARAN';
  }

  if (firePercent >= 70 && temperatureC >= 40) {
    return 'POTENSI_KEBAKARAN';
  }

  return 'NORMAL';
}

class HydrantSystem {
  private state: SystemState;
  private started = false;
  private sensorTimer?: NodeJS.Timeout;
  private logTimer?: NodeJS.Timeout;
  private lastNotifiedLevel: AlertLevel = 'NORMAL';

  constructor() {
    this.state = {
      controlMode: 'AUTO',
      valveOpen: false,
      lastAction: 'Sistem diinisialisasi',
      alertLevel: 'NORMAL',
      sensor: {
        timestamp: new Date().toISOString(),
        temperatureC: 31,
        firePercent: 10,
        pressureBar: 4,
        flowRateLpm: 0,
        waterLevelPercent: 100,
      },
    };
  }

  start() {
    if (this.started) {
      return;
    }

    this.started = true;
    this.sensorTimer = setInterval(() => {
      this.tickSensor().catch((error) => {
        console.error('Gagal update sensor:', error);
      });
    }, SENSOR_INTERVAL_MS);

    this.logTimer = setInterval(() => {
      this.writeLog().catch((error) => {
        console.error('Gagal kirim log ke Hadoop:', error);
      });
    }, LOG_INTERVAL_MS);
  }

  getState() {
    return this.state;
  }

  setMode(mode: 'AUTO' | 'MANUAL') {
    this.state.controlMode = mode;
    this.state.lastAction = `Mode diubah ke ${mode} pada ${new Date().toLocaleTimeString('id-ID')}`;

    if (mode === 'AUTO') {
      this.applyAutoValveRule();
    }

    return this.state;
  }

  setManualValve(open: boolean, operator = 'Petugas') {
    this.state.controlMode = 'MANUAL';
    this.state.valveOpen = open;
    this.state.sensor.flowRateLpm = open ? 120 : 0;
    this.state.lastAction = `${operator} ${open ? 'membuka' : 'menutup'} valve pada ${new Date().toLocaleTimeString('id-ID')}`;
    return this.state;
  }

  private async tickSensor() {
    const sensor = this.state.sensor;

    const fireBaseline = this.state.valveOpen ? 0.8 : 1;

    sensor.temperatureC = randomStep(sensor.temperatureC * fireBaseline, 25, 80, 3);
    sensor.firePercent = randomStep(sensor.firePercent * fireBaseline, 0, 100, 7);
    sensor.pressureBar = randomStep(sensor.pressureBar, 2, 10, 0.8);
    sensor.waterLevelPercent = randomStep(sensor.waterLevelPercent, 10, 100, 1);

    const hazardBoost = Math.random();
    if (hazardBoost > 0.9) {
      sensor.firePercent = Math.min(100, sensor.firePercent + 20);
      sensor.temperatureC = Math.min(80, sensor.temperatureC + 8);
    }

    this.state.alertLevel = resolveAlertLevel(sensor.temperatureC, sensor.firePercent);

    if (this.state.controlMode === 'AUTO') {
      this.applyAutoValveRule();
    }

    sensor.timestamp = new Date().toISOString();

    await this.notifyIfNeeded();
  }

  private applyAutoValveRule() {
    const shouldOpen = this.state.alertLevel !== 'NORMAL';

    this.state.valveOpen = shouldOpen;
    this.state.sensor.flowRateLpm = shouldOpen ? 120 : 0;
    this.state.lastAction = shouldOpen
      ? `AUTO membuka valve karena status ${this.state.alertLevel}`
      : 'AUTO menutup valve karena status kembali NORMAL';
  }

  private async notifyIfNeeded() {
    if (this.state.alertLevel === 'NORMAL') {
      this.lastNotifiedLevel = 'NORMAL';
      return;
    }

    if (this.lastNotifiedLevel === this.state.alertLevel) {
      return;
    }

    await sendTelegramAlert(this.state.alertLevel, this.state.sensor);
    this.lastNotifiedLevel = this.state.alertLevel;
  }

  private async writeLog() {
    await appendSensorLog({
      ...this.state.sensor,
      alertLevel: this.state.alertLevel,
      controlMode: this.state.controlMode,
      valveOpen: this.state.valveOpen,
    });
  }
}

const globalForHydrant = globalThis as unknown as {
  hydrantSystem?: HydrantSystem;
};

if (!globalForHydrant.hydrantSystem) {
  globalForHydrant.hydrantSystem = new HydrantSystem();
  globalForHydrant.hydrantSystem.start();
}

export const hydrantSystem = globalForHydrant.hydrantSystem;
