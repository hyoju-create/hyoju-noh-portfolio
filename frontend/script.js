/**
 * 노효주 포트폴리오 인터랙티브 스크립트
 * Green Smart City & Data Analytics Interaction Engine
 * with Animate.css Integration
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Animate.css Scroll Observer
  initScrollAnimations();

  // 3. Theme Toggle (Dark / Light)
  initThemeToggle();

  // 4. Hero Particle Canvas Animation
  initHeroCanvas();

  // 5. Live Telemetry & GA Dashboard Simulation
  initLiveTelemetryDashboard();

  // 6. Modals & Popups (with Animate.css zoom effect)
  initModals();

  // 7. Copy to Clipboard & Toast
  initCopyActions();

  // 8. Contact Form Simulation
  initContactForm();

  // 9. Mobile Navigation Menu
  initMobileNav();

  // 10. Back to Top & Scroll Enhancements
  initScrollFeatures();

  // 11. Generate QR Code Canvas for vCard
  drawQrCode();
});

/* ==========================================================================
   1. Animate.css Scroll Observer
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll("[data-animate]");
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const animationClass = entry.target.getAttribute("data-animate") || "animate__fadeInUp";
          entry.target.classList.add("animate__animated", animationClass);
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   2. Theme Toggle
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  const html = document.documentElement;
  
  const savedTheme = localStorage.getItem("hyoju_portfolio_theme") || "dark";
  html.setAttribute("data-theme", savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      html.setAttribute("data-theme", newTheme);
      localStorage.setItem("hyoju_portfolio_theme", newTheme);

      // Add a quick spin animation on theme toggle
      toggleBtn.classList.add("animate__animated", "animate__rotateIn");
      setTimeout(() => {
        toggleBtn.classList.remove("animate__animated", "animate__rotateIn");
      }, 600);

      // Re-trigger icon refresh if needed
      if (window.lucide) {
        window.lucide.createIcons();
      }
    });
  }
}

/* ==========================================================================
   3. Hero Canvas Particle & Node Mesh
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 18000), 65);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.5 + 1.2;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = (Math.random() - 0.5) * 0.8;
      this.color = Math.random() > 0.4 ? "rgba(16, 185, 129, " : "rgba(20, 184, 166, ";
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 2;
          const dirY = (dy / dist) * force * 2;
          this.x -= dirX;
          this.y -= dirY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ")";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(52, 211, 153, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   4. Live Telemetry & GA Dashboard Simulation
   ========================================================================== */
function initLiveTelemetryDashboard() {
  const canvas = document.getElementById("liveTelemetryCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let currentMode = "all";
  const tabs = document.querySelectorAll(".dash-tab");
  const chartTitle = document.getElementById("chartTitle");

  // Telemetry metric elements
  const valPlant = document.getElementById("valPlant");
  const valAir = document.getElementById("valAir");
  const valTraffic = document.getElementById("valTraffic");
  const valTemp = document.getElementById("valTemp");

  const modeDescriptions = {
    all: "실시간 통합 스마트 시티 환경 & GA 트래픽 파동 분석",
    plant: "도시 식생 활력도 및 수관 피복율 (NDVI) 정밀 시계열",
    air: "바이오 대기정화 지수 (AQI 및 미세먼지 저감률)",
    ga: "스마트 그린 공원 웹/모바일 포털 실시간 세션 유입량"
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentMode = tab.dataset.mode;
      if (chartTitle) {
        chartTitle.textContent = modeDescriptions[currentMode] || "실시간 데이터";
        chartTitle.classList.remove("animate__animated", "animate__fadeIn");
        void chartTitle.offsetWidth; // Trigger reflow
        chartTitle.classList.add("animate__animated", "animate__fadeIn");
      }
    });
  });

  const pulseBtn = document.getElementById("triggerPulseBtn");
  if (pulseBtn) {
    pulseBtn.addEventListener("click", () => {
      pulseBtn.classList.add("animate__animated", "animate__rubberBand");
      setTimeout(() => {
        pulseBtn.classList.remove("animate__animated", "animate__rubberBand");
      }, 800);
      showToast("센서 노드 및 GA 데이터 패킷이 강제 갱신되었습니다.");
      generateFluctuation();
    });
  }

  // Data wave arrays
  const pointCount = 35;
  const seriesA = Array.from({ length: pointCount }, () => Math.random() * 30 + 40);
  const seriesB = Array.from({ length: pointCount }, () => Math.random() * 25 + 20);

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth - 40;
    canvas.height = 220;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function updateDataPoints() {
    seriesA.shift();
    seriesA.push(Math.sin(Date.now() / 1200) * 15 + 50 + (Math.random() - 0.5) * 8);

    seriesB.shift();
    seriesB.push(Math.cos(Date.now() / 1500) * 12 + 30 + (Math.random() - 0.5) * 6);
  }

  function generateFluctuation() {
    if (valPlant) {
      valPlant.innerHTML = (94.0 + (Math.random() * 1.5)).toFixed(1) + '<span class="stat-unit">%</span>';
    }
    if (valAir) {
      valAir.innerHTML = (97.5 + (Math.random() * 1.8)).toFixed(1) + '<span class="stat-unit">AQI</span>';
    }
    if (valTraffic) {
      valTraffic.innerHTML = (12400 + Math.floor(Math.random() * 200)).toLocaleString() + '<span class="stat-unit">PV</span>';
    }
  }

  setInterval(generateFluctuation, 3000);

  function drawTelemetryChart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const padding = 20;
    const stepX = (w - padding * 2) / (pointCount - 1);

    // Draw Grid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (h - padding * 2)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(w - padding, y);
      ctx.stroke();
    }

    // Helper to draw smooth wave
    function drawSeries(data, strokeColor, fillColor) {
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = padding + i * stepX;
        const y = h - padding - (data[i] / 100) * (h - padding * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Area fill
      ctx.lineTo(padding + (data.length - 1) * stepX, h - padding);
      ctx.lineTo(padding, h - padding);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (currentMode === "all" || currentMode === "plant") {
      const gradA = ctx.createLinearGradient(0, 0, 0, h);
      gradA.addColorStop(0, "rgba(16, 185, 129, 0.35)");
      gradA.addColorStop(1, "rgba(16, 185, 129, 0.0)");
      drawSeries(seriesA, "#10b981", gradA);
    }

    if (currentMode === "all" || currentMode === "ga") {
      const gradB = ctx.createLinearGradient(0, 0, 0, h);
      gradB.addColorStop(0, "rgba(245, 158, 11, 0.35)");
      gradB.addColorStop(1, "rgba(245, 158, 11, 0.0)");
      drawSeries(seriesB, "#f59e0b", gradB);
    }

    if (currentMode === "air") {
      const gradAir = ctx.createLinearGradient(0, 0, 0, h);
      gradAir.addColorStop(0, "rgba(20, 184, 166, 0.4)");
      gradAir.addColorStop(1, "rgba(20, 184, 166, 0.0)");
      drawSeries(seriesA.map(v => v * 1.1), "#14b8a6", gradAir);
    }

    // Glow head dot
    const lastX = padding + (pointCount - 1) * stepX;
    const lastY = h - padding - (seriesA[seriesA.length - 1] / 100) * (h - padding * 2);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#34d399";
    ctx.fill();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#34d399";
  }

  function chartLoop() {
    updateDataPoints();
    drawTelemetryChart();
    setTimeout(() => {
      requestAnimationFrame(chartLoop);
    }, 120);
  }

  chartLoop();
}

/* ==========================================================================
   5. Modals Management with Animate.css
   ========================================================================== */
function initModals() {
  function setupModal(modalId, openBtnIds, closeBtnIds) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const card = modal.querySelector(".modal-card");

    openBtnIds.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", () => {
          modal.classList.add("active");
          if (card) {
            card.classList.remove("animate__animated", "animate__zoomIn", "animate__faster");
            void card.offsetWidth;
            card.classList.add("animate__animated", "animate__zoomIn", "animate__faster");
          }
          document.body.style.overflow = "hidden";
        });
      }
    });

    closeBtnIds.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", () => {
          modal.classList.remove("active");
          document.body.style.overflow = "";
        });
      }
    });

    // Backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Award Modal
  setupModal("awardModal", ["openAwardModalBtn"], ["closeAwardModalBtn", "closeAwardModalBtn2"]);

  // Resume Modal
  setupModal("resumeModal", ["openResumeBtn"], ["closeResumeModalBtn", "closeResumeModalBtn2"]);

  // QR Modal
  setupModal("qrModal", ["openQrBtn"], ["closeQrModalBtn", "closeQrModalBtn2"]);

  // Escape key closes any active modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-overlay.active").forEach((m) => {
        m.classList.remove("active");
      });
      document.body.style.overflow = "";
    }
  });
}

/* ==========================================================================
   6. Clipboard Copy & Toast Notification with Animate.css
   ========================================================================== */
function initCopyActions() {
  const copyButtons = document.querySelectorAll(".copy-phone-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const phone = btn.getAttribute("data-phone") || "010-2592-0744";
      btn.classList.add("animate__animated", "animate__pulse");
      setTimeout(() => {
        btn.classList.remove("animate__animated", "animate__pulse");
      }, 600);

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(phone).then(() => {
          showToast(`연락처 (${phone})가 복사되었습니다!`);
        }).catch(() => {
          fallbackCopy(phone);
        });
      } else {
        fallbackCopy(phone);
      }
    });
  });
}

function fallbackCopy(text) {
  const tempInput = document.createElement("input");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showToast(`연락처 (${text})가 복사되었습니다!`);
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show", "animate__animated", "animate__fadeInUp");

  setTimeout(() => {
    toast.classList.remove("show", "animate__animated", "animate__fadeInUp");
  }, 3200);
}

/* ==========================================================================
   7. Contact Form Simulation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("senderName").value;
    const submitBtn = document.getElementById("submitMsgBtn");

    if (submitBtn) {
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> 전송 중...';
      if (window.lucide) window.lucide.createIcons();
    }

    setTimeout(() => {
      showToast(`${name} 님의 소중한 메시지가 성공적으로 전달되었습니다!`);
      form.reset();
      if (submitBtn) {
        submitBtn.innerHTML = '<i data-lucide="check"></i> 전송 완료';
        submitBtn.classList.add("animate__animated", "animate__bounceIn");
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          submitBtn.classList.remove("animate__animated", "animate__bounceIn");
          submitBtn.innerHTML = '<i data-lucide="send"></i> 메시지 전송하기';
          if (window.lucide) window.lucide.createIcons();
        }, 2500);
      }
    }, 900);
  });
}

/* ==========================================================================
   8. Mobile Navigation Menu
   ========================================================================== */
function initMobileNav() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
      if (navMenu.classList.contains("open")) {
        navMenu.classList.add("animate__animated", "animate__fadeInDown");
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }
}

/* ==========================================================================
   9. Scroll Features
   ========================================================================== */
function initScrollFeatures() {
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      backToTopBtn.classList.add("animate__animated", "animate__bounce");
      setTimeout(() => {
        backToTopBtn.classList.remove("animate__animated", "animate__bounce");
      }, 800);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* ==========================================================================
   10. Generate QR Code Canvas for vCard
   ========================================================================== */
function drawQrCode() {
  const canvas = document.getElementById("qrCodeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const size = 180;
  const matrixSize = 25;
  const cellSize = size / matrixSize;

  // Clear
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#0f172a";

  // Pseudo QR pattern generator with distinct corner markers
  function drawFinderPattern(startX, startY) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          ctx.fillRect((startX + c) * cellSize, (startY + r) * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  // 3 Corner Finders
  drawFinderPattern(1, 1);
  drawFinderPattern(matrixSize - 8, 1);
  drawFinderPattern(1, matrixSize - 8);

  // Deterministic pattern inside
  const seed = [
    1,0,1,1,0,1,0,0,1,1,1,0,1,0,1,
    0,1,0,1,1,0,1,1,0,0,1,0,1,1,0,
    1,1,0,0,1,1,0,1,0,1,1,0,1,0,1,
    0,0,1,1,0,1,1,0,1,0,0,1,1,0,1,
    1,0,1,0,1,0,1,1,0,1,0,1,0,1,0
  ];

  let seedIdx = 0;
  for (let r = 1; r < matrixSize - 1; r++) {
    for (let c = 1; c < matrixSize - 1; c++) {
      // Skip finder zones
      if (
        (r <= 8 && c <= 8) ||
        (r <= 8 && c >= matrixSize - 9) ||
        (r >= matrixSize - 9 && c <= 8)
      ) {
        continue;
      }

      if (seed[seedIdx % seed.length] === 1) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
      seedIdx++;
    }
  }
}
