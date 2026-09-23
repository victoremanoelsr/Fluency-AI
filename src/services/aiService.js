import { StorageService } from './storage';
import { getIntuitivePronunciation } from '../utils/phonetics';
import { PROMPT_BUILDER } from '../utils/prompts';

export const AIService = {
  /**
   * Main dispatch for conversing with AI Tutor in Daily Lessons or Roleplay Exams
   */
  async sendMessage({ lesson, tutor, phase = 'PHASE_1_INPUT', history = [], userMessage, currentTurn = 1 }) {
    const settings = StorageService.getSettings();
    const openAiKey = StorageService.getOpenAiKey();
    const geminiKey = StorageService.getApiKey();
    const userProfile = StorageService.getUserProfile();

    const provider = settings.aiProvider || (openAiKey ? 'openai' : geminiKey ? 'gemini' : 'simulated');
    const isExam = lesson.nodeType === 'exam';

    // Build the dynamic prompt based on role (Exam vs Daily Lesson)
    let systemPrompt = '';
    if (isExam) {
      systemPrompt = PROMPT_BUILDER.buildRoleplayExamPrompt({
        node: lesson,
        currentTurn,
        studentName: userProfile.name || 'Victor'
      });
    } else {
      systemPrompt = PROMPT_BUILDER.buildDailyLessonPrompt({
        userProfile,
        tutor,
        node: lesson,
        currentPhase: phase
      });
    }

    if (provider === 'openai' && openAiKey) {
      try {
        return await AIService.callOpenAI({ systemPrompt, history, userMessage, openAiKey, isExam, currentTurn });
      } catch (err) {
        console.warn('OpenAI error, falling back to simulated engine:', err);
      }
    }

    if (provider === 'gemini' && geminiKey) {
      try {
        return await AIService.callGemini({ systemPrompt, history, userMessage, geminiKey, isExam, currentTurn });
      } catch (err) {
        console.warn('Gemini error, falling back to simulated engine:', err);
      }
    }

    // Default intelligent simulated engine
    return AIService.simulatedTutorResponse({ lesson, tutor, phase, history, userMessage, currentTurn, isExam });
  },

  async callOpenAI({ systemPrompt, history, userMessage, openAiKey, isExam, currentTurn }) {
    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    const recent = (history || []).slice(-8);
    for (const h of recent) {
      messages.push({
        role: h.sender === 'user' ? 'user' : 'assistant',
        content: h.text || h.messagePt || h.inCharacterSpeechEn || ''
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

    if (parsed.card && !parsed.card.pronunciationGuide && parsed.card.phraseTarget) {
      parsed.card.pronunciationGuide = getIntuitivePronunciation(parsed.card.phraseTarget);
    }

    return {
      messagePt: parsed.messagePt || parsed.inCharacterSpeechEn || parsed.text,
      inCharacterSpeechEn: parsed.inCharacterSpeechEn,
      card: parsed.card || null,
      correctionPt: parsed.correctionPt || null,
      isFeedbackReport: parsed.isFeedbackReport || false,
      examFinished: parsed.examFinished || false,
      scores: parsed.scores || null,
      passed: parsed.passed ?? (parsed.scores?.finalScore >= 70),
      feedbackReportPt: parsed.feedbackReportPt || null
    };
  },

  async callGemini({ systemPrompt, history, userMessage, geminiKey, isExam, currentTurn }) {
    const contents = [];
    const recent = (history || []).slice(-8);
    for (const h of recent) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text || h.messagePt || h.inCharacterSpeechEn || '' }]
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
      messagePt: parsed.messagePt || parsed.inCharacterSpeechEn || parsed.text,
      inCharacterSpeechEn: parsed.inCharacterSpeechEn,
      card: parsed.card || null,
      correctionPt: parsed.correctionPt || null,
      isFeedbackReport: parsed.isFeedbackReport || false,
      examFinished: parsed.examFinished || false,
      scores: parsed.scores || null,
      passed: parsed.passed ?? (parsed.scores?.finalScore >= 70),
      feedbackReportPt: parsed.feedbackReportPt || null
    };
  },

  simulatedTutorResponse({ lesson, tutor, phase, history = [], userMessage = '', currentTurn = 1, isExam = false }) {
    const textLower = (userMessage || '').toLowerCase().trim();

    // LÓGICA DE AVALIAÇÃO PRÁTICA (Roleplay Exam)
    if (isExam) {
      // Se atingiu o 10º turno (ou se o aluno responder pela 5ª vez no simulado)
      if (currentTurn >= 10 || history.length >= 8) {
        return {
          messagePt: "🏁 Prova Prática Concluída! Veja seu resultado detalhado de fluência e compreensão:",
          examFinished: true,
          scores: {
            fluencyScore: 88,
            comprehensionScore: 84,
            problemSolvingScore: 92,
            finalScore: 88
          },
          passed: true,
          feedbackReportPt: {
            summary: "Excelente desempenho sob pressão! Você manteve a calma, usou termos nativos de polidez ('Can I get...', 'Please') e resolveu o pedido com clareza em inglês americano.",
            strengths: [
              "Excelente velocidade de resposta sem travar",
              "Uso natural de 'Can I get' em vez de tradução literal",
              "Compreendeu as perguntas rápidas do atendente"
            ],
            criticalFixes: [
              "Para pedir recibo, use 'Can I get a receipt?' em vez de 'I need paper'"
            ],
            nextModuleUnlocked: true
          }
        };
      }

      // Turnos dinâmicos do exame de cafeteria em NY
      if (textLower.includes('coffee') || textLower.includes('iced') || textLower.includes('latte')) {
        return {
          messagePt: "Gotcha, one coffee. Size? You want Regular or Large? And milk or oat milk?",
          inCharacterSpeechEn: "Gotcha, one coffee. Size? You want Regular or Large? And milk or oat milk?",
          examFinished: false,
          currentTurn: currentTurn + 1
        };
      }

      if (textLower.includes('regular') || textLower.includes('large') || textLower.includes('medium') || textLower.includes('milk')) {
        return {
          messagePt: "Alright, that'll be $4.50. You paying with cash or tapping a card?",
          inCharacterSpeechEn: "Alright, that'll be $4.50. You paying with cash or tapping a card?",
          examFinished: false,
          currentTurn: currentTurn + 1
        };
      }

      return {
        messagePt: "Yeah? Need anything else with that like a muffin, or is that it for ya?",
        inCharacterSpeechEn: "Yeah? Need anything else with that like a muffin, or is that it for ya?",
        examFinished: false,
        currentTurn: currentTurn + 1
      };
    }

    // LÓGICA DAS AULAS DIÁRIAS (A1-A2)
    // Se o usuário estiver encerrando
    if (textLower.includes('goodbye') || textLower.includes('bye') || textLower.includes('tchau') || history.length >= 10) {
      return {
        messagePt: "Parabéns pela sessão de hoje, Victor! Você praticou fala ativa com consistência e completou seus 30 minutos de imersão no Método Natural.",
        card: {
          phrasePt: "Até logo! Tenha um ótimo dia!",
          phraseTarget: "See you later! Have a great day!",
          pronunciationGuide: "síi iú lêi-ter! rrév ê grêit dêi!",
          highlightWord: "later"
        },
        correctionPt: null,
        isFeedbackReport: true,
        sessionCompleted: true
      };
    }

    // Lição: Say Hello (Cumprimentos)
    if (lesson.id === 'day-01-hello' || lesson.id === 'say-hello') {
      if (textLower.includes('hello') || textLower.includes('hi') || textLower.includes('good morning')) {
        return {
          messagePt: "Excelente começo! Agora veja como você pergunta o nome de alguém em inglês com a pronúncia bem natural:",
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
          messagePt: "Muito bem! Agora vamos falar 'Prazer em te conhecer', uma frase que você vai usar sempre:",
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
        messagePt: `Oi, Victor! Sou o ${tutor.name}, seu tutor. Vamos aprender agora como dizer 'Bom dia' em inglês:`,
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
    if (lesson.id === 'day-02-how-are-you' || lesson.id === 'how-are-you') {
      if (textLower.includes('good') || textLower.includes('fine') || textLower.includes('well')) {
        return {
          messagePt: "Mandou muito bem! Agora veja como você devolve a pergunta para manter a conversa fluindo:",
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
        messagePt: "Perfeito, Victor! Quando alguém te perguntar como você está, veja como falar com ritmo nativo:",
        card: {
          phrasePt: "Como você está hoje?",
          phraseTarget: "How are you doing today?",
          pronunciationGuide: "rráu ár iú dú-in tu-dêi?",
          highlightWord: "How are you"
        },
        correctionPt: null
      };
    }

    // Lição: Numbers & Prices
    if (lesson.id === 'day-03-numbers-prices' || lesson.id === 'numbers') {
      return {
        messagePt: "Boa pergunta! Para perguntar o preço em qualquer loja nos EUA, você fala assim:",
        card: {
          phrasePt: "Quanto custa essa garrafa de água?",
          phraseTarget: "How much is that water bottle?",
          pronunciationGuide: "rráu mâtch iz dét uó-ter bó-tol?",
          highlightWord: "How much"
        },
        correctionPt: null
      };
    }

    // Lição: Ordering at a Café
    if (lesson.id === 'day-05-cafe-order' || lesson.id === 'ordering-at-cafe') {
      return {
        messagePt: "Ótimo! Em vez de 'I want', use a forma mais educada e comum dos nativos:",
        card: {
          phrasePt: "Me vê um café preto, por favor?",
          phraseTarget: "Can I get a black coffee, please?",
          pronunciationGuide: "kén ai gét ê blék có-fi, pliis?",
          highlightWord: "Can I get"
        },
        correctionPt: null
      };
    }

    // Fallback padrão
    return {
      messagePt: "Muito bom, Victor! Vamos aprender mais uma frase muito usada em conversas cotidianas:",
      card: {
        phrasePt: "Alguém esperando por mim",
        phraseTarget: "the someone waiting for me",
        pronunciationGuide: "de sô-mên vei-tin for maí",
        highlightWord: "waiting for me"
      },
      correctionPt: null
    };
  }
};
