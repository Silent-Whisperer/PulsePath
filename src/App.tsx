/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Sparkles, RefreshCcw, Github, MessageSquare, X, Zap, ArrowRight, ShieldCheck, TrendingDown, Sun, Moon } from 'lucide-react';
const AssessmentForm = React.lazy(() => import('./components/AssessmentForm'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AICoach = React.lazy(() => import('./components/AICoach'));
const DocumentScanner = React.lazy(() => import('./components/DocumentScanner'));
import type { ScannedReceiptData } from './components/DocumentScanner';
import { AssessmentData, CarbonResults } from './types';
import { calculateFootprint } from './utils/calculations';
import { cn } from './lib/utils';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-white font-sans">
          <Leaf className="text-emerald-500 mb-4 animate-bounce" size={48} />
          <h2 className="text-3xl font-bold font-display mb-2">Something went wrong.</h2>
          <p className="text-slate-400 mb-6">Our sustainability engine encountered a display issue.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all cursor-pointer">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


export default function App() {
  const [view, setView] = useState<'landing' | 'assessment' | 'results'>('landing');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CarbonResults | null>(null);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [showCoach, setShowCoach] = useState(false);
  const [activeModal, setActiveModal] = useState<'methodology' | 'coach' | 'impact' | null>(null);

  const [isInactive, setIsInactive] = useState(false);
  const [units, setUnits] = useState<'metric' | 'imperial'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('units');
      if (saved === 'metric' || saved === 'imperial') return saved;
    }
    return 'metric';
  });

  useEffect(() => {
    localStorage.setItem('units', units);
    if (assessment) {
      const updated = { ...assessment };
      if (units === 'imperial') {
        updated.transportation = {
          ...updated.transportation,
          mileage: Math.round(assessment.transportation.mileage / 1.60934)
        };
      } else {
        updated.transportation = {
          ...updated.transportation,
          mileage: Math.round(assessment.transportation.mileage * 1.60934)
        };
      }
      setAssessment(updated);
      setResults(calculateFootprint(updated, units));
    }
  }, [units]);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      setIsInactive(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsInactive(true), 5 * 60 * 1000); // 5 minutes
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
        setShowCoach(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startAssessment = React.useCallback(() => {
    setView('assessment');
    window.scrollTo(0, 0);
  }, []);

  const handleAssessmentComplete = React.useCallback((data: AssessmentData) => {
    setIsLoading(true);
    window.scrollTo(0, 0);

    // Fake carbon-themed loading screen
    setTimeout(() => {
      const calcResults = calculateFootprint(data, units);
      setAssessment(data);
      setResults(calcResults);
      setIsLoading(false);
      setView('results');
    }, 2500);
  }, [units]);

  const handleDataExtracted = React.useCallback((extractedData: ScannedReceiptData) => {
    if (!assessment) return;
    const updated = { ...assessment };
    if (extractedData.type === 'electricity') {
      updated.energy = {
        ...updated.energy,
        electricityMonthly: Math.round(extractedData.amount)
      };
    } else if (extractedData.type === 'fuel') {
      let kmAdded = 0;
      if (extractedData.unit?.toLowerCase().includes('gallon')) {
        kmAdded = units === 'imperial' ? extractedData.amount * 25 : extractedData.amount * 40.2336;
      } else {
        kmAdded = units === 'imperial' ? extractedData.amount * 7.456 : extractedData.amount * 12;
      }
      updated.transportation = {
        ...updated.transportation,
        mileage: Math.round(updated.transportation.mileage + kmAdded)
      };
    }
    setAssessment(updated);
    setResults(calculateFootprint(updated, units));
  }, [assessment, units]);

  const reset = React.useCallback(() => {
    setView('landing');
    setResults(null);
    setAssessment(null);
    setShowCoach(false);
    window.scrollTo(0, 0);
  }, []);

  return (
    <ErrorBoundary>
      <div className={cn(
        "min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-emerald-200 dark:selection:bg-emerald-800/50 selection:text-emerald-900 dark:selection:text-emerald-100",
        view === 'landing' ? "bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100" : "bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100",
      isInactive ? "cursor-inactive" : ""
    )}>
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 print:hidden">
        <div 
          className={cn(
            "absolute -top-48 -left-48 w-[40rem] h-[40rem] rounded-full blur-[120px] opacity-40 animate-pulse transition-colors duration-1000",
            view === 'landing' ? "bg-emerald-500/10 dark:bg-emerald-500/5" : "bg-emerald-100/40 dark:bg-emerald-950/20"
          )}
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div 
          className={cn(
            "absolute top-1/4 right-0 w-[50rem] h-[50rem] rounded-full blur-[160px] opacity-30 transition-colors duration-1000",
            view === 'landing' ? "bg-blue-500/10 dark:bg-blue-500/5" : "bg-blue-100/30 dark:bg-blue-950/20"
          )}
          style={{ transform: 'translate3d(0,0,0)' }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-[60rem] h-[60rem] bg-emerald-50/60 dark:bg-emerald-950/10 rounded-full blur-[200px] opacity-50"
          style={{ transform: 'translate3d(0,0,0)' }}
        />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 print:hidden",
        view === 'landing' 
          ? "bg-white/70 border-slate-100 dark:bg-slate-950/70 dark:border-slate-900" 
          : "bg-white/70 border-slate-100/50 dark:bg-slate-950/70 dark:border-slate-900"
      )}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <button className="flex items-center gap-2 md:gap-3 cursor-tree-hover group border-none bg-transparent p-0 text-left outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded-xl" onClick={reset} aria-label="CarbonBuddy AI logo, reset to home page">
            <div className="p-1.5 md:p-2 bg-emerald-500 rounded-lg md:rounded-xl shadow-lg shadow-emerald-500/20 shrink-0 group-hover:scale-110 transition-transform">
              <Leaf className="text-white" size={20} />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl tracking-tight truncate text-slate-900 dark:text-white">CarbonBuddy <span className="text-emerald-700 dark:text-emerald-400">AI</span></span>
          </button>
          <div className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
            <button 
              onClick={() => setActiveModal('methodology')} 
              className="px-5 py-2 rounded-full border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 transition-all bg-emerald-500/5 cursor-tree-hover font-bold text-[10px] uppercase tracking-[0.2em] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              Methodology
            </button>
            <button 
              onClick={() => setActiveModal('coach')} 
              className="px-5 py-2 rounded-full border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 transition-all bg-emerald-500/5 cursor-tree-hover font-bold text-[10px] uppercase tracking-[0.2em] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              Coach Index
            </button>
            <button 
              onClick={() => setActiveModal('impact')} 
              className="px-5 py-2 rounded-full border border-emerald-500/30 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 transition-all bg-emerald-500/5 cursor-tree-hover font-bold text-[10px] uppercase tracking-[0.2em] focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
            >
              Global Impact
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
              className="px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-tree-hover shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              aria-label="Toggle units"
            >
              {units === 'metric' ? 'Metric (kg)' : 'Imperial (lbs)'}
            </button>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-full border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 cursor-tree-hover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {view === 'results' && (
              <button 
                onClick={reset}
                className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors active:scale-95 bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm cursor-tree-hover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                aria-label="New Diagnostic"
              >
                <RefreshCcw size={14} /> <span className="hidden sm:inline">New Diagnostic</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-20 md:pt-28 px-4 md:px-6 relative z-10">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center text-center p-6 overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute bg-emerald-500/10 rounded-full blur-xl"
                    style={{ 
                      width: Math.random() * 200 + 100 + 'px', 
                      height: Math.random() * 200 + 100 + 'px',
                      left: Math.random() * 100 + '%',
                      top: Math.random() * 100 + '%'
                    }}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.1, 0.3, 0.1],
                      x: [0, (Math.random() - 0.5) * 100, 0],
                      y: [0, (Math.random() - 0.5) * 100, 0]
                    }}
                    transition={{ duration: 5 + Math.random() * 5, repeat: Infinity }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 w-full max-w-lg">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 md:w-40 md:h-40 border-t-2 border-emerald-500 border-r-2 border-r-emerald-500/30 border-b-2 border-b-transparent border-l-2 border-l-transparent rounded-full flex items-center justify-center mb-12 mx-auto relative"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20"
                  >
                    <Leaf className="text-emerald-400" size={32} />
                  </motion.div>
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tighter">
                  Analyzing <span className="text-emerald-500">Profiles.</span>
                </h2>

                <div className="space-y-6">
                  {[
                    { label: "Scanning transport habits", delay: 0 },
                    { label: "Calculating lifestyle deltas", delay: 0.8 },
                    { label: "Identifying net-zero paths", delay: 1.6 }
                  ].map((stage, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: stage.delay }}
                      className="flex items-center gap-4 text-left"
                    >
                      <div className="w-5 h-5 rounded border border-emerald-500/30 flex items-center justify-center">
                        <motion.div 
                          className="w-2 h-2 bg-emerald-500 rounded-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1] }}
                          transition={{ delay: stage.delay + 0.3 }}
                        />
                      </div>
                      <span className="text-xs md:text-sm font-mono text-emerald-100/60 uppercase tracking-[0.2em]">{stage.label}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 h-1 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'landing' && !isLoading && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto text-center py-6 md:py-20 flex flex-col items-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 bg-slate-900 dark:bg-slate-900 border dark:border-slate-800 text-white rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-6 md:mb-12 shadow-xl shadow-slate-900/20"
              >
                <Sparkles size={12} className="text-emerald-400" /> Introducing: Impact Diagnostic 2.0
              </motion.div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-display font-bold leading-[1.1] md:leading-[0.85] mb-6 md:mb-12 tracking-tighter text-slate-900 dark:text-white">
                Reimagine Your Impact. <br className="hidden md:block" />
                Meet Your <span className="text-emerald-700 dark:text-emerald-400 italic">AI Climate Coach.</span>
              </h1>

              <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-4xl mx-auto mb-10 md:mb-20 leading-relaxed font-medium">
                CarbonBuddy AI moves beyond basic carbon counting. By decoding your daily habits with advanced lifecycle insights, we identify the exact <span className="text-slate-900 dark:text-white font-bold decoration-emerald-500/50 underline underline-offset-8">high-leverage shifts</span> that accelerate your journey to Net Zero.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 mb-16 md:mb-40 w-full px-4 sm:px-0">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startAssessment}
                  className="w-full sm:w-auto px-10 md:px-16 py-6 md:py-8 bg-emerald-500 text-slate-950 rounded-2xl md:rounded-[2.5rem] text-xl md:text-2xl font-bold shadow-[0_32px_64px_-16px_rgba(16,185,129,0.4)] hover:bg-emerald-400 transition-all flex items-center justify-center gap-4 group active:scale-95 cursor-tree-hover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
                >
                  Start Diagnostic <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </div>

              {/* Bento-style Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 text-left w-full px-4 sm:px-0 pb-20">
                <div className="md:col-span-2 p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[3rem] shadow-sm hover:shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group ring-1 ring-slate-100 dark:ring-slate-800/50">
                  <div className="p-3 md:p-4 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl inline-block mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 font-display text-slate-900 dark:text-white">Contextual Intelligence</h3>
                  <p className="text-sm md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">"Our AI doesn't just calculate; it interprets. Discover the 'Why' behind your footprint peaks with contextual advice that fits your lifestyle."</p>
                </div>
                <div className="p-8 md:p-12 bg-slate-900 dark:bg-slate-900 text-white rounded-3xl md:rounded-[3rem] shadow-2xl flex flex-col justify-between hover:scale-[1.02] transition-transform border border-transparent dark:border-slate-800">
                  <TrendingDown size={32} className="text-emerald-400 mb-6 md:mb-8" />
                  <h3 className="text-xl md:text-3xl font-bold font-display leading-tight mb-4">Interactive Trajectories</h3>
                  <p className="text-slate-400 text-xs md:text-base font-medium">Visual projections that show you exactly how close you are to climate targets over 12 months.</p>
                </div>
                <div className="p-8 md:p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[3rem] shadow-sm hover:shadow-xl transition-shadow ring-1 ring-slate-100/50 dark:ring-slate-800 flex flex-col justify-between">
                   <ShieldCheck size={32} className="text-blue-500 dark:text-blue-400 mb-6 md:mb-8" />
                   <h3 className="text-xl md:text-3xl font-bold font-display leading-tight mb-4">Validated Climate Science</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-xs md:text-base font-medium">Verified emission factors powered by worldwide climate and lifecycle databases.</p>
                </div>
              </div>

              {/* Did you know section */}
              <div className="w-full mt-20 md:mt-32 max-w-5xl mx-auto px-4">
                <div className="bg-emerald-950 dark:bg-emerald-950/40 text-white rounded-[2.5rem] p-8 md:p-16 flex flex-col items-center text-center relative overflow-hidden border dark:border-emerald-900/50">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-12 right-12 w-96 h-96 bg-emerald-500 rounded-full blur-3xl" />
                  </div>
                  
                  <div className="relative z-10 w-full">
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-emerald-400 mb-6 md:mb-8 block">Educational Insight</span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 md:mb-12">Did you know?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                      <div className="flex flex-col gap-4 text-left p-6 bg-white/5 rounded-3xl border border-white/10">
                        <div className="text-emerald-400 font-bold text-lg md:text-xl">One steak = 3,000 liters of water</div>
                        <p className="text-sm md:text-base text-emerald-100/70 leading-relaxed font-medium">
                          Producing just 1kg of beef emits approximately 60kg of CO2 and requires thousands of liters of water. Skipping meat just once a week makes a massive dent.
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 text-left p-6 bg-white/5 rounded-3xl border border-white/10">
                        <div className="text-emerald-400 font-bold text-lg md:text-xl">The 100-Company Rule</div>
                        <p className="text-sm md:text-base text-emerald-100/70 leading-relaxed font-medium">
                          Just 100 companies have been responsible for 71% of global greenhouse emissions since 1988. Collective action and voting with your wallet works.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-12 md:mt-16 pt-8 border-t border-white/10">
                      <p className="text-xs md:text-sm text-emerald-200/50 italic">Source: IPCC Special Report 2024 & World Wildlife Fund Statistics</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'assessment' && (
            <div key="assessment" className="max-w-4xl mx-auto py-10 md:py-20">
              <div className="mb-8 md:mb-12 text-center px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display mb-3 md:mb-4">The Impact Diagnostic</h2>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 italic">"I'll need a few snapshots of your lifestyle to build your custom roadmap."</p>
              </div>
              <React.Suspense fallback={<div className="text-center p-12 text-emerald-700 dark:text-emerald-400 font-bold font-mono">LOADING DIAGNOSTIC FORM...</div>}>
                <AssessmentForm onComplete={handleAssessmentComplete} units={units} />
              </React.Suspense>
            </div>
          )}

          {view === 'results' && results && assessment && (
            <React.Suspense fallback={<div className="text-center p-12 text-emerald-700 dark:text-emerald-400 font-bold font-mono">LOADING STRATEGIC DASHBOARD...</div>}>
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-4 print:block gap-8 md:gap-12 pb-20"
              >
                <div className="xl:col-span-3 print:w-full">
                  <Dashboard results={results} units={units} />
                </div>
                
                <aside className="space-y-8 print:hidden">
                  <DocumentScanner onDataExtracted={handleDataExtracted} />
                <div className="bg-slate-900 p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border dark:border-slate-800">
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                      <Zap size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Next Frontier</span>
                  </div>
                  <h4 className="text-2xl font-bold mb-4 font-display">Beyond the Top 3</h4>
                  <p className="text-sm text-slate-400 leading-relaxed mb-8">
                    Once you've mastered your priority actions, I recommend exploring your <span className="text-white font-bold">{results.secondaryActions[0]?.category}</span> impact.
                  </p>
                  <button className="w-full py-4 bg-emerald-500 text-slate-950 rounded-2xl font-bold text-sm shadow-lg hover:bg-emerald-400 transition-all active:scale-95 cursor-tree-hover focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none">
                    View Secondaries
                  </button>
                </div>
                
                <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2rem] md:rounded-[2.5rem] shadow-sm">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4 font-display">Coach Verification</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    This analysis is based on global averages and your self-reported data. For accuracy, consider syncing your utility bills.
                  </p>
                </div>
              </aside>
            </motion.div>
          </React.Suspense>
        )}
        </AnimatePresence>
      </main>

      {/* Footer responsiveness */}
      <footer className={cn(
        "mt-12 md:mt-24 border-t transition-colors duration-500 pb-12 pt-12 md:pb-16 md:pt-16 px-6 print:hidden",
        view === 'landing' ? "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900" : "bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900"
      )}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <button className="flex items-center gap-3 cursor-tree-hover border-none bg-transparent p-0 text-left outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none rounded-xl" onClick={reset} aria-label="CarbonBuddy AI logo, reset to home page">
            <div className="p-1.5 bg-emerald-500 rounded-lg">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-display font-bold tracking-tight text-lg text-slate-900 dark:text-white">CarbonBuddy AI</span>
          </button>
          <p className="text-center md:text-left">© 2026 ClimateOS. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 uppercase tracking-widest text-[10px]">
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1.5"><Github size={14} /> GitHub</a>
          </div>
        </div>
      </footer>

      {/* Floating AI Coach Container - Responsive adjustments */}
      {view === 'results' && assessment && (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] print:hidden">
          <AnimatePresence>
            {showCoach && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="mb-4 md:mb-6 drop-shadow-2xl fixed inset-4 md:inset-auto md:relative md:bottom-auto md:right-auto md:w-auto"
              >
                <div className="w-full h-full md:w-[380px] md:h-[480px]">
                  <React.Suspense fallback={<div className="bg-white dark:bg-slate-900 p-8 rounded-3xl text-emerald-700 dark:text-emerald-400 font-bold font-mono">LOADING AI COACH...</div>}>
                    <AICoach assessment={assessment} onClose={() => setShowCoach(false)} />
                  </React.Suspense>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setShowCoach(!showCoach)}
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-[0_20px_50px_rgba(16,185,129,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-tree-hover shrink-0 border border-emerald-400/20 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none",
              showCoach ? "bg-white text-slate-900 hover:bg-slate-100" : "bg-emerald-500 text-white hover:bg-emerald-400"
            )}
          >
            {showCoach ? <X size={20} className="md:w-6 md:h-6" /> : <MessageSquare size={20} className="md:w-6 md:h-6" />}
          </button>
        </div>
      )}

      {/* Informational Modals */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {activeModal === 'methodology' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">Calculation Methodology</h3>
                      <p className="text-xs text-slate-400">Transparent, science-backed carbon accounting</p>
                    </div>
                  </div>

                  <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    <p className="text-slate-500 dark:text-slate-400">
                      CarbonBuddy AI implements standard greenhouse gas (GHG) protocol standards to translate lifestyle metrics into CO2 equivalents.
                    </p>

                    <div className="space-y-4">
                      <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">🚗 Transportation</h4>
                        <p className="text-xs text-slate-500 mb-2">Distance scaled by vehicle fuel efficiency metrics.</p>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-slate-400">
                          <li>Gasoline: 0.19 kg CO2/km</li>
                          <li>Hybrid: 0.12 kg CO2/km</li>
                          <li>Electric: 0.05 kg CO2/km (grid baseline)</li>
                        </ul>
                      </div>

                      <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">⚡ Home Energy</h4>
                        <p className="text-xs text-slate-500 mb-2">Electricity consumption multiplied by local grid intensity factor.</p>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-slate-400">
                          <li>Grid Power: 0.40 kg CO2/kWh</li>
                          <li>Heating Baseline: Gas (2000kg/yr), Oil (2500kg/yr)</li>
                        </ul>
                      </div>

                      <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1">🥗 Food & Consumption</h4>
                        <p className="text-xs text-slate-500 mb-2">Calculations built on agricultural lifecycle database factors.</p>
                        <ul className="list-disc pl-4 text-xs space-y-1 text-slate-400">
                          <li>Meat-Heavy Diet: ~3,300 kg CO2/yr</li>
                          <li>Vegan Diet: ~1,500 kg CO2/yr</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 italic mt-6 border-t dark:border-slate-800 pt-4">
                      All calculations are aligned with guidelines from the IPCC Special Report on Climate Change and the World Wildlife Fund.
                    </p>
                  </div>
                </div>
              )}

              {activeModal === 'coach' && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white">AI Coach Index</h3>
                      <p className="text-xs text-slate-400">Climate engines trained for behavioral change</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: 'Lilo', specialty: 'Diet & Lifestyle', desc: 'Specializes in low-impact nutrition planning, circular shopping techniques, and daily habit modifications.', emoji: '🍃', active: true },
                      { name: 'Atlas', specialty: 'Home Energy & Auditing', desc: 'Guides you through smart grid optimization, heat pump transitions, and residential efficiency audits.', emoji: '🏡', active: false },
                      { name: 'Marina', specialty: 'Transit & Travel', desc: 'Expert in sustainable travel logistics, multi-modal urban transit plans, and corporate offsets.', emoji: '✈️', active: false }
                    ].map((coach) => (
                      <div key={coach.name} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl flex gap-4 items-start">
                        <span className="text-3xl shrink-0">{coach.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">{coach.name} <span className="text-xs font-mono text-emerald-500 font-normal ml-2">@{coach.name.toLowerCase()}</span></h4>
                            {coach.active ? (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold rounded uppercase tracking-wider">Active</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-500/10 text-slate-400 text-[9px] font-bold rounded uppercase tracking-wider">Indexed</span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{coach.specialty}</p>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">{coach.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'impact' && (
                <div className="text-center py-4">
                  <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mx-auto mb-6">
                    <TrendingDown size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">Global Climate Impact</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Collective action makes a measurable dent. Here is our community status:</p>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                      <div className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">1.2M+</div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">kg CO2 Saved</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                      <div className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">42K+</div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Active Users</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-900">
                      <div className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">62K+</div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Trees Offset</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 font-medium">
                    Every priority action you activate contributes directly to these numbers. Thank you for doing your part!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
