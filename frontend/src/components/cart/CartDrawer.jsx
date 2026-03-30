import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Minus, Plus, ChevronRight } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cart, updateQuantity, getCartTotal, getCartCount, getOriginalPriceTotal, getDiscount } = useCart();
  const navigate = useNavigate();

  const cartSubtotal = getCartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-secondary shadow-2xl z-[101] flex flex-col border-l border-border"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-text-primary tracking-tight">Your Bag</h2>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{getCartCount()} Items Selected</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-text-secondary hover:text-red-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-900/30">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="w-24 h-24 bg-bg-secondary rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 shadow-xl shadow-slate-900/5">
                    <ShoppingBag size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary mb-2 tracking-tight italic">Your bag is <span className="text-primary not-italic">empty.</span></h3>
                  <p className="text-text-secondary font-medium mb-8 max-w-[220px]">Looks like you haven't added any premium threads yet.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="bg-text-primary text-bg-primary px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    layout
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative flex gap-4 p-4 bg-bg-secondary rounded-2xl border border-border shadow-sm hover:shadow-xl hover:shadow-slate-900/5 transition-all"
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative border border-border">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-bg-secondary/90 backdrop-blur-md rounded-md text-[9px] font-black uppercase text-text-primary shadow-sm border border-border">
                        {item.size}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-black text-text-primary truncate max-w-[140px]">{item.name}</h4>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, 0)}
                            className="text-text-secondary hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-text-secondary mt-0.5 italic">Premium Cotton</p>
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="flex items-center bg-bg-primary rounded-lg p-1 border border-border">
                          <button
                            onClick={() => updateQuantity(item.id, item.size, Math.max(0, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-secondary text-text-secondary hover:text-primary shadow-sm border border-border transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-xs font-black w-8 text-center text-text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-md bg-bg-secondary text-text-secondary hover:text-primary shadow-sm border border-border transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm font-black text-primary">₹{(item.discountedPrice * item.quantity).toLocaleString('en-IN')}</span>
                          {Number(item.discount) > 0 && (
                            <span className="block text-[10px] text-text-secondary line-through font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 bg-bg-secondary border-t border-border space-y-4">
                <div className="bg-bg-primary rounded-2xl p-5 border border-border space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-text-secondary">Subtotal</span>
                    <span className="text-text-primary">₹{getOriginalPriceTotal().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                    <span className="text-text-secondary">Discount</span>
                    <span className="text-emerald-500">-₹{getDiscount().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between items-center">
                    <span className="text-sm font-black text-text-primary uppercase">Total</span>
                    <span className="text-2xl font-black text-primary tracking-tighter">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="group w-full bg-text-primary text-bg-primary font-black py-4 rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                >
                  Checkout Now
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
