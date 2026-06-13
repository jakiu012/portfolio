/* Mission Control portfolio — case study page */

(function () {
  const $ = (selector) => document.querySelector(selector);
  const qs = new URLSearchParams(window.location.search);
  const slug = qs.get('slug');
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- starfield (shared look with index) ---------- */
  function startStarfield() {
    const canvas = $('#starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.floor((width * height) / 10000));
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
      if (reducedMotion) drawStatic();
    });

    if (reducedMotion) {
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
      ctx.globalAlpha = 1;
    };
    requestAnimationFrame(loop);
  }

  function setupScrollProgress() {
    const bar = $('#scroll-progress');
    if (!bar) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- helpers ---------- */

  function normalizeImg(path) {
    if (!path) return '';
    if (/^https?:/i.test(path)) return path;
    let normalized = String(path).trim();
    if (normalized.startsWith('./')) normalized = normalized.slice(2);
    if (/^(images|reports|content)\//.test(normalized)) return normalized;
    return `images/${normalized.split('/').pop()}`;
  }

  function escapeHTML(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function setMeta({ title, description, image }) {
    if (title) document.title = `${title} - Fazle Rabbi Zaki`;
    const ensure = (key, content) => {
      if (!content) return;
      const attr = key.startsWith('og:') ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    ensure('description', description);
    ensure('og:title', title ? `${title} - Fazle Rabbi Zaki` : '');
    ensure('og:description', description);
    ensure('og:image', image);
  }

  async function loadJSON(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
  }

  async function loadMD(url) {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.text();
  }

  function parseFrontMatter(md) {
    const match = md.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
    if (!match) return { fm: {}, body: md };
    let fm = {};
    try {
      fm = window.jsyaml ? window.jsyaml.load(match[1]) || {} : {};
    } catch {
      fm = {};
    }
    return { fm, body: match[2] || '' };
  }

  function tagPill(label) {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = label;
    return span;
  }

  function metricItem(text) {
    const li = document.createElement('li');
    li.textContent = text;
    return li;
  }

  function renderHeroImage(path, project) {
    const img = $('#heroImg');
    if (!img) return;
    const src = normalizeImg(path);
    if (!src) return;
    img.src = src;
    img.alt = project.title || 'Project image';
    img.onload = () => img.classList.remove('hidden');
    img.onerror = () => {
      img.classList.add('hidden');
      img.removeAttribute('src');
    };
  }

  function buildTOC(container) {
    const headings = [...container.querySelectorAll('h2')];
    const toc = $('#toc');
    const list = $('#tocList');
    if (!toc || !list || !headings.length) return;

    list.innerHTML = '';
    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = heading.textContent
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
      }
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent.trim();
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const top = heading.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    toc.classList.remove('hidden');
  }

  function renderLinks(project) {
    const box = $('#links');
    if (!box) return;

    box.innerHTML = '';
    const links = (project.links || []).filter((link) => link.href);
    if (!links.length) {
      box.innerHTML = '<p class="side-empty">// NO EXTERNAL LINKS YET</p>';
      return;
    }

    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'side-link';
      a.innerHTML = `<i class="fas fa-arrow-up-right-from-square"></i>${escapeHTML(link.label || 'Open link')}`;
      box.appendChild(a);
    });
  }

  function renderMarkdown(project, markdown) {
    const { fm, body } = parseFrontMatter(markdown);
    const content = $('#caseContent');
    if (!content) return;

    if (fm.description) {
      setMeta({
        title: project.title,
        description: fm.description,
        image: normalizeImg(fm.hero || project.heroImage || '')
      });
    }

    if (fm.hero) renderHeroImage(fm.hero, project);

    content.innerHTML = window.marked ? window.marked.parse(body) : body;
    content.querySelectorAll('img').forEach((img) => {
      const src = normalizeImg(img.getAttribute('src') || '');
      if (src) img.setAttribute('src', src);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = img.alt || project.title || 'Project image';
      img.onerror = () => img.remove();
    });

    buildTOC(content);
  }

  async function main() {
    startStarfield();
    setupScrollProgress();

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    if (!slug) {
      $('#title').textContent = 'Project not found';
      $('#summary').textContent = 'Missing project slug.';
      return;
    }

    let data;
    try {
      data = await loadJSON('./data/projects.json');
    } catch {
      $('#title').textContent = 'Project not found';
      $('#summary').textContent = 'Could not load project data.';
      return;
    }

    const project = (data.projects || []).find((item) => String(item.slug || '').toLowerCase() === slug.toLowerCase());
    if (!project) {
      $('#title').textContent = 'Project not found';
      $('#summary').textContent = `No project with slug "${slug}".`;
      return;
    }

    $('#title').textContent = project.title || 'Project';
    $('#subtitle').textContent = [project.role, project.context].filter(Boolean).join(' · ');
    $('#summary').textContent = project.summary || '';
    $('#dates').innerHTML = project.dates ? `<i class="fa-solid fa-calendar"></i>${escapeHTML(project.dates)}` : '';
    $('#location').innerHTML = project.location ? `<i class="fa-solid fa-location-dot"></i>${escapeHTML(project.location)}` : '';

    const tags = $('#tags');
    if (tags) {
      tags.innerHTML = '';
      (project.tags || []).forEach((tag) => tags.appendChild(tagPill(tag)));
    }

    const metrics = $('#metrics');
    if (metrics) {
      metrics.innerHTML = '';
      (project.metrics || []).forEach((metric) => metrics.appendChild(metricItem(metric)));
    }

    renderLinks(project);
    renderHeroImage(project.heroImage, project);
    setMeta({
      title: project.title,
      description: project.summary,
      image: normalizeImg(project.heroImage || 'images/fazle_headshot.jpg')
    });

    try {
      const markdown = await loadMD(`./content/projects/${encodeURIComponent(project.slug)}.md`);
      renderMarkdown(project, markdown);
    } catch {
      $('#comingSoon')?.classList.remove('hidden');
    }
  }

  main().catch((error) => {
    console.error(error);
    const title = $('#title');
    const summary = $('#summary');
    if (title) title.textContent = 'Project error';
    if (summary) summary.textContent = error.message;
  });
})();
