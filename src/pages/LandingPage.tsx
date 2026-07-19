/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app-store';
import { ArrowRight, Globe, ShieldCheck, Accessibility, Zap, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function LandingPage() {
  const { setRole } = useAppStore();
  const navigate = useNavigate();

  const handleRoleSelect = (role: any) => {
    setRole(role);
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#ccff00] selection:text-black">
      {/* Visual Identity: Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-[#ccff00]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />

        {/* Animated Background Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/5 rounded-full animate-[spin_90s_linear_infinite_reverse]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1600px] border border-[#ccff00]/5 rounded-full animate-[spin_120s_linear_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
      </div>

      <nav className="relative z-10 flex items-center justify-between p-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ccff00] rounded-xl flex items-center justify-center">
            <div className="w-5 h-5 bg-black rounded-full" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">PULSEPATH</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#impact" className="hover:text-white transition-colors">
            Impact
          </a>
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5"
            onClick={() => navigate('/simulation')}
          >
            Enter Simulation
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-10 lg:pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-full text-[#ccff00] text-[10px] font-black tracking-[0.2em] uppercase">
              <Zap className="w-4 h-4" /> World Cup 2026: Official Flow Partner
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tight leading-[0.9] text-white">
              PULSE<span className="text-[#ccff00]">PATH</span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-400 max-w-lg leading-relaxed font-medium">
              The intelligent nervous system for the world's greatest stage. Navigate, contribute,
              and experience the game like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-[#ccff00] text-black hover:bg-[#d9ff33] rounded-2xl px-12 py-8 text-xl font-black uppercase tracking-tighter shadow-[0_0_50px_rgba(204,255,0,0.3)] transition-all hover:scale-105"
                onClick={() => handleRoleSelect('fan')}
              >
                Enter Stadium <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/10 hover:bg-white/5 rounded-2xl px-12 py-8 text-xl font-bold text-white transition-all"
                onClick={() => navigate('/simulation')}
              >
                Sim Center
              </Button>
            </div>

            <div className="mt-12 lg:mt-16 grid grid-cols-3 gap-4 lg:gap-8 border-t border-white/5 pt-8">
              <div>
                <div className="text-2xl lg:text-3xl font-bold">23%</div>
                <div className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Faster Entry
                </div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold">12m</div>
                <div className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Avg. Queue Save
                </div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold">100%</div>
                <div className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider mt-1">
                  Step-Free Access
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <RoleCard
              title="Fan"
              desc="Match journey, AI nav & assistant"
              icon={Globe}
              onClick={() => handleRoleSelect('fan')}
            />
            <RoleCard
              title="Operations"
              desc="Pulse command, heatmaps & AI copilot"
              icon={Activity}
              onClick={() => handleRoleSelect('operations')}
            />
            <RoleCard
              title="Volunteer"
              desc="Task hub & multilingual assistance"
              icon={ShieldCheck}
              onClick={() => handleRoleSelect('volunteer')}
            />
            <RoleCard
              title="Accessibility"
              desc="Inclusive navigation & support"
              icon={Accessibility}
              onClick={() => handleRoleSelect('accessibility')}
            />
          </motion.div>
        </div>
      </main>

      {/* Impact Link Fix */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 border-t border-white/5"
      >
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-bold tracking-tighter">The Intelligence Layer</h2>
          <button
            onClick={() => navigate('/fan/impact')}
            className="text-[#ccff00] text-sm font-bold uppercase tracking-widest hover:underline"
          >
            View Impact Report
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Feature
            title="Predictive Routing"
            desc="AI analyzes crowd density to guide you through the least congested gates and concourses."
          />
          <Feature
            title="Multilingual Copilot"
            desc="Instant assistance in 5 languages for directions, food, and stadium operations."
          />
          <Feature
            title="Sustainability Engine"
            desc="Real-time tracking of water station usage and carbon-efficient transit choices."
          />
        </div>
      </section>

      {/* Better Footer */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-20 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-2xl font-black tracking-tighter">
              PULSE<span className="text-[#ccff00]">PATH</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Pioneering the future of tournament operations and fan experience through real-time AI
              and crowd intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">
              Experience
            </h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <button
                  onClick={() => navigate('/fan')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Fan Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/fan/navigate')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Smart Navigation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/fan/impact')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Green Impact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">
              Operations
            </h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <button
                  onClick={() => navigate('/operations')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Control Command
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/operations/crowd')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Crowd Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/operations/alerts')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Incident Manager
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-400">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li>
                <button
                  onClick={() => navigate('/accessibility')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Accessibility Mode
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/volunteer')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Volunteer Hub
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/simulation')}
                  className="hover:text-[#ccff00] transition-colors"
                >
                  Sim Center
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
            © 2026 Global Football Federation • PulsePath AI System
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({ title, desc, icon: Icon, onClick }: any) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#ccff00]/50 transition-all text-left group"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-[#ccff00] group-hover:text-black transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-snug">{desc}</p>
    </motion.button>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div className="p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
      <div className="w-2 h-2 bg-[#ccff00] rounded-full mb-6" />
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
