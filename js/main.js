/* Mission Control portfolio — main.js */

class PortfolioApp {
  constructor() {
    this.DATA_PATH = './data/projects.json';
    this.owner = {};
    this.projects = [];
    this.tags = new Set();
    this.activeTag = null;
    this.q = '';
    this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  async init() {
    this.startStarfield();
    this.setupScrollProgress();
    await this.loadData();
    this.renderOwner();
    this.setupMobileMenu();
    this.setupNavScrolling();
    this.setupSearchAndFilters();
    this.setupResumeViewer();
    this.renderProjects();
    this.setupReveal();
    this.consoleHello();
  }

  /* ---------- data ---------- */

  async loadData() {
    try {
      const res = await fetch(this.DATA_PATH, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.owner = data.owner || {};
      this.projects = Array.isArray(data.projects) ? data.projects : [];
      this.tags = new Set();
      this.projects.forEach((project) => {
        (project.tags || []).forEach((tag) => this.tags.add(tag));
      });
    } catch (error) {
      console.warn('Could not load data/projects.json', error);
      this.owner = { name: 'Fazle Rabbi Zaki' };
      this.projects = [];
      this.tags = new Set();
    }
  }

  /* ---------- owner / hero ---------- */

  renderOwner() {
    const owner = this.owner || {};
    const setText = (selector, value) => {
      const el = document.querySelector(selector);
      if (el && value) el.textContent = value;
    };
    const setAttr = (selector, attr, value) => {
      const el = document.querySelector(selector);
      if (el && value) el.setAttribute(attr, value);
    };

    setText('#brandName', owner.name);
    setText('#heroName', owner.name);
    setText('#heroRole', owner.title);
    setText('#uniLine', owner.affiliation || owner.university);
    setText('#heroTagline', owner.tagline);
    if (owner.name) setText('#footerName', owner.name.toUpperCase());
    setAttr('#avatar', 'src', this.normalizeImage(owner.photo));

    const year = document.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();

    if (owner.email) setAttr('#emailLink', 'href', `mailto:${owner.email}`);
    if (owner.github) setAttr('#ghLink', 'href', owner.github);
    if (owner.linkedin) setAttr('#lnLink', 'href', owner.linkedin);

    const about = document.querySelector('#aboutBlurb');
    if (about) {
      about.innerHTML = '';
      const paragraphs = Array.isArray(owner.about) ? owner.about : [owner.about].filter(Boolean);
      paragraphs.forEach((copy) => {
        const p = document.createElement('p');
        p.textContent = copy;
        about.appendChild(p);
      });
    }

    const stats = document.querySelector('#heroStats');
    if (stats) {
      stats.innerHTML = '';
      (owner.stats || []).forEach((stat) => {
        const item = document.createElement('div');
        item.className = 'stat-card';
        const value = document.createElement('div');
        value.className = 'stat-value';
        value.dataset.target = stat.value || '';
        value.textContent = stat.value || '';
        const label = document.createElement('div');
        label.className = 'stat-label';
        label.textContent = stat.label || '';
        item.append(value, label);
        stats.appendChild(item);
      });
      this.setupCounters();
    }

    const skills = document.querySelector('#skillGrid');
    if (skills) {
      skills.innerHTML = '';
      (owner.skills || []).forEach((group, index) => skills.appendChild(this.skillNode(group, index)));
    }
  }

  skillNode(group, index) {
    const card = document.createElement('article');
    card.className = 'skill-panel reveal';

    const items = (group.items || [])
      .map((item) => `<li>${this.escapeHTML(item)}</li>`)
      .join('');

    card.innerHTML = `
      <div class="skill-head">
        <span class="skill-icon"><i class="fas ${this.escapeHTML(group.icon || 'fa-gear')}"></i></span>
        <div>
          <h3>${this.escapeHTML(group.group || '')}</h3>
          <span class="sys mono">SYS-${String(index + 1).padStart(2, '0')} · ONLINE</span>
        </div>
      </div>
      <ul>${items}</ul>
    `;

    return card;
  }

  /* ---------- animated counters ---------- */

  setupCounters() {
    const values = document.querySelectorAll('.stat-value');
    if (!values.length) return;

    if (this.reducedMotion || !('IntersectionObserver' in window)) return;

    const animate = (el) => {
      const target = el.dataset.target || '';
      const match = target.match(/(\d+(?:\.\d+)?)/);
      if (!match) return;
      const num = parseFloat(match[1]);
      const prefix = target.slice(0, match.index);
      const suffix = target.slice(match.index + match[1].length);
      const decimals = (match[1].split('.')[1] || '').length;
      const duration = 1400;
      const start = performance.now();

      const frame = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = `${prefix}${(num * eased).toFixed(decimals)}${suffix}`;
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = target;
      };

      requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    values.forEach((el) => observer.observe(el));
  }

  /* ---------- starfield ---------- */

  startStarfield() {
    const canvas = document.querySelector('#starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars = [];
    let meteor = null;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(110, Math.floor((width * height) / 15000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        base: Math.random() * 0.55 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.9 + 0.35
      }));
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        ctx.globalAlpha = star.base;
        ctx.fillStyle = '#cfe3ff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    resize();
    window.addEventListener('resize', () => {
      resize();
      if (this.reducedMotion) drawStatic();
    });

    if (this.reducedMotion) {
      drawStatic();
      return;
    }

    let last = 0;
    const loop = (now) => {
      requestAnimationFrame(loop);
      if (document.hidden) return;
      if (now - last < 1000 / 30) return;
      last = now;

      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;

      stars.forEach((star) => {
        const alpha = star.base * (0.6 + 0.4 * Math.sin(t * star.speed + star.phase));
        ctx.globalAlpha = Math.max(alpha, 0.08);
        ctx.fillStyle = '#cfe3ff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!meteor && Math.random() < 0.004) {
        meteor = {
          x: Math.random() * width * 0.7 + width * 0.2,
          y: Math.random() * height * 0.3,
          vx: -(Math.random() * 6 + 5),
          vy: Math.random() * 3 + 2.4,
          life: 1
        };
      }

      if (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.018;
        if (meteor.life <= 0) {
          meteor = null;
        } else {
          const gradient = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.vx * 9, meteor.y - meteor.vy * 9
          );
          gradient.addColorStop(0, `rgba(82, 224, 196, ${0.7 * meteor.life})`);
          gradient.addColorStop(1, 'rgba(82, 224, 196, 0)');
          ctx.globalAlpha = 1;
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * 9, meteor.y - meteor.vy * 9);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
    };

    requestAnimationFrame(loop);
  }

  /* ---------- scroll progress ---------- */

  setupScrollProgress() {
    const bar = document.querySelector('#scroll-progress');
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- nav / menu ---------- */

  setupMobileMenu() {
    const btn = document.querySelector('#mobile-menu-button');
    const menu = document.querySelector('#mobile-menu');
    const overlay = document.querySelector('#mobile-menu-overlay');
    const toggle = () => {
      btn?.classList.toggle('active');
      menu?.classList.toggle('open');
      overlay?.classList.toggle('hidden');
    };
    const close = () => {
      btn?.classList.remove('active');
      menu?.classList.remove('open');
      overlay?.classList.add('hidden');
    };

    btn?.addEventListener('click', toggle);
    overlay?.addEventListener('click', close);
    document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', close));
  }

  setupNavScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const id = link.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: this.reducedMotion ? 'auto' : 'smooth' });
      });
    });

    const sections = [...document.querySelectorAll('section[id], header[id]')];
    const links = [...document.querySelectorAll('.nav-link')];
    const updateActive = () => {
      let current = '';
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY - 130;
        if (window.scrollY >= top) current = section.id;
      });
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ---------- reveal ---------- */

  setupReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length || !('IntersectionObserver' in window) || this.reducedMotion) {
      items.forEach((item) => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach((item) => observer.observe(item));
  }

  /* ---------- search + filters ---------- */

  setupSearchAndFilters() {
    const bar = document.querySelector('#tagBar');
    if (bar) {
      bar.innerHTML = '';
      bar.appendChild(this.filterButton('ALL', null));
      [...this.tags].sort((a, b) => a.localeCompare(b)).forEach((tag) => {
        bar.appendChild(this.filterButton(tag, tag));
      });
    }

    document.querySelector('#search')?.addEventListener('input', (event) => {
      this.q = event.target.value.trim().toLowerCase();
      this.renderProjects();
    });
  }

  filterButton(label, tag) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'filter-tag';
    btn.textContent = label;
    btn.dataset.tag = tag ?? '';
    btn.addEventListener('click', () => {
      this.activeTag = tag;
      this.renderProjects();
    });
    return btn;
  }

  markActiveTag() {
    document.querySelectorAll('.filter-tag').forEach((btn) => {
      const isActive = (this.activeTag === null && btn.dataset.tag === '') || btn.dataset.tag === this.activeTag;
      btn.classList.toggle('active', isActive);
    });
  }

  /* ---------- projects ---------- */

  renderProjects() {
    const grid = document.querySelector('#projects-grid');
    const empty = document.querySelector('#projects-empty');
    if (!grid) return;

    const list = this.projects.filter((project) => this.matchesProject(project));
    grid.innerHTML = '';
    const useWide = !this.activeTag && !this.q;
    list.forEach((project, i) => {
      const card = this.cardNode(project);
      if (useWide && i === 0 && project.featured) card.classList.add('featured-wide');
      grid.appendChild(card);
    });
    empty?.classList.toggle('hidden', list.length > 0);
    this.markActiveTag();
  }

  matchesProject(project) {
    const tagOK = !this.activeTag || (project.tags || []).includes(this.activeTag);
    const haystack = [
      project.title,
      project.role,
      project.dates,
      project.location,
      project.context,
      project.summary,
      ...(project.tags || [])
    ].join(' ').toLowerCase();
    const qOK = !this.q || haystack.includes(this.q);
    return tagOK && qOK;
  }

  cardNode(project) {
    const index = this.projects.indexOf(project);
    const missionNo = `M-${String(index + 1).padStart(2, '0')}`;

    const card = document.createElement('article');
    card.className = 'mission-card';

    const media = document.createElement('div');
    media.className = 'mission-media';
    this.renderMedia(media, project);

    const scan = document.createElement('div');
    scan.className = 'scan';
    media.appendChild(scan);

    const number = document.createElement('span');
    number.className = 'mission-no';
    number.textContent = missionNo;
    media.appendChild(number);

    if (project.featured) {
      const chip = document.createElement('span');
      chip.className = 'featured-chip';
      chip.textContent = 'FEATURED';
      media.appendChild(chip);
    }

    const mediaTotal = (project.gallery || []).length + (project.videos || []).length;
    if (mediaTotal > 0) {
      const count = document.createElement('span');
      count.className = 'media-count';
      count.innerHTML = `<i class="fas fa-camera"></i>${mediaTotal}`;
      media.appendChild(count);
    }

    const body = document.createElement('div');
    body.className = 'mission-body';

    const sub = document.createElement('p');
    sub.className = 'mission-sub';
    sub.textContent = [project.role, project.dates].filter(Boolean).join(' · ');

    const title = document.createElement('h3');
    title.textContent = project.title || 'Project';

    const summary = document.createElement('p');
    summary.className = 'mission-summary';
    summary.textContent = project.summary || '';

    const metrics = document.createElement('ul');
    metrics.className = 'mission-metrics';
    (project.metrics || []).slice(0, 3).forEach((metric) => {
      const li = document.createElement('li');
      li.textContent = metric;
      metrics.appendChild(li);
    });

    const tags = document.createElement('div');
    tags.className = 'mission-tags';
    (project.tags || []).forEach((tag) => {
      const pill = document.createElement('span');
      pill.className = 'tag';
      pill.textContent = tag;
      tags.appendChild(pill);
    });

    body.append(sub, title, summary, metrics, tags);

    if (project.slug) {
      const link = document.createElement('a');
      link.className = 'card-link';
      link.href = `./project.html?slug=${encodeURIComponent(project.slug)}`;
      link.innerHTML = 'OPEN CASE STUDY <i class="fas fa-arrow-right"></i>';
      body.appendChild(link);
    }

    card.append(media, body);
    return card;
  }

  renderMedia(media, project) {
    const src = this.normalizeImage(project.heroImage);

    const fallback = () => {
      media.querySelector('img')?.remove();
      const icon = project.visual?.icon || 'fa-satellite';
      const label = project.visual?.label || project.title || 'Project';
      const wrap = document.createElement('div');
      wrap.className = 'mission-visual';
      wrap.innerHTML = `
        <i class="fas ${this.escapeHTML(icon)}"></i>
        <span>${this.escapeHTML(label)}</span>
      `;
      media.prepend(wrap);
    };

    if (!src) {
      fallback();
      return;
    }

    const img = document.createElement('img');
    img.src = src;
    img.alt = project.title || 'Project image';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = fallback;
    media.prepend(img);
  }

  /* ---------- resume ---------- */

  async setupResumeViewer() {
    const box = document.querySelector('#resumeEmbed');
    if (!box) return;

    const url = './resume.pdf';
    try {
      const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      box.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = `${url}#view=FitH`;
      iframe.title = 'Resume PDF';
      iframe.loading = 'lazy';
      box.appendChild(iframe);
    } catch (error) {
      box.innerHTML = `
        <div class="pdf-placeholder">
          <i class="fas fa-file-pdf"></i>
          <p>// PREVIEW UNAVAILABLE — USE DOWNLOAD LINK BELOW</p>
        </div>
      `;
    }
  }

  /* ---------- utils ---------- */

  normalizeImage(path) {
    if (!path) return '';
    if (/^https?:/i.test(path)) return path;
    let normalized = String(path).trim();
    if (normalized.startsWith('./')) normalized = normalized.slice(2);
    if (/^(images|reports|content)\//.test(normalized)) return normalized;
    return `images/${normalized.split('/').pop()}`;
  }

  escapeHTML(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  consoleHello() {
    console.log('%c// MISSION CONTROL ONLINE — portfolio v4.0', 'color:#52e0c4;font-family:monospace;');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});
