const baseConfig = window.PORTFOLIO_CONFIG || {};
let config = baseConfig;
let remoteConfigLoaded = false;
try {
  const savedConfig = JSON.parse(localStorage.getItem('abuadzka_portfolio_config') || 'null');
  if (savedConfig && typeof savedConfig === 'object') config = { ...baseConfig, ...savedConfig };
  const savedStyle = JSON.parse(localStorage.getItem('abuadzka_portfolio_style') || 'null');
  if (savedStyle) Object.entries(savedStyle).forEach(([key, value]) => document.documentElement.style.setProperty(key, value));
} catch (error) { console.warn('Konfigurasi editor lokal tidak dapat dibaca.', error); }
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};

const setAttr = (selector, attr, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute(attr, value);
};

const paragraphList = items => (items || []).map(text => `<p>${text}</p>`).join('');
const numberedCards = items => (items || []).map(item => `<article><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('');

function applyConfig(){
  if (!config.identity) return;

  document.title = config.site?.title || document.title;
  setAttr('meta[name="description"]', 'content', config.site?.description);
  setAttr('meta[name="theme-color"]', 'content', config.site?.themeColor);

  setText('.brand strong', config.identity.name);
  setText('.brand small', config.identity.brand);
  setText('.hero-copy .eyebrow', config.identity.tagline);
  setText('h1', config.identity.name);
  setText('.hero-copy h2', config.identity.headline);
  setText('.role', config.identity.role);
  setText('.hero-text', config.identity.summary);
  setText('#tentang .eyebrow', config.about?.eyebrow);
  setText('[data-about-title]', config.about?.title);

  const image = config.site?.image;
  if (image) {
    document.querySelectorAll('.brand-logo, .profile-media img').forEach(img => { img.src = image; });
    document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(link => { link.href = image; });
    document.documentElement.style.setProperty('--hero-image', `url("${image}")`);
  }

  const navLinks = document.querySelector('[data-nav-links]');
  if (navLinks && config.navigation) {
    navLinks.innerHTML = config.navigation.map(([label, href]) => `<a href="${href}">${label}</a>`).join('') + '<a href="#kontak" class="nav-cta">Konsultasi</a>';
  }

  const trust = document.querySelector('[data-trust-badges]');
  if (trust && config.trustBadges) trust.innerHTML = config.trustBadges.map(label => `<span>${label}</span>`).join('');

  const heroStats = document.querySelector('[data-hero-stats]');
  if (heroStats && config.heroStats) heroStats.innerHTML = config.heroStats.map(([number, label]) => `<div><strong>${number}</strong><span>${label}</span></div>`).join('');

  const intro = document.querySelector('.intro-strip p');
  if (intro && config.intro) intro.textContent = config.intro;

  const about = document.querySelector('[data-about-paragraphs]');
  if (about && config.about?.paragraphs) about.innerHTML = paragraphList(config.about.paragraphs);

  setText('.values .section-heading .eyebrow', config.values?.eyebrow);
  setText('.values .section-heading h2', config.values?.title);
  const values = document.querySelector('[data-values]');
  if (values && config.values?.items) values.innerHTML = config.values.items.map(item => `<article class="value-card"><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('');

  setText('.markaz .feature-panel .eyebrow', config.markaz?.eyebrow);
  setText('.markaz .feature-panel h2', config.markaz?.title);
  const featureParagraphs = document.querySelectorAll('.markaz .feature-panel p:not(.eyebrow)');
  (config.markaz?.paragraphs || []).forEach((text, index) => {
    if (featureParagraphs[index]) featureParagraphs[index].textContent = text;
  });
  const programs = document.querySelector('[data-programs]');
  if (programs && config.markaz?.programs) programs.innerHTML = numberedCards(config.markaz.programs);

  setText('.services .section-heading .eyebrow', config.services?.eyebrow);
  setText('.services .section-heading h2', config.services?.title);
  const services = document.querySelector('[data-services]');
  if (services && config.services?.items) services.innerHTML = config.services.items.map(item => `<article><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('');

  setText('.portfolio .section-heading .eyebrow', config.portfolio?.eyebrow);
  setText('.portfolio .section-heading h2', config.portfolio?.title);
  const portfolio = document.querySelector('[data-portfolio]');
  if (portfolio && config.portfolio?.items) portfolio.innerHTML = config.portfolio.items.map(item => `<article class="portfolio-card"><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('');

  setText('.blog .section-heading .eyebrow', config.blog?.eyebrow);
  setText('.blog .section-heading h2', config.blog?.title);
  const blog = document.querySelector('[data-blog]');
  if (blog && config.blog?.items) blog.innerHTML = config.blog.items.map(item => `<article><p>${item[0]}</p><h3>${item[1]}</h3><a href="#kontak">Baca nanti</a></article>`).join('');

  setText('.quote-card blockquote', config.quote?.text);
  setText('.quote-card figcaption', config.quote?.author);
  setText('.contact .eyebrow', config.contact?.eyebrow);
  setText('.contact h2', config.contact?.title);
  setText('.contact h2 + p', config.contact?.text);
  setText('.footer h3', config.identity.name);
  setText('.footer h3 + p', config.identity.headline);
  setText('.footer-grid > p', config.footer);

  const contacts = config.contacts || {};
  const contactList = document.querySelector('.contact-list');
  if (contactList) {
    contactList.innerHTML = [
      `<a href="https://wa.me/${contacts.whatsappNumber}">WhatsApp: ${contacts.whatsappDisplay}</a>`,
      `<a href="https://instagram.com/${contacts.instagram}">Instagram: @${contacts.instagram}</a>`,
      `<a href="https://${contacts.website}">Website: ${contacts.website}</a>`
    ].join('');
  }
  document.querySelectorAll('.btn-primary[href^="https://wa.me/"]').forEach(link => {
    link.href = `https://wa.me/${contacts.whatsappNumber}`;
  });
}

toggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('active');
  toggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

nav?.addEventListener('click', event => {
  if (event.target.closest('a')) {
    nav.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

function sendWhatsApp(event){
  event.preventDefault();

  const nama = document.getElementById('nama').value.trim();
  const instansi = document.getElementById('instansi').value.trim();
  const pesan = document.getElementById('pesan').value.trim();
  const whatsappNumber = config.contacts?.whatsappNumber || '62895701716700';
  const text = [
    `Assalamu'alaikum ${config.identity?.name || 'Abu Adzka'},`,
    "",
    `Nama: ${nama}`,
    `Instansi/Brand: ${instansi || '-'}`,
    `Kebutuhan: ${pesan}`
  ].join('\n');

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}

function loadPublishedConfig() {
  const api = String(window.ABUADZKA_BACKEND_URL || '').trim();
  if (!api) { applyConfig(); return; }
  const callbackName = '__abuAdzkaConfigCallback';
  const timeout = window.setTimeout(() => { if (!remoteConfigLoaded) applyConfig(); }, 3500);
  window[callbackName] = payload => {
    remoteConfigLoaded = true;
    window.clearTimeout(timeout);
    if (payload && payload.ok && payload.config && payload.config.identity) {
      config = payload.config;
      applyConfig();
    } else applyConfig();
    try { delete window[callbackName]; } catch (_) { window[callbackName] = undefined; }
    script.remove();
  };
  const script = document.createElement('script');
  script.src = api + (api.includes('?') ? '&' : '?') + 'action=config&callback=' + callbackName + '&_=' + Date.now();
  script.onerror = () => { window.clearTimeout(timeout); if (!remoteConfigLoaded) applyConfig(); };
  document.head.appendChild(script);
}
loadPublishedConfig();
