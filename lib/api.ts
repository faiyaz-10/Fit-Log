const BASE = 'https://api.api-store.workers.dev/api/fitlog';

export type Workout = {
  id: string; title: string; description: string; image: string; categories: string[];
  equipment: string; difficulty: string; sets: string | number; reps: string | number;
  duration: number; calories: number; rating: number; instructions: string[];
};

type ApiRecord = Record<string, unknown>;

// Tolerant normaliser: works even if field names differ slightly.
export function norm(w: ApiRecord): Workout {
  let cats: unknown = w.muscleGroups ?? w.categories ?? w.tags ?? w.category ?? w.muscles ?? [];
  if (!Array.isArray(cats)) cats = String(cats).split(',');
  let steps: unknown = w.instructions ?? w.steps ?? [];
  if (!Array.isArray(steps)) steps = String(steps).split(/\n|\./).filter(Boolean);
  return {
    id: String(w.id ?? w._id),
    title: String(w.title ?? w.name ?? 'Workout'),
    description: String(w.description ?? w.subtitle ?? ''),
    image: String(w.image ?? w.thumbnail ?? w.img ?? w.imageUrl ?? ''),
    categories: (cats as unknown[]).map((c) => String(c).trim()).filter(Boolean),
    equipment: Array.isArray(w.equipment)
      ? w.equipment.join(', ')
      : String(w.equipment ?? ''),
    difficulty: String(w.difficulty ?? w.level ?? ''),
    sets: typeof w.sets === 'number' || typeof w.sets === 'string' ? w.sets : '',
    reps: typeof w.reps === 'number' || typeof w.reps === 'string' ? w.reps : '',
    duration: parseFloat(String(w.duration ?? w.minutes ?? 0)) || 0,
    calories: parseFloat(String(w.caloriesBurned ?? w.calories ?? w.kcal ?? 0)) || 0,
    rating: parseFloat(String(w.rating ?? 0)) || 0,
    instructions: steps as string[],
  };
}
const asRecord = (value: unknown): ApiRecord =>
  typeof value === 'object' && value !== null ? (value as ApiRecord) : {};
const list = (j: unknown): ApiRecord[] => {
  if (Array.isArray(j)) return j.map(asRecord);
  const record = asRecord(j);
  const values = record.data ?? record.workouts ?? record.items ?? [];
  return Array.isArray(values) ? values.map(asRecord) : [];
};
export async function getAll(): Promise<Workout[]> {
  const r = await fetch(BASE);
  if (!r.ok) throw new Error('Failed to load');
  return list(await r.json()).map(norm);
}
export async function getOne(id: string): Promise<Workout> {
  const r = await fetch(`${BASE}/${id}`);
  if (!r.ok) throw new Error('Not found');
  const j = await r.json();
  const record = asRecord(j);
  return norm(asRecord(record.data ?? record.workout ?? record));
}
