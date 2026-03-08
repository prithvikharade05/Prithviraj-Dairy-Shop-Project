import { motion } from 'framer-motion';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-103 border border-white/30">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center">
              <span className="text-6xl">🥛</span>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <Link to={`/product/${product.id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-500/80 text-white backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          {/* Stock Badge */}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-3 right-3">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-500/80 text-white backdrop-blur-sm">
                Only {product.stock} left
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-indigo-900 font-semibold text-lg mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-indigo-900/60 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-indigo-700">
                ₹{parseFloat(product.price).toFixed(0)}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
