import { StorageService } from './storage';

export const AIService = {
  /**
   * Main dispatch for conversing with AI Tutor
   */
  async sendMessage({ lesson, tutor, phase, history, userMessage }) {
    const settings = StorageService.getSettings();
    const openAiKey = StorageService.getOpenAiKey();
    const geminiKey = StorageService.getApiKey();

    const provider = settings.aiProvider || (openAiKey ? 'openai' : geminiKey ? 'gemini' : 'simulated');

    // Build the tailored prompt
    const systemPrompt = `
Você é ${tutor.name}, um tutor de inglês particular amigável, carismático e paciente.
Personalidade: ${tutor.traits.join(', ')}.
Nacionalidade/Estilo: ${tutor.origin}.
O aluno chama-se Victor, está no nível [${lesson.level || 'INICIANTE'}] e a aula atual é [${lesson.title} - ${lesson.titlePt}].
Fase atual da sessão: [${phase === 'aula' ? 'FASE 1: AULA (Instrução e verificação de vocabulário)' : 'FASE 2: PRÁTICA (Roleplay em situação real)'}].

REGRAS OBRIGATÓRIAS:
1. Mantenha as frases curtas, naturais e fáceis de entender.
2. Na FASE 1 (AULA): Foque em ensinar, dar exemplos, pedir repetição ou fazer perguntas simples para checar a compreensão.
3. Na FASE 2 (PRÁTICA/ROLEPLAY): Atue no cenário da aula (${lesson.phase2?.scenarioPrompt || 'conversa casual'}). Seja seu parceiro de diálogo.
4. CORREÇÃO GRAMATICAL GENTIL: Se o aluno cometer qualquer deslize gramatical ou falar algo não natural, forneça primeiro uma dica acolhedora em português brasileiro explicando a forma mais natural e convide-o a tentar novamente, antes de continuar a simulação em inglês.
5. Se o aluno finalizar a sessão ou pedir encerramento, retorne um feedback final estruturado com:
   ---
   Forças (em português):
   • [Pontos fortes demonstrados]
   -----
   Próximos Passos (em português):
   • [Dicas de melhoria ou nenhum erro a corrigir]
   -----
   Você está pronto para o próximo tópico?

Retorne sua resposta em formato JSON:
{
  "replyEn": "Texto da sua fala em inglês (ou texto principal)",
  "replyPt": "Tradução fiel em português brasileiro para o botão de tradução",
  "correctionPt": "Dica gramatical gentil em português se houve erro (ou null se correto)",
  "isFeedbackReport": false,
  "readyForNextPhase": false
}
`;

    if (provider === 'openai' && openAiKey) {
      try {
        return await AIService.callOpenAI({ systemPrompt, history, userMessage, openAiKey });
      } catch (err) {
        console.warn('OpenAI error, falling back to simulated engine:', err);
      }
    }

    if (provider === 'gemini' && geminiKey) {
      try {
        return await AIService.callGemini({ systemPrompt, history, userMessage, geminiKey });
      } catch (err) {
        console.warn('Gemini error, falling back to simulated engine:', err);
      }
    }

    // Default intelligent simulated engine (provides instant, zero-config high fidelity responses)
    return AIService.simulatedTutorResponse({ lesson, tutor, phase, history, userMessage });
  },

  async callOpenAI({ systemPrompt, history, userMessage, openAiKey }) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    const recent = (history || []).slice(-6);
    for (const h of recent) {
      messages.push({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text
      });
    }

    messages.push({ role: 'user', content: userMessage });

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return {
      text: parsed.replyEn || parsed.replyPt,
      translationPt: parsed.replyPt,
      correctionPt: parsed.correctionPt,
      isFeedbackReport: parsed.isFeedbackReport
    };
  },

  async callGemini({ systemPrompt, history, userMessage, geminiKey }) {
    const contents = [];
    const recent = (history || []).slice(-6);
    for (const h of recent) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    }
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      })
    });

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);
    return {
      text: parsed.replyEn || parsed.replyPt,
      translationPt: parsed.replyPt,
      correctionPt: parsed.correctionPt,
      isFeedbackReport: parsed.isFeedbackReport
    };
  },

  simulatedTutorResponse({ lesson, tutor, phase, history = [], userMessage = '' }) {
    const textLower = userMessage.toLowerCase().trim();

    // Check if user is saying goodbye or wrapping up
    if (textLower.includes('goodbye') || textLower.includes('bye') || textLower.includes('tchau') || history.length >= 6) {
      return {
        text: `---
Forças (em português):
• Você usou corretamente as saudações e respondeu de forma clara e simples, seguindo o vocabulário ensinado.
-----
Próximos Passos (em português):
• Nenhum erro a corrigir, parabéns!
-----
Você está pronto para o próximo tópico?`,
        translationPt: 'Relatório pedagógico de desempenho.',
        correctionPt: null,
        isFeedbackReport: true,
        sessionCompleted: true
      };
    }

    // Roleplay Coffee simulation
    if (lesson.id === 'ordering-at-cafe') {
      if (textLower.includes('black') || textLower.includes('coffee') || textLower.includes('want')) {
        if (textLower.includes('want') && !textLower.includes('would like') && !textLower.includes('can i get')) {
          return {
            text: "Ótimo esforço! Em inglês, soa muito mais natural e educado dizer 'I would like a black coffee, please' ou 'Can I get a black coffee?'. Vamos tentar de novo? Como você pediria?",
            translationPt: "Dica de polidez para pedidos em cafeterias.",
            correctionPt: "Use 'Can I get...' ou 'I would like...' para soar mais educado!",
            readyForNextPhase: false
          };
        }
        return {
          text: "Perfect! Here is your fresh black coffee. That will be 3 dollars. Cash or card?",
          translationPt: "Perfeito! Aqui está o seu café preto fresquinho. São 3 dólares. Dinheiro ou cartão?",
          correctionPt: null
        };
      }
    }

    // General greetings & How are you
    if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('vamos') || textLower.includes('pronto')) {
      return {
        text: "Good morning! What's your name?",
        translationPt: "Bom dia! Qual é o seu nome?",
        correctionPt: null
      };
    }

    if (textLower.includes('victor') || textLower.includes('my name is')) {
      return {
        text: `Hello, Victor! My name is ${tutor.name}. Goodbye!`,
        translationPt: `Olá, Victor! Meu nome é ${tutor.name}. Tchau!`,
        correctionPt: null
      };
    }

    if (textLower.includes('good') || textLower.includes('fine') || textLower.includes('well')) {
      return {
        text: "I'm glad to hear that! Are you ready to practice our conversational dialogue now?",
        translationPt: "Fico feliz em saber! Está pronto para praticarmos nosso diálogo de conversa agora?",
        correctionPt: null
      };
    }

    // Fallback response
    return {
      text: `Great job, Victor! That was very clear. How would you answer: "Nice to meet you"?`,
      translationPt: "Muito bem, Victor! Foi muito claro. Como você responderia: 'Prazer em te conhecer'?",
      correctionPt: null
    };
  }
};
