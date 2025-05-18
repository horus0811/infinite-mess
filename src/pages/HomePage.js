import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from "../auth/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const { user, logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [replyMap, setReplyMap] = useState({}); // { [messageId]: replyText }
    const [visibleReplies, setVisibleReplies] = useState({}); // { [messageId]: true/false }
    const navigate = useNavigate();

    const goToCreateMessage = () => {
        navigate('/create-message');
    };

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

    const handleReplyChange = useCallback((msgId, value) => {
        setReplyMap((prev) => ({
            ...prev,
            [msgId]: value,
        }));
    }, []);

    const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const handleReplySubmit = async (parentId) => {
        const token = sessionStorage.getItem('token');
        try {
            console.log(parentId);
            await axios.post(
                'http://localhost:8080/api/message/create',
                {
                    content: replyMap[parentId],
                    parent: parentId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('Reply sent!');
            setReplyMap({ ...replyMap, [parentId]: '' });
            setVisibleReplies({ ...visibleReplies, [parentId]: false });
            fetchMessages(); // Reload messages after reply
        } catch (err) {
            console.error('Error posting reply', err);
            alert('Failed to send reply');
        }
    };

    const toggleReplyBox = useCallback((msgId) => {
        setVisibleReplies(prev => ({
            ...prev,
            [msgId]: !prev[msgId],
        }));
    }, []);

    const MessageTree = ({ messages, level = 0 }) => {
        return (
            <ul style={{ paddingLeft: `${level * 30}px` }}>
                {messages.map((msg) => (
                    <li key={msg.id}>
                        <strong>{msg.username}</strong> at {formatted.format(new Date(msg.createdAt))}: {msg.content}
                        <br />
                        <button onClick={() => toggleReplyBox(msg.id)}>Reply</button>

                        {msg.replies && msg.replies.length > 0 && (
                            <MessageTree messages={msg.replies} level={level + 1} />
                        )}

                        {visibleReplies[msg.id] && (
                            <div style={{ marginTop: '10px' }}>
                <textarea
                    rows="3"
                    cols="50"
                    maxLength="200"
                    value={replyMap[msg.id] || ''}
                    onChange={(e) => handleReplyChange(msg.id, e.target.value)}
                />
                                <br />
                                <button onClick={() => handleReplySubmit(msg.id)}>Submit Reply</button>
                                <button onClick={() => toggleReplyBox(msg.id)} style={{ marginLeft: '10px' }}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
                <h1>Welcome, {user.usernameToShow} aka {user.email}</h1>
                <button onClick={goToCreateMessage}>Create Message</button>
                <button onClick={logout}>Logout</button>
            </div>
            <div>
                <h2>Message Board</h2>
                <MessageTree messages={messages} />
            </div>
        </div>
    );
}

