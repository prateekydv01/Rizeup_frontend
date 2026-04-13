import { useState, useEffect } from "react";
import { getMyHabitGraph, getMembersGraph } from "../../api/habit.js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const toStr = (d) => {
  if (!d) return "";
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Build full year grid
const buildGrid = (year) => {
  const cells = [];
  const startDay = new Date(year, 0, 1).getDay();

  for (let i = 0; i < startDay; i++) cells.push(null);

  const days = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;

  for (let d = 0; d < days; d++) {
    cells.push(new Date(year, 0, 1 + d));
  }

  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return weeks;
};

export default function HabitGraph({ habitId, type, localDates, onDatesChange }) {
  const year = new Date().getFullYear();
  const [dates,        setDates]        = useState(localDates || []);
  const [members,      setMembers]      = useState([]);
  const [activeMember, setActiveMember] = useState(null);
  const [showMembers,  setShowMembers]  = useState(false);
  const [loading,      setLoading]      = useState(true);

  // Sync localDates
  useEffect(() => {
    if (!showMembers && localDates) setDates(localDates);
  }, [localDates, showMembers]);

  // Initial fetch
  useEffect(() => {
    getMyHabitGraph(habitId, year)
      .then(r => {
        const fetched = r.data.data.dates || [];
        setDates(fetched);
        if (onDatesChange) onDatesChange(fetched);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [habitId, year]);

  // Fetch members graph
  useEffect(() => {
    if (!showMembers || type !== "circle") return;

    getMembersGraph(habitId, year)
      .then(r => {
        setMembers(r.data.data);
        if (r.data.data.length > 0) {
          setActiveMember(r.data.data[0]);
          setDates(r.data.data[0].dates);
        }
      })
      .catch(console.log);
  }, [showMembers, habitId, year, type]);

  const weeks    = buildGrid(year);
  const dateSet  = new Set(showMembers && activeMember ? activeMember.dates : dates);
  const todayStr = toStr(new Date());

  // Month label positions
  const monthLabels = [];
  let lastMonth = -1;

  weeks.forEach((week, wi) => {
    const first = week.find(d => d !== null);
    if (first && first.getMonth() !== lastMonth) {
      monthLabels.push({ wi, label: MONTHS[first.getMonth()] });
      lastMonth = first.getMonth();
    }
  });

  if (loading) return (
    <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 14,
        height: 14,
        border: "2px solid rgba(249,115,22,0.2)",
        borderTopColor: "#f97316",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite"
      }} />
    </div>
  );

  return (
    <div>
      {/* Toggle */}
      {type === "circle" && (
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {["My Graph", "All Members"].map((label, i) => {
            const active = i === 0 ? !showMembers : showMembers;
            return (
              <button
                key={label}
                onClick={() => {
                  setShowMembers(i === 1);
                  if (i === 0) setDates(localDates || []);
                }}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: active ? "rgba(249,115,22,0.1)" : "transparent",
                  border: active ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(63,63,70,0.4)",
                  color: active ? "#f97316" : "var(--text-faint)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* Members */}
      {showMembers && members.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {members.map(m => {
            const active = activeMember?.user._id === m.user._id;
            return (
              <button
                key={m.user._id}
                onClick={() => { setActiveMember(m); setDates(m.dates); }}
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: active ? "rgba(249,115,22,0.1)" : "transparent",
                  border: active ? "1px solid rgba(249,115,22,0.5)" : "1px solid rgba(63,63,70,0.4)",
                  color: active ? "#f97316" : "var(--text-muted)",
                }}
              >
                {m.user.username}
              </button>
            );
          })}
        </div>
      )}

      {/* Graph */}
      <div style={{ overflowX: "auto", paddingBottom: 4 }}>
        <div style={{ display: "inline-flex", flexDirection: "column", gap: 3 }}>

          {/* Month labels */}
          <div style={{ display: "flex", gap: 3, marginLeft: 0 }}>
            {weeks.map((_, wi) => {
              const label = monthLabels.find(m => m.wi === wi);
              return (
                <div key={wi} style={{ width: 12, fontSize: 8 }}>
                  {label ? label.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div style={{ display: "flex", gap: 2 }}>
            {weeks.map((week, wi) => {
              const first = week.find(d => d !== null);
              const prev  = weeks[wi - 1]?.find(d => d !== null);

              const isNewMonth =
                first && prev && first.getMonth() !== prev.getMonth();

              return (
                <div
                  key={wi}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    marginLeft: isNewMonth ? 4 : 0, // ✅ month spacing only
                  }}
                >
                  {week.map((date, di) => {
                    const str = toStr(date);
                    const checked = str && dateSet.has(str);
                    const isToday = str === todayStr;
                    const isFuture = date && date > new Date() && !isToday;

                    return (
                      <div
                        key={di}
                        title={str || ""} // ✅ hover date
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 2,
                          flexShrink: 0,
                          background: !date
                            ? "transparent"
                            : checked
                            ? "#22c55e"
                            : isFuture
                            ? "rgba(39,39,42,0.25)"
                            : "rgba(39,39,42,0.7)",
                          outline: isToday ? "1px solid rgba(249,115,22,0.7)" : "none",
                          outlineOffset: "1px",
                          transition: "background 0.3s",
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Count */}
          <div style={{ marginLeft: 0, marginTop: 2 }}>
            <span style={{ fontSize: 9 }}>
              {(showMembers && activeMember ? activeMember.dates.length : dates.length)} check-ins in {year}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}