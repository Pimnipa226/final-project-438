//Call API
import React, { useState } from 'react';
import { useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

//import arrowUp from '../assets/arrow-up.webp';
import './ChatBot.css';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
console.log("Loaded API Key:", import.meta.env.VITE_GOOGLE_API_KEY);
function ChatBot() {

    const [input, setInput] = useState('');
    //input: stores whatever the user types
    //setInput(): updates input when the user types
    //useState(''): initializes input as an empty string


    const [callAPI, setCallAPI] = useState(false);
    //default state is false

    function cleanResponse(text = "") {
        return text
            .replace(/[*#_`>-]/g, "")       // remove markdown symbols
            .replace(/(\d+\.)/g, "\n$1")    // add newline before every number list like "1." "2." etc.
            .replace(/\n{2,}/g, "\n")       // remove extra blank lines
            .trim();
    }
        const callGemini = async () => {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: "For the following. only give me enumerated list of to-dos and subtasks for a todo item. Do not respond if unrelated questions are asked. Respond in plaintext only.:" + input,
                });

                const cleaned = cleanResponse(response.text);

                let myDiv = document.getElementById("responseTextID");
                myDiv.textContent = cleaned;

                // console.log(response.text);
                // let myDiv = document.getElementById('responseTextID');
                // myDiv.innerHTML = response.text;
            }

            catch (error) {
                console.log(error);
            }
        }

    const onClick = () => {
        console.log("User input:", input);
        //if (!input) return;
        setCallAPI(true);
    }
// SHOW RESPONSE IN CHAT WINDOW LATER


    return (
        <div className="chatbot-placeholder">
            <div id="responseTextID"></div>
            <input className="chat-input" type="text" onChange={(e) => setInput(e.target.value)} value={input} placeholder="Type your message..." />
            {/*<button className="send-button" onClick={onClick}><img src={arrowUp} alt="send"/></button>*/}
            <button className="send-button" onClick={callGemini}>Send</button>
        </div>
    );
}

export default ChatBot;



