'use client';

import type { ReactNode, RefObject } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { AgentType, Skill } from '@/types';
import { DEFAULT_AGENT } from '@/types';

interface KeyboardContextValue {
  selectedIndex: number;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  selectedAgent: AgentType;
  setSelectedAgent: (agent: AgentType) => void;
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  registerSearchRef: (ref: HTMLInputElement | null) => void;
  onCopy: (() => void) | null;
  setOnCopy: (fn: (() => void) | null) => void;
  onClear: (() => void) | null;
  setOnClear: (fn: (() => void) | null) => void;
}

const KeyboardContext = createContext<KeyboardContextValue | null>(null);

interface KeyboardHandlerProps {
  children: ReactNode;
}

export function KeyboardHandler({ children }: KeyboardHandlerProps): ReactNode {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>(DEFAULT_AGENT);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [onCopy, setOnCopy] = useState<(() => void) | null>(null);
  const [onClear, setOnClear] = useState<(() => void) | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const registerSearchRef = useCallback((ref: HTMLInputElement | null) => {
    searchRef.current = ref;
  }, []);

  const value = useMemo<KeyboardContextValue>(
    () => ({
      selectedIndex,
      setSelectedIndex,
      selectedAgent,
      setSelectedAgent,
      skills,
      setSkills,
      searchRef,
      registerSearchRef,
      onCopy,
      setOnCopy,
      onClear,
      setOnClear,
    }),
    [selectedIndex, selectedAgent, skills, onCopy, onClear, registerSearchRef],
  );

  return <KeyboardContext.Provider value={value}>{children}</KeyboardContext.Provider>;
}

export function useKeyboardContext(): KeyboardContextValue {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error('useKeyboardContext must be used within a KeyboardHandler');
  }
  return context;
}
