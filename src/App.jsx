import { useMemo, useState } from 'react';
import { jisKanaLayout } from './data/layout';
import Keyboard from './components/Keyboard';
import PracticePanel from './components/PracticePanel';
import ReferenceGrid from './components/ReferenceGrid';
import { useReactiveKeyboard } from './hooks/useReactiveKeyboard';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const activeKey = useReactiveKeyboard(activeTab === 'map');

  // Build flat kana list from the layout rows (skip the number row).
  // Pass this to child components that need to know all available kana.
  const kanaList = useMemo(() => {
    const list = [];
    for (const row of jisKanaLayout.rows) {
      if (row.id === 'row0') continue; // number row has no kana practice
      for (const k of row.keys) {
        if (k.norm?.trim()) list.push({ char: k.norm, shift: false, finger: k.finger, row: row.id });
        if (k.shift?.trim()) list.push({ char: k.shift, shift: true,  finger: k.finger, row: row.id });
      }
    }
    return list;
  }, []);

  const referenceList = useMemo(() => {
    const seen = new Set();
    return kanaList.filter(({ char }) => (seen.has(char) ? false : seen.add(char)));
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
          <Keyboard activeKey={activeKey} />
        </div>
      ) : null}

      {activeTab === 'practice' ? <PracticePanel kanaList={kanaList} /> : null}

      {activeTab === 'reference' ? <ReferenceGrid referenceList={referenceList} /> : null}
    </div>
  );
}

export default App;
