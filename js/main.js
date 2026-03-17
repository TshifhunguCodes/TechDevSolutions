// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.section-title, .floating-card, .service-card').forEach(el => {
    if (el) observer.observe(el);
});

// Parallax effect for floating cards
window.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.floating-card');
    if (cards.length === 0) return;
    
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    cards.forEach((card, index) => {
        // Different multipliers for depth effect
        const multiplier = [0.3, 0.5, 0.2, 0.4][index];
        const moveX = (mouseX - 0.5) * 40 * multiplier;
        const moveY = (mouseY - 0.5) * 40 * multiplier;
        
        card.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 - multiplier * 0.1})`;
    });
});



// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks && navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
                if (mobileMenuBtn) mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// 3D Particle Globe using Three.js
function initParticleGlobe() {
    const container = document.getElementById('particles-globe');
    if (!container || typeof THREE === 'undefined') return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        powerPreference: "high-performance"
    });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Create particle globe
    const particles = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particles * 3);
    const colors = new Float32Array(particles * 3);
    
    // Create sphere positions
    const radius = 4;
    for (let i = 0; i < particles; i++) {
        const i3 = i * 3;
        
        // Random spherical coordinates
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        // Convert to Cartesian coordinates
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Create subtle color variations (white to accent color)
        colors[i3] = 0.8 + Math.random() * 0.2; // R
        colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
        colors[i3 + 2] = 1.0; // B
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Material with point size based on distance
    const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    // Add subtle glow effect with a second layer of particles
    const glowGeometry = new THREE.BufferGeometry();
    const glowPositions = positions.slice();
    const glowColors = new Float32Array(particles * 3);
    
    for (let i = 0; i < particles; i++) {
        const i3 = i * 3;
        // Slightly offset positions for glow
        glowPositions[i3] += (Math.random() - 0.5) * 0.2;
        glowPositions[i3 + 1] += (Math.random() - 0.5) * 0.2;
        glowPositions[i3 + 2] += (Math.random() - 0.5) * 0.2;
        
        // Glow color (accent color)
        glowColors[i3] = 110 / 255; // R (accent color)
        glowColors[i3 + 1] = 231 / 255; // G
        glowColors[i3 + 2] = 183 / 255; // B
    }
    
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
    glowGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3));
    
    const glowMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    const glowSystem = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(glowSystem);
    
    // Camera position
    camera.position.z = 8;
    
    // Mouse movement for parallax
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Smooth rotation
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
        
        glowSystem.rotation.y += 0.001;
        glowSystem.rotation.x += 0.0005;
        
        // Subtle parallax effect based on mouse position
        particleSystem.rotation.y += mouseX * 0.0005;
        particleSystem.rotation.x += mouseY * 0.0005;
        
        // Pulsing effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.03;
        particleSystem.scale.set(scale, scale, scale);
        glowSystem.scale.set(scale, scale, scale);
        
        renderer.render(scene, camera);
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    
    // Start animation
    animate();
    
    // Performance optimization for mobile
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        material.size = 0.03;
        glowMaterial.size = 0.05;
        glowMaterial.opacity = 0.2;
        material.opacity = 0.6;
    }
}

// Initialize globe when page loads
window.addEventListener('load', () => {
    // Check if we're on a page with the globe
    if (document.getElementById('particles-globe')) {
        // Load Three.js dynamically if not already loaded
        if (typeof THREE === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = initParticleGlobe;
            document.head.appendChild(script);
        } else {
            initParticleGlobe();
        }
    }
    
    // Hero video: try to play everywhere, and only fall back if playback fails.
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo) {
        const videoContainer = document.querySelector('.hero-video-container');

        const showVideoFallback = () => {
            heroVideo.style.opacity = '0';
            if (videoContainer) {
                videoContainer.style.background = 'url("assets/images/pic3.jpg") center/cover no-repeat';
            }
        };

        heroVideo.muted = true;
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('playsinline', '');
        heroVideo.setAttribute('webkit-playsinline', '');

        heroVideo.addEventListener('error', showVideoFallback);

        const playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
                showVideoFallback();
            });
        }

        if (videoContainer) {
            heroVideo.addEventListener('loadeddata', () => {
                videoContainer.style.background = 'none';
                heroVideo.style.opacity = '1';
            }, { once: true });
        }
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Show success message (in a real app, you would send this to a server)
            alert(`Thank you ${name}! We have received your message about ${service}. We will contact you at ${email} within 24 hours.`);
            
            // Reset form
            contactForm.reset();
        });
    }
});

// Form submission for consultation booking
const consultationButtons = document.querySelectorAll('.cta-button, .hero-cta, .nav-cta');
consultationButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#contact') return;
        
        e.preventDefault();
        
        // Redirect to contact page
        window.location.href = 'contact.html';
    });
});

// ======================================== //
// HAMBURGER MENU - MOBILE NAVIGATION //
// ======================================== //

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHamburgerMenu);
    } else {
        initHamburgerMenu();
    }

    function initHamburgerMenu() {
        // Get elements
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        const closeBtn = document.querySelector('.mobile-close-btn');
        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        const mobileCta = document.querySelector('.mobile-nav-cta');
        const body = document.body;

        // Check if elements exist
        if (!hamburgerBtn || !mobileNav || !mobileOverlay || !closeBtn) {
            console.warn('Hamburger menu elements not found');
            return;
        }

        // Function to open menu
        function openMenu() {
            hamburgerBtn.classList.add('active');
            mobileNav.classList.add('active');
            mobileOverlay.classList.add('active');
            body.classList.add('menu-open');
        }

        // Function to close menu
        function closeMenu() {
            hamburgerBtn.classList.remove('active');
            mobileNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.classList.remove('menu-open');
        }

        // Open menu on hamburger click
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu on close button click
        closeBtn.addEventListener('click', closeMenu);

        // Close menu on overlay click
        mobileOverlay.addEventListener('click', closeMenu);

        // Close menu when clicking on a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close if it's the same page (prevent double navigation)
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    closeMenu();
                }
            });
        });

        // Close menu when clicking CTA button
        if (mobileCta) {
            mobileCta.addEventListener('click', closeMenu);
        }

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle window resize - close menu on desktop
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
                    closeMenu();
                }
            }, 250);
        });

        // Touch swipe to close (for mobile)
        let touchStartX = 0;
        let touchEndX = 0;

        mobileNav.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        mobileNav.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left to close
                closeMenu();
            }
        }

        // Prevent clicks inside mobile nav from closing
        mobileNav.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Add active class to current page link
        function setActiveLink() {
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            
            // Desktop links
            document.querySelectorAll('.nav-links a').forEach(link => {
                const linkPage = link.getAttribute('href');
                if (linkPage === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Mobile links
            document.querySelectorAll('.mobile-nav-links a').forEach(link => {
                const linkPage = link.getAttribute('href');
                if (linkPage === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        // Set active link on page load
        setActiveLink();

        // Log success
        console.log('Hamburger menu initialized successfully');
    }
})();
