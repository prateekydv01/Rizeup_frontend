import { useState, useEffect, useRef } from "react";

// Simple local chat using localStorage per circle (no backend needed for MVP)
// In production, replace with WebSocket or polling API

const STORAGE_KEY = (circleId) => `circle_chat_${circleId}`;

export default function CircleChat({ circleId, userId, userName }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const bottomRef              = useRef(null);
  const inputRef               = useRef(null);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY(circleId)) || "[]");
      setMessages(stored);
    } catch {}

    // Poll for new messages every 3s (simulates real-time for same device)
    const interval = setInterval(() => {
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY(circleId)) || "[]");
        setMessages(stored);
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [circleId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg = {
      id:        Date.now(),
      userId,
      userName:  userName || "You",
      text:      input.trim(),
      timestamp: new Date().toISOString(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    try { localStorage.setItem(STORAGE_KEY(circleId), JSON.stringify(updated.slice(-200))); } catch {}
    setInput("");
    inputRef.current?.focus();
  };

  const fmt = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const groupedMessages = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1];
    const sameUser = prev && prev.userId === msg.userId && (new Date(msg.timestamp) - new Date(prev.timestamp)) < 5 * 60 * 1000;
    if (sameUser) {
      acc[acc.length - 1].push(msg);
    } else {
      acc.push([msg]);
    }
    return acc;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#f4f4f5", margin: "0 0 4px" }}>💬 Chat</h2>
        <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>Talk with your circle members</p>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingRight: 4, marginBottom: 14 }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 10, color: "#3f3f46" }}>
            <span style={{ fontSize: 36 }}>💬</span>
            <p style={{ fontSize: 13, color: "#52525b" }}>No messages yet. Say hello!</p>
          </div>
        )}

        {groupedMessages.map((group, gi) => {
          const isMe    = group[0].userId === userId;
          const name    = group[0].userName;
          const initials = name.slice(0, 2).toUpperCase();
          const hue     = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

          return (
            <div key={gi} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexDirection: isMe ? "row-reverse" : "row" }}>
              {!isMe && (
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `hsla(${hue},55%,45%,0.2)`, border: `1px solid hsla(${hue},55%,50%,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: `hsl(${hue},65%,62%)`, flexShrink: 0, fontFamily: "'Syne',sans-serif" }}>
                  {initials}
                </div>
              )}
              <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", gap: 3, alignItems: isMe ? "flex-end" : "flex-start" }}>
                {!isMe && <p style={{ fontSize: 10, fontWeight: 600, color: `hsl(${hue},60%,60%)`, margin: 0, paddingLeft: 2 }}>{name}</p>}
                {group.map((msg, mi) => (
                  <div key={msg.id} style={{ display: "flex", alignItems: "flex-end", gap: 6, flexDirection: isMe ? "row-reverse" : "row" }}>
                    <div style={{ padding: "8px 12px", borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: isMe ? "linear-gradient(135deg,#f97316,#dc2626)" : "rgba(24,24,27,0.9)", border: isMe ? "none" : "1px solid rgba(39,39,42,0.7)", maxWidth: "100%" }}>
                      <p style={{ fontSize: 13, color: isMe ? "white" : "#e4e4e7", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</p>
                    </div>
                    {mi === group.length - 1 && (
                      <span style={{ fontSize: 9, color: "#3f3f46", flexShrink: 0, paddingBottom: 2 }}>{fmt(msg.timestamp)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Message the circle…"
          style={{ flex: 1, background: "rgba(15,15,17,0.9)", border: "1px solid rgba(39,39,42,0.9)", color: "#f4f4f5", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", resize: "none" }}
          onFocus={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.07)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)"; e.currentTarget.style.boxShadow = "none"; }} />
        <button onClick={send} disabled={!input.trim()}
          style={{ padding: "11px 16px", borderRadius: 12, border: "none", background: input.trim() ? "linear-gradient(135deg,#f97316,#dc2626)" : "rgba(39,39,42,0.5)", color: "white", fontWeight: 700, fontSize: 13, cursor: input.trim() ? "pointer" : "not-allowed", transition: "all 0.18s", flexShrink: 0 }}>
          ↑
        </button>
      </div>
    </div>
  );
}