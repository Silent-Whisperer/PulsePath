/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useAppStore } from '../store/app-store';
import { 
  Accessibility, 
  MapPin, 
  Eye, 
  Volume2, 
  ChevronRight, 
  Info, 
  Heart,
  ShieldCheck,
  Zap,
  Ear,
  ScanEye
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function AccessibilityExperience() {
  const { 
    isHighContrast, 
    toggleHighContrast, 
    isReducedMotion, 
    toggleReducedMotion, 
    fontSize, 
    setFontSize 
  } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-500 uppercase tracking-widest">
          <Accessibility className="w-4 h-4" /> Inclusive Design Mode
        </div>
        <h1 className="text-5xl font-bold tracking-tighter">Accessibility Settings</h1>
        <p className="text-gray-500 text-lg">
          PULSEPATH adapts to your sensory and mobility needs to ensure a safe, comfortable match-day.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Visual Settings */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ScanEye className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold">Visual & Display</h2>
          </div>

          <div className="space-y-6">
            <ControlToggle 
              label="High Contrast Mode" 
              desc="Increased contrast for text and interface elements."
              active={isHighContrast}
              onClick={toggleHighContrast}
            />
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 uppercase">Text Size</label>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/5" role="group" aria-label="Text Size Selection">
                {['normal', 'large', 'extra-large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size as any)}
                    aria-pressed={fontSize === size}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      fontSize === size ? "bg-white text-black" : "text-gray-500 hover:text-white"
                    )}
                  >
                    {size.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sensory Settings */}
        <section className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Ear className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold">Sensory & Sound</h2>
          </div>

          <div className="space-y-6">
            <ControlToggle 
              label="Quiet Route Planning" 
              desc="Prioritize routes that avoid high-decibel areas."
              active={true}
              onClick={() => {}}
            />
            <ControlToggle 
              label="Reduced Motion" 
              desc="Minimize animations and parallax effects."
              active={isReducedMotion}
              onClick={toggleReducedMotion}
            />
          </div>
        </section>
      </div>

      {/* Facilities & Support */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">On-Site Assistance</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <FacilityCard 
            icon={MapPin} 
            title="Quiet Rooms" 
            desc="4 sensory-friendly spaces available in Zones 1, 4, 9, 12."
          />
          <FacilityCard 
            icon={Zap} 
            title="Mobility Hubs" 
            desc="Powerchair charging and equipment assistance."
          />
          <FacilityCard 
            icon={ShieldCheck} 
            title="Companion Access" 
            desc="Verify companion credentials for prioritized entry."
          />
        </div>
      </div>

      {/* Emergency Assistance Button */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-[2.5rem] p-10 flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
          <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-red-500">Need Immediate Support?</h3>
          <p className="text-gray-400 max-w-md mx-auto mt-2">
            Clicking this button will alert the nearest Accessibility Steward and medical team to your exact location.
          </p>
        </div>
        <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-12 py-8 text-xl font-black uppercase tracking-tighter">
          Call For Assistance
        </Button>
      </div>
    </div>
  );
}

function ControlToggle({ label, desc, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      role="switch"
      aria-checked={active}
      className="w-full flex items-center justify-between text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-2 -m-2"
    >
      <div className="max-w-[80%]">
        <div className="font-bold group-hover:text-white transition-colors">{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <div className={cn(
        "w-12 h-6 rounded-full relative transition-colors shrink-0",
        active ? "bg-blue-500" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
          active ? "right-1" : "left-1"
        )} />
      </div>
    </button>
  );
}

function FacilityCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-all cursor-pointer">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6">
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
      <Button variant="link" className="p-0 h-auto text-blue-500 text-xs font-bold mt-4 uppercase tracking-widest">
        Show on Map <ChevronRight className="ml-1 w-3 h-3" />
      </Button>
    </div>
  );
}



