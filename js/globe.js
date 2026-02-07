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