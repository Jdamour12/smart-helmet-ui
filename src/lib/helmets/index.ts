import { http } from '@/lib/http';
import type { Helmet, SensorReading } from '@/lib/types';

export function mapHelmet(raw: any, latest?: any): Helmet {
  const reading = latest ?? raw.latest_reading;
  return {
    id: raw.id,
    helmet_code: raw.helmet_code ?? '',
    worker_id: raw.worker_id ?? '',
    worker_name: raw.worker_name ?? raw.worker?.full_name ?? raw.worker?.name ?? raw.helmet_code ?? 'Unassigned',
    zone: raw.zone,
    status: raw.status === 'active' ? 'active'
      : raw.status === 'critical' || raw.status === 'warning' ? 'alarm'
      : 'inactive',
    co: reading?.co_ppm ?? raw.co ?? 0,
    ch4: reading?.ch4_percent ?? raw.ch4 ?? 0,
    temperature: reading?.temperature ?? raw.temperature ?? 0,
    humidity: reading?.humidity ?? raw.humidity ?? 0,
    helmet_wear: reading?.helmet_worn ?? raw.helmet_wear ?? false,
    impact_detected: reading?.vibration_detected ?? raw.impact_detected ?? false,
    battery: reading?.battery_level ?? raw.battery ?? 0,
    signal_strength: reading?.signal_strength ?? raw.signal_strength ?? 0,
    last_update: reading?.recorded_at ?? raw.last_update ?? raw.last_seen ?? raw.updated_at ?? '',
    step_count: reading?.step_count ?? raw.step_count,
    heading_deg: reading?.heading_deg ?? raw.heading_deg,
    est_zone: reading?.est_zone ?? raw.est_zone,
    ai_prediction: reading?.ai_prediction ?? raw.ai_prediction,
    ai_confidence: reading?.ai_confidence ?? raw.ai_confidence,
    ai_danger_votes: reading?.ai_danger_votes ?? raw.ai_danger_votes,
    ai_model_votes: reading?.ai_model_votes ? {
      isolation_forest: reading.ai_model_votes.isolation_forest ?? reading.ai_model_votes?.isolationForest ?? raw.ai_if_vote ?? raw.ai_if_vote ?? undefined,
      random_forest: reading.ai_model_votes.random_forest ?? reading.ai_model_votes?.randomForest ?? raw.ai_rf_vote ?? undefined,
      lstm: reading.ai_model_votes.lstm ?? reading.ai_model_votes?.lstm ?? raw.ai_lstm_vote ?? undefined,
      svm: reading.ai_model_votes.svm ?? reading.ai_model_votes?.svm ?? raw.ai_svm_vote ?? undefined,
    } : {
      isolation_forest: raw.ai_if_vote ?? raw.ai_if_vote ?? undefined,
      random_forest: raw.ai_rf_vote ?? undefined,
      lstm: raw.ai_lstm_vote ?? undefined,
      svm: raw.ai_svm_vote ?? undefined,
    },
  };
}

function mergeLatestReading(helmet: Helmet, latest: any): Helmet {
  if (!latest) return helmet;
  return {
    ...helmet,
    co: latest.co_ppm ?? helmet.co,
    ch4: latest.ch4_percent ?? helmet.ch4,
    temperature: latest.temperature ?? helmet.temperature,
    humidity: latest.humidity ?? helmet.humidity,
    helmet_wear: latest.helmet_worn ?? helmet.helmet_wear,
    impact_detected: latest.vibration_detected ?? helmet.impact_detected,
    battery: latest.battery_level ?? helmet.battery,
    signal_strength: latest.signal_strength ?? helmet.signal_strength,
    last_update: latest.recorded_at ?? helmet.last_update,
    step_count: latest.step_count ?? latest.step_count ?? helmet.step_count,
    heading_deg: latest.heading_deg ?? latest.heading_deg ?? helmet.heading_deg,
    est_zone: latest.est_zone ?? latest.est_zone ?? helmet.est_zone,
    ai_prediction: latest.ai_prediction ?? helmet.ai_prediction,
    ai_confidence: latest.ai_confidence ?? helmet.ai_confidence,
    ai_danger_votes: latest.ai_danger_votes ?? helmet.ai_danger_votes,
    ai_model_votes: latest.ai_model_votes ? {
      isolation_forest: latest.ai_model_votes.isolation_forest ?? latest.ai_model_votes?.isolationForest ?? latest.ai_if_vote ?? undefined,
      random_forest: latest.ai_model_votes.random_forest ?? latest.ai_model_votes?.randomForest ?? latest.ai_rf_vote ?? undefined,
      lstm: latest.ai_model_votes.lstm ?? latest.ai_model_votes?.lstm ?? latest.ai_lstm_vote ?? undefined,
      svm: latest.ai_model_votes.svm ?? latest.ai_model_votes?.svm ?? latest.ai_svm_vote ?? undefined,
    } : helmet.ai_model_votes,
  };
}

export async function list(params?: Record<string, string>): Promise<Helmet[]> {
  const q = params ? '?' + new URLSearchParams(params) : '';
  const raw = await http<any>(`/helmets${q}`);
  if (!raw) return [];
  const arr = Array.isArray(raw) ? raw : (raw.results ?? raw.data ?? raw.helmets ?? []);
  return arr.map((h: any) => mapHelmet(h));
}

export async function listWithReadings(params?: Record<string, string>): Promise<Helmet[]> {
  try {
    const helmets = await list(params);
    if (helmets && helmets.length) {
      const readings = await Promise.all(
        helmets.map((h) => http<any[]>(`/helmets/${h.id}/sensor-data?limit=1`).catch(() => [])),
      );
      return helmets.map((h, i) => mergeLatestReading(h, readings[i]?.[0]));
    }
  } catch (e) {
    // continue to fallback below
  }

  // Fallback: if /helmets list is unavailable, use alerts to discover active helmet ids
  try {
    const alerts = await http<any[]>('/alerts/unresolved').catch(() => http<any[]>('/alerts/feed').catch(() => []));
    const helmetIds = Array.from(new Set(alerts.map((a: any) => a.helmet_id).filter(Boolean)));
    if (!helmetIds.length) return [];

    const helmetPromises = helmetIds.map((id: string) => http<any>(`/helmets/${id}`).catch(() => null));
    const helmetsRaw = await Promise.all(helmetPromises);
    const helmets = helmetsRaw.filter(Boolean).map((h) => mapHelmet(h));

    const readings = await Promise.all(
      helmets.map((h) => http<any[]>(`/helmets/${h.id}/sensor-data?limit=1`).catch(() => [])),
    );

    return helmets.map((h, i) => mergeLatestReading(h, readings[i]?.[0]));
  } catch (e) {
    // If everything fails, return empty list
    return [];
  }
}

export async function get(id: string): Promise<Helmet> {
  const raw = await http<any>(`/helmets/${id}`);
  return mapHelmet(raw);
}

export function create(data: Partial<Helmet> & { helmet_code?: string; worker_id?: string }) {
  return http<any>('/helmets', {
    method: 'POST',
    body: JSON.stringify({
      helmet_code: data.helmet_code ?? `HLM-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      zone: (data as any).zone ?? undefined,
      worker_id: data.worker_id || undefined,
    }),
  });
}

export function update(id: string, data: Partial<Helmet>) {
  const body: Record<string, unknown> = {};
  if (data.worker_id !== undefined) body.worker_id = data.worker_id || null;
  if (data.status !== undefined) {
    body.status = data.status === 'alarm' ? 'critical'
      : data.status === 'active' ? 'active'
      : 'inactive';
  }
  return http<any>(`/helmets/${id}`, { method: 'PATCH', body: JSON.stringify(body) });
}

export function remove(id: string) {
  return http(`/helmets/${id}`, { method: 'DELETE' });
}

export function sensorData(id: string) {
  return http<SensorReading[]>(`/helmets/${id}/sensor-data`);
}

export function pushReading(id: string, data: Partial<SensorReading>) {
  return http(`/helmets/${id}/readings`, { method: 'POST', body: JSON.stringify(data) });
}
