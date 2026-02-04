import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentType, Skill } from '@/types';
import { useKeyboard } from './useKeyboard';

// Mock skill data for testing
const createMockSkill = (overrides: Partial<Skill> = {}): Skill => ({
  _id: 'test-id',
  slug: 'test-skill',
  name: 'Test Skill',
  org: 'test-org',
  repo: 'test-repo',
  description: 'A test skill',
  commands: {
    claudeCode: 'claude install test-skill',
    codexCli: 'codex install test-skill',
    cursor: 'cursor install test-skill',
  },
  tags: ['testing'],
  agents: ['claude-code', 'codex-cli', 'cursor'],
  installs: 100,
  stars: 50,
  lastUpdated: '2024-01-01T00:00:00Z',
  addedAt: '2024-01-01T00:00:00Z',
  repoUrl: 'https://github.com/test-org/test-repo',
  verified: true,
  ...overrides,
});

describe('useKeyboard', () => {
  let mockSearchRef: React.RefObject<HTMLInputElement | null>;
  let mockSetSelectedIndex: ReturnType<typeof vi.fn>;
  let mockOnCopy: ReturnType<typeof vi.fn>;
  let mockOnClear: ReturnType<typeof vi.fn>;
  let mockWindowOpen: ReturnType<typeof vi.fn>;
  let originalWindowLocation: Location;

  beforeEach(() => {
    mockSearchRef = { current: document.createElement('input') };
    mockSetSelectedIndex = vi.fn();
    mockOnCopy = vi.fn();
    mockOnClear = vi.fn();
    mockWindowOpen = vi.fn();

    // Mock window.open
    vi.stubGlobal('open', mockWindowOpen);

    // Save and mock window.location
    originalWindowLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    // Clear clipboard mock between tests
    vi.mocked(navigator.clipboard.writeText).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(window, 'location', {
      value: originalWindowLocation,
      writable: true,
    });
  });

  const createDefaultOptions = (overrides = {}) => ({
    skills: [createMockSkill()],
    selectedIndex: 0,
    setSelectedIndex: mockSetSelectedIndex as (index: number | ((prev: number) => number)) => void,
    selectedAgent: 'claude-code' as AgentType,
    searchRef: mockSearchRef,
    onCopy: mockOnCopy as () => void,
    onClear: mockOnClear as () => void,
    ...overrides,
  });

  const dispatchKeyDown = (key: string, options: Partial<KeyboardEventInit> = {}) => {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      ...options,
    });
    window.dispatchEvent(event);
  };

  describe('global shortcuts', () => {
    it('focuses search on "/" key press when not typing', () => {
      if (!mockSearchRef.current) {
        throw new Error('mockSearchRef.current is null');
      }
      const focusSpy = vi.spyOn(mockSearchRef.current, 'focus');
      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('/');
      });

      expect(focusSpy).toHaveBeenCalled();
    });

    it('blurs search and calls onClear on "Escape" key press', () => {
      if (!mockSearchRef.current) {
        throw new Error('mockSearchRef.current is null');
      }
      const blurSpy = vi.spyOn(mockSearchRef.current, 'blur');
      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('Escape');
      });

      expect(blurSpy).toHaveBeenCalled();
      expect(mockOnClear).toHaveBeenCalled();
    });
  });

  describe('shortcuts disabled when typing', () => {
    it('does not trigger "/" shortcut when typing in an input', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      if (!mockSearchRef.current) {
        throw new Error('mockSearchRef.current is null');
      }
      const focusSpy = vi.spyOn(mockSearchRef.current, 'focus');
      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('/');
      });

      expect(focusSpy).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it('does not trigger "c" shortcut when typing in a textarea', () => {
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      textarea.focus();

      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('c');
      });

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();

      document.body.removeChild(textarea);
    });

    // Note: Testing contentEditable focus in jsdom is not supported.
    // jsdom does not implement isContentEditable property or proper focus
    // tracking for contentEditable elements. The isTyping() function in the
    // hook checks for contentEditable, and the same code path is tested via
    // the input/textarea tests above which verify shortcuts are disabled
    // when isTyping() returns true.

    it('still allows "Escape" shortcut when typing', () => {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      if (!mockSearchRef.current) {
        throw new Error('mockSearchRef.current is null');
      }
      const blurSpy = vi.spyOn(mockSearchRef.current, 'blur');
      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('Escape');
      });

      expect(blurSpy).toHaveBeenCalled();
      expect(mockOnClear).toHaveBeenCalled();

      document.body.removeChild(input);
    });
  });

  describe('skill-context shortcuts', () => {
    it('copies install command on "c" key press', async () => {
      renderHook(() => useKeyboard(createDefaultOptions()));

      await act(async () => {
        dispatchKeyDown('c');
        // Allow the async clipboard operation to complete
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('claude install test-skill');
      expect(mockOnCopy).toHaveBeenCalled();
    });

    it('opens repo on "g" key press', () => {
      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('g');
      });

      expect(mockWindowOpen).toHaveBeenCalledWith(
        'https://github.com/test-org/test-repo',
        '_blank',
        'noopener,noreferrer',
      );
    });

    it('navigates to skill page on "Enter" key press', () => {
      renderHook(() => useKeyboard(createDefaultOptions()));

      act(() => {
        dispatchKeyDown('Enter');
      });

      expect(window.location.href).toBe('/skill/test-skill');
    });
  });

  describe('navigation shortcuts', () => {
    it('navigates up on "ArrowUp" key press', () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [createMockSkill(), createMockSkill({ slug: 'skill-2' })],
            selectedIndex: 1,
          }),
        ),
      );

      act(() => {
        dispatchKeyDown('ArrowUp');
      });

      expect(mockSetSelectedIndex).toHaveBeenCalled();
      // Call the function passed to setSelectedIndex with prev=1
      const updateFn = mockSetSelectedIndex.mock.calls[0]?.[0] as
        | ((prev: number) => number)
        | undefined;
      expect(updateFn?.(1)).toBe(0);
    });

    it('wraps to last item when navigating up from first item', () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [createMockSkill(), createMockSkill({ slug: 'skill-2' })],
            selectedIndex: 0,
          }),
        ),
      );

      act(() => {
        dispatchKeyDown('ArrowUp');
      });

      const updateFn = mockSetSelectedIndex.mock.calls[0]?.[0] as
        | ((prev: number) => number)
        | undefined;
      expect(updateFn?.(0)).toBe(1);
    });

    it('navigates down on "ArrowDown" key press', () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [createMockSkill(), createMockSkill({ slug: 'skill-2' })],
            selectedIndex: 0,
          }),
        ),
      );

      act(() => {
        dispatchKeyDown('ArrowDown');
      });

      expect(mockSetSelectedIndex).toHaveBeenCalled();
      const updateFn = mockSetSelectedIndex.mock.calls[0]?.[0] as
        | ((prev: number) => number)
        | undefined;
      expect(updateFn?.(0)).toBe(1);
    });

    it('wraps to first item when navigating down from last item', () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [createMockSkill(), createMockSkill({ slug: 'skill-2' })],
            selectedIndex: 1,
          }),
        ),
      );

      act(() => {
        dispatchKeyDown('ArrowDown');
      });

      const updateFn = mockSetSelectedIndex.mock.calls[0]?.[0] as
        | ((prev: number) => number)
        | undefined;
      expect(updateFn?.(1)).toBe(0);
    });

    it('does not navigate when skills array is empty', () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [],
            selectedIndex: 0,
          }),
        ),
      );

      act(() => {
        dispatchKeyDown('ArrowDown');
      });

      expect(mockSetSelectedIndex).not.toHaveBeenCalled();
    });
  });

  describe('no selected skill', () => {
    it('does not copy when no skill is selected', async () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [],
            selectedIndex: 0,
          }),
        ),
      );

      await act(async () => {
        dispatchKeyDown('c');
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('does not open repo when no skill is selected', () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            skills: [],
            selectedIndex: 0,
          }),
        ),
      );

      act(() => {
        dispatchKeyDown('g');
      });

      expect(mockWindowOpen).not.toHaveBeenCalled();
    });
  });

  describe('agent-specific commands', () => {
    it('copies the correct command for the selected agent', async () => {
      renderHook(() =>
        useKeyboard(
          createDefaultOptions({
            selectedAgent: 'codex-cli',
          }),
        ),
      );

      await act(async () => {
        dispatchKeyDown('c');
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('codex install test-skill');
    });
  });

  describe('cleanup', () => {
    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useKeyboard(createDefaultOptions()));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    });
  });
});
