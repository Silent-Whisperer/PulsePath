import React from 'react';
import { motion } from 'motion/react';
import { HighImpactAction } from '../types';
import { Car, Plane, Home, ShoppingBag, Trash2, Salad, Leaf, ArrowRight, Zap, Target } from 'lucide-react';
import { cn } from '../lib/utils';

const CAT_ICONS = {
  transportation: Car,
  travel: Plane,
  energy: Home,
  shopping: ShoppingBag,
  waste: Trash2,
  food: Salad
};

interface Props {
  action: HighImpactAction;
  index: number;
  isActive: boolean;
  onToggle: () => void;
  units: 'metric' | 'imperial';
}

export const ActionCard: React.FC<Props> = ({ action, index, isActive, onToggle, units }) => {
  const Icon = CAT_ICONS[action.category] || Leaf;
  const isPriorityOne = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden flex flex-col p-6 md:p-8 rounded-3xl md:rounded-[2rem] border transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 active:scale-[0.98]",
        isPriorityOne 
          ? "bg-slate-900 border-slate-800 text-white md:col-span-2 dark:bg-slate-900 dark:border-slate-800/80" 
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white"
      )}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Icon size={isPriorityOne ? 180 : 120} strokeWidth={1} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 md:p-3 rounded-xl md:rounded-2xl shrink-0",
              isPriorityOne ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border dark:border-emerald-900/30"
            )}>
              <Icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]",
                isPriorityOne ? "text-emerald-400" : "text-emerald-600"
              )}>
                Priority #{index + 1}
              </span>
              <div className="flex items-center gap-2">
                <Target size={12} className="text-slate-400" />
                <span className="text-slate-500 text-[10px] md:text-xs">
                  Impact: {action.impactWeight}%
                </span>
              </div>
            </div>
          </div>
          
          {isPriorityOne && (
            <div className="hidden sm:block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Critical Shift
            </div>
          )}
        </div>

        <h3 className={cn(
          "text-xl md:text-2xl font-bold mb-3 font-display leading-tight",
          isPriorityOne ? "text-white" : "text-slate-900 dark:text-white"
        )}>
          {action.title}
        </h3>

        <p className={cn(
          "text-sm mb-6 flex-grow leading-relaxed",
          isPriorityOne ? "text-slate-400/90" : "text-slate-500 dark:text-slate-400"
        )}>
          {action.description}
        </p>

        {/* AI Insight Snippet */}
        <div className={cn(
          "mb-8 p-3 md:p-4 rounded-xl md:rounded-2xl text-[11px] md:text-xs flex gap-3 items-start border",
          isPriorityOne 
            ? "bg-white/5 border-white/10 text-slate-300" 
            : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-300 italic"
        )}>
          <Zap size={14} className="shrink-0 text-amber-400 mt-0.5" />
          <p>{action.narrative}</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mt-auto gap-6 lg:gap-4">
          <div>
            <div className={cn(
              "text-[10px] font-semibold uppercase tracking-wider mb-1",
              isPriorityOne ? "text-slate-500" : "text-slate-400 dark:text-slate-500"
            )}>
              Potential Savings
            </div>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                "text-3xl md:text-4xl font-bold font-display",
                isPriorityOne ? "text-emerald-400" : "text-emerald-500"
              )}>
                -{Math.round(units === 'imperial' ? action.co2Saved * 2.20462 : action.co2Saved).toLocaleString()}
              </span>
              <span className={cn(
                "text-xs md:text-sm font-medium",
                isPriorityOne ? "text-slate-500" : "text-slate-400 dark:text-slate-500"
              )}>
                {units === 'imperial' ? 'lbs CO2/yr' : 'kg CO2/yr'}
              </span>
            </div>
          </div>

          <button 
            onClick={onToggle}
            className={cn(
              "w-full lg:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm transition-all active:scale-95 shadow-lg",
              isActive 
                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20 border border-transparent" 
                : "bg-slate-900 dark:bg-slate-950 text-white dark:text-slate-200 hover:bg-slate-800 dark:hover:bg-slate-800 border dark:border-slate-800/60 shadow-slate-900/10 dark:shadow-slate-950/20"
            )}
          >
            {isActive ? '✓ Active Priority' : '+ Enable Priority'}
            <ArrowRight size={16} className={cn("transition-transform", isActive ? "rotate-90" : "")} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
