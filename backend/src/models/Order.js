import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, // Allow null for guest checkout
        field: 'user_id'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'order_number'
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: 'total_price'
    },
    shippingAddress: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'shipping_address'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'payment_method'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

export default Order;
