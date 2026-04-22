import { useEffect, useRef, useState } from 'react';
import { wordPrompts } from '../data/layout';
import Keyboard from './Keyboard';

function fingerLabelFromClass(finger) {
  return finger.replace('f-', '').replaceAll('-', ' ');
}

export default function PracticePanel({ kanaList }) {
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
    if (!currentPrompt) return;

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
    if (!expectedChar) return;

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

  function changeMode(mode) {
    setPracticeMode(mode);
    newPrompt(mode);
  }

  useEffect(() => {
    if (!currentPrompt) newPrompt();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
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
            if (index < currentIdx) cls = 'done';
            else if (index === currentIdx) cls = 'current';
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

      <div className="keyboard-wrap no-bottom-margin">
        <Keyboard expectedChar={expectedChar} feedback={feedback} />
      </div>
    </div>
  );
}
