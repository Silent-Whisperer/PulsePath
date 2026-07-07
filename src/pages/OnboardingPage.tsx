/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/app-store';
import { Check, ArrowRight, User, Languages, Accessibility, Ticket } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { role, language, setLanguage, setRole } = useAppStore();
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, title: 'Identity', icon: User },
    { id: 2, title: 'Language', icon: Languages },
    { id: 3, title: 'Accessibility', icon: Accessibility },
    { id: 4, title: 'Match Day', icon: Ticket },
  ];

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else navigate(role === 'fan' ? '/fan' : role === 'operations' ? '/operations' : '/volunteer');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Dots */}
        <div className="flex justify-center gap-4 mb-12">
          {steps.map((s) => (
            <div 
              key={s.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= s.id ? 'w-8 bg-[#ccff00]' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white/5 border border-white/10 rounded-[2rem] p-8 lg:p-12"
        >
          {step === 1 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Who are you today?</h2>
              <p className="text-gray-400 mb-8">PULSEPATH adapts to your mission.</p>
              <div className="grid grid-cols-1 gap-4">
                <Option 
                  active={role === 'fan'} 
                  onClick={() => setRole('fan')} 
                  label="Match Day Fan" 
                  desc="I'm here to enjoy the game."
                />
                <Option 
                  active={role === 'operations'} 
                  onClick={() => setRole('operations')} 
                  label="Venue Operations" 
                  desc="I'm managing the stadium flow."
                />
                <Option 
                  active={role === 'volunteer'} 
                  onClick={() => setRole('volunteer')} 
                  label="Official Volunteer" 
                  desc="I'm helping fans navigate safely."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Choose Language</h2>
              <p className="text-gray-400 mb-8">Real-time translation for your entire journey.</p>
              <div className="grid grid-cols-2 gap-4">
                {['en', 'es', 'fr', 'hi', 'ar'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l as any)}
                    className={`p-4 rounded-2xl border transition-all ${
                      language === l ? 'bg-[#ccff00] text-black border-[#ccff00]' : 'bg-white/5 border-white/10 text-white'
                    }`}
                  >
                    <span className="text-xl font-bold uppercase">{l}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Accessibility First</h2>
              <p className="text-gray-400 mb-8">Tailor PULSEPATH to your specific needs.</p>
              <div className="space-y-4 text-left">
                <Toggle label="Step-free navigation" desc="Avoid stairs and use elevators/ramps." />
                <Toggle label="Low-sensory routing" desc="Avoid the loudest and most crowded corridors." />
                <Toggle label="High contrast mode" desc="Optimized for better visual clarity." />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Match Day Setup</h2>
              <p className="text-gray-400 mb-8">Confirming your fixture details.</p>
              <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left border border-white/10">
                <div className="text-xs text-[#ccff00] font-bold uppercase mb-2">Selected Match</div>
                <div className="text-xl font-bold mb-4">Mexico City vs Toronto</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Venue</div>
                    <div className="text-sm font-medium">Estadio Azteca</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Kickoff</div>
                    <div className="text-sm font-medium">19:00 Local</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 italic">"PULSEPATH is now syncing with live stadium sensors..."</p>
            </div>
          )}

          <div className="mt-12">
            <Button 
              className="w-full bg-[#ccff00] text-black hover:bg-[#d9ff33] rounded-2xl py-6 text-lg font-bold"
              onClick={nextStep}
            >
              {step === 4 ? 'Enter Pulse' : 'Continue'} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Option({ active, onClick, label, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-6 rounded-2xl border text-left transition-all relative ${
        active ? 'bg-[#ccff00]/10 border-[#ccff00]' : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="font-bold text-lg">{label}</div>
      <div className="text-sm text-gray-500">{desc}</div>
      {active && <div className="absolute top-4 right-4 text-[#ccff00]"><Check className="w-5 h-5" /></div>}
    </button>
  );
}

function Toggle({ label, desc }: any) {
  const [enabled, setEnabled] = useState(false);
  return (
    <button 
      onClick={() => setEnabled(!enabled)}
      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
    >
      <div>
        <div className="font-bold">{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <div className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-[#ccff00]' : 'bg-gray-800'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'right-1' : 'left-1'}`} />
      </div>
    </button>
  );
}
