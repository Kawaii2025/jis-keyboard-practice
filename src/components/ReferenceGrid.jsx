function fingerLabelFromClass(finger) {
  return finger.replace('f-', '').replaceAll('-', ' ');
}

export default function ReferenceGrid({ referenceList }) {
  return (
    <div className="reference-grid">
      {referenceList.map((item, index) => (
        <div className="ref-card" key={`${item.char}-${index}`}>
          <div className="ref-char">{item.char}</div>
          <div className="ref-key">{item.shift ? '⇧ シフト' : '通常'}</div>
          <div className="ref-finger">{fingerLabelFromClass(item.finger)}</div>
        </div>
      ))}
    </div>
  );
}
