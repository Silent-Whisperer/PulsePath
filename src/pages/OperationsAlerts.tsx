/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useSimulationStore } from '../store/simulation-store';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  User, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  MessageSquare,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function OperationsAlerts() {
  const { incidents, resolveIncident } = useSimulationStore();
  const [selectedId, setSelectedId] = useState<string | null>(incidents[0]?.id || null);

  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');
  const selected = incidents.find(i => i.id === selectedId);

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-8 h-[calc(100vh-12rem)]">
      {/* Alert List */}
      <div className="flex flex-col gap-6 overflow-hidden">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search incidents..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2">Active ({activeIncidents.length})</div>
          {activeIncidents.map(incident => (
            <AlertItem 
              key={incident.id} 
              incident={incident} 
              active={selectedId === incident.id} 
              onClick={() => setSelectedId(incident.id)}
            />
          ))}

          {resolvedIncidents.length > 0 && (
            <>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 pt-4">Recently Resolved</div>
              {resolvedIncidents.map(incident => (
                <AlertItem 
                  key={incident.id} 
                  incident={incident} 
                  active={selectedId === incident.id} 
                  onClick={() => setSelectedId(incident.id)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Incident Detail */}
      <div className="bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div 
              key={selected.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Detail Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-black uppercase",
                      selected.severity === 'critical' ? "bg-red-500" : "bg-amber-500"
                    )}>
                      {selected.severity}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">#{selected.id} • {selected.type}</span>
                  </div>
                  <h2 className="text-3xl font-bold">{selected.title}</h2>
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#ccff00]" /> {selected.zoneId}</div>
                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> Detected {selected.timestamp.split('T')[1].slice(0, 5)}</div>
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /> Unassigned</div>
                  </div>
                </div>
                
                {selected.status !== 'resolved' && (
                  <Button 
                    className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl px-6"
                    onClick={() => resolveIncident(selected.id)}
                  >
                    Mark Resolved <CheckCircle2 className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Detail Body */}
              <div className="flex-1 grid md:grid-cols-[1fr_350px] overflow-hidden">
                <div className="p-8 overflow-y-auto space-y-8">
                  <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Situation Analysis</h3>
                    <p className="text-lg leading-relaxed text-gray-300">
                      {selected.description}
                    </p>
                  </section>

                  <section className="bg-black/20 rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-[#ccff00] flex items-center justify-center">
                        <ShieldAlert className="w-4 h-4 text-black" />
                      </div>
                      <h3 className="font-bold text-[#ccff00] uppercase tracking-tighter text-sm">AI Response Plan</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                        <p className="text-sm text-gray-400">Dispatch nearest volunteer (currently 40m away) to evaluate crowd pressure.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                        <p className="text-sm text-gray-400">Update digital signage in South Concourse to divert flow to Gate C.</p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                        <p className="text-sm text-gray-400">Broadcast multilingual audio alert in Zone 4 (Spanish/English).</p>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="border-l border-white/5 bg-white/[0.02] p-8 space-y-8">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Incident Actions</h3>
                  <div className="space-y-3">
                    <ActionRow icon={MessageSquare} label="Broadcast Alert" />
                    <ActionRow icon={Send} label="Dispatch Team" />
                    <ActionRow icon={AlertTriangle} label="Escalate to Supervisor" />
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Nearby Resources</h3>
                    <div className="space-y-4">
                      <Resource name="Vol_42 (Javier)" dist="2 min" status="Available" />
                      <Resource name="Med_09 (Elena)" dist="5 min" status="Active" />
                      <Resource name="Sec_12 (North)" dist="4 min" status="Available" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <ShieldAlert className="w-20 h-20 mb-6 opacity-10" />
              <p className="text-xl">Select an incident to view details.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AlertItem({ incident, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-5 rounded-2xl border text-left transition-all group",
        active 
          ? "bg-[#ccff00]/10 border-[#ccff00]/30 shadow-[0_0_20px_rgba(204,255,0,0.05)]" 
          : "bg-white/5 border-white/10 hover:bg-white/10",
        incident.status === 'resolved' && "opacity-50 grayscale"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={cn(
          "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
          incident.severity === 'critical' ? "bg-red-500 text-white" : "bg-amber-500 text-white"
        )}>
          {incident.severity}
        </span>
        <span className="text-[10px] text-gray-600 font-bold">{incident.timestamp.split('T')[1].slice(0, 5)}</span>
      </div>
      <h4 className={cn("font-bold text-sm mb-1", active ? "text-[#ccff00]" : "text-white")}>{incident.title}</h4>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{incident.zoneId}</span>
        {active && <ChevronRight className="w-4 h-4 text-[#ccff00]" />}
      </div>
    </button>
  );
}

function ActionRow({ icon: Icon, label }: any) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-[#ccff00] hover:text-black transition-all group">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100" />
    </button>
  );
}

function Resource({ name, dist, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-black/20 border border-white/5">
      <div>
        <div className="text-xs font-bold">{name}</div>
        <div className="text-[10px] text-gray-500">{dist} away</div>
      </div>
      <div className={cn(
        "px-2 py-0.5 rounded text-[8px] font-bold uppercase",
        status === 'Available' ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
      )}>
        {status}
      </div>
    </div>
  );
}
