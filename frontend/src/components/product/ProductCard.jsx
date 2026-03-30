import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Info, Check } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { wishlistService } from '../../services/wishlistService';
import { toast } from 'react-toastify';
import Can from '../common/Can';
import SizeGuideModal from './SizeGuideModal';

const ProductCard = ({ product, preferredSizes = [] }) => {
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState('M');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (localStorage.getItem('token')) {
                try {
                    const { isInWishlist } = await wishlistService.checkWishlistStatus(product.id);
                    setIsWishlisted(isInWishlist);
                } catch (error) {
                    console.error('Error checking wishlist status:', error);
                }
            }
        };
        checkWishlistStatus();
    }, [product.id]);

    // Sync selected size with filtered sizes from sidebar
    useEffect(() => {
        if (preferredSizes && preferredSizes.length > 0) {
            const validSize = preferredSizes.find(size => product.sizes && product.sizes.includes(size));
            if (validSize) setSelectedSize(validSize);
        }
    }, [preferredSizes, product.sizes]);

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!localStorage.getItem('token')) {
            toast.error('Please login to add to wishlist');
            return;
        }

        setIsLoadingWishlist(true);
        try {
            if (isWishlisted) {
                await wishlistService.removeFromWishlist(product.id);
                setIsWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await wishlistService.addToWishlist(product.id);
                setIsWishlisted(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.error('Wishlist error:', error);
            toast.error(error.message || 'Error updating wishlist');
        } finally {
            setIsLoadingWishlist(false);
        }
    };

    const getPriceModifier = (size) => {
        switch(size) {
            case 'L': return 50;
            case 'XL': return 100;
            case 'XXL': return 150;
            default: return 0;
        }
    };

    const currentModifier = getPriceModifier(selectedSize);
    const displayPrice = Number(product.discountedPrice || product.price) + currentModifier;
    const displayOriginalPrice = Number(product.price) + currentModifier;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productWithSizePrice = {
            ...product,
            price: displayOriginalPrice,
            discountedPrice: displayPrice
        };
        addToCart(productWithSizePrice, 1, selectedSize);
        toast.success(`${product.name} (Size: ${selectedSize}) added to cart!`);
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5 }}
            className="group bg-bg-secondary rounded-[2.5rem] border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden flex flex-col h-full relative"
        >
            
            {/* Wishlist Toggle */}
            <button 
                onClick={handleWishlistToggle}
                disabled={isLoadingWishlist}
                className={`absolute top-4 left-4 z-20 p-2.5 rounded-2xl backdrop-blur-md transition-all duration-300 shadow-lg ${
                    isWishlisted 
                        ? 'bg-primary text-white scale-110' 
                        : 'bg-bg-secondary/80 text-text-secondary hover:text-primary hover:bg-bg-secondary'
                }`}
            >
                <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>

            {/* Category Tag */}
            <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1.5 bg-text-primary/10 backdrop-blur-md text-text-primary text-[9px] font-black uppercase tracking-widest rounded-xl border border-border/20 shadow-sm">
                    {product.category || "Classic"}
                </span>
            </div>

            {/* Image Section */}
            <div className="relative aspect-[4/5] overflow-hidden text-wrap bg-bg-primary group-hover:bg-bg-secondary/50 transition-colors duration-500">
                <img
                    src={product.url?.startsWith('http') ? product.url : `/api${product.url}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800";
                    }}
                />
                
                {/* Discount Overlay */}
                {Number(product.discount) > 0 && (
                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-primary text-white py-2 px-4 rounded-xl text-xs font-black uppercase tracking-widest text-center shadow-xl shadow-primary/20">
                            Save {product.discount}% Today
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
                {/* Product Name */}
                <h2 className="text-lg font-black text-text-primary mb-2 text-wrap group-hover:text-primary transition-colors tracking-tight">
                    {product.name}
                </h2>
                
                {/* Price Display */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <p className="text-2xl font-black text-primary tracking-tighter">
                            <span className="text-md font-bold align-top mr-0.5">₹</span>
                            {displayPrice.toLocaleString('en-IN')}
                        </p>
                        {Number(product.discount) > 0 && (
                            <p className="text-md text-error/70 line-through font-bold">
                                ₹{displayOriginalPrice.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>
                    
                    {/* Stock Badge */}
                    {product.stock && (
                        <div className="flex flex-col items-end">
                            {product.stock[selectedSize] <= 0 ? (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-red-200">
                                    Out of Stock
                                </span>
                            ) : product.stock[selectedSize] < 5 ? (
                                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-orange-200">
                                    Only {product.stock[selectedSize]} left!
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-green-200">
                                    In Stock
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Size Selector - Custom Premium Design */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Select Size</span>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSizeGuideOpen(true); }}
                            className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline focus:outline-none"
                        >
                            Size Guide
                        </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-300 border ${
                                    selectedSize === size
                                        ? 'bg-text-primary border-text-primary text-bg-primary shadow-lg shadow-primary/20'
                                        : 'bg-bg-secondary border-border text-text-secondary hover:border-primary/30 hover:text-primary'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <Can permission="add-to-cart">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock && product.stock[selectedSize] <= 0}
                        className={`mt-auto w-full py-4 rounded-2xl font-black text-xs tracking-widest uppercase shadow-sm transition-all duration-300 flex items-center justify-center gap-3 ${
                            product.stock && product.stock[selectedSize] <= 0
                                ? 'bg-bg-primary text-text-secondary/40 cursor-not-allowed border-none'
                                : 'bg-bg-secondary border-2 border-border text-text-primary hover:bg-primary hover:text-white hover:border-primary hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]'
                        }`}
                    >
                        <ShoppingCart size={18} />
                        {product.stock && product.stock[selectedSize] <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </Can>
            </div>
            
            <SizeGuideModal 
                isOpen={isSizeGuideOpen} 
                onClose={() => setIsSizeGuideOpen(false)} 
            />
        </motion.div>
    );
};

export default ProductCard;