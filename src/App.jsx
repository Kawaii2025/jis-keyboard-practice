import { useEffect, useMemo, useRef, useState } from 'react';

const layout = {
  row0: [
    { norm: '１', shift: '?', finger: 'f-left-pinky' },
    { norm: '２', shift: '／', finger: 'f-left-ring' },
    { norm: '３', shift: '〜', finger: 'f-left-middle' },
    { norm: '４', shift: '「', finger: 'f-left-index' },
    { norm: '５', shift: '」', finger: 'f-left-index' },
    { norm: '６', shift: '[', finger: 'f-right-index' },
    { norm: '７', shift: ']', finger: 'f-right-index' },
    { norm: '８', shift: '(', finger: 'f-right-middle' },
    { norm: '９', shift: ')', finger: 'f-right-ring' },
    { norm: '０', shift: '', finger: 'f-right-pinky' },
    { norm: '—', shift: '', finger: 'f-right-pinky' },
    { norm: '¥', shift: '', finger: 'f-right-pinky' }
  ],
  row1: [
    { norm: 'あ', shift: 'を', finger: 'f-left-pinky' },
    { norm: 'え', shift: 'か', finger: 'f-left-ring' },
    { norm: 'り', shift: 'た', finger: 'f-left-middle' },
    { norm: 'ゃ', shift: 'こ', finger: 'f-left-index' },
    { norm: 'れ', shift: 'さ', finger: 'f-left-index' },
    { norm: 'よ', shift: 'ら', finger: 'f-right-index' },
    { norm: 'に', shift: 'ち', finger: 'f-right-index' },
    { norm: 'る', shift: 'く', finger: 'f-right-middle' },
    { norm: 'ま', shift: 'つ', finger: 'f-right-ring' },
    { norm: 'え', shift: '', finger: 'f-right-ring' },
    { norm: '』', shift: '', finger: 'f-right-pinky' }
  ],
  row2: [
    { norm: 'を', shift: '', finger: 'f-left-pinky' },
    { norm: 'あ', shift: 'し', finger: 'f-left-ring' },
    { norm: 'な', shift: 'て', finger: 'f-left-middle' },
    { norm: 'ゆ', shift: '', finger: 'f-left-index' },
    { norm: 'も', shift: 'は', finger: 'f-left-index' },
    { norm: 'み', shift: 'は', finger: 'f-right-index' },
    { norm: 'お', shift: 'と', finger: 'f-right-index' },
    { norm: 'の', shift: 'き', finger: 'f-right-middle' },
    { norm: 'き', shift: 'ょ', finger: 'f-right-ring' },
    { norm: 'っ', shift: 'い', finger: 'f-right-pinky' },
    { norm: 'ん', shift: '', finger: 'f-right-pinky' }
  ],
  row3: [
    { norm: 'う', shift: 'ひ', finger: 'f-left-pinky' },
    { norm: 'い', shift: '', finger: 'f-left-ring' },
    { norm: 'す', shift: '', finger: 'f-left-middle' },
    { norm: 'ろ', shift: 'や', finger: 'f-left-index' },
    { norm: 'や', shift: 'ぶ', finger: 'f-left-index' },
    { norm: 'ふ', shift: 'へ', finger: 'f-right-index' },
    { norm: 'ぬ', shift: 'め', finger: 'f-right-index' },
    { norm: 'ゆ', shift: 'そ', finger: 'f-right-middle' },
    { norm: 'む', shift: 'ね', finger: 'f-right-ring' },
    { norm: 'わ', shift: 'ほ', finger: 'f-right-pinky' },
    { norm: 'お', shift: '', finger: 'f-right-pinky' }
  ]
};

const wordPrompts = [
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

const tabs = ['map', 'practice', 'reference'];

function fingerLabelFromClass(finger) {
  return finger.replace('f-', '').replaceAll('-', ' ');
}

function isKanaMatch(key, ch) {
  return key.norm === ch || key.shift === ch;
}

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [practiceMode, setPracticeMode] = useState('both');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ type: '', char: '', id: 0 });
  const [successFlash, setSuccessFlash] = useState(false);

  const inputRef = useRef(null);

  const kanaList = useMemo(() => {
    const list = [];
    for (const [rowKey, keys] of Object.entries(layout)) {
      if (rowKey === 'row0') {
        continue;
      }
      for (const k of keys) {
        if (k.norm && k.norm.trim()) {
          list.push({ char: k.norm, shift: false, finger: k.finger, row: rowKey });
        }
        if (k.shift && k.shift.trim()) {
          list.push({ char: k.shift, shift: true, finger: k.finger, row: rowKey });
        }
      }
    }
    return list;
  }, []);

  const referenceList = useMemo(() => {
    const seen = new Set();
    const refs = [];
    for (const item of kanaList) {
      if (!seen.has(item.char)) {
        seen.add(item.char);
        refs.push(item);
      }
    }
    return refs;
  }, [kanaList]);

  const expectedChar = currentPrompt[currentIdx] || '';
  const expectedInfo = expectedChar ? kanaList.find((k) => k.char === expectedChar) : null;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : null;

  function resetFeedbackLater() {
    setTimeout(() => {
      setFeedback((prev) => ({ ...prev, type: '' }));
    }, 400);
  }

  function createPrompt(mode) {
    if (mode === 'quiz') {
      return wordPrompts[Math.floor(Math.random() * wordPrompts.length)];
    }

    const pool = kanaList.filter((k) => (mode === 'normal' ? !k.shift : true));
    return Array.from({ length: 8 }, () => pool[Math.floor(Math.random() * pool.length)].char).join('');
  }

  function newPrompt(modeOverride) {
    const mode = modeOverride || practiceMode;
    setCurrentIdx(0);
    setCurrentPrompt(createPrompt(mode));
    setInputValue('');
    setFeedback({ type: '', char: '', id: Date.now() });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleSkip() {
    if (!currentPrompt) {
      return;
    }

    setStreak(0);
    setCurrentIdx((prev) => {
      const next = prev + 1;
      if (next >= currentPrompt.length) {
        newPrompt();
        return prev;
      }
      return next;
    });
  }

  function handleTypedChar(ch) {
    if (!expectedChar) {
      return;
    }

    setTotalAttempts((v) => v + 1);

    if (ch === expectedChar) {
      setCorrectAttempts((v) => v + 1);
      setStreak((prev) => {
        const nextStreak = prev + 1;
        setScore((s) => s + 10 + Math.min(nextStreak * 2, 20));
        return nextStreak;
      });

      setFeedback({ type: 'correct', char: expectedChar, id: Date.now() });
      resetFeedbackLater();

      setCurrentIdx((prevIdx) => {
        const nextIdx = prevIdx + 1;
        if (nextIdx >= currentPrompt.length) {
          setSuccessFlash(true);
          setTimeout(() => {
            setSuccessFlash(false);
            newPrompt();
          }, 600);
          return prevIdx;
        }
        return nextIdx;
      });
      return;
    }

    setStreak(0);
    setFeedback({ type: 'wrong', char: expectedChar, id: Date.now() });
    resetFeedbackLater();
  }

  function onInputChange(event) {
    const val = event.target.value;
    if (!val) {
      setInputValue('');
      return;
    }

    const lastChar = val[val.length - 1];
    setInputValue('');
    handleTypedChar(lastChar);
  }

  useEffect(() => {
    if (activeTab === 'practice' && !currentPrompt) {
      newPrompt();
    }
  }, [activeTab]);

  function changeMode(mode) {
    setPracticeMode(mode);
    newPrompt(mode);
  }

  function renderKey(key, keyIndex) {
    const classNames = ['key', key.finger];
    if (activeTab === 'practice' && expectedChar && isKanaMatch(key, expectedChar)) {
      classNames.push('highlight');
    }
    if (
      activeTab === 'practice' &&
      feedback.type === 'correct' &&
      feedback.char &&
      isKanaMatch(key, feedback.char)
    ) {
      classNames.push('correct');
    }
    if (
      activeTab === 'practice' &&
      feedback.type === 'wrong' &&
      feedback.char &&
      isKanaMatch(key, feedback.char)
    ) {
      classNames.push('wrong');
    }

    const top = key.norm;
    const bottom = key.shift;

    return (
      <div
        className={classNames.join(' ')}
        key={`${key.norm}-${key.shift}-${keyIndex}`}
        data-norm={key.norm}
        data-shift={key.shift || ''}
      >
        <div className="key-top">{top}</div>
        {bottom ? <div className="key-bot">{bottom}</div> : null}
      </div>
    );
  }

  function renderSpecialKey(label, type) {
    const style = {};
    if (type === 'thumb') {
      style.width = '90px';
    }
    if (type === 'wide') {
      style.width = '70px';
    }

    return (
      <div className="key f-special" key={`${label}-${type}`} style={style}>
        <div className="key-top key-top-small">{label}</div>
      </div>
    );
  }

  function renderKeyboard() {
    return (
      <>
        {Object.entries(layout).map(([rowKey, keys]) => {
          return (
            <div className="kb-row" key={rowKey}>
              {keys.map((key, index) => renderKey(key, index))}
              {rowKey === 'row0' ? renderSpecialKey('改行', 'wide') : null}
              {rowKey === 'row1' ? renderSpecialKey('改行', 'normal') : null}
              {rowKey === 'row2' ? renderSpecialKey('後退', 'normal') : null}
              {rowKey === 'row2' ? renderSpecialKey('取消', 'normal2') : null}
            </div>
          );
        })}
        <div className="kb-row">
          {renderSpecialKey('シフト/濁音', 'thumb')}
          {renderSpecialKey('シフト/濁音', 'thumb2')}
          {renderSpecialKey('無変換', 'thumb3')}
          {renderSpecialKey('変換', 'thumb4')}
        </div>
      </>
    );
  }

  return (
    <div className="app-shell">
      <h1>親指シフト練習</h1>
      <p className="subtitle">JIS Kana Keyboard · Oyayubi Shift Layout</p>

      <div className="tabs">
        <button className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
          キーマップ
        </button>
        <button
          className={`tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          練習
        </button>
        <button
          className={`tab ${activeTab === 'reference' ? 'active' : ''}`}
          onClick={() => setActiveTab('reference')}
        >
          一覧
        </button>
      </div>

      {activeTab === 'map' ? (
        <div className="keyboard-wrap">
          <div className="finger-labels">
            <div className="finger-label">左小指</div>
            <div className="finger-label">左薬指</div>
            <div className="finger-label">左中指</div>
            <div className="finger-label finger-double">左人差し指</div>
            <div className="finger-label finger-double">右人差し指</div>
            <div className="finger-label">右中指</div>
            <div className="finger-label">右薬指</div>
            <div className="finger-label">右小指</div>
          </div>
          {renderKeyboard()}
        </div>
      ) : null}

      {activeTab === 'practice' ? (
        <div className="practice-panel">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-val">{score}</div>
              <div className="stat-label">スコア</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">{accuracy !== null ? `${accuracy}%` : '—'}</div>
              <div className="stat-label">正確率</div>
            </div>
            <div className="stat-card">
              <div className="stat-val">{streak}</div>
              <div className="stat-label">連続正解</div>
            </div>
          </div>

          <div className="shift-toggle">
            <span className="toggle-label">モード:</span>
            <button
              className={`toggle-btn ${practiceMode === 'normal' ? 'on' : ''}`}
              onClick={() => changeMode('normal')}
            >
              通常
            </button>
            <button
              className={`toggle-btn ${practiceMode === 'both' ? 'on' : ''}`}
              onClick={() => changeMode('both')}
            >
              通常+シフト
            </button>
            <button
              className={`toggle-btn ${practiceMode === 'quiz' ? 'on' : ''}`}
              onClick={() => changeMode('quiz')}
            >
              単語
            </button>
          </div>

          <div className={`prompt-box ${successFlash ? 'success-flash' : ''}`}>
            <div className="prompt-label">入力してください</div>
            <div className="prompt-text">
              {currentPrompt.split('').map((ch, index) => {
                let cls = '';
                if (index < currentIdx) {
                  cls = 'done';
                } else if (index === currentIdx) {
                  cls = 'current';
                }
                return (
                  <span className={`prompt-char ${cls}`} key={`${ch}-${index}`}>
                    {ch}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="next-char-hint">
            {expectedInfo ? (
              <>
                次: <span>{expectedChar}</span> 指: <span>{fingerLabelFromClass(expectedInfo.finger)}</span>
                {expectedInfo.shift ? <span className="shift-note"> シフト</span> : null}
              </>
            ) : null}
          </div>

          <div className="input-row">
            <input
              ref={inputRef}
              type="text"
              className="typed-input"
              value={inputValue}
              onChange={onInputChange}
              placeholder="ここに入力..."
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            <button className="btn btn-ghost" onClick={handleSkip}>
              スキップ
            </button>
            <button className="btn btn-primary" onClick={() => newPrompt()}>
              次へ
            </button>
          </div>

          <div className="keyboard-wrap no-bottom-margin">{renderKeyboard()}</div>
        </div>
      ) : null}

      {activeTab === 'reference' ? (
        <div className="reference-grid">
          {referenceList.map((item, index) => (
            <div className="ref-card" key={`${item.char}-${index}`}>
              <div className="ref-char">{item.char}</div>
              <div className="ref-key">{item.shift ? '⇧ シフト' : '通常'}</div>
              <div className="ref-finger">{fingerLabelFromClass(item.finger)}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default App;
