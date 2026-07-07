/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import StadiumMap from '../components/map/StadiumMap';
import { useSimulationStore } from '../store/simulation-store';
import { 
  Activity, 
  Users, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  BrainCircuit, 
  Zap,
  TrendingUp,
  Map as MapIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const flowData = [
  { time: '14:00', inflow: 120, risk: 20 },
  { time: '14:15', inflow: 450, risk: 25 },
  { time: '14:30', inflow: 800, risk: 40 },
  { time: '14:45', inflow: 1200, risk: 65 },
  { time: '15:00', inflow: 950, risk: 50 },
];

export default function OperationsDashboard() {
  const { state, incidents, gates } = useSimulationStore();
  const navigate = useNavigate();

  const activeAlerts = incidents.filter(i => i.status !== 'resolved');

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 min-h-full">
      {/* Central Command Map */}
      <div className="flex flex-col gap-6 h-[500px] lg:h-[calc(100vh-12rem)]">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          <StadiumMap showHeatmap />
          
          {/* Map Overlay Stats */}
          <div className="absolute top-4 left-4 lg:top-6 lg:left-6 z-[1000] flex flex-wrap gap-2 lg:gap-4">
            <MapStat label="Occupancy" value="64,231" icon={Users} />
            <MapStat label="Risk Level" value={state.globalDensity > 0.8 ? 'CRITICAL' : 'STABLE'} icon={ShieldAlert} alert={state.globalDensity > 0.8} />
          </div>

          <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 z-[1000]">
            <Button 
              className="bg-[#ccff00] text-black hover:bg-[#d9ff33] rounded-2xl py-4 lg:py-6 px-6 lg:px-8 font-black uppercase tracking-tighter text-xs lg:text-base shadow-2xl"
              onClick={() => navigate('/operations/crowd')}
            >
              Open Intel <ChevronRight className="ml-1 w-4 h-4 lg:ml-2 lg:w-5 lg:h-5" />
            </Button>
          </div>
        </div>

        {/* Real-time Throughput Chart */}
        <div className="h-40 lg:h-48 bg-white/5 border border-white/10 rounded-[2rem] p-6 shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Entry Throughput (People/min)</div>
            <div className="flex items-center gap-2 text-[#ccff00] text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> +12% vs last match
            </div>
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ccff00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ccff00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="inflow" stroke="#ccff00" fillOpacity={1} fill="url(#colorInflow)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operations Sidebar */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2">
        {/* Pulse Copilot */}
        <div className="bg-[#ccff00] text-black rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(204,255,0,0.1)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-[#ccff00]" />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Pulse Copilot</h3>
              <div className="text-[10px] font-bold opacity-60">System Analyzing Live Signals...</div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-medium leading-relaxed">
              "Zone 4 is trending toward critical density within 12 minutes due to a delayed shuttle arrival and gate imbalance. Recommend redirecting 15% of arrivals to Gate D."
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/5 rounded-2xl p-4">
                <div className="text-[10px] font-bold uppercase opacity-60">Confidence</div>
                <div className="text-xl font-black">94%</div>
              </div>
              <div className="bg-black/5 rounded-2xl p-4">
                <div className="text-[10px] font-bold uppercase opacity-60">Est. Impact</div>
                <div className="text-xl font-black">-23% Density</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-black text-white hover:bg-black/80 rounded-xl font-bold py-6">Approve Action</Button>
              <Button variant="outline" className="border-black/20 hover:bg-black/5 text-black rounded-xl font-bold px-6">Dismiss</Button>
            </div>
          </div>
        </div>

        {/* Live Incident Feed */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Active Alerts</h3>
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded uppercase">
              {activeAlerts.length} Critical
            </span>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {activeAlerts.length > 0 ? activeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            )) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">No critical incidents detected.</p>
              </div>
            )}
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-6 border-white/10 rounded-xl py-6"
            onClick={() => navigate('/operations/alerts')}
          >
            Manage All Incidents
          </Button>
        </div>
      </div>
    </div>
  );
}

function MapStat({ label, value, icon: Icon, alert }: any) {
  return (
    <div className={cn(
      "px-4 py-3 bg-[#0a0a0b]/90 backdrop-blur-xl border rounded-2xl flex items-center gap-3 shadow-2xl",
      alert ? "border-red-500/50 text-red-500" : "border-white/10 text-white"
    )}>
      <Icon className={cn("w-4 h-4", alert ? "animate-pulse" : "text-[#ccff00]")} />
      <div>
        <div className="text-[8px] font-bold uppercase opacity-50">{label}</div>
        <div className="text-sm font-black">{value}</div>
      </div>
    </div>
  );
}

function AlertCard({ alert }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-sm group-hover:text-red-400 transition-colors">{alert.title}</h4>
        <span className="text-[10px] font-black uppercase text-red-500">{alert.severity}</span>
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-snug">{alert.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{alert.timestamp.split('T')[1].slice(0, 5)}</span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
          <div className="text-[10px] font-black uppercase text-gray-400">Live</div>
        </div>
      </div>
    </div>
  );
}
