import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/api/cart/');
      setCart(response.data);
      setCartItems(response.data.items || []);
      setCartTotal(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const response = await api.post('/api/cart/', {
        product_id: productId,
        quantity
      });
      setCart(response.data.cart);
      setCartItems(response.data.cart.items || []);
      setCartTotal(response.data.cart.total || 0);
      showToast('Item added to cart!', 'success');
      return true;
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to add to cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    setLoading(true);
    try {
      const response = await api.put('/api/cart/', {
        item_id: itemId,
        quantity
      });
      setCart(response.data.cart);
      setCartItems(response.data.cart.items || []);
      setCartTotal(response.data.cart.total || 0);
      return true;
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    setLoading(true);
    try {
      const response = await api.delete('/api/cart/', {
        data: { item_id: itemId }
      });
      setCart(response.data.cart);
      setCartItems(response.data.cart.items || []);
      setCartTotal(response.data.cart.total || 0);
      showToast('Item removed from cart', 'success');
      return true;
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to remove item', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/orders/place/');
      setCart(null);
      setCartItems([]);
      setCartTotal(0);
      showToast('Order placed successfully!', 'success');
      return response.data;
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to place order', 'error');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    cartItems,
    cartTotal,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    placeOrder,
    getCartItemCount,
    fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

