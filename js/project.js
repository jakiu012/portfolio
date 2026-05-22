(function () {
  const $ = (selector) => document.querySelector(selector);
  const qs = new URLSearchParams(window.location.search);
  const slug = qs.get('slug');

  function setupTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', saved ? saved === 'dark' : prefersDark);

    $('#theme-toggle')?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  }

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
    span.className = 'tag px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-[0.08em]';
    span.textContent = label;
    return span;
  }

  function metricItem(text) {
    const li = document.createElement('li');
    li.className = 'flex gap-3';
    li.innerHTML = `<i class="fas fa-circle-check mt-1 text-xs text-teal-700 dark:text-teal-300"></i><span>${escapeHTML(text)}</span>`;
    return li;
  }

  function setFallbackVisual(project) {
    const visual = $('#heroVisual');
    if (!visual) return;
    const icon = project.visual?.icon || 'fa-satellite';
    const label = project.visual?.label || project.title || 'Project';
    visual.innerHTML = `
      <div class="h-full w-full flex flex-col items-center justify-center text-white text-center p-8">
        <i class="fas ${escapeHTML(icon)} text-7xl mb-6"></i>
        <span class="text-sm font-extrabold uppercase tracking-[0.2em]">${escapeHTML(label)}</span>
      </div>
    `;
  }

  function renderHeroImage(path, project) {
    setFallbackVisual(project);
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
      a.className = 'hover:underline';
      a.addEventListener('click', (event) => {
        event.preventDefault();
        const top = heading.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
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
      box.innerHTML = '<p class="text-sm text-slate-500 dark:text-slate-400">No external links yet.</p>';
      return;
    }

    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener';
      a.className = 'w-full px-4 py-2.5 rounded-lg border border-teal-700 text-teal-700 dark:text-teal-300 dark:border-teal-400 text-sm font-bold inline-flex items-center justify-center hover:bg-teal-700 hover:text-white dark:hover:bg-teal-500 dark:hover:text-slate-950 transition';
      a.innerHTML = `<i class="fas fa-arrow-up-right-from-square mr-2"></i>${escapeHTML(link.label || 'Open link')}`;
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
    setupTheme();

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
    $('#subtitle').textContent = project.role || '';
    $('#summary').textContent = project.summary || '';
    $('#dates').innerHTML = project.dates ? `<i class="fa-solid fa-calendar mr-2"></i>${escapeHTML(project.dates)}` : '';
    $('#location').innerHTML = project.location ? `<i class="fa-solid fa-location-dot mr-2"></i>${escapeHTML(project.location)}` : '';

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
