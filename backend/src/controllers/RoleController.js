import { Role, Permission } from '../models/index.js';

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll({
            include: [{
                association: 'permissions',
                attributes: ['id', 'name']
            }]
        });

        res.json({
            status: 'success',
            data: roles
        });
    } catch (error) {
        console.error('Get roles error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching roles'
        });
    }
};

export const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Role name is required'
            });
        }

        const role = await Role.create({ name });

        if (permissions && permissions.length > 0) {
            await role.setPermissions(permissions);
        }

        const roleWithPermissions = await Role.findByPk(role.id, {
            include: [{
                association: 'permissions',
                attributes: ['id', 'name']
            }]
        });

        res.status(201).json({
            status: 'success',
            data: roleWithPermissions,
            message: 'Role created successfully'
        });
    } catch (error) {
        console.error('Create role error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating role'
        });
    }
};

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll();
        res.json({
            status: 'success',
            data: permissions
        });
    } catch (error) {
        console.error('Get permissions error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching permissions'
        });
    }
};

export const updateRolePermissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body; // Array of permission names or IDs

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({
                status: 'error',
                message: 'Role not found'
            });
        }

        await role.setPermissions(permissions);

        res.json({
            status: 'success',
            message: 'Role permissions updated successfully'
        });
    } catch (error) {
        console.error('Update role permissions error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating role permissions'
        });
    }
};

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const role = await Role.findByPk(id);
        if (!role) {
            return res.status(404).json({
                status: 'error',
                message: 'Role not found'
            });
        }

        role.name = name;
        await role.save();

        res.json({
            status: 'success',
            message: 'Role updated successfully'
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating role'
        });
    }
};

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                status: 'error',
                message: 'Role not found'
            });
        }

        // Prevent deleting system roles
        const systemRoles = ['super-admin', 'admin', 'user'];
        if (systemRoles.includes(role.name)) {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot delete system roles'
            });
        }

        // Check if role has users assigned
        const usersCount = await role.countUsers();
        if (usersCount > 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Cannot delete role with assigned users'
            });
        }

        await role.destroy();

        res.json({
            status: 'success',
            message: 'Role deleted successfully'
        });
    } catch (error) {
        console.error('Delete role error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting role'
        });
    }
};
