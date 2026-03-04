import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home, PartyPopper } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();

  // Confetti effect
  useEffect(() => {
    const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];
    const confettiCount = 100;
    const confettiElements = [];

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-20px';
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      confetti.style.transition = `top ${Math.random() * 2 + 2}s linear, transform ${Math.random() * 2 + 2}s ease-in-out`;
      
      document.body.appendChild(confetti);
      confettiElements.push(confetti);

      // Animate confetti
      setTimeout(() => {
        confetti.style.top = `${Math.random() * 100 + 100}vh`;
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
      }, 100);
    }

    // Cleanup
    return () => {
      confettiElements.forEach(el => el.remove());
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-12"
        >
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={4} />
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Order Placed Successfully!
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-white/70 text-lg mb-8"
          >
            Thank you for your order. Your premium dairy products will be delivered soon!
          </motion.p>

          {/* Order Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <PartyPopper className="w-5 h-5" />
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <p className="text-white/60 text-sm">
              Please have the exact amount ready when the delivery arrives.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              className="w-full py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
            >
              View Cart
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex justify-center gap-2"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className="w-3 h-3 rounded-full bg-purple-500"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;

