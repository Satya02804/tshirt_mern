'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Tooltip,
  IconButton,
  Divider,
  Skeleton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { CardShimmer } from '../../components/common/Shimmer';
import Can from '../../components/common/Can';


// Permission categories for better organization
const PERMISSION_CATEGORIES = {
  'product': 'Product Management',
  'order': 'Order Management',
  'user': 'User Management',
  'role': 'Role Management',
  'dashboard': 'Dashboard Access',
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRole, setExpandedRole] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [roleData, setRoleData] = useState({ name: '' });
  const [roleErrors, setRoleErrors] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Fetch Roles and Permissions on Mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const rolesRes = await api.get('/roles');
      setRoles(rolesRes.data.data);

      const permsRes = await api.get('/roles/permissions');
      setPermissions(permsRes.data.data);
    } catch (err) {
      console.error('Error fetching roles/permissions:', err);
      setError('Failed to load roles and permissions.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryForPermission = (permName) => {
    for (const [key, label] of Object.entries(PERMISSION_CATEGORIES)) {
      if (permName.toLowerCase().includes(key)) {
        return key;
      }
    }
    return 'other';
  };

  const addRoles = () => {
    setRoleData({ name: '' });
    setRoleErrors({});
    setOpenRoleDialog(true);
  };

  const getPermissionsByCategory = () => {
    const grouped = {};
    permissions.forEach((perm) => {
      const category = getCategoryForPermission(perm.name);
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(perm);
    });
    return grouped;
  };

  const handleTogglePermission = async (roleId, permissionId, currentRolePermissions) => {
    try {
      const hasPermission = currentRolePermissions.some((p) => p.id === permissionId);
      let newPermissionIds;

      if (hasPermission) {
        newPermissionIds = currentRolePermissions.filter((p) => p.id !== permissionId).map((p) => p.id);
      } else {
        newPermissionIds = [...currentRolePermissions.map((p) => p.id), permissionId];
      }

      await api.put(`/roles/${roleId}/permissions`, { permissions: newPermissionIds });

      setRoles((prevRoles) =>
        prevRoles.map((role) => {
          if (role.id === roleId) {
            const updatedPermissions = hasPermission
              ? role.permissions.filter((p) => p.id !== permissionId)
              : [...role.permissions, permissions.find((p) => p.id === permissionId)];
            return { ...role, permissions: updatedPermissions };
          }
          return role;
        })
      );

      toast.success('Permissions updated successfully');
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update permission');
    }
  };

  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      if (!roleToDelete) return;

      await api.delete(`/roles/${roleToDelete.id}`);

      setRoles(prevRoles => prevRoles.filter(role => role.id !== roleToDelete.id));
      toast.success('Role deleted successfully');
      setOpenDeleteDialog(false);
      setRoleToDelete(null);
      // If the deleted role was expanded, collapse it
      if (expandedRole === roleToDelete.id) {
        setExpandedRole(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const filteredPermissions = permissions.filter((perm) =>
    perm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="30%" height={40} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="50%" height={20} />
        </Box>
        <Card sx={{ mb: 4, bgcolor: 'rgba(30, 64, 175, 0.04)', border: '1px solid rgba(30, 64, 175, 0.2)' }}>
          <CardContent sx={{ py: 2 }}>
            <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={16} />
          </CardContent>
        </Card>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="20%" height={28} sx={{ mb: 2 }} />
          <CardShimmer count={3} />
        </Box>
        <Box>
          <Skeleton variant="text" width="20%" height={28} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const handleSaveRole = async () => {
    try {
      if (!roleData.name.trim()) {
        setRoleErrors({ name: 'Role name is required' });
        return;
      }

      await api.post('/roles', roleData);
      toast.success('Role created successfully');
      setOpenRoleDialog(false);
      fetchData();
    } catch (err) {
      console.error('Error saving role:', err);
      toast.error(err.response?.data?.message || 'Failed to save role');
    }
  };

  const permissionsByCategory = getPermissionsByCategory();

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
              Roles & Permissions
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Manage user roles and their associated permissions
            </Typography>
          </Box>
          <Can permission="create-permission">
            <Button class="mt-auto bg-primary border-2 border-slate-100 text-white py-3 px-3 rounded-xl font-black text-xs tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
              variant="contained" onClick={addRoles} startIcon={<AddIcon />} sx={{ borderRadius: 1 }}>
              Add New Role
            </Button>
          </Can>
        </Box>
      </Box>

      {/* Info Card */}
      <Card sx={{ mb: 4, bgcolor: 'rgba(30, 64, 175, 0.04)', border: '1px solid rgba(30, 64, 175, 0.2)' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
            <InfoIcon sx={{ color: 'primary.main', mt: 0.5 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Understanding Roles & Permissions
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Roles define user access levels. Each role can have multiple permissions that control what actions users can perform
                in the system.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Roles Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
          Active Roles
        </Typography>
        <Grid container spacing={2}>
          {roles.map((role) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={role.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  border: expandedRole === role.id ? '2px solid' : '1px solid',
                  borderColor: expandedRole === role.id ? 'primary.main' : 'divider',
                  '&:hover': {
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-4px)',
                  },
                }}
                onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                      }}
                    >
                      {role.name.charAt(0).toUpperCase()}
                    </Box>
                    <Box >
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        <Can permission="delete-role">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(role);
                            }}
                            sx={{ ml: 1 }}
                          >
                            <DeleteIcon sx={{ fontSize: 18, color: 'error.main' }} />
                          </IconButton>
                        </Can>
                      </Typography>
                      <Chip
                        size="small"
                        icon={<CheckCircleIcon />}
                        label={`${role.permissions.length} permissions`}
                        variant="outlined"
                        sx={{ height: 24 }}
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {role.permissions.slice(0, 3).map((perm) => (
                      <Chip
                        key={perm.id}
                        label={perm.name.replace(/-/g, ' ')}
                        size="small"
                        variant="outlined"
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    ))}
                    {role.permissions.length > 3 && (
                      <Chip
                        label={`+${role.permissions.length - 3} more`}
                        size="small"
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Permission Matrix */}
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Permission Matrix
          </Typography>
          <TextField
            placeholder="Search permissions..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2, minWidth: 300 }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f1f5f9' }}>
                <TableCell sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>Role</TableCell>
                {filteredPermissions.map((perm) => (
                  <TableCell
                    key={perm.id}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      fontSize: '0.85rem',
                      maxWidth: 120,
                    }}
                  >
                    <Tooltip
                      title={perm.description || perm.name}
                      placement="top"
                      arrow
                    >
                      <Box sx={{ cursor: 'help' }}>
                        {perm.name.replace(/-/g, ' ')}
                      </Box>
                    </Tooltip>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role, idx) => (
                <TableRow
                  key={role.id}
                  sx={{
                    bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                    '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.04)' },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary', minWidth: 150 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </Box>
                  </TableCell>
                  {filteredPermissions.map((perm) => {
                    const isChecked = role.permissions.some((p) => p.id === perm.id);
                    return (
                      <TableCell key={perm.id} align="center">
                        <Tooltip title={isChecked ? 'Remove permission' : 'Add permission'}>
                          <Switch
                            checked={isChecked}
                            onChange={() => handleTogglePermission(role.id, perm.id, role.permissions)}
                            color="primary"
                            inputProps={{ 'aria-label': 'permission toggle' }}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#10b981',
                              },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#10b981',
                              },
                            }}
                          />
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 4, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
          Legend
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon sx={{ color: '#10b981', fontSize: '1.25rem' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Permission Enabled
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 24, height: 12, bgcolor: '#e2e8f0', borderRadius: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Permission Disabled
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Role Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Role Name"
              value={roleData.name}
              onChange={(e) => {
                setRoleData({ ...roleData, name: e.target.value });
                if (roleErrors.name) setRoleErrors({ ...roleErrors, name: null });
              }}
              error={!!roleErrors.name}
              helperText={roleErrors.name}
              autoFocus
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all" onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button class="mt-auto bg-primary border-2 border-slate-100 text-white py-3 px-6 rounded-xl font-black text-xs tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3" variant="contained" onClick={handleSaveRole}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            This action cannot be undone. Users with this role may lose access permissions.
          </Alert>
          <Typography>
            Are you sure you want to delete role <strong>{roleToDelete?.name}</strong>?
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

export default Roles;
