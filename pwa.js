(() => {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.warn('PWA service worker:', err)));
  }
  let installPrompt;
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const installButton = document.createElement('button');
  installButton.type = 'button';
  installButton.className = 'btn btn-primary pwa-install';
  installButton.textContent = 'Pasang Aplikasi';
  installButton.hidden = true;
  installButton.setAttribute('aria-label', 'Pasang aplikasi Abu Adzka di perangkat');
  nav.appendChild(installButton);
  installButton.addEventListener('click', async () => {
    if (!installPrompt) {
      alert('Untuk memasang aplikasi, buka menu browser lalu pilih “Install app” atau “Tambahkan ke layar utama”.');
      return;
    }
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  window.addEventListener('appinstalled', () => {
    installButton.hidden = true;
    installPrompt = null;
  });
})();
