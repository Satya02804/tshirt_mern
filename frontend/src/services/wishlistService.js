import api from './api';

export const wishlistService = {
  // Add product to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await api.post('/wishlist/add', { productId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    try {
      const response = await api.delete(`/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if product is in wishlist
  checkWishlistStatus: async (productId) => {
    try {
      const response = await api.get(`/wishlist/status/${productId}`);
      return response.data; // Expected { status: 'success', isInWishlist: true/false }
    } catch (error) {
      console.error("Error checking wishlist status", error);
      return { isInWishlist: false };
    }
  },

  // Get all wishlist items
  getWishlist: async () => {
    try {
        const response = await api.get('/wishlist');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
  }
};
