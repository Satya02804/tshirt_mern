import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  LayoutDashboard,
  Box,
  ShoppingCart,
  Users,
  LogOut,
  User,
  Settings,
  X,
  ShieldCheck,
  Store,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const AdminLayout = () => {
  const { user, logout, hasRole, hasPermission } = useAuth();
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

  if (!hasRole('super-admin') && !hasRole('admin')) {
    return <Navigate to="/" replace />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { text: 'Products', icon: <Box size={20} />, path: '/dashboard/products' },
    { text: 'Orders', icon: <ShoppingCart size={20} />, path: '/dashboard/orders' },
    { text: 'Users', icon: <Users size={20} />, path: '/dashboard/users' },
  ];

  if (hasPermission('view-roles')) {
    menuItems.push({ text: 'Roles', icon: <ShieldCheck size={20} />, path: '/dashboard/roles' });
  }

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name?.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="font-black text-slate-900 tracking-tight">Admin Console</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Store Management</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
        {menuItems.map((item) => (
          <button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive(item.path)
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <span className={`transition-colors ${isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-bold tracking-tight">{item.text}</span>
            </div>
            {isActive(item.path) && <ChevronRight size={14} className="opacity-60" />}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all text-sm font-bold"
        >
          <Store size={20} className="text-slate-400" />
          <span>Back to Store</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[280px] z-30">
        {drawer}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-[280px]">
        {/* Header */}
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={handleDrawerToggle}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-slate-900 tracking-tight capitalize">
              {location.pathname.split('/').pop() || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-black text-slate-900">{user?.name}</p>
              <p className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full mt-0.5">
                {hasRole('super-admin') ? 'Super Admin' : 'Administrator'}
              </p>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full border-2 border-slate-100 p-0.5 hover:border-primary/20 transition-all active:scale-95"
              >
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase()
                  )}  
                </div>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 py-2 origin-top-right transform transition-all animate-in fade-in slide-in-from-top-2 overflow-hidden">
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                    className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary font-bold transition-all flex items-center gap-3"
                  >
                    <User size={18} className="text-slate-400" />
                    Profile settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 font-bold transition-all flex items-center gap-3"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 md:p-10 flex-grow">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={handleDrawerToggle}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`fixed inset-y-0 left-0 w-[280px] bg-white z-50 lg:hidden transition-transform duration-300 transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="absolute top-6 right-[-50px]">
          <button onClick={handleDrawerToggle} className="p-2.5 bg-white text-slate-900 rounded-xl shadow-xl">
            <X size={20} />
          </button>
        </div>
        {drawer}
      </aside>
    </div>
  );
};

export default AdminLayout;
