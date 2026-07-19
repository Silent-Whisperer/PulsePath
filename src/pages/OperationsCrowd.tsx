/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSimulationStore } from '../store/simulation-store';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Users, TrendingUp, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

const predictionData = [
  { time: 'Now', density: 65, predicted: 65 },
  { time: '15m', predicted: 78 },
  { time: '30m', predicted: 85 },
  { time: '45m', predicted: 72 },
];

export default function OperationsCrowd() {
  const { zones, gates } = useSimulationStore();

  const zoneData = zones.map((z) => ({
    name: z.name.split(' ')[0],
    density: Math.round(z.currentDensity * 100),
    risk: z.riskLevel,
  }));

  const gateData = gates.map((g) => ({
    name: g.name.split(' ')[1],
    throughput: g.throughput,
    queue: g.currentQueueTime,
  }));

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Crowd Intelligence</h2>
          <p className="text-gray-500">Real-time sensor analysis and predictive modeling</p>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 md:flex-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center min-w-[120px]">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Inflow Rate</div>
            <div className="text-xl font-bold">
              1,240 <span className="text-xs text-gray-600">/min</span>
            </div>
          </div>
          <div className="flex-1 md:flex-none px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-center min-w-[120px]">
            <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Egress Rate</div>
            <div className="text-xl font-bold">
              12 <span className="text-xs text-gray-600">/min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Zone Density Chart */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg lg:text-xl font-bold">Density by Zone</h3>
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneData}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 10 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{
                    backgroundColor: '#0a0a0b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                  }}
                />
                <Bar dataKey="density" radius={[6, 6, 0, 0]}>
                  {zoneData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.density > 80 ? '#ef4444' : entry.density > 60 ? '#f59e0b' : '#ccff00'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Congestion Chart */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg lg:text-xl font-bold">Predicted Congestion</h3>
            <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" /> AI Simulation
            </div>
          </div>
          <div className="h-[250px] lg:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0a0a0b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#ccff00"
                  strokeWidth={3}
                  dot={{ fill: '#ccff00', r: 4 }}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="density"
                  stroke="#ccff00"
                  strokeWidth={3}
                  dot={{ fill: '#ccff00', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Bottleneck Analysis */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8">
          <h3 className="text-lg lg:text-xl font-bold mb-8">Gate Performance</h3>
          <div className="space-y-6">
            {gateData.map((gate) => (
              <div key={gate.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-400">Gate {gate.name}</span>
                  <span className="font-bold">
                    {Math.round(gate.queue)}m queue • {Math.round(gate.throughput)}p/m
                  </span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-1000',
                      gate.queue > 20
                        ? 'bg-red-500'
                        : gate.queue > 10
                          ? 'bg-amber-500'
                          : 'bg-[#ccff00]'
                    )}
                    style={{ width: `${Math.min(100, (gate.queue / 40) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Interventions */}
        <div className="bg-[#ccff00]/5 border border-[#ccff00]/20 rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold">Suggested Interventions</h3>
          </div>
          <div className="space-y-4">
            <Intervention
              title="Reroute North Arrivals"
              desc="Divert 15% of inbound fans from Gate A to Gate C."
              impact="-8m wait"
            />
            <Intervention
              title="Staff Deployment"
              desc="Deploy 4 volunteers to East Concourse for flow assist."
              impact="Smooth flow"
            />
            <Intervention
              title="Digital Signage Update"
              desc="Update LED boards to show 12min savings at West Gate."
              impact="-15% density"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Intervention({ title, desc, impact }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#ccff00]/50 transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-1">
        <div className="font-bold text-sm">{title}</div>
        <div className="text-[10px] font-black text-[#ccff00] uppercase">{impact}</div>
      </div>
      <p className="text-[10px] text-gray-500 leading-tight">{desc}</p>
    </div>
  );
}
