import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
const [phone, setPhone] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(name, email, password, phone);
        if (result.success) {
            toast.success('Registration successful!');
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
                    Join the Movement
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                    Create an account to start shopping.
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
                            Create Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Get started with your free account
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                            InputProps={{ sx: { borderRadius: 2 } }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="Phone Number"
                            name="phone"
                            autoComplete="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                            autoComplete="new-password"
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
                                bgcolor: 'text.primary',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'black',
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Already have an account?{' '}
                                <MuiLink 
                                    component={Link} 
                                    to="/login"
                                    fontWeight="600" 
                                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                                >
                                    Sign in
                                </MuiLink>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};

export default Register;
