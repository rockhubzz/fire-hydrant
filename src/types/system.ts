export type AlertLevel = 'NORMAL' | 'POTENSI_KEBAKARAN' | 'KEBAKARAN';
export type ControlMode = 'AUTO' | 'MANUAL';

export interface SensorSnapshot {
  timestamp: string;
  temperatureC: number;
  firePercent: number;
  pressureBar: number;
  flowRateLpm: number;
  waterLevelPercent: number;
}

export interface SystemState {
  controlMode: ControlMode;
  valveOpen: boolean;
  lastAction: string;
  alertLevel: AlertLevel;
  sensor: SensorSnapshot;
}

export interface SensorLogEntry extends SensorSnapshot {
  valveOpen: boolean;
  controlMode: ControlMode;
  alertLevel: AlertLevel;
}
