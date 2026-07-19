/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSimulationStore } from '../store/simulation-store';
import { SCENARIOS } from '../data/scenarios';
import {
  Play,
  Pause,
  RotateCcw,
  CloudRain,
  Sun,
  Bus,
  ShieldAlert,
  Zap,
  Users,
  Timer,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function SimulationCenter() {
  const { state, setScenario, updateState, tick, resetStore } = useSimulationStore();

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter">Simulation Center</h1>
          <p className="text-gray-500 mt-2">
            Test PULSEPATH response to various match-day scenarios.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => updateState({ isPaused: !state.isPaused })}
            className={cn('rounded-xl', !state.isPaused ? 'text-[#ccff00]' : 'text-gray-400')}
          >
            {state.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => tick()}>
            <Timer className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => resetStore()}>
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-12">
        <div className="space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">
            Select Scenario
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setScenario(scenario.id)}
                className={cn(
                  'p-6 rounded-[2rem] border text-left transition-all group',
                  state.scenario === scenario.id
                    ? 'bg-[#ccff00]/10 border-[#ccff00] shadow-[0_0_30px_rgba(204,255,0,0.1)]'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      state.scenario === scenario.id
                        ? 'bg-[#ccff00] text-black'
                        : 'bg-white/5 text-gray-400'
                    )}
                  >
                    {getScenarioIcon(scenario.id)}
                  </div>
                  {state.scenario === scenario.id && (
                    <div className="text-[10px] font-black uppercase text-[#ccff00] px-2 py-0.5 border border-[#ccff00]/50 rounded">
                      Active
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{scenario.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{scenario.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-500">
            Environment Controls
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8">
            <SimulationSlider
              label="Global Crowd Level"
              value={state.globalDensity}
              icon={Users}
              onChange={(v: number) => updateState({ globalDensity: v })}
            />
            <SimulationSlider
              label="Transit Reliability"
              value={state.transitReliability}
              icon={Bus}
              onChange={(v: number) => updateState({ transitReliability: v })}
            />
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Sun className="w-3 h-3" /> Weather Condition
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['sunny', 'rainy', 'windy', 'stormy'].map((cond) => (
                  <button
                    key={cond}
                    onClick={() =>
                      updateState({ weather: { ...state.weather, condition: cond as any } })
                    }
                    className={cn(
                      'py-2 rounded-xl text-xs font-bold capitalize border transition-all',
                      state.weather.condition === cond
                        ? 'bg-white text-black border-white'
                        : 'bg-black/40 text-gray-500 border-white/5 hover:border-white/20'
                    )}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 text-xs font-bold text-[#ccff00] bg-[#ccff00]/5 p-4 rounded-2xl border border-[#ccff00]/10">
                <Zap className="w-4 h-4" />
                <span>Simulation automatically triggers AI Copilot recommendations.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getScenarioIcon(id: string) {
  switch (id) {
    case 'normal-arrival':
      return <Users className="w-5 h-5" />;
    case 'heavy-rain':
      return <CloudRain className="w-5 h-5" />;
    case 'transit-delay':
      return <Bus className="w-5 h-5" />;
    case 'gate-closure':
      return <ShieldAlert className="w-5 h-5" />;
    case 'exit-surge':
      return <Timer className="w-5 h-5" />;
    default:
      return <Zap className="w-5 h-5" />;
  }
}

function SimulationSlider({ label, value, icon: Icon, onChange }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <Icon className="w-3 h-3" /> {label}
        </label>
        <span className="text-xs font-bold text-white">{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#ccff00]"
      />
    </div>
  );
}
