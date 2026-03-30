import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistService } from '../../services/wishlistService';
import { ProductCardShimmer } from '../../components/common/Shimmer';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Heart, ChevronRight, Store, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../../contexts/CartContext';

const WishlistItem = ({ item, onRemove }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');

    const getPriceModifier = (size) => {
        switch(size) {
            case 'L': return 50;
            case 'XL': return 100;
            case 'XXL': return 150;
            default: return 0;
        }
    };

    const currentModifier = getPriceModifier(selectedSize);
    const displayPrice = Number(item.product.discountedPrice) + currentModifier;
    const displayOriginalPrice = Number(item.product.price) + currentModifier;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        const productWithSizePrice = {
            ...item.product,
            price: displayOriginalPrice,
            discountedPrice: displayPrice
        };
        addToCart(productWithSizePrice, 1, selectedSize);
        toast.success(`${item.product.name} (Size: ${selectedSize}) moved to cart!`);
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -8 }}
            className="group bg-bg-secondary rounded-3xl border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col h-full relative"
            onClick={() => navigate(`/product/${item.product_id}`)}
        >
            {/* Remove Button */}
            <button 
                onClick={(e) => onRemove(e, item.product_id)}
                className="absolute top-4 right-4 z-20 p-2.5 bg-bg-secondary/90 backdrop-blur-md text-text-secondary hover:text-red-500 hover:scale-110 rounded-xl transition-all shadow-sm border border-border"
                title="Remove from wishlist"
            >
                <Trash2 size={18} />
            </button>

            {/* Product Image */}
            <div className="aspect-[4/5] bg-bg-primary relative overflow-hidden flex items-center justify-center p-4">
                <img
                    src={item.product.url}
                    alt={item.product.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-text-primary mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {item.product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-primary">₹{displayPrice.toLocaleString('en-IN')}</span>
                        {Number(item.product.discount) > 0 && (
                            <span className="text-sm text-text-secondary/60 line-through font-bold">₹{displayOriginalPrice.toLocaleString('en-IN')}</span>
                        )}
                    </div>

                    {/* Stock Badge */}
                    {item.product.stock && (
                        <div className="flex flex-col items-end">
                            {item.product.stock[selectedSize] <= 0 ? (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-200">
                                    Out of Stock
                                </span>
                            ) : item.product.stock[selectedSize] < 5 ? (
                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-orange-200">
                                    Only {item.product.stock[selectedSize]} left!
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-200">
                                    In Stock
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Size Selector */}
                <div className="space-y-3 mb-6" onClick={(e) => e.stopPropagation()}>
                    <p className="text-[10px] font-black text-text-secondary/50 uppercase tracking-[0.2em] pl-1">Select Size</p>
                    <div className="flex gap-2 flex-wrap">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 text-[11px] font-black transition-all ${
                                    selectedSize === size 
                                        ? 'bg-primary border-primary text-bg-primary shadow-lg shadow-primary/20 scale-105' 
                                        : 'bg-bg-primary border-border text-text-secondary hover:border-primary/30 hover:text-primary'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleAddToCart}
                    disabled={item.product.stock && item.product.stock[selectedSize] <= 0}
                    className={`mt-auto w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        item.product.stock && item.product.stock[selectedSize] <= 0
                            ? 'bg-bg-primary text-text-secondary/40 cursor-not-allowed border border-border'
                            : 'bg-text-primary text-bg-primary hover:bg-primary hover:text-white shadow-xl shadow-primary/5 active:scale-[0.98]'
                    }`}
                >
                    <ShoppingCart size={18} />
                    {item.product.stock && item.product.stock[selectedSize] <= 0 ? 'Out of Stock' : 'Move To Cart'}
                </button>
            </div>
        </motion.div>
    );
};

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await wishlistService.getWishlist();
                setWishlistItems(response.data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (e, productId) => {
        e.stopPropagation();
        try {
             await wishlistService.removeFromWishlist(productId);
             setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
             toast.success('Removed from wishlist');
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove item');
        }
    };

    if (loading) {
        return (
             <div className="space-y-8">
                <div className="flex flex-col gap-2">
                    <div className="h-10 w-48 bg-bg-secondary animate-pulse rounded-xl" />
                    <div className="h-6 w-64 bg-bg-primary animate-pulse rounded-lg" />
                </div>
                <ProductCardShimmer count={3} />
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[450px] text-center px-6 py-12 bg-bg-secondary rounded-[3rem] border border-border shadow-sm"
            >
                <div className="w-24 h-24 bg-bg-primary rounded-[2.5rem] flex items-center justify-center mb-8 text-text-secondary/20 shadow-inner">
                    <Heart size={48} />
                </div>
                <h2 className="text-3xl font-black text-text-primary mb-4 tracking-tight italic">
                    Your Wishlist is <span className="text-primary not-italic">Empty.</span>
                </h2>
                <p className="text-text-secondary font-medium text-lg max-w-sm mb-10 leading-relaxed">
                    Save items you love so you can find them easily later and complete your look.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-text-primary text-bg-primary px-10 py-4.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white shadow-2xl hover:shadow-primary/30 active:scale-95 transition-all"
                >
                    <Store size={20} />
                    Start Exploring
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-text-primary tracking-tight mb-2 italic">
                        My <span className="text-primary not-italic">Wishlist.</span>
                    </h2>
                    <p className="text-text-secondary font-black uppercase tracking-[0.3em] text-[10px] opacity-50">
                        Curated items you've saved
                    </p>
                </div>
                
                <div className="flex items-center gap-3 px-5 py-2.5 bg-bg-secondary rounded-2xl border border-border shadow-sm">
                    <Heart size={16} className="text-primary fill-primary" />
                    <span className="text-sm font-black text-text-primary">{wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}</span>
                </div>
            </div>

            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence mode='popLayout'>
                    {wishlistItems.map((item) => (
                        <WishlistItem key={item.id} item={item} onRemove={handleRemove} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default Wishlist;
    