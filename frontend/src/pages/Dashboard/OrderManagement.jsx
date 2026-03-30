'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Box,
    Menu,
    MenuItem,
    CircularProgress,
    Button,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    Avatar
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Can from '../../components/common/Can';
import { TableRowShimmer } from '../../components/common/Shimmer';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDetailsModal, setOpenDetailsModal] = useState(false);

    // Filter statuses
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'processing': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'shipped': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
            case 'delivered': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'cancelled': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleMenuClick = (event, order) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenDetailsModal(true);
    };

    const handleCloseDetailsModal = () => {
        setOpenDetailsModal(false);
        setSelectedOrder(null);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedOrder(null);
    };

    const handleStatusUpdate = async (newStatus) => {
        if (!selectedOrder) return;

        try {
            await api.put(`/orders/${selectedOrder.id}/status`, { status: newStatus });
            toast.success(`Order #${selectedOrder.orderNumber} marked as ${newStatus}`);
            fetchOrders(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        } finally {
            handleMenuClose();
        }
    };

    const filteredOrders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                        Order Management
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Manage your orders and update their status
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, }} >
                                   {/* Search Bar */}
                                   <Paper sx={{ px:1,py:0.5,borderRadius: 2, border:'none', boxShadow:'none', backgroundColor:'white', color:'slate-900'}}>
                                       <TextField
                                           fullWidth
                                           placeholder="Search products by name..."
                                           value={searchTerm}
                                           onChange={(e) => setSearchTerm(e.target.value)}
                                           InputProps={{
                                               startAdornment: (
                                                   <InputAdornment position="start">
                                                       <SearchIcon sx={{ color: 'text.secondary' }} />
                                                   </InputAdornment>
                                               ),
                                           }}
                                           variant="outlined"
                                           size="small"
                                           sx={{
                                               '& .MuiOutlinedInput-root': {
                                                   borderRadius: 1,
                                               },
                                           }}
                                       />
                                   </Paper>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f1f5f9', borderBottom: '2px solid', borderColor: 'divider' }}>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Order ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Total</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Payment</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>View</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRowShimmer columns={8} />
                        ) : filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">No orders found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order, idx) => (
                                <TableRow
                                    key={order.id}
                                    sx={{
                                        bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                                        '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.04)' },
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    <TableCell fontWeight="medium">{order.orderNumber}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="500">{order.user.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{order.user.email}</Typography>
                                    </TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell fontWeight="bold">₹{Number(order.totalPrice).toLocaleString('en-IN')}</TableCell>
                                    <TableCell>
                                        <p className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </p>
                                    </TableCell>
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            onClick={() => handleViewDetails(order)}
                                            title="View Order Details"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Can permission="update-order-status">
                                            <IconButton onClick={(e) => handleMenuClick(e, order)}>
                                                <MoreVertIcon />
                                            </IconButton>
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem disabled>
                    <Typography variant="caption" color="text.secondary">Update Status</Typography>
                </MenuItem>
                {statuses.map((status) => (
                    <MenuItem
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        selected={selectedOrder?.status === status}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </MenuItem>
                ))}
            </Menu>

            {/* Order Details Modal */}
            <Dialog
                open={openDetailsModal}
                onClose={handleCloseDetailsModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" fontWeight="bold">
                            Order Details - {selectedOrder?.orderNumber}
                        </Typography>
                        <p className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${getStatusColor(selectedOrder?.status || 'pending')}`}>
                            {selectedOrder?.status}
                        </p>
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedOrder && (
                        <Box>
                            {/* Customer Info */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Customer Information
                                </Typography>
                                <Typography variant="body1"><strong>Name:</strong> {selectedOrder.user.name}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {selectedOrder.user.email}</Typography>
                                <Typography variant="body1"><strong>Phone:</strong> {selectedOrder.phone}</Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Shipping Address */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Shipping Address
                                </Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                                    {selectedOrder.shippingAddress}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Order Items */}
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Ordered Products
                                </Typography>
                                <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                            <TableRow>
                                                <TableCell>Product</TableCell>
                                                <TableCell align="right">Price</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right">Subtotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOrder.items && selectedOrder.items.map((item) => (
                                                <TableRow key={item.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Avatar
                                                                src={item.product.url}
                                                                alt={item.product.name}
                                                                variant="rounded"
                                                                sx={{ width: 40, height: 40 }}
                                                            />
                                                            <Typography variant="body2">{item.product.name}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">₹{Number(item.price).toFixed(2)}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right">₹{(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={3} align="right">
                                                    <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                                                        ₹{Number(selectedOrder.totalPrice).toFixed(2)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Payment Info */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Payment Information
                                </Typography>
                                <Typography variant="body1"><strong>Method:</strong> {selectedOrder.paymentMethod}</Typography>
                                <Typography variant="body1"><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                       class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                            onClick={handleCloseDetailsModal}>Close</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default OrderManagement;
