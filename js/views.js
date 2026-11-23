/* INTENT — Telas da aplicação. Cada view expõe render(params) e bind(root, params). */
(function () {
  const D = window.INTENT_DATA, AI = window.INTENT_AI, ART = window.INTENT_ART, S = window.INTENT_STORE, UI = window.INTENT_UI;
  const { esc, icon } = UI;

  const EXAMPLES = [
    'Quero encontrar um restaurante italiano com preço acessível para jantar.',
    'Um jantar romântico e sofisticado com vista',
    'Lugar barato para almoçar rápido',
    'Viagem de praia no Brasil com calor para casal',
    'Quero esquiar nas férias com a família',
    'Viagem cultural pela Europa de 5 dias'
  ];

  const go = hash => { location.hash = hash; };
  const searchHash = q => '#/resultados?q=' + encodeURIComponent(q);

  /* Preserva o foco ao re-renderizar uma região dinâmica. */
  function rerender(container, html) {
    const key = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.focus : null;
    container.innerHTML = html;
    if (key) { const el = container.querySelector(`[data-focus="${key}"]`); if (el) el.focus(); }
  }

  /* ---------------- Início ---------------- */
  const Home = {
    title: 'Início',
    render() {
      const topR = [...D.RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 3);
      const topD = ['lisboa', 'fernando-de-noronha', 'kyoto'].map(id => D.DESTINATIONS.find(d => d.id === id));
      return `
        <section class="hero">
          ${ART.heroArt()}
          <div class="hero-inner">
          <span class="eyebrow accent">Transformar intenção em ação</span>
          <h1 class="hero-title">O que você tem em <span class="hl">mente?</span></h1>
          <p class="hero-sub">Sua intenção, transformada em ação.</p>
          <form class="intent-box" id="intent-form" autocomplete="off">
            <label for="intent-input" class="sr-only">Descreva o que você deseja</label>
            <textarea id="intent-input" rows="3" placeholder="Ex.: Quero encontrar um restaurante italiano com preço acessível para jantar." maxlength="300">${esc(S.get().lastQuery || '')}</textarea>
            <div class="intent-box-footer">
              <span class="hint">${icon('sparkle')}Escreva como você falaria. <kbd>Enter</kbd> para buscar</span>
              <button class="btn btn-primary btn-lg" type="submit">Encontrar ${icon('arrowRight')}</button>
            </div>
          </form>
          <div class="examples" aria-label="Exemplos de pedidos">
            ${EXAMPLES.map(e => `<button class="example" data-example="${esc(e)}">${esc(e)}</button>`).join('')}
          </div>
          </div>
        </section>

        <section class="access-grid" aria-label="Acessos principais">
          <a class="access-card" href="#/restaurantes">
            <span class="access-icon">${icon('utensils')}</span>
            <div><h2>Restaurantes</h2><p>Pesquise, filtre por categoria e preço, veja avaliações e compare opções.</p></div>
            <span class="access-cta">Explorar ${icon('arrowRight')}</span>
          </a>
          <a class="access-card alt" href="#/viagens">
            <span class="access-icon">${icon('plane')}</span>
            <div><h2>Viagens</h2><p>Descubra destinos, compare características e organize suas ideias de viagem.</p></div>
            <span class="access-cta">Explorar ${icon('arrowRight')}</span>
          </a>
        </section>

        <section class="section how">
          <h2 class="section-title">Como funciona</h2>
          <ol class="steps">
            <li><span>1</span><h3>Expresse</h3><p>Descreva em linguagem natural o que você procura.</p></li>
            <li><span>2</span><h3>Interpretamos</h3><p>Identificamos culinária, preço, ocasião, clima e outros critérios.</p></li>
            <li><span>3</span><h3>Aja</h3><p>Compare as opções compatíveis e salve suas escolhas.</p></li>
          </ol>
        </section>

        <section class="section">
          <div class="section-head"><h2 class="section-title">Restaurantes em destaque</h2><a class="link" href="#/restaurantes">Ver todos ${icon('arrowRight')}</a></div>
          <div class="grid">${topR.map(r => UI.restaurantCard(r)).join('')}</div>
        </section>
        <section class="section">
          <div class="section-head"><h2 class="section-title">Destinos para se inspirar</h2><a class="link" href="#/viagens">Ver todos ${icon('arrowRight')}</a></div>
          <div class="grid">${topD.map(d => UI.destinationCard(d)).join('')}</div>
        </section>`;
    },
    bind(root) {
      const input = root.querySelector('#intent-input');
      const submit = () => {
        const q = input.value.trim();
        if (!q) { input.focus(); input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); return; }
        go(searchHash(q));
      };
      root.querySelector('#intent-form').addEventListener('submit', e => { e.preventDefault(); submit(); });
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });
      root.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => go(searchHash(b.dataset.example))));
    }
  };

  /* ---------------- Restaurantes ---------------- */
  const rState = { q: '', cats: [], prices: [], meal: '', sort: 'relevancia', view: 'lista', pin: null };

  function filterRestaurants() {
    const q = AI.norm(rState.q);
    let list = D.RESTAURANTS.filter(r => {
      if (rState.cats.length && !rState.cats.includes(r.category)) return false;
      if (rState.prices.length && !rState.prices.includes(r.price)) return false;
      if (rState.meal && !r.meals.includes(rState.meal)) return false;
      if (q) {
        const hay = AI.norm([r.name, r.description, UI.category(r.category).label, r.neighborhood, r.highlights.join(' '), r.tags.map(t => D.RESTAURANT_TAGS[t]).join(' ')].join(' '));
        return q.split(' ').every(w => hay.includes(w));
      }
      return true;
    });
    const sorters = {
      relevancia: (a, b) => b.rating * Math.log(b.reviewsCount) - a.rating * Math.log(a.reviewsCount),
      avaliacao: (a, b) => b.rating - a.rating,
      'preco-asc': (a, b) => a.price - b.price || b.rating - a.rating,
      'preco-desc': (a, b) => b.price - a.price || b.rating - a.rating
    };
    return list.sort(sorters[rState.sort]);
  }

  const Restaurants = {
    title: 'Restaurantes',
    render() {
      return `
        ${UI.pageHeader('Restaurantes', 'Encontre onde comer', 'Pesquise, filtre e compare estabelecimentos de demonstração.', UI.demoBadge('Restaurantes e avaliações fictícios'))}
        <div class="toolbar">
          ${UI.searchField({ id: 'r-search', value: rState.q, placeholder: 'Buscar por nome, prato, bairro…', label: 'Buscar restaurantes' })}
          <div class="toolbar-right">
            ${UI.select({ id: 'r-meal', label: 'Refeição', value: rState.meal, options: [['', 'Todas'], ...Object.entries(D.MEALS)] })}
            ${UI.select({ id: 'r-sort', label: 'Ordenar', value: rState.sort, options: [['relevancia', 'Relevância'], ['avaliacao', 'Melhor avaliados'], ['preco-asc', 'Menor preço'], ['preco-desc', 'Maior preço']] })}
          </div>
        </div>
        <div id="r-dynamic"></div>`;
    },
    dynamic() {
      const list = filterRestaurants();
      const anyFilter = rState.q || rState.cats.length || rState.prices.length || rState.meal;
      const pinItem = list.find(r => r.id === rState.pin);
      return `
        <div class="filters">
          <div class="chip-row" role="group" aria-label="Categoria">
            ${UI.chip('Todas', { active: !rState.cats.length, attrs: 'data-cat="" data-focus="cat-all"' })}
            ${D.RESTAURANT_CATEGORIES.map(c => UI.chip(c.label, { active: rState.cats.includes(c.id), attrs: `data-cat="${c.id}" data-focus="cat-${c.id}"` })).join('')}
          </div>
          <div class="filter-line">
            <div class="segmented" role="group" aria-label="Faixa de preço">
              ${[1, 2, 3, 4].map(p => `<button class="${rState.prices.includes(p) ? 'is-active' : ''}" aria-pressed="${rState.prices.includes(p)}" data-price="${p}" data-focus="price-${p}" title="${D.PRICE_LEVELS[p].label}">${D.PRICE_LEVELS[p].symbol}</button>`).join('')}
            </div>
            <div class="view-toggle segmented" role="group" aria-label="Modo de visualização">
              <button class="${rState.view === 'lista' ? 'is-active' : ''}" data-view="lista" data-focus="view-lista">${icon('list')}Lista</button>
              <button class="${rState.view === 'mapa' ? 'is-active' : ''}" data-view="mapa" data-focus="view-mapa">${icon('map')}Mapa</button>
            </div>
          </div>
        </div>
        <div class="results-meta">
          <span>${list.length} ${list.length === 1 ? 'resultado' : 'resultados'}</span>
          ${anyFilter ? `<button class="link" data-clear data-focus="clear">${icon('x')}Limpar filtros</button>` : ''}
        </div>
        ${!list.length ? UI.emptyState('Nenhum restaurante encontrado', 'Tente remover alguns filtros ou buscar por outro termo.', '<button class="btn btn-secondary" data-clear>Limpar filtros</button>') :
          rState.view === 'mapa' ? `
            <div class="map-layout">
              <div class="map-frame">${ART.demoMap(list, { activeId: rState.pin, interactive: true })}<span class="map-note">${icon('info')}Mapa ilustrativo de cidade fictícia</span></div>
              <div class="map-side">
                ${pinItem ? UI.restaurantCard(pinItem) : `<div class="map-hint">${icon('pin')}<p>Selecione um marcador no mapa para ver o restaurante.</p></div>`}
                <ul class="map-list">${list.map(r => `<li><button class="${r.id === rState.pin ? 'is-active' : ''}" data-pin="${r.id}"><b>${esc(r.name)}</b><span>${UI.category(r.category).label} · ${D.PRICE_LEVELS[r.price].symbol} · ★ ${UI.fmtRating(r.rating)}</span></button></li>`).join('')}</ul>
              </div>
            </div>` :
          `<div class="grid">${list.map(r => UI.restaurantCard(r)).join('')}</div>`}`;
    },
    bind(root) {
      const dyn = root.querySelector('#r-dynamic');
      const refresh = () => rerender(dyn, Restaurants.dynamic());
      refresh();
      root.querySelector('#r-search').addEventListener('input', e => { rState.q = e.target.value; refresh(); });
      root.querySelector('#r-meal').addEventListener('change', e => { rState.meal = e.target.value; refresh(); });
      root.querySelector('#r-sort').addEventListener('change', e => { rState.sort = e.target.value; refresh(); });
      dyn.addEventListener('click', e => {
        const t = e.target.closest('button, [data-pin]');
        if (!t || !dyn.contains(t)) return;
        if (t.dataset.cat !== undefined) {
          const c = t.dataset.cat;
          rState.cats = !c ? [] : rState.cats.includes(c) ? rState.cats.filter(x => x !== c) : [...rState.cats, c];
        } else if (t.dataset.price) {
          const p = +t.dataset.price;
          rState.prices = rState.prices.includes(p) ? rState.prices.filter(x => x !== p) : [...rState.prices, p];
        } else if (t.dataset.view) {
          rState.view = t.dataset.view;
        } else if (t.dataset.pin) {
          rState.pin = t.dataset.pin;
        } else if (t.hasAttribute('data-clear')) {
          Object.assign(rState, { q: '', cats: [], prices: [], meal: '' });
          root.querySelector('#r-search').value = '';
          root.querySelector('#r-meal').value = '';
        } else return;
        refresh();
      });
      dyn.addEventListener('keydown', e => {
        const pin = e.target.closest('[data-pin]');
        if (pin && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); rState.pin = pin.dataset.pin; refresh(); }
      });
    }
  };

  /* ---------------- Detalhe do restaurante ---------------- */
  const RestaurantDetail = {
    title: p => (D.RESTAURANTS.find(r => r.id === p.id) || {}).name || 'Restaurante',
    render({ id }) {
      const r = D.RESTAURANTS.find(x => x.id === id);
      if (!r) return NotFound.render();
      const cat = UI.category(r.category);
      const dist = [5, 4, 3, 2, 1].map(n => ({ n, c: r.reviews.filter(v => v.rating === n).length }));
      const similar = D.RESTAURANTS.filter(x => x.id !== r.id && (x.category === r.category || Math.abs(x.price - r.price) === 0)).slice(0, 3);
      return `
        <nav class="breadcrumb" aria-label="Navegação estrutural"><a href="#/">Início</a>${icon('chevronRight')}<a href="#/restaurantes">Restaurantes</a>${icon('chevronRight')}<span>${esc(r.name)}</span></nav>
        <article class="detail">
          <div class="detail-hero">${ART.restaurantTile(r, cat)}</div>
          <div class="detail-head">
            <div>
              <span class="eyebrow accent">${cat.label} · ${esc(r.neighborhood)}</span>
              <h1>${esc(r.name)}</h1>
              <div class="meta-row lg">${UI.stars(r.rating, 'lg')}<b>${UI.fmtRating(r.rating)}</b><span class="muted">${r.reviewsCount} avaliações demonstrativas</span><span class="dot"></span>${UI.priceTag(r.price)}<span class="muted">${D.PRICE_LEVELS[r.price].label}</span></div>
            </div>
            <div class="detail-actions card-actions">${UI.actionButtons('restaurants', r.id)}</div>
          </div>
          ${UI.demoBadge('Estabelecimento fictício, criado para testes — não existe na vida real')}
          <div class="detail-grid">
            <div class="detail-main">
              <section class="panel">
                <h2>Sobre</h2><p>${esc(r.description)}</p>
                <div class="tag-row">${r.tags.map(t => `<span class="tag">${D.RESTAURANT_TAGS[t]}</span>`).join('')}</div>
              </section>
              <section class="panel">
                <h2>Destaques do cardápio</h2>
                <ul class="dish-list">${r.highlights.map(h => `<li>${icon('sparkle')}${esc(h)}</li>`).join('')}</ul>
              </section>
              <section class="panel">
                <div class="panel-head"><h2>Avaliações</h2><span class="demo-badge small">Demonstrativas</span></div>
                <div class="rating-summary">
                  <div class="rating-big"><b>${UI.fmtRating(r.rating)}</b>${UI.stars(r.rating)}<span class="muted">${r.reviewsCount} avaliações</span></div>
                  <div class="rating-bars">${dist.map(d => `<div><span>${d.n}</span><i><em style="width:${(d.c / r.reviews.length) * 100}%"></em></i></div>`).join('')}</div>
                </div>
                <ul class="reviews">${r.reviews.map(v => `
                  <li><div class="review-head"><span class="avatar">${v.author.split(' ').pop()}</span><div><b>${esc(v.author)}</b>${UI.stars(v.rating)}</div></div><p>${esc(v.text)}</p></li>`).join('')}
                </ul>
              </section>
            </div>
            <aside class="detail-side">
              <section class="panel">
                <h2>Informações</h2>
                <ul class="info-list">
                  <li>${icon('pin')}<div><b>Endereço fictício</b><span>${esc(r.address)} — ${esc(r.neighborhood)}</span></div></li>
                  <li>${icon('clock')}<div><b>Horário (demonstrativo)</b><span>${esc(r.hours)}</span></div></li>
                  <li>${icon('utensils')}<div><b>Refeições</b><span>${r.meals.map(m => D.MEALS[m]).join(' · ')}</span></div></li>
                  <li>${icon('wallet')}<div><b>Faixa de preço</b><span>${D.PRICE_LEVELS[r.price].symbol} · ${D.PRICE_LEVELS[r.price].label}</span></div></li>
                </ul>
              </section>
              <section class="panel">
                <h2>Localização</h2>
                <div class="map-frame small">${ART.demoMap([r], { activeId: r.id })}</div>
                <p class="muted small-text">${icon('info')}Localização demonstrativa em mapa ilustrativo. Não corresponde a um endereço real.</p>
              </section>
            </aside>
          </div>
        </article>
        ${similar.length ? `<section class="section"><h2 class="section-title">Opções semelhantes</h2><div class="grid">${similar.map(x => UI.restaurantCard(x)).join('')}</div></section>` : ''}`;
    }
  };

  /* ---------------- Viagens ---------------- */
  const tState = { q: '', types: [], region: '', budget: '', climate: '', sort: 'relevancia' };

  function filterDestinations() {
    const q = AI.norm(tState.q);
    const list = D.DESTINATIONS.filter(d => {
      if (tState.types.length && !tState.types.some(t => d.types.includes(t))) return false;
      if (tState.region && d.region !== tState.region) return false;
      if (tState.budget && d.budget > +tState.budget) return false;
      if (tState.climate && d.climate !== tState.climate) return false;
      if (q) {
        const hay = AI.norm([d.name, d.country, d.summary, d.description, d.highlights.join(' '), d.types.map(t => D.TRAVEL_TYPES[t]).join(' '), D.CONTINENTS[d.continent]].join(' '));
        return q.split(' ').every(w => hay.includes(w));
      }
      return true;
    });
    const sorters = {
      relevancia: () => 0,
      'custo-asc': (a, b) => a.budget - b.budget,
      'custo-desc': (a, b) => b.budget - a.budget,
      nome: (a, b) => a.name.localeCompare(b.name, 'pt-BR')
    };
    return list.sort(sorters[tState.sort]);
  }

  const Travel = {
    title: 'Viagens',
    render() {
      return `
        ${UI.pageHeader('Viagens', 'Para onde você quer ir?', 'Explore destinos, compare características e organize suas ideias.', UI.demoBadge('Informações indicativas para demonstração'))}
        <div class="toolbar">
          ${UI.searchField({ id: 't-search', value: tState.q, placeholder: 'Buscar destino, país ou experiência…', label: 'Buscar destinos' })}
          <div class="toolbar-right">
            ${UI.select({ id: 't-budget', label: 'Custo até', value: tState.budget, options: [['', 'Qualquer'], ...Object.entries(D.BUDGET_LEVELS).map(([k, v]) => [k, `${v.symbol} ${v.label}`])] })}
            ${UI.select({ id: 't-climate', label: 'Clima', value: tState.climate, options: [['', 'Qualquer'], ...Object.entries(D.CLIMATES)] })}
            ${UI.select({ id: 't-sort', label: 'Ordenar', value: tState.sort, options: [['relevancia', 'Relevância'], ['custo-asc', 'Menor custo'], ['custo-desc', 'Maior custo'], ['nome', 'Nome (A–Z)']] })}
          </div>
        </div>
        <div id="t-dynamic"></div>`;
    },
    dynamic() {
      const list = filterDestinations();
      const anyFilter = tState.q || tState.types.length || tState.region || tState.budget || tState.climate;
      return `
        <div class="filters">
          <div class="chip-row" role="group" aria-label="Tipo de viagem">
            ${UI.chip('Todos', { active: !tState.types.length, attrs: 'data-type="" data-focus="type-all"' })}
            ${Object.entries(D.TRAVEL_TYPES).map(([k, v]) => UI.chip(v, { active: tState.types.includes(k), attrs: `data-type="${k}" data-focus="type-${k}"` })).join('')}
          </div>
          <div class="filter-line">
            <div class="segmented" role="group" aria-label="Região">
              ${[['', 'Todos'], ['nacional', 'Nacional'], ['internacional', 'Internacional']].map(([k, v]) => `<button class="${tState.region === k ? 'is-active' : ''}" aria-pressed="${tState.region === k}" data-region="${k}" data-focus="region-${k}">${v}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="results-meta">
          <span>${list.length} ${list.length === 1 ? 'destino' : 'destinos'}</span>
          ${anyFilter ? `<button class="link" data-clear data-focus="clear">${icon('x')}Limpar filtros</button>` : ''}
        </div>
        ${list.length ? `<div class="grid">${list.map(d => UI.destinationCard(d)).join('')}</div>` :
          UI.emptyState('Nenhum destino encontrado', 'Ajuste os filtros para ver mais opções.', '<button class="btn btn-secondary" data-clear>Limpar filtros</button>')}`;
    },
    bind(root) {
      const dyn = root.querySelector('#t-dynamic');
      const refresh = () => rerender(dyn, Travel.dynamic());
      refresh();
      root.querySelector('#t-search').addEventListener('input', e => { tState.q = e.target.value; refresh(); });
      ['budget', 'climate', 'sort'].forEach(k => root.querySelector('#t-' + k).addEventListener('change', e => { tState[k] = e.target.value; refresh(); }));
      dyn.addEventListener('click', e => {
        const t = e.target.closest('button');
        if (!t || !dyn.contains(t)) return;
        if (t.dataset.type !== undefined) {
          const k = t.dataset.type;
          tState.types = !k ? [] : tState.types.includes(k) ? tState.types.filter(x => x !== k) : [...tState.types, k];
        } else if (t.dataset.region !== undefined) {
          tState.region = t.dataset.region;
        } else if (t.hasAttribute('data-clear')) {
          Object.assign(tState, { q: '', types: [], region: '', budget: '', climate: '' });
          ['search', 'budget', 'climate'].forEach(k => { root.querySelector('#t-' + k).value = ''; });
        } else return;
        refresh();
      });
    }
  };

  /* ---------------- Detalhe do destino ---------------- */
  const DestinationDetail = {
    title: p => (D.DESTINATIONS.find(d => d.id === p.id) || {}).name || 'Destino',
    render({ id }) {
      const d = D.DESTINATIONS.find(x => x.id === id);
      if (!d) return NotFound.render();
      const similar = D.DESTINATIONS.filter(x => x.id !== d.id && x.types.some(t => d.types.includes(t))).slice(0, 3);
      return `
        <nav class="breadcrumb" aria-label="Navegação estrutural"><a href="#/">Início</a>${icon('chevronRight')}<a href="#/viagens">Viagens</a>${icon('chevronRight')}<span>${esc(d.name)}</span></nav>
        <article class="detail">
          <div class="gallery">
            <div class="gallery-main" id="gallery-main">${ART.destinationScene(d, 0)}</div>
            <div class="gallery-thumbs" role="tablist" aria-label="Imagens do destino">
              ${ART.VARIANTS.map((v, i) => `<button role="tab" class="${i === 0 ? 'is-active' : ''}" aria-selected="${i === 0}" data-variant="${i}">${ART.destinationScene(d, i, false)}<span>${v.name}</span></button>`).join('')}
            </div>
          </div>
          <div class="detail-head">
            <div>
              <span class="eyebrow accent">${esc(d.country)} · ${D.CONTINENTS[d.continent]}</span>
              <h1>${esc(d.name)}</h1>
              <div class="tag-row">${d.types.map(t => `<span class="tag">${D.TRAVEL_TYPES[t]}</span>`).join('')}</div>
            </div>
            <div class="detail-actions card-actions">${UI.actionButtons('travel', d.id)}</div>
          </div>
          ${UI.demoBadge('Informações gerais e indicativas para demonstração — confirme em fontes oficiais antes de planejar')}
          <div class="detail-grid">
            <div class="detail-main">
              <section class="panel"><h2>Sobre o destino</h2><p>${esc(d.description)}</p></section>
              <section class="panel"><h2>Experiências marcantes</h2><ul class="dish-list">${d.highlights.map(h => `<li>${icon('sparkle')}${esc(h)}</li>`).join('')}</ul></section>
              <section class="panel"><h2>Combina com</h2><div class="tag-row">${d.companions.map(c => `<span class="tag">${icon('users')}${D.COMPANIONS[c]}</span>`).join('')}</div></section>
            </div>
            <aside class="detail-side">
              <section class="panel">
                <h2>Informações demonstrativas</h2>
                <ul class="info-list">
                  <li>${icon('calendar')}<div><b>Melhor época (indicativa)</b><span>${esc(d.bestSeason)}</span></div></li>
                  <li>${icon('clock')}<div><b>Duração sugerida</b><span>${d.days[0]} a ${d.days[1]} dias</span></div></li>
                  <li>${icon('wallet')}<div><b>Custo relativo</b><span>${D.BUDGET_LEVELS[d.budget].symbol} · ${D.BUDGET_LEVELS[d.budget].label}</span></div></li>
                  <li>${icon('sun')}<div><b>Clima predominante</b><span>${D.CLIMATES[d.climate]}</span></div></li>
                  <li>${icon('chat')}<div><b>Idioma</b><span>${esc(d.language)}</span></div></li>
                  <li>${icon('globe')}<div><b>Moeda</b><span>${esc(d.currency)}</span></div></li>
                </ul>
              </section>
            </aside>
          </div>
        </article>
        ${similar.length ? `<section class="section"><h2 class="section-title">Destinos semelhantes</h2><div class="grid">${similar.map(x => UI.destinationCard(x)).join('')}</div></section>` : ''}`;
    },
    bind(root, { id }) {
      const d = D.DESTINATIONS.find(x => x.id === id);
      if (!d) return;
      const main = root.querySelector('#gallery-main');
      root.querySelectorAll('[data-variant]').forEach(b => b.addEventListener('click', () => {
        main.innerHTML = ART.destinationScene(d, +b.dataset.variant);
        root.querySelectorAll('[data-variant]').forEach(x => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', x === b); });
      }));
    }
  };

  /* ---------------- Resultados ---------------- */
  const Results = {
    title: 'Resultados',
    render({ query }) {
      const q = (query.q || S.get().lastQuery || '').trim();
      const removed = (query.x || '').split(',').filter(Boolean);
      if (!q) {
        return `${UI.pageHeader('Resultados', 'Conte sua intenção', 'Descreva o que você procura e mostraremos as opções compatíveis.')}
          ${Results.searchBox('')}
          ${UI.emptyState('Nenhuma busca ainda', 'Experimente um dos exemplos abaixo.', `<div class="examples left">${EXAMPLES.map(e => `<button class="example" data-example="${esc(e)}">${esc(e)}</button>`).join('')}</div>`)}`;
      }
      const parsed = AI.parse(q);
      const criteria = parsed.criteria.filter(c => !removed.includes(c.key));
      const domain = parsed.domain;
      const r = domain !== 'travel' ? AI.matchRestaurants(criteria) : null;
      const t = domain !== 'restaurants' ? AI.matchDestinations(criteria) : null;
      const domainLabel = { restaurants: 'Restaurantes', travel: 'Viagens', all: 'Restaurantes e viagens' }[domain];
      const limit = criteria.length ? Infinity : 3;

      const block = (title, res, kind, link) => `
        <section class="section">
          <div class="section-head"><h2 class="section-title">${title} <span class="count">${Math.min(res.results.length, limit)}</span></h2><a class="link" href="${link}">Explorar todos ${icon('arrowRight')}</a></div>
          ${!res.exact ? `<div class="notice">${icon('info')}Não encontramos uma correspondência exata. Mostrando as opções mais próximas.</div>` : ''}
          ${res.results.length
            ? `<div class="grid">${res.results.slice(0, limit).map(x => kind === 'r' ? UI.restaurantCard(x.item, criteria.length ? x : {}) : UI.destinationCard(x.item, criteria.length ? x : {})).join('')}</div>`
            : UI.emptyState('Sem opções compatíveis', 'Remova algum critério acima para ampliar a busca.')}
        </section>`;

      return `
        ${UI.pageHeader('Resultados', 'Sua intenção', '')}
        ${Results.searchBox(q)}
        <section class="understood" aria-live="polite">
          <div class="understood-head">
            <span class="ai-mark">${icon('sparkle')}</span>
            <div><b>O que entendemos</b><span class="muted">Interpretação demonstrativa · Categoria: ${domainLabel}</span></div>
          </div>
          ${criteria.length
            ? `<div class="chip-row">${criteria.map(c => `<span class="criterion">${esc(c.label)}<button data-remove="${c.key}" aria-label="Remover critério ${esc(c.label)}">${icon('x')}</button></span>`).join('')}</div>`
            : `<p class="muted">Não identificamos critérios específicos${removed.length ? ' (todos foram removidos)' : ''}. Mostrando sugestões gerais — tente mencionar culinária, preço, ocasião, tipo de viagem ou clima.</p>`}
          ${removed.length ? `<button class="link" data-restore>${icon('arrowLeft')}Restaurar critérios removidos</button>` : ''}
        </section>
        ${r ? block('Restaurantes', r, 'r', '#/restaurantes') : ''}
        ${t ? block('Destinos', t, 't', '#/viagens') : ''}
        <p class="footnote">${icon('info')}Resultados baseados exclusivamente nos dados de demonstração do INTENT. Restaurantes e avaliações são fictícios.</p>`;
    },
    searchBox: q => `
      <form class="intent-box compact" id="results-form" autocomplete="off">
        <label for="results-input" class="sr-only">Refinar intenção</label>
        <input id="results-input" type="text" value="${esc(q)}" placeholder="O que você tem em mente?" maxlength="300" />
        <button class="btn btn-primary" type="submit">Encontrar</button>
      </form>`,
    bind(root, { query }) {
      const form = root.querySelector('#results-form');
      form.addEventListener('submit', e => {
        e.preventDefault();
        const v = root.querySelector('#results-input').value.trim();
        if (v) go(searchHash(v));
      });
      const q = query.q || S.get().lastQuery || '';
      if (query.q) S.setLastQuery(query.q);
      const removed = (query.x || '').split(',').filter(Boolean);
      root.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => {
        go(searchHash(q) + '&x=' + encodeURIComponent([...removed, b.dataset.remove].join(',')));
      }));
      const restore = root.querySelector('[data-restore]');
      if (restore) restore.addEventListener('click', () => go(searchHash(q)));
      root.querySelectorAll('[data-example]').forEach(b => b.addEventListener('click', () => go(searchHash(b.dataset.example))));
    }
  };

  /* ---------------- Comparar ---------------- */
  const Compare = {
    title: 'Comparar',
    render({ type }) {
      const kind = type === 'viagens' ? 'travel' : 'restaurants';
      const ids = S.get().compare[kind];
      const tabs = `
        <div class="segmented tabs" role="tablist">
          <a role="tab" href="#/comparar/restaurantes" class="${kind === 'restaurants' ? 'is-active' : ''}">Restaurantes (${S.get().compare.restaurants.length})</a>
          <a role="tab" href="#/comparar/viagens" class="${kind === 'travel' ? 'is-active' : ''}">Destinos (${S.get().compare.travel.length})</a>
        </div>`;
      const header = UI.pageHeader('Comparar', 'Compare lado a lado', `Selecione até ${S.MAX_COMPARE} opções usando o botão “Comparar”.`, tabs);
      if (!ids.length) {
        return header + UI.emptyState('Nada para comparar ainda', 'Adicione opções à comparação a partir das listas ou dos detalhes.',
          `<a class="btn btn-primary" href="${kind === 'restaurants' ? '#/restaurantes' : '#/viagens'}">Explorar ${kind === 'restaurants' ? 'restaurantes' : 'destinos'}</a>`);
      }
      let rows, items;
      if (kind === 'restaurants') {
        items = ids.map(id => D.RESTAURANTS.find(r => r.id === id)).filter(Boolean);
        const best = Math.max(...items.map(i => i.rating)), cheap = Math.min(...items.map(i => i.price));
        rows = [
          ['Categoria', i => UI.category(i.category).label],
          ['Avaliação', i => `${UI.stars(i.rating)} <b>${UI.fmtRating(i.rating)}</b>${i.rating === best && items.length > 1 ? '<span class="best">Melhor nota</span>' : ''}`],
          ['Nº de avaliações', i => i.reviewsCount],
          ['Preço', i => `${UI.priceTag(i.price)} ${D.PRICE_LEVELS[i.price].label}${i.price === cheap && items.length > 1 ? '<span class="best">Mais acessível</span>' : ''}`],
          ['Refeições', i => i.meals.map(m => D.MEALS[m]).join(', ')],
          ['Ambiente', i => i.tags.map(t => D.RESTAURANT_TAGS[t]).join(', ')],
          ['Bairro (fictício)', i => esc(i.neighborhood)],
          ['Horário', i => esc(i.hours)]
        ];
      } else {
        items = ids.map(id => D.DESTINATIONS.find(d => d.id === id)).filter(Boolean);
        const cheap = Math.min(...items.map(i => i.budget));
        rows = [
          ['País', i => esc(i.country)],
          ['Tipo', i => i.types.map(t => D.TRAVEL_TYPES[t]).join(', ')],
          ['Custo relativo', i => `${UI.priceTag(i.budget, D.BUDGET_LEVELS)} ${D.BUDGET_LEVELS[i.budget].label}${i.budget === cheap && items.length > 1 ? '<span class="best">Menor custo</span>' : ''}`],
          ['Clima', i => D.CLIMATES[i.climate]],
          ['Duração sugerida', i => `${i.days[0]}–${i.days[1]} dias`],
          ['Melhor época', i => esc(i.bestSeason)],
          ['Combina com', i => i.companions.map(c => D.COMPANIONS[c]).join(', ')],
          ['Idioma', i => esc(i.language)]
        ];
      }
      const base = kind === 'restaurants' ? '#/restaurantes/' : '#/viagens/';
      return `${header}
        <div class="compare-wrap">
          <table class="compare-table" style="--cols:${items.length}">
            <thead><tr><th scope="col"><span class="sr-only">Critério</span></th>${items.map(i => `
              <th scope="col">
                <div class="compare-media">${kind === 'restaurants' ? ART.restaurantTile(i, UI.category(i.category)) : ART.destinationScene(i, 0, false)}</div>
                <a href="${base}${i.id}" class="compare-name">${esc(i.name)}</a>
                <button class="link danger" data-uncompare="${i.id}">${icon('x')}Remover</button>
              </th>`).join('')}</tr></thead>
            <tbody>${rows.map(([label, fn]) => `<tr><th scope="row">${label}</th>${items.map(i => `<td>${fn(i)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>
        <div class="compare-footer">
          <button class="btn btn-secondary" data-clear-compare>${icon('trash')}Limpar comparação</button>
          ${items.length < S.MAX_COMPARE ? `<a class="btn btn-ghost" href="${kind === 'restaurants' ? '#/restaurantes' : '#/viagens'}">${icon('plus')}Adicionar opção</a>` : ''}
        </div>
        ${kind === 'restaurants' ? `<p class="footnote">${icon('info')}Comparação entre restaurantes fictícios.</p>` : `<p class="footnote">${icon('info')}Valores indicativos para demonstração.</p>`}`;
    },
    bind(root, { type }) {
      const kind = type === 'viagens' ? 'travel' : 'restaurants';
      root.querySelectorAll('[data-uncompare]').forEach(b => b.addEventListener('click', () => { S.toggleCompare(kind, b.dataset.uncompare); window.INTENT_APP.render(); }));
      const clear = root.querySelector('[data-clear-compare]');
      if (clear) clear.addEventListener('click', () => { S.clearCompare(kind); window.INTENT_APP.render(); });
    }
  };

  /* ---------------- Minhas ideias ---------------- */
  const STAGES = [['ideia', 'Ideias'], ['planejando', 'Planejando'], ['decidido', 'Decidido']];

  const Ideas = {
    title: 'Minhas ideias',
    render() {
      const st = S.get();
      const favs = st.favorites.map(id => D.RESTAURANTS.find(r => r.id === id)).filter(Boolean);
      const suggestions = D.DESTINATIONS.filter(d => !S.hasIdea(d.id)).slice(0, 4);
      const ideaCard = (i, idx) => {
        const d = i.destId ? D.DESTINATIONS.find(x => x.id === i.destId) : null;
        const s = STAGES.findIndex(([k]) => k === i.stage);
        return `
          <li class="idea" data-idea="${i.id}">
            ${d ? `<a class="idea-media" href="#/viagens/${d.id}">${ART.destinationScene(d, 0, false)}</a>` : `<div class="idea-media free">${icon('sparkle')}</div>`}
            <div class="idea-body">
              ${d ? `<a class="idea-title" href="#/viagens/${d.id}">${esc(d.name)}</a><span class="muted small-text">${esc(d.country)}</span>` : `<span class="idea-title">${esc(i.title)}</span><span class="muted small-text">Ideia livre</span>`}
              <label class="sr-only" for="note-${i.id}">Anotações</label>
              <textarea id="note-${i.id}" class="idea-note" data-note="${i.id}" rows="2" placeholder="Anotações, datas, quem vai…">${esc(i.note)}</textarea>
              <div class="idea-actions">
                <button class="icon-btn sm" data-move="${i.id}" data-dir="-1" ${s === 0 ? 'disabled' : ''} aria-label="Mover para etapa anterior">${icon('chevronLeft')}</button>
                <button class="icon-btn sm" data-move="${i.id}" data-dir="1" ${s === STAGES.length - 1 ? 'disabled' : ''} aria-label="Mover para próxima etapa">${icon('chevronRight')}</button>
                <button class="icon-btn sm danger" data-remove-idea="${i.id}" aria-label="Remover ideia">${icon('trash')}</button>
              </div>
            </div>
          </li>`;
      };
      return `
        ${UI.pageHeader('Organizar', 'Minhas ideias', 'Organize destinos por etapa, faça anotações e acompanhe seus restaurantes salvos. Tudo fica salvo apenas neste navegador.')}
        <form class="add-idea" id="add-idea" autocomplete="off">
          <label for="idea-title" class="sr-only">Nova ideia de viagem</label>
          <input id="idea-title" type="text" maxlength="80" placeholder="Adicionar ideia livre (ex.: Viagem de aniversário em março)" />
          <button class="btn btn-primary" type="submit">${icon('plus')}Adicionar</button>
        </form>
        <div class="board">
          ${STAGES.map(([k, label]) => {
            const items = st.ideas.filter(i => i.stage === k);
            return `<section class="column"><header><h2>${label}</h2><span class="count">${items.length}</span></header>
              ${items.length ? `<ul>${items.map(ideaCard).join('')}</ul>` : `<p class="column-empty">${k === 'ideia' ? 'Salve destinos ou adicione uma ideia livre.' : 'Mova ideias para cá com as setas.'}</p>`}
            </section>`;
          }).join('')}
        </div>
        ${suggestions.length ? `
          <section class="section">
            <h2 class="section-title">Sugestões para começar</h2>
            <div class="suggest-row">${suggestions.map(d => `
              <button class="suggest" data-add-dest="${d.id}">${ART.destinationScene(d, 0, false)}<span><b>${esc(d.name)}</b>${icon('plus')}</span></button>`).join('')}
            </div>
          </section>` : ''}
        <section class="section">
          <div class="section-head"><h2 class="section-title">Restaurantes salvos <span class="count">${favs.length}</span></h2></div>
          ${favs.length ? `<div class="grid">${favs.map(r => UI.restaurantCard(r)).join('')}</div>` :
            UI.emptyState('Nenhum restaurante salvo', 'Toque no coração de um restaurante para salvá-lo aqui.', '<a class="btn btn-secondary" href="#/restaurantes">Ver restaurantes</a>')}
        </section>`;
    },
    bind(root) {
      const rerenderPage = () => window.INTENT_APP.render(true);
      root.querySelector('#add-idea').addEventListener('submit', e => {
        e.preventDefault();
        const input = root.querySelector('#idea-title');
        const v = input.value.trim();
        if (!v) { input.focus(); return; }
        S.addIdea({ title: v });
        UI.toast('Ideia adicionada');
        rerenderPage();
      });
      root.querySelectorAll('[data-note]').forEach(t => t.addEventListener('input', () => S.updateIdea(t.dataset.note, { note: t.value }, true)));
      root.querySelectorAll('[data-move]').forEach(b => b.addEventListener('click', () => {
        const idea = S.get().ideas.find(i => i.id === b.dataset.move);
        const s = STAGES.findIndex(([k]) => k === idea.stage) + +b.dataset.dir;
        if (STAGES[s]) { S.updateIdea(idea.id, { stage: STAGES[s][0] }); UI.toast(`Movido para “${STAGES[s][1]}”`); rerenderPage(); }
      }));
      root.querySelectorAll('[data-remove-idea]').forEach(b => b.addEventListener('click', () => { S.removeIdea(b.dataset.removeIdea); UI.toast('Ideia removida'); rerenderPage(); }));
      root.querySelectorAll('[data-add-dest]').forEach(b => b.addEventListener('click', () => { S.addIdea({ destId: b.dataset.addDest }); UI.toast('Destino adicionado às ideias'); rerenderPage(); }));
    }
  };

  /* ---------------- 404 ---------------- */
  const NotFound = {
    title: 'Página não encontrada',
    render: () => UI.emptyState('Página não encontrada', 'O endereço acessado não existe nesta demonstração.', '<a class="btn btn-primary" href="#/">Voltar ao início</a>')
  };

  window.INTENT_VIEWS = { Home, Restaurants, RestaurantDetail, Travel, DestinationDetail, Results, Compare, Ideas, NotFound };
})();
