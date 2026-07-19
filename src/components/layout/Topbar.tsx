/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
  language: 'en' | 'es' | 'fr' | 'hi' | 'ar';
  setLanguage: (lang: 'en' | 'es' | 'fr' | 'hi' | 'ar') => void;
}

export default function Topbar({ onMenuClick, title, language, setLanguage }: TopbarProps) {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-[#0a0a0b]/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-gray-400" onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-sm font-medium text-gray-400">
            World Football Tournament 2026 <span className="mx-2">/</span>
            <span className="text-white capitalize">{title}</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
            Live Conditions
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es' | 'fr' | 'hi' | 'ar')}
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
  );
}
