//Call API
import React, { useState } from 'react';
import { useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

//import arrowUp from '../assets/arrow-up.webp';
import './AIChatAssistant.css';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });
console.log("Loaded API Key:", import.meta.env.VITE_GOOGLE_API_KEY);
function AIChatAssistant() {

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
                    contents: "For the following. only give me enumerated list of to-dos and subtasks for a todo item. Do not respond if unrelated questions are asked. " +
                        "Respond in plaintext only do not use 1.,2.,3. just use Day1:, Day2: format. " +
                        "And when each day start then start the new line:" + input,
                });
                console.log("Raw response:", response.text);



                //const cleaned = cleanResponse(response.text);

                let myDiv = document.getElementById("responseTextID");
                myDiv.innerHTML = response.text;

                // console.log(response.text);
                // let myDiv = document.getElementById('responseTextID');
                // myDiv.innerHTML = response.text;
            }

            catch (error) {
                console.log(error);
            }
        }

// SHOW RESPONSE IN CHAT WINDOW LATER


    return (
        <div className="chat-placeholder">
            <p className="chat-with-assistant">Chat with AI Assistant</p>
            <div id="responseTextID">{/* chat messages */}</div>
            <div className="input-message">
            <input className="chat-input" type="text" onChange={(e) => setInput(e.target.value)} value={input} placeholder="Type your message..." />
            {/*<button className="send-button" onClick={onClick}><img src={arrowUp} alt="send"/></button>*/}
            <button className="send-button" onClick={callGemini}>Send</button>
            </div>
        </div>
    );
}

export default AIChatAssistant;



