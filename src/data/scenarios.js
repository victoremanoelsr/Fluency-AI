export const SCENARIOS = [
  {
    id: 'starbucks-coffee',
    title: 'Ordering at a US Coffee Shop',
    titlePt: 'Pedindo café no estilo americano',
    category: 'Daily Life',
    categoryPt: 'Dia a Dia',
    level: 'Beginner / Intermediate',
    emoji: '☕',
    bannerColor: 'from-amber-600 to-amber-900',
    character: {
      name: 'Chloe (Barista)',
      avatar: '👩🏼‍🦰',
      role: 'Friendly Barista at a busy Seattle coffee shop',
      tone: 'Upbeat, friendly, uses common American fast-casual phrasing like "What can I get started for you?", "Room for cream?", "For here or to go?"'
    },
    context: 'You just walked into a busy American coffee shop. Chloe is at the counter ready to take your order.',
    contextPt: 'Você acabou de entrar em uma cafeteria movimentada. A Chloe está no balcão para anotar o seu pedido.',
    goals: [
      'Order a drink with custom milk or size (e.g. "Can I get an iced latte with oat milk?")',
      'Specify if it is "for here or to go"',
      'Pay and give your name for the cup'
    ],
    starterPrompt: "Hey there! Welcome in! What can I get started for you today?",
    usefulPhrases: [
      { en: "Can I get a large iced latte with oat milk?", pt: "Me vê um latte gelado grande com leite de aveia?", reduction: "Can I get a..." },
      { en: "To go, please.", pt: "Para viagem, por favor.", reduction: "To go" },
      { en: "Could I have a splash of vanilla syrup?", pt: "Pode colocar um pouquinho de xarope de baunilha?", reduction: "splash of..." },
      { en: "Keep the change!", pt: "Pode ficar com o troco!", reduction: "Keep the change" }
    ]
  },
  {
    id: 'airport-customs',
    title: 'US Airport Customs & Border',
    titlePt: 'Imigração e Alfândega nos EUA',
    category: 'Travel',
    categoryPt: 'Viagem',
    level: 'Intermediate',
    emoji: '✈️',
    bannerColor: 'from-blue-600 to-indigo-950',
    character: {
      name: 'Officer Miller',
      avatar: '👮‍♂️',
      role: 'US Customs and Border Protection Officer',
      tone: 'Direct, professional, asks standard questions clearly: "What is the purpose of your visit?", "How long are you staying?", "Where will you be staying?"'
    },
    context: 'You just landed at JFK Airport in New York and approached the immigration booth.',
    contextPt: 'Você acabou de pousar no aeroporto JFK em Nova York e chegou à cabine de imigração.',
    goals: [
      'State your purpose of travel (vacation/business)',
      'Explain your length of stay and accommodation',
      'Answer confidently without getting nervous'
    ],
    starterPrompt: "Good afternoon. Passport and customs declaration form, please. What is the purpose of your trip to the United States?",
    usefulPhrases: [
      { en: "I'm here on vacation for two weeks.", pt: "Estou aqui de férias por duas semanas.", reduction: "I'm here on vacation" },
      { en: "I'll be staying at a hotel in Manhattan.", pt: "Vou ficar em um hotel em Manhattan.", reduction: "I'll be staying at..." },
      { en: "Here is my return ticket confirmation.", pt: "Aqui está a confirmação da minha passagem de volta.", reduction: "Here is my..." }
    ]
  },
  {
    id: 'casual-hangout',
    title: 'Making Friends at a Party',
    titlePt: 'Papo descontraído em uma festa',
    category: 'Social',
    categoryPt: 'Social & Amizades',
    level: 'All Levels',
    emoji: '🎉',
    bannerColor: 'from-pink-600 to-purple-900',
    character: {
      name: 'Jake',
      avatar: '🧢',
      role: 'Casual American guy at a friend’s backyard BBQ in California',
      tone: 'Super chill, uses slang, contractions and natural conversational flow: "What\'s up man?", "How do you know Mike?", "No way, that\'s awesome!"'
    },
    context: 'You are at a house party in California. Jake notices you and starts a casual conversation by the drinks table.',
    contextPt: 'Você está em uma festa na casa de um amigo na Califórnia. O Jake puxa assunto perto da mesa de bebidas.',
    goals: [
      'Introduce yourself informally',
      'Talk about what you do or where you are from',
      'React naturally using expressions like "No way!", "That makes sense", "Totally"'
    ],
    starterPrompt: "Hey! I don't think we've met yet. I'm Jake, Mike's roommate. How's it going tonight?",
    usefulPhrases: [
      { en: "Nice to meet you! I'm [Name].", pt: "Prazer em te conhecer! Eu sou o [Nome].", reduction: "Nice to meetcha" },
      { en: "I'm originally from Brazil, just visiting for a bit.", pt: "Sou originalmente do Brasil, só visitando um pouco.", reduction: "just visiting for a bit" },
      { en: "What do you do for a living?", pt: "O que você faz da vida / com o que trabalha?", reduction: "Whaddya do..." },
      { en: "No way! That sounds super cool.", pt: "Mentira / Não acredito! Que maneiro.", reduction: "No way!" }
    ]
  },
  {
    id: 'job-interview',
    title: 'Tech Job Interview (Culture Fit)',
    titlePt: 'Entrevista de Emprego em Empresa Americana',
    category: 'Career',
    categoryPt: 'Trabalho & Carreira',
    level: 'Advanced',
    emoji: '💼',
    bannerColor: 'from-emerald-600 to-teal-950',
    character: {
      name: 'Sarah (Hiring Manager)',
      avatar: '👩🏽‍💼',
      role: 'Engineering Lead at a US tech company',
      tone: 'Professional yet approachable, uses modern workplace idioms: "touch base", "deep dive", "walk me through", "hit the ground running"'
    },
    context: 'You are on a Zoom interview for a remote position at a US company.',
    contextPt: 'Você está em uma entrevista pelo Zoom para uma vaga remota em uma empresa americana.',
    goals: [
      'Give a concise 1-minute intro about yourself',
      'Explain a project you worked on and how you solved a problem',
      'Ask a good question about company culture'
    ],
    starterPrompt: "Hi! Thanks for taking the time to meet with me today. To kick things off, could you walk me through your background and what you're looking for in your next role?",
    usefulPhrases: [
      { en: "Sure! I've been working as a developer for the past few years...", pt: "Claro! Venho trabalhando como desenvolvedor nos últimos anos...", reduction: "I've been working as..." },
      { en: "My main focus is building scalable and user-friendly web apps.", pt: "Meu foco principal é criar aplicativos web escaláveis e fáceis de usar.", reduction: "My main focus is..." },
      { en: "What does a typical day look like for the team?", pt: "Como é o dia a dia típico da equipe?", reduction: "What does a... look like" }
    ]
  },
  {
    id: 'hotel-checkin',
    title: 'Hotel Check-in & Requests',
    titlePt: 'Check-in no Hotel e Pedidos Especiais',
    category: 'Travel',
    categoryPt: 'Viagem',
    level: 'Beginner',
    emoji: '🏨',
    bannerColor: 'from-cyan-600 to-blue-900',
    character: {
      name: 'Lucas (Front Desk)',
      avatar: '🧑🏻‍💼',
      role: 'Hospitality Concierge',
      tone: 'Polite, helpful, clear pronunciation: "How can I assist you?", "We have you booked for 3 nights", "Here is your keycard"'
    },
    context: 'You arrived at your hotel in Miami after a long flight and want to check into your room.',
    contextPt: 'Você chegou ao seu hotel em Miami após um voo longo e quer fazer o check-in no quarto.',
    goals: [
      'State you have a reservation under your name',
      'Ask for Wi-Fi password and breakfast hours',
      'Request an extra towel or quiet room if possible'
    ],
    starterPrompt: "Good evening! Welcome to the Grand Palms Hotel. Are you checking in today?",
    usefulPhrases: [
      { en: "Hi! I have a reservation under [Name].", pt: "Oi! Tenho uma reserva no nome de [Nome].", reduction: "I have a reservation under..." },
      { en: "What time is breakfast served?", pt: "A que horas é servido o café da manhã?", reduction: "What time is..." },
      { en: "Is Wi-Fi included?", pt: "O Wi-Fi está incluso?", reduction: "Is Wi-Fi included?" }
    ]
  },
  {
    id: 'store-return',
    title: 'Returning an Item at Target/Best Buy',
    titlePt: 'Trocando ou Devolvendo um Produto nos EUA',
    category: 'Daily Life',
    categoryPt: 'Dia a Dia',
    level: 'Intermediate',
    emoji: '🛍️',
    bannerColor: 'from-orange-600 to-rose-950',
    character: {
      name: 'Ashley (Customer Service)',
      avatar: '👱🏼‍♀️',
      role: 'Customer Service Representative',
      tone: 'Helpful, pragmatic: "Do you have the receipt?", "Was there something wrong with it?", "Would you like store credit or back to your card?"'
    },
    context: 'You bought headphones yesterday at Target, but they don’t fit well. You want a refund or exchange.',
    contextPt: 'Você comprou um fone ontem na Target, mas não ficou confortável. Você quer reembolso ou troca.',
    goals: [
      'Explain why you want to return or exchange the product',
      'Show your digital or paper receipt',
      'Choose between store credit or card refund'
    ],
    starterPrompt: "Hi there! How can I help you today at customer service?",
    usefulPhrases: [
      { en: "I'd like to return this, please.", pt: "Eu gostaria de devolver isto, por favor.", reduction: "I'd like to..." },
      { en: "It didn't really fit the way I expected.", pt: "Não ficou bem como eu esperava.", reduction: "It didn't really..." },
      { en: "I have the receipt right here on my phone.", pt: "Eu tenho o recibo aqui no meu celular.", reduction: "I have the receipt..." }
    ]
  }
];
