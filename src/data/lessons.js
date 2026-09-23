export const ROADMAP_LEVELS = [
  {
    id: 'iniciante',
    name: 'Iniciante',
    description: 'Fundamentos essenciais para cumprimentar, se apresentar e sobreviver em situações simples.',
    lessons: [
      {
        id: 'say-hello',
        title: 'Say Hello',
        titlePt: 'Dizendo Olá',
        status: 'completed', // completed | current | locked
        icon: 'hand-wave',
        level: 'Iniciante',
        phase1: {
          title: 'Cumprimentos Básicos',
          intro: 'Oi, Victor! Hoje vamos aprender a falar cumprimentos em inglês, como dizer "olá", "bom dia" e como perguntar e falar o nome. Pronto para começar?',
          initialCard: {
            phrasePt: 'Bom dia! Qual é o seu nome?',
            phraseTarget: "Good morning! What's your name?",
            pronunciationGuide: "gud mór-nin! uóts iór nêim?",
            highlightWord: "name"
          },
          vocab: [
            { en: 'Hello', pt: 'Olá' },
            { en: 'Good morning', pt: 'Bom dia' },
            { en: 'Goodbye', pt: 'Tchau' },
            { en: "What's your name?", pt: 'Qual é o seu nome?' },
            { en: 'My name is...', pt: 'Meu nome é...' }
          ],
          quizQuestion: 'Agora imagine: você está saindo da casa de um amigo. O que você diz em inglês?',
          expectedAnswers: ['goodbye', 'bye', 'see you', 'see you later'],
          successMsg: 'Isso! Mandou muito bem, Victor. Incrível! Agora você já consegue cumprimentar, perguntar nomes e se despedir em inglês.'
        },
        phase2: {
          title: 'Prática de Cumprimentos',
          scenarioPrompt: 'Vamos praticar cumprimentos em inglês em uma conversa simples. Imagine que você está conhecendo alguém novo em uma sala de aula. Eu sou seu colega. A conversa começa agora.\n\nHello!',
          initialAiMessage: 'Hello!',
          context: 'Sala de aula conhecendo um novo colega.',
          roleAi: 'Colega de turma novo',
          roleUser: 'Estudante se apresentando'
        }
      },
      {
        id: 'how-are-you',
        title: 'How Are You?',
        titlePt: 'Como você está?',
        status: 'current',
        icon: 'flag',
        level: 'Iniciante',
        phase1: {
          title: 'Perguntando como a pessoa está',
          intro: 'Oi, Victor! Hoje vamos praticar como perguntar e responder "Como você está?" em inglês. Pronto para começar?',
          initialCard: {
            phrasePt: 'Estou bem, e você?',
            phraseTarget: "I'm good, and you?",
            pronunciationGuide: "aim gud, énd iú?",
            highlightWord: "and you"
          },
          vocab: [
            { en: "I'm good.", pt: 'Estou bem (como você se sente).' },
            { en: "You're tired.", pt: 'Você está cansado (falando da outra pessoa).' },
            { en: 'How are you?', pt: 'Como você está?' },
            { en: 'And you?', pt: 'E você? (para perguntar de volta).' }
          ],
          quizQuestion: 'Se um colega te pergunta "How are you?", como você responde que está tudo bem e devolve a pergunta?',
          expectedAnswers: ["i'm good, and you?", "i'm good and you", "good, and you?", "im good and you"],
          successMsg: 'Perfeito! Você dominou o ritmo natural da conversa.'
        },
        phase2: {
          title: 'Prática em Situação Social',
          scenarioPrompt: 'Vamos simular um encontro casual no corredor. Você acabou de me ver. Eu digo: "Hey! How are you doing today?"',
          initialAiMessage: 'Hey! How are you doing today?',
          context: 'Encontro casual no corredor.',
          roleAi: 'Amigo no corredor',
          roleUser: 'Amigo respondendo'
        }
      },
      {
        id: 'numbers',
        title: 'Numbers',
        titlePt: 'Números e Preços',
        status: 'locked',
        icon: 'book',
        level: 'Iniciante',
        phase1: {
          title: 'Contando e entendendo valores',
          intro: 'Vamos aprender a contar de 1 a 20 e entender preços em dólares.',
          vocab: [
            { en: 'One, Two, Three...', pt: 'Um, Dois, Três...' },
            { en: 'How much is it?', pt: 'Quanto custa isso?' },
            { en: 'It is five dollars.', pt: 'Custa cinco dólares.' }
          ]
        },
        phase2: {
          title: 'Prática de Compras',
          scenarioPrompt: 'Você está comprando uma garrafa de água em uma conveniência.',
          initialAiMessage: 'Hi there! That bottle will be two dollars. Cash or card?'
        }
      },
      {
        id: 'get-to-know-you',
        title: 'Get to Know You',
        titlePt: 'Conhecendo Você',
        status: 'locked',
        icon: 'handshake',
        level: 'Iniciante',
        phase1: {
          title: 'Perguntas pessoais simples',
          intro: 'Aprenda a perguntar de onde a pessoa é e o que ela faz.',
          vocab: [
            { en: 'Where are you from?', pt: 'De onde você é?' },
            { en: "I'm from Brazil.", pt: 'Eu sou do Brasil.' }
          ]
        },
        phase2: {
          title: 'Bate-papo de Boas-vindas',
          scenarioPrompt: 'Você está em um workshop internacional e puxa papo com alguém.',
          initialAiMessage: 'Nice to meet you! Where are you from?'
        }
      },
      {
        id: 'ordering-at-cafe',
        title: 'Ordering at a Café',
        titlePt: 'Pedindo em um Café',
        status: 'locked',
        icon: 'coffee',
        level: 'Iniciante',
        phase1: {
          title: 'Fazendo pedidos com educação',
          intro: 'Aprenda a pedir comida e café de forma natural usando "Can I get..." ou "I would like...".',
          vocab: [
            { en: 'Can I get a black coffee?', pt: 'Me vê um café preto?' },
            { en: 'For here or to go?', pt: 'Para consumir aqui ou para viagem?' },
            { en: 'Keep the change.', pt: 'Fique com o troco.' }
          ]
        },
        phase2: {
          title: 'Simulação no Café',
          scenarioPrompt: 'Você é o cliente em uma cafeteria e eu sou o barista atendente.',
          initialAiMessage: 'Hello! Welcome to our café. What would you like to order today?'
        }
      },
      {
        id: 'my-family',
        title: 'My Family',
        titlePt: 'Minha Família',
        status: 'locked',
        icon: 'users',
        level: 'Iniciante',
        phase1: {
          title: 'Membros da família',
          intro: 'Descreva sua família de forma simples.',
          vocab: [
            { en: 'Mother / Father', pt: 'Mãe / Pai' },
            { en: 'Brother / Sister', pt: 'Irmão / Irmã' }
          ]
        },
        phase2: {
          title: 'Conversando sobre a Família',
          scenarioPrompt: 'Falando sobre fotos de família.',
          initialAiMessage: 'Do you have any brothers or sisters?'
        }
      },
      {
        id: 'im-from',
        title: "I'm From",
        titlePt: 'De onde eu sou',
        status: 'locked',
        icon: 'home',
        level: 'Iniciante',
        phase1: {
          title: 'Nacionalidades e cidades',
          intro: 'Fale da sua cidade natal e país.',
          vocab: [{ en: "I'm from Rio.", pt: 'Eu sou do Rio.' }]
        },
        phase2: {
          title: 'Turismo e Origem',
          scenarioPrompt: 'Falando com um guia de viagens.',
          initialAiMessage: 'Welcome to New York! Where are you visiting from?'
        }
      },
      {
        id: 'who-is-he',
        title: 'Who is he?',
        titlePt: 'Quem é ele?',
        status: 'locked',
        icon: 'user',
        level: 'Iniciante',
        phase1: {
          title: 'Pronomes e apresentações de terceiros',
          intro: 'Apresente amigos e colegas usando "He is..." e "She is...".',
          vocab: [{ en: 'This is my friend Alex.', pt: 'Este é meu amigo Alex.' }]
        },
        phase2: {
          title: 'Apresentando um amigo',
          scenarioPrompt: 'Você está apresentando seu amigo a um novo colega.',
          initialAiMessage: 'Who is the person standing next to you?'
        }
      },
      {
        id: 'everyday-things',
        title: 'Everyday Things I...',
        titlePt: 'Coisas do Dia a Dia',
        status: 'locked',
        icon: 'book-open',
        level: 'Iniciante',
        phase1: {
          title: 'Rotina e ações simples',
          intro: 'Fale de hábitos diários no presente simples.',
          vocab: [{ en: 'I drink coffee every morning.', pt: 'Eu tomo café toda manhã.' }]
        },
        phase2: {
          title: 'Rotina Diária',
          scenarioPrompt: 'Compartilhando o que você costuma fazer.',
          initialAiMessage: 'What time do you usually wake up?'
        }
      }
    ]
  },
  {
    id: 'pre-intermediario',
    name: 'Pré-intermediário',
    description: 'Ganhe fluência em situações do trabalho, viagens e planos futuros.',
    lessons: [
      {
        id: 'daily-habits',
        title: 'Daily Habits',
        titlePt: 'Hábitos e Rotina',
        status: 'locked',
        icon: 'clock',
        level: 'Pré-intermediário',
        phase2: {
          scenarioPrompt: 'Falando sobre cronogramas e hábitos saudáveis.',
          initialAiMessage: 'Tell me about your typical weekday routine!'
        }
      },
      {
        id: 'what-are-you-doing',
        title: 'What Are You Doing?',
        titlePt: 'O que você está fazendo?',
        status: 'locked',
        icon: 'activity',
        level: 'Pré-intermediário',
        phase2: {
          scenarioPrompt: 'Uso de Present Continuous em conversas no telefone.',
          initialAiMessage: 'Hey! Are you busy right now or can you talk for a bit?'
        }
      },
      {
        id: 'summer-plans',
        title: 'Summer Plans',
        titlePt: 'Planos para o Verão',
        status: 'locked',
        icon: 'sun',
        level: 'Pré-intermediário',
        phase2: {
          scenarioPrompt: 'Usando "going to" e "will" para falar de férias.',
          initialAiMessage: 'Summer is coming up! Any plans for the holidays?'
        }
      }
    ]
  }
];

export const ALL_LESSONS = ROADMAP_LEVELS.flatMap(lvl => lvl.lessons);
