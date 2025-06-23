import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  MessageContext,
  messageTypeColors,
  allMessageTypes,
  MessageType,
} from '../contexts/MessageContext';

export function MessagePanel() {
  const context = useContext(MessageContext);
  if (!context) return null;

  const { messages } = context;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const [visibleTypes, setVisibleTypes] = useState<Record<MessageType, boolean>>(
    () =>
      Object.fromEntries(allMessageTypes.map((t) => [t, true])) as Record<MessageType, boolean>
  );

  const toggleType = (type: MessageType) => {
    setVisibleTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    setAutoScroll(nearBottom);
  }, []);

  useEffect(() => {
    if (!autoScroll) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, autoScroll]);

  const filteredMessages = messages.filter((msg) =>
    visibleTypes[(msg.type ?? 'info') as MessageType]
  );

  return (
    <div
      className="message-wrapper"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '300px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#e6e6e6',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div
        className="message-filters"
        style={{
          background: 'linear-gradient(to bottom, #eaeaea 0%, #d0d0d0 100%)',
          padding: '6px 10px',
          borderBottom: '1px solid #b0b0b0',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          fontSize: '0.85em',
          color: '#333',
          boxShadow: 'inset 0 1px 0 #ffffff80',
        }}
      >
        {allMessageTypes.map((type) => (
          <label key={type} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={visibleTypes[type]}
              onChange={() => toggleType(type)}
              style={{
                marginRight: '4px',
                accentColor: messageTypeColors[type],
              }}
            />
            {type}
          </label>
        ))}
      </div>

      <div
        className="message-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px',
          backgroundColor: '#fafafa',
          color: '#222',
        }}
      >
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.type || 'info'}`}
            style={{
              color: messageTypeColors[msg.type ?? 'info'],
              marginBottom: '6px',
              fontSize: '0.9em',
              lineHeight: '1.4',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}
