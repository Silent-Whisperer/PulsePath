/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { askPulse } from '../lib/ai/client';
import StadiumMap from '../components/map/StadiumMap';
import { useSearchParams } from 'react-router-dom';
import { useSimulationStore } from '../store/simulation-store';
import {
  Search,
  Navigation,
  Clock,
  Accessibility,
  EyeOff,
  MapPin,
  ChevronRight,
  Info,
  Zap,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const ROUTE_PATHS: Record<string, [number, number][]> = {
  'Gate A': [
    [19.303, -99.151],
    [19.304, -99.151],
    [19.3045, -99.1505],
  ],
  'Gate C': [
    [19.303, -99.151],
    [19.302, -99.151],
    [19.3013, -99.1505],
  ],
  'Food Court East': [
    [19.303, -99.151],
    [19.3035, -99.1515],
  ],
  'Accessibility Hub': [
    [19.303, -99.151],
    [19.304, -99.1505],
  ],
  'Quiet Rooms': [
    [19.303, -99.151],
    [19.3025, -99.1505],
    [19.302, -99.15],
  ],
  'Mobility Hubs': [
    [19.303, -99.151],
    [19.3035, -99.151],
    [19.3045, -99.1505],
  ],
};

export default function FanNavigate() {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('dest');

  const [activeRoute, setActiveRoute] = useState<any>(null);
  const [filters, setFilters] = useState({
    stepFree: false,
    lowSensory: false,
    avoidCrowds: true,
  });

  const getCoordinates = (destination: string) => {
    const cleanDest =
      Object.keys(ROUTE_PATHS).find((key) => destination.startsWith(key)) || 'Gate C';
    const base = ROUTE_PATHS[cleanDest];
    if (filters.stepFree) {
      return base.map((coord) => [coord[0] + 0.0001, coord[1] - 0.0001] as [number, number]);
    }
    if (filters.lowSensory) {
      return base.map((coord) => [coord[0] - 0.0001, coord[1] + 0.0001] as [number, number]);
    }
    return base;
  };

  const getRouteColor = () => {
    if (filters.lowSensory) return '#10b981'; // emerald green
    if (filters.stepFree) return '#3b82f6'; // blue
    return '#ccff00'; // lime yellow
  };

  const handlePlanRoute = async (destLabel?: string) => {
    const destination = destLabel || 'Gate C (South)';
    setActiveRoute({
      destination,
      duration: 'Calculating...',
      distance: '...',
      congestion: 'Analyzing...',
      reason: 'Pulse AI is analyzing real-time crowd dynamics...',
    });

    try {
      const simStore = useSimulationStore.getState();
      const context = {
        gates: simStore.gates.map((g) => ({
          name: g.name,
          waitTime: g.currentQueueTime,
          status: g.status,
        })),
        zones: simStore.zones.map((z) => ({
          name: z.name,
          density: z.currentDensity,
          risk: z.riskLevel,
        })),
        incidents: simStore.incidents
          .filter((i) => i.status !== 'resolved')
          .map((i) => ({ title: i.title, description: i.description, severity: i.severity })),
        transit: simStore.transit.map((t) => ({
          name: t.name,
          status: t.status,
          frequency: t.frequency,
        })),
      };

      const response = await askPulse(
        `Plan a route to ${destination}. Tell me the duration, distance, and why this route is best based on current stadium congestion. Format as a short paragraph.`,
        'fan',
        'en',
        context
      );

      setActiveRoute({
        destination,
        duration: destination.includes('Gate C') ? '8 mins' : '12 mins',
        distance: destination.includes('Gate C') ? '450m' : '620m',
        congestion: destination.includes('Gate C') ? 'Low' : 'High',
        reason: response,
      });
    } catch {
      setActiveRoute({
        destination,
        duration: '8 mins',
        distance: '450m',
        congestion: 'Low',
        reason:
          'Gate C is currently 41% less congested than Gate A. Rerouting via Zone 3 avoids the main concourse surge.',
      });
    }
  };

  useEffect(() => {
    if (destParam) {
      handlePlanRoute(destParam);
    }
  }, [destParam]);

  return (
    <div className="grid lg:grid-cols-[1fr_400px] gap-8 min-h-full">
      {/* Map Section */}
      <div className="relative bg-white/5 border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] lg:h-[calc(100vh-12rem)]">
        <StadiumMap
          showHeatmap={filters.avoidCrowds}
          routeCoordinates={activeRoute ? getCoordinates(activeRoute.destination) : undefined}
          routeColor={getRouteColor()}
        />

        {/* Floating Search */}
        <div className="absolute top-4 left-4 right-4 lg:top-6 lg:left-6 z-[1000] lg:w-full lg:max-w-sm">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#ccff00] transition-colors" />
            <input
              type="text"
              placeholder="Find Gate, Food, or Seats..."
              className="w-full bg-[#0a0a0b]/90 backdrop-blur-xl border border-white/10 rounded-xl lg:rounded-2xl py-3 lg:py-4 pl-12 pr-6 focus:outline-none focus:border-[#ccff00] shadow-2xl text-sm lg:text-base"
            />
          </div>
        </div>

        {/* Map Actions Overlay */}
        <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 z-[1000] flex flex-wrap gap-2 lg:gap-3">
          <FilterButton
            active={filters.stepFree}
            onClick={() => setFilters((s) => ({ ...s, stepFree: !s.stepFree }))}
            icon={Accessibility}
            label="Step-Free"
          />
          <FilterButton
            active={filters.lowSensory}
            onClick={() => setFilters((s) => ({ ...s, lowSensory: !s.lowSensory }))}
            icon={EyeOff}
            label="Quiet Route"
          />
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="flex flex-col gap-6 overflow-y-auto pr-2">
        {!activeRoute ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8"
          >
            <h3 className="text-2xl font-bold mb-2">Where to?</h3>
            <p className="text-gray-500 text-sm mb-8">
              Select a destination to generate an AI-optimized route.
            </p>

            <div className="space-y-4">
              <QuickDest
                label="Gate A (Assigned)"
                time="12m"
                density="High"
                onClick={() => handlePlanRoute('Gate A (Assigned)')}
              />
              <QuickDest
                label="Gate C (Recommended)"
                time="8m"
                density="Low"
                recommended
                onClick={() => handlePlanRoute('Gate C (Recommended)')}
              />
              <QuickDest
                label="Food Court East"
                time="5m"
                density="Med"
                onClick={() => handlePlanRoute('Food Court East')}
              />
              <QuickDest
                label="Accessibility Hub"
                time="3m"
                density="Low"
                onClick={() => handlePlanRoute('Accessibility Hub')}
              />
            </div>

            <Button
              className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white rounded-2xl py-6 font-bold"
              onClick={handlePlanRoute}
            >
              Custom Route Planner
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Route Summary */}
            <div className="bg-[#ccff00] text-black rounded-3xl p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-60">
                    AI Route Active
                  </div>
                  <h3 className="text-2xl font-bold">To {activeRoute.destination}</h3>
                </div>
                <Navigation className="w-8 h-8" />
              </div>

              <div className="flex gap-8 mb-8 border-t border-black/10 pt-6">
                <div>
                  <div className="text-xs font-bold uppercase opacity-60">Time</div>
                  <div className="text-2xl font-bold">{activeRoute.duration}</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase opacity-60">Distance</div>
                  <div className="text-2xl font-bold">{activeRoute.distance}</div>
                </div>
              </div>

              <div className="bg-black/5 rounded-2xl p-4 flex gap-3">
                <Info className="w-5 h-5 shrink-0" />
                <p className="text-xs font-medium leading-relaxed">{activeRoute.reason}</p>
              </div>
            </div>

            {/* Turn by Turn (Mock) */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">
                Navigation Steps
              </div>
              <Step icon={MapPin} text="Exit Section 114 via Stairwell 4" time="Now" />
              <Step icon={ChevronRight} text="Turn left onto Concourse Level 2" time="2 min" />
              <Step icon={Zap} text="Pass through Zone 3 (Low Density)" time="5 min" />
              <Step icon={MapPin} text="Arrive at Gate C" time="8 min" highlight />
            </div>

            <Button
              className="w-full bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-2xl py-6"
              onClick={() => setActiveRoute(null)}
            >
              Cancel Navigation
            </Button>
          </motion.div>
        )}

        {/* Live Conditions Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Live Analysis
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            PULSEPATH is monitoring real-time flow through Gates A-D. Heavy congestion detected in
            North Concourse due to pre-match security screening.
          </p>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all text-xs font-bold uppercase tracking-wider',
        active
          ? 'bg-[#ccff00] text-black border-[#ccff00]'
          : 'bg-[#0a0a0b]/80 backdrop-blur-md text-white border-white/10 hover:border-white/30'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function QuickDest({ label, time, density, recommended, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center justify-between p-4 lg:p-5 rounded-2xl border transition-all text-left group',
        recommended
          ? 'bg-[#ccff00]/10 border-[#ccff00]/30 hover:border-[#ccff00]/60 shadow-[0_0_20px_rgba(204,255,0,0.05)]'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      )}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="font-bold text-sm lg:text-base">{label}</div>
          {recommended && (
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#ccff00] text-[9px] font-black text-black uppercase tracking-tighter">
              Best
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> {time}
          </span>
          <span className="flex items-center gap-1.5">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                density === 'Low'
                  ? 'bg-[#ccff00]'
                  : density === 'Med'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              )}
            />
            {density} Density
          </span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-all transform group-hover:translate-x-1" />
    </button>
  );
}

function Step({ icon: Icon, text, time, highlight }: any) {
  return (
    <div className="flex items-start gap-4 p-2">
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          highlight ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-gray-500'
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className={cn('text-sm font-medium', highlight ? 'text-[#ccff00]' : 'text-white')}>
          {text}
        </div>
        <div className="text-[10px] text-gray-500 font-bold uppercase mt-0.5">{time}</div>
      </div>
    </div>
  );
}
