import { emptyProgress, parseProgress } from './model.ts';

const MAX_BYTES = 250_000;
function json(value: unknown, status = 200) {
  return Response.json(value, { status, headers: { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie', 'X-Content-Type-Options': 'nosniff' } });
}

// Sites dispatch strips caller identity headers and injects verified identity.
// This Worker must only be deployed behind that boundary, never on a public workers.dev route.
export async function progressApi(request: Request, db?: D1Database): Promise<Response> {
  const userId = request.headers.get('oai-authenticated-user-id');
  const email = request.headers.get('oai-authenticated-user-email');
  if (!userId || !email) return json({ error: 'Sign in to save your progress.' }, 401);
  const user = { id: userId, label: email };
  if (!['GET', 'PUT', 'DELETE'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
  if (!db) return json({ error: 'Saved progress is temporarily unavailable.' }, 503);
  try {
    if (request.method === 'GET') {
      const row = await db.prepare('SELECT data, revision FROM learner_progress WHERE user_id = ?').bind(userId).first<{ data: string; revision: number }>();
      return json({ user, revision: row?.revision ?? 0, state: row ? parseProgress(JSON.parse(row.data)) : emptyProgress() });
    }
    if (request.headers.get('origin') !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'Use this site to save progress.' }, 403);
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return json({ error: 'Expected JSON.' }, 415);
    // Bound the stream before decoding, including chunked bodies with no Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return json({ error: 'Missing progress.' }, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); return json({ error: 'Progress is too large.' }, 413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    let body;
    try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({ error: 'Invalid JSON.' }, 400); }
    if (!body || body.userId !== userId) return json({ error: 'Your signed-in account changed. Reload before saving.', accountChanged: true }, 409);
    if (!Number.isSafeInteger(body.revision) || body.revision < 0 || body.revision >= Number.MAX_SAFE_INTEGER) return json({ error: 'Invalid revision.' }, 400);
    let state;
    try { state = request.method === 'DELETE' ? emptyProgress() : parseProgress(body.state); } catch { return json({ error: 'Invalid progress. Your saved work was not changed.' }, 400); }
    const revision = body.revision + 1;
    const data = JSON.stringify(state); const now = new Date().toISOString();
    const result = body.revision === 0
      ? await db.prepare('INSERT INTO learner_progress (user_id, data, revision, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO NOTHING').bind(userId, data, revision, now).run()
      : await db.prepare('UPDATE learner_progress SET data = ?, revision = ?, updated_at = ? WHERE user_id = ? AND revision = ?').bind(data, revision, now, userId, body.revision).run();
    if (!result.meta.changes) return json({ error: 'Progress changed on another device. Choose which version to keep.' }, 409);
    return json({ revision });
  } catch {
    // Never expose stored learner content, SQL, or provider error details.
    return json({ error: 'Saved progress is temporarily unavailable. Your draft is still on this device.' }, 503);
  }
}
