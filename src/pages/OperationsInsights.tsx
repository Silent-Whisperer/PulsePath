/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

import {
  BrainCircuit,
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Button } from '../components/ui/button';

export default function OperationsInsights() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#ccff00] uppercase tracking-widest">
            <BrainCircuit className="w-4 h-4" /> Operations Intelligence
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter">AI Copilot Analysis</h1>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl md:text-right self-start md:self-auto">
          <div className="text-[10px] text-gray-500 uppercase font-bold">System Status</div>
          <div className="text-sm font-bold text-[#ccff00]">Optimal Performance</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-8 lg:gap-12">
        <div className="space-y-8">
          {/* Main Insight Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#ccff00] text-black rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-12 relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-black rounded-xl lg:rounded-2xl flex items-center justify-center mb-6 lg:mb-8">
                <Lightbulb className="w-5 h-5 lg:w-6 lg:h-6 text-[#ccff00]" />
              </div>
              <h2 className="text-2xl lg:text-4xl font-black tracking-tighter mb-4 lg:mb-6 leading-tight">
                Predicted bottleneck in Zone 4{' '}
                <span className="opacity-50 text-xl lg:text-3xl font-bold">within 12 minutes.</span>
              </h2>
              <p className="text-base lg:text-lg font-medium max-w-xl leading-relaxed mb-8 lg:mb-10">
                A combination of delayed shuttle arrival and asymmetric gate usage at North
                Concourse is creating a density surge. Redirecting fans now will prevent a Level 2
                safety intervention.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black text-white hover:bg-black/90 rounded-xl lg:rounded-2xl px-6 lg:px-8 py-5 lg:py-7 font-black uppercase tracking-tighter text-sm lg:text-base">
                  Apply Rerouting Plan <Target className="ml-2 w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-black/20 hover:bg-black/5 text-black rounded-xl lg:rounded-2xl px-6 lg:px-8 py-5 lg:py-7 font-bold text-sm lg:text-base"
                >
                  Review Logic
                </Button>
              </div>
            </div>

            {/* Background Graphic */}
            <div className="absolute bottom-0 right-0 p-12 opacity-5">
              <BrainCircuit className="w-64 h-64" />
            </div>
          </motion.div>

          {/* Supporting Signals */}
          <div className="grid md:grid-cols-2 gap-6">
            <SignalCard
              icon={TrendingUp}
              title="Density Trend"
              value="+14% / 5min"
              desc="Accelerating growth in Zone 4 East corridor."
            />
            <SignalCard
              icon={Zap}
              title="Throughput Efficiency"
              value="82%"
              desc="Gate A processing speed is below optimal threshold."
            />
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
            Decision History
          </h2>
          <div className="space-y-4">
            <HistoryItem
              title="Gate D Extension"
              time="20m ago"
              impact="Resolved 12% surge"
              status="Success"
            />
            <HistoryItem
              title="Volunteer Relocation"
              time="45m ago"
              impact="Optimized zone flow"
              status="Success"
            />
            <HistoryItem
              title="Shuttle Sync"
              time="1h ago"
              impact="Reduced wait by 8m"
              status="Success"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">
              <AlertTriangle className="w-3 h-3" /> Predictive Risk
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              If no action is taken, Zone 4 density will exceed 0.95 by 15:12, triggering automated
              gate restrictions and safety broadcasts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalCard({ icon: Icon, title, value, desc }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-6">
        <Icon className="w-5 h-5 text-[#ccff00]" />
      </div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{title}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function HistoryItem({ title, time, impact, status }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold">{title}</div>
        <div className="text-[10px] text-gray-500">
          {time} • {impact}
        </div>
      </div>
      <div className="text-[8px] font-black uppercase text-emerald-500">{status}</div>
    </div>
  );
}
