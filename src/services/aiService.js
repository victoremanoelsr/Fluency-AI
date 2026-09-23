import { StorageService } from './storage';
import { getIntuitivePronunciation } from '../utils/phonetics';

export const AIService = {
  /**
   * Main dispatch for conversing with AI Tutor
   */
  async sendMessage({ lesson, tutor, phase, history, userMessage }) {
    const settings = StorageService.getSettings();
    const openAiKey = StorageService.getOpenAiKey();
    const geminiKey = StorageService.getApiKey();

    const provider = settings.aiProvider || (openAiKey ? 'openai' : geminiKey ? 'gemini' : 'simulated');

    // Build the tailored prompt focusing on Portuguese tutoring with English target cards
    const systemPrompt = `
Você é ${tutor.name}, um tutor de inglês particular caloroso, encorajador, carismático e paciente.
Personalidade: ${tutor.traits.join(', ')}.
O aluno chama-se Victor, está no nível [${lesson.level || 'INICIANTE'}] e a aula atual é [${lesson.title} - ${lesson.titlePt}].
Fase atual: [${phase === 'aula' ? 'FASE 1: AULA (Instrução de vocabulário e pronúncia)' : 'FASE 2: PRÁTICA (Roleplay em conversa real)'}].

DIRETRIZES FUNDAMENTAIS DO MÉTODO DE ENSINO:
1. FALE EM PORTUGUÊS DO BRASIL: Toda a sua conversa com o aluno, explicações, orientações e incentivos DEVEM ser em português natural e acolhedor (ex: "Muito bem, Victor! Vamos aprender agora como se fala...").
2. FOCO NA FRASE-ALVO: Não despeje blocos de texto em inglês. Em cada turno, você apresenta uma frase clara que o aluno deve aprender e praticar falar em inglês.
3. ESTRUTURA DO CARD DE PRONÚNCIA: Para toda nova frase ou correção, forneça um card pedagógico com:
   - phrasePt: O significado em português (ex: "alguém esperando por mim")
   - phraseTarget: A frase correta no idioma com a gramática natural nativa (ex: "the someone waiting for me")
   - pronunciationGuide: A pronúncia facilitada e intuitiva em português brasileiro (ex: "de sô-mên vei-tin for maí"), dividindo sílabas por hífen para ser extremamente fácil de ler e falar sem travar.
   - highlightWord: (opcional) Uma palavra-chave de destaque na frase em inglês.
4. FEEDBACK AMIGÁVEL: Se o aluno enviou uma resposta ou tentou pronunciar, dê um feedback gentil em português antes de propor a próxima expressão.

Retorne SEMPRE em formato JSON válido:
{
  "messagePt": "Sua fala amigável de tutor em português brasileiro explicando e convidando o aluno a falar",
  "card": {
    "phrasePt": "Significado em português",
    "phraseTarget": "Frase em inglês gramaticalmente correta",
    "pronunciationGuide": "Pronúncia abrasileirada e intuitiva separada por hífen",
    "highlightWord": "palavra de destaque ou null"
  },
  "correctionPt": "Feedback ou correção gentil em português se o aluno errou algo (ou null)",
  "isFeedbackReport": false,
  "sessionCompleted": false
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
        content: h.text || h.messagePt || ''
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
    
    // Auto-fill pronunciation guide if missing
    if (parsed.card && !parsed.card.pronunciationGuide && parsed.card.phraseTarget) {
      parsed.card.pronunciationGuide = getIntuitivePronunciation(parsed.card.phraseTarget);
    }

    return {
      messagePt: parsed.messagePt || parsed.replyPt || parsed.text,
      card: parsed.card || null,
      correctionPt: parsed.correctionPt || null,
      isFeedbackReport: parsed.isFeedbackReport || false,
      sessionCompleted: parsed.sessionCompleted || false
    };
  },

  async callGemini({ systemPrompt, history, userMessage, geminiKey }) {
    const contents = [];
    const recent = (history || []).slice(-6);
    for (const h of recent) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text || h.messagePt || '' }]
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

    if (parsed.card && !parsed.card.pronunciationGuide && parsed.card.phraseTarget) {
      parsed.card.pronunciationGuide = getIntuitivePronunciation(parsed.card.phraseTarget);
    }

    return {
      messagePt: parsed.messagePt || parsed.replyPt || parsed.text,
      card: parsed.card || null,
      correctionPt: parsed.correctionPt || null,
      isFeedbackReport: parsed.isFeedbackReport || false,
      sessionCompleted: parsed.sessionCompleted || false
    };
  },

  simulatedTutorResponse({ lesson, tutor, phase, history = [], userMessage = '' }) {
    const textLower = userMessage.toLowerCase().trim();

    // Check if user is saying goodbye or wrapping up
    if (textLower.includes('goodbye') || textLower.includes('bye') || textLower.includes('tchau') || history.length >= 8) {
      return {
        messagePt: `Parabéns, Victor! Concluímos a nossa sessão com sucesso. Você praticou com muita dedicação e sua pronúncia está evoluindo a passos largos!`,
        card: {
          phrasePt: 'Até mais! Tenha um ótimo dia!',
          phraseTarget: 'See you later! Have a great day!',
          pronunciationGuide: 'síi iú lêi-ter! rrév ê grêit dêi!',
          highlightWord: 'later'
        },
        correctionPt: null,
        isFeedbackReport: true,
        sessionCompleted: true
      };
    }

    // Roleplay Coffee simulation (Cafeteria)
    if (lesson.id === 'ordering-at-cafe') {
      if (textLower.includes('black') || textLower.includes('coffee') || textLower.includes('want')) {
        return {
          messagePt: "Excelente escolha, Victor! Para pedir de um jeito muito natural e educado, americanos usam 'Can I get a black coffee, please?'. Veja como fica fácil de ler e pronunciar:",
          card: {
            phrasePt: "Posso pegar um café preto, por favor?",
            phraseTarget: "Can I get a black coffee, please?",
            pronunciationGuide: "kén ai gét ê blék có-fi, pliis?",
            highlightWord: "Can I get"
          },
          correctionPt: textLower.includes('want') 
            ? "💡 Dica de ouro: em vez de 'I want', use 'Can I get...'. Soa muito mais educado e nativo!" 
            : null
        };
      }

      return {
        messagePt: `Olá! Bem-vindo à cafeteria. Vamos aprender agora como pedir um café com leite de forma bem natural em inglês:`,
        card: {
          phrasePt: "Eu gostaria de um café com leite, por favor.",
          phraseTarget: "I would like a latte with oat milk, please.",
          pronunciationGuide: "ai uúd láik ê lá-tei uiz ôut mílk, pliis.",
          highlightWord: "would like"
        },
        correctionPt: null
      };
    }

    // Lição: Say Hello (Cumprimentos)
    if (lesson.id === 'say-hello') {
      if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('oi')) {
        return {
          messagePt: "Muito bem, Victor! Agora vamos aprender como perguntar o nome de alguém em uma conversa informal:",
          card: {
            phrasePt: "Qual é o seu nome?",
            phraseTarget: "What is your name?",
            pronunciationGuide: "uót iz iór nêim?",
            highlightWord: "name"
          },
          correctionPt: null
        };
      }

      if (textLower.includes('victor') || textLower.includes('my name is')) {
        return {
          messagePt: "Isso aí! Soa super natural. Agora veja como se diz 'Prazer em te conhecer' quando você se apresenta para alguém:",
          card: {
            phrasePt: "Prazer em conhecer você!",
            phraseTarget: "Nice to meet you!",
            pronunciationGuide: "náis tu mít iú!",
            highlightWord: "meet"
          },
          correctionPt: null
        };
      }

      return {
        messagePt: `Oi, Victor! Eu sou o ${tutor.name}, seu tutor. Vamos aprender agora como dizer 'Bom dia' em inglês com a pronúncia perfeita:`,
        card: {
          phrasePt: "Bom dia!",
          phraseTarget: "Good morning!",
          pronunciationGuide: "gud mór-nin!",
          highlightWord: "morning"
        },
        correctionPt: null
      };
    }

    // Lição: How Are You?
    if (lesson.id === 'how-are-you') {
      if (textLower.includes('good') || textLower.includes('fine') || textLower.includes('bem')) {
        return {
          messagePt: "Mandou bem demais! Agora, para devolver a pergunta e manter o papo fluindo, veja como se fala 'E você?':",
          card: {
            phrasePt: "Estou bem, e você?",
            phraseTarget: "I am good, and you?",
            pronunciationGuide: "ai ém gud, énd iú?",
            highlightWord: "and you"
          },
          correctionPt: null
        };
      }

      return {
        messagePt: "Perfeito, Victor! Quando um amigo te cumprimenta no corredor, ele pergunta 'Como você está?'. Veja como responder:",
        card: {
          phrasePt: "Como você está hoje?",
          phraseTarget: "How are you doing today?",
          pronunciationGuide: "rráu ár iú dú-in tu-dêi?",
          highlightWord: "How are you"
        },
        correctionPt: null
      };
    }

    // Exemplo genérico / personalizado (inspirado no pedido do usuário)
    return {
      messagePt: "Vamos aprender agora como falar uma frase muito usada no dia a dia em inglês:",
      card: {
        phrasePt: "Alguém esperando por mim",
        phraseTarget: "the someone waiting for me",
        pronunciationGuide: "de sô-mên vei-tin for maí",
        highlightWord: "me"
      },
      correctionPt: null
    };
  }
};
