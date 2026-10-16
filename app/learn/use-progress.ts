'use client';
import { useEffect, useRef, useState } from 'react';
import { ProgressSync, type SyncView } from './progress-sync';
import { emptyProgress, type Progress } from './model';

export function useProgress() {
  const [view, setView] = useState<SyncView>({ state: emptyProgress(), user: null, ready: false, message: 'Loading your progress…', pending: false, conflict: null, guest: null, blocked: false });
  const engine = useRef<ProgressSync | null>(null);
  useEffect(() => {
    // Access storage through methods so browsers denying localStorage can still use account saves.
    const storage = { getItem: (key: string) => window.localStorage.getItem(key), setItem: (key: string, value: string) => window.localStorage.setItem(key, value), removeItem: (key: string) => window.localStorage.removeItem(key) };
    const sync = new ProgressSync(storage, (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(15000) }), setView); engine.current = sync;
    void sync.start();
    const retry = () => { if (sync.view.ready) void sync.flush(); else void sync.start(); };
    const leaving = (event: BeforeUnloadEvent) => { if (sync.view.pending) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('online', retry); window.addEventListener('beforeunload', leaving);
    return () => { sync.stop(); window.removeEventListener('online', retry); window.removeEventListener('beforeunload', leaving); };
  }, []);
  return { ...view, update: (state: Progress) => engine.current?.update(state), retry: () => view.ready ? engine.current?.flush() : engine.current?.start(), resolve: (draft: boolean) => engine.current?.resolve(draft), importGuest: () => engine.current?.importGuest(), dismissGuest: () => engine.current?.dismissGuest() };
}
