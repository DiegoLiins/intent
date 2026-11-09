/* INTENT — Roteador (hash), ações globais e barra de comparação. */
(function () {
  const V = window.INTENT_VIEWS, S = window.INTENT_STORE, UI = window.INTENT_UI, D = window.INTENT_DATA;
  const root = document.getElementById('app');

  const routes = [
    [/^\/?$/, V.Home, () => ({}), 'inicio'],
    [/^\/restaurantes\/?$/, V.Restaurants, () => ({}), 'restaurantes'],
    [/^\/restaurantes\/([\w-]+)$/, V.RestaurantDetail, m => ({ id: m[1] }), 'restaurantes'],
    [/^\/viagens\/?$/, V.Travel, () => ({}), 'viagens'],
    [/^\/viagens\/([\w-]+)$/, V.DestinationDetail, m => ({ id: m[1] }), 'viagens'],
    [/^\/resultados\/?$/, V.Results, () => ({}), 'resultados'],
    [/^\/comparar(?:\/(restaurantes|viagens))?\/?$/, V.Compare, m => ({ type: m[1] || (S.get().compare.restaurants.length || !S.get().compare.travel.length ? 'restaurantes' : 'viagens') }), 'comparar'],
    [/^\/ideias\/?$/, V.Ideas, () => ({}), 'ideias']
  ];

  function parseHash() {
    const h = location.hash.replace(/^#/, '') || '/';
    const [path, qs = ''] = h.split('?');
    const query = Object.fromEntries(new URLSearchParams(qs));
    return { path, query };
  }

  let lastPath = null;
  function render(keepScroll = false) {
    const { path, query } = parseHash();
    let view = V.NotFound, params = {}, section = '';
    for (const [re, v, mk, sec] of routes) {
      const m = path.match(re);
      if (m) { view = v; params = mk(m); section = sec; break; }
    }
    params.query = query;
    const y = window.scrollY;
    root.innerHTML = `<div class="view">${view.render(params)}</div>`;
    if (view.bind) view.bind(root, params);
    const title = typeof view.title === 'function' ? view.title(params) : view.title;
    document.title = `${title} · INTENT`;
    document.querySelectorAll('[data-nav]').forEach(a => {
      const on = a.dataset.nav === section;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const samePage = path === lastPath;
    if (!keepScroll && !samePage) window.scrollTo(0, 0); else window.scrollTo(0, y);
    if (!samePage) root.focus({ preventScroll: true });
    lastPath = path;
    closeMenu();
    updateChrome(section);
  }

  /* Ações globais: salvar, ideias e comparação (delegação de eventos). */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    e.preventDefault();
    const { action, id, type } = btn.dataset;
    if (action === 'favorite') {
      UI.toast(S.toggleFavorite(id) ? 'Restaurante salvo em Minhas ideias' : 'Restaurante removido dos salvos');
    } else if (action === 'idea') {
      if (S.hasIdea(id)) { S.removeIdeaByDest(id); UI.toast('Destino removido das ideias'); }
      else { S.addIdea({ destId: id }); UI.toast('Destino salvo em Minhas ideias'); }
    } else if (action === 'compare') {
      const r = S.toggleCompare(type, id);
      if (r === 'full') UI.toast(`Você pode comparar até ${S.MAX_COMPARE} opções`);
      else UI.toast(r === 'added' ? 'Adicionado à comparação' : 'Removido da comparação');
    }
    const { path } = parseHash();
    if (/^\/ideias/.test(path)) { render(true); return; }
    refreshActions(id, type || (action === 'favorite' ? 'restaurants' : 'travel'));
  });

  function refreshActions(id, type) {
    document.querySelectorAll(`[data-action][data-id="${id}"]`).forEach(b => {
      const box = b.closest('.card-actions');
      if (box && !box.dataset.refreshed) { box.dataset.refreshed = '1'; box.innerHTML = UI.actionButtons(type, id); delete box.dataset.refreshed; }
    });
  }

  /* Barra flutuante de comparação + contadores do menu. */
  function updateChrome(section) {
    const st = S.get();
    const bar = document.getElementById('compare-bar');
    const parts = [['restaurants', 'restaurantes', 'restaurante', D.RESTAURANTS], ['travel', 'viagens', 'destino', D.DESTINATIONS]]
      .filter(([k]) => st.compare[k].length);
    if (!parts.length || section === 'comparar') {
      bar.classList.remove('is-visible');
    } else {
      bar.innerHTML = parts.map(([k, slug, noun, list]) => {
        const n = st.compare[k].length;
        const names = st.compare[k].map(id => (list.find(x => x.id === id) || {}).name).filter(Boolean);
        return `<div class="compare-group">
          <div class="compare-info"><b>${n} ${noun}${n > 1 ? 's' : ''}</b><span>${UI.esc(names.join(' · '))}</span></div>
          <button class="icon-btn sm" data-bar-clear="${k}" aria-label="Limpar comparação">${UI.icon('x')}</button>
          <a class="btn btn-primary btn-sm" href="#/comparar/${slug}">Comparar${n < 2 ? '' : ` (${n})`}</a>
        </div>`;
      }).join('');
      bar.classList.add('is-visible');
    }
    const ideasCount = st.ideas.length + st.favorites.length;
    document.querySelectorAll('[data-ideas-count]').forEach(el => { el.textContent = ideasCount; el.hidden = !ideasCount; });
  }

  document.getElementById('compare-bar').addEventListener('click', e => {
    const b = e.target.closest('[data-bar-clear]');
    if (b) { S.clearCompare(b.dataset.barClear); UI.toast('Comparação limpa'); refreshAllActions(); }
  });

  function refreshAllActions() {
    document.querySelectorAll('.card-actions').forEach(box => {
      const b = box.querySelector('[data-action="compare"]');
      if (b) box.innerHTML = UI.actionButtons(b.dataset.type, b.dataset.id);
    });
  }

  S.subscribe(() => {
    const { path } = parseHash();
    const sec = (routes.find(([re]) => re.test(path)) || [])[3] || '';
    updateChrome(sec);
  });

  /* Menu móvel */
  const header = document.querySelector('.site-header');
  const toggle = document.getElementById('menu-toggle');
  function closeMenu() { header.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => {
    const open = !header.classList.contains('menu-open');
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

  window.addEventListener('hashchange', () => render());
  window.INTENT_APP = { render };
  render();
})();
