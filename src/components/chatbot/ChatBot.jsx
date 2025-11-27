//Call API
import React, { useState } from 'react';
import { useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

//import arrowUp from '../assets/arrow-up.webp';
import './ChatBot.css';


const ai = new GoogleGenAI({ apiKey: "AIzaSyD11Y8zBTwCe861d1Gv7O3hGAUDKi6_vcE" });
function ChatBot() {

    const [input, setInput] = useState('');
    //input: stores whatever the user types
    //setInput(): updates input when the user types
    //useState(''): initializes input as an empty string


    const [callAPI, setCallAPI] = useState(false);
    //default state is false


        const callGemini = async () => {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: input,
                });
                console.log(response.text);
                let myDiv = document.getElementById('responseTextID');
                myDiv.innerHTML = response.text;
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



