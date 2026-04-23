/* ============================================
   NIAH'S HOUSE — Static Portfolio JS
   ============================================ */

// ============================================
// Smooth scroll helper
// ============================================
function smoothScrollTo(sectionId) {
  playSparkle();
  const el = document.getElementById(sectionId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Sparkle sound (Web Audio API)
// ============================================
function playSparkle() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const notes = [1320, 1760, 2349];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.06 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.4);
    });
    setTimeout(() => ctx.close(), 800);
  } catch (_) {}
}

// ============================================
// Custom Cursor
// ============================================
(function initCursor() {
  // Don't run on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const sparkleColors = ['#fff3a8', '#ffe27a', '#fde68a', '#fff8c2'];
  let lastSpawn = 0;
  let particleId = 0;

  // Spring simulation state
  let curX = -200, curY = -200;
  let velX = 0, velY = 0;
  let targetX = -200, targetY = -200;

  function animate() {
    const stiffness = 0.18, damping = 0.82;
    velX = (velX + (targetX - curX) * stiffness) * damping;
    velY = (velY + (targetY - curY) * stiffness) * damping;
    curX += velX;
    curY += velY;
    cursor.style.transform = `translate(${curX - 62}px, ${curY - 10}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    // Spawn particles
    const now = performance.now();
    if (now - lastSpawn < 55) return;
    lastSpawn = now;

    const tipX = e.clientX + 22;
    const tipY = e.clientY - 22;

    const p = document.createElement('div');
    const size = [3, 4, 5][Math.floor(Math.random() * 3)];
    const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    const drift = (Math.random() - 0.5) * 18;
    const x = tipX + (Math.random() - 0.5) * 14;
    const y = tipY + (Math.random() - 0.5) * 14;

    p.className = 'cursor-particle';
    p.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${x}px; top:${y}px;
      box-shadow:1px 0 0 ${color}, 0 1px 0 ${color};
      --drift:${drift}px;
    `;
    p.style.setProperty('--drift', `${drift}px`);

    // Override animation to use dynamic drift
    p.style.animation = 'none';
    document.body.appendChild(p);

    // Manual animation using WAAPI
    p.animate(
      [
        { opacity: 1, transform: 'translateY(0px) translateX(0px) scale(1)' },
        { opacity: 0, transform: `translateY(22px) translateX(${drift}px) scale(0.6)` }
      ],
      { duration: 700, easing: 'ease-out', fill: 'forwards' }
    ).finished.then(() => p.remove());
  });

  // Hide default cursor styling for custom cursor img
  cursor.style.display = 'block';
})();

// ============================================
// Floating Nav
// ============================================
(function initNav() {
  const nav = document.getElementById('floating-nav');
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = ['welcome', 'about', 'work', 'projects', 'contact'];

  // Show/hide nav on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }

    // Active section tracking
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) current = id;
      }
    });

    navBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === current);
    });
  }, { passive: true });

  // Click to scroll
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

// ============================================
// Scroll Reveal (Intersection Observer)
// ============================================
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '-80px 0px', threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ============================================
// Parallax House on scroll
// ============================================
(function initParallax() {
  const houseWrap = document.querySelector('.hero-house-wrap');
  if (!houseWrap) return;

  window.addEventListener('scroll', () => {
    const progress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    houseWrap.style.transform = `translateY(${progress * 50}%)`;
  }, { passive: true });
})();

// ============================================
// Modal helpers
// ============================================
const reelSets = {
  petgrooming: [
    'https://res.cloudinary.com/dg1zcff2r/video/upload/q_auto/f_auto/v1776881507/WhatsApp_Video_2026-04-17_at_17.42.14_1776792423840_jb0xhd.mp4',
    'https://res.cloudinary.com/dg1zcff2r/video/upload/q_auto/f_auto/v1776881509/WhatsApp_Video_2026-04-17_at_17.42.25_1776792423840_kcwjsy.mp4',
    'https://res.cloudinary.com/dg1zcff2r/video/upload/q_auto/f_auto/v1776881506/WhatsApp_Video_2026-04-17_at_17.42.26_1776792423840_ij5jod.mp4',
  ],
  handicrafts: [
    'https://res.cloudinary.com/dg1zcff2r/video/upload/q_auto/f_auto/v1776881510/WhatsApp_Video_2026-04-17_at_17.44.21_1776793106537_xkwhp4.mp4',
    'https://res.cloudinary.com/dg1zcff2r/video/upload/q_auto/f_auto/v1776881509/WhatsApp_Video_2026-04-17_at_21.35.05_1776793106537_mfg1ag.mp4',
    'https://res.cloudinary.com/dg1zcff2r/video/upload/q_auto/f_auto/v1776881510/WhatsApp_Video_2026-04-17_at_21.36.23_1776793106537_qt00rs.mp4',
  ],
};

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // ESC to close
  const onKey = (e) => { if (e.key === 'Escape') { closeModal(id); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  // Pause any videos inside
  overlay.querySelectorAll('video').forEach(v => v.pause());
}

function openReelsModal(title, setKey) {
  const container = document.getElementById('reels-videos-container');
  const titleEl   = document.getElementById('modal-reels-title');
  if (!container || !titleEl) return;

  titleEl.textContent = title;
  container.innerHTML = '';

  const videos = reelSets[setKey] || [];
  videos.forEach(src => {
    const item = document.createElement('div');
    item.className = 'reel-modal-item wood-frame';
    item.innerHTML = `
      <div class="reel-modal-video">
        <video autoplay loop muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover;">
          <source src="${src}" type="video/mp4" />
        </video>
      </div>
    `;
    container.appendChild(item);
  });

  openModal('modal-reels');
}

function openPosterModal(src, title) {
  const img = document.getElementById('poster-lightbox-img');
  if (!img) return;
  img.src = src;
  img.alt = title;
  openModal('modal-poster');
}

function openRoomModal(room) {
  const titleEl    = document.getElementById('modal-room-title');
  const subtitleEl = document.getElementById('modal-room-subtitle');
  const content    = document.getElementById('modal-room-content');
  if (!titleEl || !content) return;

  if (room === 'art') {
    titleEl.textContent    = 'art room';
    subtitleEl.textContent = 'a small gallery, soft and slow';
    const artworks = [
      {
        title: 'Vulning Pelican',
        src: 'https://res.cloudinary.com/dg1zcff2r/image/upload/q_auto/f_auto/v1776887182/WhatsApp_Image_2026-04-22_at_15.59.34_nfjxzo.jpg'
      },
      {
        title: 'Watch Over Me',
        src: 'https://res.cloudinary.com/dg1zcff2r/image/upload/q_auto/f_auto/v1776887181/WhatsApp_Image_2026-04-22_at_15.58.14_ikn8pp.jpg'
      },
      {
        title: 'Red Chords',
        src: 'https://res.cloudinary.com/dg1zcff2r/image/upload/q_auto/f_auto/v1776887053/WhatsApp_Image_2026-04-09_at_11.58.19_1_kdokil.jpg'
      }
    ];
    const escapeAttr = (s) => String(s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    content.innerHTML = `
      <div class="art-grid">
        ${artworks.map((a) => a ? `
          <figure class="art-frame">
            <div class="art-frame-inner has-image">
              <img src="${escapeAttr(a.src)}" alt="${escapeAttr(a.title)}" loading="lazy" />
            </div>
            <figcaption class="art-caption">${escapeAttr(a.title)}</figcaption>
          </figure>
        ` : `
          <div class="art-frame">
            <div class="art-frame-inner">
              <p>art piece coming soon</p>
            </div>
          </div>
        `).join('')}
        <p class="art-coming-soon">share your artwork to fill these lace frames</p>
      </div>
    `;
  } else {
    titleEl.textContent    = 'poetry corner';
    subtitleEl.textContent = 'a few words from the in-between';
    const poems = [
      {
        title: 'Pink Plastic Dinos',
        body: `You brought me pink plastic dinos when I was six,
I'd hide them between your couch,
And we'd laugh when you found them,
A decade later,
I still buy myself pink plastic dinos,
That I'll hide when I'm home,
Waiting for you to find them,
So we could laugh again.`
      },
      {
        title: 'Born Entertainer',
        body: `Who am I performing for?
with a red ball for a nose
and a cracked smile
upon my white powdered cheeks
i know you're watching
not her beside you
pearls in her hair
moons shining beneath her silk

and when the curtain rips
I spin on glass shards
I swirl in blood pools
the spotlight illuminates my every limb
the audience beg for more,
their applause deafens me,

I know you're watching me,
when you lean in to kiss her
after my show`
      },
      {
        title: 'Love Came Home',
        body: `Love came home
to blood-dried marble tiles,
to white lilies rotting on fungus grounds,
to graves dug out for one (by one),
to yellowing teeth and tar-filled lungs,
to shards of glass pricking the sole,
to sick, silent nights with a sinner,
to scarlet slashes and impurity,
to skin and bones,
to earth-fed nails and mouthfuls of dirt,
to remains of alcohol and smoke,
to whispers and silent prayers,
to empty altars and scattered rosary beads,
to metamorphosis and a little rage,
to warm touches and twisted tongues,
to tears and a body whole,
love came home to me`
      }
    ];
    const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    content.innerHTML = `
      <ul class="poem-titles">
        ${poems.map((p, i) => `
          <li>
            <button type="button" class="poem-title-btn" data-index="${i}" aria-expanded="false" aria-controls="poem-panel-${i}">
              <span class="poem-title-text">${escapeHtml(p.title)}</span>
              <span class="poem-title-glyph" aria-hidden="true">✦</span>
            </button>
            <div id="poem-panel-${i}" class="poem-panel" hidden>
              <div class="poem-scroll">
                <p class="poetry-text">${escapeHtml(p.body)}</p>
              </div>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
    content.querySelectorAll('.poem-title-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        content.querySelectorAll('.poem-title-btn').forEach((other) => {
          other.setAttribute('aria-expanded', 'false');
          const panel = document.getElementById(other.getAttribute('aria-controls'));
          if (panel) {
            panel.hidden = true;
            panel.classList.remove('open');
          }
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          const panel = document.getElementById(btn.getAttribute('aria-controls'));
          if (panel) {
            panel.hidden = false;
            requestAnimationFrame(() => panel.classList.add('open'));
          }
        }
      });
    });
  }

  openModal('modal-room');
}

// ============================================
// Lazy-load videos (only load when near viewport)
// ============================================
(function initLazyVideos() {
  if (!('IntersectionObserver' in window)) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        video.querySelectorAll('source[data-src]').forEach(source => {
          source.src = source.dataset.src;
        });
        video.load();
        videoObserver.unobserve(video);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('video[data-lazy]').forEach(v => videoObserver.observe(v));
})();

// ============================================
// Back-to-top on footer click (bonus touch)
// ============================================
document.querySelector('footer')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
