/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */



export async function askPulse(prompt: string, role: string, language: string, context?: any): Promise<string> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, role, language, context })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.warn('Backend fetch failed, falling back to mock response', error);
    // Fake loading delay to simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    return getMockResponse(prompt, role, language);
  }
}

function getMockResponse(prompt: string, role: string, language: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  const translations: Record<string, { gate: string; food: string; restroom: string; operations: string; default: string }> = {
    en: {
      gate: "Gate C is currently 41% less congested than Gate A. Take the east concourse route through Zone 3. Estimated arrival: 8 minutes. This route is step-free and avoids the highest-density corridor.",
      food: "There are 3 vegetarian-friendly vendors in your current zone. Azteca Tacos (Zone 1) has the shortest queue (15 mins) and uses 100% compostable packaging.",
      restroom: "The nearest low-density restroom is located behind Section 114, about a 2-minute walk from your current location.",
      operations: "Zone 4 is trending toward critical density within 12 minutes due to a delayed shuttle arrival and gate imbalance. Redirecting 15% of arrivals to Gate D is predicted to reduce congestion by 23%. Recommend deploying two volunteers near the east concourse.",
      default: "I'm Pulse, your stadium assistant. I can help you with navigation, queue times, and match information. What would you like to know?"
    },
    es: {
      gate: "La Puerta C está actualmente un 41% menos congestionada que la Puerta A. Tome la ruta del vestíbulo este a través de la Zona 3. Llegada estimada: 8 minutos. Esta ruta no tiene escalones y evita el corredor de mayor densidad.",
      food: "Hay 3 proveedores de comida vegetariana en su zona actual. Azteca Tacos (Zona 1) tiene la cola más corta (15 min) y utiliza envases 100% compostables.",
      restroom: "El baño de baja densidad más cercano se encuentra detrás de la Sección 114, a unos 2 minutos a pie de su ubicación actual.",
      operations: "La Zona 4 tiende hacia una densidad crítica en 12 minutos debido al retraso en la llegada del transbordador y al desequilibrio de las puertas. Se predice que redirigir el 15% de las llegadas a la Puerta D reducirá la congestión en un 23%. Se recomienda desplegar dos voluntarios cerca del vestíbulo este.",
      default: "Soy Pulse, su asistente de estadio. Puedo ayudarlo con la navegación, los tiempos de espera y la información del partido. ¿Qué le gustaría saber?"
    },
    fr: {
      gate: "La porte C est actuellement 41% moins encombrée que la porte A. Prenez l'itinéraire du hall est via la zone 3. Arrivée estimée : 8 minutes. Cet itinéraire est de plain-pied et évite le couloir à plus forte densité.",
      food: "Il y a 3 vendeurs proposant des plats végétariens dans votre zone actuelle. Azteca Tacos (Zone 1) a la file d'attente la plus courte (15 min) et utilise des emballages 100% compostables.",
      restroom: "Les toilettes à faible densité les plus proches sont situées derrière la section 114, à environ 2 minutes à pied de votre emplacement actuel.",
      operations: "La zone 4 tend vers une densité critique d'ici 12 minutes en raison d'une arrivée tardive de la navette et d'un déséquilibre aux portes. Rediriger 15% des arrivées vers la porte D devrait réduire la congestion de 23%. Recommandation de déployer deux bénévoles près du hall est.",
      default: "Je suis Pulse, votre assistant de stade. Je peux vous aider avec la navigation, les temps d'attente et les informations sur le match. Que aimeriez-vous savoir ?"
    },
    hi: {
      gate: "गेट C में वर्तमान में गेट A की तुलना में 41% कम भीड़ है। ज़ोन 3 के माध्यम से पूर्वी कॉनकोर्स मार्ग लें। आगमन का अनुमानित समय: 8 मिनट। यह मार्ग सीढ़ी-मुक्त है और सबसे अधिक भीड़ वाले कॉरिडोर से बचाता है।",
      food: "आपके वर्तमान ज़ोन में 3 शाकाहारी-अनुकूल विक्रेता हैं। एज़्टेका टैकोस (ज़ोन 1) में सबसे कम लाइन (15 मिनट) है और यह 100% बायोडिग्रेडेबल पैकेजिंग का उपयोग करता है।",
      restroom: "निकटतम कम भीड़ वाला शौचालय धारा 114 के पीछे स्थित है, जो आपके वर्तमान स्थान से लगभग 2 मिनट की पैदल दूरी पर है।",
      operations: "देरी से शटल आगमन और गेट असंतुलन के कारण ज़ोन 4 अगले 12 मिनट में गंभीर भीड़ की ओर बढ़ रहा है। 15% आगंतुकों को गेट D पर भेजने से भीड़ में 23% की कमी आने का अनुमान है। पूर्वी कॉनकोर्स के पास दो स्वयंसेवकों को तैनात करने की सिफारिश की जाती है।",
      default: "मैं पल्स हूँ, आपका स्टेडियम सहायक। मैं नेविगेशन, लाइन के समय और मैच की जानकारी में आपकी मदद कर सकता हूँ। आप क्या जानना चाहेंगे?"
    },
    ar: {
      gate: "البوابة C حالياً أقل ازدحاماً بنسبة 41% من البوابة A. اسلك مسار الردهة الشرقية عبر المنطقة 3. الوصول المتوقع: 8 دقائق. هذا المسار خالٍ من السلالم ويتجنب الممر الأكثر كثافة.",
      food: "يوجد 3 بائعين يقدمون أطعمة نباتية في منطقتك الحالية. مطعم Azteca Tacos (المنطقة 1) لديه أقصر طابور انتظار (15 دقيقة) ويستخدم عبوات قابلة للتحلل بنسبة 100%.",
      restroom: "أقرب دورة مياه ذات كثافة منخفضة تقع خلف القسم 114، على بعد حوالي دقيقتين سيراً على الأقدام من موقعك الحالي.",
      operations: "المنطقة 4 تتجه نحو كثافة حرجة خلال 12 دقيقة بسبب تأخر وصول الحافلة وعدم توازن البوابات. من المتوقع أن يؤدي توجيه 15% من القادمين إلى البوابة D إلى تقليل الازدحام بنسبة 23%. نوصي بنشر متطوعين اثنين بالقرب من الردهة الشرقية.",
      default: "أنا بالس (Pulse)، مساعدك في الملعب. يمكنني مساعدتك في التنقل، وأوقات الانتظار، ومعلومات المباريات. ماذا تريد أن تعرف؟"
    }
  };

  const langKey = (language in translations) ? language : 'en';
  const langSet = translations[langKey];

  if (lowerPrompt.includes('gate') || lowerPrompt.includes('puerta') || lowerPrompt.includes('porte') || lowerPrompt.includes('गेट') || lowerPrompt.includes('بواب')) {
    return langSet.gate;
  }
  
  if (lowerPrompt.includes('food') || lowerPrompt.includes('vegetarian') || lowerPrompt.includes('comida') || lowerPrompt.includes('nourriture') || lowerPrompt.includes('शाकाहारी') || lowerPrompt.includes('طعام') || lowerPrompt.includes('نباتي')) {
    return langSet.food;
  }

  if (lowerPrompt.includes('restroom') || lowerPrompt.includes('baño') || lowerPrompt.includes('toilette') || lowerPrompt.includes('शौचालय') || lowerPrompt.includes('الحمام') || lowerPrompt.includes('دورة مياه')) {
    return langSet.restroom;
  }

  if (role === 'operations') {
    return langSet.operations;
  }

  return langSet.default;
}
