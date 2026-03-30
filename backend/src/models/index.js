import User from './User.js';
import Product from './Product.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Role from './Role.js';
import Permission from './Permission.js';
import Wishlist from './Wishlist.js';
import Address from './Address.js';

// User - Order relationship
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order - OrderItem relationship
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product - OrderItem relationship
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// User - Role relationship (many-to-many)
User.belongsToMany(Role, {
    through: 'user_roles',
    foreignKey: 'user_id',
    otherKey: 'role_id',
    as: 'roles'
});
Role.belongsToMany(User, {
    through: 'user_roles',
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users'
});

// Role - Permission relationship (many-to-many)
Role.belongsToMany(Permission, {
    through: 'role_permissions',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions'
});
Permission.belongsToMany(Role, {
    through: 'role_permissions',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles'
});

// User - Wishlist relationship
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlist' });
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product - Wishlist relationship
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishedBy' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User - Address relationship
User.hasMany(Address, { foreignKey: 'user_id', as: 'addresses' });
Address.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
    User,
    Product,
    Order,
    OrderItem,
    Role,
    Permission,
    Wishlist,
    Address
};
