import { emptyProgress, parseProgress, parseExport, STORAGE_KEY, type Progress } from './model.ts';

type User = { id: string; label: string };
type Remote = { user: User; state: Progress; revision: number };
type Cache = { state: Progress; revision: number; dirty: boolean };
export type SyncView = {
  state: Progress; user: User | null; ready: boolean; message: string;
  pending: boolean; conflict: Remote | null; guest: Progress | null; blocked: boolean;
};
const initial = (): SyncView => ({ state: emptyProgress(), user: null, ready: false, message: 'Loading your progress…', pending: false, conflict: null, guest: null, blocked: false });

export class ProgressSync {
  view = initial();
  revision = 0;
  private dirty = false;
  private saving = false;
  private stopped = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private cacheBroken = false;
  private storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  private transport: typeof fetch;
  private notify: (view: SyncView) => void;
  constructor(storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>, transport: typeof fetch, notify: (view: SyncView) => void) { this.storage = storage; this.transport = transport; this.notify = notify; }
  private emit(patch: Partial<SyncView> = {}) { this.view = { ...this.view, ...patch }; if (!this.stopped) this.notify(this.view); }
  private key() { return this.view.user ? `${STORAGE_KEY}:account:${this.view.user.id}` : STORAGE_KEY; }
  private persist() {
    if (this.cacheBroken) return false;
    try {
      const value = this.view.user ? { state: this.view.state, revision: this.revision, dirty: this.dirty } : this.view.state;
      this.storage.setItem(this.key(), JSON.stringify(value)); return true;
    } catch { return false; }
  }
  async start() {
    try {
      const response = await this.transport('/api/learn/progress', { cache: 'no-store' });
      if (this.stopped) return;
      if (response.status === 401) {
        try { const raw = this.storage.getItem(STORAGE_KEY); this.emit({ state: raw ? parseExport(raw) : emptyProgress(), ready: true, message: 'Saved on this device. Sign in to continue on another device.' }); }
        catch { this.cacheBroken = true; this.emit({ ready: true, blocked: true, message: 'Existing browser progress could not be read and has been preserved. Export or recover it before starting again.' }); }
        return;
      }
      if (!response.ok) throw new Error();
      const remote: Remote = await response.json(); remote.state = parseProgress(remote.state);
      if (!remote.user?.id || !Number.isSafeInteger(remote.revision)) throw new Error();
      if (this.stopped) return;
      this.revision = remote.revision;
      this.emit({ user: remote.user, state: remote.state });
      let cache: Cache | null = null;
      let raw: string | null = null;
      let guestRaw: string | null = null;
      try { raw = this.storage.getItem(this.key()); guestRaw = this.storage.getItem(STORAGE_KEY); }
      catch { this.cacheBroken = true; }
      try {
        if (raw) { cache = JSON.parse(raw); if (!cache || !Number.isSafeInteger(cache.revision) || typeof cache.dirty !== 'boolean') throw new Error(); cache.state = parseProgress(cache.state); }
        const guest = guestRaw;
        if (guest) { try { const state = parseExport(guest); if (state.profile) this.emit({ guest: state }); } catch { /* Keep the original guest data intact. */ } }
      } catch {
        this.cacheBroken = true;
        this.emit({ ready: true, blocked: true, message: 'A draft on this device could not be read. It was preserved; account progress is shown. Recover the draft before editing.' }); return;
      }
      if (cache?.dirty) {
        this.dirty = true;
        this.emit({ state: cache.state, ready: true, pending: true });
        if (cache.revision !== remote.revision) this.emit({ conflict: remote, message: 'A draft on this device differs from your account. Choose which to keep.' });
        else { this.emit({ message: 'Recovering your unsaved draft…' }); await this.flush(); }
      } else {
        this.emit({ ready: true, message: this.cacheBroken ? 'Progress loaded from your account. Device backup is unavailable; wait for saves before closing.' : 'Progress loaded from your account.' }); this.persist();
      }
    } catch { this.emit({ ready: false, message: 'Could not load account progress. Reconnect and retry; existing drafts have not been overwritten.' }); }
  }
  update(state: Progress) {
    if (!this.view.ready || this.view.blocked || this.view.conflict) return;
    this.dirty = !!this.view.user;
    this.emit({ state, pending: this.dirty });
    const cached = this.persist();
    this.emit({ message: this.view.user ? (cached ? 'Saving to your account…' : 'Saving… Device backup is unavailable; keep this tab open until saved.') : (cached ? 'Saved on this device. Sign in for cross-device progress.' : 'Device storage is unavailable. Export before closing.') });
    if (this.view.user) { clearTimeout(this.timer); this.timer = setTimeout(() => void this.flush(), 600); }
  }
  async flush() {
    if (this.saving || !this.dirty || !this.view.user || this.view.conflict || this.view.blocked || this.stopped) return;
    this.saving = true;
    const sent = this.view.state;
    try {
      const response = await this.transport('/api/learn/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: sent, revision: this.revision, userId: this.view.user.id }) });
      if (this.stopped) return;
      if (response.status === 401) { this.emit({ blocked: true, message: 'Your sign-in expired. Your draft is on this device. Sign in again to save it.' }); return; }
      if (response.status === 409) {
        const detail = await response.json();
        if (detail && typeof detail === 'object' && 'accountChanged' in detail && detail.accountChanged) { this.emit({ blocked: true, message: 'Your signed-in account changed. Reload to protect both accounts; your draft is preserved.' }); return; }
        const latest = await this.transport('/api/learn/progress', { cache: 'no-store' });
        if (!latest.ok) throw new Error();
        const remote: Remote = await latest.json(); remote.state = parseProgress(remote.state);
        if (remote.user.id !== this.view.user.id) { this.emit({ blocked: true, message: 'Your account changed. Reload before editing.' }); return; }
        this.emit({ conflict: remote, message: 'Another tab or device saved newer progress. Choose which version to keep.' }); return;
      }
      if (!response.ok) throw new Error();
      const result = await response.json();
      if (!result || typeof result !== 'object' || !('revision' in result) || result.revision !== this.revision + 1) throw new Error();
      this.revision = result.revision; this.dirty = this.view.state !== sent;
      this.persist(); this.emit({ pending: this.dirty, message: this.dirty ? 'Saving your latest changes…' : 'Saved to your account. You can continue on another device.' });
    } catch { this.emit({ pending: true, message: 'Not saved to your account yet. Your draft stays on this device when storage is available. Reconnect and retry, or export a backup.' }); }
    finally {
      this.saving = false;
      // New edits during a successful request must not be dropped. Errors need an explicit/online retry.
      if (this.dirty && this.view.state !== sent && !this.view.conflict && !this.view.blocked && !this.stopped) void this.flush();
    }
  }
  resolve(useDraft: boolean) {
    const remote = this.view.conflict; if (!remote) return;
    this.revision = remote.revision;
    this.dirty = useDraft;
    this.emit({ state: useDraft ? this.view.state : remote.state, conflict: null, pending: useDraft, message: useDraft ? 'Saving your chosen draft…' : 'Using your account progress.' });
    this.persist(); if (useDraft) void this.flush();
  }
  importGuest() { if (!this.view.guest) return; this.update(this.view.guest); this.emit({ guest: null }); }
  dismissGuest() { this.emit({ guest: null }); }
  stop() { this.stopped = true; clearTimeout(this.timer); }
}
