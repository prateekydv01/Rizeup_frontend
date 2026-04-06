import { useState, useEffect, useRef } from "react";
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

export default function CircleRoom() {
  const { circleId } = useParams();
  const navigate     = useNavigate();
  const userData     = useSelector(s => s.auth.userData);

  const [circle,         setCircle]         = useState(null);
  const [goals,          setGoals]           = useState([]);
  const [habits,         setHabits]          = useState([]);
  const [loading,        setLoading]         = useState(true);
  const [activeSection,  setActiveSection]   = useState("overview");
  const [showGoalModal,  setShowGoalModal]   = useState(false);
  const [showHabitModal, setShowHabitModal]  = useState(false);
  const [sidebarOpen,    setSidebarOpen]     = useState(false);

  const userId = userData?._id;

  useEffect(() => {
    Promise.all([
      getCircleById(circleId),
      getCircleGoals(circleId).catch(() => ({ data: { data: [] } })),
      getCircleHabits(circleId).catch(() => ({ data: { data: [] } })),
    ]).then(([circleRes, goalsRes, habitsRes]) => {
      setCircle(circleRes.data.data);
      setGoals(goalsRes.data.data);
      setHabits(habitsRes.data.data);
    }).catch(console.log)
      .finally(() => setLoading(false));
  }, [circleId]);

  const handleJoinGoal  = async (goalId) => {
    await joinGoal(goalId);
    const res = await getCircleGoals(circleId);
    setGoals(res.data.data);
  };
  const handleLeaveGoal = async (goalId) => {
    await leaveGoal(goalId);
    const res = await getCircleGoals(circleId);
    setGoals(res.data.data);
  };
  const handleJoinHabit  = async (habitId) => {
    await joinHabit(habitId);
    const res = await getCircleHabits(circleId);
    setHabits(res.data.data);
  };
  const handleLeaveHabit = async (habitId) => {
    await leaveHabit(habitId);
    const res = await getCircleHabits(circleId);
    setHabits(res.data.data);
  };

  const hue = circle ? circle.name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360 : 220;

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

  const isAdmin   = circle.admin?._id === userId || circle.admin === userId;
  const initials  = circle.name.slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "#080809", display: "flex", fontFamily: "'DM Sans',sans-serif", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-10px); } to { opacity:1; transform:translateX(0); } }
        .room-anim { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(39,39,42,0.8); border-radius: 4px; }
      `}</style>

      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: 220, flexShrink: 0, background: "#0a0a0c",
        borderRight: "1px solid rgba(39,39,42,0.7)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
      }}
        className="hidden md:flex">
        <SidebarContent
          circle={circle} hue={hue} initials={initials} isAdmin={isAdmin}
          activeSection={activeSection} setActiveSection={setActiveSection}
          onBack={() => navigate("/circles")}
          onCreateGoal={() => setShowGoalModal(true)}
          onCreateHabit={() => setShowHabitModal(true)}
        />
      </aside>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.7)" }}
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside style={{
        position: "fixed", top: 0, left: 0, height: "100vh", width: 220, zIndex: 50,
        background: "#0a0a0c", borderRight: "1px solid rgba(39,39,42,0.7)",
        display: "flex", flexDirection: "column", overflowY: "auto",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.28s cubic-bezier(0.22,1,0.36,1)",
      }}
        className="md:hidden">
        <SidebarContent
          circle={circle} hue={hue} initials={initials} isAdmin={isAdmin}
          activeSection={activeSection}
          setActiveSection={(s) => { setActiveSection(s); setSidebarOpen(false); }}
          onBack={() => navigate("/circles")}
          onCreateGoal={() => { setShowGoalModal(true); setSidebarOpen(false); }}
          onCreateHabit={() => { setShowHabitModal(true); setSidebarOpen(false); }}
        />
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

        {/* Mobile topbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(39,39,42,0.6)", background: "#0a0a0c" }}
          className="md:hidden">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: 4 }}>☰</button>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 14, color: "#f4f4f5" }}>{circle.name}</span>
        </div>

        {/* Content area */}
        <div style={{ flex: 1, padding: "24px 28px", maxWidth: 900, width: "100%" }} className="room-anim">

          {activeSection === "overview" && (
            <OverviewSection circle={circle} goals={goals} habits={habits} hue={hue}
              setActiveSection={setActiveSection}
              onCreateGoal={() => setShowGoalModal(true)}
              onCreateHabit={() => setShowHabitModal(true)} />
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
        </div>
      </main>

      {/* Modals */}
      {showGoalModal  && <CreateCircleGoalModal  circleId={circleId} onClose={() => setShowGoalModal(false)}  onCreated={g => setGoals(p => [g, ...p])} />}
      {showHabitModal && <CreateCircleHabitModal circleId={circleId} onClose={() => setShowHabitModal(false)} onCreated={h => setHabits(p => [h, ...p])} />}
    </div>
  );
}

function SidebarContent({ circle, hue, initials, isAdmin, activeSection, setActiveSection, onBack, onCreateGoal, onCreateHabit }) {
  return (
    <>
      {/* Back */}
      <div style={{ padding: "16px 14px 12px" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#52525b", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", padding: "4px 0", transition: "color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "#f97316"}
          onMouseLeave={e => e.currentTarget.style.color = "#52525b"}>
          ← Circles
        </button>
      </div>

      {/* Circle identity */}
      <div style={{ padding: "0 14px 16px", borderBottom: "1px solid rgba(39,39,42,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg,hsla(${hue},60%,45%,0.3),hsla(${hue},60%,35%,0.15))`, border: `1px solid hsla(${hue},60%,50%,0.35)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 14, color: `hsl(${hue},70%,65%)`, flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, color: "#f4f4f5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{circle.name}</p>
            <p style={{ fontSize: 10, color: "#3f3f46", margin: "2px 0 0", fontFamily: "'DM Mono',monospace", letterSpacing: "0.1em" }}>{circle.code}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, color: "#52525b", background: "rgba(39,39,42,0.5)", borderRadius: 6, padding: "2px 7px" }}>👥 {circle.members?.length || 0} members</span>
          {isAdmin && <span style={{ fontSize: 10, color: "#f97316", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 6, padding: "2px 7px" }}>Admin</span>}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "10px 8px", flex: 1 }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#27272a", padding: "4px 6px 8px" }}>Channels</p>
        {NAV.map(item => (
          <button key={item.key} onClick={() => setActiveSection(item.key)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, fontWeight: activeSection === item.key ? 600 : 400, transition: "all 0.15s", marginBottom: 2, background: activeSection === item.key ? "rgba(249,115,22,0.1)" : "transparent", color: activeSection === item.key ? "#f97316" : "#71717a" }}
            onMouseEnter={e => { if (activeSection !== item.key) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#d4d4d8"; } }}
            onMouseLeave={e => { if (activeSection !== item.key) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#71717a"; } }}>
            <span style={{ fontSize: 14, width: 18, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
            {item.key === activeSection && <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#f97316" }} />}
          </button>
        ))}
      </nav>

      {/* Create actions */}
      <div style={{ padding: "10px 8px 16px", borderTop: "1px solid rgba(39,39,42,0.5)" }}>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#27272a", padding: "4px 6px 8px" }}>Create</p>
        <button onClick={onCreateGoal} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: 12, fontWeight: 600, background: "transparent", color: "#52525b", transition: "all 0.15s", marginBottom: 2 }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.07)"; e.currentTarget.style.color = "#f97316"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#52525b"; }}>
          + New Goal
        </button>
        <button onClick={onCreateHabit} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: 12, fontWeight: 600, background: "transparent", color: "#52525b", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.07)"; e.currentTarget.style.color = "#f97316"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#52525b"; }}>
          + New Habit
        </button>
      </div>
    </>
  );
}

function OverviewSection({ circle, goals, habits, hue, setActiveSection, onCreateGoal, onCreateHabit }) {
  const activeGoals     = goals.filter(g => g.status === "active");
  const completedGoals  = goals.filter(g => g.status === "completed");
  const activeHabits    = habits.filter(h => h.isActive !== false);

  const StatCard = ({ icon, value, label, onClick }) => (
    <div onClick={onClick} style={{ padding: "16px 18px", borderRadius: 14, background: "linear-gradient(145deg,#111113,#0d0d0f)", border: "1px solid rgba(39,39,42,0.8)", cursor: onClick ? "pointer" : "default", transition: "all 0.2s" }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = "rgba(249,115,22,0.25)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.8)"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <p style={{ fontSize: 20, marginBottom: 8 }}>{icon}</p>
      <p style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 24, color: "#f97316", margin: "0 0 3px" }}>{value}</p>
      <p style={{ fontSize: 11, color: "#52525b", margin: 0 }}>{label}</p>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: `linear-gradient(135deg,hsla(${hue},60%,45%,0.25),hsla(${hue},60%,35%,0.12))`, border: `1px solid hsla(${hue},60%,50%,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: `hsl(${hue},70%,65%)` }}>
            {circle.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.5rem", color: "#f4f4f5", margin: 0, letterSpacing: "-0.01em" }}>{circle.name}</h1>
            <p style={{ fontSize: 11, color: "#3f3f46", margin: "2px 0 0", fontFamily: "'DM Mono',monospace", letterSpacing: "0.12em" }}>{circle.code} · {circle.members?.length || 0} members</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10 }}>
        <StatCard icon="👥" value={circle.members?.length || 0} label="Members" onClick={() => setActiveSection("members")} />
        <StatCard icon="🎯" value={activeGoals.length} label="Active goals" onClick={() => setActiveSection("goals")} />
        <StatCard icon="✅" value={completedGoals.length} label="Completed goals" onClick={() => setActiveSection("goals")} />
        <StatCard icon="🔥" value={activeHabits.length} label="Active habits" onClick={() => setActiveSection("habits")} />
      </div>

      {/* Recent goals preview */}
      {activeGoals.length > 0 && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#52525b", margin: 0 }}>Active Goals</p>
            <button onClick={() => setActiveSection("goals")} style={{ fontSize: 11, color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {activeGoals.slice(0, 3).map(g => (
              <div key={g._id} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(15,15,17,0.8)", border: "1px solid rgba(39,39,42,0.7)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🎯 {g.title}</span>
                <span style={{ fontSize: 10, color: "#52525b", flexShrink: 0 }}>{g.members?.length || 0} joined</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onCreateGoal} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px dashed rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.04)", color: "#f97316", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.08)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.04)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}>
          + New Goal
        </button>
        <button onClick={onCreateHabit} style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1px dashed rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.04)", color: "#f97316", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(249,115,22,0.08)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(249,115,22,0.04)"; e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)"; }}>
          + New Habit
        </button>
      </div>
    </div>
  );
}