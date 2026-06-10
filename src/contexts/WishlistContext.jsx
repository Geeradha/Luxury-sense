import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import apiClient from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get('/wishlist');
      setWishlistItems(response.data?.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
      // We only show the error if it's not a 401 (handled by interceptor)
      if (error.response?.status !== 401) {
        toast.error('Could not load your wishlist.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items to your wishlist.');
      return;
    }

    const productId = product.id;
    const isCurrentlyWishlisted = isInWishlist(productId);

    // Optimistic UI update
    if (isCurrentlyWishlisted) {
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
    } else {
      // Add a temporary optimistic item
      setWishlistItems(prev => [product, ...prev]);
    }

    try {
      const response = await apiClient.post('/wishlist/toggle', { product_id: productId });
      
      const { is_wishlisted } = response.data;
      
      if (is_wishlisted) {
        toast.success('Added to your wishlist.');
      } else {
        toast.success('Removed from your wishlist.');
      }
      
    } catch (error) {
      // Revert optimistic update on failure
      toast.error('Failed to update wishlist. Please try again.');
      fetchWishlist(); 
    }
  };

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const value = useMemo(() => ({
    wishlistItems,
    isLoading,
    toggleWishlist,
    isInWishlist,
    fetchWishlist,
  }), [wishlistItems, isLoading, isInWishlist, fetchWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
