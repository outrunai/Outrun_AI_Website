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
   Testimonials Carousel (Mobile)
   ======================================== */

function initTestimonialsCarousel() {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;

    let currentIndex = 0;
    let isCarouselMode = false;
    let prevBtn = null;
    let nextBtn = null;
    let dotsContainer = null;

    // Touch event variables for swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    // Media query for responsive detection
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)');

    function handleSwipe() {
        const swipeThreshold = 50; // minimum 50px to consider swipe
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                showNext(); // swipe left = next
            } else {
                showPrevious(); // swipe right = previous
            }
        }
    }

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchEndX = touchStartX;
        isDragging = true;
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        touchEndX = e.changedTouches[0].screenX;
        // Prevent scroll during horizontal swipe
        if (Math.abs(touchStartX - touchEndX) > 10) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        handleSwipe();
        touchStartX = 0;
        touchEndX = 0;
    }

    function createDots() {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'carousel-dots';

        cards.forEach((card, index) => {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Ir al testimonio ${index + 1}`);
            dot.addEventListener('click', () => showSlide(index));
            dotsContainer.appendChild(dot);
        });

        grid.parentElement.appendChild(dotsContainer);
    }

    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function enableCarousel() {
        if (isCarouselMode) return;
        isCarouselMode = true;

        grid.classList.add('testimonials-carousel');
        grid.setAttribute('aria-live', 'polite');
        grid.setAttribute('aria-label', 'Carrusel de testimonios');

        cards.forEach((card, index) => {
            card.classList.toggle('active', index === 0);
            card.setAttribute('aria-hidden', index !== 0);
        });

        prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn-prev';
        prevBtn.innerHTML = '&#8249;';
        prevBtn.setAttribute('aria-label', 'Testimonio anterior');
        prevBtn.addEventListener('click', showPrevious);

        nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn-next';
        nextBtn.innerHTML = '&#8250;';
        nextBtn.setAttribute('aria-label', 'Siguiente testimonio');
        nextBtn.addEventListener('click', showNext);

        grid.parentElement.style.position = 'relative';
        grid.parentElement.appendChild(prevBtn);
        grid.parentElement.appendChild(nextBtn);

        // Add touch event listeners for swipe support
        grid.addEventListener('touchstart', handleTouchStart, { passive: true });
        grid.addEventListener('touchmove', handleTouchMove, { passive: false });
        grid.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Create dot indicators
        createDots();

        document.addEventListener('keydown', handleKeyNavigation);

        currentIndex = 0;
    }

    function disableCarousel() {
        if (!isCarouselMode) return;
        isCarouselMode = false;

        grid.classList.remove('testimonials-carousel');
        grid.removeAttribute('aria-live');

        cards.forEach(card => {
            card.classList.remove('active');
            card.removeAttribute('aria-hidden');
        });

        if (prevBtn) {
            prevBtn.remove();
            prevBtn = null;
        }
        if (nextBtn) {
            nextBtn.remove();
            nextBtn = null;
        }

        // Remove touch event listeners
        grid.removeEventListener('touchstart', handleTouchStart);
        grid.removeEventListener('touchmove', handleTouchMove);
        grid.removeEventListener('touchend', handleTouchEnd);

        // Remove dots container
        if (dotsContainer) {
            dotsContainer.remove();
            dotsContainer = null;
        }

        document.removeEventListener('keydown', handleKeyNavigation);
    }

    function showSlide(index) {
        cards.forEach((card, i) => {
            const isActive = i === index;
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-hidden', !isActive);
        });
        currentIndex = index;
        updateDots();
    }

    function showNext() {
        const nextIndex = (currentIndex + 1) % cards.length;
        showSlide(nextIndex);
    }

    function showPrevious() {
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        showSlide(prevIndex);
    }

    function handleKeyNavigation(e) {
        if (!isCarouselMode) return;

        const testimoniosSection = document.getElementById('testimonios');
        const rect = testimoniosSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isVisible) return;

        if (e.key === 'ArrowLeft') {
            showPrevious();
        } else if (e.key === 'ArrowRight') {
            showNext();
        }
    }

    function checkViewport() {
        const isMobile = mobileMediaQuery.matches;
        if (isMobile && !isCarouselMode) {
            enableCarousel();
        } else if (!isMobile && isCarouselMode) {
            disableCarousel();
        }
    }

    checkViewport();

    // Use matchMedia listener for orientation changes
    mobileMediaQuery.addEventListener('change', checkViewport);

    // Fallback resize handler with debounce
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(checkViewport, 250);
    });
}

/* ========================================
   Back to Top Button
   ======================================== */

/**
 * Initialize back to top button functionality
 * Creates a floating button that appears when user scrolls down
 */
function initBackToTop() {
    // Create button element
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
        <span class="visually-hidden">Volver arriba</span>
    `;
    backToTopBtn.setAttribute('aria-label', 'Volver arriba');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: var(--primary-color);
        color: var(--background-light);
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease, background 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    const toggleBackToTop = throttle(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        const showThreshold = 400;
        
        if (scrollY > showThreshold) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    }, 100);
    
    window.addEventListener('scroll', toggleBackToTop);
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-3px)';
        backToTopBtn.style.boxShadow = '0 6px 16px rgba(0, 102, 255, 0.4)';
    });
    
    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
        backToTopBtn.style.boxShadow = '0 4px 12px rgba(0, 102, 255, 0.3)';
    });
}

/* ========================================
   DOMContentLoaded - Initialize All
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    updateActiveNavLink();
    initConsultationBooking();
    initContactForm();
    initTestimonialsCarousel();
    initBackToTop();
    
    console.log('Outrun AI - Website initialized');
});
