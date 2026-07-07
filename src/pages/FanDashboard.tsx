/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import MatchCard from '../components/fan/MatchCard';
import { useUserStore } from '../store/user-store';
import { useSimulationStore } from '../store/simulation-store';
import { 
  Navigation, 
  Utensils, 
  Accessibility, 
  MessageSquare, 
  LogOut,
  Clock,
  Users,
  Bus,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function FanDashboard() {
  const { ticket, sustainability } = useUserStore();
  const { state, gates, transit, incidents } = useSimulationStore();
  const navigate = useNavigate();

  const activeIncidents = incidents.filter(i => i.status !== 'resolved');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <MatchCard 
        match={ticket.match}
        gate={ticket.gate}
        section={ticket.section}
        row={ticket.row}
        seat={ticket.seat}
        countdown="02:45:12"
      />

      {/* Live Alerts if any */}
      {activeIncidents.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-red-500">Live Disruption: {activeIncidents[0].title}</div>
            <div className="text-sm text-red-400/80">{activeIncidents[0].description}</div>
          </div>
        </motion.div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard 
          icon={Users} 
          label="Stadium Density" 
          value={`${Math.round(state.globalDensity * 100)}%`} 
          sub="Normal flow"
          color="lime"
        />
        <StatusCard 
          icon={Clock} 
          label="Avg. Gate Queue" 
          value={`${gates[0].currentQueueTime}m`} 
          sub="Gate A (Assigned)"
          color="amber"
        />
        <StatusCard 
          icon={Bus} 
          label="Next Shuttle" 
          value="4m" 
          sub="Fan Park Line"
          color="blue"
        />
      </div>

      {/* AI Tip */}
      <div className="bg-[#ccff00]/5 border border-[#ccff00]/10 rounded-3xl p-6 flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#ccff00] flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-black" />
        </div>
        <div>
          <div className="text-xs font-bold text-[#ccff00] uppercase tracking-widest mb-1">Pulse Tip</div>
          <p className="text-lg text-white font-medium leading-tight">
            "Gate C is currently 41% less congested than Gate A. Rerouting now will save you 12 minutes of entry time."
          </p>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <ActionButton icon={Navigation} label="Find Gate" onClick={() => navigate('/fan/navigate')} />
        <ActionButton icon={Utensils} label="Find Food" onClick={() => navigate('/fan/navigate')} />
        <ActionButton icon={Accessibility} label="Accessible" onClick={() => navigate('/accessibility')} />
        <ActionButton icon={MessageSquare} label="Ask Pulse" onClick={() => navigate('/fan/assistant')} />
        <ActionButton icon={LogOut} label="Leave Stadium" danger />
      </div>

      {/* Sustainability Teaser */}
      <div 
        className="bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
        onClick={() => navigate('/fan/impact')}
      >
        <div>
          <h3 className="text-xl font-bold mb-1">Your Match-Day Impact</h3>
          <p className="text-gray-500 text-sm">You've saved {sustainability.carbonSaved}kg of CO2 today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-[#ccff00]">{sustainability.points}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Points</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-[#ccff00]/20 border-t-[#ccff00] animate-spin-slow" />
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, sub, color }: any) {
  const colors: any = {
    lime: 'text-[#ccff00] bg-[#ccff00]/10 border-[#ccff00]/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{label}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-gray-400">{sub}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, danger }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all",
        danger 
          ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10" 
          : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-[#ccff00]/30"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}
