import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateMessagePage() {
    const [message, setMessage] = useState('');
    const [charLeft, setCharLeft] = useState(200);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');

        try {
            await axios.post(
                'http://localhost:8080/api/message/create',
                { content: message },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('Message posted!');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Failed to post message');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create a New Message</h2>
            <form onSubmit={handleSubmit}>
        <textarea
            rows={4}
            cols={50}
            maxLength={200}
            value={message}
            onChange={(e) => {
                setMessage(e.target.value);
                setCharLeft(200 - e.target.value.length);
            }}
            required
            placeholder="Enter your message..."
        />
                <div>{charLeft} characters left</div>
                <br />
                <button type="submit">Submit</button>
                <button type="button" onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default CreateMessagePage;
