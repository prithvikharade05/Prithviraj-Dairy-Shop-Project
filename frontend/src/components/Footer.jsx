import { motion } from 'framer-motion';
import { Droplets, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-indigo-200/50 mt-auto bg-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-indigo-900 tracking-wide">Prithviraj Milk Shop</span>
            </motion.div>
            <p className="text-indigo-900/70 mb-4 max-w-md">
              Premium dairy products delivered fresh to your doorstep. 
              We source only the finest organic milk, ghee, paneer, and dairy products 
              from trusted local farms.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, y: -2 }}
                href="#"
                className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-700 hover:text-indigo-900 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-indigo-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'Cart', 'Login', 'Register'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-indigo-900/60 hover:text-indigo-900 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-indigo-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-indigo-900/60">
                <Mail className="w-4 h-4" />
                <span>hello@prithvirajmilkshop.com</span>
              </li>
              <li className="flex items-center gap-2 text-indigo-900/60">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-indigo-900/60">
                <MapPin className="w-4 h-4" />
                <span>123 Dairy Market, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-indigo-200/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-indigo-900/40 text-sm">
            © 2024 Prithviraj Milk Shop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-indigo-900/40 text-sm hover:text-indigo-900/60 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-indigo-900/40 text-sm hover:text-indigo-900/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
