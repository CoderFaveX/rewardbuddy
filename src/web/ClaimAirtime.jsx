import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ClaimAirtime = () => {
    useEffect(() => {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const chatId = new URLSearchParams(window.location.search).get('chatId');
        const [message, setMessage] = useState('');
        const [number, setNumber] = useState('');

        const handleClaim = async () => {
            try {
                const response = await fetch('/api/claim-airtime', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId })
                });
                const data = await response.json();
                setMessage(data.message);
            } catch (error) {
                console.error('Error claiming airtime:', error);
                setMessage('Failed to claim airtime. Please try again later.');
            }
        };

        tg.MainButton.setText('Claim Airtime | Reward Bot');
        tg.MainButton.onClick(handleClaim);
        tg.MainButton.show();
    }, []);

    return (
        <div>
            <h1>Claim Your Airtime</h1>
            <input type="text" value={number} onChange={e => setNumber(e.target.value)} />
            <button onClick={handleClaim} disabled={!chatId}>Claim Airtime</button>
            <p>{message}</p>
        </div>
    );
};

export default ClaimAirtime;
