import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Grid, Paper, TextField, Button, Box, Divider,
    List, ListItem, ListItemText, ListItemAvatar, Breadcrumbs, Link,
    InputAdornment, Stack, Avatar, Stepper, Step, StepLabel
} from '@mui/material';
import {
    LocalShippingOutlined,
    PhoneOutlined,
    PersonOutline,
    EmailOutlined,
    CheckCircle,
    ArrowBackIosNew
} from '@mui/icons-material';
import{Minus, Plus} from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { addressService } from '../../services/addressService';
import { toast } from 'react-toastify';

import { AddressCardShimmer } from '../../components/common/Shimmer';

const Checkout = () => {
    const { cart, getCartTotal, getDiscount, updateQuantity } = useCart(); // clearCart not needed here
    const navigate = useNavigate();
    
    // Auth Check
    const token = localStorage.getItem('token');
    const [guestEmail, setGuestEmail] = useState('');

    // --- 1. SHIPPING STATE & VALIDATION ---
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(token ? false : true);
    const [formData, setFormData] = useState({
        address_id: null,
        name: '',
        address: '',
        phone: '',
        city: '',
        state: '',
        zip: '',
        save_address: false
    });

    // Track touched fields for validation feedback
    const [touched, setTouched] = useState({});

    useEffect(() => {
        const fetchAddresses = async () => {
            if (token) {
                try {
                    setLoadingAddresses(true);
                    const response = await addressService.getAddresses();
                    setSavedAddresses(response.data);
                    // If no saved addresses, show form
                    if (response.data.length === 0) {
                        setShowAddressForm(true);
                    } else {
                        // Auto-select default address if exists, otherwise first address
                        const defaultAddr = response.data.find(a => a.is_default) || response.data[0];
                        if (defaultAddr) {
                            setFormData(prev => ({
                                ...prev,
                                address_id: defaultAddr.id,
                                name: defaultAddr.name,
                                phone: defaultAddr.phone,
                                address: `${defaultAddr.address_line}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.zip}`,
                                city: defaultAddr.city,
                                state: defaultAddr.state,
                                zip: defaultAddr.zip
                            }));
                        }
                    }
                } catch (error) {
                    console.error('Error fetching addresses:', error);
                } finally {
                    setLoadingAddresses(false);
                }
            } else {
                setShowAddressForm(true); 
            }
        };
        fetchAddresses();
    }, [token]);

    const [shippingErrors, setShippingErrors] = useState({});

    const validateShipping = (name, value) => {
        let error = '';
        switch (name) {
            case 'email': // Guest only
                if (!token && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email';
                break;
            case 'name':
                if (!value.trim()) error = 'Name is required';
                else if (value.length < 3) error = 'Name must be at least 3 chars';
                break;
            case 'phone':
                // Regex: Exact 10 digits
                if (!/^\d{10}$/.test(value)) error = 'Enter a valid 10-digit number';
                break;
            case 'address':
                if (!value.trim()) error = 'Address is required';
                else if (value.length < 10) error = 'Please enter a full address';
                break;
            case 'city':
            case 'state':
            case 'zip':
                if (!value.trim()) error = 'Required';
                break;
            default:
                break;
        }
        setShippingErrors(prev => ({ ...prev, [name]: error }));
        return error === '';
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        if (name === 'email') validateShipping('email', guestEmail);
        else if (firstNameFields.includes(name)) validateShipping(name, formData[name]);
    };

    const firstNameFields = ['name', 'phone', 'address', 'city', 'state', 'zip'];

    const handleGeneralChange = (e) => {
        const { name, value, checked, type } = e.target;
        const val = type === 'checkbox' ? checked : value;

        // Special handler for phone to only allow numbers
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, [name]: numericValue });
            validateShipping(name, numericValue);
        } else {
            setFormData({ ...formData, [name]: val });
            if (name !== 'save_address') {
                validateShipping(name, val);
            }
        }
    };

    const handleAddressSelect = (address) => {
        setFormData(prev => ({
            ...prev,
            address_id: address.id,
            name: address.name,
            phone: address.phone,
            address: `${address.address_line}, ${address.city}, ${address.state} - ${address.zip}`,
            city: address.city,
            state: address.state,
            zip: address.zip
        }));
        setShowAddressForm(false);
        // Reset errors when selecting valid address
        setShippingErrors({});
    };

    // --- HELPER: IS FIELD VALID? ---
    const isValid = (fieldName) => {
        if (fieldName === 'email') return !token && guestEmail && !shippingErrors.email;
        return formData[fieldName] && !shippingErrors[fieldName];
    };

    // --- 3. SUBMISSION LOGIC ---
    const isShippingValid = () => {
        // Check if empty
        const isFilled = formData.name && formData.phone.length === 10 && formData.address.length >= 10 && (token || guestEmail);
        
        // Check for active errors
        const noErrors = !shippingErrors.name && !shippingErrors.phone && !shippingErrors.address && !shippingErrors.city && !shippingErrors.state && !shippingErrors.zip && !shippingErrors.email;
        return isFilled && noErrors;
    };


    const handleProceedToPayment = () => {
         // Validate Shipping
         if (!isShippingValid()) {
             // Trigger validation to show red boxes
             if (!token) validateShipping('email', guestEmail);
             validateShipping('name', formData.name);
             validateShipping('phone', formData.phone);
             validateShipping('address', formData.address);
             toast.error("Please fill all shipping details");
             return;
         }
         
         // Navigate to Payment page with state
         navigate('/payment', { 
             state: { 
                 formData: { 
                     ...formData,
                     email: token ? undefined : guestEmail
                 } 
             } 
         });
    };

    if (cart.length === 0) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold">Your cart is empty</Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>Add some awesome t-shirts to get started!</Typography>
                <Button variant="contained" size="large" onClick={() => navigate('/')}>
                    Continue Shopping
                </Button>
            </Container>
        );

    } 

    const steps = ['Cart', 'Shipping Address', 'Payment', 'Confirmation'];
    const activeStep = 1; // Always 1 here

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
                    <Typography color="text.primary">Checkout</Typography>
                </Breadcrumbs>
                <Typography variant="h3" fontWeight="800">Checkout</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* LEFT COLUMN: FORMS */}
                <Grid size={{xs: 12, md: 7}}>
                    <Stack spacing={3}>
                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                    <Typography variant="h5" fontWeight="700">Shipping Information</Typography>
                                </Box>

                                {/* SAVED ADDRESSES SECTION */}
                                {!showAddressForm && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>Saved Addresses</Typography>
                                        {loadingAddresses ? (
                                            <AddressCardShimmer count={2} />
                                        ) : savedAddresses.length > 0 ? (
                                            <Stack spacing={2}>
                                                {savedAddresses.map((addr) => (
                                                    <Paper
                                                        key={addr.id}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            cursor: 'pointer',
                                                            border: formData.address_id === addr.id ? '2px solid' : '1px solid',
                                                            borderColor: formData.address_id === addr.id ? 'primary.main' : 'divider',
                                                            bgcolor: formData.address_id === addr.id ? 'primary.lighter' : 'background.paper',
                                                            transition: 'all 0.2s',
                                                            '&:hover': { borderColor: 'primary.main' }
                                                        }}
                                                        onClick={() => handleAddressSelect(addr)}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Box>
                                                                <Typography variant="subtitle2" fontWeight="700">{addr.name}</Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                                    {addr.address_line}, {addr.city}, {addr.state} - {addr.zip}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                    {addr.phone}
                                                                </Typography>
                                                            </Box>
                                                            {addr.is_default && (
                                                                <Typography variant="caption" sx={{ bgcolor: 'primary.main', color: 'white', px: 1, py: 0.5, borderRadius: 1, fontWeight: 600 }}>
                                                                    Default
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </Paper>
                                                ))}
                                                <Button
                                                    class="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-xs font-black uppercase tracking-widest"
                                                    variant="outlined"
                                                    startIcon={<LocalShippingOutlined />}
                                                    onClick={() => {
                                                        setShowAddressForm(true);
                                                        setFormData(prev => ({ ...prev, address_id: null, name: '', phone: '', address: '', city: '', state: '', zip: '' }));
                                                    }}
                                                >
                                                    Add New Address
                                                </Button>
                                            </Stack>
                                        ) : null}
                                    </Box>
                                )}

                                {/* NEW ADDRESS FORM */}
                                {(showAddressForm || savedAddresses.length === 0) && (
                                    <>
                                        {savedAddresses.length > 0 && (
                                            <Button 
                                                size="small" 
                                                onClick={() => setShowAddressForm(false)} 
                                                sx={{ alignSelf: 'flex-start', mb: 2 }}
                                            >
                                                Cancel & Select Saved Address
                                            </Button>
                                        )}
                                            
                                        {!token && (
                                            <TextField
                                                required fullWidth
                                                label="Email Address"
                                                type="email"
                                                name="email"
                                                value={guestEmail}
                                                onChange={(e) => {
                                                    setGuestEmail(e.target.value);
                                                    validateShipping('email', e.target.value);
                                                }}
                                                onBlur={handleBlur}
                                                error={!!shippingErrors.email}
                                                helperText={shippingErrors.email}
                                                InputProps={{ 
                                                    startAdornment: <InputAdornment position="start"><EmailOutlined /></InputAdornment>,
                                                    endAdornment: isValid('email') && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment>
                                                }}
                                                sx={{ mb: 2 }} 
                                            />
                                        )}

                                        <TextField
                                            required fullWidth
                                            label="Full Name" name="name"
                                            value={formData.name}
                                            onChange={handleGeneralChange}
                                            onBlur={handleBlur}
                                            error={!!shippingErrors.name}
                                            helperText={shippingErrors.name}
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><PersonOutline /></InputAdornment>,
                                                endAdornment: isValid('name') && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment>
                                            }}
                                        />

                                        <TextField
                                            required fullWidth
                                            label="Phone Number" name="phone"
                                            placeholder="10-digit number"
                                            value={formData.phone}
                                            onChange={handleGeneralChange}
                                            onBlur={handleBlur}
                                            error={!!shippingErrors.phone}
                                            helperText={shippingErrors.phone}
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start"><PhoneOutlined /></InputAdornment>,
                                                endAdornment: isValid('phone') && <InputAdornment position="end"><CheckCircle color="success" /></InputAdornment>
                                            }}
                                        />

                                        <TextField
                                            required fullWidth
                                            label="Address Line" name="address"
                                            multiline rows={2}
                                            value={formData.address}
                                            onChange={handleGeneralChange}
                                            onBlur={handleBlur}
                                            error={!!shippingErrors.address}
                                            helperText={shippingErrors.address}
                                            InputProps={{ 
                                                startAdornment: <InputAdornment position="start" sx={{ mt: -2.5 }}><LocalShippingOutlined /></InputAdornment>,
                                                endAdornment: isValid('address') && <InputAdornment position="end" sx={{ mt: -2.5 }}><CheckCircle color="success" /></InputAdornment>
                                            }}
                                        />

                                        <Stack direction="row" spacing={2}>
                                            <TextField
                                                required fullWidth label="City" name="city"
                                                value={formData.city} onChange={handleGeneralChange} onBlur={handleBlur} error={!!shippingErrors.city}
                                                InputProps={{ endAdornment: isValid('city') && <InputAdornment position="end"><CheckCircle color="success" fontSize="small" /></InputAdornment> }}
                                            />
                                            <TextField
                                                required fullWidth label="State" name="state"
                                                value={formData.state} onChange={handleGeneralChange} onBlur={handleBlur} error={!!shippingErrors.state}
                                                InputProps={{ endAdornment: isValid('state') && <InputAdornment position="end"><CheckCircle color="success" fontSize="small" /></InputAdornment> }}
                                            />
                                            <TextField
                                                required fullWidth label="ZIP Code" name="zip"
                                                value={formData.zip} onChange={handleGeneralChange} onBlur={handleBlur} error={!!shippingErrors.zip}
                                                InputProps={{ endAdornment: isValid('zip') && <InputAdornment position="end"><CheckCircle color="success" fontSize="small" /></InputAdornment> }}
                                            />
                                        </Stack>

                                        {token && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                                <input
                                                    type="checkbox" id="save_address" name="save_address"
                                                    checked={formData.save_address} onChange={handleGeneralChange}
                                                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                                                />
                                                <Typography component="label" htmlFor="save_address" sx={{ ml: 1.5, cursor: 'pointer', fontWeight: 500 }}>
                                                    Save this address for future orders
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                )}

                                <Button
                                   class="mt-auto w-full bg-white border-2 border-slate-100 text-slate-900 py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-sm hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                                    variant="contained" size="large"
                                    onClick={handleProceedToPayment}
                                    sx={{ mt: 2, py: 1.8, borderRadius: 2, fontWeight: 'bold' }}
                                >
                                    Proceed to Payment
                                </Button>
                            </Box>
                        </Paper>
                {/* Back Button */}
                        <Button class="w-50 flex items-center justify-left py-0 px-0 text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-xs font-black uppercase tracking-widest"
                             startIcon={<ArrowBackIosNew />} onClick={() => navigate('/home')} sx={{ alignSelf: 'flex-start' }}>
                            Back to Home
                        </Button>
                    </Stack>
                </Grid>

                {/* RIGHT COLUMN: SUMMARY */}
                <Grid size={{xs: 12, md: 5}}>
                    <Box sx={{ position: 'sticky', top: 20 }}>
                        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <Typography variant="h5" fontWeight="700" sx={{ m: 3, mt: 4, mb: 1 }}>Order Summary</Typography>
                            <List disablePadding sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {cart.map((item) => (
                                    <ListItem key={item.id} sx={{ py: 2, px: 3, borderBottom: '1px solid #f5f5f5' }}>
                                        <ListItemAvatar sx={{ mr: 2 }}><Avatar variant="rounded" src={item.url} sx={{ width: 64, height: 64 }} /></ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle2" fontWeight="700">{item.name}</Typography>}
                                            secondary={`Size: ${item.size} | Qty: ${item.quantity}`}
                                        />
                                        {/* quantity */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e0e0e0', height: 30, borderRadius: 1 }}>
                                                {/* <Button
                                                    size="small"
                                                    sx={{ minWidth: 30, p: 0, color: 'text.secondary' }}
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                                >
                                                    -
                                                </Button>
                                                <Typography variant="body2" sx={{ px: 1, fontWeight: 600 }}>{item.quantity}</Typography>
                                                <Button
                                                    size="small"
                                                    sx={{ minWidth: 30, p: 0, color: 'text.secondary' }}
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                >
                                                    +
                                                </Button> */}
                                                <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-slate-400 hover:text-primary shadow-sm transition-all"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="text-xs font-black w-8 text-center text-slate-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-slate-400 hover:text-primary shadow-sm transition-all"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                            </Box>
                                            <Box sx={{ textAlign: 'right', minWidth: 80 }}>
                                                    <Stack direction="column" alignItems="flex-end" spacing={0}>
                                                        <Typography
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontWeight: 800,
                                                                color: 'text.primary',
                                                                lineHeight: 1.2
                                                            }}
                                                        >
                                                            ₹{Number(item.discountedPrice * item.quantity).toLocaleString('en-IN')}
                                                        </Typography>

                                                        {Number(item.discount) > 0 && (
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    textDecoration: 'line-through',
                                                                    color: 'error.main',
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                                                            </Typography>
                                                        )}
                                                    </Stack>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>

                            {/* Totals */}
                            <Box sx={{ p: 3, bgcolor: '#fafafa', mt: 'auto' }}>
                                <Stack spacing={1.5}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                        <Typography variant="body2" fontWeight="600">₹{getCartTotal().toLocaleString('en-IN')}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Discount</Typography>
                                        <Typography variant="body2" color="error.main" fontWeight="600">-₹{getDiscount().toLocaleString('en-IN')}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" color="text.secondary">Shipping</Typography>
                                        <Typography variant="body2" color="success.main" fontWeight="600">FREE</Typography>
                                    </Box>
                                    <Divider sx={{ my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" fontWeight="800">Grand Total</Typography>
                                        <Typography variant="h5" color="primary.main" fontWeight="800">
                                            ₹{getCartTotal().toLocaleString('en-IN')}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Checkout;