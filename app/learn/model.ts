import catalog from './catalog.json' with { type: 'json' };

export { catalog };
export type Branch = keyof typeof catalog.branches;
export type Profile = { branch: Branch; goal: string; minutes: string; format: string; diagnostic: string };
export type Evidence = { status: 'attempted' | 'self-checked'; evidence: string; explanation: string; date: string };
export type Progress = { version: 2; catalogVersion: string; profile: Profile | null; progress: Record<string, Evidence> };
export const STORAGE_KEY = 'jtd-learning-pilot-v1'; // Reuses the pilot key when served on the same origin.
export const emptyProgress = (): Progress => ({ version: 2, catalogVersion: catalog.version, profile: null, progress: {} });
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

export function parseProgress(value: unknown): Progress {
  if (!object(value) || ![1, 2].includes(Number(value.version)) || !object(value.progress)) throw new Error('Unsupported progress format. Use a version 1 or 2 export.');
  let profile: Profile | null = null;
  if (value.profile !== null) {
    const p = value.profile;
    if (!object(p) || typeof p.branch !== 'string' || !Object.hasOwn(catalog.branches, p.branch) || typeof p.goal !== 'string' || !p.goal.trim() || p.goal.length > 500) throw new Error('Invalid project profile.');
    profile = { branch: p.branch as Branch, goal: p.goal.trim(), minutes: ['15', '30', '60'].includes(String(p.minutes)) ? String(p.minutes) : '30', format: ['text', 'video', 'try'].includes(String(p.format)) ? String(p.format) : 'text', diagnostic: p.diagnostic === 'evidence' ? 'evidence' : 'start' };
  }
  const progress: Record<string, Evidence> = {};
  for (const [id, item] of Object.entries(value.progress)) {
    // Refuse unknown lessons rather than silently dropping someone's saved work.
    if (!catalog.lessons.some(l => l.id === id)) throw new Error('This export contains a lesson this release cannot read. Keep the original export.');
    if (!object(item) || !['attempted', 'self-checked'].includes(String(item.status)) || typeof item.evidence !== 'string' || typeof item.explanation !== 'string' || item.evidence.length > 10000 || item.explanation.length > 10000) throw new Error('Invalid evidence record.');
    progress[id] = { status: item.status as Evidence['status'], evidence: item.evidence, explanation: item.explanation, date: typeof item.date === 'string' ? item.date : '' };
  }
  if (!profile && Object.keys(progress).length) throw new Error('Evidence needs a project profile.');
  return { version: 2, catalogVersion: typeof value.catalogVersion === 'string' ? value.catalogVersion : '2026-10-02', profile, progress };
}

export function parseExport(text: string): Progress {
  if (text.length > 1_000_000) throw new Error('Progress export must be under 1 MB.');
  return parseProgress(JSON.parse(text));
}

export function canCheck(lessonIndex: number, answer: number | null, evidence: string, explanation: string) {
  const lesson = catalog.lessons[lessonIndex];
  return !!lesson && answer === lesson.correct && evidence.trim().length >= 12 && explanation.trim().length >= 12;
}

export function project(profile: Profile) {
  return { ...catalog.branches[profile.branch], goal: profile.goal,
    session: profile.minutes === '15' ? 'Today: define and check one small specification. Save the build for the next session.' : 'Today: define the brief, make one small attempt, and inspect it.',
    delivery: profile.format === 'try' ? 'Attempt the task first. Use the resource when you find a gap.' : profile.format === 'video' ? 'Watch one relevant segment, pause, and apply it.' : 'Read the lesson summary first; the video is optional.',
    route: profile.diagnostic === 'evidence' ? 'Try the checks first. Skip explanations you can support with an artifact, and start at the first gap.' : 'Start with context, then the spec. You can revisit any lesson.' };
}

export function coachingPrompt(profile: Profile, lessonIndex: number, record?: Evidence) {
  const p = project(profile), lesson = catalog.lessons[lessonIndex];
  return `Coach me through a small AI-assisted project. Ask one or two questions at a time. Use interview → specify → verify → build → explain → transfer → preserve. Offer hints before taking over, but give an explanation when I ask.\n\nMy objective: ${profile.goal}\nProject starter: ${p.title}\nInputs: ${p.input}\nTime: ${profile.minutes} minutes. Starting preference: ${profile.format}.\nLesson: ${lesson.title}\nTask: ${lesson.task}\nChecks: ${p.checks.join(' ')}\n\nAsk what I understand and what confuses me. Adapt the starter to my actual goal. Have me predict a result, check it independently, and explain a changed example. Do not invent learning evidence or treat model agreement as proof. Use fictional data and keep this exercise in draft/dry-run mode. No sending, publishing, spending, installation, or scheduled actions are requested. Save a short learning record and one next practice step.\n\nMy evidence: ${record?.evidence || ''}\nMy explanation: ${record?.explanation || ''}`;
}
