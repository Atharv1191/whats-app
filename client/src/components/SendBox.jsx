import React, { useState } from "react";

const API_BASE_URL = "https://whats-app-theta.vercel.app/api";

export default function SendBox({ wa_id, name, onSend }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    try {
      await fetch(`${API_BASE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wa_id, name, text }),
      });
      setText("");
      if (onSend) onSend();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="p-4 border-t bg-white flex items-center gap-3">
      <input
        type="text"
        placeholder="Type a message"
        disabled={loading}
        className="flex-grow border rounded px-3 py-2 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </form>
  );
}
