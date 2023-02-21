import {MessageInput} from "./MessageInput.js"
import {Message} from "./Message.js"

import React, {useRef, useEffect, useState} from 'react';

export const ChatWindow = ({updater, messages, currentUser, activeConvo}) => {
    const messagesEndRef = useRef(null);
    const messagesRef = useRef(null);

    const [messagesx, setMessagesx] = useState(null)

    useEffect(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        messagesEndRef.current.scrollIntoView({behavior: "smooth"});
    }, [updater]);

    useEffect(() => {
        messagesEndRef.current.scrollIntoView();
    }, []);


    return (
        <div className="w-3/4 h-screen bg-white p-4 flex flex-col text-sm">
            <div className="overflow-y-scroll flex-grow mb-3"
                 ref={messagesRef}
            >
                {messages[activeConvo] && messages[activeConvo].sort((a, b) => (a.timestamp > b.timestamp) ? 1 : -1).map((message, index) => (
                    <Message key={index} message={message}/>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <div className="flex">
                <MessageInput currentUser={currentUser} activeConvo={activeConvo}/>
            </div>
        </div>
    );
};


