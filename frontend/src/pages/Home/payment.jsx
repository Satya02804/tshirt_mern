import React, { useState } from 'react';
import {
    Typography, Paper, Box, Button, Stack, TextField, InputAdornment, Divider,
    Container, Grid, List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Stepper, Step, StepLabel, Breadcrumbs, Link
} from '@mui/material';
import {
    AccountBalanceWallet, Money, CreditCard, NoteAltOutlined,
    CheckCircle, ArrowBackIosNew
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import api from '../../services/api';
import { addressService } from '../../services/addressService';
import { toast } from 'react-toastify';
import Can from '../../components/common/Can';

const Payment = () => {
    const { cart, getCartTotal, getDiscount, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve shipping data passed from Checkout page
    const shippingData = location.state?.formData;

    // Redirect to checkout if no shipping data (e.g., direct access)
    React.useEffect(() => {
        if (!shippingData) {
            navigate('/checkout');
        }
    }, [shippingData, navigate]);

    if (!shippingData) return null;

    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [orderNotes, setOrderNotes] = useState('');
    const [cardDetails, setCardDetails] = useState({
        card_number: '',
        card_holder_name: '',
        expiry_date: '',
        cvv: '',
    });
    const [cardErrors, setCardErrors] = useState({});

    // --- CARD VALIDATION ---
    const validateCardField = (name, value) => {
        let error = '';
        switch (name) {
            case 'card_number':
                if (value.replace(/\s/g, '').length !== 16) error = 'Must be 16 digits';
                break;
            case 'card_holder_name':
                if (!value.trim()) error = 'Name is required';
                break;
            case 'expiry_date':
                if (value.length === 5) {
                    const [month] = value.split('/').map(Number);
                    if (month < 1 || month > 12) error = 'Invalid Month';
                }
                break;
            case 'cvv':
                if (value.length !== 3) error = 'Must be 3 digits';
                break;
            default: break;
        }
        setCardErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleCardChange = (e) => {
        let { name, value } = e.target;
        if (name === 'card_number') {
            value = value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
        } else if (name === 'expiry_date') {
            const raw = value.replace(/\D/g, '');
            value = raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2, 4)}` : raw;
        } else if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }
        setCardDetails({ ...cardDetails, [name]: value });
        validateCardField(name, value);
    };

    const isCardValid = () => {
        if (paymentMethod !== 'card') return true;
        const isFilled = cardDetails.card_number.replace(/\s/g, '').length === 16 &&
            cardDetails.expiry_date.length === 5 &&
            cardDetails.cvv.length === 3;
        const noErrors = Object.values(cardErrors).every(e => !e);
        return isFilled && noErrors;
    };

    // --- SUBMISSION ---
    const handleSubmit = async () => {
        if (paymentMethod === 'card' && !isCardValid()) {
            toast.error("Please fix card details");
            return;
        }

        try {
            const cleanCardDetails = {
                ...cardDetails,
                card_number: cardDetails.card_number.replace(/\s/g, '')
            };

            const token = localStorage.getItem('token');

            const response = await api.post('/orders', {
                ...shippingData,
                payment_method: paymentMethod,
                cardDetails: paymentMethod === 'card' ? cleanCardDetails : null,
                cart: cart.map(item => ({ id: item.id, quantity: item.quantity, size: item.size })),
                notes: orderNotes
            });

            // Save address if requested (Only for logged in users)
            if (token && shippingData.save_address) {
                try {
                    await addressService.addAddress({
                        name: shippingData.name,
                        phone: shippingData.phone,
                        address_line: shippingData.address.split(',')[0],
                        city: shippingData.city || 'Unknown',
                        state: shippingData.state || 'Unknown',
                        zip: shippingData.zip || '000000',
                        is_default: false
                    });
                } catch (err) {
                    console.error('Failed to save address:', err);
                }
            }

            toast.success('Order placed successfully!');
            clearCart();
            navigate('/confirmation', { state: { order: response.data.data } });
        } catch (error) {
            console.error(error);
            toast.error('Failed to place order');
        }
    };

    const steps = ['Cart', 'Shipping Address', 'Payment', 'Confirmation'];
    const activeStep = 2;

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 4 }}>
                {/* Visual Stepper */}
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/')}>Home</Link>
                    <Link underline="hover" color="inherit" onClick={() => navigate('/checkout')}>Checkout</Link>
                    <Typography color="text.primary">Payment</Typography>
                </Breadcrumbs>
                <Typography variant="h3" fontWeight="800">Payment</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* LEFT COLUMN: PAYMENT FORMS */}
                <Grid size={{xs: 12, md: 7}}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <Typography variant="h5" fontWeight="700">Payment & Review</Typography>

                                <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Typography variant="subtitle2" color="text.secondary">Shipping To:</Typography>
                                            <Typography variant="body1" fontWeight="600">{shippingData.name}</Typography>
                                            <Typography variant="body2">{shippingData.address}, {shippingData.city}, {shippingData.state} - {shippingData.zip}</Typography>
                                            <Typography variant="body2">{shippingData.phone}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Button class="w-50 mt-4 flex flex-column items-center justify-left py-0 px-0 text-primary transition-all text-sm font-black uppercase tracking-widest"
                                                size="small" onClick={() => navigate('/checkout')} variant="outlined" sx={{ mt: 1 }}>
                                                Edit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 2, color: 'text.primary' }}>
                                    Payment Method
                                </Typography>

                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }} 
                                    spacing={2}
                                >
                                    {[
                                        { value: 'UPI', label: 'UPI / Wallet', icon: <AccountBalanceWallet /> },
                                        { value: 'COD', label: 'Cash on Delivery', icon: <Money /> },
                                        { value: 'card', label: 'Credit / Debit Card', icon: <CreditCard /> }
                                    ].map((method) => (
                                        <Paper
                                            key={method.value}
                                            variant="outlined"
                                            onClick={() => setPaymentMethod(method.value)}
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                flex: 1, 
                                                minWidth: '180px', 
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                borderRadius: 2,
                                                transition: 'all 0.2s ease',
                                                borderColor: paymentMethod === method.value ? 'primary.main' : 'divider',
                                                bgcolor: paymentMethod === method.value ? 'rgba(37, 99, 235, 0.04)' : 'background.paper',
                                                borderWidth: paymentMethod === method.value ? 2 : 1,
                                                boxShadow: paymentMethod === method.value ? '0 4px 12px -2px rgba(37, 99, 235, 0.12)' : 'none',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    bgcolor: 'rgba(37, 99, 235, 0.02)'
                                                }
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                readOnly
                                                style={{
                                                    width: 18,
                                                    height: 18,
                                                    cursor: 'pointer',
                                                    accentColor: '#2563eb'
                                                }}
                                            />
                                            <Box sx={{
                                                display: 'flex',
                                                color: paymentMethod === method.value ? 'primary.main' : 'text.secondary',
                                                transition: 'color 0.2s'
                                            }}>
                                                {method.icon}
                                            </Box>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: paymentMethod === method.value ? 700 : 500,
                                                    color: paymentMethod === method.value ? 'text.primary' : 'text.secondary'
                                                }}
                                            >
                                                {method.label}
                                            </Typography>
                                        </Paper>
                                    ))}
                                </Stack>

                                <Divider sx={{ my: 1 }} />

                                <Typography variant="subtitle1" fontWeight="700">Order Notes (Optional)</Typography>
                                <TextField
                                    multiline minRows={3}
                                    placeholder="Any special instructions for delivery? (e.g., Leave at front door)"
                                    value={orderNotes}
                                    onChange={(e) => setOrderNotes(e.target.value)}
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ mt: 1 }}><NoteAltOutlined /></InputAdornment>
                                    }}
                                />



                                <Can permission="place-orders">
                                    <Button
                                       class="mt-auto w-full bg-white border-2 border-slate-100 text-slate-900 py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                                        onClick={handleSubmit}
                                        variant="contained" size="large"
                                        disabled={!paymentMethod || (paymentMethod === 'card' && !isCardValid())}
                                        sx={{ mt: 2, py: 1.8, borderRadius: 2, fontWeight: 'bold' }}
                                    >
                                        Complete Purchase
                                    </Button>
                                </Can>
                            </Box>
                        </Paper>

                        {/* Back Button */}
                        <Button class="w-50 flex items-center justify-left py-0 px-0 text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-xs font-black uppercase tracking-widest"
                            startIcon={<ArrowBackIosNew />} onClick={() => navigate('/checkout')} sx={{ alignSelf: 'flex-start' }}>
                            Back to Shipping
                        </Button>
                    </Stack>
                </Grid>

                {/* RIGHT COLUMN: SUMMARY */}
                <Grid size={{xs:12, md:5}}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <Typography variant="h5" fontWeight="700" sx={{ m: 3, mt: 4, mb: 1 }}>Order Summary</Typography>
                            <List disablePadding sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {cart.map((item) => (
                                    <ListItem key={item.id} sx={{ py: 2, px: 3, borderBottom: '1px solid #f5f5f5' }}>
                                        <ListItemAvatar sx={{ mr: 2 }}><Avatar variant="rounded" src={item.url} sx={{ width: 64, height: 64 }} /></ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle2" fontWeight="700">{item.name}</Typography>}
                                            secondary={
                                                <Box component="span">
                                                    <Typography component="span" variant="body2" color="text.secondary">
                                                        Size: {item.size}
                                                    </Typography>
                                                    <Typography component="span" variant="body2" color="text.secondary" sx={{ mx: 1 }}>|</Typography>
                                                    <Typography component="span" variant="body2" fontWeight="600" color="text.primary">
                                                        Qty: {item.quantity}
                                                    </Typography>
                                                </Box>
                                            }
                                        />

                                        <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                                            <Stack direction="column" alignItems="flex-end" spacing={0}>
                                                <Typography variant="subtitle1" fontWeight="800">
                                                    ₹{Number(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                                                </Typography>
                                                {Number(item.discount) > 0 && (
                                                    <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'error.main' }}>
                                                        ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>

                            {/* Totals */}
                            <Box sx={{ p: 3, bgcolor: '#fafafa', mt: 'auto' }}>
                                <Stack spacing={1.5}>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" fontWeight="800">Grand Total</Typography>
                                        <Typography variant="h5" color="primary.main" fontWeight="800">
                                            ₹{getCartTotal().toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>

                        {/* CARD FORM (Only if Card selected) */}
                        {paymentMethod === "card" && (
                            <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #eee' }}>
                                <TextField
                                    required fullWidth label="Card Holder Name" name="card_holder_name"
                                    value={cardDetails.card_holder_name} onChange={handleCardChange}
                                    error={!!cardErrors.card_holder_name} helperText={cardErrors.card_holder_name}
                                    sx={{ mb: 2 }}
                                    InputProps={{ endAdornment: cardDetails.card_holder_name && !cardErrors.card_holder_name && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment> }}
                                />
                                <TextField
                                    required fullWidth label="Card Number" name="card_number" placeholder='XXXX XXXX XXXX XXXX'
                                    value={cardDetails.card_number} onChange={handleCardChange}
                                    error={!!cardErrors.card_number} helperText={cardErrors.card_number}
                                    sx={{ mb: 2 }}
                                    InputProps={{ endAdornment: cardDetails.card_number.replace(/\s/g, '').length === 16 && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment> }}
                                />
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        required fullWidth label="Expiry" name="expiry_date" placeholder='MM/YY'
                                        value={cardDetails.expiry_date} onChange={handleCardChange}
                                        error={!!cardErrors.expiry_date} helperText={cardErrors.expiry_date}
                                        InputProps={{ endAdornment: cardDetails.expiry_date.length === 5 && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment> }}
                                    />
                                    <TextField
                                        required fullWidth label="CVV" name="cvv" type="password" placeholder='123'
                                        value={cardDetails.cvv} onChange={handleCardChange}
                                        error={!!cardErrors.cvv} helperText={cardErrors.cvv}
                                        InputProps={{ endAdornment: cardDetails.cvv.length === 3 && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment> }}
                                    />
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Payment;
