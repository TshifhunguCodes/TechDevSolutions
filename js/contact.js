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
            source.src = 'assets/videos/contact-background.mp4';
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

// Remove your old initialization and replace with this:

const EMAILJS_PUBLIC_KEY = 'QGPyj8w--XmYGtoy9';
const EMAILJS_SERVICE_ID = 'service_79qykug';
const EMAILJS_TEMPLATE_ID = 'template_8t8ehrp';

// Make sure EmailJS is loaded BEFORE initializing
window.addEventListener('load', function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log("EmailJS initialized with key:", EMAILJS_PUBLIC_KEY);
    } else {
        console.error("EmailJS not loaded - check if script is included");
    }
});

// Initialize EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY
        });
        console.log("EmailJS initialized successfully");
    } else {
        console.error("EmailJS not loaded - make sure to include the EmailJS script");
    }
})();

// Add CSS for the new dialogs
const dialogStyles = `
    .custom-dialog {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }
    
    .dialog-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(8px);
    }
    
    .dialog-container {
        position: relative;
        z-index: 10000;
        animation: dialogSlideIn 0.3s ease-out;
    }
    
    @keyframes dialogSlideIn {
        from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes dialogShake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .custom-dialog-success .dialog-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        border: 1px solid rgba(46, 213, 115, 0.3);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(46, 213, 115, 0.1);
    }
    
    .custom-dialog-error .dialog-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        border: 1px solid rgba(255, 71, 87, 0.3);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 71, 87, 0.1);
        animation: dialogShake 0.5s ease-out;
    }
    
    .custom-dialog-loading .dialog-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dialog-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        border-radius: 20px;
        padding: 40px;
        min-width: 320px;
        max-width: 450px;
        text-align: center;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dialog-icon-wrapper {
        margin-bottom: 20px;
    }
    
    .dialog-icon {
        width: 60px;
        height: 60px;
        stroke-width: 1.5;
    }
    
    .custom-dialog-success .dialog-icon {
        color: #2ed573;
        filter: drop-shadow(0 0 10px rgba(46, 213, 115, 0.5));
    }
    
    .custom-dialog-error .dialog-icon {
        color: #ff4757;
        filter: drop-shadow(0 0 10px rgba(255, 71, 87, 0.5));
    }
    
    .custom-dialog-loading .dialog-icon {
        color: #ffffff;
    }
    
    .dialog-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .dialog-title {
        color: #ffffff;
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 15px;
        letter-spacing: -0.5px;
    }
    
    .dialog-message {
        color: rgba(255, 255, 255, 0.8);
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 30px;
    }
    
    .dialog-button {
        background: linear-gradient(135deg, #2ed573 0%, #26c065 100%);
        color: #ffffff;
        border: none;
        padding: 12px 32px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .custom-dialog-error .dialog-button {
        background: linear-gradient(135deg, #ff4757 0%, #e84118 100%);
    }
    
    .custom-dialog-loading .dialog-button {
        background: rgba(255, 255, 255, 0.1);
        cursor: not-allowed;
    }
    
    .dialog-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }
    
    .dialog-button:active {
        transform: translateY(0);
    }
    
    .custom-dialog-success .dialog-button:hover {
        box-shadow: 0 5px 20px rgba(46, 213, 115, 0.3);
    }
    
    .custom-dialog-error .dialog-button:hover {
        box-shadow: 0 5px 20px rgba(255, 71, 87, 0.3);
    }
    
    @media (max-width: 480px) {
        .dialog-content {
            padding: 30px 25px;
            min-width: 280px;
            margin: 20px;
        }
        
        .dialog-title {
            font-size: 24px;
        }
        
        .dialog-message {
            font-size: 14px;
        }
        
        .dialog-icon {
            width: 50px;
            height: 50px;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = dialogStyles;
document.head.appendChild(styleSheet);

// Create and show custom dialog
function showDialog(type, message, details = null) {
    // Remove any existing dialog
    const existingDialog = document.querySelector('.custom-dialog');
    if (existingDialog) {
        existingDialog.remove();
    }
    
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = `custom-dialog custom-dialog-${type}`;
    
    // Set icon based on type
    let icon = '';
    if (type === 'success') {
        icon = `<svg class="dialog-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
    } else if (type === 'error') {
        icon = `<svg class="dialog-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke="currentColor"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor"/>
                </svg>`;
    } else if (type === 'loading') {
        icon = `<svg class="dialog-icon dialog-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-dasharray="60" stroke-dashoffset="20"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"/>
                </svg>`;
    }
    
    // Additional details for error messages
    let detailsHtml = '';
    if (details && type === 'error') {
        detailsHtml = `<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">${details}</p>
                       </div>`;
    }
    
    dialog.innerHTML = `
        <div class="dialog-overlay"></div>
        <div class="dialog-container">
            <div class="dialog-content">
                <div class="dialog-icon-wrapper">${icon}</div>
                <h3 class="dialog-title">${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Sending...'}</h3>
                <p class="dialog-message">${message}</p>
                ${detailsHtml}
                <button class="dialog-button" onclick="this.closest('.custom-dialog').remove()">
                    ${type === 'loading' ? 'Please wait...' : type === 'success' ? 'Continue' : 'Try Again'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Auto remove success dialog after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            const dialogToRemove = document.querySelector('.custom-dialog');
            if (dialogToRemove) dialogToRemove.remove();
        }, 3000);
    }
    
    // Close when clicking overlay (but not for loading)
    if (type !== 'loading') {
        const overlay = dialog.querySelector('.dialog-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => dialog.remove());
        }
    }
}

// Send email function
async function sendMail(event) {
    // Prevent default form submission
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    console.log("sendMail triggered - Starting form submission");
    
    // Get form data with null checks
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const serviceInput = document.getElementById('service');
    
    // Check if all required elements exist
    if (!nameInput || !emailInput || !messageInput) {
        console.error("Form elements not found");
        showDialog('error', 'Form Error', 'Please refresh the page and try again.');
        return false;
    }
    
    // CORRECTED: Use the actual field names from your form
    let params = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput ? phoneInput.value.trim() : 'Not provided',
        message: messageInput.value.trim(),
        service: serviceInput ? serviceInput.value : 'Not specified'
    };
    
    console.log("Form data collected:", params);
    
    // Validate required fields
    if (!params.name || !params.email || !params.message) {
        showDialog('error', 'Missing Information', 'Please fill in all required fields (Name, Email, and Message).');
        return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(params.email)) {
        showDialog('error', 'Invalid Email', 'Please enter a valid email address (e.g., name@example.com).');
        return false;
    }
    
    // Check if message is too short
    if (params.message.length < 10) {
        showDialog('error', 'Message Too Short', 'Please provide more details about your project (at least 10 characters).');
        return false;
    }
    
    // Show loading dialog
    showDialog('loading', 'Sending your message...', null);
    
    try {
        // Check if emailjs is available
        if (typeof emailjs === 'undefined') {
            throw new Error('EmailJS library not loaded. Please check your internet connection.');
        }
        
        console.log("Attempting to send email with params:", params);
        
        // Send email
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
        
        console.log('SUCCESS! Full response:', response);
        
        // Remove loading dialog
        const loadingDialog = document.querySelector('.custom-dialog');
        if (loadingDialog) loadingDialog.remove();
        
        // Show success dialog with nice message
        showDialog('success', `Thank you ${params.name}! ✨\n\nYour message has been sent successfully. We'll get back to you within 24 hours.`);
        
        // Reset form
        const form = document.getElementById('contact-form');
        if (form) {
            form.reset();
        }
        
        return true;
        
    } catch (error) {
        console.error('FAILED... Error details:', error);
        
        // Remove loading dialog
        const loadingDialog = document.querySelector('.custom-dialog');
        if (loadingDialog) loadingDialog.remove();
        
        // Detailed error message based on error type
        let errorTitle = 'Failed to Send';
        let errorMessage = '';
        let errorDetails = '';
        
        if (error.status === 0 || error.message === 'Failed to fetch') {
            errorTitle = 'Network Error';
            errorMessage = 'Unable to connect to email service.';
            errorDetails = 'Please check your internet connection and try again.';
        } else if (error.text) {
            errorTitle = 'Server Error';
            errorMessage = 'The email service encountered an issue.';
            errorDetails = error.text;
        } else if (error.message) {
            if (error.message.includes('template')) {
                errorTitle = 'Configuration Error';
                errorMessage = 'Email template configuration issue.';
                errorDetails = 'Please contact support with this error.';
            } else if (error.message.includes('service')) {
                errorTitle = 'Service Error';
                errorMessage = 'Email service configuration error.';
                errorDetails = 'Please contact support.';
            } else {
                errorTitle = 'Submission Failed';
                errorMessage = 'Something went wrong.';
                errorDetails = error.message;
            }
        } else {
            errorTitle = 'Submission Failed';
            errorMessage = 'Unable to send your message.';
            errorDetails = 'Please try again later or contact support directly.';
        }
        
        showDialog('error', errorMessage, errorDetails);
        return false;
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) {
        console.error("Contact form not found with ID 'contact-form'");
        return;
    }

    if (form.dataset.listenerAdded === 'true') {
        return;
    }

    form.dataset.listenerAdded = 'true';
    form.addEventListener('submit', sendMail);
    console.log("Form submit handler attached successfully");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}
