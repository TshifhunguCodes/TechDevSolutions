// 3D Particle Globe using Three.js

function initParticleGlobe() {
    const container = document.getElementById('particles-globe');
    if (!container) return;
    
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded. Globe cannot be initialized.');
        return;
    }
    
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
    const particles = 2000; // Reduced for performance
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
    
    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = (e.touches[0].clientY / window.innerHeight) * 2 - 1;
        }
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
    function handleResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    window.addEventListener('resize', handleResize);
    
    // Performance optimization for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        material.size = 0.03;
        glowMaterial.size = 0.05;
        glowMaterial.opacity = 0.2;
        material.opacity = 0.6;
        
        // Reduce particle count for mobile
        particleSystem.geometry.setDrawRange(0, 1000);
        glowSystem.geometry.setDrawRange(0, 1000);
    }
    
    // Start animation
    animate();
}

// Initialize globe when page loads and Three.js is available
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a page with the globe
    const globeContainer = document.getElementById('particles-globe');
    if (!globeContainer) return;
    
    // Load Three.js if not already loaded
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = initParticleGlobe;
        document.head.appendChild(script);
    } else {
        initParticleGlobe();
    }
});

// ======================================== //
// SERVICES SECTION - 4D INTERACTIVE EFFECTS //
// ======================================== //

(function() {
    'use strict';
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initServices4D);
    } else {
        initServices4D();
    }

    function initServices4D() {
        const servicesSection = document.querySelector('.services');
        if (!servicesSection) return;

        // Add 4D animation elements to the section
        add4DElements(servicesSection);

        // Initialize all interactive effects
        initMouseParallax(servicesSection);
        initQuantumField(servicesSection);
        initScrollEffects(servicesSection);
        initParticleInteraction(servicesSection);
        initPerformanceOptimization(servicesSection);
    }

    function add4DElements(section) {
        // Create Tesseract (Hypercube)
        const tesseract = document.createElement('div');
        tesseract.className = 'tesseract';
        for (let i = 1; i <= 8; i++) {
            const face = document.createElement('div');
            face.className = `tesseract-face tesseract-face-${i}`;
            tesseract.appendChild(face);
        }
        section.appendChild(tesseract);

        // Create Hypercube Matrix
        const hypercube = document.createElement('div');
        hypercube.className = 'hypercube';
        for (let i = 1; i <= 12; i++) {
            const line = document.createElement('div');
            line.className = `hypercube-line hypercube-line-${i}`;
            hypercube.appendChild(line);
        }
        section.appendChild(hypercube);

        // Create Quantum Particles
        for (let i = 1; i <= 15; i++) {
            const particle = document.createElement('div');
            particle.className = `quantum-particle particle-${i}`;
            section.appendChild(particle);
        }

        // Create Wormhole
        const wormhole = document.createElement('div');
        wormhole.className = 'wormhole';
        section.appendChild(wormhole);

        // Create Dimensional Rifts
        for (let i = 1; i <= 4; i++) {
            const rift = document.createElement('div');
            rift.className = `rift rift-${i}`;
            section.appendChild(rift);
        }

        // Create Energy Beams
        for (let i = 1; i <= 3; i++) {
            const beam = document.createElement('div');
            beam.className = `energy-beam beam-${i}`;
            section.appendChild(beam);
        }
    }

    function initMouseParallax(section) {
        let rafId = null;
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        });

        function updateParallax() {
            // Smooth interpolation
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            const tesseract = section.querySelector('.tesseract');
            const hypercube = section.querySelector('.hypercube');
            const particles = section.querySelectorAll('.quantum-particle');

            if (tesseract) {
                tesseract.style.transform = `translate(-50%, -50%) 
                    rotateX(${currentY * 30}deg) 
                    rotateY(${currentX * 30}deg) 
                    rotateZ(${currentX * currentY * 20}deg)`;
            }

            if (hypercube) {
                hypercube.style.transform = `
                    rotateX(${currentY * 20}deg) 
                    rotateY(${currentX * 20}deg) 
                    translate(${currentX * 20}px, ${currentY * 20}px)`;
            }

            particles.forEach((particle, index) => {
                const speed = (index % 5 + 1) * 0.3;
                particle.style.transform = `translate(
                    ${currentX * 30 * speed}px, 
                    ${currentY * 30 * speed}px
                ) scale(${1 + Math.abs(currentX * currentY) * 0.5})`;
            });

            rafId = null;
        }

        section.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });
    }

    function initQuantumField(section) {
        const particles = section.querySelectorAll('.quantum-particle');
        
        function quantumFluctuation() {
            particles.forEach((particle, index) => {
                // Random quantum state changes
                const randomX = (Math.random() - 0.5) * 60;
                const randomY = (Math.random() - 0.5) * 60;
                const randomScale = 0.5 + Math.random() * 1.5;
                const randomOpacity = 0.2 + Math.random() * 0.4;
                const randomDelay = Math.random() * 2;
                
                setTimeout(() => {
                    particle.style.transition = 'transform 3s ease-in-out, opacity 2s ease-in-out';
                    particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
                    particle.style.opacity = randomOpacity;
                    
                    // Quantum entanglement effect
                    if (Math.random() > 0.7) {
                        createEntanglementLink(particle, particles);
                    }
                }, randomDelay * 1000);
            });
            
            setTimeout(quantumFluctuation, 4000);
        }
        
        quantumFluctuation();
    }

    function createEntanglementLink(particle1, allParticles) {
        const section = document.querySelector('.services');
        const particle2 = allParticles[Math.floor(Math.random() * allParticles.length)];
        
        if (particle1 === particle2) return;

        const rect1 = particle1.getBoundingClientRect();
        const rect2 = particle2.getBoundingClientRect();
        const sectionRect = section.getBoundingClientRect();

        // Create SVG line for entanglement
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '5';
        svg.style.opacity = '0.2';

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', rect1.left + rect1.width/2 - sectionRect.left);
        line.setAttribute('y1', rect1.top + rect1.height/2 - sectionRect.top);
        line.setAttribute('x2', rect2.left + rect2.width/2 - sectionRect.left);
        line.setAttribute('y2', rect2.top + rect2.height/2 - sectionRect.top);
        line.setAttribute('stroke', '#6ee7b7');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '5,5');

        svg.appendChild(line);
        section.appendChild(svg);

        setTimeout(() => {
            svg.remove();
        }, 2000);
    }

    function initScrollEffects(section) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition + window.innerHeight > sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                
                const relativeScroll = (scrollPosition + window.innerHeight - sectionTop) / 
                                      (window.innerHeight + sectionHeight);
                const warpFactor = Math.sin(relativeScroll * Math.PI * 2) * 0.5;
                
                // Warp space based on scroll
                const tesseract = section.querySelector('.tesseract');
                const wormhole = section.querySelector('.wormhole');
                
                if (tesseract) {
                    tesseract.style.transform = `translate(-50%, -50%) 
                        scale(${1 + warpFactor * 0.2}) 
                        rotateX(${warpFactor * 90}deg) 
                        rotateY(${warpFactor * 90}deg)`;
                }
                
                if (wormhole) {
                    wormhole.style.transform = `rotate(${warpFactor * 180}deg) 
                        scale(${1 + warpFactor * 0.3})`;
                }
            }
        });
    }

    function initParticleInteraction(section) {
        const particles = section.querySelectorAll('.quantum-particle');
        
        particles.forEach(particle => {
            particle.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
                this.style.transform = 'scale(3)';
                this.style.opacity = '0.8';
                this.style.backgroundColor = '#ffffff';
                this.style.boxShadow = '0 0 40px #6ee7b7';
                
                // Create ripple effect
                createRippleEffect(this);
            });
            
            particle.addEventListener('mouseleave', function() {
                this.style.transition = 'all 1s ease';
                this.style.transform = '';
                this.style.opacity = '';
                this.style.backgroundColor = '';
                this.style.boxShadow = '';
            });
        });
    }

    function createRippleEffect(element) {
        const rect = element.getBoundingClientRect();
        const section = document.querySelector('.services');
        
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = (rect.left + rect.width/2) + 'px';
            ripple.style.top = (rect.top + rect.height/2) + 'px';
            ripple.style.width = '10px';
            ripple.style.height = '10px';
            ripple.style.borderRadius = '50%';
            ripple.style.border = '2px solid rgba(110, 231, 183, 0.5)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = `rippleExpand ${1 + i * 0.5}s ease-out forwards`;
            ripple.style.pointerEvents = 'none';
            ripple.style.zIndex = '20';
            
            section.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 3000);
        }
    }

    function initPerformanceOptimization(section) {
        // Add CSS animation for ripple if not exists
        if (!document.querySelector('#ripple-keyframes')) {
            const style = document.createElement('style');
            style.id = 'ripple-keyframes';
            style.textContent = `
                @keyframes rippleExpand {
                    0% {
                        width: 10px;
                        height: 10px;
                        opacity: 0.5;
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const animatedElements = entry.target.querySelectorAll(
                    '.tesseract, .hypercube, .quantum-particle, .wormhole, .rift, .energy-beam'
                );
                
                if (entry.isIntersecting) {
                    animatedElements.forEach(el => {
                        el.style.animationPlayState = 'running';
                    });
                } else {
                    animatedElements.forEach(el => {
                        el.style.animationPlayState = 'paused';
                    });
                }
            });
        }, { threshold: 0.1 });

        observer.observe(section);

        // Mobile performance optimization
        if ('ontouchstart' in window) {
            const style = document.createElement('style');
            style.textContent = `
                .services .tesseract,
                .services .hypercube,
                .services .quantum-particle {
                    animation-duration: 60s !important;
                    opacity: 0.15 !important;
                }
                
                .services .quantum-particle {
                    animation: quantumFloat 30s infinite ease-in-out !important;
                }
                
                .services .rift {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
})();


// ======================================== //
// FOOTER - 4D INTERACTIVE EFFECTS //
// ======================================== //

(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFooter4D);
    } else {
        initFooter4D();
    }

    function initFooter4D() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        // Add 4D elements
        add4DElements(footer);
        
        // Initialize effects
        initMouseParallax(footer);
        initQuantumEnergy(footer);
        initTimeWarp(footer);
        initParticleField(footer);
        initPerformanceOptimization(footer);
    }

    function add4DElements(footer) {
        // Add 4D Cubes
        for (let i = 1; i <= 4; i++) {
            const cube = document.createElement('div');
            cube.className = `cube-4d cube-${i}`;
            footer.appendChild(cube);
        }

        // Add Galaxies
        for (let i = 1; i <= 2; i++) {
            const galaxy = document.createElement('div');
            galaxy.className = `galaxy galaxy-${i}`;
            footer.appendChild(galaxy);
        }

        // Add Energy Particles
        for (let i = 1; i <= 20; i++) {
            const particle = document.createElement('div');
            particle.className = `energy-particle particle-${i}`;
            footer.appendChild(particle);
        }

        // Add Time Ripples
        for (let i = 1; i <= 4; i++) {
            const ripple = document.createElement('div');
            ripple.className = `time-ripple ripple-${i}`;
            footer.appendChild(ripple);
        }

        // Add Light Beams
        for (let i = 1; i <= 3; i++) {
            const beam = document.createElement('div');
            beam.className = `light-beam beam-${i}`;
            footer.appendChild(beam);
        }
    }

    function initMouseParallax(footer) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let rafId = null;

        footer.addEventListener('mousemove', (e) => {
            const rect = footer.getBoundingClientRect();
            mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            
            if (!rafId) {
                rafId = requestAnimationFrame(updateParallax);
            }
        });

        function updateParallax() {
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            const cubes = footer.querySelectorAll('.cube-4d');
            const galaxies = footer.querySelectorAll('.galaxy');
            const particles = footer.querySelectorAll('.energy-particle');
            const columns = footer.querySelectorAll('.footer-column');

            cubes.forEach((cube, index) => {
                const speed = (index + 1) * 0.3;
                cube.style.transform = `translateX(${currentX * 30 * speed}px) 
                                       translateY(${currentY * 30 * speed}px) 
                                       rotateX(${currentY * 20}deg) 
                                       rotateY(${currentX * 20}deg)`;
            });

            galaxies.forEach((galaxy, index) => {
                const speed = (index + 1) * 0.2;
                galaxy.style.transform = `translateX(${currentX * 20 * speed}px) 
                                         translateY(${currentY * 20 * speed}px)`;
            });

            particles.forEach((particle, index) => {
                const speed = (index % 5 + 1) * 0.1;
                particle.style.transform = `translateX(${currentX * 50 * speed}px) 
                                          translateY(${currentY * 50 * speed}px)`;
            });

            columns.forEach((column, index) => {
                const speed = (index + 1) * 0.1;
                column.style.transform = `translateX(${currentX * 5 * speed}px) 
                                         translateY(${currentY * 5 * speed}px) 
                                         rotateX(${currentY * 1}deg) 
                                         rotateY(${currentX * 1}deg)`;
            });

            rafId = null;
        }

        footer.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });
    }

    function initQuantumEnergy(footer) {
        const particles = footer.querySelectorAll('.energy-particle');
        
        function quantumFluctuation() {
            particles.forEach((particle, index) => {
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                const randomScale = 0.5 + Math.random() * 2;
                const randomOpacity = 0.1 + Math.random() * 0.4;
                const randomDelay = Math.random() * 2;
                
                setTimeout(() => {
                    particle.style.transition = 'transform 4s ease-in-out, opacity 3s ease-in-out';
                    particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
                    particle.style.opacity = randomOpacity;
                    
                    // Create energy link between particles
                    if (Math.random() > 0.8) {
                        createEnergyLink(particle, particles);
                    }
                }, randomDelay * 1000);
            });
            
            setTimeout(quantumFluctuation, 5000);
        }
        
        quantumFluctuation();
    }

    function createEnergyLink(particle1, allParticles) {
        const footer = document.querySelector('footer');
        const particle2 = allParticles[Math.floor(Math.random() * allParticles.length)];
        
        if (particle1 === particle2) return;

        const rect1 = particle1.getBoundingClientRect();
        const rect2 = particle2.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();

        const link = document.createElement('div');
        link.style.position = 'absolute';
        link.style.left = '0';
        link.style.top = '0';
        link.style.width = '100%';
        link.style.height = '100%';
        link.style.pointerEvents = 'none';
        link.style.zIndex = '5';
        link.style.opacity = '0.2';
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.width = '100%';
        svg.style.height = '100%';
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute('x1', rect1.left + rect1.width/2 - footerRect.left);
        line.setAttribute('y1', rect1.top + rect1.height/2 - footerRect.top);
        line.setAttribute('x2', rect2.left + rect2.width/2 - footerRect.left);
        line.setAttribute('y2', rect2.top + rect2.height/2 - footerRect.top);
        line.setAttribute('stroke', '#6ee7b7');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(line);
        link.appendChild(svg);
        footer.appendChild(link);

        setTimeout(() => {
            link.remove();
        }, 2000);
    }

    function initTimeWarp(footer) {
        const ripples = footer.querySelectorAll('.time-ripple');
        
        setInterval(() => {
            ripples.forEach((ripple, index) => {
                setTimeout(() => {
                    ripple.style.animation = 'none';
                    ripple.offsetHeight;
                    ripple.style.animation = 'timeRipple 8s ease-out infinite';
                }, index * 2000);
            });
        }, 8000);
    }

    function initParticleField(footer) {
        const particles = footer.querySelectorAll('.energy-particle');
        
        particles.forEach(particle => {
            particle.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s ease';
                this.style.transform = 'scale(4)';
                this.style.opacity = '0.8';
                this.style.backgroundColor = '#ffffff';
                this.style.boxShadow = '0 0 40px #6ee7b7';
                
                // Create energy burst
                createEnergyBurst(this);
            });
            
            particle.addEventListener('mouseleave', function() {
                this.style.transition = 'all 1s ease';
                this.style.transform = '';
                this.style.opacity = '';
                this.style.backgroundColor = '';
                this.style.boxShadow = '';
            });
        });
    }

    function createEnergyBurst(element) {
        const footer = document.querySelector('footer');
        const rect = element.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        
        for (let i = 0; i < 8; i++) {
            const burst = document.createElement('div');
            burst.style.position = 'absolute';
            burst.style.left = (rect.left + rect.width/2 - footerRect.left) + 'px';
            burst.style.top = (rect.top + rect.height/2 - footerRect.top) + 'px';
            burst.style.width = '20px';
            burst.style.height = '20px';
            burst.style.borderRadius = '50%';
            burst.style.background = 'radial-gradient(circle, #6ee7b7, transparent)';
            burst.style.transform = `rotate(${i * 45}deg) translateX(30px)`;
            burst.style.animation = `burstFly 1s ease-out forwards`;
            burst.style.pointerEvents = 'none';
            burst.style.zIndex = '20';
            
            footer.appendChild(burst);
            
            setTimeout(() => {
                burst.remove();
            }, 1000);
        }
    }

    function initPerformanceOptimization(footer) {
        // Add burst animation keyframes
        if (!document.querySelector('#burst-keyframes')) {
            const style = document.createElement('style');
            style.id = 'burst-keyframes';
            style.textContent = `
                @keyframes burstFly {
                    0% {
                        opacity: 1;
                        transform: rotate(var(--rotation)) translateX(30px) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: rotate(var(--rotation)) translateX(100px) scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const elements = entry.target.querySelectorAll(
                    '.cube-4d, .galaxy, .energy-particle, .time-ripple, .light-beam'
                );
                
                if (entry.isIntersecting) {
                    elements.forEach(el => {
                        el.style.animationPlayState = 'running';
                    });
                } else {
                    elements.forEach(el => {
                        el.style.animationPlayState = 'paused';
                    });
                }
            });
        }, { threshold: 0.1 });

        observer.observe(footer);

        // Mobile optimization
        if ('ontouchstart' in window) {
            const style = document.createElement('style');
            style.textContent = `
                footer .cube-4d,
                footer .galaxy,
                footer .energy-particle {
                    animation-duration: 40s !important;
                    opacity: 0.1 !important;
                }
                
                footer .time-ripple,
                footer .light-beam {
                    display: none;
                }
            `;
            document.head.appendChild(style);
        }
    }
})();