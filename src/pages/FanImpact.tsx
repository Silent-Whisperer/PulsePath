/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useUserStore } from '../store/user-store';
import { 
  Droplets, 
  Wind, 
  Footprints, 
  Trophy, 
  ChevronRight, 
  CheckCircle2, 
  Leaf,
  Users
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

import { Button } from '../components/ui/button';

export default function FanImpact() {
  const { sustainability } = useUserStore();

  const data = [
    { name: 'Water', value: sustainability.bottlesSaved, goal: 5, unit: 'Liters' },
    { name: 'Carbon', value: Math.round(sustainability.carbonSaved * 10), goal: 20, unit: 'kg x10' },
    { name: 'Walk', value: Math.round(sustainability.stepsTaken / 1000), goal: 10, unit: 'Steps (k)' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 pb-20">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-full text-[10px] lg:text-xs font-bold text-[#ccff00] uppercase tracking-widest">
          <Leaf className="w-4 h-4" /> Global Football 2026 Sustainability
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter">Your Green Match-Day</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm lg:text-base px-4">
          Every step, refill, and transit choice counts. See how your journey is contributing to the tournament's net-zero mission.
        </p>
      </div>

      {/* Main Score Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#ccff00]/10 to-transparent border border-[#ccff00]/20 rounded-[2rem] lg:rounded-[3rem] p-8 lg:p-12 relative overflow-hidden"
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <div className="text-[10px] font-bold text-[#ccff00] uppercase tracking-[0.3em] mb-4">Current Score</div>
            <div className="text-6xl lg:text-8xl font-black tracking-tighter leading-none mb-6">
              {sustainability.points}<span className="text-[#ccff00] text-xl lg:text-3xl ml-2">pts</span>
            </div>
            <div className="space-y-4 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-[#ccff00] shrink-0" />
                <span className="text-gray-300 text-sm lg:text-base">Top 15% of sustainable fans today</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 lg:w-5 lg:h-5 text-[#ccff00] shrink-0" />
                <span className="text-gray-300 text-sm lg:text-base">Net-Zero Contributor Badge unlocked</span>
              </div>
            </div>
          </div>
          
          <div className="h-[200px] lg:h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0a0a0b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#ccff00' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Background Graphic */}
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Leaf className="w-64 h-64 rotate-12" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <ImpactStat 
          icon={Droplets} 
          label="Water Saved" 
          value={`${sustainability.bottlesSaved} Refills`} 
          desc="equivalent to 2 plastic bottles avoided." 
          color="blue"
        />
        <ImpactStat 
          icon={Wind} 
          label="Carbon Offset" 
          value={`${sustainability.carbonSaved}kg CO2`} 
          desc="by choosing metro over private transit." 
          color="lime"
        />
        <ImpactStat 
          icon={Footprints} 
          label="Walking Journey" 
          value={`${sustainability.stepsTaken}`} 
          desc="steps taken following optimized routes." 
          color="emerald"
        />
      </div>

      {/* Active Challenges */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Active Challenges</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Challenge 
            title="The Refill King" 
            desc="Use any stadium water station 3 times today." 
            progress={2} 
            total={3} 
            reward="50 pts"
          />
          <Challenge 
            title="Clean Concourse" 
            desc="Dispose of waste at any eco-bin point." 
            progress={0} 
            total={1} 
            reward="30 pts"
          />
        </div>
      </div>

      {/* Sustainability Tips */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#ccff00]/10 flex items-center justify-center">
            <Leaf className="w-8 h-8 text-[#ccff00]" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Sustainability Guide</h3>
            <p className="text-sm text-gray-500">Learn how to minimize your footprint further.</p>
          </div>
        </div>
        <Button variant="outline" className="border-white/10 rounded-xl">
          Read Guide <ChevronRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ImpactStat({ icon: Icon, label, value, desc, color }: any) {
  const colors: any = {
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    lime: 'text-[#ccff00] bg-[#ccff00]/10 border-[#ccff00]/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 transition-transform hover:scale-[1.02]">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function Challenge({ title, desc, progress, total, reward }: any) {
  const percentage = (progress / total) * 100;
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <div className="text-[10px] font-black bg-[#ccff00] text-black px-2 py-0.5 rounded uppercase tracking-tighter">
          {reward}
        </div>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-[#ccff00]" 
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-bold text-gray-600 uppercase">{progress} / {total} Completed</span>
        <span className="text-[10px] font-bold text-[#ccff00] uppercase">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
