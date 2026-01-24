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

                // Check if there's a matching nav link for this section
                const matchingLinks = Array.from(navLinks).filter(
                    link => link.getAttribute('href') === `#${sectionId}`
                );

                // Only update aria-current if a matching link exists
                if (matchingLinks.length > 0) {
                    // Remove aria-current from all links
                    navLinks.forEach(link => {
                        link.removeAttribute('aria-current');
                    });

                    // Add aria-current to matching links
                    matchingLinks.forEach(link => {
                        link.setAttribute('aria-current', 'page');
                    });
                }
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
   ROI Calculator
   ======================================== */

// Global chart instance for ROI Calculator
let globalLossChart = null;

/**
 * Initialize ROI Calculator functionality
 * Handles slider interactions, real-time calculations, and chart updates
 */
function initCalculator() {
    console.log('Initializing ROI Calculator...');
    
    // Verify Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded! Calculator will not work.');
        return;
    }
    
    const consultationInput = document.getElementById('consultationValue');
    const attendedPatientsInput = document.getElementById('attendedPatients');
    const lostPatientsInput = document.getElementById('lostPatients');

    // Early return if calculator section doesn't exist
    if (!consultationInput || !lostPatientsInput || !attendedPatientsInput) {
        console.error('Calculator elements not found');
        return;
    }

    const valDisplay = document.getElementById('valDisplay');
    const attendedDisplay = document.getElementById('attendedDisplay');
    const lostDisplay = document.getElementById('lostDisplay');
    const monthlyLossText = document.getElementById('monthlyLossText');
    const chartCanvas = document.getElementById('lossChart');

    if (!chartCanvas) {
        console.error('Chart canvas not found');
        return;
    }

    console.log('Calculator elements found');

    const ctx = chartCanvas.getContext('2d');

    // Validar que el contexto se obtuvo correctamente
    if (!ctx) {
        console.error('Failed to get 2D context from canvas');
        return;
    }

    // Read CSS variables for consistent theming
    const computedStyle = getComputedStyle(document.documentElement);
    const primaryColor = computedStyle.getPropertyValue('--primary-color').trim();
    const errorColor = computedStyle.getPropertyValue('--error-color').trim();
    const backgroundGray = computedStyle.getPropertyValue('--background-gray').trim();

    // Initialize Chart.js with try-catch
    try {
        globalLossChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ingresos Actuales', 'Potencial Real'],
                datasets: [{
                    label: 'Proyección Mensual (COP)',
                    data: [0, 0],
                    backgroundColor: [backgroundGray, errorColor],
                    borderRadius: 8,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const formatter = new Intl.NumberFormat('es-CO', {
                                    style: 'currency',
                                    currency: 'COP',
                                    maximumFractionDigits: 0
                                });
                                return formatter.format(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
        console.log('Chart initialized successfully');
    } catch (error) {
        console.error('Chart initialization failed:', error);

        // Mostrar mensaje de error visual al usuario
        const chartCanvas = document.getElementById('lossChart');
        if (chartCanvas) {
            const errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 2rem;
                text-align: center;
                color: var(--error-color);
                font-size: 0.9rem;
            `;
            errorMsg.textContent = '⚠️ No se pudo cargar el gráfico. Por favor recarga la página.';
            chartCanvas.parentElement.appendChild(errorMsg);
            chartCanvas.style.display = 'none';
        }
        return;
    }

    /**
     * Update calculator values and chart
     */
    function updateCalc() {
        const price = parseInt(consultationInput.value);
        const lostPatients = parseInt(lostPatientsInput.value);
        const attendedPatients = parseInt(attendedPatientsInput.value);

        console.log('Updating calculator...', { price, attendedPatients, lostPatients });

        // Format currency for Colombian Pesos
        const formatter = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        });

        // Update display values
        valDisplay.textContent = formatter.format(price);
        lostDisplay.textContent = lostPatients + ' paciente' + (lostPatients > 1 ? 's' : '');
        attendedDisplay.textContent = attendedPatients + ' paciente' + (attendedPatients > 1 ? 's' : '');

        // Calculate revenues based on real data
        const currentRevenue = attendedPatients * price * 4;        // Ingresos actuales reales
        const potentialRevenue = (attendedPatients + lostPatients) * price * 4;  // Potencial real
        const monthlyLoss = lostPatients * price * 4;               // Pérdida mensual

        // Update text display (monthly loss remains the same)
        monthlyLossText.textContent = formatter.format(monthlyLoss);

        // Update chart data with real values
        if (globalLossChart) {
            globalLossChart.data.datasets[0].data = [currentRevenue, potentialRevenue];
            globalLossChart.update('active'); // 'active' for reliable updates in Chart.js 4.x
            console.log('Chart updated');
        }

        // Update slider background gradient for visual feedback
        updateSliderBackground(consultationInput, 50000, 300000);
        updateSliderBackground(attendedPatientsInput, 10, 100);
        updateSliderBackground(lostPatientsInput, 1, 20);

        // Update ARIA attributes for accessibility
        consultationInput.setAttribute('aria-valuenow', price);
        attendedPatientsInput.setAttribute('aria-valuenow', attendedPatients);
        lostPatientsInput.setAttribute('aria-valuenow', lostPatients);
    }

    /**
     * Update slider background gradient based on value
     * @param {HTMLInputElement} slider - The range input element
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     */
    function updateSliderBackground(slider, min, max) {
        const value = parseInt(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    }

    // Event listeners for real-time updates
    consultationInput.addEventListener('input', () => {
        console.log('slider changed');
        updateCalc();
    });
    attendedPatientsInput.addEventListener('input', () => {
        console.log('slider changed');
        updateCalc();
    });
    lostPatientsInput.addEventListener('input', () => {
        console.log('slider changed');
        updateCalc();
    });

    // Initial calculation on page load
    updateCalc();

    console.log('ROI Calculator fully initialized');
}

/* ========================================
   DOMContentLoaded - Initialize All
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting initialization');
    
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    updateActiveNavLink();
    initConsultationBooking();
    
    // Initialize calculator with Chart.js verification
    if (typeof Chart !== 'undefined') {
        console.log('Chart.js detected, initializing calculator');
        initCalculator();
    } else {
        console.warn('Chart.js not loaded yet, retrying...');

        // Retry con backoff exponencial
        let retryCount = 0;
        const maxRetries = 3;

        const retryInit = () => {
            retryCount++;
            if (typeof Chart !== 'undefined') {
                console.log(`Chart.js loaded on retry ${retryCount}, initializing calculator`);
                initCalculator();
            } else if (retryCount < maxRetries) {
                console.warn(`Retry ${retryCount}/${maxRetries} failed, trying again...`);
                setTimeout(retryInit, 500 * retryCount); // Backoff: 500ms, 1000ms, 1500ms
            } else {
                console.error('Chart.js failed to load after multiple retries');
            }
        };

        setTimeout(retryInit, 500);
    }
    
    initContactForm();
    initBackToTop();

    console.log('Outrun AI - Website initialized');
});
