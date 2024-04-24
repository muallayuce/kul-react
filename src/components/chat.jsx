import React, { useEffect, useState } from "react";
import './Chat.css'

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const client_id = Date.now();
        const newSocket = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
        setSocket(newSocket);

        newSocket.onmessage = function(event) {
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();
        const messageText = inputValue.trim();
        if (messageText && socket.readyState === WebSocket.OPEN) {
            socket.send(messageText);
            setInputValue("");
        }
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className="chat-container">
            <div className="chat-title">Chat</div>
            <ul className="messages-container">
                {messages.map((message, index) => (
                    <li className="message" key={index}>{message}</li>
                ))}
            </ul>
            <form className="input-container" onSubmit={sendMessage}>
                <input className="message-input"
                    type="text"
                    id="input-size"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Type your message..."
                />
                <button className="send-message-button" type="submit"><i class="bi bi-caret-up-fill"></i></button>
            </form>
        </div>
    );
};

export default Chat;

