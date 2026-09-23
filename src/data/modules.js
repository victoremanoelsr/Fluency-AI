/**
 * Fluency AI - Estrutura de Módulos (Meses / CEFR) e Trilha de Dias (Nós)
 * Baseado no Método Natural (Input Compreensível + Prática Ativa + Recast Implícito)
 */

export const CEFR_MODULES = [
  {
    id: 'mod-01-a1',
    code: 'A1',
    monthNumber: 1,
    title: 'Módulo 1: Fundamentos & Sobrevivência',
    titlePt: 'Mês 1: Primeiros Passos e Dia a Dia',
    cefrLevel: 'A1',
    vocabLimit: 500, // 500 palavras mais comuns
    maxWordsPerSentence: 7,
    description: 'Imersão nos 500 termos essenciais, frases curtas e cumprimentos para destravar a fala sem medo.',
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'border-blue-500',
    days: [
      {
        id: 'day-01-hello',
        dayNumber: 1,
        nodeType: 'daily_lesson',
        title: 'Say Hello',
        titlePt: 'Dizendo Olá',
        topic: 'Greetings & Introductions',
        icon: 'hand-wave',
        phase1: {
          title: 'Input Compreensível (10 min): O Primeiro Encontro',
          storyEn: "Alex walks into a small coffee shop in California. The morning sun is warm. He smiles and looks at the barista. 'Hello! Good morning! Nice to meet you.' Simple words connect people anywhere in the world.",
          storyPt: "Alex entra em uma cafeteria na Califórnia. O sol da manhã está agradável. Ele sorri e diz ao atendente: 'Olá! Bom dia! Prazer em te conhecer.' Palavras simples conectam pessoas em qualquer lugar do mundo.",
          initialCard: {
            phrasePt: 'Bom dia! Meu nome é Victor.',
            phraseTarget: "Good morning! My name is Victor.",
            pronunciationGuide: "gud mór-nin! mái nêim iz Victor.",
            highlightWord: "name"
          },
          targetKeywords: ['Hello', 'Good morning', 'Nice to meet you', 'My name is']
        },
        phase2: {
          scenarioPrompt: "Imagine that we just bumped into each other on a sunny morning. Say hi and tell me your name!",
          initialAiMessage: "Good morning! I'm Alex. What's your name?"
        }
      },
      {
        id: 'day-02-how-are-you',
        dayNumber: 2,
        nodeType: 'daily_lesson',
        title: 'How Are You?',
        titlePt: 'Como Você Está?',
        topic: 'Expressing Feelings & Status',
        icon: 'flag',
        phase1: {
          title: 'Input Compreensível: Mantendo a Conexão',
          storyEn: "In the hallway, friends walk past each other. 'Hey! How are you doing today?' 'I am good! And you?' A quick smile, a relaxed breath. It is not about grammar, it is about feeling comfortable.",
          storyPt: "No corredor, amigos passam um pelo outro. 'Ei! Como você está hoje?' 'Estou bem! E você?' Um sorriso rápido, uma conversa leve. Não é sobre gramática, é sobre se sentir à vontade.",
          initialCard: {
            phrasePt: 'Estou bem, e você?',
            phraseTarget: "I'm good, and you?",
            pronunciationGuide: "aim gud, énd iú?",
            highlightWord: "and you"
          },
          targetKeywords: ['How are you?', "I'm good", 'Tired', 'And you?']
        },
        phase2: {
          scenarioPrompt: "You are meeting a friend at the park. Let's see how you answer when they ask how you're feeling.",
          initialAiMessage: "Hey! Good to see you. How are you doing today?"
        }
      },
      {
        id: 'day-03-numbers-prices',
        dayNumber: 3,
        nodeType: 'daily_lesson',
        title: 'Numbers & Prices',
        titlePt: 'Números e Preços',
        topic: 'Buying Everyday Items',
        icon: 'book',
        phase1: {
          title: 'Input Compreensível: Comprando no Mercado',
          storyEn: "Alex needs a bottle of cold water. He asks the cashier: 'How much is this?' The cashier answers: 'Two dollars, please.' Alex pays with cash. Fast and easy.",
          storyPt: "Alex precisa de uma garrafa de água gelada. Ele pergunta ao caixa: 'Quanto custa isso?' O caixa responde: 'Dois dólares, por favor.' Alex paga em dinheiro. Rápido e fácil.",
          initialCard: {
            phrasePt: 'Quanto custa essa garrafa de água?',
            phraseTarget: "How much is that water bottle?",
            pronunciationGuide: "rráu mâtch iz dét uó-ter bó-tol?",
            highlightWord: "How much"
          },
          targetKeywords: ['How much is it?', 'Two dollars', 'Cash or card']
        },
        phase2: {
          scenarioPrompt: "You are buying a bottle of water in a convenience store. Ask for the price!",
          initialAiMessage: "Hi there! Can I help you find something?"
        }
      },
      {
        id: 'day-04-where-from',
        dayNumber: 4,
        nodeType: 'daily_lesson',
        title: 'Where Are You From?',
        titlePt: 'De Onde Você É?',
        topic: 'Origins & Nationalities',
        icon: 'users',
        phase1: {
          title: 'Input Compreensível: Conhecendo Novas Pessoas',
          storyEn: "People from all over the world meet at an international conference. 'Where are you from?' 'I am from Brazil! How about you?' Friendly connections start with genuine curiosity.",
          storyPt: "Pessoas de todo o mundo se encontram em um evento internacional. 'De onde você é?' 'Eu sou do Brasil! E você?' Boas conexões começam com curiosidade sincera.",
          initialCard: {
            phrasePt: 'De onde você é? Eu sou do Brasil.',
            phraseTarget: "Where are you from? I'm from Brazil.",
            pronunciationGuide: "uêr ár iú from? aim from bra-zíu.",
            highlightWord: "Where are you from"
          },
          targetKeywords: ['Where are you from?', "I'm from Brazil", 'Beautiful country']
        },
        phase2: {
          scenarioPrompt: "You are seated next to someone on a plane or lounge. Break the ice!",
          initialAiMessage: "Hello! Nice to sit next to you. Where are you traveling from?"
        }
      },
      {
        id: 'day-05-cafe-order',
        dayNumber: 5,
        nodeType: 'daily_lesson',
        title: 'Ordering at a Café',
        titlePt: 'Pedindo em um Café',
        topic: 'Coffee & Snacks',
        icon: 'coffee',
        phase1: {
          title: 'Input Compreensível: O Jeito Nativo de Pedir',
          storyEn: "Americans rarely say 'I want'. Instead, they warmly say 'Can I get a black coffee, please?' or 'I would like a latte'. It sounds polite and perfectly natural.",
          storyPt: "Nativos quase nunca dizem 'I want'. Em vez disso, dizem gentilmente 'Can I get a black coffee, please?' ou 'I would like a latte'. Soa educado e natural.",
          initialCard: {
            phrasePt: 'Me vê um café preto, por favor?',
            phraseTarget: "Can I get a black coffee, please?",
            pronunciationGuide: "kén ai gét ê blék có-fi, pliis?",
            highlightWord: "Can I get"
          },
          targetKeywords: ['Can I get...', 'Black coffee', 'For here or to go?', 'Please']
        },
        phase2: {
          scenarioPrompt: "You are at the counter of a busy café. Order your favorite drink!",
          initialAiMessage: "Next in line, please! Hi, what can I get started for you today?"
        }
      },
      // NÓ DE AVALIAÇÃO DO MÓDULO 1 (Prova de Fim de Módulo)
      {
        id: 'day-06-exam-starbucks',
        dayNumber: 6,
        nodeType: 'exam',
        title: 'Roleplay Exam: The Busy NYC Café',
        titlePt: 'Avaliação Prática: O Café Lotado em Nova York',
        topic: 'Real World Pressure Test',
        icon: 'trophy',
        examConfig: {
          scenarioTitle: 'Cafeteria Apressada em Manhattan',
          hiddenPersonaPrompt: "Você é um atendente de cafeteria nova-iorquino apressado, impaciente e focado em atender a fila rápido. Você fala rápido, usa contrações reais de NY ('Yeah?', 'What can I getcha?', 'Size? Regular or large?'). Se o aluno hesitar, apresse-o com educação urbana ('Next customer, gotta keep moving!'). NÃO dê dicas nem saia do personagem durante os 10 turnos.",
          missionObjectivePt: "Faça seu pedido com polidez, especifique o tamanho, escolha leite ou açúcar e confirme a forma de pagamento (dinheiro ou cartão) mantendo a calma sob pressão.",
          maxTurns: 10,
          passingScore: 70
        },
        phase1: {
          title: 'Instruções da Avaliação Prática',
          storyEn: "This is your Module 1 Practical Exam. You are entering a real coffee shop in New York City. The line is moving fast. Talk naturally, listen carefully, and solve your order in 10 voice turns.",
          storyPt: "Esta é a sua Avaliação Prática do Módulo 1. Você está em uma cafeteria em Nova York. A fila está rápida. Fale naturalmente, ouça com atenção e conclua seu pedido em 10 turnos de fala.",
          initialCard: {
            phrasePt: 'Um café gelado médio com leite, por favor.',
            phraseTarget: "A medium iced coffee with milk, please.",
            pronunciationGuide: "ê mí-di-um áist có-fi uiz mílk, pliis.",
            highlightWord: "medium"
          }
        },
        phase2: {
          scenarioPrompt: "The exam starts now. The NYC barista looks up at you from the register.",
          initialAiMessage: "Next! Yeah, what can I getcha? We're packed today so keep it rolling!"
        }
      }
    ]
  },
  {
    id: 'mod-02-a2',
    code: 'A2',
    monthNumber: 2,
    title: 'Módulo 2: Conversação Diária & Rotina',
    titlePt: 'Mês 2: Diálogos Cotidianos e Rotina',
    cefrLevel: 'A2',
    vocabLimit: 1200,
    maxWordsPerSentence: 12,
    description: 'Expansão de vocabulário, rotina matinal, compras, direções e expressões cotidianas de tempo e ação.',
    color: 'from-teal-600 to-emerald-600',
    borderColor: 'border-teal-500',
    days: [
      {
        id: 'day-07-daily-routine',
        dayNumber: 7,
        nodeType: 'daily_lesson',
        title: 'My Daily Routine',
        titlePt: 'Minha Rotina Diária',
        topic: 'Habits & Schedules',
        icon: 'clock',
        phase1: {
          title: 'Input Compreensível: Um Dia Típico',
          storyEn: "Every morning, Alex wakes up at seven o'clock. He drinks a big glass of water, checks his messages, and gets ready for work.",
          storyPt: "Toda manhã, Alex acorda às sete horas. Ele bebe um copo grande de água, checa as mensagens e se arruma para trabalhar.",
          initialCard: {
            phrasePt: 'Eu costumo acordar cedo todos os dias.',
            phraseTarget: "I usually wake up early every day.",
            pronunciationGuide: "ai iú-ju-a-li uêik âp êr-li évri dêi.",
            highlightWord: "wake up"
          },
          targetKeywords: ['Wake up', 'Usually', 'Early', 'Every day']
        },
        phase2: {
          scenarioPrompt: "Tell Alex about your usual morning routine.",
          initialAiMessage: "Hey! I'm curious, what does a normal morning look like for you?"
        }
      },
      {
        id: 'day-08-lost-in-city',
        dayNumber: 8,
        nodeType: 'daily_lesson',
        title: 'Asking for Directions',
        titlePt: 'Pedindo Informações e Direções',
        topic: 'Streets & Navigation',
        icon: 'map-pin',
        phase1: {
          title: 'Input Compreensível: Encontrando o Caminho',
          storyEn: "Excuse me, where is the nearest subway station? Go straight for two blocks, then turn left at the traffic light.",
          storyPt: "Com licença, onde fica a estação de metrô mais próxima? Siga em frente por dois quarteirões e vire à esquerda no semáforo.",
          initialCard: {
            phrasePt: 'Com licença, onde fica a estação de metrô?',
            phraseTarget: "Excuse me, where is the subway station?",
            pronunciationGuide: "eks-kiúz mi, uêr iz de sâb-uêi stêi-xãn?",
            highlightWord: "Excuse me"
          },
          targetKeywords: ['Excuse me', 'Go straight', 'Turn left', 'Subway station']
        },
        phase2: {
          scenarioPrompt: "You are walking down a street in Chicago and need to find the train station.",
          initialAiMessage: "Hello! You look a bit confused, are you looking for something around here?"
        }
      },
      // NÓ DE AVALIAÇÃO DO MÓDULO 2
      {
        id: 'day-09-exam-hotel-checkin',
        dayNumber: 9,
        nodeType: 'exam',
        title: 'Roleplay Exam: The Hotel Reservation Snag',
        titlePt: 'Avaliação Prática: O Imprevisto no Hotel',
        topic: 'Travel Problem Solving',
        icon: 'trophy',
        examConfig: {
          scenarioTitle: 'Recepção de Hotel em Miami',
          hiddenPersonaPrompt: "Você é um recepcionista de hotel em Miami. O sistema não está encontrando a reserva do hóspede pelo sobrenome. Você precisa checar o voucher, confirmar o número de noites e resolver educadamente sem perder a postura profissional. Teste se o aluno consegue soletrar seu nome, mostrar calma e explicar o problema em 10 turnos.",
          missionObjectivePt: "Explique que você tem uma reserva, soletre seu nome se necessário, mostre os detalhes da estadia e consiga a chave do seu quarto.",
          maxTurns: 10,
          passingScore: 70
        },
        phase1: {
          title: 'Instruções da Avaliação Prática',
          storyEn: "You just landed in Miami after a long flight. You arrive at the hotel front desk, but there is a problem finding your name in their system.",
          storyPt: "Você acabou de pousar em Miami após um voo longo. Você chega à recepção do hotel, mas o sistema não está achando o seu nome.",
          initialCard: {
            phrasePt: 'Eu tenho uma reserva no nome de Victor.',
            phraseTarget: "I have a reservation under the name Victor.",
            pronunciationGuide: "ai rrév ê re-zer-vêi-xãn ân-der de nêim Victor.",
            highlightWord: "reservation"
          }
        },
        phase2: {
          scenarioPrompt: "The hotel receptionist smiles politely but looks puzzled at the computer.",
          initialAiMessage: "Welcome to The Palms Miami! Checking in today? Could I please get your last name?"
        }
      }
    ]
  },
  {
    id: 'mod-03-b1',
    code: 'B1',
    monthNumber: 3,
    title: 'Módulo 3: Fluência Social & Phrasal Verbs',
    titlePt: 'Mês 3: Expressões Nativas e Vida Social',
    cefrLevel: 'B1',
    vocabLimit: 2500,
    maxWordsPerSentence: 20,
    description: 'Conexões naturais, phrasal verbs essenciais (figure out, catch up, run into), casual fillers e debate de opiniões.',
    color: 'from-purple-600 to-indigo-600',
    borderColor: 'border-purple-500',
    days: [
      {
        id: 'day-10-hangout-plans',
        dayNumber: 10,
        nodeType: 'daily_lesson',
        title: 'Making Weekend Plans',
        titlePt: 'Combinando o Fim de Semana',
        topic: 'Socializing & Phrasal Verbs',
        icon: 'users',
        phase1: {
          title: 'Input Compreensível: Vamos nos Encontrar?',
          storyEn: "Hey, we should definitely catch up this weekend! Are you down to grab some tacos or check out that new rooftop place?",
          storyPt: "Ei, com certeza devíamos nos encontrar esse fim de semana! Você topa comer uns tacos ou conhecer aquele novo terraço?",
          initialCard: {
            phrasePt: 'Com certeza! Você topa sair no sábado?',
            phraseTarget: "Totally! Are you down to hang out on Saturday?",
            pronunciationGuide: "tôu-ta-li! ár iú dáun tu rréng áut on sé-ter-dêi?",
            highlightWord: "down to hang out"
          },
          targetKeywords: ['Catch up', 'Are you down?', 'Grab food', 'Hang out']
        },
        phase2: {
          scenarioPrompt: "Your friend is asking you what you want to do on Friday night.",
          initialAiMessage: "Hey man! Friday night is wide open. Do you have anything fun in mind?"
        }
      }
    ]
  }
];

export const ALL_DAYS = CEFR_MODULES.flatMap(m => m.days);
