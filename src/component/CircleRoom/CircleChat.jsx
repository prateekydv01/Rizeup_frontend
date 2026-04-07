import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL?.replace("/api/v1", "") || "http://localhost:4000";

export default function CircleChat({ circleId, userId, userName }) {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState("");
  const [connected,   setConnected]   = useState(false);
  const [hoveredMsg,  setHoveredMsg]  = useState(null);
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const socketRef   = useRef(null);

  // ── Connect socket ──────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      // Join the circle room
      socket.emit("join_circle", { circleId, userId, userName });
    });

    socket.on("disconnect", () => setConnected(false));

    // Load existing messages on join
    socket.on("circle_history", (history) => {
      setMessages(history || []);
    });

    // New message from anyone
    socket.on("circle_message", (msg) => {
      setMessages(prev => {
        // Deduplicate by id
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    // Message deleted by someone
    socket.on("circle_message_deleted", ({ id }) => {
      setMessages(prev => prev.filter(m => m.id !== id));
    });

    return () => {
      socket.emit("leave_circle", { circleId });
      socket.disconnect();
    };
  }, [circleId, userId, userName]);

  // ── Auto scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ────────────────────────────────────────────────────────────────
  const send = useCallback(() => {
    if (!input.trim() || !socketRef.current?.connected) return;
    const msg = {
      id:        `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      circleId,
      userId,
      userName:  userName || "You",
      text:      input.trim(),
      timestamp: new Date().toISOString(),
    };
    // Optimistic update
    setMessages(prev => [...prev, msg]);
    socketRef.current.emit("circle_message", msg);
    setInput("");
    inputRef.current?.focus();
  }, [input, circleId, userId, userName]);

  // ── Delete ──────────────────────────────────────────────────────────────
  const deleteMsg = useCallback((msgId) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    socketRef.current?.emit("circle_delete_message", { id: msgId, circleId });
  }, [circleId]);

  const fmt = (ts) => new Date(ts).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const groupedMessages = messages.reduce((acc, msg, i) => {
    const prev = messages[i - 1];
    const sameUser = prev && prev.userId === msg.userId && (new Date(msg.timestamp) - new Date(prev.timestamp)) < 5 * 60 * 1000;
    if (sameUser) { acc[acc.length - 1].push(msg); }
    else           { acc.push([msg]); }
    return acc;
  }, []);

  // ── SAME STYLES AS BEFORE ───────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: 400 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "1.3rem", color: "#f4f4f5", margin: "0 0 4px" }}>💬 Chat</h2>
          <p style={{ fontSize: 12, color: "#52525b", margin: 0 }}>Talk with your circle members</p>
        </div>
        {/* Connection indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: connected ? "#22c55e" : "#52525b", transition: "background 0.3s", boxShadow: connected ? "0 0 6px rgba(34,197,94,0.5)" : "none" }} />
          <span style={{ fontSize: 10, color: connected ? "#22c55e" : "#52525b", fontWeight: 600 }}>{connected ? "Live" : "Connecting…"}</span>
        </div>
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
          const isMe     = group[0].userId === userId;
          const name     = group[0].userName;
          const initials = name.slice(0, 2).toUpperCase();
          const hue      = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

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
                  <div key={msg.id}
                    onMouseEnter={() => setHoveredMsg(msg.id)}
                    onMouseLeave={() => setHoveredMsg(null)}
                    style={{ display: "flex", alignItems: "flex-end", gap: 6, flexDirection: isMe ? "row-reverse" : "row", position: "relative" }}>

                    <div style={{ padding: "8px 12px", borderRadius: isMe ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: isMe ? "linear-gradient(135deg,#f97316,#dc2626)" : "rgba(24,24,27,0.9)", border: isMe ? "none" : "1px solid rgba(39,39,42,0.7)", maxWidth: "100%" }}>
                      <p style={{ fontSize: 13, color: isMe ? "white" : "#e4e4e7", margin: 0, lineHeight: 1.5, wordBreak: "break-word" }}>{msg.text}</p>
                    </div>

                    {mi === group.length - 1 && (
                      <span style={{ fontSize: 9, color: "#3f3f46", flexShrink: 0, paddingBottom: 2 }}>{fmt(msg.timestamp)}</span>
                    )}

                    {/* Delete button — only own messages, shown on hover */}
                    {isMe && hoveredMsg === msg.id && (
                      <button
                        onClick={() => deleteMsg(msg.id)}
                        title="Delete message"
                        style={{ position: "absolute", top: -8, right: -8, width: 20, height: 20, borderRadius: "50%", border: "none", background: "rgba(239,68,68,0.85)", color: "white", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 2, transition: "background 0.15s", lineHeight: 1 }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,1)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.85)"}>
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input — same as before */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Message the circle…"
          style={{ flex: 1, background: "rgba(15,15,17,0.9)", border: "1px solid rgba(39,39,42,0.9)", color: "#f4f4f5", borderRadius: 12, padding: "11px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", outline: "none", transition: "border-color 0.2s, box-shadow 0.2s", resize: "none" }}
          onFocus={e => { e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,0.07)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "rgba(39,39,42,0.9)"; e.currentTarget.style.boxShadow = "none"; }} />
        <button onClick={send} disabled={!input.trim() || !connected}
          style={{ padding: "11px 16px", borderRadius: 12, border: "none", background: input.trim() && connected ? "linear-gradient(135deg,#f97316,#dc2626)" : "rgba(39,39,42,0.5)", color: "white", fontWeight: 700, fontSize: 13, cursor: input.trim() && connected ? "pointer" : "not-allowed", transition: "all 0.18s", flexShrink: 0 }}>
          ↑
        </button>
      </div>
    </div>
  );
}