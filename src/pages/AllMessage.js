import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function AllMessage() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/message');
            setMessages(res.data);
        } catch (err) {
            console.error('Error fetching messages', err);
        }
    };

    const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const MessageTree = ({ messages, level = 0 }) => {
        return (
            <ul style={{ paddingLeft: `${level * 30}px` }}>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.username}</strong> at {formatted.format(new Date(msg.createdAt))}: {msg.content}
                        <br />
                        {msg.replies && msg.replies.length > 0 && (
                            <MessageTree messages={msg.replies} level={level + 1} />
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <div>
                <h2>Message Board</h2>
                <MessageTree messages={messages} />
            </div>
        </div>
    );
}

