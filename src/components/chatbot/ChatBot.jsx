//Call API
import React, { useState } from 'react';

function ChatBot() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    async function generateAI(prompt) {
        const response = await fetch("http://localhost:3001/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        return data.text;
    }

    async function handleSend() {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: "user", content: input }]);

        const aiText = await generateAI(input);

        setMessages(prev => [...prev, { role: "assistant", content: aiText }]);

        setInput("");
    }


return (
    <div className="chat-container">
        <p>AI Assistance</p>
        <div className="chat">
            {messages.map((msg, i) => (

                <div
                    key={i}
                    className={msg.role === "user" ? "user-msg" : "ai-msg"}
                >
                    {msg.content}
                </div>
            ))}
        </div>

        <div className="input-area">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    </div>
);
}

export default ChatBot;



