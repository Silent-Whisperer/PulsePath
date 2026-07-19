/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    </div>
  );
}

export default function LegendOverlay() {
  return (
    <div className="absolute bottom-16 right-4 lg:bottom-6 lg:right-6 z-[1000] flex flex-col gap-2">
      <div className="bg-[#0a0a0b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl min-w-[120px]">
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 border-b border-white/5 pb-2">
          Legend
        </div>
        <div className="space-y-2.5">
          <LegendItem color="#ccff00" label="Open Gate" />
          <LegendItem color="#ef4444" label="Restricted" />
          <LegendItem color="#3b82f6" label="Current Pos" />
        </div>
      </div>
    </div>
  );
}
