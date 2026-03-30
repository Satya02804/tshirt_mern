import React, { useEffect } from 'react';
import { Box, Container, Typography, Button, Paper, Stack, Zoom, Fade, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import { CheckCircleOutline, ShoppingBag, Receipt, Download } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Confirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;

    useEffect(() => {
        if (!order) {
            // Redirect to home or orders if accessed directly without state
            const timer = setTimeout(() => navigate('/'), 3000);
            return () => clearTimeout(timer);
        }
    }, [order, navigate]);

    const steps = ['Shipping', 'Payment', 'Order','Confirmation'];
    const [activeStep, setActiveStep] = React.useState(3);

    const handleDownloadInvoice = async () => {
        try {
            const response = await api.get(`/orders/${order.id}/invoice`, {
                responseType: 'blob'
            });

            // Check if the response is actually a JSON error
            if (response.data.type === 'application/json') {
                const text = await response.data.text();
                const error = JSON.parse(text);
                console.error('API Error:', error);
                toast.error(error.message || 'Failed to download invoice');
                return;
            }

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    if (!order) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#f8fafc',
            overflow: 'hidden',
            // Success-themed Mesh Background
            '&::before': {
                content: '""',
                position: 'absolute',
                width: '140%',
                height: '140%',
                top: '-20%',
                left: '-20%',
                zIndex: 0,
                backgroundImage: `
                    radial-gradient(circle at 20% 30%, rgba(34, 197, 94, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 80% 70%, rgba(37, 99, 235, 0.05) 0%, transparent 40%),
                    radial-gradient(circle at 50% 50%, #f8fafc 0%, transparent 100%)
                `,
                animation: 'meshMove 20s infinite alternate ease-in-out',
            },
            '@keyframes meshMove': {
                '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                '100%': { transform: 'translate(50px, 50px) rotate(3deg)' }
            }
        }}>
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in={true} timeout={1000}>
                    <Box>
                        {/* Visual Stepper */}
                        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                        
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 4, md: 6 },
                                textAlign: 'center',
                                borderRadius: 6,
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 1)',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Zoom in={true} style={{ transitionDelay: '300ms' }}>
                                <Box sx={{ 
                                    display: 'inline-flex', 
                                    p: 2, 
                                    borderRadius: '50%', 
                                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                                    mb: 3
                                }}>
                                    <CheckCircleOutline sx={{ fontSize: 64, color: '#22c55e' }} />
                                </Box>
                            </Zoom>

                            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em', color: '#0f172a' }}>
                                Order Confirmed!
                            </Typography>
                            
                            <Typography variant="body1" sx={{ color: '#64748b', mb: 4, fontWeight: 500, lineHeight: 1.6 }}>
                                Thank you for your purchase. 
                                We've received your order and sent a confirmation email to <strong>{order.email}</strong>.
                            </Typography>

                            <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#f8fafc', borderRadius: 3, borderStyle: 'dashed' }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">Order ID</Typography>
                                    <Typography variant="subtitle2" fontWeight="700" color="primary.main">{order.orderNumber}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase">Amount Paid</Typography>
                                    <Typography variant="subtitle2" fontWeight="700">₹{Number(order.totalPrice).toLocaleString('en-IN')}</Typography>
                                </Stack>
                            </Paper>

                            <Stack 
                                direction="row" 
                                spacing={2}
                                sx={{ 
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                    '& > :not(style)': { ml: 0 } // Override Stack's default margin for wrapped items
                                }}
                            >
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => handleDownloadInvoice()}
                                    startIcon={<Download />}
                                    sx={{ 
                                        py: 1.5,
                                        px: 3,
                                        borderRadius: 3, 
                                        fontWeight: 700, 
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        bgcolor: '#2563eb', // Primary Blue
                                        '&:hover': { bgcolor: '#1d4ed8', transform: 'translateY(-1px)' },
                                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                                        transition: 'all 0.2s',
                                        flex: { xs: '1 1 100%', sm: 'auto' }
                                    }}
                                >
                                    Download Invoice
                                </Button>

                                <Button 
                                    variant="outlined" 
                                    size="large"
                                    onClick={() => navigate('/profile/orders')}
                                    startIcon={<Receipt />}
                                    sx={{ 
                                        py: 1.5, 
                                        px: 3,
                                        borderRadius: 3, 
                                        fontWeight: 600, 
                                        textTransform: 'none',
                                        borderColor: '#e2e8f0',
                                        color: '#475569',
                                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                                        flex: { xs: '1 1 100%', sm: 'auto' }
                                    }}
                                >
                                    View Order
                                </Button>

                                <Button 
                                    variant="outlined" 
                                    size="large"
                                    onClick={() => navigate('/')}
                                    startIcon={<ShoppingBag />}
                                    sx={{ 
                                        py: 1.5, 
                                        px: 3,
                                        borderRadius: 3, 
                                        fontWeight: 600, 
                                        textTransform: 'none',
                                        borderColor: '#e2e8f0',
                                        color: '#475569',
                                        '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                                        flex: { xs: '1 1 100%', sm: 'auto' }
                                    }}
                                >
                                    Shop More
                                </Button>
                            </Stack>
                        </Paper>
                    </Box>
                </Fade>
            </Container>
        </Box>
    );
};

export default Confirmation;