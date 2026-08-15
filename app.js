// ============================================
// NEXUS Gaming Portal — Application Logic
// ============================================

// --- Game Library Data ---
const GAMES = [
  {
    id: 'fortnite',
    title: 'Fortnite',
    platform: 'Epic Games',
    icon: '🏗️',
    gradient: 'linear-gradient(135deg, hsl(230, 60%, 35%), hsl(270, 50%, 30%))',
    moonlightApp: 'Fortnite',
  },
  {
    id: 'valorant',
    title: 'Valorant',
    platform: 'Riot Games',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, hsl(0, 65%, 35%), hsl(350, 50%, 20%))',
    moonlightApp: 'Valorant',
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    platform: 'Microsoft',
    icon: '⛏️',
    gradient: 'linear-gradient(135deg, hsl(120, 40%, 30%), hsl(30, 40%, 25%))',
    moonlightApp: 'Minecraft Launcher',
  },
  {
    id: 'gtav',
    title: 'GTA V',
    platform: 'Steam',
    icon: '🚗',
    gradient: 'linear-gradient(135deg, hsl(220, 20%, 18%), hsl(25, 70%, 35%))',
    moonlightApp: 'Grand Theft Auto V',
  },
  {
    id: 'rocket-league',
    title: 'Rocket League',
    platform: 'Epic Games',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, hsl(210, 70%, 35%), hsl(25, 80%, 45%))',
    moonlightApp: 'Rocket League',
  },
  {
    id: 'cs2',
    title: 'Counter-Strike 2',
    platform: 'Steam',
    icon: '💣',
    gradient: 'linear-gradient(135deg, hsl(220, 15%, 15%), hsl(45, 70%, 40%))',
    moonlightApp: 'Counter-Strike 2',
  },
  {
    id: 'apex',
    title: 'Apex Legends',
    platform: 'Steam / EA',
    icon: '🔺',
    gradient: 'linear-gradient(135deg, hsl(0, 70%, 35%), hsl(350, 40%, 18%))',
    moonlightApp: 'Apex Legends',
  },
  {
    id: 'cyberpunk',
    title: 'Cyberpunk 2077',
    platform: 'Steam',
    icon: '🌃',
    gradient: 'linear-gradient(135deg, hsl(50, 80%, 40%), hsl(185, 80%, 35%))',
    moonlightApp: 'Cyberpunk 2077',
  },
];

// --- Web Apps (opened on the streamed desktop, not embedded here) ---
const WEB_APPS = [
  {
    title: 'Gemini',
    subtitle: 'Google AI',
    url: 'https://gemini.google.com/',
    icon: '✦',
    gradient: 'linear-gradient(135deg, hsl(215, 70%, 40%), hsl(275, 55%, 42%))',
  },
  {
    title: 'Claude',
    subtitle: 'Anthropic',
    url: 'https://claude.ai/',
    icon: '✳',
    gradient: 'linear-gradient(135deg, hsl(20, 65%, 42%), hsl(30, 55%, 30%))',
  },
];

// --- State ---
let streamConnected = false;
let currentStreamUrl = '';

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  renderGames(GAMES);
  renderApps();
  setupSearch();
  setupMobileNav();
  setupScrollAnimations();
});

// --- Render Web Apps ---
function renderApps() {
  const grid = document.getElementById('appsGrid');
  if (!grid) return;

  grid.innerHTML = WEB_APPS.map((app, i) => `
    <div class="game-card animate-in" style="animation-delay: ${i * 0.05}s">
      <div class="game-card-banner" style="background: ${app.gradient}">
        <span class="game-icon">${app.icon}</span>
      </div>
      <div class="game-card-body">
        <div class="game-card-title">${app.title}</div>
        <div class="game-card-platform">${app.subtitle}</div>
        <div class="game-card-actions">
          <button class="btn btn-primary btn-sm" onclick="openApp('${app.url}')">
            Open
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// Opens the site in a new top-level tab. When you're viewing the portal through
// the streamed desktop, do this inside the stream — the site then runs on your
// PC, where it isn't blocked. (Neither Gemini nor Claude allows framing, so
// they can't be embedded in the portal itself.)
function openApp(url) {
  window.open(url, '_blank', 'noopener');
}

// --- Render Games ---
function renderGames(games) {
  const grid = document.getElementById('gamesGrid');
  if (!grid) return;

  if (games.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-tertiary);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">No games found</p>
        <p style="font-size: 0.85rem;">Try a different search term</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = games.map((game, i) => `
    <div class="game-card animate-in" style="animation-delay: ${i * 0.05}s">
      <div class="game-card-banner" style="background: ${game.gradient}">
        <span class="game-icon">${game.icon}</span>
      </div>
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-platform">${game.platform}</div>
        <div class="game-card-actions">
          <button class="btn btn-primary btn-sm" onclick="streamGame('${game.id}')">
            🌐 Stream
          </button>
          <button class="btn btn-secondary btn-sm" onclick="launchInMoonlight('${game.moonlightApp}')">
            🚀 Moonlight
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- Search ---
function setupSearch() {
  const input = document.getElementById('gameSearch');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderGames(GAMES);
      return;
    }
    const filtered = GAMES.filter(g =>
      g.title.toLowerCase().includes(query) ||
      g.platform.toLowerCase().includes(query)
    );
    renderGames(filtered);
  });
}

// --- Stream Connection ---
function toggleConnection() {
  if (streamConnected) {
    disconnect();
    return;
  }

  const host = document.getElementById('hostIp').value.trim();
  const port = document.getElementById('hostPort').value.trim() || '8080';
  const password = document.getElementById('streamPassword').value.trim();

  if (!host) {
    shakeElement(document.getElementById('hostIp'));
    return;
  }

  const url = buildStreamUrl(host, port, password);

  // A page served over HTTPS cannot embed an http:// frame: the browser blocks
  // it as active mixed content with no prompt and no override. A LAN IP can only
  // be reached over http://, so from an embedded (HTTPS) portal it can never
  // load — say so instead of starting a load that will silently hang.
  if (window.location.protocol === 'https:' && url.startsWith('http://')) {
    showStreamError(
      `Blocked: this page is served over HTTPS, so the browser will not embed the ` +
      `insecure LAN stream at ${url.split('?')[0]}. Expose your PC over HTTPS ` +
      `(Tailscale Funnel or Cloudflare Tunnel) and enter that https:// hostname instead.`
    );
    return;
  }

  connect(url);
}

// Accepts either a full URL (https://pc.your-tailnet.ts.net), a bare hostname
// (defaults to https:// — tunnels serve on 443, so no port needed), or a LAN
// IP (defaults to http://IP:port for local use).
function buildStreamUrl(host, port, password) {
  let base;
  if (/^https?:\/\//i.test(host)) {
    base = host.replace(/\/+$/, '');
  } else if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    base = `http://${host}:${port}`;
  } else {
    base = `https://${host.replace(/\/+$/, '')}`;
  }
  return password ? `${base}?pwd=${encodeURIComponent(password)}` : base;
}

function showStreamError(message) {
  const btn = document.getElementById('connectBtn');

  btn.classList.remove('loading');
  btn.style.display = 'block';
  document.getElementById('disconnectBtn').style.display = 'none';

  updateStatus(document.getElementById('streamStatus'), 'error', message);
  document.getElementById('statusDot').className = 'status-dot offline';
  document.getElementById('statusText').textContent = 'Error';
}

function connect(url) {
  const btn = document.getElementById('connectBtn');
  const status = document.getElementById('streamStatus');
  const dot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  // Loading state
  btn.classList.add('loading');
  updateStatus(status, 'connecting', 'Connecting...');
  dot.className = 'status-dot connecting';
  statusText.textContent = 'Connecting';

  // Simulate connection delay (in reality, iframe loading)
  setTimeout(() => {
    const frame = document.getElementById('streamFrame');
    const placeholder = document.getElementById('streamPlaceholder');

    frame.src = url;
    currentStreamUrl = url;

    frame.onload = () => {
      streamConnected = true;
      btn.classList.remove('loading');
      btn.style.display = 'none';
      document.getElementById('disconnectBtn').style.display = 'block';

      placeholder.style.display = 'none';
      frame.classList.add('active');

      updateStatus(status, 'connected', 'Connected to ' + new URL(url).hostname);
      dot.className = 'status-dot';
      statusText.textContent = 'Streaming';
    };

    frame.onerror = () => {
      frame.src = '';
      showStreamError('Connection failed — could not reach ' + new URL(url).hostname + '.');
    };

    // Fallback timeout — iframes don't reliably fire onerror. A load that never
    // completes is a failure; reporting it as success hides the actual problem.
    setTimeout(() => {
      if (!streamConnected) {
        frame.src = '';
        showStreamError(
          'Connection failed — no response from ' + new URL(url).hostname +
          '. Check that the Neko container is running and reachable on this network.'
        );
      }
    }, 8000);
  }, 500);
}

function disconnect() {
  const frame = document.getElementById('streamFrame');
  const placeholder = document.getElementById('streamPlaceholder');
  const status = document.getElementById('streamStatus');
  const dot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  frame.src = '';
  frame.classList.remove('active');
  placeholder.style.display = 'flex';

  document.getElementById('disconnectBtn').style.display = 'none';
  document.getElementById('connectBtn').style.display = 'block';

  streamConnected = false;
  currentStreamUrl = '';

  updateStatus(status, '', 'Not connected');
  dot.className = 'status-dot offline';
  statusText.textContent = 'Ready';
}

function updateStatus(el, state, message) {
  el.className = 'stream-status';
  if (state === 'connected') el.classList.add('connected');
  if (state === 'error') el.classList.add('error');

  const dotClass = state === 'connected' ? '' :
                   state === 'connecting' ? 'connecting' : 'offline';

  // message can carry a user-supplied hostname, so build the node rather than
  // interpolating into innerHTML.
  el.innerHTML = '';
  const statusDot = document.createElement('div');
  statusDot.className = `status-dot ${dotClass}`;
  const label = document.createElement('span');
  label.textContent = message;
  el.append(statusDot, label);
}

// --- Stream Game (scroll to stream + auto-fill) ---
function streamGame(gameId) {
  const game = GAMES.find(g => g.id === gameId);
  if (!game) return;

  document.getElementById('stream').scrollIntoView({ behavior: 'smooth' });

  // Highlight the stream section briefly
  const controls = document.querySelector('.stream-controls');
  controls.style.borderColor = 'hsla(190, 95%, 50%, 0.3)';
  setTimeout(() => {
    controls.style.borderColor = '';
  }, 2000);
}

// --- Moonlight Launch ---
function launchInMoonlight(appName) {
  // Attempt moonlight:// protocol
  const url = `moonlight://`;
  
  // Show user-friendly message since protocol links are unreliable
  const confirmed = confirm(
    `Launch "${appName}" via Moonlight?\n\n` +
    `This will attempt to open the Moonlight app. ` +
    `If it doesn't open, make sure Moonlight is installed.`
  );

  if (confirmed) {
    window.location.href = url;
  }
}

function launchMoonlight() {
  window.location.href = 'moonlight://';
}

// --- Fullscreen ---
// Works with or without a live stream: with one we fullscreen the stream
// overlay, otherwise we fullscreen the portal itself. When the portal is
// embedded (e.g. in a Google Site) this escapes the embed box and fills the
// whole screen rather than just the frame.
function goFullscreen() {
  const overlay = document.getElementById('fullscreenOverlay');
  const frame = document.getElementById('fullscreenFrame');

  let target;
  if (streamConnected && currentStreamUrl) {
    frame.src = currentStreamUrl;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    target = overlay;
  } else {
    target = document.documentElement;
  }

  const request = target.requestFullscreen || target.webkitRequestFullscreen;
  if (!request) {
    openStandaloneTab();
    return;
  }

  Promise.resolve(request.call(target)).catch(() => {
    // A parent frame's permissions policy can refuse fullscreen. A top-level
    // tab is never subject to it, so fall back to opening the portal directly.
    if (target === overlay) exitFullscreen();
    openStandaloneTab();
  });
}

// Escape hatch when fullscreen is refused by an embedding page.
function openStandaloneTab() {
  window.open(window.location.href, '_blank', 'noopener');
}

function exitFullscreen() {
  const overlay = document.getElementById('fullscreenOverlay');
  const frame = document.getElementById('fullscreenFrame');

  overlay.classList.remove('active');
  frame.src = '';
  document.body.style.overflow = '';

  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
}

// Listen for ESC key to exit fullscreen
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('fullscreenOverlay');
    if (overlay.classList.contains('active')) {
      exitFullscreen();
    }
  }
});

function reloadStream() {
  if (!streamConnected || !currentStreamUrl) return;
  const frame = document.getElementById('streamFrame');
  frame.src = currentStreamUrl;
}

// --- Mobile Nav ---
function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  // Close nav on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });
}

// --- Scroll Animations ---
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

// --- Utility: Shake Animation ---
function shakeElement(el) {
  el.style.borderColor = 'var(--danger)';
  el.style.animation = 'shake 0.4s ease';
  el.focus();

  setTimeout(() => {
    el.style.borderColor = '';
    el.style.animation = '';
  }, 500);

  // Add shake keyframes if not already added
  if (!document.getElementById('shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-6px); }
        40% { transform: translateX(6px); }
        60% { transform: translateX(-4px); }
        80% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }
}
