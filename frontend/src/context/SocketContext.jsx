import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!token) return;
    socketRef.current = io('https://pashusewa-2.onrender.com', {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => setConnected(true));
    socketRef.current.on('disconnect', () => setConnected(false));
    socketRef.current.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    socketRef.current.on('broadcast_announcement', (ann) => {
      setAnnouncements(prev => [ann, ...prev]);
    });

    return () => { socketRef.current?.disconnect(); };
  }, [token]);

  const joinRoom = useCallback((roomId) => {
    socketRef.current?.emit('join_chat_room', { roomId });
  }, []);

  const sendMessage = useCallback((roomId, message) => {
    socketRef.current?.emit('send_message', { roomId, message });
  }, []);

  const emitEvent = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  const onEvent = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  return (
    <SocketContext.Provider value={{ connected, messages, announcements, joinRoom, sendMessage, emitEvent, onEvent, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
