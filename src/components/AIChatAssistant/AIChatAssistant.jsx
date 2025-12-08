import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import './AIChatAssistant.css';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
// console.log("Loaded API Key:", import.meta.env.VITE_GOOGLE_API_KEY);
function AIChatAssistant() {

    // Stores the text the user types into the chat input box
    const [input, setInput] = useState('');

    function cleanResponse(text = "") {
        return text
            .replace(/[*#_`>-]/g, "")
            .replace(/(\d+\.)/g, "\n$1")
            .replace(/\n{2,}/g, "\n")
            .trim();
    }
        const callGemini = async () => {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: "For the following. only give me enumerated list of to-dos and subtasks for a todo item. Do not respond if unrelated questions are asked. " +
                        "Respond in plaintext only do not use 1.,2.,3. just use Day1:, Day2: format. " +
                        "And when each day start then start the new line:" + input,
                });
                console.log("Raw response:", response.text);

                let myDiv = document.getElementById("responseTextID");
                myDiv.innerHTML = response.text;
            }

            catch (error) {
                console.log(error);
            }
        }



    return (
        <div className="chat-placeholder" aria-label="AI Chat Assistant Section">
            <p className="chat-with-assistant">Chat with AI Assistant</p>
            <div id="responseTextID">{/* chat messages */}</div>
            <div className="input-message" aria-label="Input Message">
            <input className="chat-input" type="text" onChange={(e) => setInput(e.target.value)} value={input} placeholder="Type your message..." />
            <button className="send-button" aria-label="send button" onClick={callGemini}>Send</button>
            </div>
        </div>
    );
}

export default AIChatAssistant;



