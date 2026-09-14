import { SYSTEM_INSTRUCTION_BASE, SHADOWING_FEEDBACK_PROMPT } from '../utils/prompts';
import { StorageService } from './storage';

export const GeminiService = {
  /**
   * Send a conversation turn to Gemini Flash
   */
  async sendConversationMessage({ scenario, history, userMessage }) {
    const apiKey = StorageService.getApiKey();
    const settings = StorageService.getSettings();
    const model = settings.geminiModel || 'gemini-1.5-flash';

    // If no API key is provided, provide an intelligent simulated fallback response
    // so the app is immediately usable and visually demoable
    if (!apiKey) {
      return GeminiService.generateSimulatedResponse(scenario, userMessage);
    }

    const scenarioContext = `
SCENARIO DETAILS:
- Scenario: ${scenario.title} (${scenario.context})
- Your Character Role: ${scenario.character.name} - ${scenario.character.role}
- Personality & Tone: ${scenario.character.tone}
- Learner Goals: ${scenario.goals.join('; ')}
`;

    const fullSystemPrompt = `${SYSTEM_INSTRUCTION_BASE}\n\n${scenarioContext}`;

    // Build the contents payload for Gemini API
    const contents = [];

    // Include recent history (last 8 turns)
    const recentHistory = (history || []).slice(-8);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.sender === 'user' ? msg.text : JSON.stringify(msg.rawResponse || { reply: msg.text }) }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: contents,
          systemInstruction: {
            parts: [{ text: fullSystemPrompt }]
          },
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            responseMimeType: "application/json",
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `Erro da API (${response.status})`;
        throw new Error(message);
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error('Resposta vazia recebida do Gemini.');
      }

      // Parse JSON
      const parsed = GeminiService.cleanAndParseJSON(rawText);
      return parsed;
    } catch (err) {
      console.error('Gemini API Error:', err);
      // If error is about API key, rethrow to notify user
      if (err.message.includes('API key') || err.message.includes('403') || err.message.includes('400')) {
        throw err;
      }
      // Fallback
      return GeminiService.generateSimulatedResponse(scenario, userMessage, err.message);
    }
  },

  /**
   * Evaluate user shadowing/pronunciation
   */
  async evaluateShadowing({ targetPhrase, userTranscript }) {
    const apiKey = StorageService.getApiKey();
    const settings = StorageService.getSettings();
    const model = settings.geminiModel || 'gemini-1.5-flash';

    if (!apiKey) {
      // Calculate basic similarity
      const targetClean = targetPhrase.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const userClean = userTranscript.toLowerCase().replace(/[^a-z0-9 ]/g, '');
      const match = userClean.includes(targetClean) || targetClean.includes(userClean);
      const score = match ? 95 : 75;

      return {
        accuracyScore: score,
        verdict: score > 85 ? 'Great pronunciation!' : 'Good attempt!',
        verdictPt: score > 85 ? 'Excelente pronúncia!' : 'Bom esforço!',
        nativeRhythmTip: 'Tente conectar as palavras sem pausas secas para fluir com mais ritmo.',
        soundFocus: 'Connected Speech'
      };
    }

    const prompt = SHADOWING_FEEDBACK_PROMPT
      .replace('{TARGET_PHRASE}', targetPhrase)
      .replace('{USER_TRANSCRIPT}', userTranscript);

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) throw new Error('Falha na avaliação');
      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return GeminiService.cleanAndParseJSON(raw);
    } catch {
      return {
        accuracyScore: 88,
        verdict: 'Awesome effort!',
        verdictPt: 'Ótima tentativa!',
        nativeRhythmTip: 'Mantenha o som contínuo e use as reduções normais do inglês falado.',
        soundFocus: 'Fluência & Ritmo'
      };
    }
  },

  cleanAndParseJSON(rawText) {
    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      return JSON.parse(cleaned);
    } catch (e) {
      console.warn('JSON parse error, attempting extraction:', e);
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('Falha ao processar o formato da resposta do Gemini.');
    }
  },

  generateSimulatedResponse(scenario, userMessage) {
    const lower = (userMessage || '').toLowerCase();
    
    let reply = "Gotcha! That makes total sense. What else would you like to know?";
    let replyPt = "Entendi! Faz todo sentido. O que mais você gostaria de saber?";
    let nativeWay = "Can I get a large coffee to go?";
    let whyNative = "Nativos americanos usam 'Can I get...' ou 'Lemme get...' em vez de traduzir ao pé da letra.";
    let slangOrReduction = "gonna / can I get";
    let quickSuggestions = [
      "Can I get that with oat milk, please?",
      "How much is that going to be?",
      "Could you make that to go?"
    ];

    if (scenario.id === 'starbucks-coffee') {
      if (lower.includes('coffee') || lower.includes('latte') || lower.includes('want')) {
        reply = "Awesome! What size would you like for that, and do you have any preference for milk?";
        replyPt = "Show! Qual tamanho você quer, e tem preferência de leite?";
        nativeWay = "Can I get an iced latte with oat milk, please?";
        whyNative = "Em vez de 'I want...', americanos usam 'Can I get...'. Soa muito mais natural e educado!";
        slangOrReduction = "Can I get...";
        quickSuggestions = ["Make it a medium with oat milk, please.", "For here, please!", "Can you add a pump of vanilla?"];
      }
    } else if (scenario.id === 'casual-hangout') {
      reply = "No way, that's awesome! How long have you been living around here?";
      replyPt = "Mentira, que maneiro! Há quanto tempo você mora por aqui?";
      nativeWay = "I've been around here for like a couple of months.";
      whyNative = "Usar 'like' como palavra de preenchimento casual ('for like 2 months') é a cara do inglês falado na Califórnia!";
      slangOrReduction = "like / couple of";
      quickSuggestions = ["Just got here recently!", "I'm originally from Brazil.", "Are you from around here?"];
    }

    return {
      reply,
      replyPt,
      userCorrection: {
        hasFeedback: true,
        userOriginal: userMessage,
        nativeWay,
        whyNative,
        slangOrReduction
      },
      quickSuggestions
    };
  }
};
