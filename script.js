/* ============================================
   NIAH'S HOUSE — Portfolio JS
   Motion-enhanced version
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
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;

  const sparkleColors = ['#fff3a8', '#ffe27a', '#fde68a', '#fff8c2', '#ffd6e8', '#f0c8f8'];
  let lastSpawn = 0;
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
    p.style.cssText = `width:${size}px;height:${size}px;background:${color};left:${x}px;top:${y}px;box-shadow:1px 0 0 ${color},0 1px 0 ${color};`;
    document.body.appendChild(p);
    p.animate(
      [
        { opacity: 1, transform: 'translateY(0px) translateX(0px) scale(1)' },
        { opacity: 0, transform: `translateY(22px) translateX(${drift}px) scale(0.6)` }
      ],
      { duration: 700, easing: 'ease-out', fill: 'forwards' }
    ).finished.then(() => p.remove());
  });

  // Cursor scale on hover of interactive elements
  const interactives = 'button, a, .brand-card-btn, .poster-btn, .art-door-btn, .skill-pill, .project-link';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });

  cursor.style.display = 'block';
})();

// ============================================
// Floating Nav
// ============================================
(function initNav() {
  const nav = document.getElementById('floating-nav');
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = ['welcome', 'about', 'work', 'projects', 'contact'];

  window.addEventListener('scroll', () => {
    nav.classList.toggle('visible', window.scrollY > 200);
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 150) current = id;
    });
    navBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.target === current));
  }, { passive: true });

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const el = document.getElementById(btn.dataset.target);
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
  }, { rootMargin: '-60px 0px', threshold: 0.08 });
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
// Magnetic Hover — skill pills & nav buttons
// (subtle pull-toward-cursor effect)
// ============================================
(function initMagnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const targets = document.querySelectorAll('.skill-pill, .nav-btn, .btn-enter');
  targets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
})();

// ============================================
// Tilt Card — project cards, brand cards, poster items
// ============================================
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cards = document.querySelectorAll(
    '.project-card-v2, .brand-card-btn .brand-card-inner, .poster-item, .letter-card, .msb-card'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const rotX = y * -8;
      const rotY = x * 8;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.boxShadow = `${-rotY * 1.5}px ${rotX * 1.5 + 12}px 40px rgba(0,0,0,0.12)`;
      card.style.transition = 'none';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
    });
  });
})();

// ============================================
// Stagger reveal for pill rows
// ============================================
(function initPillStagger() {
  const rows = document.querySelectorAll('.pills-row');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const pills = entry.target.querySelectorAll('.skill-pill');
      pills.forEach((pill, i) => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(16px)';
        setTimeout(() => {
          pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          pill.style.opacity = '1';
          pill.style.transform = 'translateY(0)';
        }, i * 55);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  rows.forEach(r => observer.observe(r));
})();

// ============================================
// Poster hover — lift + glare sweep
// ============================================
(function initPosterGlare() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.poster-btn').forEach(btn => {
    let glare = btn.querySelector('.poster-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'poster-glare';
      glare.style.cssText = `
        position:absolute;inset:0;pointer-events:none;z-index:5;border-radius:inherit;
        background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 65%);
        opacity:0;transition:opacity 0.3s;
      `;
      btn.style.position = 'relative';
      btn.appendChild(glare);
    }
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      glare.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.22) 0%, transparent 60%)`;
      glare.style.opacity = '1';
    });
    btn.addEventListener('mouseleave', () => { glare.style.opacity = '0'; });
  });
})();

// ============================================
// Letter card wiggle on scroll entry
// ============================================
(function initLetterWiggle() {
  const card = document.querySelector('.letter-card');
  if (!card) return;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      card.style.animation = 'letter-wiggle 0.5s ease forwards';
      observer.unobserve(card);
    }
  }, { threshold: 0.4 });
  observer.observe(card);
})();

// ============================================
// Scroll progress bar (top of page)
// ============================================
(function initScrollBar() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;width:0%;
    background:linear-gradient(90deg,hsl(270,50%,75%),hsl(340,70%,82%),hsl(45,80%,78%));
    z-index:9999;pointer-events:none;transition:width 0.1s linear;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

// ============================================
// Section title text-reveal (letter by letter)
// ============================================
(function initTitleReveal() {
  const titles = document.querySelectorAll('.section-title');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.textContent;
      el.innerHTML = '';
      el.style.opacity = '1';
      el.style.transform = 'none';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display:inline-block;opacity:0;transform:translateY(20px);
          transition:opacity 0.35s ease ${i * 28}ms, transform 0.35s ease ${i * 28}ms;
        `;
        el.appendChild(span);
        setTimeout(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }, 80 + i * 28);
      });
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  titles.forEach(t => observer.observe(t));
})();

// ============================================
// Ambient float on MSB cards (brand strategy section)
// ============================================
(function initMsbFloat() {
  document.querySelectorAll('.msb-card').forEach((card, i) => {
    card.style.animationDelay = `${i * 0.4}s`;
    card.classList.add('msb-float');
  });
})();

// ============================================
// Reel window hover — gentle lift
// ============================================
(function initReelHover() {
  document.querySelectorAll('.reel-window').forEach(reel => {
    reel.addEventListener('mouseenter', () => {
      reel.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
      reel.style.transform = 'translateY(-8px) rotate(-0.5deg)';
    });
    reel.addEventListener('mouseleave', () => {
      reel.style.transform = '';
    });
  });
})();

// ============================================
// Art door — depth on hover
// ============================================
(function initDoorHover() {
  document.querySelectorAll('.art-door-btn').forEach(door => {
    door.addEventListener('mouseenter', () => {
      door.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease';
      door.style.transform = 'translateY(-6px) scale(1.02)';
      door.style.boxShadow = '0 16px 48px rgba(200,140,160,0.18)';
    });
    door.addEventListener('mouseleave', () => {
      door.style.transform = '';
      door.style.boxShadow = '';
    });
  });
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
  const onKey = (e) => { if (e.key === 'Escape') { closeModal(id); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
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
      { title: 'Vulning Pelican', src: 'https://res.cloudinary.com/dg1zcff2r/image/upload/q_auto/f_auto/v1776887182/WhatsApp_Image_2026-04-22_at_15.59.34_nfjxzo.jpg' },
      { title: 'Watch Over Me',   src: 'https://res.cloudinary.com/dg1zcff2r/image/upload/q_auto/f_auto/v1776887181/WhatsApp_Image_2026-04-22_at_15.58.14_ikn8pp.jpg' },
      { title: 'Red Chords',      src: 'https://res.cloudinary.com/dg1zcff2r/image/upload/q_auto/f_auto/v1776887053/WhatsApp_Image_2026-04-09_at_11.58.19_1_kdokil.jpg', noCaption: true, fitFrame: true }
    ];
    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    content.innerHTML = `
      <div class="art-grid">
        ${artworks.map(a => `
          <figure class="art-frame">
            <div class="art-frame-inner has-image"${a.fitFrame ? ' style="aspect-ratio:auto;height:auto;"' : ''}>
              <img src="${esc(a.src)}" alt="${esc(a.title)}" loading="lazy"${a.fitFrame ? ' style="width:100%;height:auto;object-fit:unset;"' : ''} />
            </div>
            ${a.noCaption ? '' : `<figcaption class="art-caption">${esc(a.title)}</figcaption>`}
          </figure>
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
        body: `You brought me pink plastic dinos when I was six,\nI'd hide them between your couch,\nAnd we'd laugh when you found them,\nA decade later,\nI still buy myself pink plastic dinos,\nThat I'll hide when I'm home,\nWaiting for you to find them,\nSo we could laugh again.`
      },
      {
        title: 'Born Entertainer',
        body: `Who am I performing for?\nwith a red ball for a nose\nand a cracked smile\nupon my white powdered cheeks\ni know you're watching\nnot her beside you\npearls in her hair\nmoons shining beneath her silk\n\nand when the curtain rips\nI spin on glass shards\nI swirl in blood pools\nthe spotlight illuminates my every limb\nthe audience beg for more,\ntheir applause deafens me,\n\nI know you're watching me,\nwhen you lean in to kiss her\nafter my show`
      },
      {
        title: 'Love Came Home',
        body: `Love came home\nto blood-dried marble tiles,\nto white lilies rotting on fungus grounds,\nto graves dug out for one (by one),\nto yellowing teeth and tar-filled lungs,\nto shards of glass pricking the sole,\nto sick, silent nights with a sinner,\nto scarlet slashes and impurity,\nto skin and bones,\nto earth-fed nails and mouthfuls of dirt,\nto remains of alcohol and smoke,\nto whispers and silent prayers,\nto empty altars and scattered rosary beads,\nto metamorphosis and a little rage,\nto warm touches and twisted tongues,\nto tears and a body whole,\nlove came home to me`
      }
    ];
    const esc = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    content.innerHTML = `
      <ul class="poem-titles">
        ${poems.map((p, i) => `
          <li>
            <button type="button" class="poem-title-btn" data-index="${i}" aria-expanded="false" aria-controls="poem-panel-${i}">
              <span class="poem-title-text">${esc(p.title)}</span>
              <span class="poem-title-glyph" aria-hidden="true">✦</span>
            </button>
            <div id="poem-panel-${i}" class="poem-panel" hidden>
              <div class="poem-scroll">
                <p class="poetry-text">${esc(p.body)}</p>
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
          if (panel) { panel.hidden = true; panel.classList.remove('open'); }
        });
        if (!isOpen) {
          btn.setAttribute('aria-expanded', 'true');
          const panel = document.getElementById(btn.getAttribute('aria-controls'));
          if (panel) { panel.hidden = false; requestAnimationFrame(() => panel.classList.add('open')); }
        }
      });
    });
  }
  openModal('modal-room');
}

// ============================================
// Lazy-load videos
// ============================================
(function initLazyVideos() {
  if (!('IntersectionObserver' in window)) return;
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        video.querySelectorAll('source[data-src]').forEach(source => { source.src = source.dataset.src; });
        video.load();
        videoObserver.unobserve(video);
      }
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('video[data-lazy]').forEach(v => videoObserver.observe(v));
})();

// ============================================
// Back-to-top on footer click
// ============================================
document.querySelector('footer')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
