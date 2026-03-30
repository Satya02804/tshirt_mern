'use client';

import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Avatar,
    Chip,
    InputAdornment,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';
import Can from '../../components/common/Can';
import { TableRowShimmer } from '../../components/common/Shimmer';
import { Skeleton } from '@mui/material';


const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        price: '',
        discount: '',
        category: '',
        newCategory: '',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 }
    });
    const [isUploading, setIsUploading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await api.get('/products/categories');
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);
    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/products');
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle Image Upload to Cloudinary
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            setIsUploading(true);
            const response = await api.post('/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                setFormData(prev => ({ ...prev, url: response.data.url }));
                toast.success('Image uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error.response?.data?.message || 'Image upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Product name is required';
        }

        if (!formData.url.trim()) {
            errors.url = 'Image URL is required';
        } else if (!/^https?:\/\/.+/.test(formData.url)) {
            errors.url = 'Please enter a valid URL';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            errors.price = 'Price must be greater than 0';
        }

        if (formData.discount && (parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
            errors.discount = 'Discount must be between 0 and 100';
        }

        if (!formData.category) {
            errors.category = 'Category is required';
        } else if (formData.category === 'new' && !formData.newCategory?.trim()) {
            errors.newCategory = 'New category name is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Open dialog for adding new product
    const handleAddClick = () => {
        setCurrentProduct(null);
        setFormData({
            name: '',
            url: '',
            price: '',
            discount: '',
            category: '',
            newCategory: '',
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            stock: { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 }
        });
        setFormErrors({});
        setOpenDialog(true);
    };

    // Open dialog for editing product
    const handleEditClick = (product) => {
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            url: product.url,
            price: product.price.toString(),
            discount: product.discount.toString(),
            category: product.category || '',
            newCategory: '',
            sizes: product.sizes || ['S', 'M', 'L', 'XL', 'XXL'],
            stock: product.stock || { "S": 10, "M": 10, "L": 10, "XL": 10, "XXL": 10 }
        });
        setFormErrors({});
        setOpenDialog(true);
    };

    // Handle save (create or update)
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const productData = {
                name: formData.name.trim(),
                url: formData.url.trim(),
                price: parseFloat(formData.price),
                discount: parseFloat(formData.discount) || 0,
                category: formData.category === 'new' ? formData.newCategory.trim() : formData.category,
                sizes: formData.sizes,
                stock: formData.stock
            };

            if (currentProduct) {
                // Update existing product
                await api.put(`/products/${currentProduct.id}`, productData);
                toast.success('Product updated successfully!');
            } else {
                // Create new product
                await api.post('/products', productData);
                toast.success('Product added successfully!');
            }

            setOpenDialog(false);
            fetchProducts();
            fetchCategories();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (product) => {
        setCurrentProduct(product);
        setOpenDeleteDialog(true);
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await api.delete(`/products/${currentProduct.id}`);
            toast.success('Product deleted successfully!');
            setOpenDeleteDialog(false);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error.response?.data?.message || 'Failed to delete product');
        }
    };

    // Filter products based on search
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                            Product Management
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Manage your product catalog and pricing
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, }} >
                        {/* Search Bar */}
                        <Paper sx={{ px: 1, py: 0.5, borderRadius: 2, border: 'none', boxShadow: 'none', backgroundColor: 'white', color: 'slate-900' }}>
                            <TextField
                                fullWidth
                                placeholder="Search products by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    },
                                }}
                            />
                        </Paper>
                        <Can permission="create-products">
                            <Button
                                class="mt-auto bg-primary border-2 border-slate-100 text-white py-3 px-3 rounded-xl font-black text-xs tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddClick}
                                sx={{ borderRadius: 1, fontWeight: 600 }}
                            >
                                Add Product
                            </Button>
                        </Can>
                    </Box>
                </Box>
            </Box>



            {/* Products Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#f1f5f9', borderBottom: '2px solid', borderColor: 'divider' }}>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Image</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>Product Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary' }}>Category</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Price (₹)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Discount (%)</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>Final Price (₹)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary' }}>Stock (M)</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: 'text.primary' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRowShimmer columns={7} />
                        ) : filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        {searchTerm ? 'No products found' : 'No products available. Add your first product!'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map((product, idx) => (
                                <TableRow
                                    key={product.id}
                                    sx={{
                                        bgcolor: idx % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                                        '&:hover': { bgcolor: 'rgba(30, 64, 175, 0.04)' },
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                >
                                    <TableCell>
                                        <Avatar
                                            src={product.url}
                                            alt={product.name}
                                            variant="rounded"
                                            sx={{ width: 60, height: 60 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight="medium">{product.name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-2 rounded-full mt-0.5 text-center">
                                            {product.category}
                                        </p>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontFamily={"monospace"} fontWeight={400}>₹{Number(product.price).toFixed(2)}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {Number(product.discount) > 0 ? (
                                            <Chip label={`${Number(product.discount).toFixed(0)}%`} color="success" size="small" />
                                        ) : (
                                            <Typography color="text.secondary">-</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography fontFamily={"monospace"} fontWeight={400} color="primary">
                                            ₹{Number(product.discountedPrice).toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        {product.stock ? (
                                            <Chip
                                                label={product.stock['M'] || 0}
                                                color={product.stock['M'] > 0 ? (product.stock['M'] < 5 ? 'warning' : 'success') : 'error'}
                                                size="small"
                                            />
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Can permission="edit-products">
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleEditClick(product)}
                                                title="Edit"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Can>
                                        <Can permission="delete-products">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteClick(product)}
                                                title="Delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 2 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f1f5f9', borderBottom: '1px solid', borderColor: 'divider' }}>
                    {currentProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                            required
                        />
                        <Box>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="product-image-upload"
                                type="file"
                                onChange={handleImageUpload}
                            />
                            <label htmlFor="product-image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                    disabled={isUploading}
                                    sx={{ py: 3, borderStyle: 'dashed', borderRadius: 2 }}
                                >
                                    {isUploading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CircularProgress size={20} />
                                            <span>Uploading...</span>
                                        </Box>
                                    ) : (
                                        'Upload Product Image'
                                    )}
                                </Button>
                            </label>
                            {formErrors.url && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                    {formErrors.url}
                                </Typography>
                            )}
                        </Box>

                        <TextField
                            fullWidth
                            label="Image URL (Manual Override)"
                            name="url"
                            value={formData.url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/image.jpg"
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            error={!!formErrors.price}
                            helperText={formErrors.price}
                            required
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Discount"
                            name="discount"
                            type="number"
                            value={formData.discount}
                            onChange={handleInputChange}
                            error={!!formErrors.discount}
                            helperText={formErrors.discount}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                        />
                        <TextField
                            fullWidth
                            select
                            label="Category"
                            name="category"
                            value={formData.category || ''}
                            onChange={handleInputChange}
                            error={!!formErrors.category}
                            helperText={formErrors.category}
                            required
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="" disabled></option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                            <option value="new">+ Add New Category</option>
                        </TextField>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                                Sizes & Stock levels
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <Box key={size} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                        <Typography sx={{ fontWeight: 700, minWidth: 30 }}>{size}</Typography>
                                        <TextField
                                            size="small"
                                            label="Stock"
                                            type="number"
                                            value={formData.stock[size] || 0}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    stock: { ...prev.stock, [size]: val }
                                                }));
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                        {formData.url && (
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                    Image Preview:
                                </Typography>
                                <Avatar
                                    src={formData.url}
                                    alt="Preview"
                                    variant="rounded"
                                    sx={{ width: 120, height: 120, mx: 'auto', mt: 1 }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button
                        class="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                        onClick={() => setOpenDialog(false)} sx={{ borderRadius: 1 }}>
                        Cancel
                    </Button>
                    <Button
                        class='mt-auto text-blue-600 bg-blue-50 border-blue-100 py-3 px-6 rounded-xl font-black text-sm tracking-widest uppercase shadow-sm active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3'
                        onClick={handleSave} variant="contained" color="primary" sx={{ borderRadius: 1, fontWeight: 600 }}>
                        {currentProduct ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

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
                    <Alert severity="warning" sx={{ mt: 2, mb: 2, borderRadius: 1 }}>
                        This action cannot be undone!
                    </Alert>
                    <Typography>
                        Are you sure you want to delete <strong>{currentProduct?.name}</strong>?
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
        </Container>
    );
};

export default ProductManagement;
