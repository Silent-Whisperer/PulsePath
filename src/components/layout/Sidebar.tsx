/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { Accessibility, PlayCircle, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fanNav, opsNav, volNav } from './nav-config';

interface SidebarProps {
  role: 'fan' | 'operations' | 'volunteer' | 'accessibility';
  setRole: (role: 'fan' | 'operations' | 'volunteer' | 'accessibility') => void;
  pathname: string;
}

export default function Sidebar({ role, setRole, pathname }: SidebarProps) {
  const currentNav = role === 'fan' ? fanNav : role === 'operations' ? opsNav : volNav;

  return (
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
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
              pathname === item.path
                ? 'bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
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
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/accessibility' ? 'text-[#ccff00]' : 'text-gray-400'
            )}
          >
            <Accessibility className="w-4 h-4" />
            Accessibility
          </Link>
          <Link
            to="/simulation"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/simulation' ? 'text-[#ccff00]' : 'text-gray-400'
            )}
          >
            <PlayCircle className="w-4 h-4" />
            Simulation
          </Link>
          <Link
            to="/settings"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
              pathname === '/settings' ? 'text-[#ccff00]' : 'text-gray-400'
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
  );
}
