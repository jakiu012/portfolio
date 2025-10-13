// project.js — render case study from /data/projects.json + /content/projects/<slug>.md
(function() {
    const $ = (sel) => document.querySelector(sel);
    const qs = new URLSearchParams(location.search);
    const slug = qs.get('slug');
  
    // theme toggle (match index behavior)
    function setupTheme() {
      const saved = localStorage.getItem('theme') || 'light';
      document.documentElement.classList.toggle('dark', saved === 'dark');
      const toggle = document.getElementById('theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
      }
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
      span.className = 'px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      span.textContent = t;
      return span;
    }
  
    function listItem(text) {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }
  
    function normalizeImg(path) {
      if (!path) return '';
      // already absolute to /images
      if (path.startsWith('images/')) return path;
      // try to strip nested prefixes like images/adcs/.../hero.jpg -> last segment
      const seg = path.split('/').filter(Boolean);
      const last = seg[seg.length - 1];
      if (!last) return path;
      // common flat names used in this repo
      if (last.startsWith('adcs_') || last.startsWith('airpuck_') || last.startsWith('hovercraft_') || last.startsWith('wind_') || last.includes('headshot'))
        return `images/${last}`;
      // fallback: if original was something like images:adcs:hero.JPG we can’t guess reliably
      return path;
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
        "What I’d Improve Next",
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
        a.className = 'hover:underline text-blue-700 dark:text-blue-300';
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
      document.getElementById('year').textContent = new Date().getFullYear();
      
      console.log(`Current URL: ${window.location.href}`);
      console.log(`Slug from URL: ${slug}`);
  
      if (!slug) {
        document.getElementById('title').textContent = 'Not found';
        document.getElementById('summary').textContent = 'Missing ?slug parameter.';
        return;
      }
  
      // Load project basics
      let data;
      try {
        console.log('Loading projects.json...');
        data = await loadJSON('data/projects.json');
        console.log('Projects loaded:', data);
      } catch (e) {
        console.error('Failed to load projects.json:', e);
        $('#summary').textContent = 'Could not load project data.';
        return;
      }
      const project = (data.projects || []).find(p => (p.slug || '').toLowerCase() === slug.toLowerCase());
      console.log(`Looking for project with slug: ${slug}`);
      console.log(`Found project:`, project);
      if (!project) {
        document.getElementById('title').textContent = 'Project not found';
        document.getElementById('summary').textContent = `No project with slug "${slug}".`;
        return;
      }
  
      // Header basics
      $('#title').textContent = project.title || 'Project';
      $('#subtitle').textContent = project.role || '';
      $('#dates').innerHTML = project.dates ? `<i class="fa-solid fa-calendar mr-1"></i>${project.dates}` : '';
      $('#location').innerHTML = project.location ? `<i class="fa-solid fa-location-dot mr-1"></i>${project.location}` : '';
      (project.tags || []).forEach(t => $('#tags').appendChild(tagPill(t)));
      $('#summary').textContent = project.summary || '';
  
      // Hero image
      const hero = normalizeImg(project.heroImage || '');
      if (hero) {
        const img = $('#heroImg');
        img.src = hero;
        img.onload = () => img.classList.remove('hidden');
        img.onerror = () => img.remove();
      }
  
      // Sidebar metrics & links
      const metricsList = $('#metrics');
      (project.metrics || []).forEach(m => metricsList.appendChild(listItem(m)));
      const links = $('#links');
      if (project.links && project.links.length) {
        project.links.forEach(l => {
          const a = document.createElement('a');
          a.href = l.href; a.target = '_blank'; a.rel = 'noopener';
          a.className = 'w-full inline-flex items-center justify-center px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition';
          a.innerHTML = `${/pdf/i.test(l.label) ? '<i class="fa-solid fa-file-pdf mr-2"></i>' : '<i class="fa-brands fa-github mr-2"></i>'}${l.label}`;
          links.appendChild(a);
        });
      } else {
        links.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400">No external links.</p>';
      }
  
      // Runtime meta
      setMeta({
        title: project.title,
        description: project.summary || 'Project case study',
        image: hero || 'images/og-image.jpg'
      });
  
      // Load markdown case study
      let md;
      try {
        const mdUrl = `content/projects/${slug}.md`;
        console.log(`Loading markdown from: ${mdUrl}`);
        md = await loadMD(mdUrl);
        console.log(`Successfully loaded markdown for ${slug}`);
      } catch (e) {
        console.error(`Failed to load markdown for ${slug}:`, e);
        // fallback: coming soon
        document.getElementById('comingSoon').classList.remove('hidden');
        return;
      }
      const { fm, body } = parseFrontMatter(md);
      // Front-matter can override summary/hero
      if (fm.description) setMeta({ title: project.title, description: fm.description, image: fm.hero || hero });
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
      // Fix any images
       content.querySelectorAll('img').forEach(img => {
         img.loading = 'lazy';
         img.decoding = 'async';
         const fixed = normalizeImg(img.getAttribute('src') || '');
         if (fixed) img.setAttribute('src', fixed);
         img.onerror = () => img.remove();
         img.alt = img.alt || (project.title || 'Project image');
         img.classList.add('shadow','rounded-lg');
       });
    }
  
    main();
  })();
  