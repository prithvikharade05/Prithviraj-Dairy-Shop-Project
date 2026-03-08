import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Search, Filter, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden bg-white/30">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Droplets className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
              Premium <span className="text-indigo-600">Indian Dairy</span> Products
            </h1>
            <p className="text-indigo-900/70 text-lg max-w-2xl mx-auto">
              Fresh from the farm to your table. Discover our premium selection of pure ghee, milk, paneer, and other dairy products.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="glass rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/30">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-900/40" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-indigo-200/50 text-indigo-900 placeholder-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <Filter className="w-5 h-5 text-indigo-900/40 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-white/50 text-indigo-900/70 hover:bg-white/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
          />
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">🥛</div>
          <h3 className="text-2xl font-semibold text-indigo-900 mb-2">No products found</h3>
          <p className="text-indigo-900/60">Try adjusting your search or filter</p>
        </motion.div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
