'use strict';

/**
 * Outrun AI - Main JavaScript File
 * Interactive functionality foundation
 */

/* ========================================
   Consultation Booking Configuration
   ======================================== */

const WHATSAPP_NUMBER = '573052064654'
const WHATSAPP_MESSAGE = 'Hola, me gustaría reservar una consultoría personalizada con Outrun AI';
const BOOKING_URL = '#contacto';

/* ========================================
   Utility Functions
   ======================================== */

/**
 * Debounce function for scroll/resize event optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance-critical events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ========================================
   Form Validation Helpers
   ======================================== */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate Colombian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Colombian phone format
 */
function validatePhone(phone) {
    // Colombian phone formats: +57 XXX XXX XXXX, 3XX XXX XXXX, etc.
    const phoneRegex = /^(\+57)?[\s.-]?3[0-9]{2}[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Display success/error messages
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - Message to display
 */
function showMessage(type, message) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.setAttribute('role', 'alert');
    
    // Insert at top of main content
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(messageEl, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
}

/* ========================================
   Lazy Loading Images
   ======================================== */

/**
 * Initialize lazy loading for images with data-src attribute
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/* ========================================
   Mobile Menu Toggle
   ======================================== */

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('is-open');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('is-open');
                document.body.classList.remove('menu-open');
            }
        });
        
        // Close menu when a nav link is clicked
        const mobileNavLinks = mobileNav.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('is-open');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

/* ========================================
   Smooth Scroll Enhancement
   ======================================== */

/**
 * Initialize smooth scroll for anchor links
 */
function initSmoothScroll() {
    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

/* ========================================
   Active Navigation State
   ======================================== */

/**
 * Update active navigation link based on scroll position
 * Uses IntersectionObserver for performance
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                // Remove aria-current from all links
                navLinks.forEach(link => {
                    link.removeAttribute('aria-current');
                });
                
                // Add aria-current to matching links
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ========================================
   Error Handling
   ======================================== */

window.addEventListener('error', (e) => {
    console.error('Error:', e.message, 'at', e.filename, ':', e.lineno);
});

/* ========================================
   Performance Monitoring
   ======================================== */

window.addEventListener('load', () => {
    console.log('Page loaded in:', Math.round(performance.now()), 'ms');
});

/* ========================================
   Analytics Placeholder
   ======================================== */

/*
 * Google Analytics or tracking code will be added here
 * Example:
 * gtag('config', 'GA_MEASUREMENT_ID');
 */

/* ========================================
   Consultation Booking
   ======================================== */

/**
 * Initialize consultation booking functionality
 * Handles WhatsApp and primary booking button actions
 */
function initConsultationBooking() {
    const btnWhatsApp = document.getElementById('btn-whatsapp');
    const btnReservar = document.getElementById('btn-reservar');
    
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', function(e) {
            e.preventDefault();
            const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            console.log('WhatsApp booking initiated');
        });
    }
    
    if (btnReservar) {
        btnReservar.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = BOOKING_URL;
            console.log('Primary booking initiated');
        });
    }
    
    // Scroll-triggered animation for pricing card
    const pricingCard = document.querySelector('.pricing-card');
    if (pricingCard && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        pricingCard.style.opacity = '0';
        pricingCard.style.transform = 'translateY(30px)';
        pricingCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(pricingCard);
    }
}

/* ========================================
   Contact Form Validation & Submission
   ======================================== */

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('.contact-submit');
    const formMessage = form.querySelector('.form-message');
    
    // Field configurations with validation rules and error messages
    const fields = {
        nombre: {
            validate: (value) => value.trim().length >= 2,
            errorMessage: 'Por favor ingresa tu nombre completo'
        },
        email: {
            validate: (value) => validateEmail(value),
            errorMessage: 'Por favor ingresa un correo electrónico válido'
        },
        telefono: {
            validate: (value) => validatePhone(value),
            errorMessage: 'Por favor ingresa un número de teléfono válido (ej: 300 123 4567)'
        },
        mensaje: {
            validate: (value) => value.trim().length >= 10,
            errorMessage: 'Por favor ingresa un mensaje (mínimo 10 caracteres)'
        }
    };

    // Set field error state
    function setFieldError(fieldName, hasError) {
        const input = form.querySelector(`#${fieldName}`);
        const formGroup = input.closest('.form-group');
        const errorSpan = form.querySelector(`#${fieldName}-error`);
        
        if (hasError) {
            formGroup.classList.add('error');
            input.setAttribute('aria-invalid', 'true');
            errorSpan.textContent = fields[fieldName].errorMessage;
        } else {
            formGroup.classList.remove('error');
            input.setAttribute('aria-invalid', 'false');
            errorSpan.textContent = '';
        }
    }

    // Validate single field
    function validateField(fieldName) {
        const input = form.querySelector(`#${fieldName}`);
        const isValid = fields[fieldName].validate(input.value);
        setFieldError(fieldName, !isValid);
        return isValid;
    }

    // Validate all fields
    function validateAllFields() {
        let isFormValid = true;
        Object.keys(fields).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    // Show form message
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type} show`;
        
        if (type === 'success') {
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }
    }

    // Hide form message
    function hideFormMessage() {
        formMessage.classList.remove('show');
    }

    // Add blur validation to each field
    Object.keys(fields).forEach(fieldName => {
        const input = form.querySelector(`#${fieldName}`);
        
        input.addEventListener('blur', () => {
            validateField(fieldName);
        });
        
        input.addEventListener('input', () => {
            const formGroup = input.closest('.form-group');
            if (formGroup.classList.contains('error')) {
                validateField(fieldName);
            }
            hideFormMessage();
        });
    });

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Check honeypot
        const honeypot = form.querySelector('#website');
        if (honeypot && honeypot.value) {
            return; // Bot detected
        }

        // Validate all fields
        if (!validateAllFields()) {
            showFormMessage('Por favor corrige los errores en el formulario.', 'error');
            return;
        }

        // Disable submit button
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        hideFormMessage();

        try {
            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showFormMessage('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
                form.reset();
                // Clear any lingering error states
                Object.keys(fields).forEach(fieldName => {
                    setFieldError(fieldName, false);
                });
            } else {
                showFormMessage(result.message || 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showFormMessage('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/* ========================================
   DOMContentLoaded - Initialize All
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initLazyLoading();
    initMobileMenu();
    initSmoothScroll();
    updateActiveNavLink();
    initConsultationBooking();
    initContactForm();
    
    console.log('Outrun AI - Website initialized');
});
