// -------- Portfolio (data-driven) --------
class PortfolioApp {
    constructor() {
      this.DATA_PATH = "./data/projects.json";
      this.projects = [];
      this.tags = new Set();
      this.activeTag = null;
      this.q = "";
      this.init();
    }
  
    async init() {
      await this.loadData();
      this.injectStyles();            // <-- add styles for bullets + navbar nowrap
      this.setupThemeToggle();
      this.setupMobileMenu();
      this.setupNavScrolling();
      this.setupSearchAndFilters();
      await this.setupResumeViewer();
      this.renderFeatured();
      this.renderProjects();
      this.wireOwnerUI();
      this.consoleHello();
    }
  
    // -------- Data --------
    async loadData() {
      try {
        const res = await fetch(this.DATA_PATH);
        const data = await res.json();
        this.owner = data.owner || {};
        this.projects = Array.isArray(data.projects) ? data.projects : [];
        // collect unique tags
        this.tags = new Set();
        this.projects.forEach(p => (p.tags || []).forEach(t => this.tags.add(t)));
      } catch (e) {
        console.warn("Could not load data/projects.json", e);
        this.owner = { name: "Your Name" };
        this.projects = [];
        this.tags = new Set();
      }
    }
  
    // -------- Owner / Header / Footer --------
    wireOwnerUI() {
      const o = this.owner || {};
      const setText = (sel, txt) => { const el = document.querySelector(sel); if (el && txt) el.textContent = txt; };
      const setAttr = (sel, attr, val) => { const el = document.querySelector(sel); if (el && val) el.setAttribute(attr, val); };
  
      setText("#brandName", o.name);
      setText("#heroName", o.name);
      setText("#heroTitle", o.title || "Aerospace Engineer");      // <-- keep Engineer, not Student
      setText("#uniLine", o.university || "");
      setText("#footerName", o.name);
      setAttr("#avatar", "src", this.normalizeImage(o.photo));
      setAttr("#emailLink", "href", o.email ? `mailto:${o.email}` : "mailto:");
      setAttr("#ghLink", "href", o.github || "#");
      setAttr("#lnLink", "href", o.linkedin || "#");
      const year = document.querySelector("#year"); if (year) year.textContent = new Date().getFullYear();
    }
  
    // -------- Theme & Mobile nav --------
    setupThemeToggle() {
      const toggle = () => {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
      };
      const saved = localStorage.getItem("theme") || "light";
      document.documentElement.classList.toggle("dark", saved === "dark");
      const t1 = document.getElementById("theme-toggle");
      const t2 = document.getElementById("theme-toggle-mobile");
      if (t1) t1.addEventListener("click", toggle);
      if (t2) t2.addEventListener("click", toggle);
    }
  
    setupMobileMenu() {
      const btn = document.getElementById("mobile-menu-button");
      const menu = document.getElementById("mobile-menu");
      const overlay = document.getElementById("mobile-menu-overlay");
      const toggle = () => { btn?.classList.toggle("active"); menu?.classList.toggle("open"); overlay?.classList.toggle("hidden"); };
      const close = () => { btn?.classList.remove("active"); menu?.classList.remove("open"); overlay?.classList.add("hidden"); };
      if (btn) btn.addEventListener("click", toggle);
      if (overlay) overlay.addEventListener("click", close);
      document.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", close));
    }
  
    setupNavScrolling() {
      // smooth internal links
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
          const id = link.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          const top = target.offsetTop - 80;
          window.scrollTo({ top, behavior: "smooth" });
        });
      });
      // active section underline
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");
      window.addEventListener("scroll", () => {
        let cur = "";
        sections.forEach(s => {
          const top = s.offsetTop - 100;
          if (scrollY >= top && scrollY < top + s.clientHeight) cur = s.id;
        });
        navLinks.forEach(l => {
          l.classList.toggle("active", l.getAttribute("href") === `#${cur}`);
        });
      });
    }
  
// ...existing code...
async setupResumeViewer() {
  const box = document.querySelector("#resumeEmbed");
  if (!box) return;

  const url = "./resume.pdf"; // relative to current path
  const button = `
    <p class="mb-4">
      <a href="${url}" target="_blank" rel="noreferrer"
         class="btn-primary inline-block px-4 py-2 rounded-lg text-white font-semibold">
        Open Resume (PDF)
      </a>
    </p>`;

  try {
    console.log(`Checking resume PDF at: ${url}`);
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    console.log(`Resume PDF check result: ${head.status} ${head.statusText}`);
    
    if (head.ok) {
      // Clear placeholder and show button
      box.innerHTML = button;
      
      // Create iframe with better error handling
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.width = "100%";
      iframe.style.height = "700px";
      iframe.style.border = "1px solid #e5e7eb";
      iframe.style.borderRadius = "8px";
      iframe.loading = "lazy";
      iframe.title = "Resume PDF";
      
      // Add error handling
      iframe.onload = () => {
        console.log('Resume PDF iframe loaded successfully');
      };
      
      iframe.onerror = () => {
        console.error('Resume PDF iframe failed to load, trying PDF.js fallback');
        // Try PDF.js as fallback
        iframe.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + '/' + url)}`;
        iframe.onerror = () => {
          console.error('PDF.js also failed, showing error message');
          iframe.style.display = 'none';
          const errorDiv = document.createElement('div');
          errorDiv.className = 'p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg';
          errorDiv.innerHTML = `
            <p class="text-red-700 dark:text-red-300 text-sm">
              <i class="fas fa-exclamation-triangle mr-2"></i>
              PDF preview failed to load. Use the "Open Resume (PDF)" button above to view the document.
            </p>
          `;
          box.appendChild(errorDiv);
        };
      };
      
      box.appendChild(iframe);
    } else {
      box.innerHTML = `${button}<p class="text-sm text-gray-600 dark:text-gray-400 mt-2">PDF file not found. Please ensure <code>resume.pdf</code> is in the repository root.</p>`;
    }
  } catch (e) {
    console.error(`Error checking resume PDF:`, e);
    box.innerHTML = `${button}<p class="text-sm">Couldn't check the PDF. The button still works.</p>`;
  }

  // Fallback for legacy iframe layout
  const iframe = document.getElementById("resume-pdf");
  const placeholder = document.getElementById("resume-placeholder");
  if (iframe && iframe.src) {
    iframe.classList.remove("hidden");
    if (placeholder) placeholder.classList.add("hidden");
  }
}
// ...existing code...
  
    // -------- Filters & Search --------
    setupSearchAndFilters() {
      // Build tag bar if present
      const bar = document.getElementById("tagBar");
      if (bar) {
        bar.innerHTML = "";
        const mkBtn = (label, tag = null) => {
          const b = document.createElement("button");
          b.className = "filter-tag bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full";
          b.textContent = label;
          b.onclick = () => { this.activeTag = tag; this.renderProjects(); this.markActiveTag(); };
          return b;
        };
        bar.appendChild(mkBtn("All", null));
        [...this.tags].sort().forEach(t => bar.appendChild(mkBtn(t, t)));
      }
      // Search box
      const inp = document.getElementById("search");
      if (inp) inp.addEventListener("input", () => { this.q = inp.value.toLowerCase(); this.renderProjects(); });
    }
  
    markActiveTag() {
      document.querySelectorAll(".filter-tag").forEach(b => {
        const isAll = b.textContent === "All" && this.activeTag === null;
        b.classList.toggle("active", isAll || b.textContent === this.activeTag);
        if (b.classList.contains("active")) {
          b.classList.add("bg-blue-600","text-white");
        } else {
          b.classList.remove("bg-blue-600","text-white");
        }
      });
    }
  
    // -------- Render: Featured --------
    renderFeatured() {
      const box = document.getElementById("featured");
      if (!box) return;
      box.innerHTML = "";
      this.projects.slice(0,3).forEach(p => box.appendChild(this.cardNode(p)));
    }
  
    // -------- Render: Projects --------
    renderProjects() {
      const grid = document.getElementById("projects-grid");
      const empty = document.getElementById("projects-empty");
      if (!grid) return;
  
      const matches = p => {
        const tagOK = !this.activeTag || (p.tags || []).includes(this.activeTag);
        const qOK = !this.q || (`${p.title} ${p.summary || ""}`.toLowerCase().includes(this.q));
        return tagOK && qOK;
      };
  
      grid.innerHTML = "";
      const list = this.projects.filter(matches);
      list.forEach(p => grid.appendChild(this.cardNode(p)));
      if (empty) empty.classList.toggle("hidden", list.length > 0);
      this.markActiveTag();
    }
  
    cardNode(p) {
      const tmpl = document.getElementById("projectCardTmpl");
      if (tmpl && tmpl.content) {
        const t = tmpl.content.cloneNode(true);
        const img = t.querySelector(".card-img"); if (img) { img.src = this.normalizeImage(p.heroImage); img.alt = p.title; img.loading = "lazy"; img.decoding = "async"; img.onerror = () => img.remove(); }
        const ttl = t.querySelector(".card-title"); if (ttl) ttl.textContent = p.title;
        const sub = t.querySelector(".card-sub"); if (sub) sub.textContent = `${p.role || ""} • ${p.dates || ""}`;
        const sum = t.querySelector(".card-summary"); if (sum) sum.textContent = p.summary || "";
  
        const m = t.querySelector(".metrics");
        if (m) {
          m.classList.add("card-bullets"); // <-- ensure proper bullet styling
          (p.metrics || []).slice(0,4).forEach(x => {
            const li = document.createElement("li");
            li.textContent = x;
            m.appendChild(li);
          });
        }
  
        const tags = t.querySelector(".tag-row");
        if (tags) (p.tags || []).forEach(tag => {
          const s = document.createElement("span");
          s.className = "tag bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm";
          s.textContent = tag;
          tags.appendChild(s);
        });
  
        const links = t.querySelector(".links");
        if (links && p.slug) {
          const primary = document.createElement("a");
          primary.href = `./project.html?slug=${encodeURIComponent(p.slug)}`;
          primary.className = "btn-primary inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white";
          primary.textContent = "Read case study";
          links.appendChild(primary);
        }
        return t;
      }
  
      // fallback (no template present)
      const card = document.createElement("article");
      card.className = "project-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg";
      card.innerHTML = `
        <div class="w-full rounded-lg mb-4 overflow-hidden bg-gray-200 dark:bg-gray-700" style="aspect-ratio:16/9">
          ${p.heroImage ? `<img loading="lazy" decoding="async" src="${this.normalizeImage(p.heroImage)}" alt="${p.title}" class="w-full h-full object-cover">` : ""}
        </div>
        <h4 class="text-xl font-bold mb-1">${p.title}</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${(p.role||"")} • ${(p.dates||"")}</p>
        <p class="text-gray-700 dark:text-gray-300 mb-3">${p.summary||""}</p>
        <ul class="card-bullets text-gray-600 dark:text-gray-400 mb-3">
          ${(p.metrics||[]).slice(0,4).map(x=>`<li>${x}</li>`).join("")}
        </ul>
        <div class="flex flex-wrap gap-2 mb-3">
          ${(p.tags||[]).map(t=>`<span class="tag bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">${t}</span>`).join("")}
        </div>
        <div class="links">
          ${p.slug ? `<a class=\"btn-primary inline-block px-4 py-2 rounded-lg text-sm font-semibold text-white\" href=\"./project.html?slug=${encodeURIComponent(p.slug)}\">Read case study</a>` : ""}
        </div>
      `;
      return card;
    }
  
    // Normalize image paths - base-path agnostic
    normalizeImage(path) {
      if (!path) return "";
      
      // External URLs - return as-is
      if (/^https?:/.test(path)) return path;
      
      // Remove leading "./" if present
      if (path.startsWith("./")) path = path.substring(2);
      
      // If already starts with images/, reports/, content/ - return as-is
      if (/^(images|reports|content)\//.test(path)) return path;
      
      // Otherwise treat as filename under images/
      const file = path.split("/").pop();
      return `images/${file}`;
    }
  
    // -------- Utils --------
    injectStyles() {
      const css = `
        /* bullet alignment for cards */
        .card-bullets{list-style:disc;list-style-position:inside;margin:8px 0 0 0;padding:0}
        .card-bullets li{margin:4px 0;padding:0}
  
        /* prevent brand from wrapping under nav links */
        .header,.site-nav,.navbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:nowrap}
        #brandName,.brand,.site-title{white-space:nowrap;flex:0 0 auto}
        .nav,.nav-links{display:flex;align-items:center;gap:24px;margin-left:auto;min-width:0}
        .nav a,.nav-links a{white-space:nowrap}
      `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    }
  
    consoleHello() {
      console.log("%c🚀 Portfolio ready", "color:#3b82f6;font-size:16px;font-weight:bold");
    }
  }
  
  // Boot
  document.addEventListener("DOMContentLoaded", () => { window.portfolioApp = new PortfolioApp(); });
  