import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid, Sector } from 'recharts';
import { CarbonResults } from '../types';
import { TreeDeciduous, Car, Zap, Info, TrendingDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ActionCard } from './ActionCard';

interface Props {
  results: CarbonResults;
  units: 'metric' | 'imperial';
}

const SECTOR_DETAILS: Record<string, { desc: string; fact: string }> = {
  'Transportation': {
    desc: 'Transportation emissions are driven by burning gas or diesel in combustion engines. Driving a standard vehicle releases around 190g of CO2 per kilometer.',
    fact: 'Switching to public transit, hybrid, or electric vehicles (paired with a clean grid) is the fastest way to drop this slice to near zero.'
  },
  'Air Travel': {
    desc: 'Aviation has a high radiative forcing index. High-altitude emissions have a warming effect 1.9x to 5x greater than CO2 alone.',
    fact: 'One long-haul flight can produce more CO2 than an average person emits in a whole year. Prioritizing train itineraries or local staycations has massive impact.'
  },
  'Home Energy': {
    desc: 'Residential energy emissions result from electricity grid reliance (coal, natural gas) and space heating/cooling (natural gas, heating oil, wood).',
    fact: 'Switching your utility plan to 100% green energy or installing smart thermostats instantly reduces the footprint of all household electronics.'
  },
  'Food': {
    desc: 'Agricultural emissions are dominated by livestock farming (producing methane, which is 28x more potent than CO2) and global supply chain transit.',
    fact: 'Eating plant-first or cutting beef/lamb consumption just 3 days a week can drop your dietary footprint by up to 50%.'
  },
  'Shopping': {
    desc: 'Consumer goods manufacturing requires industrial heat, shipping fuel, and plastic production, generating heavy carbon overhead.',
    fact: 'Embracing circular shopping, buying pre-owned garments, and focusing on quality over quantity cuts out production lifecycle emissions entirely.'
  },
  'Waste': {
    desc: 'Organic waste in landfills decomposes anaerobically to produce methane gas. Standard waste systems also consume carbon in transit.',
    fact: 'Rigorous recycling and composting divert materials away from landfills and lock carbon back into soil systems.'
  }
};

interface ActiveShapeProps {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  fill: string;
  payload: {
    category: string;
  };
  percent: number;
}

const renderActiveShape = (props: ActiveShapeProps) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className="font-bold font-display text-lg">
        {payload.category}
      </text>
      <text x={cx} y={cy} dy={20} textAnchor="middle" fill="#64748b" className="font-bold text-xs">
        {(percent * 100).toFixed(0)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 15}
        fill={fill}
      />
    </g>
  );
};

export default function Dashboard({ results, units }: Props) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [activeActions, setActiveActions] = React.useState<string[]>(() => results.topActions.map(a => a.id));
  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  const convertValue = React.useCallback((val: number) => {
    return units === 'imperial' ? val * 2.20462 : val;
  }, [units]);

  const unitLabel = units === 'imperial' ? 'lbs' : 'kg';

  const totalRecSavings = React.useMemo(() => {
    return results.topActions
      .filter(a => activeActions.includes(a.id))
      .reduce((acc, curr) => acc + curr.co2Saved, 0);
  }, [results.topActions, activeActions]);

  const onPieEnter = React.useCallback((_: unknown, index: number) => {
    setActiveIndex(index);
  }, []);
  
  // Potential Path Data
  const projectionData = React.useMemo(() => {
    return [
      { name: 'Today', emissions: Math.round(convertValue(results.totalEmissions)) },
      { name: '+3mo', emissions: Math.round(convertValue(results.totalEmissions - (totalRecSavings * 0.25))) },
      { name: '+6mo', emissions: Math.round(convertValue(results.totalEmissions - (totalRecSavings * 0.5))) },
      { name: '+9mo', emissions: Math.round(convertValue(results.totalEmissions - (totalRecSavings * 0.75))) },
      { name: 'Target', emissions: Math.round(convertValue(results.totalEmissions - totalRecSavings)) },
    ];
  }, [results.totalEmissions, totalRecSavings, convertValue]);

  return (
    <div className="space-y-6 md:space-y-10 pb-12">
      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden min-h-[350px] md:min-h-[400px]"
        >
          <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Sparkles size={18} className="md:w-5 md:h-5" />
                </div>
                <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-slate-400">AI Sustainability Profile</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-display leading-tight md:leading-[1.1] mb-6 md:mb-8">
                Your path to <span className="text-emerald-500">Net Zero</span> starts here.
              </h1>
              
              <div className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-md lg:max-w-none">
                <p className="text-sm md:text-lg text-slate-300 italic leading-relaxed">
                  "{results.aiInsight}"
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 md:mt-12 lg:mt-6 relative z-10 select-none cursor-default">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-full w-full">
                <div className="text-emerald-500 text-2xl md:text-3xl xl:text-4xl font-bold font-display flex items-center gap-2">
                  <span className="opacity-50 text-xl">🔥</span> {Math.round(convertValue(results.totalEmissions)).toLocaleString()}
                </div>
                <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Current {unitLabel} CO2/yr</div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-full w-full">
                <div className="text-white text-2xl md:text-3xl xl:text-4xl font-bold font-display flex items-center gap-2">
                  <span className="opacity-50 text-xl">🎯</span> {Math.round(convertValue(results.totalEmissions - totalRecSavings)).toLocaleString()}
                </div>
                <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Potential Target ({unitLabel})</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col justify-between h-full w-full">
                <div className="text-emerald-400 text-2xl md:text-3xl xl:text-4xl font-bold font-display flex items-center gap-2">
                  <span className="opacity-50 text-xl">📉</span> {Math.round((totalRecSavings / results.totalEmissions) * 100)}%
                </div>
                <div className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-2">Reduction Potential</div>
              </div>
            </div>
          </div>

          <div 
            className="absolute -bottom-24 -right-24 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/20 rounded-full blur-[120px]" 
            style={{ transform: 'translate3d(0,0,0)' }}
          />
          <div 
            className="absolute top-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" 
            style={{ transform: 'translate3d(0,0,0)' }}
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 p-6 md:p-10 shadow-sm flex flex-col items-center justify-between text-center min-h-[400px]"
        >
          <div className="w-full">
            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white font-display mb-1">Impact Distribution</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mb-6">Where your carbon comes from</p>
          </div>

          <div className="relative w-full aspect-square max-w-[280px] md:max-w-[320px] mb-6" role="img" aria-label="Carbon footprint impact distribution pie chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={results.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={6}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  stroke="none"
                >
                  {results.breakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const val = Math.round(convertValue(Number(payload[0].value)));
                      return (
                        <div className="bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl text-white p-3 rounded-2xl border border-white/10 dark:border-slate-800/80 shadow-2xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-1">{payload[0].name}</p>
                          <p className="text-sm font-bold font-display">{val.toLocaleString()} <span className="opacity-50 text-[10px]">{unitLabel} CO2/yr</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-2 w-full">
            {results.breakdown.slice(0, 4).map((item, i) => (
              <div key={item.category} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-transparent dark:border-slate-800/60">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase truncate w-full">{item.category}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.percentage.toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sector Drilldown Details Box */}
          <div className="w-full mt-6 p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl text-left border border-slate-100/50 dark:border-slate-800/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[activeIndex % COLORS.length] }} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                {results.breakdown[activeIndex]?.category || 'Transportation'} Insights
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2 font-medium">
              {SECTOR_DETAILS[results.breakdown[activeIndex]?.category || 'Transportation']?.desc}
            </p>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-bold">
              💡 {SECTOR_DETAILS[results.breakdown[activeIndex]?.category || 'Transportation']?.fact}
            </p>
          </div>
        </motion.div>
      </div>

      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 md:w-8 h-[2px] bg-emerald-500" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">The High-Impact Directive</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display">Your Top 3 Actions</h2>
            <p className="text-sm md:text-slate-500 dark:text-slate-400 mt-2">These three shifts represent 80% of your available impact.</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] md:text-xs font-bold w-fit border dark:border-emerald-900/30">
            <Zap size={14} className="fill-emerald-500" />
            Combined Potential: -{Math.round(convertValue(totalRecSavings)).toLocaleString()} {unitLabel}/yr
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {results.topActions.map((action, index) => (
            <ActionCard 
              key={action.id} 
              action={action} 
              index={index} 
              isActive={activeActions.includes(action.id)}
              onToggle={() => {
                setActiveActions(prev => 
                  prev.includes(action.id) 
                    ? prev.filter(id => id !== action.id) 
                    : [...prev, action.id]
                );
              }}
              units={units}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-display">Strategic Projection</h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Emissions drop over 12 months</p>
            </div>
            <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl md:rounded-2xl border dark:border-blue-900/30">
              <TrendingDown size={20} className="md:w-6 md:h-6" />
            </div>
          </div>

          <div className="h-[250px] md:h-[300px] w-full" role="img" aria-label="12-month carbon reduction projection graph">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: '1px solid ' + (isDark ? '#334155' : '#e2e8f0'), 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a'
                  }}
                  formatter={(value) => [`${value.toLocaleString()} ${unitLabel}`, 'CO2 Output']}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEmissions)" 
                  name="CO2 Output"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col"
        >
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className="p-2 md:p-3 bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl shadow-sm text-slate-900 dark:text-white border dark:border-slate-800">
              <Info size={20} className="md:w-6 md:h-6" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-display">Contextual Mastery</h3>
          </div>

          <div className="space-y-4 md:space-y-6 flex-grow">
            {[
              { label: 'Trees Offset Equivalent', value: results.metrics.treesEquivalent, sub: 'Mature trees needed per year', emoji: '🌳' },
              { label: 'Unused Driving Power', value: units === 'imperial' ? Math.round(results.metrics.drivingEquivalent * 0.621371) : results.metrics.drivingEquivalent, sub: units === 'imperial' ? 'Miles not driven' : 'Kilometers not driven', emoji: '🚗' },
              { label: 'Home Energy Equivalent', value: results.metrics.homeEnergyEquivalent, sub: 'Days of average home power', emoji: '⚡' },
            ].map((m, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-transparent dark:border-slate-800 flex items-center gap-4 md:gap-5 hover:shadow-md dark:hover:border-slate-700 hover:-translate-y-1 transition-all">
                <div className="p-2 md:p-3 bg-slate-50 dark:bg-slate-950 text-slate-400 rounded-lg md:rounded-xl text-xl md:text-2xl border dark:border-slate-800">
                  {m.emoji}
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-display">{m.value.toLocaleString()}</div>
                  <div className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium">{m.label}</div>
                  <div className="text-[9px] md:text-[10px] text-slate-400 dark:text-slate-500 italic">{m.sub}</div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => window.print()} 
            className="mt-8 md:mt-10 w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 cursor-tree-hover shadow-sm print:hidden"
          >
            Download Impact Report (PDF)
          </button>
        </motion.div>
      </div>
      </div>
    );
  }
