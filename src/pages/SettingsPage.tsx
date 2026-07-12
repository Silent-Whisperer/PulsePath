/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAppStore } from '../store/app-store';
import { 
  Settings, 
  User, 
  Languages, 
  Shield, 
  LogOut,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function SettingsPage() {
  const { role, language, setLanguage, setRole } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
          <Settings className="w-6 h-6 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter">System Preferences</h1>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-12">
          {/* Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
              <User className="w-4 h-4" /> User Identity
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RoleOption active={role === 'fan'} label="Fan" onClick={() => setRole('fan')} />
              <RoleOption active={role === 'operations'} label="Operations" onClick={() => setRole('operations')} />
              <RoleOption active={role === 'volunteer'} label="Volunteer" onClick={() => setRole('volunteer')} />
              <RoleOption active={role === 'accessibility'} label="Support" onClick={() => setRole('accessibility')} />
            </div>
          </section>

          {/* Localization Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
              <Languages className="w-4 h-4" /> Localization
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">System Language</div>
                  <div className="text-xs text-gray-500">All interfaces and AI responses.</div>
                </div>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="bg-black border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#ccff00]"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="hi">हिन्दी</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              <div className="flex items-center justify-between border-t border-white/5 pt-8">
                <div>
                  <div className="font-bold">Timezone</div>
                  <div className="text-xs text-gray-500">Current match-day location time.</div>
                </div>
                <div className="text-sm font-bold text-gray-400">GMT-6 (Mexico City)</div>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
              <Bell className="w-4 h-4" /> Notifications
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <ToggleRow label="Emergency Broadcasts" active={true} />
              <ToggleRow label="Queue Updates" active={true} />
              <ToggleRow label="Sustainability Challenges" active={false} />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-b from-indigo-900/20 to-transparent border border-white/10 rounded-[2rem] p-8">
            <Shield className="w-10 h-10 text-indigo-500 mb-6" />
            <h3 className="font-bold mb-2">Privacy & Security</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Your location data is processed locally to generate routes and is never stored on external servers.
            </p>
            <Button variant="link" className="p-0 text-indigo-500 text-xs font-bold uppercase tracking-widest">
              Review Policy <ChevronRight className="ml-1 w-3 h-3" />
            </Button>
          </div>

          <Button 
            variant="outline" 
            className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-2xl py-6 font-bold"
          >
            <LogOut className="mr-2 w-4 h-4" /> Reset Application
          </Button>
        </div>
      </div>
    </div>
  );
}

function RoleOption({ active, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-4 rounded-2xl border text-sm font-bold transition-all",
        active ? "bg-[#ccff00] text-black border-[#ccff00]" : "bg-white/5 border-white/10 text-white hover:border-white/30"
      )}
    >
      {label}
    </button>
  );
}

function ToggleRow({ label, active }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <span className="text-sm font-medium">{label}</span>
      <div className={cn(
        "w-10 h-5 rounded-full relative transition-colors",
        active ? "bg-[#ccff00]" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
          active ? "right-1" : "left-1"
        )} />
      </div>
    </div>
  );
}
