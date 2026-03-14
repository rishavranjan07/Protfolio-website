document.addEventListener("DOMContentLoaded", function () {

  // ── Year ────────────────────────────────────────────
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ── Typed Hero Text ─────────────────────────────────
  const typedTarget = document.getElementById("typed-roles");
  if (typedTarget) {
    const roles = [
      "a Full-Stack Developer",
      "a Machine Learning Enthusiast",
      "a Problem Solver",
      "a Java & Python Developer",
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 120;
    const deleteSpeed = 60;
    const pauseBetweenRoles = 1400;

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
      } else {
        typedTarget.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, isDeleting ? deleteSpeed : typeSpeed);
    }
    typeLoop();
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

  // ── Contact Form ────────────────────────────────────
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert(
        "Thanks for reaching out! This is a demo form — connect it to a backend or service to receive messages."
      );
      contactForm.reset();
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
