const MODES = [
  { id: 'normal', label: '通常' },
  { id: 'both', label: '通常+シフト' },
  { id: 'gojuon', label: '五十音順' },
  { id: 'quiz', label: '単語' },
];

export default function ModeToggle({ practiceMode, onChange }) {
  return (
    <div className="shift-toggle">
      <span className="toggle-label">モード:</span>
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          className={`toggle-btn ${practiceMode === id ? 'on' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
