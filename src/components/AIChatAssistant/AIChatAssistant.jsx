import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import './AIChatAssistant.css';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

function AIChatAssistant() {

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]); // ← added: stores the conversation history

    const callGemini = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", parts: [{ text: input }] };
        const updatedMessages = [...messages, userMessage]; // ← added: append new user message to history

        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: updatedMessages, // ← changed: send full history, not just one prompt string
                config: {
                    systemInstruction: `You are a task-planning assistant. Given a goal, break it into a day-by-day to-do plan.

Rules:
- Only respond if the input is a real goal/task (e.g. "learn Spanish", "plan a trip"). If it's a greeting, question, or unrelated text, respond with exactly: "Please enter a goal or task."
- Respond in plain text only, no markdown, no numbers like 1. 2. 3.
- Format each day as "Day1:", "Day2:", etc., each on its own new line.
- Under each day, list the subtasks for that day.
- The user may ask follow-up questions or request changes to a previous plan — use the conversation history to understand context.`
                },
            });

            const modelMessage = { role: "model", parts: [{ text: response.text }] };

            setMessages([...updatedMessages, modelMessage]); // ← added: save both messages to history
            setInput('');
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="chat-placeholder" aria-label="AI Chat Assistant Section">
            <p className="chat-with-assistant">Chat with AI Assistant</p>

            <div id="responseTextID">
                {messages.map((msg, i) => (
                    <p key={i} className={msg.role === "user" ? "user-msg" : "ai-msg"}>
                        {msg.parts[0].text}
                    </p>
                ))}
            </div>

            <div className="input-message" aria-label="Input Message">
                <input
                    className="chat-input"
                    type="text"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            callGemini();
                        }
                    }}
                    value={input}
                    placeholder="Type your message..."
                />
                <button className="send-button" aria-label="send button" onClick={callGemini}>Send</button>
            </div>
        </div>
    );
}

export default AIChatAssistant;