import React, { useState, KeyboardEvent, ReactElement, useEffect, useRef } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
  timestamp: string;
}

export default function ChatWidget(): ReactElement {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input, timestamp: getCurrentTime() } as const];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input })
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "bot", text: data.answer, timestamp: getCurrentTime() } as const]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", text: "❌ Sorry, something went wrong. Please try again.", timestamp: getCurrentTime() } as const]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        boxSizing: "border-box"
      }}
    >
      <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e5e7eb", backgroundColor: "#f9fafb", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img src="/mira.png" alt="Mira Icon" style={{ width: 42, height: 42, borderRadius: "50%" }} />
        <div>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Meet Mira</h2>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>Your AI Chat Assistant</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem", marginBottom: "1rem" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              marginBottom: "0.75rem"
            }}
          >
            <div
              style={{
                backgroundColor: msg.role === "user" ? "#3b82f6" : "#f3f4f6",
                color: msg.role === "user" ? "white" : "#111827",
                borderRadius: "6px",
                padding: "0.6rem 1rem",
                maxWidth: "75%",
                fontSize: "0.95rem",
                lineHeight: 1.4,
                position: "relative"
              }}
            >
              <span>{msg.text}</span>
              <div style={{ fontSize: "0.7rem", marginTop: "0.25rem", color: msg.role === "user" ? "#dbeafe" : "#6b7280" }}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: "#6b7280", fontSize: "0.875rem", fontStyle: "italic" }}>Mira is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #e5e7eb", padding: "0.75rem 1rem", alignItems: "center" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: "9999px",
            padding: "0.6rem 1rem",
            fontSize: "0.875rem",
            outline: "none",
            marginRight: "0.5rem"
          }}
          placeholder="Ask Mira anything..."
        />
        <button
          onClick={sendMessage}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.6rem 1.25rem",
            borderRadius: "9999px",
            fontSize: "0.875rem",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
