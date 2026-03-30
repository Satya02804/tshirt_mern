import { Op } from 'sequelize';
import { Product } from '../models/index.js';
import sequelize from '../config/database.js';

export const getAllProducts = async (req, res) => {
    try {
        const { search, category, minPrice, maxPrice, sort } = req.query;

        const whereClause = {};

        // Search (Name only as description doesn't exist)
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        // Category Filter
        if (category) {
            whereClause.category = category;
        }

        // Price Filter
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
            if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
        }

        // Size Filter
        if (req.query.sizes) {
            const requestedSizes = Array.isArray(req.query.sizes) ? req.query.sizes : req.query.sizes.split(',');
            const sizeConditions = requestedSizes.map(size => 
                sequelize.where(
                    sequelize.fn('JSON_CONTAINS', sequelize.col('sizes'), JSON.stringify(size)),
                    1
                )
            );
            
            if (sizeConditions.length > 0) {
                whereClause[Op.and] = whereClause[Op.and] || [];
                whereClause[Op.and].push({ [Op.or]: sizeConditions });
            }
        }

        // Sorting  
        let order = [['created_at', 'DESC']]; // Default: Newest first
        if (sort === 'price_asc') order = [['price', 'ASC']];
        if (sort === 'price_desc') order = [['price', 'DESC']];
        if (sort === 'newest') order = [['created_at', 'DESC']];
        if (sort === 'oldest') order = [['created_at', 'ASC']];

        const products = await Product.findAll({
            where: whereClause,
            order: order
        });

        res.json({
            status: 200,
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                url: p.url,
                category: p.category,
                price: parseFloat(p.price),
                discount: parseFloat(p.discount),
                discountedPrice: p.getDiscountedPrice(),
                sizes: p.sizes,
                stock: p.stock
            }))
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching products'
        });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, url, price, discount, stock, category, sizes } = req.body;

        const product = await Product.create({
            name,
            url,
            price,
            discount: discount || 0,
            category,
            size: req.body.size || 'M',
            sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            stock: stock || { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 }
        });

        res.status(201).json({
            status: 'success',
            message: 'T-shirt added successfully!',
            data: product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error creating product',
            error: error.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, url, price, discount } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        product.name = name || product.name;
        product.url = url || product.url;
        product.price = price || product.price;
        product.discount = discount !== undefined ? discount : product.discount;
        product.category = req.body.category || product.category;
        product.size = req.body.size || product.size || 'M';
        product.sizes = req.body.sizes || product.sizes;
        product.stock = req.body.stock || product.stock;

        await product.save();

        res.json({
            status: 'success',
            message: 'T-shirt updated successfully!',
            data: product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error updating product'
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        const productName = product.name;
        await product.destroy();

        res.json({
            status: 'success',
            message: `'${productName}' deleted successfully!`
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting product'
        });
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.findAll({
            where: { category: category },
            order: [['created_at', 'ASC']]
        });

        res.json({
            status: 200,
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                url: p.url,
                category: p.category,
                price: parseFloat(p.price),
                discount: parseFloat(p.discount),
                discountedPrice: p.getDiscountedPrice()
            }))
        });
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching products by category'
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Product.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
            ],
            raw: true
        });

        res.json({
            status: 200,
            categories: categories.map(c => ({
                id: c.category,
                name: c.category
            })).filter(c => c.name) // Filter out null/empty categories
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching categories'
        });
    }
};