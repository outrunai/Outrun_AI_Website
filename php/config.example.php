<?php
/**
 * Example Configuration File for Outrun AI Contact Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to 'config.php' in the same directory
 * 2. Replace all placeholder values with your actual credentials
 * 3. Never commit config.php to version control
 * 
 * GMAIL APP PASSWORD SETUP:
 * 1. Go to Google Account → Security
 * 2. Enable 2-Step Verification if not already enabled
 * 3. Go to "App passwords" section
 * 4. Select "Mail" and "Other (Custom name)"
 * 5. Enter "Outrun AI Website" as the name
 * 6. Copy the generated 16-character password
 * 7. Use that password for SMTP_PASSWORD below
 * 
 * @package OutrunAI
 */

// SMTP Configuration for Gmail
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');      // Your Gmail address
define('SMTP_PASSWORD', 'xxxx xxxx xxxx xxxx');        // Gmail App Password (16 chars)
define('SMTP_FROM_EMAIL', 'your-email@gmail.com');     // From email address
define('SMTP_FROM_NAME', 'Outrun AI');                 // From name

// Contact Settings
define('CONTACT_EMAIL', 'your-email@gmail.com');       // Email to receive contact messages

// Security Settings
define('ALLOWED_REFERER', 'yourdomain.com');           // Your domain - leave empty to disable referer check
