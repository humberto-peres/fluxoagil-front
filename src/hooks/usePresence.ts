import { useEffect, useRef, useState } from 'react';

export type Presence = 'online' | 'idle' | 'away';

type UsePresenceOpts = {
    idleMs?: number;
    awayMs?: number;
};

export function usePresence(opts: UsePresenceOpts = {}) {
    const idleMs = opts.idleMs ?? 60_000;
    const awayMs = opts.awayMs ?? 5 * 60_000;

    const lastActiveRef = useRef<number>(Date.now());
    const [presence, setPresence] = useState<Presence>('online');
    const [lastActiveAt, setLastActiveAt] = useState<number>(Date.now());

    useEffect(() => {
        const onActivity = () => {
            lastActiveRef.current = Date.now();
            setLastActiveAt(lastActiveRef.current);
            setPresence('online');
        };

        const events: (keyof WindowEventMap)[] = [
            'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'
        ];
        events.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

        const onVis = () => {
            if (document.hidden) {
                setPresence('idle');
            } else {
                onActivity();
            }
        };
        document.addEventListener('visibilitychange', onVis);

        const iv = window.setInterval(() => {
            const diff = Date.now() - lastActiveRef.current;
            let newPresence: Presence;
            if (diff >= awayMs) {
                newPresence = 'away';
            } else if (diff >= idleMs) {
                newPresence = 'idle';
            } else {
                newPresence = 'online';
            }
            setPresence(newPresence);
        }, 1000);

        return () => {
            events.forEach((ev) => window.removeEventListener(ev, onActivity));
            document.removeEventListener('visibilitychange', onVis);
            window.clearInterval(iv);
        };
    }, [idleMs, awayMs]);

    return { presence, lastActiveAt };
}

export function formatAgo(ts: number) {
    const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return `${h}h`;
}
