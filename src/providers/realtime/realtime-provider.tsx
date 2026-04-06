import { ReactNode, useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { RealtimeContext } from './realtime-context';

const WS_RECONNECT_DELAY = 3000;

function buildWsUrl(): string {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    if (apiBaseUrl) {
        return `${apiBaseUrl.replace(/^http/, 'ws')}/api/v1/ws`;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname.replace(/^dashboard\./, '');
    return `${protocol}//api.${host}/api/v1/ws`;
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    // Refs so callbacks never go stale without triggering re-renders
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const listenersRef = useRef<Set<(data: unknown) => void>>(new Set());
    const userRef = useRef(user);

    useEffect(() => {
        userRef.current = user;
    }, [user]);

    // ─── event bus ────────────────────────────────────────────────────────────
    const addMessageListener = useCallback((handler: (data: unknown) => void) => {
        listenersRef.current.add(handler);
        return () => listenersRef.current.delete(handler);
    }, []);

    // ─── presence helpers ─────────────────────────────────────────────────────
    const handlePresencePayload = useCallback((payload: Record<string, unknown>) => {
        if (payload.type === 'SYNC') {
            setOnlineUsers(new Set(payload.user_ids as string[]));
        } else if (payload.type === 'JOIN') {
            setOnlineUsers(prev => new Set([...prev, payload.user_id as string]));
        } else if (payload.type === 'LEAVE') {
            setOnlineUsers(prev => {
                const next = new Set(prev);
                next.delete(payload.user_id as string);
                return next;
            });
        }
    }, []);

    // ─── connect ──────────────────────────────────────────────────────────────
    const connect = useCallback(() => {
        // Close any existing socket first
        socketRef.current?.close();

        const ws = new WebSocket(buildWsUrl());
        socketRef.current = ws;

        ws.onopen = () => {
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            let data: unknown;
            try {
                data = JSON.parse(event.data as string);
            } catch {
                return;
            }

            const envelope = data as Record<string, unknown>;

            if (envelope.type === 'PRESENCE' && envelope.payload) {
                handlePresencePayload(envelope.payload as Record<string, unknown>);
            }

            // Broadcast every event to all listeners (chat, notifications, etc.)
            listenersRef.current.forEach(h => h(data));
        };

        ws.onclose = () => {
            socketRef.current = null;
            // Only reconnect if user is still authenticated
            if (userRef.current && !reconnectTimerRef.current) {
                reconnectTimerRef.current = setTimeout(() => {
                    reconnectTimerRef.current = null;
                    if (userRef.current) connect();
                }, WS_RECONNECT_DELAY);
            }
        };

        ws.onerror = () => ws.close();
    }, [handlePresencePayload]);
    // connect is stable: handlePresencePayload is stable (no deps), so this
    // function reference never changes after mount.

    // ─── lifecycle ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!user) {
            socketRef.current?.close();
            setOnlineUsers(new Set());
            return;
        }

        connect();

        return () => {
            socketRef.current?.close();
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]); // reconnect only when the logged-in user changes, not on every render

    const isOnline = useCallback((userId: string) => onlineUsers.has(userId), [onlineUsers]);

    return (
        <RealtimeContext.Provider value={{ onlineUsers, isOnline, addMessageListener }}>
            {children}
        </RealtimeContext.Provider>
    );
}