/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/app-store';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  MessageSquare, 
  Leaf, 
  Settings, 
  Users, 
  ShieldAlert, 
  BarChart3, 
  BrainCircuit,
  Menu,
  X,
  Accessibility,
  PlayCircle
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

export default function AppShell() {
  const { role, setRole, language, setLanguage } = useAppStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fanNav = [
    { name: 'Match Journey', path: '/fan', icon: LayoutDashboard },
    { name: 'AI Navigation', path: '/fan/navigate', icon: MapIcon },
    { name: 'Ask Pulse', path: '/fan/assistant', icon: MessageSquare },
    { name: 'Sustainability', path: '/fan/impact', icon: Leaf },
  ];

  const opsNav = [
    { name: 'Command Center', path: '/operations', icon: LayoutDashboard },
    { name: 'Crowd Intel', path: '/operations/crowd', icon: BarChart3 },
    { name: 'Live Alerts', path: '/operations/alerts', icon: ShieldAlert },
    { name: 'AI Copilot', path: '/operations/insights', icon: BrainCircuit },
  ];

  const volNav = [
    { name: 'Task Hub', path: '/volunteer', icon: Users },
  ];

  const currentNav = role === 'fan' ? fanNav : role === 'operations' ? opsNav : volNav;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 border-r border-white/5 flex-col shrink-0 bg-[#0a0a0b]">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ccff00] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight">PULSEPATH</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {role.toUpperCase()} MODE
          </div>
          {currentNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                location.pathname === item.path 
                  ? "bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-white/5 mt-4">
            <Link
              to="/accessibility"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                location.pathname === '/accessibility' ? "text-[#ccff00]" : "text-gray-400"
              )}
            >
              <Accessibility className="w-4 h-4" />
              Accessibility
            </Link>
            <Link
              to="/simulation"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                location.pathname === '/simulation' ? "text-[#ccff00]" : "text-gray-400"
              )}
            >
              <PlayCircle className="w-4 h-4" />
              Simulation
            </Link>
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                location.pathname === '/settings' ? "text-[#ccff00]" : "text-gray-400"
              )}
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-xs text-gray-500 mb-2">SWITCH ROLE</div>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-black border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#ccff00]"
            >
              <option value="fan">Fan</option>
              <option value="operations">Operations</option>
              <option value="volunteer">Volunteer</option>
              <option value="accessibility">Accessibility Support</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-[#0a0a0b]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-400"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block">
              <h1 className="text-sm font-medium text-gray-400">
                World Football Tournament 2026 <span className="mx-2">/</span> 
                <span className="text-white capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Live Conditions</span>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-transparent text-sm text-gray-400 focus:outline-none"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="hi">HI</option>
                <option value="ar">AR</option>
              </select>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10" />
            </div>
          </div>
        </header>

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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0a0a0b] border-r border-white/10 z-50 lg:hidden p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#ccff00] rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-black rounded-full" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">PULSEPATH</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="space-y-4">
                {currentNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
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
    </div>
  );
}
