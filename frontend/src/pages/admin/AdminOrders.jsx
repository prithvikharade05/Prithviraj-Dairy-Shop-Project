import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, LogOut, Filter, Search, 
  CheckCircle, XCircle, Truck, Clock, Eye
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getOrders(statusFilter || undefined);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    navigate('/login');
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Clock className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

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
              <h1 className="text-2xl font-bold text-indigo-900">Order Management</h1>
            </div>
            <div className="flex items-center gap-4">
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
              className="py-4 px-2 border-b-2 border-indigo-500 text-indigo-600 font-medium"
            >
              Orders
            </Link>
            <Link
              to="/admin/products"
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 font-medium">Filter by Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">All Orders</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <span className="font-mono text-sm font-medium text-indigo-600">{order.order_id_display || order.order_id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.user_username}</p>
                        <p className="text-sm text-gray-500">{order.user_email}</p>
                        {order.phone && <p className="text-sm text-gray-500">📞 {order.phone}</p>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        {order.items?.map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {item.product_name} x {item.quantity}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">₹{parseFloat(order.total_amount).toFixed(0)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openOrderModal(order)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {showModal && selectedOrder && (
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
                  <h2 className="text-2xl font-bold text-indigo-900">Order Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    ✕
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-bold text-indigo-600">{selectedOrder.order_id_display || selectedOrder.order_id}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{selectedOrder.user_username}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.user_email}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-green-600 text-xl">₹{parseFloat(selectedOrder.total_amount).toFixed(0)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="font-bold text-gray-900">₹{item.item_total?.toFixed(0)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Update Status */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Update Order Status</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                        disabled={selectedOrder.status === status}
                        className={`p-3 rounded-lg font-medium text-sm transition-all ${
                          selectedOrder.status === status
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : `${getStatusColor(status)} text-white hover:opacity-90`
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;

