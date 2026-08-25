import { createNewHeroCamera, createWhoWeAre3DLensPiece } from './src/newHeroCamera.js';

let heroCameraInstance = null;
let whoWeAreLensInstance = null;

/* ----------------------------------------------------
   1. CINEMATIC 3D HERO INTERACTION & PARTICLES
---------------------------------------------------- */
function initCinematicHero() {
  const cameraWebglCanvas = document.getElementById('camera-3d-webgl');
  const whoWeAreLensCanvas = document.getElementById('who-we-are-lens-canvas');
  const canvas = document.getElementById('hero-particles-canvas');

  // Initialize Brand New Photorealistic 3D Mirrorless WebGL Camera in Hero Section
  if (cameraWebglCanvas) {
    heroCameraInstance = createNewHeroCamera(cameraWebglCanvas);
  }

  // Initialize Photorealistic Detached 3D Lens Half in Who We Are Section (RIGHT SIDE)
  if (whoWeAreLensCanvas) {
    whoWeAreLensInstance = createWhoWeAre3DLensPiece(whoWeAreLensCanvas);
  }

  // Subtle Volumetric Floating Particles
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const numParticles = 45;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        color: i % 3 === 0 ? 'rgba(180, 76, 255, ' : 'rgba(255, 255, 255, ',
        alpha: Math.random() * 0.45 + 0.1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
      });

      requestAnimationFrame(renderParticles);
    }

    renderParticles();
  }
}

/* ----------------------------------------------------
   2. DOM & EVENT BINDINGS
---------------------------------------------------- */
function bindEvents() {
  // Mobile Nav Drawer Toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');

  function openMobileNav() {
    if (mobileDrawer && mobileOverlay && mobileNavToggle) {
      mobileDrawer.classList.add('open');
      mobileOverlay.classList.add('open');
      mobileNavToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileNav() {
    if (mobileDrawer && mobileOverlay && mobileNavToggle) {
      mobileDrawer.classList.remove('open');
      mobileOverlay.classList.remove('open');
      mobileNavToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
      if (isOpen) closeMobileNav();
      else openMobileNav();
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileNav);
  }

  // Smooth Scroll Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();
        closeMobileNav();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ----------------------------------------------------
   3. SERVICES ACCORDION (ALL CLOSED BY DEFAULT ON LOAD)
---------------------------------------------------- */
function initAccordion() {
  const items = document.querySelectorAll('#services-accordion .accordion-item');
  if (!items.length) return;

  // Reset: ALL service accordion items are closed by default on page load/refresh
  items.forEach((item) => item.classList.remove('active'));

  items.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items
        items.forEach((other) => other.classList.remove('active'));

        // Toggle clicked item
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ----------------------------------------------------
   4. PORTFOLIO CATEGORY SLIDER & FILTER (SINGLE SOURCE OF TRUTH)
---------------------------------------------------- */
function initPortfolioFilterAndMarquee() {
  const wrapper = document.getElementById('portfolio-marquee-wrapper');
  const track = document.getElementById('portfolio-marquee-track');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('#portfolio-bento-grid .bento-card, .project-card');

  if (!track || !wrapper || !filterBtns.length) return;

  let currentX = 0;
  const speed = 0.55; // Auto-movement speed right-to-left
  let isPausedOrDragging = false;
  let clickPauseTimeout = null;

  // 1. Continuous Auto-Scroll Engine (Right to Left)
  function autoScroll() {
    if (!isPausedOrDragging) {
      currentX -= speed;
      const group = track.querySelector('.marquee-group');
      if (group) {
        const groupWidth = group.offsetWidth;
        if (groupWidth > 0 && Math.abs(currentX) >= groupWidth) {
          currentX += groupWidth;
        }
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  // 2. Click Handler for ALL Filter Category Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      if (!filter) return;

      // A. Immediately STOP category movement
      isPausedOrDragging = true;
      if (clickPauseTimeout) clearTimeout(clickPauseTimeout);

      // B. Highlight active filter button across all track duplicate groups
      filterBtns.forEach((b) => {
        if (b.getAttribute('data-filter') === filter) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });

      // C. Filter portfolio project cards immediately
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      // D. Pause for EXACTLY 1 second, then automatically continue horizontal movement
      clickPauseTimeout = setTimeout(() => {
        isPausedOrDragging = false;
      }, 1000);
    });
  });

  // 3. Desktop Hover Pause & Resume
  wrapper.addEventListener('mouseenter', () => {
    isPausedOrDragging = true;
  });

  wrapper.addEventListener('mouseleave', () => {
    if (clickPauseTimeout) clearTimeout(clickPauseTimeout);
    clickPauseTimeout = setTimeout(() => {
      isPausedOrDragging = false;
    }, 500);
  });

  // 4. Mouse Drag & Touch Swipe Controls
  let startX = 0;
  let initialX = 0;
  let isDragging = false;

  function onStart(e) {
    isDragging = true;
    isPausedOrDragging = true;
    if (clickPauseTimeout) clearTimeout(clickPauseTimeout);
    wrapper.style.cursor = 'grabbing';
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    initialX = currentX;
  }

  function onMove(e) {
    if (!isDragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = x - startX;
    currentX = initialX + diff;
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
    clickPauseTimeout = setTimeout(() => {
      isPausedOrDragging = false;
    }, 1000);
  }

  wrapper.addEventListener('mousedown', onStart);
  wrapper.addEventListener('touchstart', onStart, { passive: true });

  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, { passive: true });

  window.addEventListener('mouseup', onEnd);
  window.addEventListener('touchend', onEnd);

  // Start continuous auto-scroll loop
  requestAnimationFrame(autoScroll);
}

/* ----------------------------------------------------
   5. PORTFOLIO PROJECT DETAILS MODAL OVERLAY ENGINE (WITH REALISTIC VIDEO PREVIEWS)
---------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal) return;

  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalImage = document.getElementById('modal-image');
  const modalDesc = document.getElementById('modal-description');
  const modalDeliverables = document.getElementById('modal-deliverables');
  const modalTimeline = document.getElementById('modal-timeline');

  const modalVideoSection = document.getElementById('modal-video-section');
  const modalVideoGrid = document.getElementById('modal-video-grid');

  // Video preview mapping for Ads & Promotions, QA Testing, and SEO Optimization
  const projectVideoMap = {
    'ads-promotions': [
      {
        badge: 'PREVIEW 01 — AD CAMPAIGN',
        title: 'Social Media Ad Campaign & Audience Targeting',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      },
      {
        badge: 'PREVIEW 02 — PROMO FILM',
        title: 'Cinematic Brand Promotional Showcase',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      }
    ],
    'qa-testing': [
      {
        badge: 'PREVIEW 01 — AUTOMATED QA',
        title: 'Automated Software Testing & CI/CD Pipeline',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
      },
      {
        badge: 'PREVIEW 02 — BUG REPORTING',
        title: 'Real-time Test Execution & Regression Suite',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyplays.mp4'
      }
    ],
    'digital-marketing': [
      {
        badge: 'PREVIEW 01 — SEO ANALYTICS',
        title: 'Search Ranking & Core Web Vitals Dashboard',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
      },
      {
        badge: 'PREVIEW 02 — TRAFFIC & KEYWORDS',
        title: 'Keyword Research & SERP Growth Strategy',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
      }
    ]
  };

  // Bind click listeners to ALL portfolio cards in #portfolio-bento-grid
  const portfolioCards = document.querySelectorAll('#portfolio-bento-grid .bento-card');

  portfolioCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      const catKey = card.getAttribute('data-category');
      const title = card.getAttribute('data-title') || card.querySelector('.bento-title')?.textContent || 'Project Details';
      const meta = card.getAttribute('data-meta') || card.querySelector('.bento-category')?.textContent || 'PORTFOLIO • 2024';
      const desc = card.getAttribute('data-desc') || card.querySelector('.bento-desc')?.textContent || 'Comprehensive brand & digital solution.';
      const image = card.getAttribute('data-image') || '';
      const deliverables = card.getAttribute('data-deliverables') || 'Visual Identity, Brand Strategy, Digital Production';
      const timeline = card.getAttribute('data-timeline') || '4 Weeks';

      if (modalCategory) modalCategory.textContent = meta;
      if (modalTitle) modalTitle.textContent = title;
      if (modalImage && image) {
        modalImage.src = image;
        modalImage.alt = title;
      }
      if (modalDesc) modalDesc.textContent = desc;
      if (modalDeliverables) modalDeliverables.textContent = deliverables;
      if (modalTimeline) modalTimeline.textContent = timeline;

      const modalHeroWrapper = document.getElementById('modal-hero-image-wrapper');
      const modalDetailsGrid = document.getElementById('modal-details-grid');

      // SPECIAL RULE FOR "ADS & PROMOTIONS":
      // Hide Description, Key Deliverables, Timeline, and Hero Image ONLY for Ads & Promotions.
      // Display ONLY Video Preview 01 & Video Preview 02 stacked prominently one after another.
      if (catKey === 'ads-promotions') {
        if (modalHeroWrapper) modalHeroWrapper.style.display = 'none';
        if (modalDetailsGrid) modalDetailsGrid.style.display = 'none';
        if (modalVideoGrid) modalVideoGrid.classList.add('stacked-videos');
      } else {
        if (modalHeroWrapper) modalHeroWrapper.style.display = '';
        if (modalDetailsGrid) modalDetailsGrid.style.display = '';
        if (modalVideoGrid) modalVideoGrid.classList.remove('stacked-videos');
      }

      // Render 2 realistic video previews ONLY for Ads, QA, & SEO projects
      const videos = projectVideoMap[catKey];
      if (videos && videos.length && modalVideoSection && modalVideoGrid) {
        modalVideoGrid.innerHTML = '';
        videos.forEach((vid) => {
          const cardEl = document.createElement('div');
          cardEl.className = 'video-preview-card';
          cardEl.innerHTML = `
            <div class="video-preview-header">
              <span class="video-badge">${vid.badge}</span>
              <h5 class="video-title">${vid.title}</h5>
            </div>
            <div class="video-player-wrapper">
              <video class="modal-preview-video" src="${vid.src}" muted loop playsinline controls preload="metadata"></video>
            </div>
          `;
          modalVideoGrid.appendChild(cardEl);
        });

        modalVideoSection.classList.remove('hidden');

        // Play video previews muted
        setTimeout(() => {
          modalVideoGrid.querySelectorAll('.modal-preview-video').forEach((v) => {
            v.play().catch(() => {});
          });
        }, 150);
      } else if (modalVideoSection && modalVideoGrid) {
        modalVideoGrid.innerHTML = '';
        modalVideoSection.classList.add('hidden');
      }

      // Show full-screen overlay with smooth animation and lock background scroll
      modal.classList.remove('hidden');
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    // Pause all modal video players immediately when overlay closes
    if (modalVideoGrid) {
      modalVideoGrid.querySelectorAll('.modal-preview-video').forEach((v) => {
        v.pause();
      });
    }

    modal.classList.add('hidden');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeModal();
    });
  }

  // Close when clicking dark backdrop overlay outside modal container
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ----------------------------------------------------
   6. FLOATING WHATSAPP BUTTON (WHO WE ARE → BEFORE FOOTER VISIBILITY ENGINE)
---------------------------------------------------- */
function initFloatingWhatsapp() {
  const waBtn = document.getElementById('floating-whatsapp-btn');
  const whoWeAreSec = document.getElementById('who-we-are');
  const footerSec = document.querySelector('footer, .footer');

  if (!waBtn) return;

  function updateWhatsappVisibility() {
    const vh = window.innerHeight;

    // 1. Must be after "Who We Are" section
    const isAfterWhoWeAre = whoWeAreSec
      ? whoWeAreSec.getBoundingClientRect().bottom <= 120
      : window.scrollY > 1000;

    // 2. Must NOT be overlapping or inside the Footer section
    const isFooterInView = footerSec
      ? footerSec.getBoundingClientRect().top < vh
      : false;

    // RULE: Visible ONLY after Who We Are AND before Footer enters viewport
    if (isAfterWhoWeAre && !isFooterInView) {
      waBtn.classList.add('visible');
    } else {
      waBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateWhatsappVisibility, { passive: true });
  updateWhatsappVisibility();
}






/* ----------------------------------------------------
   7. REVIEWS MARQUEE AUTOMATION (AUTO-SCROLL & DRAG/SWIPE)
---------------------------------------------------- */
function initReviewsMarquee() {
  const track = document.getElementById('reviews-marquee-track') || document.querySelector('.reviews-marquee-track');
  const wrapper = document.getElementById('reviews-marquee-wrapper') || document.querySelector('.reviews-marquee-wrapper');
  if (!track) return;

  let currentX = 0;
  const speed = 0.55;
  let isHoveredOrDragging = false;

  function tick() {
    if (!isHoveredOrDragging) {
      currentX -= speed;
      const group = track.querySelector('.reviews-group');
      if (group) {
        const groupWidth = group.offsetWidth;
        if (groupWidth > 0 && Math.abs(currentX) >= groupWidth) {
          currentX += groupWidth;
        }
        track.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }
    }
    requestAnimationFrame(tick);
  }

  if (wrapper) {
    wrapper.style.cursor = 'grab';

    wrapper.addEventListener('mouseenter', () => { isHoveredOrDragging = true; });
    wrapper.addEventListener('mouseleave', () => { isHoveredOrDragging = false; });

    let startX = 0;
    let initialX = 0;
    let isDragging = false;

    function onStart(e) {
      isDragging = true;
      isHoveredOrDragging = true;
      wrapper.style.cursor = 'grabbing';
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      initialX = currentX;
    }

    function onMove(e) {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const diff = x - startX;
      currentX = initialX + diff;
      track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = 'grab';
      setTimeout(() => {
        isHoveredOrDragging = false;
      }, 1000);
    }

    wrapper.addEventListener('mousedown', onStart);
    wrapper.addEventListener('touchstart', onStart, { passive: true });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  requestAnimationFrame(tick);
}


/* ----------------------------------------------------
   8. INTRO VIDEO FLOW
---------------------------------------------------- */
function setupIntroVideo() {
  const introVideo = document.getElementById('intro-video');
  const introOverlay = document.getElementById('intro-video-overlay');

  if (introVideo && introOverlay) {
    const handleVideoEnd = () => {
      introOverlay.style.transition = 'opacity 0.6s ease';
      introOverlay.style.opacity = '0';
      setTimeout(() => {
        introOverlay.style.display = 'none';
      }, 600);
    };

    introVideo.addEventListener('ended', handleVideoEnd);

    // Fallback if video fails to load or play
    introVideo.addEventListener('error', handleVideoEnd);
    setTimeout(() => {
      if (introOverlay.style.display !== 'none') {
        handleVideoEnd();
      }
    }, 8000);
  }
}

/* ----------------------------------------------------
   9. HERO → WHO WE ARE SCROLL-DRIVEN CAMERA SPLIT & REASSEMBLY
---------------------------------------------------- */
function initHeroScrollTransition() {
  const whoWeAreSec = document.getElementById('who-we-are');
  if (!whoWeAreSec) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  function updateScrollTransition() {
    const rect = whoWeAreSec.getBoundingClientRect();
    const vh = window.innerHeight;

    // 0.0 when top of #who-we-are is at bottom of viewport (Hero fully assembled)
    // 1.0 when top of #who-we-are reaches upper viewport (Lens half fixed in Who We Are)
    const rawProgress = (vh - rect.top) / (vh * 0.85);
    const progress = Math.min(1.0, Math.max(0.0, rawProgress));

    // Detach lens forward on Hero camera
    if (heroCameraInstance && typeof heroCameraInstance.setExplodeProgress === 'function') {
      heroCameraInstance.setExplodeProgress(progress);
    }

    // Smoothly slide in lens half on Who We Are section canvas
    if (whoWeAreLensInstance && typeof whoWeAreLensInstance.setScrollProgress === 'function') {
      whoWeAreLensInstance.setScrollProgress(progress);
    }

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollTransition);
      ticking = true;
    }
  }, { passive: true });

  updateScrollTransition();
}

/* ----------------------------------------------------
   10. CONTINUOUS REAL-TIME 3D CAMERA RACK-FOCUS SCROLL EFFECT (WITH FULL REVERSE)
---------------------------------------------------- */
function initContinuousScrollEffect() {
  const sections = document.querySelectorAll(
    '#who-we-are, #our-team, #what-we-do, #portfolio, #reviews, #contact'
  );

  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  function updateSectionTransforms() {
    const vh = window.innerHeight;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      
      const start = vh;
      const end = vh * 0.28;
      
      const rawProgress = (start - rect.top) / (start - end);
      const progress = Math.min(1.0, Math.max(0.0, rawProgress));

      const scale = 0.93 + progress * 0.07;
      const translateY = (1.0 - progress) * 35;
      const blurVal = (1.0 - progress) * 6;
      const opacityVal = 0.25 + progress * 0.75;

      const container = sec.querySelector(
        '.about-editorial-container, .team-editorial-container, .team-slider-wrapper, .services-editorial-container, .portfolio-editorial-container, .reviews-editorial-container, .contact-header-centered, .location-card-container'
      ) || sec;

      container.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
      container.style.filter = `blur(${blurVal.toFixed(1)}px)`;
      container.style.opacity = opacityVal.toFixed(2);
      container.style.transition = 'none';
      container.style.willChange = 'transform, filter, opacity';
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateSectionTransforms);
      ticking = true;
    }
  }, { passive: true });

  updateSectionTransforms();
}

/* ----------------------------------------------------
   11. OUR TEAM 3D COVERFLOW HORIZONTAL SLIDER ENGINE (WITH IMMEDIATE AUTO-PLAY & 1S RESUME)
---------------------------------------------------- */
function initTeam3DSlider() {
  const viewport = document.getElementById('team-coverflow-viewport');
  const cards = Array.from(document.querySelectorAll('.team-card'));
  const prevBtn = document.getElementById('team-slider-prev');
  const nextBtn = document.getElementById('team-slider-next');
  const dotsContainer = document.getElementById('team-slider-dots');

  if (!viewport || !cards.length) return;

  // Initial State: LEFT = Jinonse (0), CENTER = Sonat (1), RIGHT = Alan (2)
  let currentIndex = 1;
  const totalCards = cards.length;

  let autoPlayTimer = null;
  let resumeTimer = null;
  let isInteracting = false;

  // Create Pagination Dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `team-dot ${idx === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        handleUserInteraction();
        goToCard(idx);
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlider() {
    const isMobile = window.innerWidth <= 768;
    const spacing = isMobile ? 160 : 255;

    cards.forEach((card, i) => {
      let offset = i - currentIndex;
      
      // Continuous infinite looping calculation
      if (offset > totalCards / 2) offset -= totalCards;
      if (offset < -totalCards / 2) offset += totalCards;

      const absOffset = Math.abs(offset);

      // SHOW EXACTLY 3 CARDS IN TOTAL (1 Center, 1 Left, 1 Right)
      if (absOffset > 1.2) {
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
        card.style.transform = `translate3d(${offset * spacing}px, 0, -400px) scale(0.5) rotateY(0deg)`;
        return;
      }

      card.style.pointerEvents = 'auto';

      if (offset === 0) {
        // CENTER DOMINANT CARD (LARGE & STRAIGHT)
        card.style.transform = `translate3d(0, 0, 0) scale(1.0) rotateY(0deg)`;
        card.style.opacity = '1';
        card.style.filter = 'blur(0px)';
        card.style.zIndex = '10';
        card.style.borderColor = 'rgba(180, 76, 255, 0.55)';
        card.style.boxShadow = '0 20px 50px rgba(180, 76, 255, 0.35)';
      } else if (offset < 0) {
        // LEFT CARD (Rotated 3D perspective toward center)
        card.style.transform = `translate3d(-${spacing}px, 0, -120px) scale(0.82) rotateY(24deg)`;
        card.style.opacity = '0.65';
        card.style.filter = 'blur(1.5px)';
        card.style.zIndex = '5';
        card.style.borderColor = 'rgba(180, 76, 255, 0.20)';
        card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.30)';
      } else {
        // RIGHT CARD (Rotated 3D perspective toward center)
        card.style.transform = `translate3d(${spacing}px, 0, -120px) scale(0.82) rotateY(-24deg)`;
        card.style.opacity = '0.65';
        card.style.filter = 'blur(1.5px)';
        card.style.zIndex = '5';
        card.style.borderColor = 'rgba(180, 76, 255, 0.20)';
        card.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.30)';
      }
    });

    // Update Active Pagination Dot
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.team-dot');
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }
  }

  function goToCard(idx) {
    currentIndex = (idx + totalCards) % totalCards;
    updateSlider();
  }

  function prevCard() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateSlider();
  }

  function nextCard() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateSlider();
  }

  // --- AUTO-PLAY ENGINE (Immediate Start, 1s Pause on Click) ---
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (!isInteracting) {
        nextCard();
      }
    }, 3000);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function handleUserInteraction() {
    isInteracting = true;
    stopAutoPlay();
    if (resumeTimer) clearTimeout(resumeTimer);

    // EXACTLY 1 SECOND PAUSE AFTER INTERACTION THEN RESUME
    resumeTimer = setTimeout(() => {
      isInteracting = false;
      startAutoPlay();
    }, 1000);
  }

  // Viewport Intersection Observer
  const teamSection = document.getElementById('our-team');
  if (teamSection && typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoPlay();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(teamSection);
  }

  // Desktop Hover Pause & Resume
  viewport.addEventListener('mouseenter', () => {
    isInteracting = true;
    stopAutoPlay();
  });

  viewport.addEventListener('mouseleave', () => {
    handleUserInteraction();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      handleUserInteraction();
      prevCard();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      handleUserInteraction();
      nextCard();
    });
  }

  // Click on side card activates it directly
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (currentIndex !== idx) {
        handleUserInteraction();
        goToCard(idx);
      }
    });
  });

  // MOUSE DRAG & TOUCH SWIPE INTERACTION
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function onDragStart(e) {
    handleUserInteraction();
    isDragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    currentX = startX;
  }

  function onDragMove(e) {
    if (!isDragging) return;
    currentX = e.touches ? e.touches[0].clientX : e.clientX;
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    const diffX = currentX - startX;

    if (Math.abs(diffX) > 40) {
      if (diffX < 0) nextCard();
      else prevCard();
    }
  }

  viewport.addEventListener('mousedown', onDragStart);
  viewport.addEventListener('touchstart', onDragStart, { passive: true });

  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('touchmove', onDragMove, { passive: true });

  window.addEventListener('mouseup', onDragEnd);
  window.addEventListener('touchend', onDragEnd);

  // Keyboard Left / Right Arrow Navigation
  window.addEventListener('keydown', (e) => {
    const rect = viewport.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowLeft') {
        handleUserInteraction();
        prevCard();
      }
      if (e.key === 'ArrowRight') {
        handleUserInteraction();
        nextCard();
      }
    }
  });

  window.addEventListener('resize', updateSlider);
  updateSlider();

  // START AUTOPLAY IMMEDIATELY ON MOUNT
  startAutoPlay();
}

/* ----------------------------------------------------
   12. INITIALIZATION
---------------------------------------------------- */
function init() {
  bindEvents();
  initCinematicHero();
  initAccordion();
  initPortfolioFilterAndMarquee();
  initCaseStudyModal();
  initFloatingWhatsapp();
  initReviewsMarquee();
  initHeroScrollTransition();
  initContinuousScrollEffect();
  initTeam3DSlider();
  setupIntroVideo();
}

window.addEventListener('DOMContentLoaded', init);
