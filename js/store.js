/* INTENT — Estado da aplicação, persistido apenas no navegador (localStorage). */
(function () {
  const KEY = 'intent.v1';
  const MAX_COMPARE = 3;
  const listeners = new Set();

  const defaults = () => ({
    favorites: [],
    compare: { restaurants: [], travel: [] },
    ideas: [],
    lastQuery: ''
  });

  let state;
  try { state = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY)) || {}); }
  catch (e) { state = defaults(); }

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* armazenamento indisponível */ }
    listeners.forEach(fn => fn(state));
  };

  const Store = {
    get: () => state,
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
    MAX_COMPARE,

    isFavorite: id => state.favorites.includes(id),
    toggleFavorite(id) {
      const on = !state.favorites.includes(id);
      state.favorites = on ? [...state.favorites, id] : state.favorites.filter(x => x !== id);
      save();
      return on;
    },

    inCompare: (type, id) => state.compare[type].includes(id),
    toggleCompare(type, id) {
      const list = state.compare[type];
      if (list.includes(id)) { state.compare[type] = list.filter(x => x !== id); save(); return 'removed'; }
      if (list.length >= MAX_COMPARE) return 'full';
      state.compare[type] = [...list, id];
      save();
      return 'added';
    },
    clearCompare(type) { state.compare[type] = []; save(); },

    hasIdea: destId => state.ideas.some(i => i.destId === destId),
    addIdea({ destId = null, title = '' }) {
      if (destId && Store.hasIdea(destId)) return false;
      state.ideas = [...state.ideas, { id: 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), destId, title, note: '', stage: 'ideia' }];
      save();
      return true;
    },
    updateIdea(id, patch, silent = false) {
      state.ideas = state.ideas.map(i => (i.id === id ? { ...i, ...patch } : i));
      if (silent) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* noop */ } }
      else save();
    },
    removeIdea(id) { state.ideas = state.ideas.filter(i => i.id !== id); save(); },
    removeIdeaByDest(destId) { state.ideas = state.ideas.filter(i => i.destId !== destId); save(); },

    setLastQuery(q) { state.lastQuery = q; save(); }
  };

  window.INTENT_STORE = Store;
})();
