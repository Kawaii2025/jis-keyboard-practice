import { usePractice } from '../hooks/usePractice';
import { useReactiveKeyboard } from '../hooks/useReactiveKeyboard';
import Keyboard from './Keyboard';
import StatsRow from './StatsRow';
import ModeToggle from './ModeToggle';
import { PromptBox, NextCharHint } from './PromptDisplay';

export default function PracticePanel({ kanaList }) {
  const activeKey = useReactiveKeyboard(true);

  const {
    practiceMode,
    currentPrompt,
    currentIdx,
    score,
    accuracy,
    streak,
    inputValue,
    feedback,
    successFlash,
    expectedChar,
    expectedInfo,
    inputRef,
    nextPrompt,
    handleSkip,
    handleInputChange,
    changeMode,
  } = usePractice(kanaList);

  return (
    <div className="practice-panel">
      <StatsRow score={score} accuracy={accuracy} streak={streak} />

      <ModeToggle practiceMode={practiceMode} onChange={changeMode} />

      <PromptBox prompt={currentPrompt} currentIdx={currentIdx} successFlash={successFlash} />

      <NextCharHint expectedChar={expectedChar} expectedInfo={expectedInfo} />

      <div className="input-row">
        <input
          ref={inputRef}
          type="text"
          className="typed-input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="ここに入力..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button className="btn btn-ghost" onClick={handleSkip}>
          スキップ
        </button>
        <button className="btn btn-primary" onClick={() => nextPrompt()}>
          次へ
        </button>
      </div>

      <div className="keyboard-wrap no-bottom-margin">
        <Keyboard expectedChar={expectedChar} feedback={feedback} activeKey={activeKey} />
      </div>
    </div>
  );
}
