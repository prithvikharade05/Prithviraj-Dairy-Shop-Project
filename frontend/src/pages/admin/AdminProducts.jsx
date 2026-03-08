import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, LogOut, Plus, Edit, Trash2, Image,
  X, Save
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image_url: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Dairy',
      stock: '',
      image_url: '',
      image: null
    });
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image_url: product.image_url || '',
      image: null
    });
    setImagePreview(product.image_url || null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    if (formData.image_url) {
      data.append('image_url', formData.image_url);
    }
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, data);
      } else {
        await adminAPI.createProduct(data);
      }
      fetchProducts();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-indigo-900">Product Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <Link
              to="/admin"
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/orders"
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Orders
            </Link>
            <Link
              to="/admin/products"
              className="py-4 px-2 border-b-2 border-indigo-500 text-indigo-600 font-medium"
            >
              Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Product Image */}
              <div className="h-48 bg-gray-100 relative">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-300" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="p-2 rounded-lg bg-white shadow-md text-indigo-600 hover:bg-indigo-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-white shadow-md text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 truncate flex-1">{product.name}</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs rounded-full">
                    {product.category}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-green-600">₹{parseFloat(product.price).toFixed(0)}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>{product.stock}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No products found</p>
            <button
              onClick={openAddModal}
              className="mt-4 px-6 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-indigo-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="flex gap-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500">Upload</span>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Or Image URL
                        </label>
                        <input
                          type="url"
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Enter product name"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Enter product description"
                    />
                  </div>

                  {/* Price and Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="Dairy">Dairy</option>
                      <option value="Milk">Milk</option>
                      <option value="Cheese">Cheese</option>
                      <option value="Butter">Butter</option>
                      <option value="Yogurt">Yogurt</option>
                      <option value="Cream">Cream</option>
                      <option value="Ghee">Ghee</option>
                      <option value="Paneer">Paneer</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                      <Save className="w-5 h-5" />
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;

