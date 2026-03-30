import { Wishlist, Product } from '../models/index.js';

export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                status: 'error',
                message: 'Product ID is required'
            });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found'
            });
        }

        // Check if already in wishlist
        const existingItem = await Wishlist.findOne({
            where: {
                user_id: userId,
                product_id: productId
            }
        });

        if (existingItem) {
            return res.status(400).json({
                status: 'error',
                message: 'Product already in wishlist'
            });
        }

        // Add to wishlist
        await Wishlist.create({
            user_id: userId,
            product_id: productId
        });

        res.status(201).json({
            status: 'success',
            message: 'Product added to wishlist'
        });

    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error adding product to wishlist',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const result = await Wishlist.destroy({
            where: {
                user_id: userId,
                product_id: productId
            }
        });

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Product not found in wishlist'
            });
        }

        res.json({
            status: 'success',
            message: 'Product removed from wishlist'
        });

    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error removing product from wishlist',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findAll({
            where: { user_id: userId },
            include: [{
                model: Product,
                as: 'product',
                attributes: ['id', 'name', 'price', 'url', 'discount'] 
            }],
            order: [['created_at', 'DESC']]
        });

        // Format response to match Product structure expected by frontend
        const formattedWishlist = wishlist.map(item => {
            const product = item.product;
            return {
                id: item.id,
                user_id: item.user_id,
                product_id: item.product_id,
                created_at: item.created_at,
                product: {
                    id: product.id,
                    name: product.name,
                    url: product.url,
                    price: parseFloat(product.price),
                    discount: parseFloat(product.discount),
                    discountedPrice: product.getDiscountedPrice()
                }
            };
        });

        res.json({
            status: 'success',
            data: formattedWishlist
        });

    } catch (error) {
        console.error('Get wishlist error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching wishlist',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};

export const checkWishlistStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const item = await Wishlist.findOne({
            where: {
                user_id: userId,
                product_id: productId
            }
        });

        res.json({
            status: 'success',
            isInWishlist: !!item
        });

    } catch (error) {
        console.error('Check wishlist status error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error checking wishlist status',
            error: process.env.APP_ENV === 'development' ? error.message : undefined
        });
    }
};
