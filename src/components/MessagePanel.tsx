import React, {
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
  KeyboardEvent,
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

  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState<number[]>([]);
  const [activeMatchIndex, setActiveMatchIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Recherche des occurrences dans le texte visible
  useEffect(() => {
    if (!search) {
      setMatches([]);
      setActiveMatchIndex(0);
      return;
    }

    const newMatches: number[] = [];
    filteredMessages.forEach((msg, i) => {
      if (msg.text.toLowerCase().includes(search.toLowerCase())) {
        newMatches.push(i);
      }
    });

    setMatches(newMatches);
    setActiveMatchIndex(0);
  }, [search, filteredMessages]);

  // Scroll vers l’occurrence active
  useEffect(() => {
    const activeIndex = matches[activeMatchIndex];
    if (activeIndex === undefined) return;
    const target = messageRefs.current[activeIndex];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeMatchIndex, matches]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'F3') {
      e.preventDefault();
      if (e.shiftKey) {
        setActiveMatchIndex((prev) =>
          prev <= 0 ? matches.length - 1 : prev - 1
        );
      } else {
        setActiveMatchIndex((prev) =>
          prev >= matches.length - 1 ? 0 : prev + 1
        );
      }
    }
  };

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

        <input
          ref={inputRef}
          type="text"
          placeholder="Search logs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            marginLeft: 'auto',
            padding: '2px 6px',
            border: '1px solid #aaa',
            borderRadius: '4px',
            fontSize: '0.9em',
          }}
        />
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
        {filteredMessages.map((msg, i) => {
          const isMatch = matches.includes(i);
          const isActive = matches[activeMatchIndex] === i;

          return (
            <div
              key={msg.id}
              ref={(el) => (messageRefs.current[i] = el)}
              className={`message ${msg.type || 'info'}`}
              style={{
                color: messageTypeColors[msg.type ?? 'info'],
                marginBottom: '6px',
                fontSize: '0.9em',
                lineHeight: '1.4',
                backgroundColor: isActive
                  ? '#fff5c4'
                  : isMatch
                  ? '#eeeeee'
                  : 'transparent',
                padding: '2px 4px',
                borderRadius: isActive ? '4px' : undefined,
              }}
            >
              {msg.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
