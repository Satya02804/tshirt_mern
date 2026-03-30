import React, { useState, useEffect, useRef } from 'react';
import { 
    ShoppingCart, 
    Trash2, 
    Plus, 
    Minus, 
    ShoppingBag, 
    Menu, 
    User,
    LogOut,
    LayoutDashboard,
    Search,
    X,
    ChevronRight,
    Moon,
    Sun
} from 'lucide-react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../contexts/ThemeContext';
import Can from '../common/Can';

const Header = () => {
    const { user, logout, hasRole } = useAuth();
    const { getCartCount, cart, updateQuantity, getDiscount, getOriginalPriceTotal, isCartOpen, setIsCartOpen } = useCart();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const menuRef = useRef(null);
    const searchRef = useRef(null);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/login');
    };

    const cartSubtotal = cart.reduce((acc, item) => acc + (item.discountedPrice * item.quantity), 0);

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-bg-secondary/80 backdrop-blur-xl shadow-lg shadow-primary/5 py-2' : 'bg-transparent py-4'}`}>
                <div className="max-w-[1700px] mx-auto px-4 md:px-8 flex justify-between items-center">

                    {/* Left: Brand */}
                    <div className="flex items-center gap-8">
                        <RouterLink to="/" className="group flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                T
                            </div>
                            <span className="font-black text-2xl tracking-tighter text-text-primary hidden sm:block">
                                T-SHIRT<span className="text-primary italic">Store</span>
                            </span>
                        </RouterLink>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-6">
                            {[''].map((item) => (
                                <RouterLink 
                                    key={item} 
                                    to="/" 
                                    className="text-sm font-bold text-text-secondary hover:text-primary transition-colors uppercase tracking-widest px-2 py-1"
                                >
                                    {item}
                                </RouterLink>
                            ))}
                        </nav>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        
                        {/* Search Bar */}
                        <div className="relative" ref={searchRef}>
                            <form 
                                onSubmit={handleSearch}
                                className={`flex items-center transition-all duration-300 ${isSearchOpen ? 'w-48 sm:w-64 bg-bg-primary rounded-full px-4 py-1.5 border border-border' : 'w-10'}`}
                            >
                                <button 
                                    type="button"
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`p-2.5 rounded-full transition-all ${isSearchOpen ? 'text-primary' : 'text-text-secondary hover:text-primary hover:bg-primary/5'}`}
                                >
                                    <Search size={20} />
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search T-shirts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`bg-transparent border-none outline-none text-sm font-bold text-text-primary w-full transition-all duration-300 ${isSearchOpen ? 'opacity-100 ml-2' : 'opacity-0 w-0 pointer-events-none'}`}
                                />
                            </form>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full text-text-secondary hover:text-primary hover:bg-primary/5 transition-all"
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className={`flex items-center gap-2 p-1 pl-1 pr-3 rounded-full border transition-all duration-300 ${isMenuOpen ? 'border-primary/20 bg-primary/5' : 'border-border hover:border-primary/20 hover:bg-bg-primary'}`}
                                >
                                    <div className="w-8 h-8 bg-text-primary rounded-full flex items-center justify-center text-[10px] font-bold text-bg-primary shadow-sm overflow-hidden border border-border">
                                        {user.avatarUrl ? (
                                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user.name?.charAt(0).toUpperCase()  
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-text-primary hidden sm:block truncate max-w-[80px]">
                                        {user.name.split(' ')[0]}
                                    </span>
                                </button>

                                {/* Dropdown */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-bg-secondary rounded-2xl shadow-2xl shadow-primary/5 border border-border py-2 origin-top-right transform transition-all animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-border mb-1">
                                            <p className="text-[10px] font-black text-text-secondary/50 uppercase tracking-widest mb-0.5">Signed in as</p>
                                            <p className="text-sm font-bold text-text-primary truncate">{user.email}</p>
                                        </div>

                                        <button 
                                            onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                                            className="w-full text-left px-4 py-3 text-sm text-text-secondary hover:bg-bg-primary hover:text-primary font-bold transition-all flex items-center gap-3"
                                        >
                                            <User size={18} className="text-text-secondary/50" />
                                            Profile Settings
                                        </button>
                                        
                                        {(hasRole('admin') || hasRole('super-admin')) && (
                                            <button 
                                                onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }}
                                                className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-primary/5 font-black transition-all flex items-center gap-3"
                                            >
                                                <LayoutDashboard size={18} />
                                                Admin Dashboard
                                            </button>
                                        )}
                                        
                                        <div className="mx-4 my-2 border-t border-border"></div>
                                        
                                        <button 
                                            onClick={handleLogout} 
                                            className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 font-bold transition-all flex items-center gap-3"
                                        >
                                            <LogOut size={18} />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <RouterLink 
                                to="/login" 
                                className="px-6 py-2.5 rounded-full bg-text-primary text-bg-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                            >
                                Log In
                            </RouterLink>
                        )}

                        {/* Cart Trigger */}
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="group relative p-3 bg-bg-secondary border border-border text-text-primary hover:border-primary/20 hover:bg-primary/5 rounded-full transition-all duration-300 shadow-sm"
                        >
                            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center justify-center border-2 border-bg-secondary shadow-lg animate-in zoom-in">
                                    {getCartCount()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

        </>
    );
};
export default Header;
