import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from "../../services/api";
import ProductCard from "../../components/product/ProductCard";
import { ProductCardShimmer } from "../../components/common/Shimmer";
import { Filter, X, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([{ name: 'All', value: null }]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState('newest');

  // Extract search query from URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const catRes = await api.getCategories();
        if (catRes.data.status === 200 || catRes.data.status === 'success') {
          const dynamicCats = catRes.data.categories.map(c => ({
            name: c.name,
            value: c.id
          }));
          setCategories([{ name: 'All', value: null }, ...dynamicCats]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          sort: sortOption
        };
        if (categoryName) params.category = categoryName;
        if (searchQuery) params.search = searchQuery;
        if (selectedSizes.length > 0) params.sizes = selectedSizes.join(',');

        const response = await api.getProducts(params);
        
        if (response.data.status === 'success' || response.data.status === 200) {
          setProducts(response.data.data || response.data.products);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.response?.data?.message || "Something went wrong while fetching products");
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchProducts, 500); // Debounce price changes
    return () => clearTimeout(timeoutId);
  }, [categoryName, searchQuery, priceRange, selectedSizes, sortOption]);

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-4">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(cat.value ? `/category/${cat.value}` : '/')}
              className={`text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                (categoryName === cat.value || (!categoryName && !cat.value))
                  ? 'bg-primary/10 text-primary border-transparent'
                  : 'bg-bg-secondary text-text-secondary border-border hover:bg-bg-primary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary">Price Range</h3>
          <span className="text-xs font-black text-primary">₹{priceRange.max}</span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          step="1"
          value={priceRange.max}
          onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
          className="w-full h-1.5 bg-bg-primary rounded-lg cursor-pointer accent-primary border border-border"
        />
        <div className="flex justify-between mt-2 text-[10px] font-bold text-text-secondary">
          <span>₹0</span>
          <span>₹2000+</span>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-4">Sizes</h3>
        <div className="grid grid-cols-3 gap-2">
          {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-11 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-300 border ${
                selectedSizes.includes(size)
                  ? 'bg-text-primary border-text-primary text-bg-primary shadow-lg scale-105'
                  : 'bg-bg-secondary border-border text-text-secondary hover:border-primary/30'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Filters */}
      <button
        onClick={() => {
          setPriceRange({ min: 0, max: 2000 });
          setSelectedSizes([]);
          setSortOption('newest');
        }}
        className="w-full py-4 text-xs font-black uppercase tracking-widest text-text-secondary hover:text-red-500 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-bg-primary">
      <Helmet>
        <title>{searchQuery ? `Search results for "${searchQuery}"` : categoryName ? `${categoryName} - T-Shirt Store` : 'Home - Premium Cotton T-Shirts'}</title>
        <meta name="description" content="Discover our latest collection of premium cotton t-shirts. Best quality, amazing designs, and fast delivery." />
        <meta property="og:title" content="T-Shirt Store - Premium Cotton Collection" />
        <meta property="og:description" content="Shop the best cotton t-shirts online." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="relative py-16 md:py-10 px-4 md:px-2 bg-bg-secondary rounded-[3rem] border border-border shadow-sm overflow-hidden mb-4">
        {/* Decorative elements */}
        {/* <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32"></div> */}
        
        <div className="relative flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h4 className="text-5xl md:text-7 font-black text-text-primary tracking-tight italic">
              Premium <span className="text-primary not-italic">Cotton</span><span className="text-primary italic">Collection</span>
            </h4>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-secondary text-lg max-w-xl"
          >
            {searchQuery ? `Showing results for "${searchQuery}"` : "Discover our latest collection of premium cotton t-shirts."}
          </motion.p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative ">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-3 bg-bg-secondary border border-border text-text-primary text-sm font-bold rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer min-w-[180px] justify-between shadow-sm hover:shadow-md active:scale-95 duration-300" 
              >
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={14} className="text-text-secondary" />
                  <span>
                    {sortOption === 'newest' ? 'Newest First' : 
                     sortOption === 'price_asc' ? 'Price: Low to High' : 
                     'Price: High to Low'}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-text-secondary transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsSortOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-bg-secondary rounded-2xl shadow-2xl shadow-primary/5 border border-border py-2 z-40 origin-top-right overflow-hidden"
                    >
                      <button
                        onClick={() => { setSortOption('newest'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 ${sortOption === 'newest' ? 'bg-primary/5 text-primary' : 'text-text-secondary hover:bg-bg-primary'}`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => { setSortOption('price_asc'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 ${sortOption === 'price_asc' ? 'bg-primary/5 text-primary' : 'text-text-secondary hover:bg-bg-primary'}`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => { setSortOption('price_desc'); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-all flex items-center gap-3 ${sortOption === 'price_desc' ? 'bg-primary/5 text-primary' : 'text-text-secondary hover:bg-bg-primary'}`}
                      >
                        Price: High to Low
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 bg-text-primary text-bg-primary px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-primary hover:text-white transition-all active:scale-95"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
      </div>

      <div className="flex gap-10">
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        <main className="flex-grow">
          {loading ? (
            <ProductCardShimmer count={8} />
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 bg-bg-secondary rounded-3xl border border-dashed border-border">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h3 className="text-xl font-black text-text-primary mb-2">Oops! Something went wrong</h3>
              <p className="text-text-secondary text-center max-w-sm mb-8">{error}</p>
              <button onClick={() => window.location.reload()} className="px-8 py-3 bg-text-primary text-bg-primary rounded-2xl font-bold hover:bg-primary transition-colors">Try Again</button>
            </div>
          ) : products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 bg-bg-secondary rounded-3xl border border-dashed border-border text-center px-6"
            >
              <div className="w-16 h-16 bg-bg-primary rounded-full flex items-center justify-center mb-6">
                <Filter className="text-text-secondary/20" size={32} />
              </div>
              <p className="text-text-secondary font-bold mb-2">No products match your filters.</p>
              <motion.button onClick={() => { setPriceRange({ min: 0, max: 2000 }); setSelectedSizes([]); navigate('/'); }} className="text-primary font-black uppercase tracking-widest text-xs hover:underline">Clear All Filters</motion.button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode='popLayout'>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} preferredSizes={selectedSizes} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-text-primary/60 backdrop-blur-sm" 
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-bg-secondary shadow-2xl p-8 overflow-y-auto border-l border-border"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-text-primary">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-bg-primary rounded-xl text-text-secondary">
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
