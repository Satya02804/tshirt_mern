import React, { useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
    Lock, 
    Eye, 
    EyeOff, 
    ShieldCheck, 
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await resetPassword(token, formData.password);

        if (result.success) {
            toast.success('Password reset successful! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[85vh] bg-bg-primary flex items-center justify-center p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 w-full max-w-lg overflow-hidden border border-white">
                <div className="p-10 md:p-14">
                    
                    {/* Header */}
                    <div className="mb-10">
                         <button 
                            onClick={() => navigate('/login')}
                            className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Login</span>
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <ShieldCheck size={24} className="text-primary" />
                            </div>
                            <h2 className="text-4xl font-black text-text-primary tracking-tight">
                                Reset <span className="text-primary italic">Password.</span>
                            </h2>
                        </div>
                        <p className="text-text-secondary font-medium text-lg leading-relaxed">
                            Securing your account is our top priority. Please enter your new, strong password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    disabled={loading}
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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm New Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !formData.password}
                            className="w-full bg-text-primary text-white rounded-2xl py-5 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 hover:bg-primary shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all mt-4"
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Security Tip */}
                    <div className="mt-10 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            <strong className="text-text-primary">Pro Tip:</strong> Use a combination of uppercase, lowercase, numbers, and symbols to create a truly secure password.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
