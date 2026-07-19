/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app-store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './Sidebar';
import MobileMenu from './MobileMenu';
import Topbar from './Topbar';

export default function AppShell() {
  const { role, setRole, language, setLanguage } = useAppStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const title = location.pathname.split('/').pop() || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <Sidebar role={role} setRole={setRole} pathname={location.pathname} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          title={title}
          language={language}
          setLanguage={setLanguage}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        role={role}
      />
    </div>
  );
}
