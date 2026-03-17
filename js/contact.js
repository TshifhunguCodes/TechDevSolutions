// ======================================== //
// CONTACT PAGE - 3D/4D INTERACTIVE EFFECTS //
// ======================================== //

(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactPage);
    } else {
        initContactPage();
    }

    function initContactPage() {
        // Add 3D/4D elements to header
        addHeaderElements();
        
        // Initialize all effects
        initMouseParallax();
        initFormEffects();
        initContactItems();
        initFaqCards();
        initFormValidation();
        initPerformanceOptimization();
    }

    function addHeaderElements() {
        const header = document.querySelector('.page-header');
        if (!header) return;

        // Add video container if not exists
        if (!header.querySelector('.page-header-video-container')) {
            const videoContainer = document.createElement('div');
            videoContainer.className = 'page-header-video-container';
            
            const video = document.createElement('video');
            video.className = 'page-header-video';
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            video.playsinline = true;
            
            // Add your video source
            const source = document.createElement('source');
            source.src = '/assets/videos/contact-hero.mp4';
            source.type = 'video/mp4';
            
            // Fallback image
            const fallbackImg = document.createElement('img');
            fallbackImg.src = 'https://via.placeholder.com/1920x1080/1a1a1a/6ee7b7?text=Contact+Us';
            fallbackImg.style.display = 'none';
            
            video.appendChild(source);
            video.appendChild(fallbackImg);
            videoContainer.appendChild(video);
            
            const overlay = document.createElement('div');
            overlay.className = 'page-header-overlay';
            videoContainer.appendChild(overlay);
            
            header.appendChild(videoContainer);
        }

        // Add crystals
        for (let i = 1; i <= 4; i++) {
            const crystal = document.createElement('div');
            crystal.className = `crystal crystal-${i}`;
            header.appendChild(crystal);
        }

        // Add portal
        const portal = document.createElement('div');
        portal.className = 'portal';
        header.appendChild(portal);

        // Add energy field
        const energyField = document.createElement('div');
        energyField.className = 'energy-field';
        header.appendChild(energyField);

        // Add plasma particles
        for (let i = 1; i <= 8; i++) {
            const plasma = document.createElement('div');
            plasma.className = `plasma-particle plasma-${i}`;
            header.appendChild(plasma);
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

            const crystals = header.querySelectorAll('.crystal');
            const portal = header.querySelector('.portal');
            const plasmas = header.querySelectorAll('.plasma-particle');

            crystals.forEach((crystal, index) => {
                const speed = (index + 1) * 0.4;
                crystal.style.transform = `translateX(${currentX * 50 * speed}px) 
                                         translateY(${currentY * 50 * speed}px) 
                                         rotateX(${currentY * 30}deg) 
                                         rotateY(${currentX * 30}deg)`;
            });

            if (portal) {
                portal.style.transform = `translate(-50%, -50%) 
                                        rotate(${currentX * 30}deg) 
                                        scale(${1 + Math.abs(currentX * currentY) * 0.3})`;
            }

            plasmas.forEach((plasma, index) => {
                const speed = (index % 4 + 1) * 0.3;
                plasma.style.transform = `translateX(${currentX * 80 * speed}px) 
                                        translateY(${currentY * 80 * speed}px)`;
            });

            rafId = null;
        }

        header.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });
    }

    function initFormEffects() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Floating label effect
            input.addEventListener('focus', () => {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.transform = 'translateY(-30px) scale(0.9)';
                    label.style.color = 'var(--accent)';
                }
            });

            input.addEventListener('blur', () => {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    if (!input.value) {
                        label.style.transform = '';
                        label.style.color = '';
                    }
                }
            });

            // Check if input has value on load
            if (input.value) {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    label.style.transform = 'translateY(-30px) scale(0.9)';
                }
            }
        });

        // Form submit animation
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('.submit-btn');
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate form submission
            setTimeout(() => {
                btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                btn.style.background = 'var(--accent)';
                btn.style.color = 'var(--black)';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                    btn.style.background = '';
                    btn.style.color = '';
                    
                    // Reset labels
                    inputs.forEach(input => {
                        const label = input.previousElementSibling;
                        if (label && label.tagName === 'LABEL') {
                            label.style.transform = '';
                            label.style.color = '';
                        }
                    });
                }, 3000);
            }, 2000);
        });
    }

    function initContactItems() {
        const items = document.querySelectorAll('.contact-item');
        
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotateY(180deg)';
                }
            });

            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    }

    function initFaqCards() {
        const cards = document.querySelectorAll('.faq-card');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.style.transform = 'scale(1.02) rotateX(2deg) rotateY(2deg)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            });
        });
    }

    function initFormValidation() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        function showError(input, message) {
            const formGroup = input.closest('.form-group');
            let error = formGroup.querySelector('.error-message');
            
            if (!error) {
                error = document.createElement('div');
                error.className = 'error-message';
                error.style.color = '#ff6b6b';
                error.style.fontSize = '0.85rem';
                error.style.marginTop = '5px';
                formGroup.appendChild(error);
            }
            
            error.textContent = message;
            input.style.borderColor = '#ff6b6b';
        }

        function clearError(input) {
            const formGroup = input.closest('.form-group');
            const error = formGroup.querySelector('.error-message');
            if (error) {
                error.remove();
            }
            input.style.borderColor = '';
        }

        name?.addEventListener('blur', () => {
            if (name.value.trim().length < 2) {
                showError(name, 'Please enter your full name');
            } else {
                clearError(name);
            }
        });

        email?.addEventListener('blur', () => {
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
            } else {
                clearError(email);
            }
        });

        message?.addEventListener('blur', () => {
            if (message.value.trim().length < 10) {
                showError(message, 'Please provide more details (at least 10 characters)');
            } else {
                clearError(message);
            }
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

        // Mobile optimizations
        if ('ontouchstart' in window) {
            const style = document.createElement('style');
            style.textContent = `
                .crystal,
                .portal,
                .plasma-particle {
                    opacity: 0.1 !important;
                    animation: none !important;
                }
                
                .contact-item:hover,
                .faq-card:hover {
                    transform: translateY(-5px) !important;
                }
                
                .contact-form::before {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
})();