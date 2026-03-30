import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    sizes: {
        type: DataTypes.JSON,
        defaultValue: ['S', 'M', 'L', 'XL', 'XXL'],
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.JSON,
        defaultValue: { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 },
        allowNull: false
    },
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Instance method to get discounted price
Product.prototype.getDiscountedPrice = function () {
    if (this.discount > 0) {
        return Math.round(this.price - (this.price * (this.discount / 100)));
    }
    return this.price;
};

export default Product;
