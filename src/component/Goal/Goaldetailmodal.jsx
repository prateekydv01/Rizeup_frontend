import { useState, useEffect } from "react";
import { getGoalById, markGoalComplete, verifyProof, getGoalLeaderboard, updateGoal, addDailyLog, getGoalLogs } from "../../api/goal.js";
import { useSelector } from "react-redux";

const fmt     = (d) => d ? new Date(d).toLocaleDateString("en-US",  { month:"short", day:"numeric", year:"numeric" }) : "—";
const fmtFull = (d) => d ? new Date(d).toLocaleString("en-US",      { month:"short", day:"numeric", year:"numeric", hour:"numeric", minute:"2-digit" }) : "—";

const IS  = { background:"#0d0d0f", border:"1px solid rgba(39,39,42,0.9)", color:"#f4f4f5", borderRadius:8, padding:"9px 12px", fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:"none", width:"100%", boxSizing:"border-box", transition:"border-color 0.2s" };
const fo  = e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.06)"; };
const bl  = e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)";  e.currentTarget.style.boxShadow = "none"; };
const Lbl = ({ c }) => <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#52525b", marginBottom:5, margin:"0 0 5px" }}>{c}</p>;

const TabBtn = ({ active, onClick, children, badge }) => (
  <button onClick={onClick} style={{ padding:"9px 14px", background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:700, letterSpacing:"0.06em", textTransform:"capitalize", color:active?"#f97316":"#52525b", borderBottom:active?"2px solid #f97316":"2px solid transparent", marginBottom:-1, transition:"color 0.15s", display:"flex", alignItems:"center", gap:5, flexShrink:0 }}>
    {children}
    {badge > 0 && <span style={{ background:"#f97316", color:"white", borderRadius:"50%", width:15, height:15, fontSize:8, fontWeight:800, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>{badge}</span>}
  </button>
);

/* ─── Overview Tab ─────────────────────────────────────────────────────────── */
function OverviewTab({ goal, currentUserId, onGoalUpdate }) {
  const [proof,      setProof]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [editing,    setEditing]    = useState(false);
  const [editTitle,  setEditTitle]  = useState(goal.title);
  const [editEnd,    setEditEnd]    = useState(goal.endDate?.slice(0, 10) || "");
  const [saving,     setSaving]     = useState(false);
  const [resEditing, setResEditing] = useState(false);
const [resources, setResources] = useState(goal.resources || []);
const [resSaving, setResSaving] = useState(false);
const [resError, setResError] = useState("");
const addRes = () => setResources(p => [...p, { name:"", url:"" }]);

const updateRes = (i, f, v) =>
  setResources(p => p.map((r, idx) => idx === i ? { ...r, [f]: v } : r));

const removeRes = (i) =>
  setResources(p => p.filter((_, idx) => idx !== i));

const handleSaveResources = async () => {
  const valid = resources.filter(r => r.name.trim() && r.url.trim());
  setResSaving(true); setResError("");
  try {
    const res = await updateGoal(goal._id, { resources: valid });
    onGoalUpdate({ ...goal, resources: valid, ...res.data.data });
    setResEditing(false);
  } catch (err) {
    setResError(err.response?.data?.message || "Failed to save resources");
  } finally {
    setResSaving(false);
  }
};

  const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / 86400000);
  const totalMs  = new Date(goal.endDate) - new Date(goal.startDate);
  const passedMs = new Date() - new Date(goal.startDate);
  const pct      = goal.status === "completed" ? 100 : Math.min(100, Math.max(0, Math.round((passedMs / totalMs) * 100)));
  const overdue  = daysLeft < 0 && goal.status !== "completed";

  const isCompleted = goal.completedBy?.some(c => (c.userId?._id || c.userId)?.toString() === currentUserId?.toString());
  const isPending   = goal.completionRequests?.some(r => (r.userId?._id || r.userId)?.toString() === currentUserId?.toString() && r.status === "pending");

  const handleComplete = async () => {
    if (goal.type === "circle" && !proof.trim()) { setError("Paste a proof URL to submit"); return; }
    setSubmitting(true); setError(""); setSuccess("");
    try {
      const res = await markGoalComplete(goal._id, goal.type === "circle" ? { proof } : {});
      onGoalUpdate({ ...goal, ...res.data.data });
      setSuccess(goal.type === "circle" ? "Proof submitted! Awaiting peer verification." : "Goal marked as complete! 🎉");
      setProof("");
    } catch (err) { setError(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editEnd) return;
    setSaving(true); setError("");
    try {
      const res = await updateGoal(goal._id, { title: editTitle, endDate: editEnd });
      onGoalUpdate({ ...goal, ...res.data.data });
      setEditing(false);
    } catch (err) { setError(err.response?.data?.message || "Failed to update"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Goal info card */}
      <div style={{ padding:16, borderRadius:12, background:"rgba(15,15,17,0.8)", border:"1px solid rgba(39,39,42,0.7)" }}>
        {editing ? (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div><Lbl c="Title" /><input value={editTitle} onChange={e => setEditTitle(e.target.value)} style={IS} onFocus={fo} onBlur={bl} /></div>
            <div><Lbl c="End Date" /><input type="date" value={editEnd} onChange={e => setEditEnd(e.target.value)} style={IS} onFocus={fo} onBlur={bl} /></div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setEditing(false)} style={{ flex:1, padding:8, borderRadius:8, border:"1px solid rgba(63,63,70,0.6)", background:"transparent", color:"#71717a", fontSize:12, fontWeight:600, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} style={{ flex:2, padding:8, borderRadius:8, border:"none", background:"linear-gradient(135deg,#f97316,#dc2626)", color:"white", fontSize:12, fontWeight:600, cursor:"pointer", opacity:saving?0.5:1 }}>
                {saving?"Saving…":"Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:16, color:"#f4f4f5", margin:0, flex:1, marginRight:8 }}>{goal.title}</h3>
              {goal.isOwner && (
                <button onClick={() => setEditing(true)} style={{ fontSize:10, fontWeight:700, color:"#52525b", background:"rgba(39,39,42,0.5)", border:"1px solid rgba(63,63,70,0.4)", padding:"3px 10px", borderRadius:6, cursor:"pointer", letterSpacing:"0.08em", transition:"all 0.15s", flexShrink:0 }}
                  onMouseEnter={e => { e.currentTarget.style.color="#f97316"; e.currentTarget.style.borderColor="rgba(249,115,22,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color="#52525b"; e.currentTarget.style.borderColor="rgba(63,63,70,0.4)"; }}>
                  ✏ Edit
                </button>
              )}
            </div>
            <div style={{ marginBottom:8 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:11, color:"#52525b" }}>{fmt(goal.startDate)} → {fmt(goal.endDate)}</span>
                <span style={{ fontSize:11, fontWeight:700, color:overdue?"#f87171":daysLeft<=7?"#fb923c":goal.status==="completed"?"#22c55e":"#52525b" }}>
                  {goal.status==="completed"?"Completed ✓":overdue?`${Math.abs(daysLeft)}d overdue`:daysLeft===0?"Due today":`${daysLeft}d left`}
                </span>
              </div>
              <div style={{ height:5, borderRadius:5, background:"rgba(39,39,42,0.8)", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${pct}%`, borderRadius:5, background:goal.status==="completed"?"linear-gradient(90deg,#22c55e,#16a34a)":overdue?"linear-gradient(90deg,#ef4444,#dc2626)":"linear-gradient(90deg,#f97316,#ef4444)", transition:"width 0.8s" }} />
              </div>
              <p style={{ fontSize:10, color:"#3f3f46", marginTop:4 }}>{pct}% of time elapsed</p>
            </div>
          </div>
        )}
      </div>
        {/* ─── Resources (Moved from ResourcesTab) ─── */}
{/* ─── Resources (Synced with Overview UI) ─── */}
<div style={{ padding:16, borderRadius:12, background:"rgba(15,15,17,0.8)", border:"1px solid rgba(39,39,42,0.7)" }}>
  
  {/* Header */}
  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
    <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#a1a1aa", margin:0 }}>
      Resources
    </p>

    {(
      resEditing ? (
        <div style={{ display:"flex", gap:8 }}>
          <button
            onClick={() => { setResEditing(false); setResources(goal.resources || []); }}
            style={{
              padding:"6px 10px",
              borderRadius:8,
              border:"1px solid rgba(63,63,70,0.6)",
              background:"transparent",
              color:"#71717a",
              fontSize:11,
              fontWeight:600,
              cursor:"pointer"
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSaveResources}
            disabled={resSaving}
            style={{
              padding:"6px 10px",
              borderRadius:8,
              border:"none",
              background:"linear-gradient(135deg,#f97316,#dc2626)",
              color:"white",
              fontSize:11,
              fontWeight:600,
              cursor:"pointer",
              opacity:resSaving ? 0.5 : 1
            }}
          >
            {resSaving ? "Saving…" : "Save"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setResEditing(true)}
          style={{
            fontSize:10,
            fontWeight:700,
            color:"#52525b",
            background:"rgba(39,39,42,0.5)",
            border:"1px solid rgba(63,63,70,0.4)",
            padding:"3px 10px",
            borderRadius:6,
            cursor:"pointer",
            letterSpacing:"0.08em",
            transition:"all 0.15s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#f97316";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.3)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "#52525b";
            e.currentTarget.style.borderColor = "rgba(63,63,70,0.4)";
          }}
        >
          ✏ Edit
        </button>
      )
    )}
  </div>

  {/* Error */}
  {resError && (
    <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(220,38,38,0.07)", border:"1px solid rgba(220,38,38,0.2)", color:"#f87171", fontSize:12 }}>
      {resError}
    </div>
  )}

  {/* EDIT MODE */}
  {resEditing ? (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {resources.map((r, i) => (
        <div key={i} style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          
          <input
            value={r.name}
            onChange={e => updateRes(i, "name", e.target.value)}
            placeholder="Name"
            style={{ ...IS, flex:"1 1 120px", fontSize:12, padding:"8px 11px" }}
            onFocus={fo}
            onBlur={bl}
          />

          <input
            value={r.url}
            onChange={e => updateRes(i, "url", e.target.value)}
            placeholder="URL"
            style={{ ...IS, flex:"2 1 180px", fontSize:12, padding:"8px 11px" }}
            onFocus={fo}
            onBlur={bl}
          />

          <button
            onClick={() => removeRes(i)}
            style={{
              background:"rgba(239,68,68,0.07)",
              border:"1px solid rgba(239,68,68,0.15)",
              color:"#f87171",
              width:30,
              height:30,
              borderRadius:8,
              cursor:"pointer",
              fontSize:14,
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={addRes}
        style={{
          display:"flex",
          alignItems:"center",
          gap:5,
          padding:"7px 12px",
          borderRadius:8,
          background:"transparent",
          border:"1px dashed rgba(249,115,22,0.3)",
          color:"#f97316",
          fontSize:12,
          fontWeight:600,
          cursor:"pointer",
          width:"fit-content",
          transition:"all 0.15s"
        }}
        onMouseEnter={e => e.currentTarget.style.background="rgba(249,115,22,0.06)"}
        onMouseLeave={e => e.currentTarget.style.background="transparent"}
      >
        + Add Resource
      </button>
    </div>
  ) : (
    
    /* VIEW MODE */
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {(goal.resources || []).length === 0 && (
        <p style={{ fontSize:12, color:"#3f3f46", textAlign:"center", padding:"24px 0" }}>
          No resources attached.
        </p>
      )}

      {(goal.resources || []).map((r, i) => (
        <a
          key={i}
          href={r.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display:"flex",
            alignItems:"center",
            gap:12,
            padding:"12px 16px",
            borderRadius:10,
            background:"rgba(15,15,17,0.8)",
            border:"1px solid rgba(39,39,42,0.7)",
            textDecoration:"none",
            transition:"all 0.15s"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
            e.currentTarget.style.background = "rgba(249,115,22,0.04)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "rgba(39,39,42,0.7)";
            e.currentTarget.style.background = "rgba(15,15,17,0.8)";
          }}
        >
          <div style={{
            width:36,
            height:36,
            borderRadius:8,
            background:"rgba(249,115,22,0.1)",
            border:"1px solid rgba(249,115,22,0.18)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:16
          }}>
            🔗
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#f4f4f5", margin:0 }}>
              {r.name}
            </p>
            <p style={{
              fontSize:11,
              color:"#52525b",
              margin:"2px 0 0",
              overflow:"hidden",
              textOverflow:"ellipsis",
              whiteSpace:"nowrap"
            }}>
              {r.url}
            </p>
          </div>

          <span style={{ color:"#52525b" }}>↗</span>
        </a>
      ))}
    </div>
  )}
</div>
      {/* Completions */}
      {isCompleted && (
  <div style={{
    marginTop:10,
    padding:"10px 12px",
    borderRadius:10,
    background:"rgba(34,197,94,0.07)",
    border:"1px solid rgba(34,197,94,0.2)",
    display:"flex",
    alignItems:"center",
    gap:8
  }}>
    <span style={{ fontSize:14 }}>✅</span>
    <p style={{
      fontSize:12,
      fontWeight:700,
      color:"#22c55e",
      margin:0
    }}>
      You completed this goal
    </p>
  </div>
)}

      {error   && <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(220,38,38,0.07)", border:"1px solid rgba(220,38,38,0.2)", color:"#f87171", fontSize:12 }}>{error}</div>}
      {success && <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(34,197,94,0.07)", border:"1px solid rgba(34,197,94,0.2)", color:"#22c55e", fontSize:12 }}>{success}</div>}

      {/* Complete action */}
      {goal.status !== "backlog" && !isCompleted && !isPending && (
        <div style={{ padding:16, borderRadius:12, background:"rgba(15,15,17,0.8)", border:"1px solid rgba(39,39,42,0.7)" }}>
          <p style={{ fontSize:11, fontWeight:700, color:"#a1a1aa", marginBottom:12, letterSpacing:"0.08em", textTransform:"uppercase" }}>
            {goal.type==="circle"?"Submit Completion Proof":"Mark Complete"}
          </p>
          {goal.type === "circle" && (
            <div style={{ marginBottom:10 }}>
              <input value={proof} onChange={e => setProof(e.target.value)} placeholder="Paste proof URL (screenshot, video, doc…)"
                style={IS} onFocus={fo} onBlur={bl} />
              <p style={{ fontSize:10, color:"#3f3f46", marginTop:5 }}>More than 50% of goal members must approve.</p>
            </div>
          )}
          <button onClick={handleComplete} disabled={submitting||(goal.type==="circle"&&!proof.trim())}
            style={{ width:"100%", padding:11, borderRadius:10, border:"none", background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"white", fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", opacity:submitting||(goal.type==="circle"&&!proof.trim())?0.45:1, transition:"opacity 0.2s" }}>
            {submitting?"Submitting…":goal.type==="circle"?"📎 Submit for Verification":"✓ Mark as Complete"}
          </button>
        </div>
      )}

      {isPending && (
        <div style={{ padding:"14px 16px", borderRadius:12, background:"rgba(234,179,8,0.05)", border:"1px solid rgba(234,179,8,0.15)", display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>⏳</span>
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:"#fbbf24", margin:"0 0 3px" }}>Awaiting Verification</p>
            <p style={{ fontSize:11, color:"#52525b", margin:0 }}>Your proof is submitted. Circle members are reviewing it.</p>
          </div>
        </div>
      )}

      {goal.status === "backlog" && !isCompleted && (
        <div style={{ padding:"14px 16px", borderRadius:12, background:"rgba(113,113,122,0.07)", border:"1px solid rgba(113,113,122,0.2)", display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:18, flexShrink:0 }}>⚠️</span>
          <div>
            <p style={{ fontSize:12, fontWeight:700, color:"#71717a", margin:"0 0 3px" }}>Moved to backlog — deadline passed</p>
            <p style={{ fontSize:11, color:"#52525b", margin:0 }}>You can still complete it.</p>
          </div>
        </div>
      )}
    </div>
  );
}


/* ─── Verifications Tab ─────────────────────────────────────────────────────── */
function VerificationsTab({ goal, currentUserId, onGoalUpdate }) {
  const [voting, setVoting] = useState({});
  const [error,  setError]  = useState("");

  // ✅ Show all OTHER members' pending/completed requests (not mine)
  const requests = (goal.completionRequests || []).filter(r => {
    const reqUserId = (r.userId?._id || r.userId)?.toString();
    return reqUserId !== currentUserId?.toString();
  });

  const handleVote = async (requestId, action) => {
    setVoting(p => ({ ...p, [requestId]:true })); setError("");
    try {
      const res = await verifyProof(goal._id, requestId, action);
      onGoalUpdate({ ...goal, ...res.data.data });
    } catch (err) { setError(err.response?.data?.message || "Vote failed"); }
    finally { setVoting(p => ({ ...p, [requestId]:false })); }
  };

  if (!requests.length) return (
    <div style={{ textAlign:"center", padding:"40px 0" }}>
      <p style={{ fontSize:24, marginBottom:8 }}>🗳️</p>
      <p style={{ fontSize:13, color:"#3f3f46" }}>No verification requests from other members yet.</p>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
      {error && <div style={{ padding:"9px 13px", borderRadius:8, background:"rgba(220,38,38,0.07)", border:"1px solid rgba(220,38,38,0.2)", color:"#f87171", fontSize:12 }}>{error}</div>}
      {requests.map((req, i) => {
        const statusColor = req.status==="approved"?"#22c55e":req.status==="rejected"?"#f87171":"#fbbf24";
        const totalVoters = (req.totalMembersAtRequest || 2) - 1;
        const needed      = Math.floor(totalVoters / 2) + 1;
        const hasVoted    =
          req.approvals?.some(a => (a.userId?._id || a.userId)?.toString() === currentUserId?.toString()) ||
          req.rejections?.some(r => (r.userId?._id || r.userId)?.toString() === currentUserId?.toString());

        return (
          <div key={req._id || i} style={{ borderRadius:12, overflow:"hidden", border:`1px solid ${req.status==="approved"?"rgba(34,197,94,0.2)":req.status==="rejected"?"rgba(239,68,68,0.15)":"rgba(234,179,8,0.2)"}`, background:"rgba(8,8,10,0.7)" }}>
            <div style={{ height:2, background:req.status==="approved"?"linear-gradient(90deg,#22c55e,transparent)":req.status==="rejected"?"linear-gradient(90deg,#ef4444,transparent)":"linear-gradient(90deg,#eab308,transparent)" }} />
            <div style={{ padding:"14px 16px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10, flexWrap:"wrap", gap:6 }}>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:"#f4f4f5", margin:"0 0 3px" }}>{req.userId?.fullName || req.userId?.username || `Member #${i+1}`}</p>
                  <p style={{ fontSize:10, color:"#52525b", margin:0 }}>Submitted {fmtFull(req.createdAt)}</p>
                </div>
                <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"3px 9px", borderRadius:20, background:`${statusColor}15`, border:`1px solid ${statusColor}40`, color:statusColor }}>{req.status}</span>
              </div>

              <a href={req.proof} target="_blank" rel="noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"5px 12px", borderRadius:8, background:"rgba(39,39,42,0.5)", border:"1px solid rgba(63,63,70,0.5)", color:"#a1a1aa", fontSize:11, fontWeight:600, textDecoration:"none", marginBottom:12, transition:"all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(249,115,22,0.35)"; e.currentTarget.style.color="#f97316"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(63,63,70,0.5)"; e.currentTarget.style.color="#a1a1aa"; }}>
                📎 View Proof ↗
              </a>

              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:req.status==="pending"&&!hasVoted?12:0 }}>
                <span style={{ fontSize:11, color:"#22c55e" }}>✓ {req.approvals?.length||0} approvals</span>
                <span style={{ fontSize:11, color:"#f87171" }}>✕ {req.rejections?.length||0} rejections</span>
                <span style={{ fontSize:10, color:"#3f3f46" }}>Need {needed}</span>
              </div>

              {req.status === "pending" && !hasVoted && (
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => handleVote(req._id, "approve")} disabled={voting[req._id]}
                    style={{ flex:1, padding:8, borderRadius:8, border:"1px solid rgba(34,197,94,0.25)", background:"rgba(34,197,94,0.07)", color:"#22c55e", fontSize:12, fontWeight:700, cursor:"pointer", opacity:voting[req._id]?0.5:1, transition:"opacity 0.15s" }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => handleVote(req._id, "reject")} disabled={voting[req._id]}
                    style={{ flex:1, padding:8, borderRadius:8, border:"1px solid rgba(239,68,68,0.18)", background:"rgba(239,68,68,0.06)", color:"#f87171", fontSize:12, fontWeight:700, cursor:"pointer", opacity:voting[req._id]?0.5:1, transition:"opacity 0.15s" }}>
                    ✕ Reject
                  </button>
                </div>
              )}
              {req.status === "pending" && hasVoted && (
                <p style={{ fontSize:11, color:"#52525b", margin:0, fontStyle:"italic" }}>You've already voted on this.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Daily Logs Tab ────────────────────────────────────────────────────────── */
function LogsTab({ goalId, isOwner, isMember }) {
  const [logs,       setLogs]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [text,       setText]       = useState("");
  const [proof,      setProof]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitErr,  setSubmitErr]  = useState("");
  const [submitOk,   setSubmitOk]   = useState("");

  const canLog = isOwner || isMember;

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" }) : "—";

  useEffect(() => {
    getGoalLogs(goalId)
      .then(r => setLogs(r.data.data))
      .catch(() => setError("Failed to load logs"))
      .finally(() => setLoading(false));
  }, [goalId]);

  const handleSubmit = async () => {
    if (!text.trim()) { setSubmitErr("Write something about your progress today"); return; }
    setSubmitting(true); setSubmitErr(""); setSubmitOk("");
    try {
      const res = await addDailyLog(goalId, { text: text.trim(), proof: proof.trim()||undefined });
      setLogs(prev => [res.data.data, ...prev]);
      setText(""); setProof("");
      setSubmitOk("Log added ✓");
      setTimeout(() => setSubmitOk(""), 2500);
    } catch (err) { setSubmitErr(err.response?.data?.message || "Failed to log"); }
    finally { setSubmitting(false); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

      {/* Add log form */}
      {canLog && (
        <div style={{ padding:16, borderRadius:12, background:"rgba(15,15,17,0.8)", border:"1px solid rgba(39,39,42,0.7)" }}>
          <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#52525b", marginBottom:12 }}>Today's Log</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
              placeholder="What did you work on today? Share your progress…"
              style={{ ...IS, resize:"none" }} onFocus={fo} onBlur={bl} />
            <input value={proof} onChange={e => setProof(e.target.value)}
              placeholder="Proof URL (optional — screenshot, video, etc.)"
              style={{ ...IS, fontSize:12 }} onFocus={fo} onBlur={bl} />
            {submitErr && <p style={{ fontSize:11, color:"#f87171", margin:0 }}>{submitErr}</p>}
            {submitOk  && <p style={{ fontSize:11, color:"#22c55e", margin:0 }}>{submitOk}</p>}
            <button onClick={handleSubmit} disabled={submitting||!text.trim()}
              style={{ padding:"10px", borderRadius:9, border:"none", background:!text.trim()?"rgba(39,39,42,0.5)":"linear-gradient(135deg,#f97316,#dc2626)", color:"white", fontSize:13, fontWeight:600, cursor:!text.trim()?"not-allowed":"pointer", opacity:submitting?0.5:1, transition:"all 0.2s" }}>
              {submitting?"Submitting…":"Add Today's Log"}
            </button>
          </div>
        </div>
      )}

      {/* Logs list */}
      {loading && (
        <div style={{ display:"flex", justifyContent:"center", padding:"24px 0" }}>
          <div style={{ width:18, height:18, border:"2px solid rgba(249,115,22,0.2)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        </div>
      )}
      {error && <div style={{ padding:"10px 14px", borderRadius:10, background:"rgba(220,38,38,0.07)", border:"1px solid rgba(220,38,38,0.2)", color:"#f87171", fontSize:12 }}>{error}</div>}

      {!loading && logs.length === 0 && (
        <div style={{ textAlign:"center", padding:"32px 0" }}>
          <p style={{ fontSize:24, marginBottom:8 }}>📓</p>
          <p style={{ fontSize:13, color:"#3f3f46" }}>No logs yet. Start tracking daily progress!</p>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {logs.map((log, i) => (
          <div key={log._id || i} style={{ padding:"14px 16px", borderRadius:12, background:"rgba(15,15,17,0.8)", border:"1px solid rgba(39,39,42,0.7)", borderLeft:"3px solid rgba(249,115,22,0.4)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, flexWrap:"wrap", gap:4 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:12, fontWeight:700, color:"#f97316" }}>{log.userId?.fullName || log.userId?.username || "You"}</span>
                <span style={{ fontSize:10, color:"#3f3f46" }}>·</span>
                <span style={{ fontSize:10, color:"#52525b" }}>{fmtDate(log.date)}</span>
              </div>
              {log.proof && (
                <a href={log.proof} target="_blank" rel="noreferrer"
                  style={{ fontSize:10, color:"#f97316", textDecoration:"none", display:"flex", alignItems:"center", gap:3 }}>
                  📎 Proof ↗
                </a>
              )}
            </div>
            <p style={{ fontSize:13, color:"#d4d4d8", margin:0, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{log.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Leaderboard Tab ───────────────────────────────────────────────────────── */
function LeaderboardTab({ goalId }) {
  const [board,   setBoard]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const medals = ["🥇","🥈","🥉"];

  useEffect(() => {
    getGoalLeaderboard(goalId)
      .then(r => setBoard(r.data.data))
      .catch(() => setError("Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, [goalId]);

  if (loading) return <div style={{ textAlign:"center", padding:"40px 0" }}><div style={{ width:18, height:18, border:"2px solid rgba(249,115,22,0.2)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto" }} /></div>;
  if (error)   return <div style={{ padding:"12px 14px", borderRadius:10, background:"rgba(220,38,38,0.07)", border:"1px solid rgba(220,38,38,0.2)", color:"#f87171", fontSize:12 }}>{error}</div>;
  if (!board.length) return <div style={{ textAlign:"center", padding:"40px 0" }}><p style={{ fontSize:14, color:"#3f3f46" }}>No completions yet.</p></div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {board.map((e, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderRadius:12, background:i===0?"rgba(249,115,22,0.06)":"rgba(15,15,17,0.8)", border:i===0?"1px solid rgba(249,115,22,0.2)":"1px solid rgba(39,39,42,0.7)" }}>
          <span style={{ fontSize:20, flexShrink:0 }}>{medals[i]||`#${i+1}`}</span>
          <div style={{ flex:1 }}>
            <p style={{ fontSize:13, fontWeight:700, color:i===0?"#f97316":"#f4f4f5", margin:0 }}>{e?.fullName||e?.username||"User"}</p>
            <p style={{ fontSize:10, color:"#52525b", margin:"2px 0 0" }}>Completed {fmtFull(e.completedAt)}</p>
          </div>
          <span style={{ fontSize:12, fontWeight:700, color:i===0?"#f97316":"#52525b" }}>Rank #{i+1}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Modal ────────────────────────────────────────────────────────────── */
export default function GoalDetailModal({ goal: initialGoal, onClose, onUpdate }) {
  const [goal,      setGoal]      = useState(initialGoal);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading,   setLoading]   = useState(true);

  const currentUserId = useSelector(
    state => state.auth.userData?._id
  )?.toString();

  useEffect(() => {
    getGoalById(goal._id)
      .then(r => setGoal(r.data.data))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [goal._id]);

  const handleGoalUpdate = (updated) => {
    setGoal(updated);
    if (onUpdate) onUpdate(updated);
  };

  const pendingVerifications = (goal.completionRequests || []).filter(r => {
    const reqId = (r.userId?._id || r.userId)?.toString();
    return reqId !== currentUserId?.toString() && r.status === "pending";
  }).length;


  const isOwner  = goal.isOwner  || (goal.createdBy?._id || goal.createdBy)?.toString() === currentUserId?.toString();
  const isMember = goal.isJoined || isOwner;

  const tabs = [
    { key:"overview",  label:"Overview" },
    { key:"logs",      label:"Logs" },
    ...(goal.type==="circle" ? [
      { key:"verifications", label:"Verify", badge:pendingVerifications },
      { key:"leaderboard",   label:"Board" },
    ] : [
      { key:"leaderboard", label:"Board" },
    ]),
  ];

  return (
    <div style={{ position:"fixed", top:0, left:0, right:0, bottom:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(10px)", WebkitBackdropFilter:"blur(10px)" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ width:"100%", maxWidth:580, background:"linear-gradient(160deg,#111113,#0d0d0f)", border:"1px solid rgba(39,39,42,0.9)", borderRadius:18, overflow:"hidden", maxHeight:"92vh", display:"flex", flexDirection:"column", boxShadow:"0 30px 80px rgba(0,0,0,0.7)" }}>
        <div style={{ height:3, background:goal.status==="completed"?"linear-gradient(90deg,#22c55e,#16a34a,transparent)":goal.status==="backlog"?"linear-gradient(90deg,#52525b,transparent)":"linear-gradient(90deg,#f97316,#ef4444,transparent)", flexShrink:0 }} />

        {/* Header */}
        <div style={{ padding:"20px 24px 0", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, marginBottom:14 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7, flexWrap:"wrap", marginBottom:5 }}>
                <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:900, fontSize:"clamp(15px,4vw,18px)", color:"#f4f4f5", margin:0, letterSpacing:"-0.01em" }}>{goal.title}</h2>
                {goal.type==="circle" && (
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.22)", color:"#a5b4fc", letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    ⭕ {goal.circleId?.name||"Circle"}
                  </span>
                )}
              </div>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 9px", borderRadius:20, textTransform:"uppercase", letterSpacing:"0.1em", background:goal.status==="completed"?"rgba(34,197,94,0.1)":goal.status==="backlog"?"rgba(113,113,122,0.1)":"rgba(249,115,22,0.1)", border:goal.status==="completed"?"1px solid rgba(34,197,94,0.25)":goal.status==="backlog"?"1px solid rgba(113,113,122,0.25)":"1px solid rgba(249,115,22,0.25)", color:goal.status==="completed"?"#22c55e":goal.status==="backlog"?"#71717a":"#f97316" }}>
                {goal.status}
              </span>
            </div>
            <button onClick={onClose} style={{ background:"rgba(39,39,42,0.5)", border:"1px solid rgba(63,63,70,0.5)", color:"#71717a", width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color="#f4f4f5"}
              onMouseLeave={e => e.currentTarget.style.color="#71717a"}>×</button>
          </div>

          {/* Tabs — scrollable on mobile */}
          <div style={{ display:"flex", borderBottom:"1px solid rgba(39,39,42,0.7)", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
            {tabs.map(t => <TabBtn key={t.key} active={activeTab===t.key} onClick={() => setActiveTab(t.key)} badge={t.badge}>{t.label}</TabBtn>)}
          </div>
        </div>

        {/* Content */}
        <div style={{ overflowY:"auto", padding:"18px 24px 24px", flex:1 }}>
          {loading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 0" }}>
              <div style={{ width:20, height:20, border:"2px solid rgba(249,115,22,0.2)", borderTopColor:"#f97316", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
            </div>
          ) : (
          
            <>
              {activeTab==="overview"      && <OverviewTab      goal={goal} currentUserId={currentUserId} onGoalUpdate={handleGoalUpdate} />}
              {activeTab==="logs"          && <LogsTab          goalId={goal._id} isOwner={isOwner} isMember={isMember} />}
              {activeTab==="verifications" && <VerificationsTab goal={goal} currentUserId={currentUserId} onGoalUpdate={handleGoalUpdate} />}
              {activeTab==="leaderboard"   && <LeaderboardTab   goalId={goal._id} />}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );
}