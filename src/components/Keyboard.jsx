import { jisKanaLayout } from '../data/layout';

export function isKanaMatch(key, ch) {
  return key.norm === ch || key.shift === ch;
}

// ── Sub-components ─────────────────────────────────────────────────

function KanaKey({ keyData, expectedChar, feedback, isActive }) {
  const classes = ['key', keyData.finger];

  if (expectedChar && isKanaMatch(keyData, expectedChar)) classes.push('highlight');
  if (feedback.type === 'correct' && isKanaMatch(keyData, feedback.char)) classes.push('correct');
  if (feedback.type === 'wrong'   && isKanaMatch(keyData, feedback.char)) classes.push('wrong');
  if (isActive) classes.push('active-press');

  return (
    <div
      className={classes.join(' ')}
      data-norm={keyData.norm}
      data-shift={keyData.shift || ''}
    >
      <div className="key-top">{keyData.norm}</div>
      {keyData.shift ? <div className="key-bot">{keyData.shift}</div> : null}
    </div>
  );
}

function SpecialKey({ label, width }) {
  return (
    <div className="key f-special" style={{ width }}>
      <div className="key-top key-top-small">{label}</div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────

/**
 * Renders a kana keyboard.
 *
 * Props
 *   layout      — layout config object (defaults to jisKanaLayout).
 *                 Shape: { rows: Row[], thumbRow: SpecialKeyDef[] }
 *   expectedChar — character to highlight
 *   feedback     — { type: 'correct'|'wrong'|'', char: string }
 */
export default function Keyboard({
  layout = jisKanaLayout,
  expectedChar = '',
  feedback = { type: '', char: '' },
  activeKey = null,
}) {
  return (
    <>
      {layout.rows.map((row) => (
        <div className="kb-row" key={row.id}>
          {row.leading && <SpecialKey label={row.leading.label} width={row.leading.width} />}

          {row.keys.map((key, i) => (
            <KanaKey
              key={`${row.id}-${i}`}
              keyData={key}
              expectedChar={expectedChar}
              feedback={feedback}
              isActive={Boolean(activeKey && activeKey.rowId === row.id && activeKey.keyIndex === i)}
            />
          ))}

          {row.trailing?.map((sk, i) => (
            <SpecialKey key={i} label={sk.label} width={sk.width} />
          ))}
        </div>
      ))}

      {layout.thumbRow && (
        <div className="kb-row">
          {layout.thumbRow.map((sk, i) => (
            <SpecialKey key={i} label={sk.label} width={sk.width} />
          ))}
        </div>
      )}
    </>
  );
}

