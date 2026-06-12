import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Car, Home, Salad, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Plane, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';
import { AssessmentData } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onComplete: (data: AssessmentData) => void;
  units: 'metric' | 'imperial';
}

const STEPS = [
  { id: 'transportation', title: 'Car & Transit', icon: Car, color: 'text-blue-500', bg: 'bg-blue-50', q: "How do you navigate your world?" },
  { id: 'travel', title: 'Air Travel', icon: Plane, color: 'text-indigo-500', bg: 'bg-indigo-50', q: "The long-haul impact check." },
  { id: 'energy', title: 'Home Energy', icon: Home, color: 'text-amber-500', bg: 'bg-amber-50', q: "What powers your living space?" },
  { id: 'food', title: 'Food & Diet', icon: Salad, color: 'text-emerald-500', bg: 'bg-emerald-50', q: "Your daily consumption habits." },
  { id: 'shopping', title: 'Consumption', icon: ShoppingBag, color: 'text-purple-500', bg: 'bg-purple-50', q: "Retail and manufacturing load." },
  { id: 'waste', title: 'Waste', icon: Trash2, color: 'text-teal-500', bg: 'bg-teal-50', q: "The end of the product lifecycle." },
];

const INITIAL_DATA: AssessmentData = {
  transportation: { mileage: 10000, type: 'gas' },
  travel: { shortFlights: 2, longFlights: 1 },
  energy: { electricityMonthly: 300, heatingSource: 'gas', houseSize: 'medium', renewableEnergy: 0 },
  food: { diet: 'meat', localSourcing: 20, foodWaste: 'medium' },
  shopping: { frequency: 'medium', clothingFreq: 'medium' },
  waste: { recycling: true, composting: false },
};

export default function AssessmentForm({ onComplete, units }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<AssessmentData>(() => {
    const initial = { ...INITIAL_DATA };
    if (units === 'imperial') {
      initial.transportation = { ...initial.transportation, mileage: 6000 };
    }
    return initial;
  });

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const currentStep = STEPS[stepIndex];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      <div className={cn(
        "bg-white dark:bg-slate-900 rounded-3xl md:rounded-[3rem] p-6 md:p-12 border transition-all duration-700 relative",
        "shadow-[0_32px_64px_-16px_rgba(15,23,42,0.15)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] ring-1 ring-slate-100 dark:ring-slate-800/50",
        stepIndex % 2 === 0 
          ? "border-emerald-500/30 dark:border-emerald-500/20 shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)]" 
          : "border-slate-100 dark:border-slate-800",
        "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_70%)] before:pointer-events-none before:z-0"
      )}>
        {/* Carbon Emission (Smoke) Effect background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-slate-900/5 dark:bg-slate-950/20 transition-colors duration-700">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-slate-300 dark:text-slate-700 selection:bg-transparent pointer-events-none select-none filter blur-[2px]"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: '105%', 
                scale: 0.2 + Math.random() * 1.5,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              animate={{ 
                y: '-10%', 
                opacity: [0, 0.4, 0],
                x: (Math.random() - 0.5) * 40 + '%',
                rotate: Math.random() * 360 + 180
              }}
              transition={{ 
                duration: 8 + Math.random() * 12, 
                repeat: Infinity,
                delay: i * 1.5,
                ease: "linear"
              }}
            >
              <div className="w-16 h-16 bg-slate-400/20 rounded-full" />
            </motion.div>
          ))}
        </div>

        <div className={cn(
          "absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-1000 opacity-0 z-0",
          stepIndex % 2 === 0 && "opacity-100 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_70%)]"
        )} />
        
        <div className="relative z-10">
            {/* Progress header - Improved/Proper Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Diagnostic Status</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600">Phase {stepIndex + 1} of {STEPS.length}</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden flex gap-1 p-0.5 border border-slate-200/50 dark:border-slate-800 shadow-inner">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "h-full rounded-full transition-all duration-700 flex-1",
                    idx === stepIndex ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : 
                    idx < stepIndex ? "bg-slate-900 dark:bg-slate-100" : "bg-transparent"
                  )}
                />
              ))}
            </div>
          </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            className="min-h-[300px] md:min-h-[400px]"
          >
            <div className="mb-8 md:mb-12">
              <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm", currentStep.bg, currentStep.color)}>
                <currentStep.icon size={28} className="md:w-8 md:h-8" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white font-display mb-2 md:mb-3">{currentStep.title}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium leading-tight md:leading-normal">{currentStep.q}</p>
            </div>

            <div className="space-y-8 md:space-y-10">
              {currentStep.id === 'transportation' && (
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" /> {units === 'imperial' ? 'Annual Mileage' : 'Annual Kilometers'}
                      </label>
                      <span className="text-xl md:text-2xl font-bold text-emerald-500 font-display">
                        {data.transportation.mileage.toLocaleString()} {units === 'imperial' ? 'miles' : 'km'}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={units === 'imperial' ? 30000 : 50000} 
                      step={units === 'imperial' ? 500 : 1000} 
                      value={data.transportation.mileage}
                      onChange={(e) => setData({ ...data, transportation: { ...data.transportation, mileage: Number(e.target.value) } })}
                      className="w-full cursor-tree-hover"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 block">Vehicle Engine Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                      {(['gas', 'hybrid', 'electric', 'public', 'bike'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setData({ ...data, transportation: { ...data.transportation, type } })}
                          className={cn(
                            "py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl border-2 text-xs md:text-sm font-bold capitalize transition-all cursor-tree-hover",
                            data.transportation.type === type 
                              ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 shadow-lg shadow-emerald-500/10 dark:shadow-emerald-950/20" 
                              : "border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50"
                          )}
                        >
                          {type === 'gas' ? 'Gasoline' : type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep.id === 'travel' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[2rem]">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 md:mb-6 block">Short-Haul Trips</label>
                    <div className="flex items-center gap-6">
                      <input 
                        type="range" min="0" max="20" step="1" 
                        value={data.travel.shortFlights}
                        onChange={(e) => setData({ ...data, travel: { ...data.travel, shortFlights: Number(e.target.value) } })}
                        className="flex-1 cursor-tree-hover"
                      />
                      <span className="text-2xl md:text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-display w-10 md:w-12 text-center">{data.travel.shortFlights}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-3 md:mt-4 italic">Round trips &lt; 3 hours</p>
                  </div>
                  <div className="p-6 md:p-8 bg-indigo-900 dark:bg-indigo-950 rounded-3xl md:rounded-[2rem] text-white border dark:border-indigo-900/50">
                    <label className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4 md:mb-6 block">Long-Haul Trips</label>
                    <div className="flex items-center gap-6">
                      <input 
                        type="range" min="0" max="10" step="1" 
                        value={data.travel.longFlights}
                        onChange={(e) => setData({ ...data, travel: { ...data.travel, longFlights: Number(e.target.value) } })}
                        className="flex-1 cursor-tree-hover"
                      />
                      <span className="text-2xl md:text-3xl font-bold text-white font-display w-10 md:w-12 text-center">{data.travel.longFlights}</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-indigo-300/60 mt-3 md:mt-4 italic">International round trips</p>
                  </div>
                </div>
              )}

              {currentStep.id === 'energy' && (
                <div className="space-y-8 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 p-5 md:p-6 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-2xl md:rounded-3xl">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 md:mb-4 block">Grid Dependency</label>
                      <input 
                        type="number"
                        value={data.energy.electricityMonthly}
                        onChange={(e) => setData({ ...data, energy: { ...data.energy, electricityMonthly: Number(e.target.value) } })}
                        className="text-3xl md:text-4xl font-bold font-display bg-transparent text-slate-900 dark:text-white outline-none w-full"
                      />
                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">kWh / mo</span>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Living Architecture</label>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        {(['apartment', 'small', 'medium', 'large'] as const).map(size => (
                          <button
                            key={size}
                            onClick={() => setData({ ...data, energy: { ...data.energy, houseSize: size } })}
                            className={cn(
                              "py-2 md:py-3 rounded-lg md:rounded-xl border-2 text-[10px] md:text-xs font-bold capitalize transition-all cursor-tree-hover",
                              data.energy.houseSize === size 
                                ? "border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400" 
                                : "border-slate-50 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50"
                            )}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Renewable Power Mix</label>
                      <span className="text-base md:text-lg font-bold text-amber-600">{data.energy.renewableEnergy}% Green</span>
                    </div>
                    <input 
                       type="range" min="0" max="100" step="5"
                       value={data.energy.renewableEnergy}
                       onChange={(e) => setData({ ...data, energy: { ...data.energy, renewableEnergy: Number(e.target.value) } })}
                       className="w-full cursor-tree-hover"
                    />
                  </div>
                </div>
              )}

              {currentStep.id === 'food' && (
                <div className="space-y-6 md:space-y-8">
                  <div>
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4 md:mb-6 block">Dietary Profile</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {(['heavy-meat', 'meat', 'vegetarian', 'vegan'] as const).map(diet => (
                        <button
                          key={diet}
                          onClick={() => setData({ ...data, food: { ...data.food, diet } })}
                          className={cn(
                            "py-4 md:py-5 px-5 md:px-6 rounded-2xl md:rounded-[2rem] border-2 text-xs md:text-sm font-bold capitalize transition-all flex items-center justify-between cursor-tree-hover",
                            data.food.diet === diet 
                              ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400" 
                              : "border-slate-50 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-900/50"
                          )}
                        >
                          {diet.replace('-', ' ')}
                          {data.food.diet === diet && <Sparkles size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-2xl md:rounded-[2rem]">
                    <div className="flex justify-between mb-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Local Sourcing Ratio</label>
                      <span className="text-base md:text-lg font-bold text-emerald-600">{data.food.localSourcing}%</span>
                    </div>
                    <input 
                      type="range" min="0" max="100"
                      value={data.food.localSourcing}
                      onChange={(e) => setData({ ...data, food: { ...data.food, localSourcing: Number(e.target.value) } })}
                      className="w-full cursor-tree-hover"
                    />
                  </div>
                </div>
              )}

              {currentStep.id === 'shopping' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest block">General Purchases</label>
                    <div className="flex flex-col gap-2">
                       {(['low', 'medium', 'high'] as const).map(freq => (
                         <button
                           key={freq}
                           onClick={() => setData({ ...data, shopping: { ...data.shopping, frequency: freq } })}
                           className={cn(
                             "py-4 rounded-xl md:rounded-2xl border-2 text-[10px] md:text-xs font-bold capitalize transition-all cursor-tree-hover",
                             data.shopping.frequency === freq 
                               ? "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900" 
                               : "border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50"
                           )}
                         >
                           {freq === 'low' ? 'Minimalist' : freq === 'medium' ? 'Standard' : 'Frequent'}
                         </button>
                       ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest block">Wardrobe Refresh Rate</label>
                    <div className="flex flex-col gap-2">
                       {(['low', 'medium', 'high'] as const).map(freq => (
                         <button
                           key={freq}
                           onClick={() => setData({ ...data, shopping: { ...data.shopping, clothingFreq: freq } })}
                           className={cn(
                             "py-4 rounded-xl md:rounded-2xl border-2 text-[10px] md:text-xs font-bold capitalize transition-all cursor-tree-hover",
                             data.shopping.clothingFreq === freq 
                               ? "bg-purple-600 dark:bg-purple-500 border-purple-600 dark:border-purple-500 text-white" 
                               : "border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50"
                           )}
                         >
                           {freq}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep.id === 'waste' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {[
                    { key: 'recycling', label: 'Rigorous Recycling', desc: 'Metals, plastics, paper', icon: '♻️' },
                    { key: 'composting', label: 'Organic Composting', desc: 'Food and green waste', icon: '🌱' },
                  ].map((w) => (
                    <button 
                      key={w.key}
                      onClick={() => setData({ ...data, waste: { ...data.waste, [w.key]: !data.waste[w.key as keyof typeof data.waste] } })}
                      className={cn(
                        "p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 text-left transition-all group cursor-tree-hover",
                        data.waste[w.key as keyof typeof data.waste]
                          ? "border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-400"
                          : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700"
                      )}
                    >
                      <div className="text-3xl md:text-4xl mb-4 md:mb-6">{w.icon}</div>
                      <h4 className={cn("text-lg md:text-xl font-bold mb-1 md:mb-2 font-display", data.waste[w.key as keyof typeof data.waste] ? "text-teal-900 dark:text-teal-300" : "text-slate-900 dark:text-white")}>
                        {w.label}
                      </h4>
                      <p className="text-xs md:text-sm text-slate-500 leading-tight">{w.desc}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-6 mt-12 md:mt-20 relative z-20">
          {stepIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBack();
              }}
              className="w-full sm:w-auto px-10 py-4 md:py-5 flex items-center justify-center gap-2 text-slate-900 dark:text-white font-bold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl md:rounded-2xl transition-all border border-slate-200 dark:border-slate-800 active:scale-95 bg-white dark:bg-slate-900 shadow-sm"
            >
              <ArrowLeft size={18} /> Back
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="flex-grow py-4 md:py-5 flex items-center justify-center gap-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-tree-hover"
          >
            {stepIndex === STEPS.length - 1 ? 'Unlock My Roadmap' : 'Continue Step'} 
            <Target size={18} className={stepIndex === STEPS.length - 1 ? "text-emerald-400 dark:text-emerald-600" : ""} />
          </button>
        </div>

        {/* Decorative corner element */}
        <div className="absolute -bottom-8 -left-8 w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-full flex items-center justify-center opacity-30 md:opacity-50">
          <Sparkles className="text-slate-200" size={32} />
        </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-slate-400">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
           <ShieldCheck size={14} /> Encrypted Session
        </div>
        <div className="hidden sm:block w-px h-3 bg-slate-200" />
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
           <Zap size={14} /> AI-Powered Logic
        </div>
      </div>
    </div>
  );
}
