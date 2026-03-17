// ======================================== //
// ABOUT PAGE - 3D/4D INTERACTIVE EFFECTS //
// ======================================== //


(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAboutPage);
    } else {
        initAboutPage();
    }

    function initAboutPage() {
        // Add 3D/4D elements to header
        addHeaderElements();
        
        // Initialize founder images
        initFounderImages();
        
        // Initialize all effects
        initMouseParallax();
        initFounderCards();
        initProcessSteps();
        initStoryParagraphs();
        initPerformanceOptimization();
    }

    function addHeaderElements() {
        const header = document.querySelector('.page-header');
        if (!header) return;

        // Add cosmic orbs
        if (!header.querySelector('.orb-1')) {
            for (let i = 1; i <= 3; i++) {
                const orb = document.createElement('div');
                orb.className = `cosmic-orb orb-${i}`;
                header.appendChild(orb);
            }
        }

        // Add nebula
        if (!header.querySelector('.nebula')) {
            const nebula = document.createElement('div');
            nebula.className = 'nebula';
            header.appendChild(nebula);
        }

        // Add shooting stars
        if (!header.querySelector('.star-1')) {
            for (let i = 1; i <= 3; i++) {
                const star = document.createElement('div');
                star.className = `shooting-star star-${i}`;
                header.appendChild(star);
            }
        }

        // Add cosmic dust
        if (!header.querySelector('.dust-1')) {
            for (let i = 1; i <= 8; i++) {
                const dust = document.createElement('div');
                dust.className = `cosmic-dust dust-${i}`;
                header.appendChild(dust);
            }
        }
    }

    function initFounderImages() {
        const founderImages = document.querySelectorAll('.founder-image');
        
        founderImages.forEach(img => {
            // Check if image has valid source
            if (img.getAttribute('src') && img.getAttribute('src') !== '' && img.getAttribute('src') !== '#') {
                img.style.display = 'block';
                
                // When image loads successfully, hide the icon
                img.onload = function() {
                    const icon = this.parentElement.querySelector('i');
                    if (icon) {
                        icon.style.display = 'none';
                    }
                    this.style.display = 'block';
                };
                
                // If image fails to load, show the icon
                img.onerror = function() {
                    this.style.display = 'none';
                    const icon = this.parentElement.querySelector('i');
                    if (icon) {
                        icon.style.display = 'flex';
                    }
                };
            } else {
                // No image source, hide img and show icon
                img.style.display = 'none';
                const icon = img.parentElement.querySelector('i');
                if (icon) {
                    icon.style.display = 'flex';
                }
            }
        });
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

            const orbs = header.querySelectorAll('.cosmic-orb');
            const nebula = header.querySelector('.nebula');
            const dust = header.querySelectorAll('.cosmic-dust');

            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.3;
                orb.style.transform = `translateX(${currentX * 60 * speed}px) 
                                     translateY(${currentY * 60 * speed}px)`;
            });

            if (nebula) {
                nebula.style.transform = `translate(-50%, -50%) 
                                        rotate(${currentX * 30}deg) 
                                        scale(${1 + Math.abs(currentX * currentY) * 0.2})`;
            }

            dust.forEach((particle, index) => {
                const speed = (index % 4 + 1) * 0.2;
                particle.style.transform = `translateX(${currentX * 100 * speed}px) 
                                          translateY(${currentY * 100 * speed}px)`;
            });

            rafId = null;
        }

        header.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });
    }

    function initFounderCards() {
        const cards = document.querySelectorAll('.founder-card');
        
        cards.forEach(card => {
            // 3D tilt effect
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                card.style.transform = `translateY(-15px) 
                                       rotateX(${rotateX}deg) 
                                       rotateY(${rotateY}deg) 
                                       scale(1.05)`;
                
                // Move image slightly
                const imgContainer = card.querySelector('.founder-image-container');
                if (imgContainer) {
                    imgContainer.style.transform = `translateX(${rotateY * 2}px) 
                                                 translateY(${rotateX * 2}px)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                const imgContainer = card.querySelector('.founder-image-container');
                if (imgContainer) {
                    imgContainer.style.transform = '';
                }
            });

            // Tag hover effects
            const tags = card.querySelectorAll('.founder-tag');
            tags.forEach(tag => {
                tag.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px) scale(1.1)';
                });
                
                tag.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });

            // Social icon effects
            const socialLinks = card.querySelectorAll('.founder-social a');
            socialLinks.forEach(link => {
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) rotateY(180deg)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });
        });
    }

    function initProcessSteps() {
        const steps = document.querySelectorAll('.process-step');
        
        steps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                const number = step.querySelector('.step-number');
                if (number) {
                    number.style.transform = 'scale(1.2) rotate(10deg)';
                }
            });

            step.addEventListener('mouseleave', () => {
                const number = step.querySelector('.step-number');
                if (number) {
                    number.style.transform = '';
                }
            });
        });
    }

    function initStoryParagraphs() {
        const paragraphs = document.querySelectorAll('.about-content p');
        
        paragraphs.forEach(p => {
            p.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(10px)';
                this.style.background = 'rgba(110,231,183,0.08)';
                this.style.borderLeft = '3px solid var(--accent)';
            });

            p.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.background = '';
                this.style.borderLeft = '';
            });
        });
    }

    function initPerformanceOptimization() {
        // Intersection Observer for header video
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

        // Intersection Observer for animations
        const animatedElements = document.querySelectorAll('.founder-card, .process-step, .about-content p');
        
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });

        animatedElements.forEach(el => {
            elementObserver.observe(el);
        });

        // Mobile optimizations
        if ('ontouchstart' in window) {
            const style = document.createElement('style');
            style.textContent = `
                .cosmic-orb,
                .nebula,
                .shooting-star,
                .cosmic-dust {
                    opacity: 0.1 !important;
                    animation: none !important;
                }
                
                .founder-card:hover,
                .process-step:hover {
                    transform: translateY(-5px) !important;
                }
                
                .founder-tag:hover,
                .founder-social a:hover {
                    transform: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
})();

