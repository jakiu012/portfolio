// -------- Portfolio (data-driven) --------
class PortfolioApp {
    constructor() {
      this.DATA_PATH = "./data/projects.json";
      this.projects = [];
      this.tags = new Set();
      this.activeTag = null;
      this.q = "";
      this.typingTexts = [
        "Controls, sensing, and hardware testing.",
        "I build, test, and verify.",
        "From model to hardware to flight.",
        "CubeSat ADCS specialist.",
        "Bridging simulation and reality."
      ];
      this.init();
    }

    async init() {
      await this.loadData();
      this.injectStyles();
      this.setupThemeToggle();
      this.setupMobileMenu();
      this.setupNavScrolling();
      this.setupSearchAndFilters();
      await this.setupResumeViewer();
      this.renderFeatured();
      this.renderProjects();
      this.wireOwnerUI();
      this.setupScrollProgress();
      this.setupRevealAnimations();
      this.setupTypingEffect();
      this.setupParticles();
      this.setupBackToTop();
      this.setupLightbox();
      this.setupKeyboardNav();
      this.consoleHello();
    }

    // -------- Data --------
    async loadData() {
      try {
        const res = await fetch(this.DATA_PATH);
        const data = await res.json();
        this.owner = data.owner || {};
        this.projects = Array.isArray(data.projects) ? data.projects : [];
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
      setText("#heroTitle", o.title || "Aerospace Engineer");
      setText("#uniLine", o.university ? `University of Michigan, Ann Arbor` : "");
      setText("#footerName", o.name);
      setAttr("#avatar", "src", this.normalizeImage(o.photo));

      const email = o.email || "jakiuddin012@gmail.com";
      const github = o.github || "https://github.com/jakiu012";
      const linkedin = o.linkedin || "https://www.linkedin.com/in/fazlerabbizaki/";

      setAttr("#emailLink", "href", `mailto:${email}`);
      setAttr("#ghLink", "href", github);
      setAttr("#lnLink", "href", linkedin);
      setAttr("#footerEmail", "href", `mailto:${email}`);
      setAttr("#footerGithub", "href", github);
      setAttr("#footerLinkedIn", "href", linkedin);

      const yearEl = document.getElementById("year");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
    }

    // -------- Theme & Mobile nav --------
    setupThemeToggle() {
      const toggle = () => {
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
      };
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = saved ? saved === "dark" : prefersDark;
      document.documentElement.classList.toggle("dark", isDark);

      const t1 = document.getElementById("theme-toggle");
      const t2 = document.getElementById("theme-toggle-mobile");
      if (t1) t1.addEventListener("click", toggle);
      if (t2) t2.addEventListener("click", toggle);
    }

    setupMobileMenu() {
      const btn = document.getElementById("mobile-menu-button");
      const menu = document.getElementById("mobile-menu");
      const overlay = document.getElementById("mobile-menu-overlay");
      const toggle = () => {
        btn?.classList.toggle("active");
        menu?.classList.toggle("open");
        overlay?.classList.toggle("hidden");
        document.body.classList.toggle("overflow-hidden");
      };
      const close = () => {
        btn?.classList.remove("active");
        menu?.classList.remove("open");
        overlay?.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      };
      if (btn) btn.addEventListener("click", toggle);
      if (overlay) overlay.addEventListener("click", close);
      document.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", close));
    }

    setupNavScrolling() {
      // Smooth internal links
      document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
          const id = link.getAttribute("href");
          if (!id || id === "#") return;
          const target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          const top = target.offsetTop - 80;
          window.scrollTo({ top, behavior: "smooth" });
          // Update URL without jump
          history.pushState(null, "", id);
        });
      });

      // Active section underline
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");

      const updateActiveNav = () => {
        let cur = "";
        sections.forEach(s => {
          const top = s.offsetTop - 150;
          if (scrollY >= top && scrollY < top + s.clientHeight) cur = s.id;
        });
        navLinks.forEach(l => {
          l.classList.toggle("active", l.getAttribute("href") === `#${cur}`);
        });
      };

      window.addEventListener("scroll", updateActiveNav, { passive: true });
      updateActiveNav();
    }

    // -------- Scroll Progress Bar --------
    setupScrollProgress() {
      const progressBar = document.getElementById("scrollProgress");
      if (!progressBar) return;

      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
      };

      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    }

    // -------- Reveal Animations (Intersection Observer) --------
    setupRevealAnimations() {
      const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Optional: unobserve after reveal for performance
            // observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      });

      revealElements.forEach(el => observer.observe(el));
      this.revealObserver = observer;
    }

    // -------- Typing Effect --------
    setupTypingEffect() {
      const textEl = document.getElementById("typingText");
      if (!textEl) return;

      let textIndex = 0;
      let charIndex = 0;
      let isDeleting = false;
      let typingSpeed = 50;

      const type = () => {
        const currentText = this.typingTexts[textIndex];

        if (isDeleting) {
          textEl.textContent = currentText.substring(0, charIndex - 1);
          charIndex--;
          typingSpeed = 30;
        } else {
          textEl.textContent = currentText.substring(0, charIndex + 1);
          charIndex++;
          typingSpeed = 50;
        }

        if (!isDeleting && charIndex === currentText.length) {
          typingSpeed = 2000; // Pause at end
          isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % this.typingTexts.length;
          typingSpeed = 500; // Pause before next text
        }

        setTimeout(type, typingSpeed);
      };

      // Start after a short delay
      setTimeout(type, 1000);
    }

    // -------- Animated Particles --------
    setupParticles() {
      const container = document.getElementById("particles");
      if (!container) return;

      const particleCount = 15;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        particle.style.opacity = `${0.2 + Math.random() * 0.3}`;
        particle.style.width = particle.style.height = `${4 + Math.random() * 6}px`;
        container.appendChild(particle);
      }
    }

    // -------- Back to Top Button --------
    setupBackToTop() {
      const btn = document.getElementById("backToTop");
      if (!btn) return;

      const toggleVisibility = () => {
        if (window.scrollY > 400) {
          btn.classList.add("visible");
        } else {
          btn.classList.remove("visible");
        }
      };

      window.addEventListener("scroll", toggleVisibility, { passive: true });

      btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // -------- Image Lightbox --------
    setupLightbox() {
      this.lightbox = {
        modal: document.getElementById("lightbox"),
        img: document.getElementById("lightboxImg"),
        caption: document.getElementById("lightboxCaption"),
        closeBtn: document.getElementById("lightboxClose"),
        prevBtn: document.getElementById("lightboxPrev"),
        nextBtn: document.getElementById("lightboxNext"),
        images: [],
        currentIndex: 0
      };

      if (!this.lightbox.modal) return;

      // Close handlers
      this.lightbox.closeBtn?.addEventListener("click", () => this.closeLightbox());
      this.lightbox.modal?.addEventListener("click", (e) => {
        if (e.target === this.lightbox.modal) this.closeLightbox();
      });

      // Navigation
      this.lightbox.prevBtn?.addEventListener("click", () => this.lightboxNav(-1));
      this.lightbox.nextBtn?.addEventListener("click", () => this.lightboxNav(1));

      // Keyboard nav
      document.addEventListener("keydown", (e) => {
        if (!this.lightbox.modal?.classList.contains("hidden")) {
          if (e.key === "Escape") this.closeLightbox();
          if (e.key === "ArrowLeft") this.lightboxNav(-1);
          if (e.key === "ArrowRight") this.lightboxNav(1);
        }
      });
    }

    openLightbox(src, alt, images = []) {
      if (!this.lightbox.modal) return;

      this.lightbox.img.src = src;
      this.lightbox.img.alt = alt || "";
      this.lightbox.caption.textContent = alt || "";
      this.lightbox.images = images;
      this.lightbox.currentIndex = images.indexOf(src);

      // Show/hide nav buttons
      const hasMultiple = images.length > 1;
      this.lightbox.prevBtn?.classList.toggle("hidden", !hasMultiple);
      this.lightbox.nextBtn?.classList.toggle("hidden", !hasMultiple);

      this.lightbox.modal.classList.remove("hidden");
      document.body.classList.add("overflow-hidden");
    }

    closeLightbox() {
      this.lightbox.modal?.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }

    lightboxNav(dir) {
      if (this.lightbox.images.length < 2) return;

      this.lightbox.currentIndex += dir;
      if (this.lightbox.currentIndex < 0) this.lightbox.currentIndex = this.lightbox.images.length - 1;
      if (this.lightbox.currentIndex >= this.lightbox.images.length) this.lightbox.currentIndex = 0;

      const newSrc = this.lightbox.images[this.lightbox.currentIndex];
      this.lightbox.img.src = newSrc;
    }

    // -------- Keyboard Navigation --------
    setupKeyboardNav() {
      // Make project cards focusable and clickable via keyboard
      document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.target.classList.contains("project-card")) {
          const link = e.target.querySelector("a.btn-primary");
          if (link) link.click();
        }
      });
    }

    // -------- Resume Viewer --------
    async setupResumeViewer() {
      const box = document.querySelector("#resumeEmbed");
      if (!box) return;

      const url = "./resume.pdf";
      const button = `
        <p class="mb-4 text-center">
          <a href="${url}" target="_blank" rel="noreferrer"
             class="btn-primary inline-block px-6 py-3 rounded-lg text-white font-semibold">
            <i class="fas fa-external-link-alt mr-2"></i>Open Resume (PDF)
          </a>
        </p>`;

      try {
        const head = await fetch(url, { method: "HEAD", cache: "no-store" });

        if (head.ok) {
          box.innerHTML = button;

          const iframe = document.createElement("iframe");
          iframe.src = url;
          iframe.style.width = "100%";
          iframe.style.height = "700px";
          iframe.style.border = "none";
          iframe.style.borderRadius = "8px";
          iframe.loading = "lazy";
          iframe.title = "Resume PDF";

          iframe.onerror = () => {
            iframe.src = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(window.location.origin + '/' + url)}`;
          };

          box.appendChild(iframe);
        } else {
          box.innerHTML = `${button}<p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">PDF preview unavailable. Click the button above to view.</p>`;
        }
      } catch (e) {
        box.innerHTML = `${button}<p class="text-sm text-center">Click the button above to view the resume.</p>`;
      }
    }

    // -------- Filters & Search --------
    setupSearchAndFilters() {
      const bar = document.getElementById("tagBar");
      if (bar) {
        bar.innerHTML = "";
        const mkBtn = (label, tag = null) => {
          const b = document.createElement("button");
          b.className = "filter-tag bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-full font-medium transition-all";
          b.textContent = label;
          b.setAttribute("aria-pressed", tag === null ? "true" : "false");
          b.onclick = () => {
            this.activeTag = tag;
            this.renderProjects();
            this.markActiveTag();
          };
          return b;
        };
        bar.appendChild(mkBtn("All", null));
        [...this.tags].sort().forEach(t => bar.appendChild(mkBtn(t, t)));
        this.markActiveTag();
      }

      const inp = document.getElementById("search");
      if (inp) {
        inp.addEventListener("input", () => {
          this.q = inp.value.toLowerCase();
          this.renderProjects();
        });
      }
    }

    markActiveTag() {
      document.querySelectorAll(".filter-tag").forEach(b => {
        const isAll = b.textContent === "All" && this.activeTag === null;
        const isActive = isAll || b.textContent === this.activeTag;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", isActive ? "true" : "false");
        if (isActive) {
          b.classList.add("bg-gradient-to-r", "from-blue-500", "to-blue-600", "text-white", "shadow-lg");
          b.classList.remove("bg-gray-100", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300");
        } else {
          b.classList.remove("bg-gradient-to-r", "from-blue-500", "to-blue-600", "text-white", "shadow-lg");
          b.classList.add("bg-gray-100", "dark:bg-gray-700", "text-gray-700", "dark:text-gray-300");
        }
      });
    }

    // -------- Render: Featured --------
    renderFeatured() {
      const box = document.getElementById("featured");
      if (!box) return;
      box.innerHTML = "";
      this.projects.slice(0, 3).forEach((p, i) => {
        const card = this.cardNode(p);
        // Add stagger animation
        const article = card.querySelector ? card : card.firstElementChild;
        if (article) article.classList.add(`stagger-${i + 1}`);
        box.appendChild(card);
      });
    }

    // -------- Render: Projects --------
    renderProjects() {
      const grid = document.getElementById("projects-grid");
      const empty = document.getElementById("projects-empty");
      if (!grid) return;

      const matches = p => {
        const tagOK = !this.activeTag || (p.tags || []).includes(this.activeTag);
        const qOK = !this.q || (`${p.title} ${p.summary || ""} ${(p.tags || []).join(" ")}`.toLowerCase().includes(this.q));
        return tagOK && qOK;
      };

      grid.innerHTML = "";
      const list = this.projects.filter(matches);
      list.forEach((p, i) => {
        const card = this.cardNode(p);
        const article = card.querySelector ? card.querySelector("article") : card;
        if (article) {
          article.classList.add("reveal-scale");
          article.style.transitionDelay = `${i * 0.1}s`;
        }
        grid.appendChild(card);
      });

      if (empty) empty.classList.toggle("hidden", list.length > 0);
      this.markActiveTag();

      // Re-observe new cards
      if (this.revealObserver) {
        grid.querySelectorAll(".reveal-scale").forEach(el => {
          this.revealObserver.observe(el);
        });
      }
    }

    cardNode(p) {
      const tmpl = document.getElementById("projectCardTmpl");
      if (tmpl && tmpl.content) {
        const t = tmpl.content.cloneNode(true);
        const img = t.querySelector(".card-img");
        if (img) {
          img.src = this.normalizeImage(p.heroImage);
          img.alt = p.title;
          img.loading = "lazy";
          img.decoding = "async";
          img.onerror = () => img.remove();
          // Add lightbox on click
          img.style.cursor = "pointer";
          img.addEventListener("click", () => {
            this.openLightbox(img.src, p.title);
          });
        }

        const ttl = t.querySelector(".card-title");
        if (ttl) ttl.textContent = p.title;

        const sub = t.querySelector(".card-sub");
        const subText = t.querySelector(".card-sub-text");
        if (subText) {
          subText.textContent = `${p.role || ""} • ${p.dates || ""}`;
        } else if (sub) {
          sub.innerHTML = `<i class="fas fa-briefcase mr-2 text-blue-500"></i>${p.role || ""} • ${p.dates || ""}`;
        }

        const sum = t.querySelector(".card-summary");
        if (sum) sum.textContent = p.summary || "";

        const m = t.querySelector(".metrics");
        if (m) {
          m.classList.add("card-bullets");
          (p.metrics || []).slice(0, 4).forEach(x => {
            const li = document.createElement("li");
            li.innerHTML = `<i class="fas fa-check-circle text-green-500 mr-2"></i>${x}`;
            m.appendChild(li);
          });
        }

        const tags = t.querySelector(".tag-row");
        if (tags) (p.tags || []).forEach(tag => {
          const s = document.createElement("span");
          s.className = "tag bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium";
          s.textContent = tag;
          tags.appendChild(s);
        });

        const links = t.querySelector(".links");
        if (links && p.slug) {
          const primary = document.createElement("a");
          primary.href = `./project.html?slug=${encodeURIComponent(p.slug)}`;
          primary.className = "btn-primary inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white group";
          primary.innerHTML = `<span>Read case study</span><i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>`;
          links.appendChild(primary);
        }
        return t;
      }

      // Fallback
      const card = document.createElement("article");
      card.className = "project-card bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700";
      card.innerHTML = `
        <div class="w-full overflow-hidden bg-gray-200 dark:bg-gray-700" style="aspect-ratio:16/9">
          ${p.heroImage ? `<img loading="lazy" decoding="async" src="${this.normalizeImage(p.heroImage)}" alt="${p.title}" class="w-full h-full object-cover card-img">` : ""}
        </div>
        <div class="p-6">
          <h4 class="text-xl font-bold mb-1">${p.title}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3"><i class="fas fa-briefcase mr-2 text-blue-500"></i>${(p.role||"")} • ${(p.dates||"")}</p>
          <p class="text-gray-700 dark:text-gray-300 mb-4">${p.summary||""}</p>
          <ul class="card-bullets text-gray-600 dark:text-gray-400 mb-4">
            ${(p.metrics||[]).slice(0,4).map(x=>`<li><i class="fas fa-check-circle text-green-500 mr-2"></i>${x}</li>`).join("")}
          </ul>
          <div class="flex flex-wrap gap-2 mb-4">
            ${(p.tags||[]).map(t=>`<span class="tag bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">${t}</span>`).join("")}
          </div>
          <div class="links pt-4 border-t border-gray-100 dark:border-gray-700">
            ${p.slug ? `<a class="btn-primary inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white group" href="./project.html?slug=${encodeURIComponent(p.slug)}"><span>Read case study</span><i class="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i></a>` : ""}
          </div>
        </div>
      `;
      return card;
    }

    // Normalize image paths
    normalizeImage(path) {
      if (!path) return "";
      if (/^https?:/.test(path)) return path;
      if (path.startsWith("./")) path = path.substring(2);
      if (/^(images|reports|content)\//.test(path)) return path;
      const file = path.split("/").pop();
      return `images/${file}`;
    }

    // -------- Utils --------
    injectStyles() {
      const css = `
        /* Card bullets alignment */
        .card-bullets{list-style:none;margin:8px 0 0 0;padding:0}
        .card-bullets li{margin:4px 0;padding:0;display:flex;align-items:flex-start}

        /* Prevent brand wrapping */
        .header,.site-nav,.navbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:nowrap}
        #brandName,.brand,.site-title{white-space:nowrap;flex:0 0 auto}
        .nav,.nav-links{display:flex;align-items:center;gap:24px;margin-left:auto;min-width:0}
        .nav a,.nav-links a{white-space:nowrap}

        /* Line clamp for summaries */
        .line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
      `;
      const style = document.createElement("style");
      style.textContent = css;
      document.head.appendChild(style);
    }

    consoleHello() {
      console.log("%c Fazle Rabbi Zaki - Portfolio", "color:#3b82f6;font-size:20px;font-weight:bold");
      console.log("%c Aerospace Engineer | University of Michigan", "color:#6b7280;font-size:14px");
      console.log("%c Built with passion for controls, sensing, and hardware testing.", "color:#10b981;font-size:12px");
    }
  }

  // Boot
  document.addEventListener("DOMContentLoaded", () => { window.portfolioApp = new PortfolioApp(); });
