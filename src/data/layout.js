/**
 * macOS JIS かな入力 keyboard layout.
 *
 * Row shape
 *   id       — unique identifier
 *   leading  — optional leading special key  { label, width }
 *   keys     — typeable kana keys            { norm, shift, finger }
 *   trailing — trailing special key(s)       [{ label, width }]
 *
 * thumbRow — bottom thumb/space bar row      [{ label, width }]
 *
 * To use a different layout, pass a compatible object as the `layout`
 * prop to the <Keyboard> component.
 */
export const jisKanaLayout = {
  rows: [
    // ── Number row ────────────────────────────────────────────────────
    {
      id: 'row0',
      leading: null,
      keys: [
        { norm: 'ぬ', shift: '',   finger: 'f-left-pinky'  },
        { norm: 'ふ', shift: '',   finger: 'f-left-ring'   },
        { norm: 'あ', shift: 'ぁ', finger: 'f-left-middle' },
        { norm: 'う', shift: 'ぅ', finger: 'f-left-index'  },
        { norm: 'え', shift: 'ぇ', finger: 'f-left-index'  },
        { norm: 'お', shift: 'ぉ', finger: 'f-right-index' },
        { norm: 'や', shift: 'ゃ', finger: 'f-right-index' },
        { norm: 'ゆ', shift: 'ゅ', finger: 'f-right-middle'},
        { norm: 'よ', shift: 'ょ', finger: 'f-right-ring'  },
        { norm: 'わ', shift: 'を', finger: 'f-right-pinky' },
        { norm: 'ほ', shift: 'ー', finger: 'f-right-pinky' },
        { norm: 'へ', shift: '',   finger: 'f-right-pinky' },
        { norm: 'ー', shift: '',   finger: 'f-right-pinky' },
      ],
      trailing: [{ label: '後退', width: 78 }],
    },
    // ── Q row ─────────────────────────────────────────────────────────
    {
      id: 'row1',
      leading: { label: 'Tab', width: 70 },
      keys: [
        { norm: 'た', shift: '',   finger: 'f-left-pinky'  },
        { norm: 'て', shift: '',   finger: 'f-left-ring'   },
        { norm: 'い', shift: 'ぃ', finger: 'f-left-middle' },
        { norm: 'す', shift: '',   finger: 'f-left-index'  },
        { norm: 'か', shift: '',   finger: 'f-left-index'  },
        { norm: 'ん', shift: '',   finger: 'f-right-index' },
        { norm: 'な', shift: '',   finger: 'f-right-index' },
        { norm: 'に', shift: '',   finger: 'f-right-middle'},
        { norm: 'ら', shift: '',   finger: 'f-right-ring'  },
        { norm: 'せ', shift: '',   finger: 'f-right-pinky' },
        { norm: '゛', shift: '',   finger: 'f-right-pinky' },
        { norm: '゜', shift: '「', finger: 'f-right-pinky' },
      ],
      trailing: [{ label: '改行', width: 56 }],
    },
    // ── Home row ──────────────────────────────────────────────────────
    {
      id: 'row2',
      leading: { label: '英数', width: 84 },
      keys: [
        { norm: 'ち', shift: '',   finger: 'f-left-pinky'  },
        { norm: 'と', shift: '',   finger: 'f-left-ring'   },
        { norm: 'し', shift: '',   finger: 'f-left-middle' },
        { norm: 'は', shift: '',   finger: 'f-left-index'  },
        { norm: 'き', shift: '',   finger: 'f-left-index'  },
        { norm: 'く', shift: '',   finger: 'f-right-index' },
        { norm: 'ま', shift: '',   finger: 'f-right-index' },
        { norm: 'の', shift: '',   finger: 'f-right-middle'},
        { norm: 'り', shift: '',   finger: 'f-right-ring'  },
        { norm: 'れ', shift: '',   finger: 'f-right-pinky' },
        { norm: 'け', shift: '',   finger: 'f-right-pinky' },
        { norm: 'む', shift: '」', finger: 'f-right-pinky' },
      ],
      trailing: [],
    },
    // ── Bottom row ────────────────────────────────────────────────────
    {
      id: 'row3',
      leading: { label: 'Shift', width: 106 },
      keys: [
        { norm: 'つ', shift: 'っ', finger: 'f-left-pinky'  },
        { norm: 'さ', shift: '',   finger: 'f-left-ring'   },
        { norm: 'そ', shift: '',   finger: 'f-left-middle' },
        { norm: 'ひ', shift: '',   finger: 'f-left-index'  },
        { norm: 'こ', shift: '',   finger: 'f-left-index'  },
        { norm: 'み', shift: '',   finger: 'f-right-index' },
        { norm: 'も', shift: '',   finger: 'f-right-index' },
        { norm: 'ね', shift: '、', finger: 'f-right-middle'},
        { norm: 'る', shift: '。', finger: 'f-right-ring'  },
        { norm: 'め', shift: '・', finger: 'f-right-pinky' },
        { norm: 'ろ', shift: '',   finger: 'f-right-pinky' },
      ],
      trailing: [{ label: 'Shift', width: 106 }],
    },
  ],

  // ── Thumb / space-bar row ──────────────────────────────────────────
  thumbRow: [
    { label: 'シフト/濁音', width: 90 },
    { label: 'スペース',    width: 280 },
    { label: 'シフト/濁音', width: 90 },
  ],
};

export const wordPrompts = [
  'あいうえお',
  'かきくけこ',
  'さしすせそ',
  'たちつてと',
  'なにぬねの',
  'はひふへほ',
  'まみむめも',
  'やゆよ',
  'らりるれろ',
  'わをん',
  'おはよう',
  'ありがとう',
  'にほんご',
  'きょうは',
  'なまえは',
  'どうぞよろしく'
];
