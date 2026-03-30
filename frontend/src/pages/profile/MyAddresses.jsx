import React, { useState, useEffect, useRef } from 'react';
import { 
    Plus, 
    MoreVertical, 
    MapPin, 
    Phone, 
    CheckCircle, 
    X, 
    Edit2, 
    Trash2, 
    User,
    ChevronDown,
    Building2,
    Hash,
    MapPinned,MapPinHouse
} from 'lucide-react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Alert,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { addressService } from '../../services/addressService';
import { toast } from 'react-toastify';
import { AddressCardShimmer } from '../../components/common/Shimmer';

const AddressDropdown = ({ address, onEdit, onDelete, onSetDefault }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className={`p-2 rounded-xl transition-all ${
                    isOpen ? 'bg-slate-100 text-slate-900 shadow-inner' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
            >
                <MoreVertical size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <button 
                        onClick={() => {
                            onEdit(address);
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        <Edit2 size={16} className="text-slate-400" />
                        Edit Address
                    </button>
                    {!address.is_default && (
                        <button 
                            onClick={() => {
                                onSetDefault(address.id);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            <CheckCircle size={16} className="text-slate-400" />
                            Set as Default
                        </button>
                    )}
                    <div className="h-px bg-slate-50 my-2 mx-4" />
                    <button 
                        onClick={() => {
                            onDelete(address.id);
                            setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={16} className="text-red-400" />
                        Delete Address
                    </button>
                </div>
            )}
        </div>
    );
};

const MyAddresses = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);
    const [editingAddress, setEditingAddress] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address_line: '',
        city: '',
        state: '',
        zip: '',
        is_default: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await addressService.getAddresses();
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            toast.error('Failed to load addresses');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                name: address.name,
                phone: address.phone,
                address_line: address.address_line,
                city: address.city,
                state: address.state,
                zip: address.zip,
                is_default: address.is_default
            });
        } else {
            setEditingAddress(null);
            setFormData({
                name: '',
                phone: '',
                address_line: '',
                city: '',
                state: '',
                zip: '',
                is_default: false
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingAddress(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await addressService.updateAddress(editingAddress.id, formData);
                toast.success('Address updated successfully');
            } else {
                await addressService.addAddress(formData);
                toast.success('Address added successfully');
            }
            fetchAddresses();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        }
    };

    const handleDeleteClick = (address) => {
        setAddressToDelete(address);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        try {
            await addressService.deleteAddress(addressToDelete.id);
            toast.success('Address deleted successfully');
            setOpenDeleteDialog(false);
            setAddressToDelete(null);
            fetchAddresses();
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const address = addresses.find(a => a.id === id);
            if (address) {
                await addressService.updateAddress(id, { ...address, is_default: true });
                toast.success('Default address updated');
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error('Failed to update default address');
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">
                        Saved <span className="text-primary not-italic">Addresses.</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Your primary delivery locations
                    </p>
                </div>
                
                <button 
                    onClick={() => handleOpenDialog()}
                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    Add New Address
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <AddressCardShimmer count={3} />
                ) : (
                    addresses.map((address) => (
                        <div 
                            key={address.id}
                            className={`group relative bg-white rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 p-8 ${
                                address.is_default ? 'border-primary ring-4 ring-primary/5 bg-primary/[0.01]' : 'border-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 scale-110 -rotate-3 group-hover:rotate-0 ${
                                    address.is_default ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 text-slate-400'
                                }`}>
                                    <MapPin size={24} />
                                </div>
                                <AddressDropdown 
                                    address={address} 
                                    onEdit={handleOpenDialog} 
                                    onDelete={() => handleDeleteClick(address)} 
                                    onSetDefault={handleSetDefault} 
                                />
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight line-clamp-1">{address.name}</h3>
                                        {address.is_default && (
                                            <span className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-lg">
                                                <CheckCircle size={10} />
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                                        <Phone size={14} className="opacity-50" />
                                        {address.phone}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-50" />

                                <div className="space-y-3">
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        {address.address_line}
                                    </p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100/50">
                                            <Building2 size={12} className="opacity-50" />
                                            {address.city}, {address.state}
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 border border-slate-100/50">
                                            <MapPinned size={12} className="opacity-50" />
                                            {address.zip}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Custom Modal for Add/Edit Address */}
            {openDialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">
                                    {editingAddress ? 'Update' : 'New'} <span className="text-primary not-italic">Address.</span>
                                </h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                    {editingAddress ? 'Modify existing details' : 'Add a new shipping location'}
                                </p>
                            </div>
                            <button 
                                onClick={handleCloseDialog}
                                className="p-3 bg-white text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-10">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <FormInput 
                                        label="Full Name" 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        icon={<User size={18} />}
                                        required 
                                    />
                                    <FormInput 
                                        label="Phone Number" 
                                        name="phone" 
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        icon={<Phone size={18} />}
                                        required 
                                    />
                                </div>
                                <FormInput 
                                    label="Street Address / Building" 
                                    name="address_line" 
                                    value={formData.address_line} 
                                    onChange={handleChange} 
                                    icon={<MapPin size={18} />}
                                    multiline 
                                    required 
                                />
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                                    <FormInput 
                                        label="City" 
                                        name="city" 
                                        value={formData.city} 
                                        onChange={handleChange} 
                                        icon={<Building2 size={18} />}
                                        required 
                                    />
                                    <FormInput 
                                        label="State" 
                                        name="state" 
                                        value={formData.state} 
                                        onChange={handleChange} 
                                        icon={<MapPinHouse size={18} />}
                                        required 
                                    />
                                    <FormInput 
                                        label="Pincode" 
                                        name="zip" 
                                        value={formData.zip} 
                                        onChange={handleChange} 
                                        icon={<MapPinned size={18} />}
                                        required 
                                    />
                                </div>

                                <div className="flex items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <input 
                                        type="checkbox" 
                                        id="is_default" 
                                        name="is_default" 
                                        checked={formData.is_default} 
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary/20 accent-primary"
                                    />
                                    <label htmlFor="is_default" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
                                        Set as default shipping address
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={handleCloseDialog}
                                    className="flex-1 px-8 py-4.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] px-8 py-4.5 bg-slate-900 hover:bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-200 hover:shadow-primary/30 transition-all"
                                >
                                    {editingAddress ? 'Update Details' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f1f5f9', borderBottom: '1px solid', borderColor: 'divider' }}>
                    Confirm Delete
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Alert severity="warning" sx={{ mt:2,mb: 2, borderRadius: 1 }}>
                        This action cannot be undone!
                    </Alert>
                    <Typography>
                        Are you sure you want to delete this address for <strong>{addressToDelete?.name}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button                     
                    class='mt-auto text-rose-600 bg-rose-50 border-rose-100 py-3 px-6 rounded-xl font-black text-sm tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
                    onClick={() => setOpenDeleteDialog(false)} variant="outlined" sx={{ borderRadius: 1 }}>
                        CANCEL
                    </Button>
                    <Button class='mt-auto text-blue-600 bg-blue-50 border-blue-100 py-3 px-6 rounded-xl font-black text-sm tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
                    onClick={handleDelete} variant="contained" color="error" sx={{ borderRadius: 1, fontWeight: 600 }}>
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

const FormInput = ({ label, icon, multiline, ...props }) => (
    <div className="space-y-2.5">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
        <div className="relative group">
            {icon && (
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors duration-300">
                    {icon}
                </div>
            )}
            {multiline ? (
                <textarea 
                    {...props}
                    rows={4}
                    className={`w-full bg-white border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all duration-300 text-slate-900 font-bold placeholder:text-slate-200 min-h-[120px] ${icon ? 'pl-14 pr-6 py-5' : 'px-6 py-5'}`}
                />
            ) : (
                <input 
                    {...props}
                    className={`w-full h-14 bg-white border border-slate-100 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 rounded-2xl transition-all duration-300 text-slate-900 font-bold placeholder:text-slate-200 ${icon ? 'pl-14 pr-6' : 'px-6'}`}
                />
            )}
        </div>
    </div>
);

export default MyAddresses;
