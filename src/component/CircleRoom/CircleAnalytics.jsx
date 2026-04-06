export default function CircleAnalytics({ circle, goals, habits }) {
  const activeGoals     = goals.filter(g => g.status !== "completed");
  const completedGoals  = goals.filter(g => g.status === "completed");
  const totalCompletions = goals.reduce((acc, g) => acc + (g.completedBy?.length || 0), 0);
  const members         = circle.members || [];

  // Leaderboard — who completed most goals
  const completionMap = {};
  goals.forEach(goal => {
    (goal.completedBy || []).forEach(c => {
      const uid = (c.userId?._id || c.userId)?.toString();
      if (!uid) return;
      completionMap[uid] = (completionMap[uid] || 0) + 1;
    });
  });
  const ranked = Object.entries(completionMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const medals = ["🥇", "🥈", "🥉"];

  const StatBox = ({ icon, label, value, sub }) => (
    <div style={{ padding: "16px 18px", borderRadius: 14, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.8)" }}>
      <p style={{ fontSize: 18, margin: "0 0 8px" }}>{icon}</p>
      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: "#f97316", margin: "0 0 2px" }}>{value}</p>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#f4f4f5", margin: "0 0 2px" }}>{label}</p>
      {sub && <p style={{ fontSize: 10, color: "#52525b", margin: 0 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#f4f4f5", margin: "0 0 4px" }}>Circle Analytics</h2>
        <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>How your circle is performing</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
        <StatBox icon="👥" label="Members"         value={members.length}         sub="in this circle" />
        <StatBox icon="🎯" label="Active Goals"    value={activeGoals.length}     sub="in progress" />
        <StatBox icon="✅" label="Completed Goals" value={completedGoals.length}  sub="finished" />
        <StatBox icon="🔥" label="Circle Habits"   value={habits.length}          sub="daily habits" />
        <StatBox icon="⚡" label="Completions"     value={totalCompletions}        sub="total goal completions" />
      </div>

      {/* Completion rate */}
      {goals.length > 0 && (
        <div style={{ padding: "16px 18px", borderRadius: 14, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.8)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b", marginBottom: 12 }}>Goal Completion Rate</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#a1a1aa" }}>{completedGoals.length} of {goals.length} goals completed</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316" }}>{Math.round((completedGoals.length / goals.length) * 100)}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 6, background: "rgba(39,39,42,0.8)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((completedGoals.length / goals.length) * 100)}%`, borderRadius: 6, background: "linear-gradient(90deg,#f97316,#22c55e)", transition: "width 1s" }} />
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {ranked.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#52525b", marginBottom: 12 }}>🏆 Top Performers</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ranked.map(([uid, count], i) => {
              const member = (circle.members || []).find(m => (m._id || m)?.toString() === uid);
              const name   = member?.fullName || member?.username || "Member";
              return (
                <div key={uid} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: i === 0 ? "rgba(249,115,22,0.06)" : "rgba(15,15,17,0.8)", border: i === 0 ? "1px solid rgba(249,115,22,0.18)" : "1px solid rgba(39,39,42,0.7)" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{medals[i] || `#${i + 1}`}</span>
                  <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: i === 0 ? "#f97316" : "#f4f4f5", margin: 0 }}>{name}</p>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#52525b" }}>{count} goal{count > 1 ? "s" : ""}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {goals.length === 0 && habits.length === 0 && (
        <div style={{ padding: "40px", textAlign: "center", borderRadius: 14, border: "1px dashed rgba(39,39,42,0.7)" }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>📊</p>
          <p style={{ fontSize: 13, color: "#52525b" }}>No data yet. Create goals and habits to see analytics.</p>
        </div>
      )}
    </div>
  );
}