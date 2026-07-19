/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fanNav, opsNav, volNav } from './nav-config';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'fan' | 'operations' | 'volunteer' | 'accessibility';
}

export default function MobileMenu({ isOpen, onClose, role }: MobileMenuProps) {
  const currentNav = role === 'fan' ? fanNav : role === 'operations' ? opsNav : volNav;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-y-0 left-0 w-72 bg-[#0a0a0b] border-r border-white/10 z-50 lg:hidden p-6"
          >
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={onClose} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#ccff00] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rounded-full" />
                </div>
                <span className="text-xl font-bold tracking-tight">PULSEPATH</span>
              </Link>
              <button onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="space-y-4">
              {currentNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-3 text-lg text-gray-400 hover:text-white"
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
