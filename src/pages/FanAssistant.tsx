/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useUserStore } from '../store/user-store';
import { useAppStore } from '../store/app-store';
import { useSimulationStore } from '../store/simulation-store';
import { askPulse } from '../lib/ai/client';
import { Send, User, BrainCircuit, Sparkles, ChevronRight } from 'lucide-react';

import { cn } from '../lib/utils';

const UI_TRANSLATIONS: Record<
  string,
  {
    ask: string;
    pulse: string;
    subtitle: string;
    liveEngine: string;
    suggestions: string[];
    placeholder: string;
    disclaimer: string;
    fallbackText: string;
    findVolunteer: string;
    contactStaff: string;
    alertVolunteer: string;
    alertStaff: string;
  }
> = {
  en: {
    ask: 'ASK',
    pulse: 'PULSE',
    subtitle: "The stadium's intelligent nervous system co-pilot",
    liveEngine: 'Live AI Engine',
    suggestions: [
      'Where is the least crowded restroom?',
      'Guide me to my seat (Section 114).',
      'Find vegetarian food near me.',
      'Which shuttle should I take after the match?',
      'I need a quiet route.',
    ],
    placeholder: 'Ask Pulse in EN...',
    disclaimer: 'Pulse AI may produce inaccurate stadium data. Verify with venue staff.',
    fallbackText:
      'AI response not helpful? Connect directly with venue volunteers or support staff.',
    findVolunteer: 'Find Volunteer',
    contactStaff: 'Contact Staff',
    alertVolunteer: 'Connecting you to a nearby stadium volunteer. Check your location service.',
    alertStaff: 'Calling the venue operations help desk. Live agent response fallback active.',
  },
  es: {
    ask: 'PREGUNTAR A',
    pulse: 'PULSE',
    subtitle: 'El copiloto del sistema nervioso inteligente del estadio',
    liveEngine: 'Motor de IA en vivo',
    suggestions: [
      '¿Dónde está el baño menos concurrido?',
      'Guíame a mi asiento (Sección 114).',
      'Encuentra comida vegetariana cerca de mí.',
      '¿Qué transporte debo tomar después del partido?',
      'Necesito una ruta tranquila.',
    ],
    placeholder: 'Pregunta a Pulse en ES...',
    disclaimer:
      'Pulse AI puede producir datos inexactos sobre el estadio. Verifique con el personal del lugar.',
    fallbackText:
      '¿La respuesta de la IA no es útil? Conéctese directamente con los voluntarios o el personal de soporte.',
    findVolunteer: 'Buscar Voluntario',
    contactStaff: 'Contactar Personal',
    alertVolunteer:
      'Conectándolo con un voluntario del estadio cercano. Verifique su servicio de ubicación.',
    alertStaff: 'Llamando al servicio de operaciones del lugar. Soporte de agente en vivo activo.',
  },
  fr: {
    ask: 'DEMANDER À',
    pulse: 'PULSE',
    subtitle: 'Le copilote du système nerveux intelligent du stade',
    liveEngine: 'Moteur IA en direct',
    suggestions: [
      'Où se trouvent les toilettes les moins fréquentées ?',
      'Guide-moi vers mon siège (Section 114).',
      'Trouver de la nourriture végétarienne près de moi.',
      'Quelle navette dois-je prendre après le match ?',
      "J'ai besoin d'un itinéraire calme.",
    ],
    placeholder: 'Demander à Pulse en FR...',
    disclaimer:
      "L'IA Pulse peut produire des données de stade inexactes. Vérifiez auprès du personnel.",
    fallbackText:
      "Réponse de l'IA non utile ? Contactez directement les bénévoles du stade ou le personnel d'assistance.",
    findVolunteer: 'Trouver Bénévole',
    contactStaff: 'Contacter Staff',
    alertVolunteer:
      'Connexion à un bénévole du stade à proximité. Vérifiez votre service de localisation.',
    alertStaff: "Appel du bureau d'assistance des opérations. Agent en direct activé.",
  },
  hi: {
    ask: 'पल्स से',
    pulse: 'पूछें',
    subtitle: 'स्टेडियम का इंटेलिजेंट नर्वस सिस्टम को-पायलट',
    liveEngine: 'लाइव एआई इंजन',
    suggestions: [
      'सबसे कम भीड़ वाला शौचालय कहाँ है?',
      'मुझे मेरी सीट (सेक्शन 114) तक ले चलें।',
      'मेरे पास शाकाहारी भोजन खोजें।',
      'मैच के बाद मुझे कौन सी शटल लेनी चाहिए?',
      'मुझे एक शांत मार्ग चाहिए।',
    ],
    placeholder: 'HI में पल्स से पूछें...',
    disclaimer:
      'पल्स एआई गलत स्टेडियम डेटा उत्पन्न कर सकता है। आयोजन स्थल के कर्मचारियों से सत्यापित करें।',
    fallbackText:
      'एआई प्रतिक्रिया मददगार नहीं है? आयोजन स्थल के स्वयंसेवकों या सहायता कर्मचारियों से सीधे जुड़ें।',
    findVolunteer: 'स्वयंसेवक खोजें',
    contactStaff: 'कर्मचारियों से संपर्क करें',
    alertVolunteer:
      'आपको पास के स्टेडियम स्वयंसेवक से जोड़ा जा रहा है। अपनी स्थान सेवा की जाँच करें।',
    alertStaff:
      'आयोजन स्थल संचालन सहायता डेस्क को कॉल किया जा रहा है। लाइव एजेंट प्रतिक्रिया बैकअप सक्रिय है।',
  },
  ar: {
    ask: 'اسأل',
    pulse: 'بالس',
    subtitle: 'مساعد النظام العصبي الذكي للملعب',
    liveEngine: 'محرك الذكاء الاصطناعي المباشر',
    suggestions: [
      'أين يوجد الحمام الأقل ازدحاماً؟',
      'وجهني إلى مقعدي (القسم 114).',
      'ابحث عن طعام نباتي بالقرب مني.',
      'ما هي الحافلة التي يجب أن أستقلها بعد المباراة؟',
      'أحتاج إلى مسار هادئ.',
    ],
    placeholder: 'اسأل بالس بالعربية...',
    disclaimer:
      'قد ينتج ذكاء بالس الاصطناعي بيانات غير دقيقة عن الملعب. يرجى التحقق مع موظفي الموقع.',
    fallbackText: 'هل رد الذكاء الاصطناعي غير مفيد؟ تواصل مباشرة مع متطوعي الملعب أو موظفي الدعم.',
    findVolunteer: 'البحث عن متطوع',
    contactStaff: 'الاتصال بالموظفين',
    alertVolunteer: 'يتم توصيلك بمتطوع في الملعب قريب. تحقق من خدمة تحديد الموقع لديك.',
    alertStaff: 'الاتصال بمكتب دعم العمليات في الموقع. تم تفعيل خيار العميل المباشر.',
  },
};

export default function FanAssistant() {
  const { chatHistory, addMessage } = useUserStore();
  const { role, language } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

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
      timestamp: new Date().toISOString(),
    };

    addMessage(userMsg);
    setInput('');
    setIsTyping(true);

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

      const response = await askPulse(input, role, language, context);
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date().toISOString(),
      };
      addMessage(aiMsg);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = t.suggestions;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase font-heading">
            {t.ask} <span className="text-[#ccff00]">{t.pulse}</span>
          </h2>
          <p className="text-sm text-gray-500 font-medium font-sans">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto px-5 py-2 bg-[#ccff00]/10 border border-[#ccff00]/20 rounded-full text-xs font-black text-[#ccff00] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(204,255,0,0.1)] animate-ai-pulse font-heading">
          <Sparkles className="w-4 h-4" /> {t.liveEngine}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col mb-4 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scroll-smooth">
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-4 max-w-[85%]',
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              )}
            >
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center shrink-0 border text-lg',
                  msg.role === 'user'
                    ? 'bg-white/5 border-white/10'
                    : 'bg-[#ccff00]/10 border-[#ccff00]/20'
                )}
              >
                {msg.role === 'user' ? (
                  <User className="w-6 h-6" />
                ) : (
                  <BrainCircuit className="w-6 h-6 text-[#ccff00]" />
                )}
              </div>
              <div
                className={cn(
                  'p-5 rounded-2xl text-base md:text-lg leading-relaxed shadow-lg',
                  msg.role === 'user'
                    ? 'bg-white/10 text-white rounded-tr-none font-sans'
                    : 'bg-white/[0.02] border border-white/5 text-gray-200 rounded-tl-none font-sans'
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/20 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 text-[#ccff00] animate-pulse" />
              </div>
              <div className="bg-white/5 p-5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
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
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-gray-400 hover:text-white hover:border-[#ccff00]/30 transition-all whitespace-nowrap flex items-center gap-2 font-sans"
                >
                  {s} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-5 border-t border-white/10 bg-[#0a0a0b]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t.placeholder}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 pr-16 focus:outline-none focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] transition-all font-sans text-base md:text-lg"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 p-3.5 rounded-xl bg-[#ccff00] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d9ff33] transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-[10px] text-gray-600 text-center uppercase tracking-widest font-bold font-sans">
            {t.disclaimer}
          </div>
        </div>
      </div>

      {/* Fallback Assistance Banner */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <p className="text-xs text-gray-400 font-sans">{t.fallbackText}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => alert(t.alertVolunteer)}
            className="flex-1 sm:flex-none px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition-all font-bold text-xs uppercase tracking-wider font-heading"
          >
            {t.findVolunteer}
          </button>
          <button
            onClick={() => alert(t.alertStaff)}
            className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all font-bold text-xs uppercase tracking-wider font-heading"
          >
            {t.contactStaff}
          </button>
        </div>
      </div>
    </div>
  );
}
