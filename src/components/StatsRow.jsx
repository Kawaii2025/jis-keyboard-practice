export default function StatsRow({ score, accuracy, streak }) {
  return (
    <div className="stats-row">
      <StatCard value={score} label="スコア" />
      <StatCard value={accuracy !== null ? `${accuracy}%` : '—'} label="正確率" />
      <StatCard value={streak} label="連続正解" />
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-val">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
