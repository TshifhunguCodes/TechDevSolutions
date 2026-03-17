// ======================================== //
// SERVICES PAGE - 3D/4D INTERACTIVE EFFECTS //
// ======================================== //

(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServicesPage);
    } else {
        initServicesPage();
    }

    function initServicesPage() {
        // Add 3D/4D elements to page header
        addHeader4DElements();
        
        // Initialize all effects
        initMouseParallax();
        initScrollAnimations();
        initCardTilt();
        initParticleField();
        initPackageHighlight();
        initPerformanceOptimization();
    }

    function addHeader4DElements() {
        const header = document.querySelector('.page-header');
        if (!header) return;

        // Add floating shapes
        for (let i = 1; i <= 3; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape shape-${i}`;
            header.appendChild(shape);
        }

        // Add tesseract
        const tesseract = document.createElement('div');
        tesseract.className = 'tesseract-header';
        for (let i = 1; i <= 8; i++) {
            const face = document.createElement('div');
            face.className = `tesseract-header-face tesseract-header-face-${i}`;
            tesseract.appendChild(face);
        }
        header.appendChild(tesseract);

        // Add quantum particles
        for (let i = 1; i <= 10; i++) {
            const particle = document.createElement('div');
            particle.className = `quantum-particle particle-h${i}`;
            header.appendChild(particle);
        }
    }

    function initMouseParallax() {
        const header = document.querySelector('.page-header');
        if (!header) return;

        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let rafId = null;

        header.addEventListener('mousemove', (e) => {
            const rect = header.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        });

        function updateParallax() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            const shapes = header.querySelectorAll('.floating-shape');
            const tesseract = header.querySelector('.tesseract-header');
            const particles = header.querySelectorAll('.quantum-particle');

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.3;
                shape.style.transform = `translateX(${currentX * 40 * speed}px) 
                                       translateY(${currentY * 40 * speed}px) 
                                       rotateX(${currentY * 20}deg) 
                                       rotateY(${currentX * 20}deg)`;
            });

            if (tesseract) {
                tesseract.style.transform = `translate(-50%, -50%) 
                                            rotateX(${currentY * 30}deg) 
                                            rotateY(${currentX * 30}deg)`;
            }

            particles.forEach((particle, index) => {
                const speed = (index % 5 + 1) * 0.2;
                particle.style.transform = `translateX(${currentX * 60 * speed}px) 
                                          translateY(${currentY * 60 * speed}px)`;
            });

            rafId = null;
        }

        header.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });
    }

    function initScrollAnimations() {
        const cards = document.querySelectorAll('.service-card, .package-card, .tech-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2, rootMargin: '0px' });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            observer.observe(card);
        });
    }

    function initCardTilt() {
        const cards = document.querySelectorAll('.service-card, .package-card, .tech-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `translateY(-10px) 
                                       rotateX(${rotateX}deg) 
                                       rotateY(${rotateY}deg) 
                                       scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    function initParticleField() {
        const particles = document.querySelectorAll('.quantum-particle');
        
        setInterval(() => {
            particles.forEach(particle => {
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                const randomScale = 0.5 + Math.random() * 2;
                
                particle.style.transition = 'transform 4s ease-in-out';
                particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
            });
        }, 4000);
    }

    function initPackageHighlight() {
        const packages = document.querySelectorAll('.package-card');
        
        packages.forEach(pkg => {
            pkg.addEventListener('mouseenter', () => {
                packages.forEach(p => {
                    if (p !== pkg && p.classList.contains('featured')) {
                        p.style.transform = 'scale(1) translateY(-5px)';
                    }
                });
            });
            
            pkg.addEventListener('mouseleave', () => {
                packages.forEach(p => {
                    if (p.classList.contains('featured')) {
                        p.style.transform = 'scale(1.05) translateY(-10px)';
                    } else {
                        p.style.transform = '';
                    }
                });
            });
        });
    }

    function initPerformanceOptimization() {
        // Intersection Observer for video
        const header = document.querySelector('.page-header');
        const video = header?.querySelector('.page-header-video');
        
        if (video) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(header);
        }

        // Mobile optimizations
        if ('ontouchstart' in window) {
            const style = document.createElement('style');
            style.textContent = `
                .floating-shape,
                .tesseract-header,
                .quantum-particle {
                    opacity: 0.1 !important;
                    animation: none !important;
                }
                
                .service-card:hover,
                .package-card:hover,
                .tech-card:hover {
                    transform: translateY(-5px) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
})();