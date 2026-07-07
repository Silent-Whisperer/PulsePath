/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUserStore } from '../store/user-store';
import { useAppStore } from '../store/app-store';
import { askPulse } from '../lib/ai/client';
import { Send, User, BrainCircuit, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export default function FanAssistant() {
  const { chatHistory, addMessage } = useUserStore();
  const { role, language } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date().toISOString()
    };

    addMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askPulse(input, role, language);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date().toISOString()
      };
      addMessage(aiMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Where is the least crowded restroom?",
    "Guide me to my seat (Section 114).",
    "Find vegetarian food near me.",
    "Which shuttle should I take after the match?",
    "I need a quiet route."
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">ASK <span className="text-[#ccff00]">PULSE</span></h2>
          <p className="text-sm md:text-base text-gray-500 font-medium">The stadium's intelligent nervous system co-pilot</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto px-5 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-full text-xs font-black text-[#ccff00] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(204,255,0,0.1)] animate-ai-pulse">
          <Sparkles className="w-4 h-4" /> Live AI Engine
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col mb-4 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[80%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' ? "bg-white/5 border-white/10" : "bg-[#ccff00]/10 border-[#ccff00]/20"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5 text-[#ccff00]" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-white/10 text-white rounded-tr-none" 
                  : "bg-[#0a0a0b] border border-white/5 text-gray-300 rounded-tl-none"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-[#ccff00] animate-pulse" />
              </div>
              <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Suggestions */}
        {chatHistory.length < 3 && (
          <div className="p-4 bg-black/40 border-t border-white/5 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:border-[#ccff00]/30 transition-all whitespace-nowrap flex items-center gap-2"
                >
                  {s} <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-[#0a0a0b]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask Pulse in ${language.toUpperCase()}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 p-3 rounded-xl bg-[#ccff00] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9ff33] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-gray-600 text-center uppercase tracking-widest font-bold">
            Pulse AI may produce inaccurate stadium data. Verify with venue staff.
          </div>
        </div>
      </div>
    </div>
  );
}
