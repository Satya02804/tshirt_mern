import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
    Mail, 
    ArrowLeft, 
    ArrowRight,
    Sparkles
} from 'lucide-react';


const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { forgotPassword, user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const result = await forgotPassword(email);

        if (result.success) {
            toast.success('Password reset link sent! Please check your inbox.');
            setEmail('');
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
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8"
                        >
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <ArrowLeft size={16} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to safety</span>
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Sparkles size={24} className="text-primary" />
                            </div>
                            <h2 className="text-4xl font-black text-text-primary tracking-tight">
                                Forgot <span className="text-primary italic">Password?</span>
                            </h2>
                        </div>
                        <p className="text-text-secondary font-medium text-lg leading-relaxed">
                            No worries, it happens to the best of us. Enter your email and we'll send you reset instructions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-text-primary font-bold placeholder:text-slate-300"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full bg-text-primary text-white rounded-2xl py-5 font-bold tracking-widest uppercase text-sm flex items-center justify-center gap-3 hover:bg-primary shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all"
                        >
                            {loading ? 'Sending Instructions...' : 'Send Reset Link'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    {/* Footer */}
                    {!user && (
                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <p className="text-slate-400 font-medium">
                            Remembered your password? {' '}
                            <RouterLink to="/login" className="text-primary font-black hover:underline underline-offset-4">
                                Sign In
                            </RouterLink>
                        </p>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
