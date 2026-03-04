import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Minus, Plus, Loader2, Package, Clock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${id}/`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const success = await addToCart(product.id, quantity);
    if (success) {
      navigate('/cart');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-3xl overflow-hidden">
              {product.image_url && !imageError ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-[400px] object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-[400px] bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                  <span className="text-9xl">🥛</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Category Badge */}
            <span className="inline-block px-4 py-1 text-sm font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {product.category}
            </span>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-white">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold gradient-text">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              <span className="text-white/50">/ unit</span>
            </div>

            {/* Description */}
            <p className="text-white/70 text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-4">
              {product.stock > 0 ? (
                <>
                  <span className="flex items-center gap-2 text-green-400">
                    <Package className="w-5 h-5" />
                    In Stock
                  </span>
                  <span className="text-white/50">|</span>
                  <span className="text-white/70">
                    {product.stock} units available
                  </span>
                </>
              ) : (
                <span className="flex items-center gap-2 text-red-400">
                  <Package className="w-5 h-5" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="glass rounded-2xl p-4">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center disabled:opacity-50"
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    <span className="text-2xl font-bold text-white w-12 text-center">
                      {quantity}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <span className="text-white/50">
                    Max: {product.stock} units
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock === 0}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold text-lg flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all disabled:opacity-50"
            >
              {cartLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="w-6 h-6" />
                  {product.stock === 0 ? 'Out of Stock' : `Add to Cart - $${(product.price * quantity).toFixed(2)}`}
                </>
              )}
            </motion.button>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Quality Assured</p>
                  <p className="text-white/50 text-sm">100% Organic</p>
                </div>
              </div>
              <div className="glass rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Fast Delivery</p>
                  <p className="text-white/50 text-sm">Same Day Shipping</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;

