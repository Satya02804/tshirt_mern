import { User, Role, Order, Product, OrderItem } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalProducts = await Product.count();
        const totalOrders = await Order.count();

        const totalRevenue = await Order.sum('totalPrice', {
            where: { status: { [Op.ne]: 'cancelled' } }
        });

        const pendingOrders = await Order.count({
            where: { status: 'pending' }
        });

        res.json({
            status: 'success',
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue || 0,
                pendingOrders,
                recentOrders: await Order.findAll({
                    limit: 5,
                    order: [['created_at', 'DESC']],
                    include: [{
                        model: User,
                        as: 'user', 
                        attributes: ['name', 'email']
                    }]
                })
            }
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching dashboard stats'
        });
    }
};

export const getSalesAnalytics = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sales = await Order.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'sales'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'orders']
            ],
            where: {
                created_at: {
                    [Op.gte]: thirtyDaysAgo
                },
                status: {
                    [Op.ne]: 'cancelled'
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.col('date'), 'ASC']]
        });

        res.json({
            status: 'success',
            data: sales
        });
    } catch (error) {
        console.error('Sales analytics error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching sales analytics'
        });
    }
};

export const getTopProducts = async (req, res) => {
    try {
        const topProducts = await OrderItem.findAll({
            attributes: [
                'productId',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity']
            ],
            include: [{
                model: Product,
                as: 'product',
                attributes: ['name', 'price']
            }],
            group: ['productId', 'product.id', 'product.name', 'product.price'],
            order: [[sequelize.col('total_quantity'), 'DESC']],
            limit: 5
        });

        res.json({
            status: 'success',
            data: topProducts
        });
    } catch (error) {
        console.error('Top products error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching top products'
        });
    }
};

export const getUserGrowth = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const users = await User.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            where: {
                created_at: {
                    [Op.gte]: thirtyDaysAgo
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.col('date'), 'ASC']]
        });

        res.json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.error('User growth error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching user growth data'
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            include: ['roles'],
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
            order: [['created_at', 'ASC']]
        });

        res.json({
            status: 'success',
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching users'
        });
    }
};

export const assignRole = async (req, res) => {
    try {
        const { userId, roleName } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const role = await Role.findOne({ where: { name: roleName } });
        if (!role) {
            return res.status(404).json({
                status: 'error',
                message: 'Role not found'
            });
        }

        // Remove all existing roles and assign new one
        await user.setRoles([role]);

        res.json({
            status: 'success',
            message: 'Role assigned successfully'
        });
    } catch (error) {
        console.error('Assign role error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error assigning role'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'You cannot delete your own account'
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
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
            message: 'Error deleting user'
        });
    }
};

export const getEarnings = async (req, res) => {
    try {
        // Get monthly earnings
        const orders = await Order.findAll({
            where: {
                status: { [Op.ne]: 'cancelled' }
            },
            attributes: [
                [sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m'), 'month'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'total']
            ],
            group: ['month'],
            order: [[sequelize.col('month'), 'DESC']],
            limit: 12
        });

        res.json({
            status: 'success',
            data: orders
        });
    } catch (error) {
        console.error('Get earnings error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching earnings'
        });
    }
};
