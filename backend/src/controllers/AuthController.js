import { User, Role, Order, Wishlist } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendPasswordChangedEmail } from '../utils/email.js';
import { Op } from 'sequelize';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const register = async (req, res) => {
    try {
        const { name, email, password, phone, confirmPassword } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists with this email'
            });
        }

        // Check if confirmPassword matches password
        if (password !== confirmPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Passwords do not match'
            });
        }

        // Check if password is strong
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                status: 'error',
                message: '6+ chars: include A-z, 0-9, and a symbol'
            });
        }

        // Check if phone number is valid
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                status: 'error',
                message: 'Phone number must be 10 digits long'
            });
        }

        // Create user (only after all validations pass)
        const user = await User.create({ name, email, password, phone });

        // Assign default 'user' role
        const userRole = await Role.findOne({ where: { name: 'user' } });
        if (userRole) {
            await user.addRole(userRole);
        }

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error registering user',
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({
            where: { email },
            include: [{
                association: 'roles',
                include: ['permissions']
            }]
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user.id);

        // Get user permissions
        const permissions = [];
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                if (!permissions.includes(permission.name)) {
                    permissions.push(permission.name);
                }
            }
        }

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    roles: user.roles.map(r => r.name),
                    permissions
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error logging in',
            error: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'No user found with this email'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash token for database storage
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save hashed token to user
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send email with PLAIN token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendPasswordResetEmail(user.email, user.name, resetUrl);

        res.json({
            status: 'success',
            message: 'Password reset email sent'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error sending password reset email',
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        // Hash the provided token to compare with the stored hashed token
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or expired reset token'
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Send confirmation email
        await sendPasswordChangedEmail(user.email, user.name);

        res.json({
            status: 'success',
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error resetting password',
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                association: 'roles',
                include: ['permissions']
            }]
        });

        const permissions = [];
        for (const role of user.roles) {
            for (const permission of role.permissions) {
                if (!permissions.includes(permission.name)) {
                    permissions.push(permission.name);
                }
            }
        }

        const ordersCount = await Order.count({ where: { userId: user.id } });
        const wishlistCount = await Wishlist.count({ where: { user_id: user.id } });

        res.json({
            status: 'success',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl,
                roles: user.roles.map(r => r.name),
                permissions,
                stats: {
                    ordersCount,
                    wishlistCount
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching profile'
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        console.log('Update profile request body:', req.body);
        const { name, email, phone, avatarUrl } = req.body;
        const user = await User.findByPk(req.user.id, {
            include: ['roles']
        });

        // Check if user is super-admin or admin
        const userRoles = user.roles.map(r => r.name);
        const isSuperAdmin = userRoles.includes('super-admin');
        const isAdmin = userRoles.includes('admin');

        // Prevent super-admin and admin from updating email
        if ((isSuperAdmin || isAdmin) && email && email !== user.email) {
            return res.status(403).json({
                status: 'error',
                message: 'Super-admin and admin users cannot change their email address'
            });
        }

        // For regular users, check if new email is already in use by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ 
                where: { 
                    email,
                    id: { [Op.ne]: user.id } // Exclude current user
                } 
            });
            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already in use'
                });
            }
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.avatarUrl = avatarUrl !== undefined ? avatarUrl : user.avatarUrl;
        await user.save();

        res.json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating profile'
        });
    }
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'error',
                message: 'No image file provided'
            });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Create filename and path
        const filename = `avatar-${user.id}-${Date.now()}.png`; // Standardize on PNG
        const uploadDir = path.join(__dirname, '../../public/uploads/avatars');
        const filepath = path.join(uploadDir, filename);

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Resize and save image using sharp
        await sharp(req.file.buffer)
            .resize({
                width: 500,
                height: 500,
                fit: 'cover',
                position: 'center'
            })
            .png({ quality: 90 })
            .toFile(filepath);

        // Delete old avatar if it exists
        if (user.avatarUrl) {
            try {
                // Extract filename from URL (e.g., http://localhost:5000/uploads/avatars/filename.png)
                const oldFilename = user.avatarUrl.split('/').pop();
                if (oldFilename) {
                    const oldFilepath = path.join(uploadDir, oldFilename);
                    if (fs.existsSync(oldFilepath)) {
                        fs.unlinkSync(oldFilepath);
                    }
                }
            } catch (err) {
                console.error('Error deleting old avatar:', err);
                // Continue even if deleting old avatar fails
            }
        }

        // Update user record
        const serverUrl = process.env.APP_URL || 'http://localhost:5000';
        const newAvatarUrl = `${serverUrl}/uploads/avatars/${filename}`;
        
        user.avatarUrl = newAvatarUrl;
        await user.save();

        res.json({
            status: 'success',
            message: 'Avatar updated successfully',
            data: {
                avatarUrl: user.avatarUrl
            }
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error uploading avatar',
            error: error.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!await user.comparePassword(currentPassword)) {
            return res.status(400).json({
                status: 'error',
                message: 'Incorrect current password'
            });
        }
    
        if (newPassword === currentPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'New password cannot be same as current password'
            });
        }
    
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'New passwords do not match'
            });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                status: 'error',
                message: '6+ chars: include A-z, 0-9, and a symbol'
            });
        }

        user.password = newPassword;
        await user.save();

        res.json({
            status: 'success',
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error changing password'
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email','phone', 'created_at'],
            include: [{
                association: 'roles',
                attributes: ['name']
            }],
            order: [['created_at', 'DESC']]
        });

        res.json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users'
        });
    }
};


export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const roleRecord = await Role.findOne({ where: { name: role } });
        if (!roleRecord) {
            return res.status(404).json({
                status: 'error',
                message: 'Role not found'
            });
        }

        await user.setRoles([roleRecord]);

        res.json({
            status: 'success',
            message: 'User role updated successfully'
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating user role'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            include: ['roles']
        });

        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Can't delete super-admin
        const isSuperAdmin = user.roles.some(role => role.name === 'super-admin');
        if (isSuperAdmin) {
            return res.status(403).json({
                hidebutton: true,
                status: 'error',
                message: 'Cannot delete super-admin user'
            });
        }   

        //can't delete self
        if (user.id === req.user.id) {
            return res.status(403).json({
                hidebutton: true,
                status: 'error',
                message: 'Cannot delete self'
            });
        }

        await user.destroy();

        res.json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete user'
        });
    }
};
