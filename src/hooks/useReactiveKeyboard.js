import { useEffect, useRef, useState } from 'react';

const codeRows = {
  row0: [
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
    'IntlYen',
  ],
  row1: [
    'KeyQ',
    'KeyW',
    'KeyE',
    'KeyR',
    'KeyT',
    'KeyY',
    'KeyU',
    'KeyI',
    'KeyO',
    'KeyP',
    'BracketLeft',
    'BracketRight',
  ],
  row2: [
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyF',
    'KeyG',
    'KeyH',
    'KeyJ',
    'KeyK',
    'KeyL',
    'Semicolon',
    'Quote',
    'Backslash',
  ],
  row3: [
    'KeyZ',
    'KeyX',
    'KeyC',
    'KeyV',
    'KeyB',
    'KeyN',
    'KeyM',
    'Comma',
    'Period',
    'Slash',
    'IntlRo',
  ],
};

function findLayoutPosition(eventCode) {
  for (const [rowId, codes] of Object.entries(codeRows)) {
    const keyIndex = codes.indexOf(eventCode);
    if (keyIndex >= 0) {
      return { rowId, keyIndex };
    }
  }
  return null;
}

export function useReactiveKeyboard(enabled = true, onInputChar, onInputDelete) {
  const [activeKey, setActiveKey] = useState(null);
  const inputCharRef = useRef(onInputChar);
  const inputDeleteRef = useRef(onInputDelete);

  useEffect(() => {
    inputCharRef.current = onInputChar;
  }, [onInputChar]);

  useEffect(() => {
    inputDeleteRef.current = onInputDelete;
  }, [onInputDelete]);

  useEffect(() => {
    if (!enabled) {
      setActiveKey(null);
      return;
    }

    const onKeyDown = (event) => {
      if (event.repeat) return;

      const isDeleteKey =
        (event.key === 'Backspace' || event.key === 'Delete') &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey;

      if (isDeleteKey && inputDeleteRef.current) {
        event.preventDefault();
        inputDeleteRef.current();
      }

      const matched = findLayoutPosition(event.code);
      if (!matched) return;
      setActiveKey({ ...matched, shift: event.shiftKey });

      const isPrintable =
        event.key.length === 1 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.isComposing;

      if (isPrintable && inputCharRef.current) {
        inputCharRef.current(event.key);
      }
    };

    const clearActiveKey = () => {
      setActiveKey(null);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', clearActiveKey);
    window.addEventListener('blur', clearActiveKey);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', clearActiveKey);
      window.removeEventListener('blur', clearActiveKey);
    };
  }, [enabled]);

  return activeKey;
}
