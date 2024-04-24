import React, { useEffect, useState } from "react";

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
        <div>
            <h1>Chat</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;

