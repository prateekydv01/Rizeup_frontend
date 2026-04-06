import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCircleById } from "../../api/circle.js";
import { getCircleGoals, joinGoal, leaveGoal } from "../../api/goal.js";
import { getCircleHabits, joinHabit, leaveHabit } from "../../api/habit.js";
import CircleChat from "./CircleChat.jsx";
import CircleMembers from "./CircleMembers.jsx";
import CircleGoalSection from "./CircleGoalSection.jsx";
import CircleHabitSection from "./CircleHabitSection.jsx";
import CircleAnalytics from "./CircleAnalytics.jsx";
import CreateCircleGoalModal from "./CreateCircleGoalModal.jsx";
import CreateCircleHabitModal from "./CreateCircleHabitModal.jsx";

const NAV = [
  { key: "overview",  icon: "⚡", label: "Overview"  },
  { key: "goals",     icon: "🎯", label: "Goals"     },
  { key: "habits",    icon: "🔥", label: "Habits"    },
  { key: "members",   icon: "👥", label: "Members"   },
  { key: "analytics", icon: "📊", label: "Analytics" },
  { key: "chat",      icon: "💬", label: "Chat"      },
];

/* ─── Top navbar for the room ─── */
function RoomNav({ circle, hue, initials, isAdmin, activeSection, setActiveSection, onBack, onCreateGoal, onCreateHabit }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = (key) => ({
    display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
    borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12,
    fontWeight: activeSection === key ? 700 : 500,
    background: activeSection === key ? "rgba(249,115,22,0.12)" : "transparent",
    color: activeSection === key ? "#f97316" : "#71717a",
    transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "'DM Sans',sans-serif",
  });

  return (
    <>
      <style>{`
        .room-nav-item:hover { background: rgba(255,255,255,0.05) !important; color: #d4d4d8 !important; }
        .room-nav-item.active:hover { background: rgba(249,115,22,0.15) !important; color: #f97316 !important; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .mobile-menu { animation: slideDown 0.2s ease both; }
      `}</style>

      <nav style={{
        background: "#0a0a0c",
        borderBottom: "1px solid rgba(39,39,42,0.7)",
        position: "sticky", top: 0, zIndex: 30,
      }}>
        {/* ── Top row: identity + back ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: "1px solid rgba(39,39,42,0.4)" }}>
          {/* Back */}
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", color: "#52525b", cursor: "pointer", fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 8, transition: "all 0.15s", flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = "#f97316"; e.currentTarget.style.background = "rgba(249,115,22,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#52525b"; e.currentTarget.style.background = "none"; }}>
            ← <span style={{ display: "inline" }}>Circles</span>
          </button>

          <div style={{ width: 1, height: 16, background: "rgba(39,39,42,0.8)", flexShrink: 0 }} />

          {/* Circle identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg,hsla(${hue},60%,45%,0.3),hsla(${hue},60%,35%,0.15))`, border: `1px solid hsla(${hue},60%,50%,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 11, color: `hsl(${hue},70%,65%)`, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, color: "#f4f4f5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{circle.name}</p>
              <p style={{ fontSize: 10, color: "#3f3f46", margin: 0, fontFamily: "monospace", letterSpacing: "0.1em" }}>{circle.code} · {circle.members?.length || 0} members{isAdmin ? " · Admin" : ""}</p>
            </div>
          </div>

          {/* Quick create — desktop only */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }} className="hidden-mobile">
            <button onClick={onCreateGoal} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.06)", color: "#f97316", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.06)"; }}>
              + Goal
            </button>
            <button onClick={onCreateHabit} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.06)", color: "#f97316", fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.06)"; }}>
              + Habit
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} style={{ display: "none", background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: 18, padding: 4 }} className="show-mobile">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* ── Tab row — scrollable on mobile ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
          {NAV.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`room-nav-item${activeSection === item.key ? " active" : ""}`}
              style={navStyle(item.key)}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* ── Mobile dropdown menu ── */}
        {menuOpen && (
          <div className="mobile-menu" style={{ padding: "10px 12px 14px", borderTop: "1px solid rgba(39,39,42,0.5)", display: "flex", gap: 8 }}>
            <button onClick={() => { onCreateGoal(); setMenuOpen(false); }} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.06)", color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              + New Goal
            </button>
            <button onClick={() => { onCreateHabit(); setMenuOpen(false); }} style={{ flex: 1, padding: "9px", borderRadius: 10, border: "1px solid rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.06)", color: "#f97316", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              + New Habit
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── Overview section with active goals + habits ─── */
function OverviewSection({ circle, goals, habits, hue, userId, setActiveSection, onCreateGoal, onCreateHabit, onJoinGoal, onLeaveGoal, onJoinHabit, onLeaveHabit }) {
  const activeGoals  = goals.filter(g => g.status !== "completed");
  const doneGoals    = goals.filter(g => g.status === "completed");
  const activeHabits = habits.filter(h => h.isActive !== false);

  const StatCard = ({ icon, value, label, onClick }) => (
    <div onClick={onClick} style={{ padding: "14px 16px", borderRadius: 14, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.8)", cursor: onClick ? "pointer" : "default", transition: "all 0.2s" }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = "rgba(249,115,22,0.25)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.8)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <p style={{ fontSize: 20, marginBottom: 6 }}>{icon}</p>
      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, color: "#f97316", margin: "0 0 2px" }}>{value}</p>
      <p style={{ fontSize: 11, color: "#52525b", margin: 0 }}>{label}</p>
    </div>
  );

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Circle header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,hsla(${hue},60%,45%,0.25),hsla(${hue},60%,35%,0.12))`, border: `1px solid hsla(${hue},60%,50%,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: `hsl(${hue},70%,65%)`, flexShrink: 0 }}>
          {circle.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(1.2rem,3vw,1.6rem)", color: "#f4f4f5", margin: 0 }}>{circle.name}</h1>
          <p style={{ fontSize: 11, color: "#3f3f46", margin: "2px 0 0", fontFamily: "monospace", letterSpacing: "0.12em" }}>{circle.code} · {circle.members?.length || 0} members</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
        <StatCard icon="👥" value={circle.members?.length || 0} label="Members" onClick={() => setActiveSection("members")} />
        <StatCard icon="🎯" value={activeGoals.length} label="Active Goals" onClick={() => setActiveSection("goals")} />
        <StatCard icon="✅" value={doneGoals.length} label="Completed" onClick={() => setActiveSection("goals")} />
        <StatCard icon="🔥" value={activeHabits.length} label="Active Habits" onClick={() => setActiveSection("habits")} />
      </div>

      {/* Active Goals preview */}
      {activeGoals.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 2, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#f97316,#dc2626)" }} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b", margin: 0 }}>Active Goals</p>
            </div>
            <button onClick={() => setActiveSection("goals")} style={{ fontSize: 11, color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activeGoals.slice(0, 3).map(g => {
              const isJoined = g.isJoined || (g.members || []).some(m => (m._id || m)?.toString() === userId?.toString());
              const daysLeft = Math.ceil((new Date(g.endDate) - new Date()) / 86400000);
              const totalMs = new Date(g.endDate) - new Date(g.startDate);
              const pct = Math.min(100, Math.max(0, Math.round(((new Date() - new Date(g.startDate)) / totalMs) * 100)));
              return (
                <div key={g._id} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(15,15,17,0.9)", border: "1px solid rgba(39,39,42,0.7)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎯 {g.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: daysLeft < 0 ? "#f87171" : daysLeft <= 7 ? "#fb923c" : "#52525b" }}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                      <button onClick={() => isJoined ? onLeaveGoal(g._id) : onJoinGoal(g._id)}
                        style={{ padding: "3px 10px", borderRadius: 7, border: "none", fontSize: 10, fontWeight: 700, cursor: "pointer", background: isJoined ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.1)", color: isJoined ? "#f87171" : "#22c55e" }}>
                        {isJoined ? "Leave" : "Join"}
                      </button>
                    </div>
                  </div>
                  <div style={{ height: 3, borderRadius: 3, background: "rgba(39,39,42,0.8)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3, background: "linear-gradient(90deg,#f97316,#ef4444)", transition: "width 0.8s" }} />
                  </div>
                  <p style={{ fontSize: 10, color: "#3f3f46", margin: "5px 0 0" }}>{fmt(g.startDate)} → {fmt(g.endDate)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Habits preview */}
      {activeHabits.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 2, height: 12, borderRadius: 2, background: "linear-gradient(180deg,#f97316,#dc2626)" }} />
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#52525b", margin: 0 }}>Active Habits</p>
            </div>
            <button onClick={() => setActiveSection("habits")} style={{ fontSize: 11, color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activeHabits.slice(0, 3).map(h => {
              const isJoined = (h.members || []).some(m => (m._id || m)?.toString() === userId?.toString());
              const isCreator = (h.createdBy?._id || h.createdBy)?.toString() === userId?.toString();
              return (
                <div key={h._id} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(15,15,17,0.9)", border: "1px solid rgba(39,39,42,0.7)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🔥 {h.title}</p>
                    <p style={{ fontSize: 10, color: "#3f3f46", margin: "3px 0 0" }}>👥 {h.members?.length || 0} joined{h.streak > 0 ? ` · 🔥 ${h.streak}d` : ""}</p>
                  </div>
                  {!isCreator && (
                    <button onClick={() => isJoined ? onLeaveHabit(h._id) : onJoinHabit(h._id)}
                      style={{ padding: "4px 12px", borderRadius: 8, border: "none", fontSize: 10, fontWeight: 700, cursor: "pointer", flexShrink: 0, background: isJoined ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.1)", color: isJoined ? "#f87171" : "#22c55e" }}>
                      {isJoined ? "Leave" : "Join"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button onClick={onCreateGoal} style={{ padding: "13px", borderRadius: 12, border: "1px dashed rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.04)", color: "#f97316", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.08)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.04)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}>
          + New Goal
        </button>
        <button onClick={onCreateHabit} style={{ padding: "13px", borderRadius: 12, border: "1px dashed rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.04)", color: "#f97316", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.08)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.04)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}>
          + New Habit
        </button>
      </div>

      {goals.length === 0 && habits.length === 0 && (
        <div style={{ textAlign: "center", padding: "32px", borderRadius: 14, border: "1px dashed rgba(39,39,42,0.7)" }}>
          <p style={{ fontSize: 24, marginBottom: 8 }}>🚀</p>
          <p style={{ fontSize: 13, color: "#52525b" }}>Your circle is fresh! Add goals and habits to get started.</p>
        </div>
      )}
    </div>
  );
}

/* ─── Main CircleRoom component ─── */
export default function CircleRoom() {
  const { circleId } = useParams();
  const navigate     = useNavigate();
  const userData     = useSelector(s => s.auth.userData);

  const [circle,         setCircle]        = useState(null);
  const [goals,          setGoals]         = useState([]);
  const [habits,         setHabits]        = useState([]);
  const [loading,        setLoading]       = useState(true);
  const [activeSection,  setActiveSection] = useState("overview");
  const [showGoalModal,  setShowGoalModal]  = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);

  const userId = userData?._id;

  useEffect(() => {
    Promise.all([
      getCircleById(circleId),
      getCircleGoals(circleId).catch(() => ({ data: { data: [] } })),
      getCircleHabits(circleId).catch(() => ({ data: { data: [] } })),
    ]).then(([cRes, gRes, hRes]) => {
      setCircle(cRes.data.data);
      setGoals(gRes.data.data);
      setHabits(hRes.data.data);
    }).catch(console.log)
      .finally(() => setLoading(false));
  }, [circleId]);

  const handleJoinGoal   = async (id) => { await joinGoal(id);   const r = await getCircleGoals(circleId);   setGoals(r.data.data); };
  const handleLeaveGoal  = async (id) => { await leaveGoal(id);  const r = await getCircleGoals(circleId);   setGoals(r.data.data); };
  const handleJoinHabit  = async (id) => { await joinHabit(id);  const r = await getCircleHabits(circleId);  setHabits(r.data.data); };
  const handleLeaveHabit = async (id) => { await leaveHabit(id); const r = await getCircleHabits(circleId);  setHabits(r.data.data); };

  const hue      = circle ? circle.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 220;
  const initials = circle ? circle.name.slice(0, 2).toUpperCase() : "..";
  const isAdmin  = circle ? (circle.admin?._id === userId || circle.admin === userId) : false;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#080809", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 22, height: 22, border: "2px solid rgba(249,115,22,0.2)", borderTopColor: "#f97316", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  if (!circle) return (
    <div style={{ minHeight: "100vh", background: "#080809", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#52525b", fontFamily: "'DM Sans',sans-serif" }}>Circle not found.</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080809", fontFamily: "'DM Sans',sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin   { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .room-anim { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(39,39,42,0.8); border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar { height: 0px; }

        /* Responsive helpers */
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 641px) {
          .hidden-mobile { display: flex; }
          .show-mobile   { display: none !important; }
        }
      `}</style>

      {/* ── Room nav (replaces sidebar) ── */}
      <RoomNav
        circle={circle} hue={hue} initials={initials} isAdmin={isAdmin}
        activeSection={activeSection} setActiveSection={setActiveSection}
        onBack={() => navigate("/circles")}
        onCreateGoal={() => setShowGoalModal(true)}
        onCreateHabit={() => setShowHabitModal(true)}
      />

      {/* ── Content ── */}
      <main style={{ flex: 1, padding: "24px clamp(14px, 4vw, 32px)", maxWidth: 960, width: "100%", margin: "0 auto", boxSizing: "border-box" }} className="room-anim">

        {activeSection === "overview" && (
          <OverviewSection
            circle={circle} goals={goals} habits={habits} hue={hue} userId={userId}
            setActiveSection={setActiveSection}
            onCreateGoal={() => setShowGoalModal(true)}
            onCreateHabit={() => setShowHabitModal(true)}
            onJoinGoal={handleJoinGoal}
            onLeaveGoal={handleLeaveGoal}
            onJoinHabit={handleJoinHabit}
            onLeaveHabit={handleLeaveHabit}
          />
        )}
        {activeSection === "goals" && (
          <CircleGoalSection goals={goals} userId={userId}
            onJoin={handleJoinGoal} onLeave={handleLeaveGoal}
            onCreateGoal={() => setShowGoalModal(true)} />
        )}
        {activeSection === "habits" && (
          <CircleHabitSection habits={habits} userId={userId} circleId={circleId}
            onJoin={handleJoinHabit} onLeave={handleLeaveHabit}
            onCreateHabit={() => setShowHabitModal(true)} />
        )}
        {activeSection === "members" && (
          <CircleMembers circle={circle} userId={userId} isAdmin={isAdmin} />
        )}
        {activeSection === "analytics" && (
          <CircleAnalytics circle={circle} goals={goals} habits={habits} />
        )}
        {activeSection === "chat" && (
          <CircleChat circleId={circleId} userId={userId} userName={userData?.fullName || userData?.username} />
        )}
      </main>

      {/* Modals */}
      {showGoalModal  && <CreateCircleGoalModal  circleId={circleId} onClose={() => setShowGoalModal(false)}  onCreated={g => setGoals(p => [g, ...p])} />}
      {showHabitModal && <CreateCircleHabitModal circleId={circleId} onClose={() => setShowHabitModal(false)} onCreated={h => setHabits(p => [h, ...p])} />}
    </div>
  );
}