import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone,
  ArrowRight,
  Info
} from 'lucide-react';

const Auth = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register } = useAuth();

    // Form States
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', phone: '' ,confirmPassword: ''});

    // Sync state with URL
    useEffect(() => {
        setIsSignUp(location.pathname === '/register');
    }, [location.pathname]);

    const toggleMode = () => {
        const newMode = !isSignUp;
        setIsSignUp(newMode);
        navigate(newMode ? '/register' : '/login', { replace: true });
    };

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const result = await login(loginData.email, loginData.password);
        if (result.success) {
            toast.success('Logged in successfully!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const result = await register(registerData.name, registerData.email, registerData.password, registerData.phone, registerData.confirmPassword);
        if (result.success) {
            toast.success('Registration successful!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 w-full max-w-[1100px] overflow-hidden relative min-h-[700px] flex flex-col md:flex-row border border-white">
                
                {/* Left Side: Login Form */}
                <div className={`w-full md:w-1/2 p-10 md:p-20 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) z-10 ${isSignUp ? 'md:translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
                    <div className="max-w-md mx-auto h-full flex flex-col justify-center">
                        <div className="mb-10">
                            <h2 className="text-5xl font-black text-text-primary mb-3 tracking-tight">Welcome <span className="text-primary italic">Back.</span></h2>
                            <p className="text-text-secondary font-medium text-lg">Enter your credentials to access your premium account.</p>
                        </div>
                        
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={loginData.email}
                                        onChange={handleLoginChange}
                                        placeholder="your@email.com"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                                    <RouterLink to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors">
                                        Forgot?
                                    </RouterLink>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        value={loginData.password}
                                        onChange={handleLoginChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-text-primary text-white rounded-2xl py-4.5 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 hover:bg-primary shadow-xl shadow-slate-900/10 active:scale-[0.98] transition-all mt-4"
                            >
                                Sign In Now
                                <ArrowRight size={18} />
                            </button>
                        </form>
                        
                        <div className="mt-10 flex items-center gap-4">
                            <div className="h-px flex-grow bg-slate-100"></div>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Social Login</span>
                            <div className="h-px flex-grow bg-slate-100"></div>
                        </div>
                        
                        <button
                            onClick={() => {window.location.href = '/api/auth/google';}}
                            className="mt-8 w-full bg-white border border-slate-200 rounded-2xl py-4 px-4 flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-primary/30 transition-all active:scale-[0.98] text-text-primary font-bold text-sm shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>
                    </div>
                </div>

                {/* Right Side: Register Form */}
                <div className={`w-full md:w-1/2 p-10 md:p-20 absolute top-0 right-0 h-full transition-all duration-700 ease-in-out ${isSignUp ? 'translate-x-0 opacity-100 z-10' : '-translate-x-full opacity-0 z-0'}`}>
                    <div className="max-w-md mx-auto h-full overflow-y-auto no-scrollbar py-6 flex flex-col justify-center">
                        <div className="mb-8 font-inter">
                            <h2 className="text-5xl font-black text-text-primary mb-3 tracking-tight">Create <span className="text-primary italic">Account.</span></h2>
                            <p className="text-text-secondary font-medium text-lg">Join India's exclusive style community today.</p>
                        </div>
                        
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={registerData.name}
                                            onChange={handleRegisterChange}
                                            placeholder="John Doe"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                            <Phone size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            name="phone"
                                            required
                                            value={registerData.phone}
                                            onChange={handleRegisterChange}
                                            placeholder="Phone"
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={registerData.email}
                                        onChange={handleRegisterChange}
                                        placeholder="your@email.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={registerData.password}
                                        onChange={handleRegisterChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        required
                                        value={registerData.confirmPassword}
                                        onChange={handleRegisterChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-primary text-white rounded-2xl py-4.5 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 hover:bg-primary-dark transition-all active:scale-[0.98] shadow-lg shadow-primary/20 mt-4"
                            >
                                Create Account
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Overlay Component (Animated Panel) */}
                <div className={`hidden md:flex absolute top-0 left-0 h-full w-1/2 bg-slate-900 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) py-16 px-16 text-white flex-col justify-between overflow-hidden z-20 ${isSignUp ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Dynamic Background Graphics */}
                    <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary rounded-full blur-[120px]"></div>
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-2xl rounded-[1.25rem] flex items-center justify-center mb-10 border border-white/20 shadow-2xl">
                            <Info size={28} className="text-primary" />
                        </div>
                        
                        <div className={`transition-all duration-1000 delay-300 ${isSignUp ? 'translate-x-0 opacity-100' : 'translate-x-[100px] opacity-0'}`}>
                            <h3 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter italic">Craft Your <span className="text-primary not-italic">Legacy.</span></h3>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-sm">
                                Experience the pinnacle of luxury apparel. Join us to redefine your daily style.
                            </p>
                            <div className="mt-14 flex items-center gap-4">
                                <span className="text-white/40 font-bold uppercase tracking-widest text-xs">A member already?</span>
                                <button onClick={toggleMode} className="bg-white text-slate-900 hover:bg-primary hover:text-white rounded-2xl px-8 py-3 font-black text-sm transition-all shadow-xl active:scale-95">SIGN IN</button>
                            </div>
                        </div>

                        <div className={`absolute top-20 left-0 transition-all duration-1000 delay-300 ${!isSignUp ? 'translate-x-0 opacity-100' : 'translate-x-[-100px] opacity-0'}`}>
                            <h3 className="text-6xl font-black mb-8 leading-[1.1] tracking-tighter italic">Elevate Your <span className="text-primary not-italic">Spirit.</span></h3>
                            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-sm">
                                Exclusive designs, sustainable fabrics, and a community that values excellence.
                            </p>
                            <div className="mt-14 flex items-center gap-4">
                                <span className="text-white/40 font-bold uppercase tracking-widest text-xs">New to the family?</span>
                                <button onClick={toggleMode} className="bg-white text-slate-900 hover:bg-primary hover:text-white rounded-2xl px-8 py-3 font-black text-sm transition-all shadow-xl active:scale-95">SIGN UP</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-wrap gap-x-12 gap-y-6 pt-10 border-t border-white/10">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1.5">Shipping</h4>
                                <p className="text-sm font-black text-white">Global Express</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1.5">Support</h4>
                                <p className="text-sm font-black text-white">24/7 Concierge</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1.5">Trust</h4>
                                <p className="text-sm font-black text-white">Ethically Sourced</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Bar (visible when no desktop overlay) */}
                <div className="md:hidden p-8 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {isSignUp ? "Joined us before?" : "Ready to join?"}
                    </p>
                    <button 
                        onClick={toggleMode} 
                        className="w-full py-4 rounded-2xl bg-white border border-slate-200 text-text-primary font-black text-sm tracking-widest uppercase hover:bg-slate-50 active:scale-95 transition-all"
                    >
                        {isSignUp ? "Back to Login" : "Create Account"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
