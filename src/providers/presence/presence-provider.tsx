import { ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PresenceContext } from './presence-context';

export function PresenceProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const listenersRef = useRef<Set<(data: any) => void>>(new Set());

    const addMessageListener = useCallback((handler: (data: any) => void) => {
        listenersRef.current.add(handler);
        return () => {
            listenersRef.current.delete(handler);
        };
    }, []);

    const connect = useCallback(() => {
        if (!user) return;

        // Cleanup existing socket
        if (socketRef.current) {
            socketRef.current.close();
        }

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Use the API base URL if provided, otherwise default to the "api" subdomain
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const host = apiBaseUrl 
            ? apiBaseUrl.replace(/^http/, 'ws') 
            : `${protocol}//api.${window.location.hostname.replace(/^dashboard\./, '')}`;
        
        const wsUrl = `${host}/api/v1/ws`;

        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('Connected to presence server');
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WS Message Received:', data);
                
                // Handle new standard envelope { type: string, payload: any }
                if (data.type && data.payload) {
                    const { type, payload } = data;
                    console.log('Handling standard event:', type, payload);

                    if (type === 'PRESENCE') {
                        if (payload.type === 'SYNC') {
                            setOnlineUsers(new Set(payload.user_ids));
                        } else if (payload.type === 'JOIN') {
                            setOnlineUsers((prev) => {
                                const next = new Set(prev);
                                next.add(payload.user_id);
                                return next;
                            });
                        } else if (payload.type === 'LEAVE') {
                            setOnlineUsers((prev) => {
                                const next = new Set(prev);
                                next.delete(payload.user_id);
                                return next;
                            });
                        }
                    }
                    
                    // Broadcast the full standard event to all local listeners
                    listenersRef.current.forEach((handler) => handler(data));
                } else {
                    console.log('Handling fallback/legacy event');
                    if (data.type === 'SYNC') {
                        setOnlineUsers(new Set(data.user_ids));
                    } else if (data.type === 'JOIN') {
                        setOnlineUsers((prev) => {
                            const next = new Set(prev);
                            next.add(data.user_id);
                            return next;
                        });
                    } else if (data.type === 'LEAVE') {
                        setOnlineUsers((prev) => {
                            const next = new Set(prev);
                            next.delete(data.user_id);
                            return next;
                        });
                    }
                    listenersRef.current.forEach((handler) => handler(data));
                }
            } catch (err) {
                console.error('Failed to parse websocket message', err);
            }
        };

        ws.onclose = () => {
            console.log('Disconnected from presence server');
            socketRef.current = null;
            // Reconnect after 3 seconds
            if (user && !reconnectTimeoutRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnectTimeoutRef.current = null;
                    connect();
                }, 3000);
            }
        };

        ws.onerror = (err) => {
            console.error('Presence WebSocket error', err);
            ws.close();
        };
    }, [user]);

    useEffect(() => {
        if (user) {
            connect();
        } else {
            if (socketRef.current) {
                socketRef.current.close();
            }
            setOnlineUsers(new Set());
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [user, connect]);

    const isOnline = useCallback((userId: string) => {
        return onlineUsers.has(userId);
    }, [onlineUsers]);

    return (
        <PresenceContext.Provider value={{ onlineUsers, isOnline, addMessageListener }}>
            {children}
        </PresenceContext.Provider>
    );
}
