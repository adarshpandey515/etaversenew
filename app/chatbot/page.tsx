"use client";

import { useState } from "react";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("❌ Error contacting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Chat with Gemini</h1>

      <div className="flex gap-2 w-full max-w-md">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 p-2 rounded-lg border border-gray-300"
        />
        <button
          onClick={sendQuery}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      <div className="mt-6 w-full max-w-md p-4 bg-white rounded-lg shadow">
        <h2 className="font-semibold">Answer:</h2>
        <p className="mt-2 text-gray-700 whitespace-pre-wrap">
          {answer || "No answer yet"}
        </p>
      </div>
    </div>
  );
}
