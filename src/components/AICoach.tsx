import React, { useState, useRef, useEffect } from 'react';
import { Message, AssessmentData } from '../types';
import { Send, User, Bot, Sparkles, X, Lightbulb, TrendingDown, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  assessment: AssessmentData;
  onClose?: () => void;
}

export default function AICoach({ assessment, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "📊 Diagnostic complete. I've analyzed your consumption deltas. \n\nWhere should we focus our strategy first? I can help with targeted reductions or lifestyle shifts." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const text = (customInput || input).trim();
    if (!text || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: text } as Message];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, assessment })
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      if (!data.text) throw new Error("Invalid response content");
      setMessages([...newMessages, { role: 'assistant', content: data.text }]);
    } catch (error) {
      console.warn("Using simulated coach response fallback:", error);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing delay
      
      const userMessage = text.toLowerCase();
      let reply = "";
      
      if (userMessage.includes('diet') || userMessage.includes('food') || userMessage.includes('eat') || userMessage.includes('meat') || userMessage.includes('vegan')) {
        reply = "🥗 Dietary shifts are extremely powerful. Red meat (beef and lamb) is particularly carbon-intensive. Committing to plant-first weekdays can reduce your food footprint by up to 40%! Would you like some recipe ideas or local sourcing tips?";
      } else if (userMessage.includes('energy') || userMessage.includes('power') || userMessage.includes('electricity') || userMessage.includes('heat') || userMessage.includes('utility')) {
        reply = "⚡ Home energy is a major lever. The greenest utility provider switch takes just 10 minutes and instantly offsets all electricity use. Pairing that with smart thermostats will yield compounding savings!";
      } else if (userMessage.includes('travel') || userMessage.includes('flight') || userMessage.includes('car') || userMessage.includes('drive') || userMessage.includes('transit')) {
        reply = "🚗 Transportation and air travel often dominate personal footprints. Swapping short car trips for micro-mobility (like e-bikes) or replacing one long flight with a train itinerary makes a massive, immediate dent.";
      } else {
        reply = "🌱 I've analyzed your deltas and suggest prioritizing the 'Green Utility Switch' and 'Plant-First weekdays' shifts. They represent the highest yield and lowest friction actions on your profile. Which one shall we look at first?";
      }
      
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Refine Diet", icon: Leaf },
    { label: "Lower Energy", icon: Lightbulb },
    { label: "Travel Strategy", icon: TrendingDown },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800/85">
      <div className="p-5 md:p-6 bg-slate-950 text-white flex justify-between items-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Sparkles size={20} className="text-emerald-400 md:w-6 md:h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm md:text-base font-display">Lilo AI Coach</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest font-bold">Climate Engine Active</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 md:p-3 hover:bg-white/10 rounded-xl transition-all relative z-10">
            <X size={18} className="md:w-5 md:h-5" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "max-w-[85%] md:max-w-[90%] p-4 md:p-5 rounded-[1.25rem] md:rounded-[1.5rem] flex flex-col gap-1 md:gap-2 text-sm md:text-base",
              m.role === 'user' 
                ? "bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 ml-auto rounded-tr-none shadow-lg" 
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 mr-auto border border-slate-100 dark:border-slate-800 rounded-tl-none shadow-sm"
            )}
          >
            {m.role === 'assistant' && (
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-0.5">Coach Insight</span>
            )}
            <div className="leading-relaxed whitespace-pre-wrap font-medium text-xs md:text-sm">
              {m.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-2 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-24 shadow-sm">
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 md:p-6 space-y-3 md:space-y-4 shrink-0">
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-1">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleSend(action.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400 text-slate-500 dark:text-slate-400 rounded-full text-[10px] md:text-xs font-bold border border-slate-100 dark:border-slate-800 transition-all active:scale-95"
              >
                <action.icon size={12} className="md:w-3.5 md:h-3.5" />
                {action.label}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex gap-2 md:gap-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Lower my emissions..."
            className="flex-1 bg-slate-50 dark:bg-slate-950 border-none rounded-xl md:rounded-2xl px-4 py-3 md:px-5 md:py-4 text-xs md:text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-100 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-12 h-12 md:w-14 md:h-14 bg-slate-950 dark:bg-slate-100 text-emerald-400 dark:text-slate-900 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 transition-all shadow-xl active:scale-95 shrink-0"
          >
            <Send size={20} className="md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
