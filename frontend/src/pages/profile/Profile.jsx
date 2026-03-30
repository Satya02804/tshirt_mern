import React, { useEffect, useState } from 'react';
import { 
    User, 
    Mail, 
    Phone, 
    Lock, 
    Edit2, 
    Save, 
    X, 
    Camera,
    ChevronRight,
    Search,
    Bell,
    Settings,
    ShieldCheck,
    CreditCard,
    MapPin,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { ProfileShimmer } from '../../components/common/Shimmer';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateUser, hasRole, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = React.useRef(null);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        avatarUrl: ''
    });

    const navigate = useNavigate();

    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                avatarUrl: user.avatarUrl || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let latestAvatarUrl = user.avatarUrl;

            // Upload the avatar if a new one was selected
            if (avatarFile) {
                const form = new FormData();
                form.append('avatar', avatarFile);

                const avatarResponse = await api.post('/auth/profile/avatar', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (avatarResponse.data.status === 'success') {
                    latestAvatarUrl = avatarResponse.data.data.avatarUrl;
                }
            }

            const response = await api.put('/auth/profile', { ...formData, avatarUrl: latestAvatarUrl });
            if (response.data.status === 'success') {
                const updatedUser = { ...user, ...response.data.data, avatarUrl: latestAvatarUrl };
                updateUser(updatedUser);
                toast.success('Profile updated successfully');
                setIsEditing(false);
                setAvatarFile(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
            toast.error('Please select a valid image file (JPG, PNG)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setAvatarFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handlePasswordSubmit = async () => {
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            const response = await api.put('/auth/change-password', passwordData);
            if (response.data.status === 'success') {
                toast.success('Password changed successfully');
                setChangePasswordOpen(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    if (loading) return <ProfileShimmer />;
    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Public Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and account security.</p>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                    >
                        <Edit2 size={18} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button 
                            onClick={() => {
                                setIsEditing(false);
                                setAvatarFile(null);
                                setPreviewUrl(null);
                                setFormData({ 
                                    name: user.name, 
                                    email: user.email, 
                                    phone: user.phone,
                                    avatarUrl: user.avatarUrl || ''
                                });
                            }}
                            className="px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar and Quick Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center text-center shadow-sm">
                            <div className="relative group">
                                {previewUrl || user.avatarUrl ? (
                                    <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl shadow-primary/30 border-4 border-white">
                                        <img 
                                            src={previewUrl || user.avatarUrl} 
                                            alt={user.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-5xl font-black">${user.name?.charAt(0).toUpperCase()}</div>`;
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-primary/30 border-4 border-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {isEditing && (
                                    <>
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isSaving}
                                            className={`absolute bottom-0 right-0 p-3 bg-white border border-slate-200 rounded-2xl shadow-xl transition-all group-hover:scale-110 ${isSaving ? 'text-slate-400 cursor-wait' : 'text-slate-600 hover:text-primary'}`}
                                        >
                                            <Camera size={20} />
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/jpeg, image/png, image/jpg"
                                            onChange={handleAvatarSelect}
                                        />
                                    </>
                                )}
                            </div>
                            <div className="mt-6">
                                <h2 className="text-xl font-black text-slate-900 leading-tight">{user.name}</h2>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{user.role || 'Verified Member'}</p>
                            </div>
                            <div className="w-full h-px bg-slate-100 my-6" />
                            <div className="w-full flex justify-around">
                                <div className="text-center group/stat cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile/orders')}>
                                    <p className="text-lg font-black text-slate-900">{user.stats?.ordersCount || 0}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-primary transition-colors">Orders</p>
                                </div>
                                <div className="w-px h-8 bg-slate-100" />
                                <div className="text-center group/stat cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/profile/wishlist')}>
                                    <p className="text-lg font-black text-slate-900">{user.stats?.wishlistCount || 0}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-primary transition-colors">Wishlist</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-hidden">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Account Security</h3>
                            <div className="space-y-4">
                                <div className={`flex items-center gap-3 p-3 rounded-2xl ${user.googleId ? 'bg-blue-50' : 'bg-green-50'}`}>
                                    <ShieldCheck size={20} className={user.googleId ? 'text-blue-600' : 'text-green-600'} />
                                    <div>
                                        <p className={`text-xs font-black ${user.googleId ? 'text-blue-900' : 'text-green-900'}`}>
                                            {user.googleId ? 'Google Connected' : 'Secured Account'}
                                        </p>
                                        <p className={`text-[10px] font-medium ${user.googleId ? 'text-blue-700' : 'text-green-700'}`}>
                                            {user.googleId ? 'Logged in with Google' : 'Traditional login active'}
                                        </p>
                                    </div>
                                </div>
                                {!user.googleId && (
                                    <button 
                                        onClick={() => setChangePasswordOpen(true)}
                                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Lock size={18} className="text-slate-400 group-hover:text-primary" />
                                            <span className="text-sm font-bold text-slate-600">Update Password</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Information Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                                    <User size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Personal Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ProfileField 
                                    label="Full Name" 
                                    value={formData.name} 
                                    name="name"
                                    icon={<User size={16} />}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                                <ProfileField 
                                    label="Email Address" 
                                    value={formData.email} 
                                    name="email"
                                    icon={<Mail size={16} />}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    disabled={hasRole('super-admin') || hasRole('admin') || user.googleId}
                                />
                                <ProfileField 
                                    label="Phone Number" 
                                    value={formData.phone} 
                                    name="phone"
                                    icon={<Phone size={16} />}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
                                    <CreditCard size={20} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900">Subscription & Payments</h3>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">You are currently on the <span className="text-primary font-black uppercase">Standard Plan</span>. Upgrade to unlock more features.</p>
                            <button className="mt-6 px-6 py-3 border-2 border-slate-100 hover:border-primary/20 hover:bg-primary/5 rounded-2xl text-slate-600 hover:text-primary transition-all text-sm font-bold">
                                View Billing History
                            </button>
                        </div>
                    </div>
                </div>

            {/* Change Password Modal */}
            {changePasswordOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setChangePasswordOpen(false)} />
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100">
                            <h2 className="text-2xl font-black text-slate-900">Security Check</h2>
                            <button onClick={() => setChangePasswordOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Password</label>
                                <div className="relative group">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                                        placeholder="Min. 8 characters"
                                    />
                                    <button 
                                        onClick={() => navigate('/forgot-password')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-widest"
                                    >
                                        Forgot?
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-slate-100" />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">New Password</label>
                                <div className="relative group">
                                    <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                                        placeholder="New secure password"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Confirm New Password</label>
                                <div className="relative group">
                                    <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                    <input 
                                        type="password"
                                        name="confirmNewPassword"
                                        value={passwordData.confirmNewPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-0 flex gap-3">
                            <button 
                                onClick={() => setChangePasswordOpen(false)}
                                className="flex-1 px-6 py-4 border-2 border-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handlePasswordSubmit}
                                className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfileField = ({ label, value, name, icon, isEditing, onChange, disabled }) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2 pl-1">
            <span className="text-slate-400">{icon}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        
        {isEditing ? (
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`w-full bg-slate-50 border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl py-3.5 px-4 text-sm font-bold transition-all outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        ) : (
            <div className="w-full bg-slate-50/50 border border-transparent rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-700">
                {value || 'Not provided'}
            </div>
        )}
    </div>
);

export default Profile;