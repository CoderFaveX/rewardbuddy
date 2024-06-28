import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ClaimAirtime = () => {
    const useQuery = () => new URLSearchParams(useLocation().search);
    const query = useQuery();
    const chatId = query.get('chatId');
  
    const [message, setMessage] = useState('');
    const [number, setNumber] = useState('');

    const handleClaim = async () => {
        try {
            const response = await axios.post('/api/claim-airtime', { chatId, number: number });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error claiming airtime:', error);
            setMessage('Failed to claim airtime. Please try again later.');
        }
    };

    useEffect(() => {
      if (chatId) {
        handleClaim();
      }
    }, [chatId]);
  

    return (
        <div>
            <h1>Claim Your Airtime</h1>
            <input type="text" value={number} onChange={e => setNumber(e.target.value)} />
            <button onClick={handleClaim}>Claim Airtime</button>
            <p>{message}</p>
        </div>
    );
};

export default ClaimAirtime;
