/* INTENT — Ilustrações vetoriais geradas localmente (sem imagens externas). */
(function () {
  let uid = 0;

  const VARIANTS = [
    { name: 'Dia', tint: null },
    { name: 'Entardecer', tint: ['#F79D65', '#FDE2C8'], overlay: 'rgba(247,120,80,0.10)' },
    { name: 'Noite', tint: ['#1E1B4B', '#4C4699'], overlay: 'rgba(20,18,60,0.35)', night: true }
  ];

  function mountains(color, peak, h = 1) {
    return `
      <path d="M0 ${200 - 40 * h} L70 ${120 - 30 * h} L130 ${185 - 30 * h} L200 ${95 - 35 * h} L270 ${175 - 30 * h} L330 ${115 - 30 * h} L400 ${180 - 30 * h} L400 260 L0 260Z" fill="${peak}" opacity=".75"/>
      <path d="M0 230 L90 150 L160 210 L240 140 L320 205 L400 160 L400 260 L0 260Z" fill="${color}"/>`;
  }

  function sceneBody(s, night) {
    const land = s.land, sea = s.sea || '#4A90C2';
    switch (s.kind) {
      case 'beach':
        return `
          <rect y="150" width="400" height="60" fill="${sea}"/>
          <path d="M0 160 Q50 152 100 160 T200 160 T300 160 T400 160" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>
          <path d="M0 178 Q50 170 100 178 T200 178 T300 178 T400 178" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>
          <path d="M0 205 Q120 185 230 200 T400 195 L400 260 L0 260Z" fill="${land}"/>
          <g transform="translate(320 120)">
            <path d="M8 90 Q12 40 2 0" stroke="#6B4F2A" stroke-width="5" fill="none" stroke-linecap="round"/>
            <path d="M2 0 Q-30 -6 -44 14 M2 0 Q32 -10 46 10 M2 0 Q-14 -24 -34 -26 M2 0 Q20 -26 40 -22" stroke="#2F7D4F" stroke-width="7" fill="none" stroke-linecap="round"/>
          </g>`;
      case 'dunes':
        return `
          <rect y="160" width="400" height="40" fill="${sea}"/>
          <path d="M0 190 Q90 120 190 175 T400 165 L400 260 L0 260Z" fill="${land}"/>
          <path d="M0 225 Q120 185 250 215 T400 210 L400 260 L0 260Z" fill="#E8C27E"/>`;
      case 'mountain':
        return `${mountains(land, s.peak)}
          <g fill="${night ? '#FFE08A' : '#7A5236'}">
            <rect x="60" y="205" width="34" height="26" rx="2"/><path d="M55 207 L77 188 L99 207Z" fill="#5A3B26"/>
            <rect x="290" y="200" width="40" height="30" rx="2"/><path d="M285 202 L310 180 L335 202Z" fill="#5A3B26"/>
          </g>`;
      case 'canyon':
        return `
          <path d="M0 140 L60 140 L60 120 L150 120 L150 150 L230 150 L230 110 L330 110 L330 135 L400 135 L400 260 L0 260Z" fill="${s.peak}"/>
          <path d="M0 200 L110 200 L110 180 L200 180 L200 210 L300 210 L300 190 L400 190 L400 260 L0 260Z" fill="${land}"/>
          <path d="M248 150 L252 150 L256 230 L244 230Z" fill="#BFE3F2" opacity=".85"/>`;
      case 'glacier':
        return `${mountains(land, s.peak, 1.2)}
          <path d="M120 200 L180 150 L250 155 L300 200Z" fill="#E9F5FC"/>
          <rect y="215" width="400" height="45" fill="${sea}"/>
          <path d="M150 215 L170 200 L230 200 L260 215Z" fill="#FFFFFF" opacity=".9"/>`;
      case 'snow':
        return `
          <path d="M0 190 L80 90 L140 160 L210 70 L280 150 L340 100 L400 170 L400 260 L0 260Z" fill="${s.peak}"/>
          <path d="M80 90 L95 110 L70 112Z M210 70 L230 96 L192 96Z M340 100 L352 116 L328 116Z" fill="#fff"/>
          <path d="M0 220 Q100 190 200 215 T400 205 L400 260 L0 260Z" fill="${land}"/>
          <g fill="#2E5E4E">${[40, 70, 300, 340, 365].map(x => `<path d="M${x} 228 L${x + 10} 200 L${x + 20} 228Z"/>`).join('')}</g>`;
      case 'city':
        return `
          <path d="M0 200 Q100 150 200 175 T400 160 L400 260 L0 260Z" fill="${land}" opacity=".6"/>
          ${[[20, 170, 40], [65, 160, 34], [105, 175, 44], [155, 150, 38], [198, 168, 42], [246, 158, 36], [288, 172, 46], [340, 162, 40]].map(([x, y, w], i) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${260 - y}" rx="3" fill="${['#F4E1C1', '#F2C6A0', '#EAD7B7', '#F7D9A8'][i % 4]}"/>
             <path d="M${x - 3} ${y} L${x + w / 2} ${y - 14} L${x + w + 3} ${y}Z" fill="#C8553D"/>
             ${[0, 1, 2].map(r => `<rect x="${x + 8}" y="${y + 14 + r * 22}" width="8" height="10" fill="${night ? '#FFE08A' : '#7FA7C9'}"/><rect x="${x + w - 16}" y="${y + 14 + r * 22}" width="8" height="10" fill="${night ? '#FFE08A' : '#7FA7C9'}"/>`).join('')}`).join('')}
          <rect x="120" y="226" width="56" height="22" rx="5" fill="${s.accent}"/><circle cx="132" cy="250" r="4" fill="#333"/><circle cx="164" cy="250" r="4" fill="#333"/>`;
      case 'coastcity':
        return `
          <rect y="175" width="400" height="85" fill="${sea}"/>
          ${[[10, 120, 50, '#F6D365'], [62, 130, 40, '#F28482'], [104, 110, 46, '#84A59D'], [152, 125, 42, '#F5CAC3'], [196, 105, 54, '#F7EDE2'], [252, 128, 38, '#90BE6D']].map(([x, y, w, c]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${180 - y}" fill="${c}"/>${[0, 1].map(r => `<rect x="${x + 8}" y="${y + 12 + r * 20}" width="${w - 16}" height="7" fill="${night ? '#FFE08A' : 'rgba(0,0,0,.18)'}"/>`).join('')}`).join('')}
          <rect x="300" y="70" width="22" height="110" fill="#E9E3D5"/><rect x="292" y="62" width="38" height="14" fill="#D8CFC0"/>
          <path d="M0 230 Q120 210 260 228 T400 222 L400 260 L0 260Z" fill="${land}"/>`;
      case 'ruins':
        return `
          <path d="M0 210 Q200 180 400 205 L400 260 L0 260Z" fill="${land}"/>
          <g fill="${s.accent}">
            <path d="M90 210 L90 110 Q200 70 310 110 L310 210Z"/>
          </g>
          <g fill="${night ? '#FFE08A' : '#7A4B2A'}" opacity=".55">
            ${[0, 1, 2, 3, 4].map(i => `<path d="M${105 + i * 40} 205 L${105 + i * 40} 170 Q${120 + i * 40} 152 ${135 + i * 40} 170 L${135 + i * 40} 205Z"/><path d="M${108 + i * 40} 155 L${108 + i * 40} 135 Q${120 + i * 40} 122 ${132 + i * 40} 135 L${132 + i * 40} 155Z"/>`).join('')}
          </g>`;
      case 'temple':
        return `
          <path d="M0 200 Q100 170 220 190 T400 180 L400 260 L0 260Z" fill="${land}"/>
          <g transform="translate(200 95)">
            <rect x="-55" y="20" width="110" height="10" fill="${s.accent}"/>
            <path d="M-80 20 Q0 0 80 20 L70 8 Q0 -10 -70 8Z" fill="#3A2E2E"/>
            <rect x="-40" y="30" width="80" height="35" fill="#F3E6D3"/>
            <path d="M-62 65 Q0 48 62 65 L54 55 Q0 40 -54 55Z" fill="#3A2E2E"/>
            <rect x="-30" y="65" width="60" height="35" fill="#F3E6D3"/>
            <rect x="-8" y="78" width="16" height="22" fill="${s.accent}"/>
          </g>
          <g fill="#F7A8B8">${[[40, 170, 26], [70, 150, 20], [340, 160, 28], [372, 180, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
          <g stroke="${s.accent}" stroke-width="6"><path d="M90 200 L90 150 M150 200 L150 150"/></g>
          <path d="M80 152 L160 152 M84 162 L156 162" stroke="${s.accent}" stroke-width="5"/>`;
      case 'skyline':
        return `
          ${[[10, 120, 34], [48, 90, 28], [80, 140, 40], [124, 60, 26], [154, 110, 36], [194, 80, 30], [228, 130, 44], [276, 70, 32], [312, 115, 38], [354, 95, 40]].map(([x, y, w]) =>
            `<rect x="${x}" y="${y}" width="${w}" height="${260 - y}" fill="${land}"/>${Array.from({ length: Math.floor((200 - y) / 16) }, (_, r) => `<rect x="${x + 6}" y="${y + 10 + r * 16}" width="${w - 12}" height="4" fill="${night ? s.accent : 'rgba(255,255,255,.18)'}"/>`).join('')}`).join('')}
          <path d="M131 60 L137 30 L143 60Z" fill="${land}"/>
          <path d="M0 230 L400 230 L400 260 L0 260Z" fill="#2A2D52"/>`;
      default:
        return mountains(land, s.peak || land);
    }
  }

  function destinationScene(dest, variantIndex = 0, label = true) {
    const s = dest.scene;
    const v = VARIANTS[variantIndex] || VARIANTS[0];
    const id = 'g' + (++uid);
    const sky = v.tint || s.sky;
    const night = !!v.night;
    const stars = night
      ? Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 73) % 400}" cy="${(i * 37) % 110 + 8}" r="${i % 3 === 0 ? 1.6 : 1}" fill="#fff" opacity=".8"/>`).join('')
      : '';
    const sunY = variantIndex === 1 ? 135 : 60;
    const sun = night
      ? `<circle cx="320" cy="55" r="18" fill="#F5F3E7"/><circle cx="328" cy="49" r="16" fill="${sky[0]}"/>`
      : `<circle cx="${variantIndex === 1 ? 110 : 310}" cy="${sunY}" r="${variantIndex === 1 ? 34 : 24}" fill="${s.sun}" opacity=".95"/>`;
    return `
      <svg class="scene" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Ilustração de ${dest.name} (${v.name.toLowerCase()})">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
        <rect width="400" height="260" fill="url(#${id})"/>
        ${stars}${sun}
        ${sceneBody(s, night)}
        ${v.overlay ? `<rect width="400" height="260" fill="${v.overlay}"/>` : ''}
      </svg>${label ? '<span class="scene-badge">Ilustração</span>' : ''}`;
  }

  function restaurantTile(r, category) {
    const hue = category ? category.hue : 250;
    const initials = r.name.replace(/&/g, '').split(/\s+/).filter(w => w.length > 2 || /^\d+$/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return `
      <div class="tile" style="--h:${hue}">
        <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx="330" cy="40" r="120" fill="hsla(${hue},70%,92%,.55)"/>
          <circle cx="60" cy="250" r="140" fill="hsla(${hue},60%,30%,.18)"/>
          <circle cx="200" cy="130" r="70" fill="none" stroke="hsla(0,0%,100%,.35)" stroke-width="1.5"/>
          <circle cx="200" cy="130" r="92" fill="none" stroke="hsla(0,0%,100%,.18)" stroke-width="1.5"/>
        </svg>
        <span class="tile-mono">${initials}</span>
        <span class="tile-cat">${category ? category.label : ''}</span>
      </div>`;
  }

  /* Mapa demonstrativo: cidade fictícia, sem relação com mapas reais. */
  function demoMap(pins, { activeId = null, interactive = false } = {}) {
    const roads = `
      <path d="M0 40 C120 60 220 20 400 50" /><path d="M0 120 C140 100 260 150 400 120" />
      <path d="M0 200 C100 180 300 220 400 190" /><path d="M80 0 C70 80 110 180 90 260" />
      <path d="M200 0 C220 90 180 170 210 260" /><path d="M320 0 C300 100 340 180 310 260" />`;
    const pinsSvg = pins.map(p => {
      const x = p.coords.x * 4, y = p.coords.y * 2.6;
      const active = p.id === activeId;
      return `
        <g class="map-pin${active ? ' is-active' : ''}" ${interactive ? `data-pin="${p.id}" tabindex="0" role="button" aria-label="${p.name}"` : ''} transform="translate(${x} ${y})">
          <path d="M0 0 C-10 -14 -14 -20 -14 -27 A14 14 0 1 1 14 -27 C14 -20 10 -14 0 0Z" />
          <circle cy="-27" r="5" fill="#fff"/>
          ${active || !interactive ? `<text y="-48" text-anchor="middle">${p.name}</text>` : ''}
        </g>`;
    }).join('');
    return `
      <svg class="demo-map" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Mapa demonstrativo de cidade fictícia">
        <rect width="400" height="260" fill="#EDECE4"/>
        <path d="M0 215 Q60 200 90 260 L0 260Z" fill="#CFE3EE"/>
        <rect x="230" y="60" width="70" height="45" rx="10" fill="#DCE8D2"/>
        <rect x="110" y="150" width="60" height="38" rx="10" fill="#DCE8D2"/>
        <g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">${roads}</g>
        <g fill="none" stroke="#DAD8CC" stroke-width="1" stroke-dasharray="3 4">${roads}</g>
        ${pinsSvg}
      </svg>`;
  }

  window.INTENT_ART = { destinationScene, restaurantTile, demoMap, VARIANTS };
})();
