import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
        showToast('Welcome back!', 'success');
      } else {
        await register(formData.username, formData.email, formData.password);
        showToast('Account created successfully!', 'success');
      }
      navigate('/');
    } catch (error) {
      showToast(error.response?.data?.error || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
            >
              <Droplets className="w-8 h-8 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-indigo-900 tracking-wide">Prithviraj Milk Shop</span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-8 shadow-2xl bg-white/40 backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold text-indigo-900 text-center mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-indigo-900/60 text-center mb-8">
            {isLogin 
              ? 'Sign in to continue to your account' 
              : 'Join us for premium dairy products'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-indigo-900/80 text-sm font-medium mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-900/40" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-indigo-200/50 text-indigo-900 placeholder-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Email (only for register) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-indigo-900/80 text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-900/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-indigo-200/50 text-indigo-900 placeholder-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </motion.div>
            )}

            {/* Password */}
            <div>
              <label className="block text-indigo-900/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-900/40" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-indigo-200/50 text-indigo-900 placeholder-indigo-900/40 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-indigo-900/60 mt-6">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </motion.div>

        {/* Demo Credentials */}
        {isLogin && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-indigo-900/40 text-sm mt-6"
          >
            New here? Create an account to get started!
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
