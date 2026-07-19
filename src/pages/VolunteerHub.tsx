/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

import { Users, MapPin, Zap, Globe, HelpCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function VolunteerHub() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'phrases'>('tasks');

  const tasks = [
    {
      id: 't1',
      title: 'Assist Wheelchair User',
      loc: 'Gate C',
      time: '5m ago',
      priority: 'high',
      type: 'assistance',
    },
    {
      id: 't2',
      title: 'Guide Fans to Alt Restroom',
      loc: 'Zone 4',
      time: '12m ago',
      priority: 'medium',
      type: 'operations',
    },
    {
      id: 't3',
      title: 'Water Station Refill Confirmation',
      loc: 'Sec 112',
      time: '20m ago',
      priority: 'low',
      type: 'safety',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      {/* Volunteer Profile Header */}
      <div className="bg-gradient-to-br from-[#ccff00]/20 to-transparent border border-[#ccff00]/20 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative shrink-0">
            <User className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
            <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 w-5 h-5 lg:w-6 lg:h-6 bg-[#ccff00] rounded-full border-2 lg:border-4 border-[#0a0a0b] flex items-center justify-center">
              <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-black rounded-full" />
            </div>
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold">Volunteer #4206</h2>
            <div className="flex items-center gap-2 lg:gap-3 text-xs lg:text-sm text-gray-400 mt-1">
              <span className="text-[#ccff00] font-bold">Zone 4 Active</span>
              <span>•</span>
              <span>Shift: 14:00 - 20:00</span>
            </div>
          </div>
        </div>
        <div className="text-center sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
          <div className="text-2xl lg:text-3xl font-black tracking-tighter">850</div>
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Karma Points
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
        <button
          onClick={() => setActiveTab('tasks')}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-bold transition-all',
            activeTab === 'tasks'
              ? 'bg-[#ccff00] text-black shadow-lg'
              : 'text-gray-500 hover:text-white'
          )}
        >
          Active Tasks
        </button>
        <button
          onClick={() => setActiveTab('phrases')}
          className={cn(
            'flex-1 py-3 rounded-xl text-sm font-bold transition-all',
            activeTab === 'phrases'
              ? 'bg-[#ccff00] text-black shadow-lg'
              : 'text-gray-500 hover:text-white'
          )}
        >
          Multilingual Helper
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {activeTab === 'tasks' ? (
          <>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}

            {/* Quick Assistance Request */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 border-dashed">
              <div className="flex items-center gap-4 text-gray-500">
                <HelpCircle className="w-8 h-8 opacity-20" />
                <div>
                  <div className="font-bold">Need Help?</div>
                  <p className="text-xs">Request supervisor support or medical backup.</p>
                </div>
                <Button variant="outline" className="ml-auto border-white/10 rounded-xl">
                  Request
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <PhraseCard
              phrase="Where is the nearest exit?"
              translations={{
                es: '¿Dónde está la salida más cercana?',
                fr: 'Où est la sortie la plus proche?',
              }}
            />
            <PhraseCard
              phrase="I need medical assistance."
              translations={{ es: 'Necesito asistencia médica.', ar: 'أحتاج إلى مساعدة طبية' }}
            />
            <PhraseCard
              phrase="Follow me to the accessible gate."
              translations={{
                es: 'Sígame a la puerta accesible.',
                hi: 'सुलभ गेट के लिए मेरा अनुसरण करें',
              }}
            />
            <PhraseCard
              phrase="The match starts in 10 minutes."
              translations={{
                es: 'El partido comienza en 10 minutos.',
                fr: 'Le match commence dans 10 minutes.',
              }}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}

function TaskCard({ task }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-[#ccff00]/30 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center',
              task.priority === 'high'
                ? 'bg-red-500/10 text-red-500'
                : 'bg-blue-500/10 text-blue-500'
            )}
          >
            {task.type === 'assistance' ? (
              <Users className="w-5 h-5" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="font-bold">{task.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3 h-3 text-[#ccff00]" /> {task.loc}
            </div>
          </div>
        </div>
        <div className="text-[10px] font-bold text-gray-600 uppercase">{task.time}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl py-4 lg:py-5 font-bold text-sm">
          View Location
        </Button>
        <Button className="flex-1 bg-[#ccff00] text-black hover:bg-[#d9ff33] rounded-xl py-4 lg:py-5 font-bold text-sm">
          Accept Task
        </Button>
      </div>
    </div>
  );
}

function PhraseCard({ phrase, translations }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">English</div>
      <div className="text-lg font-bold mb-6">{phrase}</div>

      <div className="space-y-4 pt-4 border-t border-white/5">
        {Object.entries(translations).map(([lang, text]: any) => (
          <div key={lang}>
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-3 h-3 text-[#ccff00]" />
              <span className="text-[10px] font-black uppercase text-gray-600">{lang}</span>
            </div>
            <div className="text-sm text-gray-300 font-medium italic">"{text}"</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function User(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
