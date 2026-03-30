import React from 'react';
import { usePermission } from '../../hooks/usePermission';

/**
 * Can Component - Conditionally render children based on permissions
 * Similar to Laravel's @can Blade directive
 * 
 * Usage:
 * <Can permission="delete-users">
 *   <Button>Delete</Button>
 * </Can>
 * 
 * <Can permissions={['edit-products', 'delete-products']} any>
 *   <Button>Manage</Button>
 * </Can>
 */
const Can = ({ 
    permission, 
    permissions, 
    role,
    roles,
    any = false, 
    children,
    fallback = null 
}) => {
    const { 
        hasPermission, 
        hasAnyPermission, 
        hasAllPermissions,
        hasRole,
        hasAnyRole
    } = usePermission();

    let canRender = false;

    // Check single permission
    if (permission) {
        canRender = hasPermission(permission);
    }
    // Check multiple permissions
    else if (permissions && permissions.length > 0) {
        canRender = any 
            ? hasAnyPermission(permissions) 
            : hasAllPermissions(permissions);
    }
    // Check single role
    else if (role) {
        canRender = hasRole(role);
    }
    // Check multiple roles
    else if (roles && roles.length > 0) {
        canRender = any 
            ? hasAnyRole(roles) 
            : roles.every(r => hasRole(r));
    }

    return canRender ? <>{children}</> : <>{fallback}</>;
};

export default Can;
