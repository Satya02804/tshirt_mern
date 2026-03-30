
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAuth(); // We need a way to set the user/token. 
    // Actually, AuthContext doesn't expose a direct "setToken" method, but we can manually set localStorage and then trigger a refresh or use a new method.
    // Let's check AuthContext again. It has `updateUser`. 
    // But we need to set the TOKEN first. 
    
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // 1. Store token
            localStorage.setItem('token', token);
            
            // 2. Fetch user profile to ensure everything is valid and update context
            // We can't easily call "login" because that expects email/pass.
            // We can rely on AuthContext's existing useEffect that checks for token on mount/refresh.
            // So if we set token and reload, it "should" work. 
            // OR better: fetch profile immediately.
            
            fetch('/api/auth/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to fetch profile: ${res.status} ${res.statusText} - ${text}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    const user = data.data;
                    localStorage.setItem('user', JSON.stringify(user));
                    updateUser(user); // Update context
                    navigate('/'); // Redirect to home
                } else {
                    console.error('Failed to fetch profile:', data);
                    navigate('/login');
                }
            })
            .catch(err => {
                console.error('Error fetching profile:', err);
                // If profile fetch fails, it might be an invalid token. Redirect to login.
                toast.error('Authentication failed. Please try again.');
                navigate('/login');
            });
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, updateUser]);

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Logging in with Google...</Typography>
        </Box>
    );
};

export default GoogleCallback;
