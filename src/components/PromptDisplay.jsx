function fingerLabel(finger) {
  return finger.replace('f-', '').replaceAll('-', ' ');
}

export function PromptBox({ prompt, currentIdx, successFlash }) {
  return (
    <div className={`prompt-box ${successFlash ? 'success-flash' : ''}`}>
      <div className="prompt-label">入力してください</div>
      <div className="prompt-text">
        {prompt.split('').map((ch, index) => {
          const cls = index < currentIdx ? 'done' : index === currentIdx ? 'current' : '';
          return (
            <span className={`prompt-char ${cls}`} key={`${ch}-${index}`}>
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function NextCharHint({ expectedChar, expectedInfo }) {
  if (!expectedInfo) return null;
  return (
    <div className="next-char-hint">
      次: <span>{expectedChar}</span> 指: <span>{fingerLabel(expectedInfo.finger)}</span>
      {expectedInfo.shift ? <span className="shift-note"> シフト</span> : null}
    </div>
  );
}
