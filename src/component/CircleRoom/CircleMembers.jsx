export default function CircleMembers({ circle, userId, isAdmin }) {
  const members = circle.members || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#f4f4f5", margin: "0 0 4px" }}>Members</h2>
        <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>{members.length} people in this circle</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {members.map((member, i) => {
          const id       = member._id || member;
          const name     = member.fullName || member.username || `Member ${i + 1}`;
          const initials = name.slice(0, 2).toUpperCase();
          const isMe     = id?.toString() === userId?.toString();
          const isCircleAdmin = (circle.admin?._id || circle.admin)?.toString() === id?.toString();
          const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

          return (
            <div key={id || i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "rgba(15,15,17,0.8)", border: "1px solid rgba(39,39,42,0.7)", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(63,63,70,0.8)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(39,39,42,0.7)"}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg,hsla(${hue},55%,45%,0.25),hsla(${hue},55%,35%,0.12))`, border: `1px solid hsla(${hue},55%,50%,0.28)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 12, color: `hsl(${hue},65%,62%)`, flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", margin: 0 }}>{name}</p>
                  {isMe && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316" }}>You</span>}
                  {isCircleAdmin && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 10, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", color: "#fbbf24" }}>Admin</span>}
                </div>
                {member.username && <p style={{ fontSize: 11, color: "#3f3f46", margin: "2px 0 0" }}>@{member.username}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}