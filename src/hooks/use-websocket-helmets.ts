'use client';

import { useEffect, useState } from 'react';
import { helmetUrl } from '@/lib/ws';
import type { SensorReading } from '@/lib/types';

interface HelmetWsPayload {
  helmet_id?: string;
  message?: string;
  temperature?: number;
  humidity?: number;
  gas_level?: number;
  co_ppm?: number;
  ch4_percent?: number;
  vibration_detected?: boolean;
  helmet_worn?: boolean;
  accelerometer_x?: number;
  accelerometer_y?: number;
  accelerometer_z?: number;
  gyro_x?: number;
  gyro_y?: number;
  gyro_z?: number;
  ir_value?: number;
  battery_level?: number;
  signal_strength?: number;
  step_count?: number;
  heading_deg?: number;
  est_zone?: string;
  ai_prediction?: string;
  ai_confidence?: number;
  ai_danger_votes?: number;
  ai_model_votes?: Record<string, string>;
  recorded_at?: string;
}

function mapWsPayload(raw: HelmetWsPayload): SensorReading | null {
  if (raw.message) return null;
  return {
    temperature: raw.temperature,
    humidity: raw.humidity,
    gas_level: raw.gas_level,
    co_ppm: raw.co_ppm,
    ch4_percent: raw.ch4_percent,
    vibration_detected: raw.vibration_detected ?? false,
    helmet_worn: raw.helmet_worn ?? false,
    accelerometer_x: raw.accelerometer_x,
    accelerometer_y: raw.accelerometer_y,
    accelerometer_z: raw.accelerometer_z,
    gyro_x: raw.gyro_x,
    gyro_y: raw.gyro_y,
    gyro_z: raw.gyro_z,
    ir_value: raw.ir_value,
    battery_level: raw.battery_level,
    signal_strength: raw.signal_strength,
    step_count: raw.step_count,
    heading_deg: raw.heading_deg,
    est_zone: raw.est_zone,
    ai_prediction: raw.ai_prediction,
    ai_confidence: raw.ai_confidence,
    ai_danger_votes: raw.ai_danger_votes,
    ai_model_votes: raw.ai_model_votes,
    recorded_at: raw.recorded_at,
  };
}

export function useHelmetLive(helmetId: string | null) {
  const [data, setData] = useState<SensorReading | null>(null);

  useEffect(() => {
    if (!helmetId) return;

    const ws = new WebSocket(helmetUrl(helmetId));
    ws.onmessage = (e) => {
      try {
        const mapped = mapWsPayload(JSON.parse(e.data) as HelmetWsPayload);
        if (mapped) setData(mapped);
      } catch { /* ignore */ }
    };
    ws.onerror = () => ws.close();

    return () => ws.close();
  }, [helmetId]);

  return data;
}
