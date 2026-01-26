// project.js — render case study from /data/projects.json + /content/projects/<slug>.md
(function() {
  const $ = (sel) => document.querySelector(sel);
  const qs = new URLSearchParams(location.search);
  const slug = qs.get('slug');

  // Lightbox state
  let lightbox = {
    modal: null,
    img: null,
    caption: null,
    counter: null,
    images: [],
    currentIndex: 0
  };

  // Theme toggle (match index behavior)
  function setupTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', isDark);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  }

  // Scroll progress bar
  function setupScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Reveal animations
  function setupRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Back to top button
  function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Lightbox setup
  function setupLightbox() {
    lightbox = {
      modal: document.getElementById('lightbox'),
      img: document.getElementById('lightboxImg'),
      caption: document.getElementById('lightboxCaption'),
      counter: document.getElementById('lightboxCounter'),
      closeBtn: document.getElementById('lightboxClose'),
      prevBtn: document.getElementById('lightboxPrev'),
      nextBtn: document.getElementById('lightboxNext'),
      images: [],
      currentIndex: 0
    };

    if (!lightbox.modal) return;

    // Close handlers
    lightbox.closeBtn?.addEventListener('click', closeLightbox);
    lightbox.modal?.addEventListener('click', (e) => {
      if (e.target === lightbox.modal) closeLightbox();
    });

    // Navigation
    lightbox.prevBtn?.addEventListener('click', () => lightboxNav(-1));
    lightbox.nextBtn?.addEventListener('click', () => lightboxNav(1));

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.modal?.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNav(-1);
        if (e.key === 'ArrowRight') lightboxNav(1);
      }
    });
  }

  function openLightbox(src, alt, images = []) {
    if (!lightbox.modal) return;

    lightbox.images = images;
    lightbox.currentIndex = images.indexOf(src);
    if (lightbox.currentIndex < 0) lightbox.currentIndex = 0;

    updateLightboxImage(src, alt);

    const hasMultiple = images.length > 1;
    lightbox.prevBtn?.classList.toggle('hidden', !hasMultiple);
    lightbox.nextBtn?.classList.toggle('hidden', !hasMultiple);

    lightbox.modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function updateLightboxImage(src, alt) {
    lightbox.img.src = src;
    lightbox.img.alt = alt || '';
    lightbox.caption.textContent = alt || '';

    if (lightbox.images.length > 1) {
      lightbox.counter.textContent = `${lightbox.currentIndex + 1} / ${lightbox.images.length}`;
    } else {
      lightbox.counter.textContent = '';
    }
  }

  function closeLightbox() {
    lightbox.modal?.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  function lightboxNav(dir) {
    if (lightbox.images.length < 2) return;

    lightbox.currentIndex += dir;
    if (lightbox.currentIndex < 0) lightbox.currentIndex = lightbox.images.length - 1;
    if (lightbox.currentIndex >= lightbox.images.length) lightbox.currentIndex = 0;

    const newSrc = lightbox.images[lightbox.currentIndex];
    updateLightboxImage(newSrc, '');
  }

  function setMeta({title, description, image}) {
    if (title) document.title = title + ' — Case Study';
    const ensure = (prop, content) => {
      if (!content) return;
      let m = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
      if (!m) { m = document.createElement('meta'); m.setAttribute(prop.startsWith('og:') ? 'property' : 'name', prop); document.head.appendChild(m); }
      m.setAttribute('content', content);
    };
    ensure('og:title', title);
    ensure('og:description', description);
    ensure('og:image', image);
    ensure('description', description);
  }

  function tagPill(t) {
    const span = document.createElement('span');
    span.className = 'tag-pill';
    span.textContent = t;
    return span;
  }

  function metricItem(text) {
    const li = document.createElement('li');
    li.className = 'metric-item';
    li.innerHTML = `
      <span class="metric-icon"><i class="fas fa-check text-xs"></i></span>
      <span>${text}</span>
    `;
    return li;
  }

  function normalizeImg(path) {
    if (!path) return '';
    if (/^https?:/.test(path)) return path;
    if (path.startsWith("./")) path = path.substring(2);
    if (/^(images|reports|content)\//.test(path)) return path;
    const file = path.split("/").pop();
    return `images/${file}`;
  }

  async function loadJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return res.json();
  }

  async function loadMD(url) {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
      throw new Error('md404');
    }
    return res.text();
  }

  function parseFrontMatter(md) {
    const m = md.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
    if (!m) return { fm: {}, body: md };
    let fm = {};
    try { fm = jsyaml.load(m[1]) || {}; } catch { fm = {}; }
    return { fm, body: m[2] || '' };
  }

  function buildTOC(container) {
    const desired = [
      'Overview',
      'Approach',
      'Results & Outcomes',
      "What I'd Improve Next",
      'Gallery'
    ];
    const map = {};
    container.querySelectorAll('h2').forEach(h => { map[h.textContent.trim()] = h; });
    const toc = document.getElementById('toc');
    const ul = document.getElementById('tocList');
    let any = false;
    desired.forEach(name => {
      const h = map[name];
      if (!h) return;
      any = true;
      if (!h.id) h.id = name.toLowerCase().replace(/\s+/g,'-').replace(/[^\w\-]/g,'');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${h.id}`;
      a.textContent = name;
      a.className = 'hover:text-blue-600 dark:hover:text-blue-400 text-blue-700 dark:text-blue-300 transition-colors';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(h.id);
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
      li.appendChild(a);
      ul.appendChild(li);
    });
    if (any) toc.classList.remove('hidden');
  }

  async function main() {
    setupTheme();
    setupScrollProgress();
    setupBackToTop();
    setupLightbox();

    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    // Delay reveal animations to allow content to load
    setTimeout(() => {
      setupRevealAnimations();
    }, 100);

    if (!slug) {
      const titleEl = document.getElementById('title');
      const summaryEl = document.getElementById('summary');
      if (titleEl) titleEl.textContent = 'Not found';
      if (summaryEl) summaryEl.textContent = 'Missing ?slug parameter.';
      return;
    }

    // Load project basics
    let data;
    try {
      data = await loadJSON('./data/projects.json');
    } catch (e) {
      $('#summary').textContent = 'Could not load project data.';
      return;
    }
    const project = (data.projects || []).find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
    if (!project) {
      const titleEl = document.getElementById('title');
      const summaryEl = document.getElementById('summary');
      if (titleEl) titleEl.textContent = 'Project not found';
      if (summaryEl) summaryEl.textContent = `No project with slug "${slug}".`;
      return;
    }

    // Header basics
    const titleEl = $('#title');
    const subtitleEl = $('#subtitle');
    const datesEl = $('#dates');
    const locationEl = $('#location');
    const tagsEl = $('#tags');
    const summaryEl = $('#summary');

    if (titleEl) titleEl.textContent = project.title || 'Project';
    if (subtitleEl) subtitleEl.textContent = project.role || '';
    if (datesEl) datesEl.innerHTML = project.dates ? `<i class="fa-solid fa-calendar mr-1"></i>${project.dates}` : '';
    if (locationEl) locationEl.innerHTML = project.location ? `<i class="fa-solid fa-location-dot mr-1"></i>${project.location}` : '';
    if (summaryEl) summaryEl.textContent = project.summary || '';

    // Hero image
    const hero = normalizeImg(project.heroImage || '');
    if (hero) {
      const img = $('#heroImg');
      if (img) {
        img.src = hero;
        img.alt = project.title || 'Project hero image';
        img.onload = () => {
          img.classList.remove('hidden');
        };
        img.onerror = () => {
          img.remove();
        };
      }
    }

    // Tags
    if (tagsEl) {
      (project.tags || []).forEach(t => tagsEl.appendChild(tagPill(t)));
    }

    // Sidebar metrics & links
    const metricsList = $('#metrics');
    if (metricsList) {
      (project.metrics || []).forEach(m => metricsList.appendChild(metricItem(m)));
    }

    const links = $('#links');
    if (links) {
      if (project.links && project.links.length) {
        const nonPdfLinks = project.links.filter(l => !/\.pdf$/i.test(l.href));
        if (nonPdfLinks.length > 0) {
          nonPdfLinks.forEach(l => {
            const a = document.createElement('a');
            a.href = l.href;
            a.target = '_blank';
            a.rel = 'noopener';
            a.className = 'link-btn link-btn-outline';
            const icon = /github/i.test(l.href) ? 'fab fa-github' : 'fas fa-external-link-alt';
            a.innerHTML = `<i class="${icon}"></i><span>${l.label}</span>`;
            links.appendChild(a);
          });
        } else {
          links.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 text-center">No external links available.</p>';
        }
      } else {
        links.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400 text-center">No external links available.</p>';
      }
    }

    // Runtime meta
    const heroImgPath = normalizeImg(project.heroImage || "");
    setMeta({
      title: project.title,
      description: project.summary || 'Project case study',
      image: heroImgPath || 'images/og-image.jpg'
    });

    // Load markdown case study
    let md;
    try {
      const mdUrl = `./content/projects/${slug}.md`;
      md = await loadMD(mdUrl);
    } catch (e) {
      const comingSoon = document.getElementById('comingSoon');
      if (comingSoon) {
        comingSoon.classList.remove('hidden');
      }
      return;
    }

    const { fm, body } = parseFrontMatter(md);
    if (fm.description) setMeta({ title: project.title, description: fm.description, image: fm.hero || heroImgPath });
    if (fm.hero) {
      const img = $('#heroImg');
      img.src = normalizeImg(fm.hero);
      img.classList.remove('hidden');
    }

    // Render markdown
    const html = marked.parse(body, { mangle: false, headerIds: true });
    const content = document.getElementById('caseContent');
    content.innerHTML = html;

    // Auto-ids & TOC
    content.querySelectorAll('h2').forEach(h => {
      if (!h.id) h.id = h.textContent.toLowerCase().replace(/\s+/g,'-').replace(/[^\w\-]/g,'');
    });
    buildTOC(content);

    // Collect all images for lightbox and add click handlers
    const allImages = [];
    content.querySelectorAll('img').forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
      const fixed = normalizeImg(img.getAttribute('src') || '');
      if (fixed) {
        img.setAttribute('src', fixed);
        allImages.push(fixed);
      }
      img.onerror = () => img.remove();
      img.alt = img.alt || (project.title || 'Project image');
      img.classList.add('shadow-lg', 'rounded-xl');

      // Add lightbox click handler
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        openLightbox(img.src, img.alt, allImages);
      });
    });
  }

  main().catch(error => {
    console.error('Main function error:', error);
    const summaryEl = document.getElementById('summary');
    if (summaryEl) {
      summaryEl.textContent = 'Error loading page. Please try again.';
    }
  });
})();
