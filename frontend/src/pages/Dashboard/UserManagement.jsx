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
    IconButton,
    Box,
    CircularProgress,
    TextField,
    InputAdornment,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    Select,
    MenuItem
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Can from '../../components/common/Can';
import { useAuth } from '../../contexts/AuthContext';
import { TableRowShimmer } from '../../components/common/Shimmer';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/auth/users');
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await api.get('/roles');
            setRoles(response.data.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Failed to load roles');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/auth/users/${selectedUser.id}`);
            toast.success('User deleted successfully');
            setOpenDeleteDialog(false);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/auth/users/${userId}/role`, { role: newRole });
            toast.success('Role updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error(error.response?.data?.message || 'Failed to update role');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'super-admin': return 'text-rose-600 bg-rose-50 border-rose-100';
            case 'admin': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'user': return 'text-blue-600 bg-blue-50 border-blue-100';
            default: return 'default';
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 2 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                            User Management
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Manage your users and their roles
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, }} >
                        {/* Search Bar */}
                        <Paper sx={{ px: 1, py: 0.5, borderRadius: 2, border: 'none', boxShadow: 'none', backgroundColor: 'white', color: 'slate-900' }}>
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
            </Box>


            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f1f5f9', borderBottom: '2px solid', borderColor: 'divider' }}>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Role Change</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Joined Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRowShimmer columns={7} />
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                                    <Typography color="text.secondary">No users found.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user, idx) => (
                                <TableRow
                                    key={user.id}
                                    sx={{
                                        bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                                        '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.04)' },
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    <TableCell fontWeight="medium">{idx + 1}</TableCell>
                                    <TableCell fontWeight="medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        {user.roles && user.roles.map(role => (
                                            <p className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${getStatusColor(role.name)}`}>
                                                {role.name.toUpperCase()}
                                            </p>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        <Can
                                            permission="update-permission"
                                            fallback={
                                                <Chip
                                                    label={user.roles && user.roles.length > 0 ? user.roles[0].name.toUpperCase() : 'N/A'}
                                                    size="small"
                                                    color={getStatusColor(user.roles && user.roles.length > 0 ? user.roles[0].name : '')}
                                                />
                                            }
                                        >
                                            {roles.length > 0 && (
                                                <Select
                                                    size="small"
                                                    value={user.roles && user.roles.length > 0 ? user.roles[0].name : ''}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    {roles.map((role) => (
                                                        <MenuItem key={role.id} value={role.name}>
                                                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                        </Can>
                                    </TableCell>
                                    <TableCell>{new Date(user.created_at).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell align="right">
                                        <Can permission="delete-users">
                                            {!user.roles?.some(r => r.name === 'super-admin') && currentUser?.id !== user.id && (
                                                <IconButton
                                                    onClick={() => handleDeleteClick(user)}
                                                    color="error"
                                                    title="Delete User"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            )}
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone.
                    </Alert>
                    <Typography>
                        Are you sure you want to delete user <strong>{selectedUser?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        class='mt-auto text-rose-600 bg-rose-50 border-rose-100 py-3 px-6 rounded-xl font-black text-sm tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
                        onClick={() => setOpenDeleteDialog(false)} variant="outlined" sx={{ borderRadius: 1 }}>
                        CANCEL
                    </Button>
                    <Button class='mt-auto text-blue-600 bg-blue-50 border-blue-100 py-3 px-6 rounded-xl font-black text-sm tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
                        onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: 1, fontWeight: 600 }}>
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;
