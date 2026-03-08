import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, LogOut, Menu, X, Droplets } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const cartCount = getCartItemCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 glass border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <Droplets className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-indigo-900 tracking-wide">Prithviraj Milk Shop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-indigo-900/80 hover:text-indigo-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="relative text-indigo-900/80 hover:text-indigo-900 transition-colors"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-indigo-900/80 hover:text-indigo-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-indigo-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-indigo-200/50"
        >
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              className="block text-indigo-900/80 hover:text-indigo-900 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/cart"
              className="block text-indigo-900/80 hover:text-indigo-900 transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart ({cartCount})
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-indigo-900/80 hover:text-indigo-900 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;

