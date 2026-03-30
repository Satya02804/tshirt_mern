import React from 'react';
import { X } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Size Guide</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Find your perfect fit</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
                        Use the chart below to determine your perfect size. Measurements are taken in inches. If you're on the borderline between two sizes, order the smaller size for a tighter fit or the larger size for a looser fit.
                    </p>
                    
                    <div className="overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-900 font-bold uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-2xl">Size</th>
                                    <th className="px-6 py-4">Chest (inches)</th>
                                    <th className="px-6 py-4">Length (inches)</th>
                                    <th className="px-6 py-4 rounded-tr-2xl">Shoulders (inches)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-black">S</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">36 - 38</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">27</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">16</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-black">M</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">38 - 40</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">28</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">17</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-black">L</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">40 - 42</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">29</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">18</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-black">XL</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">42 - 44</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">30</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">19</td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-black">XXL</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">44 - 46</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">31</td>
                                    <td className="px-6 py-4 font-medium text-slate-600">20</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 bg-primary/5 rounded-2xl p-5 border border-primary/10">
                        <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-2">How to Measure</h3>
                        <ul className="text-xs text-slate-600 space-y-2 font-medium">
                            <li><strong className="text-slate-900">Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                            <li><strong className="text-slate-900">Length:</strong> Measure from the highest point of the shoulder down to the desired hemline.</li>
                            <li><strong className="text-slate-900">Shoulders:</strong> Measure directly across the back from the edge of one shoulder to the other.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SizeGuideModal;
