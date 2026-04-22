import { layout } from '../data/layout';

export function isKanaMatch(key, ch) {
  return key.norm === ch || key.shift === ch;
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

export default function Keyboard({ expectedChar = '', feedback = { type: '', char: '' } }) {
  function renderKey(key, keyIndex) {
    const classNames = ['key', key.finger];

    if (expectedChar && isKanaMatch(key, expectedChar)) {
      classNames.push('highlight');
    }
    if (feedback.type === 'correct' && feedback.char && isKanaMatch(key, feedback.char)) {
      classNames.push('correct');
    }
    if (feedback.type === 'wrong' && feedback.char && isKanaMatch(key, feedback.char)) {
      classNames.push('wrong');
    }

    return (
      <div
        className={classNames.join(' ')}
        key={`${key.norm}-${key.shift}-${keyIndex}`}
        data-norm={key.norm}
        data-shift={key.shift || ''}
      >
        <div className="key-top">{key.norm}</div>
        {key.shift ? <div className="key-bot">{key.shift}</div> : null}
      </div>
    );
  }

  return (
    <>
      {Object.entries(layout).map(([rowKey, keys]) => (
        <div className="kb-row" key={rowKey}>
          {keys.map((key, index) => renderKey(key, index))}
          {rowKey === 'row0' ? renderSpecialKey('改行', 'wide') : null}
          {rowKey === 'row1' ? renderSpecialKey('改行', 'normal') : null}
          {rowKey === 'row2' ? renderSpecialKey('後退', 'normal') : null}
          {rowKey === 'row2' ? renderSpecialKey('取消', 'normal2') : null}
        </div>
      ))}
      <div className="kb-row">
        {renderSpecialKey('シフト/濁音', 'thumb')}
        {renderSpecialKey('シフト/濁音', 'thumb2')}
        {renderSpecialKey('無変換', 'thumb3')}
        {renderSpecialKey('変換', 'thumb4')}
      </div>
    </>
  );
}
