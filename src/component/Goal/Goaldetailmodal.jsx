import { useState } from "react";
import { markGoalComplete, verifyProof } from "../../api/goal.js";

const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";
const fmtFull = (d) => d ? new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

export default function GoalDetailModal({ goal: initialGoal, onClose, onUpdate }) {
  const [goal,       setGoal]       = useState(initialGoal);
  const [activeTab,  setActiveTab]  = useState("overview");
  const [proof,      setProof]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [voting,     setVoting]     = useState({});
  const [error,      setError]      = useState("");

  const tabs = ["overview", "resources", ...(goal.type === "circle" ? ["verifications"] : [])];

  const handleComplete = async () => {
    if (goal.type === "circle" && !proof.trim()) {
      setError("Please paste a proof URL (image, video, Google Drive link, etc.)");
      return;
    }
    setSubmitting(true); setError("");
    try {
      const res = await markGoalComplete(goal._id, goal.type === "circle" ? { proof } : {});
      const updated = { ...goal, ...res.data.data };
      setGoal(updated);
      if (onUpdate) onUpdate(updated);
      setProof("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
    } finally { setSubmitting(false); }
  };

  const handleVote = async (requestId, action) => {
    setVoting(p => ({ ...p, [requestId]: true }));
    try {
      const res = await verifyProof(goal._id, requestId, action);
      const updated = { ...goal, ...res.data.data };
      setGoal(updated);
      if (onUpdate) onUpdate(updated);
    } catch (err) {
      setError(err.response?.data?.message || "Vote failed");
    } finally { setVoting(p => ({ ...p, [requestId]: false })); }
  };

  const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / 86400000);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "100%", maxWidth: 560, background: "linear-gradient(145deg,#111113,#0e0e10)", border: "1px solid rgba(63,63,70,0.8)", borderRadius: 16, overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 2, background: goal.status === "completed" ? "linear-gradient(90deg,#22c55e,#16a34a)" : goal.status === "backlog" ? "linear-gradient(90deg,#52525b,transparent)" : "linear-gradient(90deg,#f97316,#ef4444 40%,transparent)", flexShrink: 0 }} />

        {/* Header */}
        <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: "var(--text-primary)", marginBottom: 6 }}>{goal.title}</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>📅 {fmt(goal.startDate)} → {fmt(goal.endDate)}</span>
                {goal.status === "active" && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: daysLeft < 0 ? "#f87171" : daysLeft <= 7 ? "#fb923c" : "var(--text-faint)" }}>
                    {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                  </span>
                )}
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em", background: goal.status === "completed" ? "rgba(34,197,94,0.1)" : goal.status === "backlog" ? "rgba(113,113,122,0.1)" : "rgba(249,115,22,0.1)", border: goal.status === "completed" ? "1px solid rgba(34,197,94,0.3)" : goal.status === "backlog" ? "1px solid rgba(113,113,122,0.3)" : "1px solid rgba(249,115,22,0.3)", color: goal.status === "completed" ? "#22c55e" : goal.status === "backlog" ? "#71717a" : "#f97316" }}>
                  {goal.status}
                </span>
                {goal.type === "circle" && (
                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.1em", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316" }}>
                    ⭕ {goal.circleId?.name || "Circle"}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 22, cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(39,39,42,0.6)" }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "capitalize", transition: "all 0.15s", color: activeTab === tab ? "#f97316" : "var(--text-faint)", borderBottom: activeTab === tab ? "2px solid #f97316" : "2px solid transparent", marginBottom: -1 }}>
                {tab}
                {tab === "verifications" && goal.completionRequests?.filter(r => r.status === "pending").length > 0 && (
                  <span style={{ marginLeft: 5, fontSize: 9, background: "#f97316", color: "white", borderRadius: "50%", width: 14, height: 14, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                    {goal.completionRequests.filter(r => r.status === "pending").length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ overflowY: "auto", padding: "16px 24px 24px", flex: 1 }}>

          {/* Overview tab */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Completed by */}
              {goal.completedBy?.length > 0 && (
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 8 }}>✓ Completed by</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {goal.completedBy.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, color: "var(--text-primary)" }}>#{i + 1} {c.userId?.fullName || c.userId?.username || "User"}</span>
                        <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{fmtFull(c.completedAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ padding: "9px 13px", borderRadius: 8, background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", color: "#f87171", fontSize: 12 }}>
                  {error}
                </div>
              )}

              {/* Complete action */}
              {goal.status !== "completed" && !goal.isCompleted && !goal.isPending && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {goal.type === "circle" && (
                    <div>
                      <label style={{ display: "block", marginBottom: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-faint)" }}>
                        Proof URL
                      </label>
                      <input value={proof} onChange={e => setProof(e.target.value)}
                        placeholder="Paste a link to your proof (screenshot, video, doc…)"
                        style={{ background: "var(--bg-input)", border: "1px solid rgba(63,63,70,0.6)", color: "var(--text-primary)", borderRadius: 8, padding: "10px 13px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s" }}
                        onFocus={e => e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(63,63,70,0.6)"} />
                      <p style={{ fontSize: 10, color: "var(--text-ghost)", marginTop: 4 }}>Circle goals require peer verification before being marked complete</p>
                    </div>
                  )}
                  <button onClick={handleComplete} disabled={submitting || (goal.type === "circle" && !proof.trim())}
                    style={{ padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "white", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: submitting ? 0.5 : 1, transition: "opacity 0.2s" }}>
                    {submitting ? "Submitting…" : goal.type === "circle" ? "📎 Submit for Verification" : "✓ Mark as Complete"}
                  </button>
                </div>
              )}

              {goal.isPending && (
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.2)" }}>
                  <p style={{ fontSize: 12, color: "#eab308", fontWeight: 600 }}>⏳ Your proof is awaiting peer verification</p>
                  <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>Circle members need to approve it. More than 50% approval required.</p>
                </div>
              )}

              {goal.isCompleted && (
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <p style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✓ You've completed this goal!</p>
                </div>
              )}

              {goal.status === "backlog" && (
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(113,113,122,0.08)", border: "1px solid rgba(113,113,122,0.2)" }}>
                  <p style={{ fontSize: 12, color: "#71717a", fontWeight: 600 }}>⚠️ This goal moved to backlog — the deadline passed.</p>
                  <p style={{ fontSize: 11, color: "var(--text-ghost)", marginTop: 4 }}>You can still complete it from here.</p>
                </div>
              )}
            </div>
          )}

          {/* Resources tab */}
          {activeTab === "resources" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(!goal.resources || goal.resources.length === 0) && (
                <p style={{ fontSize: 12, color: "var(--text-ghost)", textAlign: "center", padding: "24px 0" }}>No resources attached.</p>
              )}
              {goal.resources?.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noreferrer"
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 10, background: "rgba(15,15,17,0.8)", border: "1px solid rgba(63,63,70,0.5)", textDecoration: "none", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"; e.currentTarget.style.background = "rgba(249,115,22,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.5)"; e.currentTarget.style.background = "rgba(15,15,17,0.8)"; }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>🔗</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{r.name}</p>
                    <p style={{ fontSize: 11, color: "var(--text-faint)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.url}</p>
                  </div>
                  <span style={{ color: "var(--text-ghost)", flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          )}

          {/* Verifications tab (circle only) */}
          {activeTab === "verifications" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(!goal.completionRequests || goal.completionRequests.length === 0) && (
                <p style={{ fontSize: 12, color: "var(--text-ghost)", textAlign: "center", padding: "24px 0" }}>No verification requests yet.</p>
              )}
              {goal.completionRequests?.map((req, i) => (
                <div key={req._id || i} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${req.status === "approved" ? "rgba(34,197,94,0.3)" : req.status === "rejected" ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)"}`, background: "rgba(8,8,10,0.7)" }}>
                  <div style={{ height: 1.5, background: req.status === "approved" ? "linear-gradient(90deg,#22c55e,transparent)" : req.status === "rejected" ? "linear-gradient(90deg,#ef4444,transparent)" : "linear-gradient(90deg,#eab308,transparent)" }} />
                  <div style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{req.userId?.fullName || req.userId?.username || `User #${i + 1}`}</p>
                        <p style={{ fontSize: 10, color: "var(--text-faint)", margin: 0, marginTop: 2 }}>Submitted {fmtFull(req.createdAt)}</p>
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 9px", borderRadius: 20, background: req.status === "approved" ? "rgba(34,197,94,0.1)" : req.status === "rejected" ? "rgba(239,68,68,0.08)" : "rgba(234,179,8,0.1)", border: req.status === "approved" ? "1px solid rgba(34,197,94,0.3)" : req.status === "rejected" ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(234,179,8,0.25)", color: req.status === "approved" ? "#22c55e" : req.status === "rejected" ? "#f87171" : "#eab308" }}>
                        {req.status}
                      </span>
                    </div>

                    {/* Proof link */}
                    <a href={req.proof} target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, background: "rgba(63,63,70,0.3)", border: "1px solid rgba(63,63,70,0.5)", color: "var(--text-muted)", fontSize: 11, textDecoration: "none", marginBottom: 10, transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.35)"; e.currentTarget.style.color = "#f97316"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,63,70,0.5)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                      📎 View Proof ↗
                    </a>

                    {/* Vote count */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: req.status === "pending" ? 10 : 0 }}>
                      <span style={{ fontSize: 11, color: "#22c55e" }}>✓ {req.approvals?.length || 0} approvals</span>
                      <span style={{ fontSize: 11, color: "#f87171" }}>✕ {req.rejections?.length || 0} rejections</span>
                      <span style={{ fontSize: 10, color: "var(--text-ghost)" }}>Need &gt;50%</span>
                    </div>

                    {/* Vote buttons */}
                    {req.status === "pending" && !goal.isCompleted && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleVote(req._id, "approve")} disabled={voting[req._id]}
                          style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.08)", color: "#22c55e", fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: voting[req._id] ? 0.5 : 1, transition: "opacity 0.15s" }}>
                          ✓ Approve
                        </button>
                        <button onClick={() => handleVote(req._id, "reject")} disabled={voting[req._id]}
                          style={{ flex: 1, padding: "7px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: 11, fontWeight: 700, cursor: "pointer", opacity: voting[req._id] ? 0.5 : 1, transition: "opacity 0.15s" }}>
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}