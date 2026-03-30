import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Box,
  ShoppingCart,
  User,
  LogOut,
  MapPin,
  Heart,
  ChevronRight,
  X,
  Store,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const ProfileLayout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { text: 'My Profile', icon: <User size={20} />, path: '/profile' },
    { text: 'Wishlist', icon: <Heart size={20} />, path: '/profile/wishlist' },
    { text: 'My Orders', icon: <ShoppingCart size={20} />, path: '/profile/orders' },
    { text: 'Saved Addresses', icon: <MapPin size={20} />, path: '/profile/addresses' },
  ];

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <div className="h-full flex flex-col bg-white border-r border-border">
      <div className="p-10 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-[2.5rem] bg-slate-900 flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-slate-200 border-4 border-white relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="relative z-10 w-full h-full object-cover" />
          ) : (
            <span className="relative z-10">{user.name?.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div>
          <h2 className="font-black text-text-primary tracking-tight text-xl leading-tight">{user.name}</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">{user.role || 'Member'}</p>
        </div>
      </div>

      <nav className="flex-1 px-6 space-y-2 overflow-y-auto mt-4">
        {menuItems.map((item) => (
          <button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center justify-between px-5 py-4.5 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
              isActive(item.path)
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary hover:translate-x-1'
            }`}
          >
            <div className="flex items-center gap-4 relative z-10">
              <span className={`transition-all duration-500 ${isActive(item.path) ? 'text-white scale-110' : 'text-slate-300 group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className={`text-sm font-black uppercase tracking-wider ${isActive(item.path) ? 'text-white' : 'text-slate-500'}`}>{item.text}</span>
            </div>
            <ChevronRight size={14} className={`relative z-10 transition-all duration-500 ${isActive(item.path) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} />
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto space-y-3">
        {(hasRole('admin') || hasRole('super-admin')) && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-900 text-white hover:bg-primary transition-all text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200"
          >
            <LayoutDashboard size={18} />
            <span>Admin Control</span>
          </button>
        )}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white border border-slate-100 text-text-secondary hover:text-primary hover:border-primary/30 transition-all text-xs font-black uppercase tracking-widest"
        >
          <Store size={18} />
          <span>Exit Store</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-bg-primary font-sans selection:bg-primary/20">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[320px] z-30">
        {drawer}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-[320px]">
        {/* Mobile Header */}
        <header className="h-[90px] bg-white/80 backdrop-blur-xl border-b border-border px-6 flex lg:hidden items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={handleDrawerToggle}
              className="p-3 text-text-primary bg-bg-secondary hover:bg-slate-100 rounded-2xl transition-all shadow-sm border border-border"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-text-primary tracking-tight">
              {menuItems.find(item => isActive(item.path))?.text || 'Account'}
            </h1>
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 rounded-[1rem] border-2 border-white shadow-lg p-0.5 overflow-hidden ring-4 ring-slate-50"
          >
            <div className="w-full h-full bg-slate-900 rounded-[0.8rem] flex items-center justify-center text-white text-xs font-black overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
          </button>
        </header>

        {/* Desktop Layout Header */}
        <header className="hidden lg:flex h-[90px] bg-transparent px-12 items-center justify-between">
            <h1 className="text-3xl font-black text-text-primary tracking-tight">
                {menuItems.find(item => isActive(item.path))?.text || 'Settings'}
            </h1>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className="text-sm font-black text-text-primary leading-tight">{user.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">{user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-3.5 text-slate-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-xl shadow-slate-200/50 bg-white border border-white"
                    title="Sign Out"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>

        {/* Content */}
        <main className="p-8 md:p-12 flex-grow max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-[300px] bg-white z-50 lg:hidden transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-6 right-[-60px]">
            <button onClick={handleDrawerToggle} className="p-3 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100">
                <X size={24} />
            </button>
        </div>
        {drawer}
      </aside>
    </div>
  );
};

export default ProfileLayout;
