import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClaimAirtime = () => {
    const [message, setMessage] = useState('');
    const [number, setNumber] = useState('');

    useEffect(() => {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const chatIdFromUrl = new URLSearchParams(window.location.search).get('chatId');
        setChatId(chatIdFromUrl);

        const handleClaim = async () => {
            try {
                const response = await axios.post('/api/claim-airtime', {
                    chatId: chatIdFromUrl,
                    number: number
                });
                setMessage(response.data.message || 'Airtime claimed successfully!');
                tg.MainButton.setText('Airtime Claimed! 🎉');
            } catch (error) {
                console.error('Error claiming airtime:', error);
                setMessage('Failed to claim airtime. Please try again later.');
                tg.MainButton.setText('Error Claiming Airtime');
            }
        };

        tg.MainButton.setText('Claim Airtime | Reward Bot');
        tg.MainButton.onClick(handleClaim);
        tg.MainButton.show();

        // Cleanup function to hide MainButton when the component is unmounted
        return () => {
            tg.MainButton.offClick(handleClaim);
            tg.MainButton.hide();
        };
    }, [number]);

    return (
        <div>
            <h1>Claim Your Airtime</h1>
            <input 
                type="text" 
                value={number} 
                onChange={e => setNumber(e.target.value)} 
                placeholder="Enter your number" 
            />
            <p>{message}</p>
        </div>
    );
};

export default ClaimAirtime;
