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

  /* minimal markdown fallback used when the marked CDN is unavailable */
  function miniMarkdown(md) {
    const inline = (s) => escapeHTML(s)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');

    const blocks = md.replace(/\r\n/g, '\n').split(/\n{2,}/);
    return blocks.map((block) => {
      const b = block.trim();
      if (!b) return '';
      if (/^#{1,6}\s/.test(b)) {
        const level = b.match(/^#+/)[0].length;
        return `<h${level}>${inline(b.replace(/^#+\s*/, ''))}</h${level}>`;
      }
      if (/^(-{3,}|\*{3,})$/.test(b)) return '<hr>';
      if (/^>/.test(b)) {
        return `<blockquote><p>${inline(b.replace(/^>\s?/gm, ''))}</p></blockquote>`;
      }
      if (/^\|/.test(b)) {
        const rows = b.split('\n').filter((r) => /^\|/.test(r));
        const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const head = cells(rows[0]);
        const body = rows.slice(1).filter((r) => !/^\|[\s:|-]+\|$/.test(r));
        return `<table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>` +
          `<tbody>${body.map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
      }
      if (/^(\d+\.|[-*])\s/m.test(b)) {
        const ordered = /^\d+\./.test(b);
        const items = b.split('\n').map((line) => line.replace(/^(\d+\.|[-*])\s*/, '')).map((item) => `<li>${inline(item)}</li>`).join('');
        return ordered ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
      }
      return `<p>${inline(b).replace(/\n/g, '<br>')}</p>`;
    }).join('\n');
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


  function normalizeMedia(path) {
    if (!path) return '';
    if (/^https?:/i.test(path)) return path;
    let normalized = String(path).trim();
    if (normalized.startsWith('./')) normalized = normalized.slice(2);
    return normalized;
  }

  function renderVideos(project) {
    const items = [];
    if (Array.isArray(project.videos)) items.push(...project.videos);
    else if (project.video) items.push(project.video);
    if (!items.length) return;

    const summary = $('#summary');
    if (!summary) return;

    [...items].reverse().forEach((item) => {
      const src = typeof item === 'string' ? item : item.src;
      const caption = typeof item === 'string' ? '' : item.caption || '';
      if (!src) return;

      const figure = document.createElement('figure');
      figure.className = 'case-video';
      const shell = document.createElement('div');
      shell.className = 'video-shell';

      const url = normalizeMedia(src);
      const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
      const vimeo = url.match(/vimeo\.com\/(\d+)/);

      if (yt || vimeo) {
        const iframe = document.createElement('iframe');
        iframe.src = yt
          ? `https://www.youtube-nocookie.com/embed/${yt[1]}`
          : `https://player.vimeo.com/video/${vimeo[1]}`;
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.title = `${project.title || 'Project'} demo video`;
        shell.appendChild(iframe);
      } else {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.onerror = () => figure.remove();
        shell.appendChild(video);
      }

      figure.appendChild(shell);
      if (caption) {
        const cap = document.createElement('figcaption');
        cap.className = 'video-caption';
        cap.textContent = caption;
        figure.appendChild(cap);
      }

      summary.insertAdjacentElement('afterend', figure);
    });
  }

  /* ---------- gallery + lightbox ---------- */

  const lightboxState = { items: [], index: 0 };

  function openLightbox(index) {
    const box = $('#lightbox');
    const img = $('#lightboxImg');
    const cap = $('#lightboxCap');
    if (!box || !img || !lightboxState.items.length) return;
    lightboxState.index = (index + lightboxState.items.length) % lightboxState.items.length;
    const item = lightboxState.items[lightboxState.index];
    img.src = item.src;
    img.alt = item.caption || 'Project image';
    if (cap) cap.textContent = item.caption ? `${String(lightboxState.index + 1).padStart(2, '0')} / ${String(lightboxState.items.length).padStart(2, '0')} — ${item.caption}` : '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    $('#lightbox')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function setupLightbox() {
    const box = $('#lightbox');
    if (!box) return;
    box.querySelector('.lb-close')?.addEventListener('click', closeLightbox);
    box.querySelector('.lb-prev')?.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lightboxState.index - 1); });
    box.querySelector('.lb-next')?.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(lightboxState.index + 1); });
    box.addEventListener('click', (e) => { if (e.target === box) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox(lightboxState.index - 1);
      if (e.key === 'ArrowRight') openLightbox(lightboxState.index + 1);
    });
  }

  function renderGallery(project) {
    const section = $('#gallerySection');
    const grid = $('#galleryGrid');
    const countEl = $('#galleryCount');
    const items = (project.gallery || [])
      .map((item) => (typeof item === 'string' ? { src: item, caption: '' } : item))
      .filter((item) => item.src)
      .map((item) => ({ src: normalizeImg(item.src), caption: item.caption || '' }));

    if (!section || !grid || !items.length) return;

    lightboxState.items = items;
    if (countEl) countEl.textContent = `${String(items.length).padStart(2, '0')} FRAMES`;

    grid.innerHTML = '';
    items.forEach((item, index) => {
      const fig = document.createElement('figure');
      fig.className = 'gallery-item';
      fig.innerHTML = `
        <div class="imgwrap">
          <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.caption || project.title || 'Project image')}" loading="lazy" decoding="async">
        </div>
        ${item.caption ? `<figcaption class="gallery-cap">${escapeHTML(item.caption)}</figcaption>` : ''}
      `;
      fig.querySelector('img').onerror = () => fig.remove();
      fig.addEventListener('click', () => openLightbox(index));
      grid.appendChild(fig);
    });

    section.classList.remove('hidden');
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

    content.innerHTML = window.marked ? window.marked.parse(body) : miniMarkdown(body);
    content.querySelectorAll('img').forEach((img) => {
      const src = normalizeImg(img.getAttribute('src') || '');
      if (src) img.setAttribute('src', src);
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = img.alt || project.title || 'Project image';
      img.onerror = () => img.remove();
      const lbIndex = lightboxState.items.push({ src, caption: img.alt }) - 1;
      img.addEventListener('click', () => openLightbox(lbIndex));
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

    renderVideos(project);
    renderLinks(project);
    renderHeroImage(project.heroImage, project);
    setupLightbox();
    renderGallery(project);
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
