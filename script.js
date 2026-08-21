/**
 * RENDERBERRY.IN — PREMIUM DIGITAL & CREATIVE STUDIO
 * Interactive Suite:
 * - Fluid Ambient Mouse Canvas with Constellation Physics & Color Glow
 * - Magnetic 3D Cards with Dynamic Cursor Radial Spotlight (Linear / Vercel style)
 * - Magnetic Button Attraction Physics
 * - Custom Trailing Glow Cursor
 * - Portfolio Case Study Drawer & Browser History API
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Preloader
       ========================================================================== */
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    }

    /* ==========================================================================
       2. Interactive Ambient Canvas (Constellations + Mouse Aurora Glow)
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 16), 80);
        const maxDist = 140;
        
        let mouseX = -1000;
        let mouseY = -1000;
        let targetMouseX = -1000;
        let targetMouseY = -1000;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            targetMouseX = -1000;
            targetMouseY = -1000;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = (Math.random() - 0.5) * 0.45;
                this.radius = Math.random() * 1.8 + 0.8;
                this.baseAlpha = Math.random() * 0.5 + 0.25;
                this.pulseSpeed = Math.random() * 0.02 + 0.01;
                this.pulseOffset = Math.random() * Math.PI * 2;
            }

            update(time) {
                this.x += this.vx;
                this.y += this.vy;

                // Wrap boundaries
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Gentle mouse repulsion/attraction
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && dist > 0) {
                    const force = (120 - dist) / 120;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }

                this.currentAlpha = this.baseAlpha + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(192, 132, 252, ${Math.max(0.1, this.currentAlpha)})`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = 'rgba(168, 85, 247, 0.4)';
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        let time = 0;
        function animateCanvas() {
            time += 1;
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse follow
            mouseX += (targetMouseX - mouseX) * 0.1;
            mouseY += (targetMouseY - mouseY) * 0.1;

            // Ambient Mouse Radial Aurora Glow
            if (mouseX > 0 && mouseY > 0) {
                const auroraGradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 320);
                auroraGradient.addColorStop(0, 'rgba(147, 51, 234, 0.12)');
                auroraGradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.05)');
                auroraGradient.addColorStop(1, 'rgba(7, 7, 10, 0)');
                ctx.fillStyle = auroraGradient;
                ctx.fillRect(0, 0, width, height);
            }

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.update(time);
                p1.draw();

                // Draw connections between particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
                        ctx.lineWidth = 0.85;
                        ctx.stroke();
                    }
                }

                // Interactive connection to mouse cursor
                const mdx = p1.x - mouseX;
                const mdy = p1.y - mouseY;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 160) {
                    const alpha = (1 - mdist / 160) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(216, 180, 254, ${alpha})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }

    /* ==========================================================================
       3. Dynamic Cursor Spotlight & 3D Tilt for Interactive Cards
       ========================================================================== */
    const interactiveCards = document.querySelectorAll('.service-card, .portfolio-item-card, .contact-channel-card, .who-highlight-card, .location-card');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set dynamic spotlight coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4.5;
            const rotateY = ((x - centerX) / centerX) * 4.5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    /* ==========================================================================
       4. Magnetic Attraction for Buttons
       ========================================================================== */
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-maps, .floating-whatsapp-btn');
    if (window.matchMedia('(pointer: fine)').matches) {
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    /* ==========================================================================
       5. Custom Trailing Glow Cursor
       ========================================================================== */
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
        let cursorX = -100;
        let cursorY = -100;
        let outlineX = -100;
        let outlineY = -100;

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.left = `${cursorX}px`;
            cursorDot.style.top = `${cursorY}px`;
        });

        function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.18;
            outlineY += (cursorY - outlineY) * 0.18;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnetic hover enlargement
        const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio-item-card, .contact-channel-card, .portfolio-filter-pill');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover-active'));
            el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover-active'));
        });
    }

    /* ==========================================================================
       6. Navigation Scroll State, Stats Ribbon & WhatsApp Visibility on Scroll
       ========================================================================== */
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    const floatingWaBtn = document.querySelector('.floating-whatsapp-btn');
    const statsBanner = document.querySelector('.stats-banner-section');

    function checkScrollStates() {
        const scrollY = window.scrollY;

        // Navbar scrolled state
        if (navbarWrapper) {
            if (scrollY > 40) {
                navbarWrapper.classList.add('scrolled');
            } else {
                navbarWrapper.classList.remove('scrolled');
            }
        }

        // Stats ribbon: reveals on scroll down, and hides when scrolling back up to 1st page
        if (statsBanner) {
            if (scrollY > 60) {
                statsBanner.classList.add('stats-visible');
            } else {
                statsBanner.classList.remove('stats-visible');
            }
        }

        // WhatsApp button: appears after scrolling past hero, hides when back on 1st page
        if (floatingWaBtn) {
            if (scrollY > 160) {
                floatingWaBtn.classList.add('visible');
            } else {
                floatingWaBtn.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', checkScrollStates, { passive: true });
    checkScrollStates();

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ==========================================================================
       7. Scroll Reveal Observer
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       8. Portfolio Data & Rendering (8 Real Items from Provided Image 2)
       ========================================================================== */
    const portfolioProjects = [
        {
            id: 'brand-relaunch',
            category: 'BRANDING',
            filterCategory: 'BRANDING',
            title: 'Brand Re-launch',
            client: 'Apex Retail Group',
            year: '2024',
            deliverables: 'Visual Identity, Brand Guidelines, Packaging, Typography',
            description: 'Comprehensive brand revitalization engineered to re-establish market authority, unify multi-channel communication, and forge an emotional bond with modern consumers.',
            gallery: [
                'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'ecommerce-app',
            category: 'WEB DEVELOPMENT',
            filterCategory: 'WEB DEVELOPMENT',
            title: 'E-Commerce App',
            client: 'LuxeCart Global',
            year: '2024',
            deliverables: 'Custom Web Platform, Payment Gateway, High-Speed Performance',
            description: 'A bespoke, lightning-fast e-commerce experience designed for high conversion, frictionless checkout flows, and seamless real-time inventory synchronization.',
            gallery: [
                'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'social-media-campaign',
            category: 'ADS & PROMOTIONS',
            filterCategory: 'ADS & PROMOTIONS',
            title: 'Social Media Campaign',
            client: 'Nova Pulse Media',
            year: '2024',
            deliverables: 'Omni-channel Ad Creatives, Audience Retargeting, High-ROI Funnels',
            description: 'Data-driven promotional campaign maximizing viral reach, multi-tier social ad strategies, and interactive motion assets that converted passive scrollers into loyal customers.',
            gallery: [
                'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'corporate-photography',
            category: 'PHOTOSHOOTS',
            filterCategory: 'PHOTOSHOOTS',
            title: 'Corporate Photography',
            client: 'Vanguard Industrial Corp',
            year: '2023',
            deliverables: 'Executive Portraits, Facility Visuals, Editorial Lookbook',
            description: 'High-end studio and location photoshoots capturing executive leadership, cutting-edge corporate infrastructure, and authentic brand storytelling.',
            gallery: [
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'custom-crm-system',
            category: 'SOFTWARE DEV',
            filterCategory: 'SOFTWARE DEV',
            title: 'Custom CRM System',
            client: 'Horizon Enterprise Suite',
            year: '2024',
            deliverables: 'Scalable Architecture, Real-time Analytics, Automated Workflows',
            description: 'An enterprise-grade Customer Relationship Management solution designed to eliminate operational bottlenecks, unify communications, and visualize customer pipelines.',
            gallery: [
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'automated-testing-suite',
            category: 'QA TESTING',
            filterCategory: 'QA TESTING',
            title: 'Automated Testing Suite',
            client: 'FinTech SecureLabs',
            year: '2023',
            deliverables: 'End-to-End Test Automation, Security Audits, CI/CD Integration',
            description: 'Rigorous automated QA framework ensuring bulletproof system security, sub-second response verification, and zero regression deployments for critical platforms.',
            gallery: [
                'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'corporate-video',
            category: 'PRODUCTION',
            filterCategory: 'PRODUCTION',
            title: 'Corporate Video',
            client: 'Solaria Energies',
            year: '2024',
            deliverables: '4K Cinematic Film, Drone Cinematography, Sound Design',
            description: 'A cinematic brand film combining breathtaking drone visuals, inspiring client narratives, and meticulous sound engineering to communicate company impact.',
            gallery: [
                'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop'
            ]
        },
        {
            id: 'seo-optimization',
            category: 'DIGITAL MARKETING',
            filterCategory: 'DIGITAL MARKETING',
            title: 'SEO Optimization',
            client: 'Kinetix Global Health',
            year: '2024',
            deliverables: 'Technical SEO, High-Intent Keyword Ranking, Link Building',
            description: 'Advanced search engine optimization and performance tuning that catapulted client domain authority, securing page-one search domination and exponential organic growth.',
            gallery: [
                'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1571721795195-a2ca2d3370a9?q=80&w=1200&auto=format&fit=crop'
            ]
        }
    ];

    const portfolioGrid = document.getElementById('portfolio-cards-grid');
    const filterPills = document.querySelectorAll('.portfolio-filter-pill');

    function renderPortfolioCards(projects) {
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = '';

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'portfolio-item-card';
            card.setAttribute('data-id', project.id);
            card.innerHTML = `
                <span class="portfolio-item-cat">${project.category}</span>
                <h3 class="portfolio-item-title">${project.title}</h3>
                <div class="portfolio-item-action">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </div>
            `;

            // Add dynamic mouse tracking for newly rendered cards
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -4.5;
                const rotateY = ((x - centerX) / centerX) * 4.5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
            });

            card.addEventListener('click', () => openProjectModal(project));
            portfolioGrid.appendChild(card);
        });
    }

    renderPortfolioCards(portfolioProjects);

    // Filtering logic
    filterPills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            filterPills.forEach(p => p.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const filter = e.currentTarget.getAttribute('data-filter');
            if (filter === 'all') {
                renderPortfolioCards(portfolioProjects);
            } else {
                const filtered = portfolioProjects.filter(p => p.filterCategory === filter);
                renderPortfolioCards(filtered);
            }
        });
    });

    /* ==========================================================================
       9. Portfolio Case Study Drawer & History API
       ========================================================================== */
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const modalBackBtn = document.getElementById('modal-back-btn');
    const modalCloseIcon = document.getElementById('modal-close-icon-btn');
    const prevProjectBtn = document.getElementById('prev-project-btn');
    const nextProjectBtn = document.getElementById('next-project-btn');

    let currentProjectIndex = 0;

    function openProjectModal(project) {
        currentProjectIndex = portfolioProjects.findIndex(p => p.id === project.id);
        if (currentProjectIndex === -1) currentProjectIndex = 0;

        // Push state for back button navigation
        history.pushState({ projectId: project.id }, project.title, `#project-${project.id}`);

        renderModalContent(project);
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (window.location.hash.startsWith('#project-')) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
    }

    function renderModalContent(project) {
        const galleryItems = project.gallery.map(img => `
            <div class="modal-gallery-item">
                <img src="${img}" alt="${project.title} Visual" loading="lazy">
            </div>
        `).join('');

        modalContent.innerHTML = `
            <div class="modal-case-hero">
                <span class="modal-case-cat">${project.category}</span>
                <h1 class="modal-case-title">${project.title}</h1>
                
                <div class="modal-meta-grid">
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Client</span>
                        <span class="modal-meta-value">${project.client}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Timeline</span>
                        <span class="modal-meta-value">${project.year}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Category</span>
                        <span class="modal-meta-value">${project.category}</span>
                    </div>
                    <div class="modal-meta-item">
                        <span class="modal-meta-label">Key Deliverables</span>
                        <span class="modal-meta-value">${project.deliverables}</span>
                    </div>
                </div>
            </div>

            <div class="modal-case-body">
                <p class="modal-desc-text">${project.description}</p>
                <div class="modal-gallery-grid">
                    ${galleryItems}
                </div>
            </div>
        `;
    }

    if (modalBackBtn) modalBackBtn.addEventListener('click', closeProjectModal);
    if (modalCloseIcon) modalCloseIcon.addEventListener('click', closeProjectModal);

    if (prevProjectBtn) {
        prevProjectBtn.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex - 1 + portfolioProjects.length) % portfolioProjects.length;
            openProjectModal(portfolioProjects[currentProjectIndex]);
        });
    }

    if (nextProjectBtn) {
        nextProjectBtn.addEventListener('click', () => {
            currentProjectIndex = (currentProjectIndex + 1) % portfolioProjects.length;
            openProjectModal(portfolioProjects[currentProjectIndex]);
        });
    }

    // Keyboard ESC & Browser Back button handling
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    window.addEventListener('popstate', (e) => {
        if (modal.classList.contains('active')) {
            closeProjectModal();
        } else if (e.state && e.state.projectId) {
            const project = portfolioProjects.find(p => p.id === e.state.projectId);
            if (project) openProjectModal(project);
        }
    });

    // Check direct deep link on initial load
    if (window.location.hash.startsWith('#project-')) {
        const projId = window.location.hash.replace('#project-', '');
        const matchedProj = portfolioProjects.find(p => p.id === projId);
        if (matchedProj) {
            openProjectModal(matchedProj);
        }
    }
});
