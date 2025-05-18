import React, { useState, useRef, useEffect } from "react";
import { FaComments } from "react-icons/fa";
//import './ChatBot.css'; // Optional: for additional styling

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.reply,
        keywords: data.keywords || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          width: "60px",
          height: "60px",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments size={24} />
      </button>

      {isOpen && (
        <div
          className="card position-fixed"
          style={{
            bottom: "90px",
            right: "20px",
            width: "350px",
            maxHeight: "500px",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="card-header text-white p-2" style={{ backgroundColor: "#9352dd"}}>
            Petition Assistant
          </div>
          <div className="card-body overflow-auto" style={{
              flexGrow: 1,
              wordBreak: "break-word", // Ensures long words/wraps
              whiteSpace: "pre-wrap",  // Preserves line breaks and wraps text
              overflowX: "hidden",     // Prevents horizontal scroll
              paddingRight: "8px",     // Optional: space for scrollbar
            }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.sender === "user" ? "text-end" : ""}`}
              >
                <div
                  className="badge"
                  style={{
                    backgroundColor: msg.sender === "user" ? "#9352dd" : "#e0e0e0",
                    color: msg.sender === "user" ? "#fff" : "#333",
                    maxWidth: "90%",
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    textAlign: "left",
                    display: "inline-block",
                  }}
                >
                  {msg.text}
                </div>
                {msg.keywords && msg.keywords.length > 0 && (
                  <div className="mt-1 small text-muted">
                    Suggested keywords: {msg.keywords.join(", ")}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="card-footer p-2">
            <input
              className="form-control"
              type="text"
              value={input}
              placeholder="Type your question..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
