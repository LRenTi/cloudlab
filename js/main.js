/**
 * main.js
 * App bootstrap: theme, clock, Docker-Status-Polling, card spotlight.
 * Runs after renderer.js has injected the DOM.
 */

/* ── Theme ─────────────────────────────────────── */
const root     = document.documentElement;
const iconSun  = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');

function applyTheme(dark) {
  root.setAttribute('data-theme', dark ? 'dark' : 'light');
  if (iconSun)  iconSun.style.display  = dark ? 'none' : '';
  if (iconMoon) iconMoon.style.display = dark ? '' : 'none';
}

function toggleTheme() {
  const isDark = root.getAttribute('data-theme') !== 'dark';
  applyTheme(isDark);
  localStorage.setItem('cl-theme', isDark ? 'dark' : 'light');
}

(function initTheme() {
  const saved       = localStorage.getItem('cl-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved ? saved === 'dark' : prefersDark);
})();

/* ── Live clock ─────────────────────────────────── */
function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}
updateClock();
setInterval(updateClock, 1000);

/* ── Docker Status Polling ──────────────────────── */

const DOCKER_POLL_INTERVAL = 30_000; // 30 Sekunden

// API-URL: relativer Pfad → kein Mixed-Content, kein Port-Problem
function getDockerApiUrl() {
  if (DASHBOARD_CONFIG.api?.dockerUrl) return DASHBOARD_CONFIG.api.dockerUrl;
  return '/api/containers';
}

const STATUS_LABEL_MAP = { online: 'Online', idle: 'Idle', offline: 'Offline' };

function updateCardStatus(card, status) {
  const badge = card.querySelector('.card-status');
  if (!badge) return;

  badge.classList.remove('status-online', 'status-offline', 'status-idle');
  badge.classList.add(`status-${status}`);

  const label = badge.querySelector('.status-label');
  if (label) label.textContent = STATUS_LABEL_MAP[status] ?? status;

  card.classList.toggle('card--offline', status === 'offline');

  // Offline-Karten nicht anklickbar; Online-Karten wieder freischalten
  if (status === 'offline') {
    card.setAttribute('tabindex', '-1');
    card.setAttribute('aria-disabled', 'true');
  } else {
    card.removeAttribute('tabindex');
    card.removeAttribute('aria-disabled');
  }
}

async function fetchDockerStatus() {
  const apiUrl = getDockerApiUrl();

  try {
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { containers } = await res.json();

    // Liste laufender Container-Namen (lowercase)
    const runningNames = containers.map(c => c.name.toLowerCase());

    // Prüft ob ein konfigurierter Container-Name läuft (exakt oder als Präfix)
    function isRunning(configuredName) {
      const n = configuredName.toLowerCase();
      return runningNames.some(r => r === n || r.startsWith(n + '-') || r.startsWith(n + '_'));
    }

    // Service-Cards aktualisieren
    let onlineCount = 0;
    const cards = document.querySelectorAll('.service-card[data-container]');

    cards.forEach(card => {
      const name = card.dataset.container;
      if (!name) return;
      const running = isRunning(name);
      if (running) onlineCount++;
      updateCardStatus(card, running ? 'online' : 'offline');
    });

    // Quick-Links aktualisieren
    document.querySelectorAll('.quick-item[data-container]').forEach(item => {
      const name = item.dataset.container;
      if (!name) return;
      const running = isRunning(name);
      item.classList.toggle('qs-online',  running);
      item.classList.toggle('qs-offline', !running);
      const dot = item.querySelector('.quick-status-dot');
      if (dot) dot.title = running ? 'Online' : 'Offline';
    });

    // Cards nach Status sortieren (online → idle → offline)
    sortCardsByStatus();

    // Spotlight-Listener für neu-online-Karten registrieren
    initSpotlight();

    // Hero-Stats aktualisieren
    const statOnline = document.getElementById('stat-online-count');
    if (statOnline) statOnline.textContent = `— ${onlineCount} / ${cards.length} aktiv`;

    const statDocker = document.getElementById('stat-docker-count');
    if (statDocker) statDocker.textContent = `— ${containers.length} laufen`;

  } catch (err) {
    console.warn('[Docker API] Nicht erreichbar:', err.message);

    const statOnline = document.getElementById('stat-online-count');
    if (statOnline) statOnline.textContent = '— API offline';

    const statDocker = document.getElementById('stat-docker-count');
    if (statDocker) statDocker.textContent = '— nicht verbunden';
  }
}

/* ── Sort cards by status within each grid ──────── */
const STATUS_ORDER = { online: 0, idle: 1, offline: 2 };

function sortCardsByStatus() {
  document.querySelectorAll('.cards-grid').forEach(grid => {
    const cards = Array.from(grid.querySelectorAll('.service-card'));
    cards.forEach(card => {
      const statusClass = Array.from(card.querySelector('.card-status')?.classList ?? [])
        .find(c => c.startsWith('status-'))
        ?.replace('status-', '') ?? 'offline';
      card.style.order = STATUS_ORDER[statusClass] ?? 2;
    });
  });
}

/* ── Card spotlight (mouse-follow radial glow) ───── */
function onCardMouseMove(e) {
  const card = e.currentTarget;
  if (card.classList.contains('card--offline')) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100) + '%');
  card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
}

function initSpotlight() {
  document.querySelectorAll('.service-card').forEach(card => {
    // Verhindert doppelte Listener bei erneutem Aufruf
    if (card._spotlightBound) return;
    card._spotlightBound = true;
    card.addEventListener('mousemove', onCardMouseMove);
  });
}

/* ── Bootstrap ──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard(DASHBOARD_CONFIG);

  initSpotlight();

  const btn = document.getElementById('themeToggle');
  if (btn) btn.addEventListener('click', toggleTheme);

  // Docker-Status sofort abrufen, danach alle 30 Sekunden
  fetchDockerStatus();
  setInterval(fetchDockerStatus, DOCKER_POLL_INTERVAL);
});
