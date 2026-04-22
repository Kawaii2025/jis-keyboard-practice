import { useMemo, useState } from 'react';
import { layout } from './data/layout';
import Keyboard from './components/Keyboard';
import PracticePanel from './components/PracticePanel';
import ReferenceGrid from './components/ReferenceGrid';

function App() {
  const [activeTab, setActiveTab] = useState('map');

  const kanaList = useMemo(() => {
    const list = [];
    for (const [rowKey, keys] of Object.entries(layout)) {
      if (rowKey === 'row0') continue;
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
          <Keyboard />
        </div>
      ) : null}

      {activeTab === 'practice' ? <PracticePanel kanaList={kanaList} /> : null}

      {activeTab === 'reference' ? <ReferenceGrid referenceList={referenceList} /> : null}
    </div>
  );
}

export default App;
