import React, { useEffect, useState } from 'react';
import { 
    Package, 
    Calendar, 
    ShoppingCart, 
    IndianRupee, 
    ChevronRight, 
    Download,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    AlertCircle,
    Phone
} from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { TableRowShimmer } from '../../components/common/Shimmer';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async (filter = activeFilter, search = searchTerm) => {
        try {
            setLoading(true);
            const response = await api.get('/orders/my-orders', {
                params: { status: filter, search: search }
            });
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchOrders();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, activeFilter]);

    const getStatusStyles = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': 
                return {
                    bg: 'bg-amber-50 text-amber-600 border-amber-100',
                    icon: <Clock size={12} />,
                    label: 'Pending'
                };
            case 'processing': 
                return {
                    bg: 'bg-blue-50 text-blue-600 border-blue-100',
                    icon: <Clock size={12} />,
                    label: 'Processing'
                };
            case 'shipped': 
                return {
                    bg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
                    icon: <Truck size={12} />,
                    label: 'Shipped'
                };
            case 'delivered': 
                return {
                    bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                    icon: <CheckCircle2 size={12} />,
                    label: 'Delivered'
                };
            case 'cancelled': 
                return {
                    bg: 'bg-rose-50 text-rose-600 border-rose-100',
                    icon: <XCircle size={12} />,
                    label: 'Cancelled'
                };
            default: 
                return {
                    bg: 'bg-slate-50 text-slate-600 border-slate-100',
                    icon: <AlertCircle size={12} />,
                    label: status
                };
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: 'blob'
            });

            if (response.data.type === 'application/json') {
                const text = await response.data.text();
                const error = JSON.parse(text);
                toast.error(error.message || 'Failed to download invoice');
                return;
            }

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2 italic">
                        Order <span className="text-primary not-italic">History.</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                        Track and manage your style journey
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative group flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text"
                            placeholder="Search Order ID or Product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all placeholder:text-slate-300"
                        />
                    </div>

                    <div className="flex bg-white rounded-2xl p-1.5 border border-slate-100 shadow-sm self-start sm:self-auto">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeFilter === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setActiveFilter('in-progress')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeFilter === 'in-progress' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            In Progress
                        </button>
                        <button 
                            onClick={() => setActiveFilter('delivered')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                activeFilter === 'delivered' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Delivered
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Order Details</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Purchase Date</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center">Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && orders.length === 0 ? (
                                <TableRowShimmer columns={5} count={5} />
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center max-w-xs mx-auto text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                                                {searchTerm ? <Search size={40} /> : <Package size={40} />}
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Nothing <span className="text-primary not-italic">Found.</span></h3>
                                            <p className="text-slate-400 font-medium mb-8">
                                                {searchTerm ? `No orders matching "${searchTerm}"` : "You haven't placed any orders yet. Let's find something you love!"}
                                            </p>
                                            <button 
                                                onClick={() => {
                                                    if (searchTerm) {
                                                        setSearchTerm('');
                                                        setActiveFilter('all');
                                                    } else {
                                                        navigate('/');
                                                    }
                                                }}
                                                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
                                            >
                                                {searchTerm ? 'View All Orders' : 'Start Bespoke Shopping'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const status = getStatusStyles(order.status);
                                    const isExpanded = expandedOrder === order.id;

                                    return (
                                        <React.Fragment key={order.id}>
                                            <tr className={`group hover:bg-slate-50 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-50/50' : ''}`} onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="flex -space-x-4">
                                                            {order.items.slice(0, 3).map((item, id) => (
                                                                <div key={id} className="w-12 h-12 rounded-2xl border-2 border-white bg-white overflow-hidden shadow-sm flex items-center justify-center text-slate-400">
                                                                    {item.product.url ? (
                                                                        <img src={item.product.url} alt={item.product.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package size={20} />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {order.items.length > 3 && (
                                                                <div className="w-12 h-12 rounded-2xl border-2 border-white bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-sm">
                                                                    +{order.items.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">ID: {order.orderNumber}</div>
                                                            <div className="text-sm font-bold text-slate-900 flex flex-wrap gap-x-2">
                                                                {order.items.length === 1 ? order.items[0].product.name : `${order.items.length} Products`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                                                        <Calendar size={16} className="text-slate-300" />
                                                        {formatDate(order.created_at)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8 text-center">
                                                    <div className="text-lg font-black text-slate-900 tracking-tight">
                                                        <span className="text-slate-300 text-sm mr-1">₹</span>
                                                        {order.totalPrice}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border ${status.bg}`}>
                                                        {status.icon}
                                                        {status.label}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownloadInvoice(order.id);
                                                            }}
                                                            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 rounded-xl transition-all shadow-sm group-hover:shadow-md"
                                                            title="Download Invoice"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                        <button 
                                                            className={`p-3 rounded-xl shadow-lg border border-transparent transition-all active:scale-95 ${
                                                                isExpanded ? 'bg-primary text-white rotate-90' : 'bg-slate-900 text-white'
                                                            }`}
                                                        >
                                                            <ChevronRight size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Detailed View */}
                                            {isExpanded && (
                                                <tr className="bg-slate-50/30">
                                                    <td colSpan={5} className="px-8 py-10 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
                                                        
                                                        {/* Order Tracker Stepper */}
                                                        <div className="mb-12 px-6">
                                                            <div className="relative flex justify-between">
                                                                {/* Progress Bar Background */}
                                                                <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                                                                
                                                                {/* Active Progress Bar */}
                                                                <div 
                                                                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-1000 -z-10"
                                                                    style={{ 
                                                                        width: order.status === 'delivered' ? '100%' : 
                                                                               order.status === 'shipped' ? '66%' : 
                                                                               order.status === 'processing' ? '33%' : '0%' 
                                                                    }}
                                                                ></div>

                                                                {[
                                                                    { id: 'pending', label: 'Ordered', icon: <Package size={16} /> },
                                                                    { id: 'processing', label: 'Processing', icon: <Clock size={16} /> },
                                                                    { id: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
                                                                    { id: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={16} /> }
                                                                ].map((step, idx) => {
                                                                    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
                                                                    const currentIdx = statuses.indexOf(order.status.toLowerCase());
                                                                    const isCompleted = idx < currentIdx || order.status.toLowerCase() === 'delivered';
                                                                    const isActive = idx === currentIdx;

                                                                    return (
                                                                        <div key={step.id} className="flex flex-col items-center">
                                                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                                                                isCompleted ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 
                                                                                isActive ? 'bg-white border-primary text-primary shadow-lg shadow-primary/10 scale-110' : 
                                                                                'bg-white border-slate-100 text-slate-300'
                                                                            }`}>
                                                                                {step.icon}
                                                                            </div>
                                                                            <span className={`mt-3 text-[10px] font-black uppercase tracking-widest ${
                                                                                isCompleted || isActive ? 'text-slate-900' : 'text-slate-300'
                                                                            }`}>
                                                                                {step.label}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                                            {/* Order Items List */}
                                                            <div className="lg:col-span-2 space-y-6">
                                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Order Items</h4>
                                                                <div className="grid gap-4">
                                                                    {order.items.map((item) => (
                                                                        <div key={item.id} className="flex items-center gap-5 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                                                {item.product.url ? (
                                                                                    <img src={item.product.url} alt={item.product.name} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <Package size={24} className="text-slate-200" />
                                                                                )}
                                                                            </div>
                                                                            <div className="flex-1 min-w-0">
                                                                                <div className="text-sm font-black text-slate-900 truncate mb-1">{item.product.name}</div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">Size: {item.size}</span>
                                                                                    <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-wider">Qty: {item.quantity}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <div className="text-slate-300 text-[10px] font-black uppercase mb-0.5">Price</div>
                                                                                <div className="text-sm font-black text-slate-900 tracking-tight">₹{item.price}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Shipping & Payment Info */}
                                                            <div className="space-y-8">
                                                                <div className="space-y-4">
                                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Shipping Information</h4>
                                                                    <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                                                                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 self-start">
                                                                            <Truck size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-xs font-bold text-slate-900 mb-2 leading-relaxed">
                                                                                {order.shippingAddress}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-400">
                                                                                <Phone size={12} />
                                                                                {order.phone}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Payment Method</h4>
                                                                    <div className="flex items-center gap-4 p-5 bg-primary/5 border border-primary/10 rounded-3xl shadow-sm ring-1 ring-primary/5">
                                                                        <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                                                                            <IndianRupee size={18} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-[10px] font-black text-primary/60 uppercase tracking-widest mb-1">Paid via</div>
                                                                            <div className="text-sm font-black text-primary uppercase tracking-wider">{order.paymentMethod}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {order.notes && (
                                                                    <div className="space-y-4">
                                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Order Notes</h4>
                                                                        <p className="text-sm font-bold text-slate-500 leading-relaxed italic">{order.notes}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Pagination Placeholder */}
                {!loading && orders.length > 0 && (
                    <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Showing {orders.length} orders
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 bg-white border border-slate-100 text-slate-300 rounded-lg cursor-not-allowed">
                                <ChevronRight size={16} className="rotate-180" />
                            </button>
                            <button className="p-2 bg-white border border-slate-100 text-slate-400 hover:text-primary rounded-lg shadow-sm transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default MyOrders;
