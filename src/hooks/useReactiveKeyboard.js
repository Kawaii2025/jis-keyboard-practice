import { useEffect, useState } from 'react';

const codeRows = {
  row0: [
    'Backquote',
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

export function useReactiveKeyboard(enabled = true) {
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setActiveKey(null);
      return;
    }

    const onKeyDown = (event) => {
      if (event.repeat) return;
      const matched = findLayoutPosition(event.code);
      if (!matched) return;
      setActiveKey({ ...matched, shift: event.shiftKey });
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
