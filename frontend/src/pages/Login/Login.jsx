import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Logged in successfully!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <Grid container sx={{ height: 'calc(100vh - 64px)' }}>
            {/* Left Side - Branding */}
            <Grid 
                item 
                xs={12} 
                md={6} 
                sx={{ 
                    backgroundImage: 'linear-gradient(45deg, #2563eb 30%, #ec4899 90%)',
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    p: 4
                }}
            >
                <Typography variant="h2" fontWeight="800" gutterBottom>
                    Style That Speaks
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                    Welcome back to the community.
                </Typography>
            </Grid>

            {/* Right Side - Form */}
            <Grid 
                item 
                xs={12} 
                md={6} 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'background.paper'
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 450, p: 4 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography component="h1" variant="h4" fontWeight="800" gutterBottom>
                            Sign In
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Enter your details to access your account
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 4 }}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ 
                                py: 1.5, 
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                bgcolor: 'text.primary', // Black button per request
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'black',
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Don't have an account?{' '}
                                <MuiLink 
                                    component={Link} 
                                    to="/register" 
                                    fontWeight="600"
                                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                                >
                                    Sign Up
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Login;
