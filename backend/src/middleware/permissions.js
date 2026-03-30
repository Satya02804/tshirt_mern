// Check if user has specific permission
export const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Authentication required'
                });
            }

            const hasPermission = await req.user.hasPermission(permissionName);
            console.log(`[Permission Check] User: ${req.user.email}, Permission: ${permissionName}, Result: ${hasPermission}`);

            if (!hasPermission) {
                return res.status(403).json({
                    status: 'error',
                    message: `You do not have permission: ${permissionName}`
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error checking permissions'
            });
        }
    };
};

// Check if user has specific role
export const checkRole = (roleName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Authentication required'
                });
            }

            const hasRole = await req.user.hasRole(roleName);

            if (!hasRole) {
                return res.status(403).json({
                    status: 'error',
                    message: `You do not have role: ${roleName}`
                });
            }

            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error checking role'
            });
        }
    };
};

// Check if user has any of the specified permissions
export const checkAnyPermission = (permissions) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Authentication required'
                });
            }

            for (const permission of permissions) {
                const hasPermission = await req.user.hasPermission(permission);
                if (hasPermission) {
                    return next();
                }
            }

            return res.status(403).json({
                status: 'error',
                message: 'You do not have the required permissions'
            });
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Error checking permissions'
            });
        }
    };
};
