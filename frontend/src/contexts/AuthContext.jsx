import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and user on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Refresh permissions once on mount or when refreshTrigger changes
    useEffect(() => {
        if (!user) return;
        let isMounted = true;

        const refreshPermissions = async () => {
            try {
                const response = await api.get(`/auth/refresh-permissions?_t=${new Date().getTime()}`);
                if (isMounted) {
                    const updatedUser = response.data.data;
                    
                    // Update user in state and localStorage
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            } catch (error) {
                console.error('Failed to refresh permissions, user may have been removed or role revoked:', error);
                if (isMounted) {
                    logout();
                    window.location.href = '/';
                }
            }
        };

        refreshPermissions();

        return () => {
            isMounted = false;
        };
    }, [user?.id, refreshTrigger]); // Re-run when user ID changes or manual update triggers refresh

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const register = async (name, email, password, phone, confirmPassword) => {
        try {
            const response = await api.post('/auth/register', { name, email, password, phone, confirmPassword });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const hasPermission = (permissionName) => {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permissionName);
    };

    const hasRole = (roleName) => {
        if (!user || !user.roles) return false;
        return user.roles.includes(roleName);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setRefreshTrigger(prev => prev + 1);
    };

    const forgotPassword = async (email) => {
        try {
            await api.post('/auth/forgot-password', { email });
            return { success: true };
        } catch (error) {
            console.error('Forgot password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send reset email',
            };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            await api.post('/auth/reset-password', { token, password });
            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reset password',
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, hasPermission, hasRole, updateUser, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
