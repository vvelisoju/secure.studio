import React from "react";
import ChatWidget from "../components/ChatWidget";

export default function ChatPage() {
  return (
      <div
      style={{
        height: "500px",
        width: "360px",
        margin: "0 auto",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ChatWidget />
    </div>
  );
}
