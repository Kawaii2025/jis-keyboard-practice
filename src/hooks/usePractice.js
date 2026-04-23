import { useEffect, useRef, useState } from 'react';
import { wordPrompts } from '../data/layout';

/**
 * Encapsulates all state and logic for the practice session.
 * Returns values and handlers ready for the UI to consume.
 */
export function usePractice(kanaList) {
  const [practiceMode, setPracticeMode] = useState('both');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState({ type: '', char: '' });
  const [successFlash, setSuccessFlash] = useState(false);

  const inputRef = useRef(null);

  // --- Derived values ---
  const expectedChar = currentPrompt[currentIdx] ?? '';
  const expectedInfo = expectedChar ? kanaList.find((k) => k.char === expectedChar) : null;
  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : null;

  // --- Helpers ---
  function focusInput() {
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function clearFeedbackAfterDelay() {
    setTimeout(() => setFeedback({ type: '', char: '' }), 400);
  }

  function buildPrompt(mode) {
    if (mode === 'quiz') {
      return wordPrompts[Math.floor(Math.random() * wordPrompts.length)];
    }
    const pool = kanaList.filter((k) => (mode === 'normal' ? !k.shift : true));
    return Array.from({ length: 8 }, () => pool[Math.floor(Math.random() * pool.length)].char).join('');
  }

  // --- Actions ---
  function nextPrompt(modeOverride) {
    const mode = modeOverride ?? practiceMode;
    setCurrentPrompt(buildPrompt(mode));
    setCurrentIdx(0);
    setInputValue('');
    setFeedback({ type: '', char: '' });
    focusInput();
  }

  function advanceOrRefresh(nextIdx) {
    if (nextIdx >= currentPrompt.length) {
      setSuccessFlash(true);
      setTimeout(() => {
        setSuccessFlash(false);
        nextPrompt();
      }, 600);
    } else {
      setCurrentIdx(nextIdx);
    }
  }

  function handleCorrect() {
    setCorrectAttempts((v) => v + 1);
    setStreak((prev) => {
      const next = prev + 1;
      setScore((s) => s + 10 + Math.min(next * 2, 20));
      return next;
    });
    setFeedback({ type: 'correct', char: expectedChar });
    clearFeedbackAfterDelay();
    advanceOrRefresh(currentIdx + 1);
  }

  function handleWrong() {
    setStreak(0);
    setFeedback({ type: 'wrong', char: expectedChar });
    clearFeedbackAfterDelay();
  }

  function handleTypedChar(ch) {
    if (!expectedChar) return;
    setTotalAttempts((v) => v + 1);
    if (ch === expectedChar) handleCorrect();
    else handleWrong();
  }

  function handleVirtualInputChar(ch) {
    setInputValue((prev) => `${prev}${ch}`);
    handleTypedChar(ch);
  }

  function handleInputChange(event) {
    const val = event.target.value;
    setInputValue(val);
    if (val) handleTypedChar(val[val.length - 1]);
  }

  function handleSkip() {
    if (!currentPrompt) return;
    setStreak(0);
    advanceOrRefresh(currentIdx + 1);
  }

  function changeMode(mode) {
    setPracticeMode(mode);
    nextPrompt(mode);
  }

  // Start the first prompt on mount
  useEffect(() => {
    nextPrompt();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    // state
    practiceMode,
    currentPrompt,
    currentIdx,
    score,
    accuracy,
    streak,
    inputValue,
    feedback,
    successFlash,
    // derived
    expectedChar,
    expectedInfo,
    // refs
    inputRef,
    // actions
    nextPrompt,
    handleSkip,
    handleInputChange,
    handleVirtualInputChar,
    changeMode,
  };
}
