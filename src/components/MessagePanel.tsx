// src/components/MessagePanel.tsx
import React, { useContext, useEffect, useRef, useCallback, useState } from 'react';
import { MessageContext } from '../contexts/MessageContext';

export function MessagePanel() {
  const context = useContext(MessageContext);
  if (!context) return null;

  const { messages } = context;
  const panelRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Detect if user is scrolled near the bottom
  const handleScroll = useCallback(() => {
    const el = panelRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    setAutoScroll(nearBottom);
  }, []);

  // Scroll to bottom if auto-scroll is active
  useEffect(() => {
    if (!autoScroll) return;
    const el = panelRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, autoScroll]);

  return (
    <div
      className="message-panel"
      ref={panelRef}
      onScroll={handleScroll}
    >
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.type || 'info'}`}>
          {msg.text}
        </div>
      ))}
    </div>
  );
}
