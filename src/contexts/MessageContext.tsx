// src/contexts/MessageContext.tsx

import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

export type MessageType = 'info' | 'error' | 'success' | 'warning';

export type GameMessage = {
  id: number;
  text: string;
  type?: MessageType;
};

type MessageContextType = {
  messages: GameMessage[];
  addMessage: (msg: Omit<GameMessage, 'id'>) => void;
  clearMessages: () => void;
};

export const MessageContext = createContext<MessageContextType | undefined>(
  undefined
);

// --- Global message bus refs ---
let _addMessage: ((msg: Omit<GameMessage, 'id'>) => void) | null = null;
let _clearMessages: (() => void) | null = null;

// --- Exposed global API ---
export const MessageBus = {
  send(msg: Omit<GameMessage, 'id'>) {
    if (_addMessage) {
      _addMessage(msg);
    } else {
      console.warn('MessageBus.send: context not ready', msg);
    }
  },

  clear() {
    if (_clearMessages) {
      _clearMessages();
    } else {
      console.warn('MessageBus.clear: context not ready');
    }
  },
};

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const nextId = useRef(1);

  const addMessage = (msg: Omit<GameMessage, 'id'>) => {
    setMessages((prev) => [...prev, { ...msg, id: nextId.current++ }]);
  };

  const clearMessages = () => setMessages([]);

  useEffect(() => {
    _addMessage = addMessage;
    _clearMessages = clearMessages;
  }, []);

  return (
    <MessageContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
}
