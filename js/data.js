/* INTENT — Dados de demonstração.
   Restaurantes, endereços e avaliações são FICTÍCIOS, criados apenas para testes.
   Destinos são lugares reais, mas custos e indicações são aproximações demonstrativas. */
(function () {
  const RESTAURANT_CATEGORIES = [
    { id: 'italiana', label: 'Italiana', hue: 12 },
    { id: 'japonesa', label: 'Japonesa', hue: 350 },
    { id: 'brasileira', label: 'Brasileira', hue: 38 },
    { id: 'francesa', label: 'Francesa', hue: 220 },
    { id: 'vegana', label: 'Vegana', hue: 140 },
    { id: 'frutos-do-mar', label: 'Frutos do mar', hue: 195 },
    { id: 'hamburgueria', label: 'Hamburgueria', hue: 25 },
    { id: 'mexicana', label: 'Mexicana', hue: 50 },
    { id: 'arabe', label: 'Árabe', hue: 30 },
    { id: 'cafeteria', label: 'Cafeteria', hue: 28 }
  ];

  const PRICE_LEVELS = {
    1: { symbol: '$', label: 'Econômico' },
    2: { symbol: '$$', label: 'Acessível' },
    3: { symbol: '$$$', label: 'Moderado' },
    4: { symbol: '$$$$', label: 'Sofisticado' }
  };

  const MEALS = {
    cafe: 'Café da manhã',
    almoco: 'Almoço',
    jantar: 'Jantar'
  };

  const RESTAURANT_TAGS = {
    familia: 'Para famílias',
    romantico: 'Romântico',
    amigos: 'Para grupos',
    rapido: 'Serviço rápido',
    'ao-ar-livre': 'Área ao ar livre',
    vista: 'Com vista',
    wifi: 'Bom para trabalhar',
    vegetariano: 'Opções vegetarianas',
    'pet-friendly': 'Pet friendly'
  };

  const RESTAURANTS = [
    {
      id: 'trattoria-nonna-lina', name: 'Trattoria Nonna Lina', category: 'italiana', price: 2,
      rating: 4.7, reviewsCount: 328, meals: ['almoco', 'jantar'], tags: ['familia', 'vegetariano'],
      neighborhood: 'Vila Aurora', address: 'Rua das Oliveiras, 120', hours: 'Ter a dom · 12h–15h e 19h–23h',
      coords: { x: 28, y: 34 },
      description: 'Cantina acolhedora de massas frescas feitas diariamente, com receitas de família e porções generosas para compartilhar.',
      highlights: ['Tagliatelle ao ragù', 'Lasanha da Nonna', 'Tiramisù da casa'],
      reviews: [
        { author: 'Usuário de teste A', rating: 5, text: 'Massa fresca excelente e atendimento muito atencioso. Ótimo custo-benefício.' },
        { author: 'Usuário de teste B', rating: 4, text: 'Ambiente agradável para ir com a família. Fica cheio no fim de semana.' },
        { author: 'Usuário de teste C', rating: 5, text: 'O ragù lembra comida caseira. Voltaria com certeza.' }
      ]
    },
    {
      id: 'forno-e-fiamma', name: 'Forno & Fiamma', category: 'italiana', price: 1,
      rating: 4.4, reviewsCount: 512, meals: ['jantar'], tags: ['amigos', 'rapido', 'vegetariano'],
      neighborhood: 'Centro Novo', address: 'Av. dos Ipês, 45', hours: 'Todos os dias · 18h–00h',
      coords: { x: 52, y: 48 },
      description: 'Pizzaria napolitana de forno a lenha, com massa de longa fermentação e preços acessíveis.',
      highlights: ['Margherita DOP', 'Pizza de abobrinha e burrata', 'Calzone de linguiça'],
      reviews: [
        { author: 'Usuário de teste D', rating: 5, text: 'Pizza leve, borda aerada e chegou rápido.' },
        { author: 'Usuário de teste E', rating: 4, text: 'Barulhento, mas perfeito para ir com amigos.' }
      ]
    },
    {
      id: 'osteria-velluto', name: 'Osteria Velluto', category: 'italiana', price: 4,
      rating: 4.8, reviewsCount: 196, meals: ['jantar'], tags: ['romantico', 'vista'],
      neighborhood: 'Alto da Colina', address: 'Rua do Mirante, 8', hours: 'Qua a dom · 19h30–23h30',
      coords: { x: 74, y: 22 },
      description: 'Alta cozinha italiana contemporânea, carta de vinhos extensa e salão intimista com vista para a cidade.',
      highlights: ['Risoto de açafrão', 'Ravioli de vitela', 'Menu degustação de 6 etapas'],
      reviews: [
        { author: 'Usuário de teste F', rating: 5, text: 'Perfeito para uma ocasião especial. Serviço impecável.' },
        { author: 'Usuário de teste G', rating: 5, text: 'Vista linda e harmonização muito bem pensada.' },
        { author: 'Usuário de teste H', rating: 4, text: 'Excelente, porém caro. Vale para datas importantes.' }
      ]
    },
    {
      id: 'sakura-hana', name: 'Sakura Hana', category: 'japonesa', price: 3,
      rating: 4.6, reviewsCount: 274, meals: ['almoco', 'jantar'], tags: ['romantico'],
      neighborhood: 'Jardim Oriente', address: 'Rua das Cerejeiras, 300', hours: 'Ter a dom · 12h–15h e 19h–23h',
      coords: { x: 63, y: 66 },
      description: 'Balcão de sushi com peixes selecionados e omakase sob reserva no local, em ambiente sereno e minimalista.',
      highlights: ['Omakase do chef', 'Nigiri de salmão maçaricado', 'Temaki de vieira'],
      reviews: [
        { author: 'Usuário de teste I', rating: 5, text: 'Peixe fresquíssimo e apresentação caprichada.' },
        { author: 'Usuário de teste J', rating: 4, text: 'Ótimo para um jantar a dois.' }
      ]
    },
    {
      id: 'ramen-kumo', name: 'Ramen Kumo', category: 'japonesa', price: 1,
      rating: 4.3, reviewsCount: 431, meals: ['almoco', 'jantar'], tags: ['rapido', 'amigos'],
      neighborhood: 'Centro Novo', address: 'Travessa Nuvem, 17', hours: 'Seg a sáb · 11h30–22h',
      coords: { x: 46, y: 58 },
      description: 'Casa de lámen com caldos cozidos por 12 horas, ideal para uma refeição rápida e reconfortante.',
      highlights: ['Tonkotsu ramen', 'Gyoza na chapa', 'Ramen vegetariano de missô'],
      reviews: [
        { author: 'Usuário de teste K', rating: 4, text: 'Caldo encorpado, preço justo e serviço ágil.' },
        { author: 'Usuário de teste L', rating: 5, text: 'Meu almoço favorito em dias frios.' }
      ]
    },
    {
      id: 'casa-do-sertao', name: 'Casa do Sertão', category: 'brasileira', price: 2,
      rating: 4.5, reviewsCount: 389, meals: ['almoco', 'jantar'], tags: ['familia', 'ao-ar-livre', 'amigos'],
      neighborhood: 'Vila Aurora', address: 'Rua do Cajueiro, 210', hours: 'Todos os dias · 11h30–23h',
      coords: { x: 18, y: 56 },
      description: 'Cozinha regional brasileira com quintal arborizado, música ao vivo aos sábados e pratos para dividir.',
      highlights: ['Baião de dois', 'Carne de sol com macaxeira', 'Cocada de forno'],
      reviews: [
        { author: 'Usuário de teste M', rating: 5, text: 'Comida farta e saborosa. O quintal é ótimo para crianças.' },
        { author: 'Usuário de teste N', rating: 4, text: 'Bom para grupos grandes, ambiente descontraído.' }
      ]
    },
    {
      id: 'cafe-lume', name: 'Café Lume', category: 'cafeteria', price: 1,
      rating: 4.6, reviewsCount: 255, meals: ['cafe', 'almoco'], tags: ['wifi', 'vegetariano', 'pet-friendly'],
      neighborhood: 'Bairro das Letras', address: 'Rua Machado, 99', hours: 'Seg a sáb · 7h–18h',
      coords: { x: 36, y: 74 },
      description: 'Cafeteria de especialidade com padaria artesanal, mesas amplas e tomadas — boa para trabalhar.',
      highlights: ['Croissant de fermentação natural', 'Cold brew da casa', 'Tosta de cogumelos'],
      reviews: [
        { author: 'Usuário de teste O', rating: 5, text: 'Wi-fi estável e café excelente. Virou meu escritório.' },
        { author: 'Usuário de teste P', rating: 4, text: 'Pães ótimos, mas lota no horário do almoço.' }
      ]
    },
    {
      id: 'verde-raiz', name: 'Verde Raiz', category: 'vegana', price: 2,
      rating: 4.5, reviewsCount: 207, meals: ['almoco', 'jantar'], tags: ['vegetariano', 'ao-ar-livre', 'pet-friendly'],
      neighborhood: 'Jardim Oriente', address: 'Alameda das Samambaias, 54', hours: 'Ter a dom · 11h30–22h',
      coords: { x: 80, y: 52 },
      description: 'Cozinha 100% vegetal e sazonal, com ingredientes de pequenos produtores e terraço cheio de plantas.',
      highlights: ['Bowl de grãos ancestrais', 'Moqueca de banana-da-terra', 'Brownie de cacau e tâmara'],
      reviews: [
        { author: 'Usuário de teste Q', rating: 5, text: 'Prova de que comida vegana pode ser muito saborosa.' },
        { author: 'Usuário de teste R', rating: 4, text: 'Terraço lindo. Porções poderiam ser maiores.' }
      ]
    },
    {
      id: 'maison-clair', name: 'Maison Clair', category: 'francesa', price: 4,
      rating: 4.9, reviewsCount: 142, meals: ['jantar'], tags: ['romantico'],
      neighborhood: 'Alto da Colina', address: 'Rua Lumière, 12', hours: 'Qui a sáb · 20h–00h',
      coords: { x: 86, y: 30 },
      description: 'Bistrô gastronômico francês com menu degustação, sommelier dedicado e apenas doze mesas.',
      highlights: ['Menu degustação', 'Pato com laranja e especiarias', 'Soufflé de Grand Marnier'],
      reviews: [
        { author: 'Usuário de teste S', rating: 5, text: 'Experiência memorável do começo ao fim.' },
        { author: 'Usuário de teste T', rating: 5, text: 'Ideal para pedir alguém em casamento.' }
      ]
    },
    {
      id: 'mar-aberto', name: 'Mar Aberto', category: 'frutos-do-mar', price: 3,
      rating: 4.4, reviewsCount: 318, meals: ['almoco', 'jantar'], tags: ['vista', 'ao-ar-livre', 'familia'],
      neighborhood: 'Orla Azul', address: 'Av. Beira-Mar, 1500', hours: 'Todos os dias · 12h–23h',
      coords: { x: 12, y: 82 },
      description: 'Peixes e frutos do mar grelhados com deck de frente para a água e pôr do sol de destaque.',
      highlights: ['Polvo grelhado', 'Moqueca capixaba', 'Arroz de frutos do mar'],
      reviews: [
        { author: 'Usuário de teste U', rating: 4, text: 'Vista incrível no fim de tarde. Polvo no ponto.' },
        { author: 'Usuário de teste V', rating: 5, text: 'Ótimo para almoço de domingo em família.' }
      ]
    },
    {
      id: 'brasa-22', name: 'Brasa 22', category: 'hamburgueria', price: 1,
      rating: 4.2, reviewsCount: 604, meals: ['almoco', 'jantar'], tags: ['rapido', 'amigos'],
      neighborhood: 'Centro Novo', address: 'Rua Vinte e Dois, 22', hours: 'Todos os dias · 11h–23h30',
      coords: { x: 58, y: 38 },
      description: 'Hambúrgueres na brasa com pão de batata, batatas rústicas e milkshakes cremosos.',
      highlights: ['Smash duplo', 'Burger de cogumelos', 'Milkshake de doce de leite'],
      reviews: [
        { author: 'Usuário de teste W', rating: 4, text: 'Rápido e saboroso. Ótimo para um lanche com amigos.' },
        { author: 'Usuário de teste X', rating: 4, text: 'Preço bom, batata rústica viciante.' }
      ]
    },
    {
      id: 'taqueria-sol', name: 'Taquería Sol', category: 'mexicana', price: 2,
      rating: 4.3, reviewsCount: 233, meals: ['jantar'], tags: ['amigos', 'ao-ar-livre', 'vegetariano'],
      neighborhood: 'Bairro das Letras', address: 'Rua Frida, 7', hours: 'Ter a dom · 18h–00h',
      coords: { x: 24, y: 18 },
      description: 'Tacos de tortilla de milho feitos na hora, salsas autorais e um pátio colorido e animado.',
      highlights: ['Tacos al pastor', 'Guacamole na pedra', 'Churros com cajeta'],
      reviews: [
        { author: 'Usuário de teste Y', rating: 4, text: 'Salsas ótimas e clima animado.' },
        { author: 'Usuário de teste Z', rating: 5, text: 'Melhor taco que já comi por aqui.' }
      ]
    },
    {
      id: 'al-zaytun', name: 'Al Zaytun', category: 'arabe', price: 2,
      rating: 4.5, reviewsCount: 287, meals: ['almoco', 'jantar'], tags: ['familia', 'vegetariano'],
      neighborhood: 'Vila Aurora', address: 'Rua do Cedro, 33', hours: 'Seg a sáb · 11h30–22h30',
      coords: { x: 40, y: 26 },
      description: 'Cozinha do Oriente Médio com mezzes para compartilhar, pães assados no forno e doces artesanais.',
      highlights: ['Mezze completo', 'Kafta no espeto', 'Baklava de pistache'],
      reviews: [
        { author: 'Usuário de teste AA', rating: 5, text: 'Homus perfeito e porções para a família toda.' },
        { author: 'Usuário de teste AB', rating: 4, text: 'Atendimento gentil, ótimo almoço.' }
      ]
    },
    {
      id: 'pasta-fresca-express', name: 'Pasta Fresca Express', category: 'italiana', price: 1,
      rating: 4.1, reviewsCount: 176, meals: ['almoco'], tags: ['rapido', 'vegetariano'],
      neighborhood: 'Bairro das Letras', address: 'Rua Dante, 61', hours: 'Seg a sex · 11h–15h',
      coords: { x: 30, y: 64 },
      description: 'Massas frescas montadas na hora, em formato rápido para o almoço do dia a dia.',
      highlights: ['Fettuccine alfredo', 'Penne ao pesto', 'Nhoque ao sugo'],
      reviews: [
        { author: 'Usuário de teste AC', rating: 4, text: 'Rápido e barato para o almoço durante a semana.' },
        { author: 'Usuário de teste AD', rating: 4, text: 'Simples e bem feito.' }
      ]
    }
  ];

  const TRAVEL_TYPES = {
    praia: 'Praia',
    montanha: 'Montanha',
    natureza: 'Natureza',
    cidade: 'Cidade',
    cultura: 'Cultura',
    gastronomia: 'Gastronomia',
    neve: 'Neve',
    romantico: 'Romântico'
  };

  const CLIMATES = { quente: 'Quente', ameno: 'Ameno', frio: 'Frio' };

  const COMPANIONS = { casal: 'Casais', familia: 'Famílias', amigos: 'Amigos', sozinho: 'Viagem solo' };

  const BUDGET_LEVELS = {
    1: { symbol: '$', label: 'Baixo' },
    2: { symbol: '$$', label: 'Moderado' },
    3: { symbol: '$$$', label: 'Alto' },
    4: { symbol: '$$$$', label: 'Muito alto' }
  };

  const DESTINATIONS = [
    {
      id: 'fernando-de-noronha', name: 'Fernando de Noronha', country: 'Brasil', continent: 'america-do-sul', region: 'nacional',
      types: ['praia', 'natureza', 'romantico'], climate: 'quente', budget: 4, days: [4, 6],
      bestSeason: 'Setembro a fevereiro', companions: ['casal', 'amigos', 'sozinho'],
      language: 'Português', currency: 'Real (BRL)',
      scene: { kind: 'beach', sky: ['#7FC8F8', '#E9F6FF'], sea: '#1B8FB5', land: '#F2DDB0', sun: '#FFE08A' },
      summary: 'Arquipélago de águas cristalinas, ideal para mergulho e contato com a natureza preservada.',
      description: 'Arquipélago pernambucano conhecido pelas praias de água transparente, pela vida marinha e por ser área de proteção ambiental, com controle de visitantes.',
      highlights: ['Mergulho e snorkel', 'Mirantes ao pôr do sol', 'Trilhas em área protegida']
    },
    {
      id: 'gramado', name: 'Gramado', country: 'Brasil', continent: 'america-do-sul', region: 'nacional',
      types: ['montanha', 'gastronomia', 'romantico'], climate: 'frio', budget: 3, days: [2, 4],
      bestSeason: 'Junho a agosto (frio) · Novembro e dezembro (Natal)', companions: ['casal', 'familia'],
      language: 'Português', currency: 'Real (BRL)',
      scene: { kind: 'mountain', sky: ['#A8B8D8', '#EEF1F8'], land: '#3E6B4F', peak: '#6C8C74', sun: '#FFF1C9' },
      summary: 'Cidade serrana gaúcha com arquitetura de inspiração europeia, chocolates e clima frio.',
      description: 'Destino da Serra Gaúcha famoso pelo clima de montanha, pela gastronomia de fondue e chocolates e pelos eventos de fim de ano.',
      highlights: ['Fondue e chocolates artesanais', 'Lago Negro', 'Eventos de Natal']
    },
    {
      id: 'chapada-diamantina', name: 'Chapada Diamantina', country: 'Brasil', continent: 'america-do-sul', region: 'nacional',
      types: ['natureza', 'montanha'], climate: 'ameno', budget: 2, days: [5, 7],
      bestSeason: 'Abril a outubro', companions: ['amigos', 'sozinho', 'casal'],
      language: 'Português', currency: 'Real (BRL)',
      scene: { kind: 'canyon', sky: ['#F6B98A', '#FFE9D2'], land: '#9C5B3B', peak: '#C27C52', sun: '#FFD27A' },
      summary: 'Chapadões, cachoeiras e grutas no coração da Bahia, para quem ama trilhas.',
      description: 'Região montanhosa no interior da Bahia, com parque nacional, cachoeiras, grutas de água azul e travessias de vários dias.',
      highlights: ['Morro do Pai Inácio', 'Cachoeira da Fumaça', 'Poços e grutas']
    },
    {
      id: 'salvador', name: 'Salvador', country: 'Brasil', continent: 'america-do-sul', region: 'nacional',
      types: ['cultura', 'praia', 'gastronomia', 'cidade'], climate: 'quente', budget: 2, days: [3, 5],
      bestSeason: 'Setembro a março', companions: ['familia', 'amigos', 'casal', 'sozinho'],
      language: 'Português', currency: 'Real (BRL)',
      scene: { kind: 'coastcity', sky: ['#FFB38A', '#FFE7D6'], sea: '#2C7DA0', land: '#F4C27A', sun: '#FFE08A' },
      summary: 'Centro histórico colorido, cultura afro-brasileira e praias urbanas.',
      description: 'Capital baiana com o Pelourinho, patrimônio da humanidade, forte herança afro-brasileira, música e culinária marcante.',
      highlights: ['Pelourinho', 'Elevador Lacerda', 'Culinária baiana']
    },
    {
      id: 'jericoacoara', name: 'Jericoacoara', country: 'Brasil', continent: 'america-do-sul', region: 'nacional',
      types: ['praia', 'natureza'], climate: 'quente', budget: 2, days: [4, 5],
      bestSeason: 'Julho a janeiro', companions: ['amigos', 'casal', 'sozinho'],
      language: 'Português', currency: 'Real (BRL)',
      scene: { kind: 'dunes', sky: ['#FF9E7A', '#FFE0C2'], sea: '#2A9D8F', land: '#F1D29A', sun: '#FFD166' },
      summary: 'Vila de dunas e lagoas no Ceará, famosa pelo pôr do sol e pelos ventos.',
      description: 'Vila litorânea cearense dentro de parque nacional, conhecida por dunas, lagoas e condições favoráveis para esportes de vento.',
      highlights: ['Pôr do sol na duna', 'Lagoa do Paraíso', 'Kitesurf']
    },
    {
      id: 'lisboa', name: 'Lisboa', country: 'Portugal', continent: 'europa', region: 'internacional',
      types: ['cidade', 'cultura', 'gastronomia'], climate: 'ameno', budget: 3, days: [4, 5],
      bestSeason: 'Março a junho · Setembro e outubro', companions: ['casal', 'amigos', 'sozinho', 'familia'],
      language: 'Português', currency: 'Euro (EUR)',
      scene: { kind: 'city', sky: ['#9EC5E8', '#F1F6FB'], land: '#E8B07A', sun: '#FFE7A6', accent: '#F4A261' },
      summary: 'Colinas, miradouros, bondes amarelos e uma cena gastronômica vibrante.',
      description: 'Capital portuguesa às margens do Tejo, com bairros históricos, miradouros, fado e uma gastronomia que vai dos pastéis de nata ao peixe grelhado.',
      highlights: ['Bairro de Alfama', 'Miradouros', 'Pastéis de nata']
    },
    {
      id: 'roma', name: 'Roma', country: 'Itália', continent: 'europa', region: 'internacional',
      types: ['cultura', 'cidade', 'gastronomia', 'romantico'], climate: 'ameno', budget: 3, days: [4, 5],
      bestSeason: 'Abril a junho · Setembro e outubro', companions: ['casal', 'familia', 'amigos', 'sozinho'],
      language: 'Italiano', currency: 'Euro (EUR)',
      scene: { kind: 'ruins', sky: ['#F7C59F', '#FFF1E0'], land: '#D9A066', sun: '#FFE08A', accent: '#C9885B' },
      summary: 'Séculos de história a céu aberto, praças charmosas e a autêntica cozinha italiana.',
      description: 'A capital italiana reúne monumentos da Antiguidade, arte renascentista e barroca e uma tradição culinária de massas e gelatos.',
      highlights: ['Coliseu', 'Fontana di Trevi', 'Trastevere']
    },
    {
      id: 'kyoto', name: 'Kyoto', country: 'Japão', continent: 'asia', region: 'internacional',
      types: ['cultura', 'cidade', 'natureza'], climate: 'ameno', budget: 4, days: [4, 6],
      bestSeason: 'Março e abril (cerejeiras) · Outubro e novembro (outono)', companions: ['casal', 'sozinho', 'amigos'],
      language: 'Japonês', currency: 'Iene (JPY)',
      scene: { kind: 'temple', sky: ['#F9C6C9', '#FFF0F1'], land: '#5C7A5E', sun: '#FFDCDC', accent: '#C0392B' },
      summary: 'Templos, jardins zen e tradições preservadas na antiga capital japonesa.',
      description: 'Antiga capital imperial do Japão, com milhares de templos e santuários, jardins tradicionais e bairros históricos de casas de madeira.',
      highlights: ['Fushimi Inari', 'Bosque de bambu de Arashiyama', 'Bairro de Gion']
    },
    {
      id: 'el-calafate', name: 'El Calafate', country: 'Argentina', continent: 'america-do-sul', region: 'internacional',
      types: ['natureza', 'montanha'], climate: 'frio', budget: 3, days: [3, 5],
      bestSeason: 'Outubro a abril', companions: ['casal', 'amigos', 'sozinho', 'familia'],
      language: 'Espanhol', currency: 'Peso argentino (ARS)',
      scene: { kind: 'glacier', sky: ['#BFD7EA', '#F2F7FB'], land: '#5B6C7D', peak: '#E6F1F8', sun: '#FFFFFF', sea: '#7FB7D6' },
      summary: 'Porta de entrada para geleiras impressionantes na Patagônia argentina.',
      description: 'Cidade da Patagônia argentina próxima ao Parque Nacional Los Glaciares, onde fica a geleira Perito Moreno.',
      highlights: ['Geleira Perito Moreno', 'Navegação no Lago Argentino', 'Paisagens patagônicas']
    },
    {
      id: 'bariloche', name: 'Bariloche', country: 'Argentina', continent: 'america-do-sul', region: 'internacional',
      types: ['neve', 'montanha', 'natureza', 'romantico'], climate: 'frio', budget: 3, days: [4, 6],
      bestSeason: 'Julho a setembro (neve) · Dezembro a março (lagos)', companions: ['familia', 'casal', 'amigos'],
      language: 'Espanhol', currency: 'Peso argentino (ARS)',
      scene: { kind: 'snow', sky: ['#C9D6F0', '#F5F8FF'], land: '#FFFFFF', peak: '#8DA2C0', sun: '#FFFFFF', sea: '#5C8DC4' },
      summary: 'Montanhas nevadas, lagos andinos e chocolates na Patagônia.',
      description: 'Cidade andina às margens do lago Nahuel Huapi, procurada para esportes de neve no inverno e passeios por lagos no verão.',
      highlights: ['Cerro Catedral', 'Circuito Chico', 'Chocolaterias']
    },
    {
      id: 'cancun', name: 'Cancún', country: 'México', continent: 'america-do-norte', region: 'internacional',
      types: ['praia'], climate: 'quente', budget: 3, days: [5, 7],
      bestSeason: 'Dezembro a abril', companions: ['casal', 'familia', 'amigos'],
      language: 'Espanhol', currency: 'Peso mexicano (MXN)',
      scene: { kind: 'beach', sky: ['#5EC4E8', '#E4F7FF'], sea: '#13B5C9', land: '#FBF0D9', sun: '#FFF3B0' },
      summary: 'Mar do Caribe azul-turquesa, cenotes e sítios arqueológicos maias.',
      description: 'Balneário no Caribe mexicano, base para conhecer praias de areia clara, cenotes e ruínas maias da península de Yucatán.',
      highlights: ['Praias do Caribe', 'Cenotes', 'Ruínas maias']
    },
    {
      id: 'nova-york', name: 'Nova York', country: 'Estados Unidos', continent: 'america-do-norte', region: 'internacional',
      types: ['cidade', 'cultura', 'gastronomia'], climate: 'ameno', budget: 4, days: [5, 7],
      bestSeason: 'Abril a junho · Setembro a novembro', companions: ['amigos', 'sozinho', 'casal', 'familia'],
      language: 'Inglês', currency: 'Dólar americano (USD)',
      scene: { kind: 'skyline', sky: ['#7C83C8', '#E7E9F8'], land: '#3B3F6B', sun: '#FFE6A8', accent: '#FFD166' },
      summary: 'Museus, parques, teatros e bairros com personalidades muito diferentes.',
      description: 'Metrópole com museus de referência, Central Park, musicais da Broadway e uma enorme diversidade gastronômica.',
      highlights: ['Central Park', 'Museus', 'Broadway']
    }
  ];

  const CONTINENTS = {
    'america-do-sul': 'América do Sul',
    'america-do-norte': 'América do Norte',
    europa: 'Europa',
    asia: 'Ásia'
  };

  window.INTENT_DATA = {
    RESTAURANT_CATEGORIES, PRICE_LEVELS, MEALS, RESTAURANT_TAGS, RESTAURANTS,
    TRAVEL_TYPES, CLIMATES, COMPANIONS, BUDGET_LEVELS, DESTINATIONS, CONTINENTS
  };
})();
