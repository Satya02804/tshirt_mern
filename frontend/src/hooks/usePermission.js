import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook to check user permissions
 * Similar to Laravel's @can directive
 */
export const usePermission = () => {
    const { user } = useAuth();

    /**
     * Check if user has a specific permission
     * @param {string} permission - Permission name to check
     * @returns {boolean}
     */
    const hasPermission = (permission) => {
        if (!user || !user.permissions) {
            return false;
        }
        return user.permissions.includes(permission);
    };

    /**
     * Check if user has ANY of the specified permissions
     * @param {string[]} permissions - Array of permission names
     * @returns {boolean}
     */
    const hasAnyPermission = (permissions) => {
        if (!user || !user.permissions) {
            return false;
        }
        return permissions.some(permission => user.permissions.includes(permission));
    };

    /**
     * Check if user has ALL of the specified permissions
     * @param {string[]} permissions - Array of permission names
     * @returns {boolean}
     */
    const hasAllPermissions = (permissions) => {
        if (!user || !user.permissions) {
            return false;
        }
        return permissions.every(permission => user.permissions.includes(permission));
    };

    /**
     * Check if user has a specific role
     * @param {string} role - Role name to check
     * @returns {boolean}
     */
    const hasRole = (role) => {
        if (!user || !user.roles) {
            return false;
        }
        return user.roles.includes(role);
    };

    /**
     * Check if user has ANY of the specified roles
     * @param {string[]} roles - Array of role names
     * @returns {boolean}
     */
    const hasAnyRole = (roles) => {
        if (!user || !user.roles) {
            return false;
        }
        return roles.some(role => user.roles.includes(role));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        hasRole,
        hasAnyRole,
        permissions: user?.permissions || [],
        roles: user?.roles || []
    };
};
