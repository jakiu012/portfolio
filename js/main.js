class PortfolioApp {
  constructor() {
    this.DATA_PATH = './data/projects.json';
    this.owner = {};
    this.projects = [];
    this.tags = new Set();
    this.activeTag = null;
    this.q = '';
    this.init();
  }

  async init() {
    await this.loadData();
    this.renderOwner();
    this.setupThemeToggle();
    this.setupMobileMenu();
    this.setupNavScrolling();
    this.setupSearchAndFilters();
    this.setupReveal();
    this.setupResumeViewer();
    this.renderFeatured();
    this.renderProjects();
    this.consoleHello();
  }

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
    setText('#heroTitle', owner.title);
    setText('#uniLine', owner.affiliation || owner.university);
    setText('#heroTagline', owner.tagline);
    setText('#footerName', owner.name);
    setAttr('#avatar', 'src', this.normalizeImage(owner.photo));

    const year = document.querySelector('#year');
    if (year) year.textContent = new Date().getFullYear();

    const emailHref = owner.email ? `mailto:${owner.email}` : 'mailto:jakiuddin012@gmail.com';
    setAttr('#emailLink', 'href', emailHref);
    setAttr('#ghLink', 'href', owner.github || 'https://github.com/jakiu012');
    setAttr('#lnLink', 'href', owner.linkedin || 'https://www.linkedin.com/in/fazlerabbizaki');

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
        item.className = 'rounded-lg border border-white/15 bg-white/10 p-4';
        item.innerHTML = `
          <div class="text-2xl font-extrabold text-white">${this.escapeHTML(stat.value || '')}</div>
          <div class="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">${this.escapeHTML(stat.label || '')}</div>
        `;
        stats.appendChild(item);
      });
    }

    const skills = document.querySelector('#skillGrid');
    if (skills) {
      skills.innerHTML = '';
      (owner.skills || []).forEach((group) => skills.appendChild(this.skillNode(group)));
    }
  }

  skillNode(group) {
    const card = document.createElement('article');
    card.className = 'rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-5';

    const items = (group.items || [])
      .map((item) => `
        <li class="flex gap-3">
          <i class="fas fa-check mt-1 text-xs text-teal-700 dark:text-teal-300"></i>
          <span>${this.escapeHTML(item)}</span>
        </li>
      `)
      .join('');

    card.innerHTML = `
      <div class="h-11 w-11 rounded-lg bg-teal-700 text-white inline-flex items-center justify-center mb-4">
        <i class="fas ${this.escapeHTML(group.icon || 'fa-gear')}"></i>
      </div>
      <h3 class="text-lg font-extrabold mb-4">${this.escapeHTML(group.group || '')}</h3>
      <ul class="space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">${items}</ul>
    `;

    return card;
  }

  setupThemeToggle() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : prefersDark);

    const toggle = () => {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    document.querySelector('#theme-toggle')?.addEventListener('click', toggle);
    document.querySelector('#theme-toggle-mobile')?.addEventListener('click', toggle);
  }

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
        const top = target.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });

    const sections = [...document.querySelectorAll('section[id]')];
    const links = [...document.querySelectorAll('.nav-link')];
    const updateActive = () => {
      let current = '';
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY - 120;
        if (window.scrollY >= top) current = section.id;
      });
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });
    };

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  setupReveal() {
    const items = document.querySelectorAll('.fade-in');
    if (!items.length || !('IntersectionObserver' in window)) {
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
    }, { threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  setupSearchAndFilters() {
    const bar = document.querySelector('#tagBar');
    if (bar) {
      bar.innerHTML = '';
      bar.appendChild(this.filterButton('All', null));
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
    btn.className = 'filter-tag px-4 py-2 rounded-lg text-sm font-bold transition';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      this.activeTag = tag;
      this.renderProjects();
      this.markActiveTag();
    });
    return btn;
  }

  markActiveTag() {
    document.querySelectorAll('.filter-tag').forEach((btn) => {
      const isActive = (btn.textContent === 'All' && this.activeTag === null) || btn.textContent === this.activeTag;
      btn.classList.toggle('active', isActive);
    });
  }

  renderFeatured() {
    const box = document.querySelector('#featured');
    if (!box) return;

    box.innerHTML = '';
    this.projects
      .filter((project) => project.featured)
      .slice(0, 3)
      .forEach((project) => box.appendChild(this.cardNode(project)));
  }

  renderProjects() {
    const grid = document.querySelector('#projects-grid');
    const empty = document.querySelector('#projects-empty');
    if (!grid) return;

    const list = this.projects.filter((project) => this.matchesProject(project));
    grid.innerHTML = '';
    list.forEach((project) => grid.appendChild(this.cardNode(project)));
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
    const template = document.querySelector('#projectCardTmpl');
    const node = template?.content ? template.content.cloneNode(true) : document.createDocumentFragment();
    const root = node.querySelector?.('.project-card') || this.fallbackCardShell();

    const title = root.querySelector('.card-title');
    const sub = root.querySelector('.card-sub');
    const summary = root.querySelector('.card-summary');
    const metrics = root.querySelector('.metrics');
    const tags = root.querySelector('.tag-row');
    const links = root.querySelector('.links');
    const badge = root.querySelector('.featured-badge');
    const media = root.querySelector('.project-media');

    if (title) title.textContent = project.title || 'Project';
    if (sub) sub.textContent = [project.role, project.dates].filter(Boolean).join(' | ');
    if (summary) summary.textContent = project.summary || '';
    badge?.classList.toggle('hidden', !project.featured);

    this.renderMedia(media, project);

    if (metrics) {
      metrics.innerHTML = '';
      (project.metrics || []).slice(0, 3).forEach((metric) => {
        const li = document.createElement('li');
        li.className = 'flex gap-3';
        li.innerHTML = `<i class="fas fa-circle-check mt-1 text-xs text-teal-700 dark:text-teal-300"></i><span>${this.escapeHTML(metric)}</span>`;
        metrics.appendChild(li);
      });
    }

    if (tags) {
      tags.innerHTML = '';
      (project.tags || []).forEach((tag) => {
        const pill = document.createElement('span');
        pill.className = 'tag px-2.5 py-1 rounded-lg text-xs font-bold';
        pill.textContent = tag;
        tags.appendChild(pill);
      });
    }

    if (links && project.slug) {
      links.innerHTML = '';
      const anchor = document.createElement('a');
      anchor.href = `./project.html?slug=${encodeURIComponent(project.slug)}`;
      anchor.className = 'btn-primary px-4 py-2.5 rounded-lg text-sm font-bold inline-flex items-center justify-center';
      anchor.innerHTML = '<i class="fas fa-arrow-up-right-from-square mr-2"></i>Read case study';
      links.appendChild(anchor);
    }

    return template?.content ? node : root;
  }

  renderMedia(media, project) {
    if (!media) return;
    media.innerHTML = '';
    const src = this.normalizeImage(project.heroImage);

    const fallback = () => {
      media.innerHTML = '';
      const icon = project.visual?.icon || 'fa-satellite';
      const label = project.visual?.label || project.title || 'Project';
      const wrap = document.createElement('div');
      wrap.className = 'project-visual h-full w-full flex flex-col items-center justify-center text-white text-center p-6';
      wrap.innerHTML = `
        <i class="fas ${this.escapeHTML(icon)} text-4xl mb-4"></i>
        <span class="text-sm font-extrabold uppercase tracking-[0.16em]">${this.escapeHTML(label)}</span>
      `;
      media.appendChild(wrap);
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
    img.className = 'w-full h-full object-cover';
    img.onerror = fallback;
    media.appendChild(img);
  }

  fallbackCardShell() {
    const article = document.createElement('article');
    article.className = 'project-card bg-white dark:bg-slate-950 rounded-lg overflow-hidden flex flex-col';
    article.innerHTML = `
      <div class="project-media h-52 overflow-hidden bg-slate-200 dark:bg-slate-800"></div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="text-xl font-extrabold card-title"></h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 card-sub"></p>
        <p class="text-sm leading-6 text-slate-700 dark:text-slate-300 my-4 card-summary"></p>
        <ul class="metrics space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4"></ul>
        <div class="flex flex-wrap gap-2 mb-5 tag-row"></div>
        <div class="mt-auto links"></div>
      </div>
    `;
    return article;
  }

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
      iframe.className = 'w-full h-[680px] border-0';
      box.appendChild(iframe);
    } catch (error) {
      box.innerHTML = `
        <div class="min-h-[360px] flex flex-col items-center justify-center text-center p-8 text-slate-500 dark:text-slate-400">
          <i class="fas fa-file-pdf text-5xl mb-4"></i>
          <p class="font-semibold">Resume preview is unavailable.</p>
          <p class="text-sm mt-2">Use the download link below.</p>
        </div>
      `;
    }
  }

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
    console.log('Portfolio ready');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});
