import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, DollarSign, Users, 
  TrendingUp, Package, ArrowRight, LogOut, Clock,
  CheckCircle, XCircle, Truck
} from 'lucide-react';
import { adminAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');
    navigate('/login');
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
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
              <h1 className="text-2xl font-bold text-indigo-900">Admin Dashboard</h1>
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
              className="py-4 px-2 border-b-2 border-indigo-500 text-indigo-600 font-medium"
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
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-indigo-900">{stats?.total_orders || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">₹{stats?.total_revenue?.toFixed(0) || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Today's Orders</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.today_orders || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{stats?.pending_orders || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Stats Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-indigo-900 mb-6">Weekly Orders & Revenue</h2>
            <div className="space-y-4">
              {stats?.week_stats?.map((day, index) => (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-gray-500">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-6 bg-indigo-500 rounded"
                        style={{ width: `${Math.min((day.orders / 10) * 100, 100)}%` }}
                      ></div>
                      <span className="text-sm text-gray-600">{day.orders} orders</span>
                    </div>
                  </div>
                  <div className="w-24 text-right text-sm text-green-600">
                    ₹{day.revenue.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Orders by Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h2 className="text-xl font-bold text-indigo-900 mb-6">Orders by Status</h2>
            <div className="space-y-4">
              {stats?.orders_by_status?.map((item) => (
                <div key={item.status} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${getStatusColor(item.status)} flex items-center justify-center text-white`}>
                      {getStatusIcon(item.status)}
                    </div>
                    <span className="font-medium text-gray-700">{item.status}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-indigo-900">Recent Orders</h2>
            <Link
              to="/admin/orders"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recent_orders?.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-mono text-sm font-medium text-indigo-600">{order.order_id_display || order.order_id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{order.user_username}</p>
                        <p className="text-sm text-gray-500">{order.user_email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">₹{parseFloat(order.total_amount).toFixed(0)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;

