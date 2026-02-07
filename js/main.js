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

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
        mobileMenuBtn.innerHTML = isVisible 
            ? '<i class="fas fa-bars"></i>' 
            : '<i class="fas fa-times"></i>';
    });
}

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
    
    // Video fallback for mobile
    const heroVideo = document.querySelector('.hero-video');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile && heroVideo) {
        heroVideo.style.display = 'none';
        const videoContainer = document.querySelector('.hero-video-container');
        if (videoContainer) {
            videoContainer.style.background = 'url("https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80") center/cover no-repeat';
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