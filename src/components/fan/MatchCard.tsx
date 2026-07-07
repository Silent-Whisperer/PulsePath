/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Ticket, MapPin, Clock } from 'lucide-react';

interface MatchCardProps {
  match: string;
  gate: string;
  section: string;
  row: string;
  seat: string;
  countdown: string;
}

export default function MatchCard({ match, gate, section, row, seat, countdown }: MatchCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-indigo-900/40 to-[#0a0a0b] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8">
        <div className="text-right">
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-1">Kickoff In</div>
          <div className="text-4xl font-bold text-[#ccff00] tabular-nums">{countdown}</div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold mb-6">
          <Ticket className="w-3 h-3 text-[#ccff00]" /> Digital Pass Valid
        </div>
        
        <h2 className="text-3xl font-bold mb-8 max-w-[200px] leading-tight">{match}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-white/5 pt-8">
          <Detail label="Gate" value={gate} />
          <Detail label="Section" value={section} />
          <Detail label="Row" value={row} />
          <Detail label="Seat" value={seat} />
        </div>
      </div>

      {/* Decorative stadium field lines */}
      <div className="absolute bottom-0 right-0 w-64 h-64 border border-white/5 rounded-full -mb-32 -mr-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 border border-white/5 rounded-full -mb-48 -mr-48" />
    </motion.div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
