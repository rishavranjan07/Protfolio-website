document.addEventListener("DOMContentLoaded", function () {

  // ── Email Builder (bypasses Cloudflare obfuscation) ──
  const eParts = ["rishavranjan0716", "gmail", "com"];
  const eAddr  = eParts[0] + "@" + eParts[1] + "." + eParts[2];
  const eHref  = "mailto:" + eAddr;

  var heroEmailLink = document.getElementById("hero-email-link");
  if (heroEmailLink) {
    heroEmailLink.href  = eHref;
    heroEmailLink.title = eAddr;
  }

  document.querySelectorAll("#contact-email-link").forEach(function(el) {
    el.href        = eHref;
    el.textContent = eAddr;
  });

  var noteEmail = document.getElementById("note-email");
  if (noteEmail) {
    var a = document.createElement("a");
    a.href        = eHref;
    a.textContent = eAddr;
    a.style.color = "inherit";
    noteEmail.appendChild(a);
  }

  // ── Year ────────────────────────────────────────────
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ── Preloader Animation ─────────────────────────────
  const preloader = document.getElementById("preloader");
  const fill = document.getElementById("preloader-fill");
  const count = document.getElementById("preloader-count");
  let typewriterStarted = false;

  function triggerTypewriter() {
    if (typewriterStarted) return;
    typewriterStarted = true;
    if (window.startTypewriter) {
      window.startTypewriter();
    }
  }

  if (preloader) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      preloader.classList.add("fade-out");
      document.body.classList.add("loaded");
      preloader.style.display = "none";
      triggerTypewriter();
    } else {
      let currentProgress = 0;
      let isWindowLoaded = false;
      let isCompleted = false;

      function completePreloader() {
        if (isCompleted) return;
        isCompleted = true;
        if (fill) fill.style.width = "100%";
        if (count) count.textContent = "100%";

        setTimeout(function () {
          preloader.classList.add("fade-out");
          document.body.classList.add("loaded");

          // Start typewriter right as hero reveals
          setTimeout(triggerTypewriter, 250);

          setTimeout(function () {
            preloader.style.display = "none";
          }, 600);
        }, 180);
      }

      const startTime = performance.now();
      const targetDuration = 800; // Snappy target duration

      function updateLoader(now) {
        if (isCompleted) return;
        const elapsed = now - startTime;
        let target = Math.min((elapsed / targetDuration) * 92, 92);

        if (isWindowLoaded) {
          target = 100;
        }

        currentProgress += (target - currentProgress) * 0.22;
        if (currentProgress >= 99 && isWindowLoaded) {
          completePreloader();
          return;
        }

        const displayVal = Math.min(Math.floor(currentProgress), 100);
        if (fill) fill.style.width = displayVal + "%";
        if (count) count.textContent = displayVal + "%";

        requestAnimationFrame(updateLoader);
      }

      requestAnimationFrame(updateLoader);

      if (document.readyState === "complete") {
        isWindowLoaded = true;
      } else {
        window.addEventListener("load", function () {
          isWindowLoaded = true;
        });
      }

      // Safety timeout: dismiss after 1.4s max
      setTimeout(function () {
        isWindowLoaded = true;
        completePreloader();
      }, 1400);
    }
  } else {
    document.body.classList.add("loaded");
    triggerTypewriter();
  }

  // ── Typed Hero Text ─────────────────────────────────
  const typedTarget = document.getElementById("typed-roles");
  if (typedTarget) {
    const roles = [
      "a Full-Stack Developer",
      "a Machine Learning Enthusiast",
      "a Problem Solver",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 110;
    const deleteSpeed = 50;
    const pauseBetweenRoles = 1500;

    function typeLoop() {
      const current = roles[roleIndex];
      if (!isDeleting) {
        typedTarget.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, pauseBetweenRoles);
          return;
        }
        setTimeout(typeLoop, typeSpeed);
      } else {
        typedTarget.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(typeLoop, 450); // Pause briefly while blank
          return;
        }
        setTimeout(typeLoop, deleteSpeed);
      }
    }

    window.startTypewriter = function () {
      typeLoop();
    };

    if (!preloader || document.body.classList.contains("loaded")) {
      triggerTypewriter();
    }
  }

  // ── Theme Toggle ────────────────────────────────────
  const toggleBtn = document.getElementById("theme-toggle");

  function applyTheme(isLight) {
    document.body.classList.toggle("light-theme", isLight);
    if (toggleBtn) {
      toggleBtn.innerHTML = isLight ? "&#9790;" : "&#9788;";
    }
  }

  // Read saved theme; default = dark
  const saved = localStorage.getItem("portfolio-theme");
  applyTheme(saved === "light");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const goLight = !document.body.classList.contains("light-theme");
      applyTheme(goLight);
      localStorage.setItem("portfolio-theme", goLight ? "light" : "dark");
    });
  }

  // ── Smooth Scroll ───────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        });
      }
    });
  });

  // ── Formspree Contact Form ──────────────────────────
  const contactForm = document.getElementById("contact-form");
  const formNote    = document.getElementById("form-note");
  const submitBtn   = contactForm ? contactForm.querySelector("button[type=submit]") : null;

  function showNote(type, msg) {
    if (!formNote) return;
    formNote.innerHTML = msg;
    formNote.className = "form-note form-note--" + type;
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Loading state
      submitBtn.disabled    = true;
      submitBtn.textContent = "Sending...";
      showNote("info", "&#8987; Sending your message...");

      const formData = new FormData(contactForm);

      fetch("https://formspree.io/f/xqeydkkb", {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      })
      .then(function (response) {
        if (response.ok) {
          showNote("success", "&#10003; Message sent successfully! I will get back to you soon.");
          contactForm.reset();
        } else {
          return response.json().then(function (data) {
            throw new Error(data.errors ? data.errors.map(function(e){ return e.message; }).join(", ") : "Server error");
          });
        }
      })
      .catch(function (err) {
        console.error("Formspree error:", err);
        showNote("error", "&#10007; Failed to send. Please try again or email directly.");
      })
      .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Send Message";
      });
    });
  }

  // ── Hamburger / Mobile Nav ──────────────────────────
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  function closeMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = mobileNav.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMobileNav);
    });

    document.addEventListener("click", function (e) {
      if (
        mobileNav.classList.contains("open") &&
        !mobileNav.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobileNav();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("open")) {
        closeMobileNav();
        hamburger.focus();
      }
    });
  }

  // ── Card Spotlight Hover Effect ─────────────────────
  const spotlightCards = document.querySelectorAll(
    ".card, .skill-card, .cert-item, .stat-card"
  );
  spotlightCards.forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", x + "px");
      card.style.setProperty("--mouse-y", y + "px");
    });
  });

  // ── Scroll to Top (Floating Button & RR Logo) ────────
  const scrollTopBtn = document.getElementById("scroll-to-top");
  const navLogo = document.getElementById("nav-logo") || document.querySelector(".logo");

  function scrollToTopSmooth(e) {
    if (e) e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    if (navLogo) {
      navLogo.classList.remove("logo-active-pulse");
      void navLogo.offsetWidth; // force CSS reflow for re-triggering animation
      navLogo.classList.add("logo-active-pulse");
    }
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", scrollToTopSmooth);

    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    }, { passive: true });
  }

  if (navLogo) {
    navLogo.addEventListener("click", scrollToTopSmooth);
  }

}); // end DOMContentLoaded

// ── Background Particle Canvas ────────────────────────
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles, animId;
  const isLight = () => document.body.classList.contains("light-theme");

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.4 + 0.4,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.55 + 0.15,
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((W * H) / 9000), 120);
    particles = Array.from({ length: count }, mkParticle);
  }

  function accentColor() {
    return isLight()
      ? `rgba(15, 76, 129,`   // navy for light
      : `rgba(0, 212, 255,`;   // cyan for dark
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const col = accentColor();

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `${col} ${(1 - dist / 130) * 0.12})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${col} ${p.alpha})`;
      ctx.fill();
    }
  }

  function update() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Mouse repel effect
  let mouse = { x: -9999, y: -9999 };
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (const p of particles) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const force = (90 - dist) / 90;
        p.vx += (dx / dist) * force * 0.6;
        p.vy += (dy / dist) * force * 0.6;
        // Clamp velocity
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.5) { p.vx = (p.vx / speed) * 2.5; p.vy = (p.vy / speed) * 2.5; }
      }
      // Dampen velocity back to normal
      p.vx *= 0.98;
      p.vy *= 0.98;
    }
  });

  window.addEventListener("resize", () => { resize(); });

  init();
  loop();
})();

// ── Scroll Reveal Observer ────────────────────────────
(function () {
  const revealEls = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
  );

  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

// ── Section Heading Reveal ────────────────────────────
(function () {
  const headings = document.querySelectorAll(".section h2");
  if (!headings.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  headings.forEach((h) => observer.observe(h));
})();

// ── Stagger reveal children ────────────────────────────
(function () {
  const staggerParents = document.querySelectorAll(".reveal-stagger");
  if (!staggerParents.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.07}s`;
            child.classList.add("visible");
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  staggerParents.forEach((el) => observer.observe(el));
})();

