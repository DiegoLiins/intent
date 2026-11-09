/* INTENT — Interpretação demonstrativa de linguagem natural.
   Regras simples por palavras-chave, executadas localmente no navegador. */
(function () {
  const D = window.INTENT_DATA;

  const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ').trim();
  const has = (text, terms) => terms.some(t => (t instanceof RegExp ? t.test(text) : text.includes(t)));

  const RESTAURANT_WORDS = ['restaurante', 'comer', 'jantar', 'janta', 'almoc', 'cafe da manha', 'comida', 'pizza', 'sushi', 'lanche', 'hamburg', 'burger', 'bistro', 'prato', 'refeicao', 'brunch', 'cantina', 'culinaria', 'cozinha', 'taco', 'ramen', 'cafeteria', 'massa', 'frutos do mar'];
  const TRAVEL_WORDS = ['viagem', 'viajar', 'destino', 'ferias', 'praia', 'montanha', 'conhecer', 'passeio', 'roteiro', 'neve', 'esquiar', 'feriado', 'lua de mel', 'serra', 'trilha', 'ilha', 'exterior', 'internacional', 'turismo', 'visitar', 'cachoeira', 'museu', 'pais', 'dias'];

  const CUISINES = {
    italiana: ['italian', 'massa', 'pizz', 'lasanha', 'risoto', 'trattoria', 'cantina', 'nhoque'],
    japonesa: ['japones', 'sushi', 'ramen', 'lamen', 'temaki', 'oriental'],
    brasileira: ['brasileir', 'regional', 'nordestin', 'feijoada', 'caseira'],
    francesa: ['frances', 'bistro'],
    vegana: ['vegan'],
    'frutos-do-mar': ['frutos do mar', 'peixe', 'camarao', 'polvo', 'moqueca'],
    hamburgueria: ['hamburg', 'burger', 'lanche'],
    mexicana: ['mexican', 'taco', 'burrito'],
    arabe: ['arabe', 'esfiha', 'kebab', 'homus', 'libanes'],
    cafeteria: ['cafeteria', 'cafe da manha', 'brunch', /\bcafe\b/, 'padaria']
  };

  const CHEAP = ['barat', 'acessivel', 'economic', 'em conta', 'nao muito caro', 'nao seja caro', 'preco bom', 'preco justo', 'custo beneficio', 'gastar pouco', 'orcamento curto', 'pouco dinheiro'];
  const EXPENSIVE = ['sofisticad', 'luxo', 'luxuos', 'requintad', 'alta gastronomia', 'chique', 'refinad', /\bcar[oa]s?\b/, 'ocasiao especial', 'exclusiv'];
  const MODERATE = ['moderad', 'preco medio', 'intermediari'];

  const MEAL_RULES = {
    cafe: ['cafe da manha', 'brunch', 'de manha', 'pela manha'],
    almoco: ['almoc'],
    jantar: ['jantar', 'janta', 'a noite', 'de noite']
  };

  const TAG_RULES = {
    romantico: ['romantic', 'casal', 'namorad', 'a dois', 'encontro', 'pedido de casamento', 'aniversario de namoro'],
    familia: ['familia', 'crianca', 'filhos'],
    amigos: ['amigos', 'galera', 'turma', 'grupo'],
    rapido: ['rapido', 'pressa', 'agil'],
    'ao-ar-livre': ['ao ar livre', 'area externa', 'terraco', 'quintal', 'jardim'],
    vista: ['vista', 'por do sol', 'mirante'],
    wifi: ['trabalhar', 'wifi', 'wi-fi', 'notebook', 'home office'],
    vegetariano: ['vegetarian', 'sem carne'],
    'pet-friendly': [/\bpets?\b/, 'cachorro', /\bcao\b/, /\bcaes\b/]
  };

  const TYPE_RULES = {
    praia: ['praia', /\bmar\b/, 'litoral', 'ilha', 'caribe', 'mergulh'],
    montanha: ['montanha', 'serra', 'trilha', 'chapada'],
    natureza: ['natureza', 'cachoeira', 'parque', 'ecoturismo', 'trilha', 'geleira', 'aventura'],
    cidade: ['cidade grande', 'urban', 'metropole', 'compras', 'vida noturna', 'cidade'],
    cultura: ['cultura', 'historia', 'histori', 'museu', /\bartes?\b/, 'arquitetura', 'templo'],
    gastronomia: ['gastronom', 'comer bem', 'vinho', 'culinaria'],
    neve: ['neve', 'esquiar', 'ski'],
    romantico: ['romantic', 'lua de mel', 'casal', 'a dois']
  };

  const CONTINENT_RULES = {
    europa: ['europa', 'europeu'],
    asia: ['asia', 'asiatic', 'japao'],
    'america-do-sul': ['america do sul', 'america latina', 'sul-americ'],
    'america-do-norte': ['america do norte', 'estados unidos', 'eua', 'mexico']
  };

  const COMPANION_RULES = {
    casal: ['casal', 'namorad', 'lua de mel', 'a dois', 'esposa', 'marido'],
    familia: ['familia', 'crianca', 'filhos'],
    amigos: ['amigos', 'galera', 'turma'],
    sozinho: ['sozinh', 'solo']
  };

  function detectDomain(t) {
    const tTravel = t.replace(/frutos do mar/g, '');
    const bonusR = has(t, ['restaurante', 'comer', 'jantar', 'almoc']) ? 1 : 0;
    const bonusV = has(tTravel, ['viag', 'viajar', 'destino', 'ferias']) ? 1 : 0;
    const r = bonusR + RESTAURANT_WORDS.filter(w => t.includes(w)).length + (Object.values(CUISINES).some(list => has(t, list)) ? 1 : 0);
    const v = bonusV + TRAVEL_WORDS.filter(w => tTravel.includes(w)).length + (Object.values(TYPE_RULES).some(list => has(tTravel, list)) ? 0.5 : 0);
    if (r === 0 && v === 0) return 'all';
    if (r > v) return 'restaurants';
    if (v > r) return 'travel';
    return 'all';
  }

  function priceCriteria(t) {
    if (has(t, CHEAP)) return { min: 1, max: 2, label: 'Preço acessível ($–$$)' };
    if (has(t, MODERATE)) return { min: 2, max: 3, label: 'Preço moderado ($$–$$$)' };
    if (has(t, EXPENSIVE)) return { min: 3, max: 4, label: 'Experiência sofisticada ($$$–$$$$)' };
    return null;
  }

  function parse(query) {
    const raw = query || '';
    const t = norm(raw);
    const domain = detectDomain(t);
    const criteria = [];
    const add = (key, group, label, value) => criteria.push({ key, group, label, value });

    if (domain !== 'travel') {
      Object.entries(CUISINES).forEach(([id, terms]) => {
        if (id === 'cafeteria' && has(t, ['cafe da manha']) && !has(t, ['cafeteria', 'padaria', /\bum cafe\b/])) return;
        if (has(t, terms)) add('cat:' + id, 'category', 'Culinária ' + D.RESTAURANT_CATEGORIES.find(c => c.id === id).label.toLowerCase(), id);
      });
      const p = priceCriteria(t);
      if (p) add('price', 'price', p.label, p);
      Object.entries(MEAL_RULES).forEach(([id, terms]) => { if (has(t, terms)) add('meal:' + id, 'meal', D.MEALS[id], id); });
      Object.entries(TAG_RULES).forEach(([id, terms]) => {
        if (id === 'vegetariano' && criteria.some(c => c.value === 'vegana')) return;
        if (has(t, terms)) add('tag:' + id, 'tag', D.RESTAURANT_TAGS[id], id);
      });
      if (has(t, ['bem avaliad', 'melhor', /\btop\b/, 'recomendad', 'excelente'])) add('rating', 'rating', 'Bem avaliado (4,5+)', 4.5);
    }

    if (domain !== 'restaurants') {
      const tt = t.replace(/frutos do mar/g, '');
      Object.entries(TYPE_RULES).forEach(([id, terms]) => {
        if (has(tt, terms)) add('type:' + id, 'type', D.TRAVEL_TYPES[id], id);
      });
      if (has(tt, ['nacional', 'no brasil', 'pelo brasil', 'dentro do pais'])) add('region', 'region', 'Destino nacional', 'nacional');
      else if (has(tt, ['internacional', 'exterior', 'fora do pais', 'fora do brasil'])) add('region', 'region', 'Destino internacional', 'internacional');
      Object.entries(CONTINENT_RULES).forEach(([id, terms]) => { if (has(tt, terms)) add('continent:' + id, 'continent', D.CONTINENTS[id], id); });
      if (has(tt, ['calor', 'quente', 'tropical', 'ensolarad'])) add('climate', 'climate', 'Clima quente', 'quente');
      else if (has(tt, ['frio', 'inverno', 'lareira'])) add('climate', 'climate', 'Clima frio', 'frio');
      const b = priceCriteria(tt);
      if (b) add('budget', 'budget', b.label.replace('Preço', 'Orçamento').replace('Experiência sofisticada', 'Orçamento alto'), b);
      Object.entries(COMPANION_RULES).forEach(([id, terms]) => { if (has(tt, terms)) add('with:' + id, 'companion', 'Para ' + D.COMPANIONS[id].toLowerCase(), id); });
      const daysMatch = tt.match(/(\d+)\s*dias/);
      if (has(tt, ['fim de semana', 'feriado prolongado', 'bate e volta'])) add('days', 'days', 'Viagem curta (até 4 dias)', 4);
      else if (daysMatch) add('days', 'days', `Cerca de ${daysMatch[1]} dias`, parseInt(daysMatch[1], 10));
      else if (has(tt, ['uma semana', '1 semana'])) add('days', 'days', 'Cerca de 7 dias', 7);
    }

    return { query: raw, domain, criteria };
  }

  function matchRestaurants(criteria) {
    const cats = criteria.filter(c => c.group === 'category').map(c => c.value);
    const price = criteria.find(c => c.group === 'price');
    const soft = criteria.filter(c => ['meal', 'tag', 'rating'].includes(c.group));
    const total = criteria.length;

    const evaluate = r => {
      const reasons = [];
      let hits = 0;
      if (cats.length && cats.includes(r.category)) { hits++; reasons.push('Culinária compatível'); }
      if (price && r.price >= price.value.min && r.price <= price.value.max) { hits++; reasons.push(`Faixa de preço ${D.PRICE_LEVELS[r.price].symbol}`); }
      soft.forEach(c => {
        if (c.group === 'meal' && r.meals.includes(c.value)) { hits++; reasons.push('Serve ' + D.MEALS[c.value].toLowerCase()); }
        if (c.group === 'tag' && r.tags.includes(c.value)) { hits++; reasons.push(D.RESTAURANT_TAGS[c.value]); }
        if (c.group === 'rating' && r.rating >= c.value) { hits++; reasons.push(`Nota ${r.rating.toFixed(1).replace('.', ',')}`); }
      });
      return { item: r, score: total ? hits / total : 0, reasons };
    };

    const strict = D.RESTAURANTS.filter(r =>
      (!cats.length || cats.includes(r.category)) &&
      (!price || (r.price >= price.value.min && r.price <= price.value.max)));
    const exact = strict.length > 0 || (!cats.length && !price);
    const pool = strict.length ? strict : D.RESTAURANTS.filter(r => !cats.length || cats.includes(r.category));
    const finalPool = pool.length ? pool : D.RESTAURANTS;
    const results = finalPool.map(evaluate)
      .filter(x => !total || x.score > 0 || !exact)
      .sort((a, b) => b.score - a.score || b.item.rating - a.item.rating);
    return { results, exact };
  }

  function matchDestinations(criteria) {
    const types = criteria.filter(c => c.group === 'type').map(c => c.value);
    const region = criteria.find(c => c.group === 'region');
    const continents = criteria.filter(c => c.group === 'continent').map(c => c.value);
    const total = criteria.length;

    const evaluate = d => {
      const reasons = [];
      let hits = 0;
      types.forEach(tp => { if (d.types.includes(tp)) { hits++; reasons.push(D.TRAVEL_TYPES[tp]); } });
      if (region && d.region === region.value) { hits++; reasons.push(region.label); }
      if (continents.length && continents.includes(d.continent)) { hits++; reasons.push(D.CONTINENTS[d.continent]); }
      criteria.forEach(c => {
        if (c.group === 'climate' && (d.climate === c.value)) { hits++; reasons.push(c.label); }
        if (c.group === 'budget' && d.budget >= c.value.min && d.budget <= c.value.max) { hits++; reasons.push(`Custo relativo ${D.BUDGET_LEVELS[d.budget].symbol}`); }
        if (c.group === 'companion' && d.companions.includes(c.value)) { hits++; reasons.push(D.COMPANIONS[c.value]); }
        if (c.group === 'days' && d.days[0] <= c.value + 1 && c.value <= d.days[1] + 2) { hits++; reasons.push(`Ideal para ${d.days[0]}–${d.days[1]} dias`); }
      });
      return { item: d, score: total ? hits / total : 0, reasons };
    };

    const strict = D.DESTINATIONS.filter(d =>
      (!types.length || types.some(tp => d.types.includes(tp))) &&
      (!region || d.region === region.value) &&
      (!continents.length || continents.includes(d.continent)));
    const exact = strict.length > 0 || (!types.length && !region && !continents.length);
    const pool = strict.length ? strict : D.DESTINATIONS;
    const results = pool.map(evaluate)
      .filter(x => !total || x.score > 0 || !exact)
      .sort((a, b) => b.score - a.score || a.item.budget - b.item.budget);
    return { results, exact };
  }

  window.INTENT_AI = { parse, matchRestaurants, matchDestinations, norm };
})();
