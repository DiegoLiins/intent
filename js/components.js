/* INTENT — Componentes reutilizáveis (funções que retornam HTML). */
(function () {
  const D = window.INTENT_DATA, ART = window.INTENT_ART, S = window.INTENT_STORE;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const P = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    compare: '<rect x="3.5" y="5" width="7" height="14" rx="1.5"/><rect x="13.5" y="5" width="7" height="14" rx="1.5"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    map: '<path d="M9 4.5L3.5 6.5v13l5.5-2 6 2 5.5-2v-13l-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 12.5h2M3 9h18"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
    chat: '<path d="M4 5.5h16v10H9l-5 4z"/>',
    utensils: '<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7h3.5"/>',
    plane: '<path d="M21 15.5l-8-4.5V5a1.5 1.5 0 0 0-3 0v6l-7 4.5V17l7-2v4l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-4l8 2z"/>',
    bookmark: '<path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/>',
    trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    chevronLeft: '<path d="M15 5l-7 7 7 7"/>',
    chevronRight: '<path d="M9 5l7 7-7 7"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>',
    users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><path d="M16 5.5a3 3 0 0 1 0 6M18 14.5c1.7.6 2.8 2.2 3 5"/>'
  };

  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${P[name] || ''}</svg>`;

  const fmtRating = n => n.toFixed(1).replace('.', ',');

  const stars = (rating, size = '') => {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    return `<span class="stars ${size}" aria-label="Nota ${fmtRating(rating)} de 5"><span class="stars-bg">★★★★★</span><span class="stars-fg" style="width:${pct}%">★★★★★</span></span>`;
  };

  const priceTag = (level, map = D.PRICE_LEVELS) => {
    const symbol = map[level].symbol;
    return `<span class="price" title="${map[level].label}"><b>${symbol}</b><i>${'$'.repeat(4 - symbol.length)}</i></span>`;
  };

  const category = id => D.RESTAURANT_CATEGORIES.find(c => c.id === id);

  const demoBadge = (text = 'Dados fictícios') => `<span class="demo-badge">${icon('info')}${text}</span>`;

  const matchBadge = score => score > 0 ? `<span class="match">${Math.round(score * 100)}% compatível</span>` : '';

  function actionButtons(type, id) {
    const inCmp = S.inCompare(type, id);
    const fav = type === 'restaurants' ? S.isFavorite(id) : S.hasIdea(id);
    const favLabel = type === 'restaurants' ? (fav ? 'Salvo' : 'Salvar') : (fav ? 'Nas ideias' : 'Salvar ideia');
    return `
      <button class="icon-btn${fav ? ' is-on' : ''}" data-action="${type === 'restaurants' ? 'favorite' : 'idea'}" data-id="${id}" aria-pressed="${fav}" title="${favLabel}">
        ${icon(type === 'restaurants' ? 'heart' : 'bookmark')}<span class="sr-only">${favLabel}</span>
      </button>
      <button class="pill-btn${inCmp ? ' is-on' : ''}" data-action="compare" data-type="${type}" data-id="${id}" aria-pressed="${inCmp}">
        ${icon(inCmp ? 'check' : 'compare')}<span>${inCmp ? 'Comparando' : 'Comparar'}</span>
      </button>`;
  }

  function restaurantCard(r, extra = {}) {
    const cat = category(r.category);
    return `
      <article class="card" data-card="${r.id}">
        <a class="card-media" href="#/restaurantes/${r.id}" tabindex="-1" aria-hidden="true">${ART.restaurantTile(r, cat)}</a>
        <div class="card-body">
          <div class="card-top">
            <span class="eyebrow">${cat.label} · ${esc(r.neighborhood)}</span>
            ${extra.score != null ? matchBadge(extra.score) : ''}
          </div>
          <h3 class="card-title"><a href="#/restaurantes/${r.id}">${esc(r.name)}</a></h3>
          <div class="meta-row">
            ${stars(r.rating)}<span class="muted">${fmtRating(r.rating)} (${r.reviewsCount})</span>
            <span class="dot"></span>${priceTag(r.price)}
          </div>
          ${extra.reasons && extra.reasons.length
            ? `<ul class="reasons">${extra.reasons.slice(0, 3).map(x => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>`
            : `<p class="card-text">${esc(r.description)}</p>`}
          <div class="card-actions">${actionButtons('restaurants', r.id)}</div>
        </div>
      </article>`;
  }

  function destinationCard(d, extra = {}) {
    return `
      <article class="card" data-card="${d.id}">
        <a class="card-media" href="#/viagens/${d.id}" tabindex="-1" aria-hidden="true">${ART.destinationScene(d, 0)}</a>
        <div class="card-body">
          <div class="card-top">
            <span class="eyebrow">${esc(d.country)} · ${d.region === 'nacional' ? 'Nacional' : 'Internacional'}</span>
            ${extra.score != null ? matchBadge(extra.score) : ''}
          </div>
          <h3 class="card-title"><a href="#/viagens/${d.id}">${esc(d.name)}</a></h3>
          <div class="tag-row">${d.types.slice(0, 3).map(t => `<span class="tag">${D.TRAVEL_TYPES[t]}</span>`).join('')}</div>
          ${extra.reasons && extra.reasons.length
            ? `<ul class="reasons">${extra.reasons.slice(0, 3).map(x => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>`
            : `<p class="card-text">${esc(d.summary)}</p>`}
          <div class="meta-row small">
            <span title="Custo relativo indicativo">${icon('wallet')}${priceTag(d.budget, D.BUDGET_LEVELS)}</span>
            <span>${icon('calendar')}${d.days[0]}–${d.days[1]} dias</span>
          </div>
          <div class="card-actions">${actionButtons('travel', d.id)}</div>
        </div>
      </article>`;
  }

  const chip = (label, { active = false, attrs = '' } = {}) =>
    `<button class="chip${active ? ' is-active' : ''}" aria-pressed="${active}" ${attrs}>${label}</button>`;

  const emptyState = (title, text, action = '') => `
    <div class="empty">
      <div class="empty-icon">${icon('sparkle')}</div>
      <h3>${title}</h3><p>${text}</p>${action}
    </div>`;

  const pageHeader = (eyebrow, title, text, aside = '') => `
    <header class="page-header">
      <div><span class="eyebrow accent">${eyebrow}</span><h1>${title}</h1>${text ? `<p class="lead">${text}</p>` : ''}</div>
      ${aside}
    </header>`;

  const searchField = ({ id, value = '', placeholder, label }) => `
    <label class="search-field" for="${id}">
      ${icon('search')}<span class="sr-only">${label}</span>
      <input id="${id}" type="search" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off" />
    </label>`;

  const select = ({ id, label, value, options }) => `
    <label class="select-field"><span>${label}</span>
      <select id="${id}">${options.map(([v, l]) => `<option value="${v}"${String(v) === String(value) ? ' selected' : ''}>${l}</option>`).join('')}</select>
    </label>`;

  let toastTimer;
  function toast(message) {
    const el = document.getElementById('toast');
    el.innerHTML = `${icon('check')}<span>${esc(message)}</span>`;
    el.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2400);
  }

  window.INTENT_UI = {
    esc, icon, stars, priceTag, fmtRating, category, demoBadge, restaurantCard, destinationCard,
    chip, emptyState, pageHeader, searchField, select, toast, actionButtons, matchBadge
  };
})();
