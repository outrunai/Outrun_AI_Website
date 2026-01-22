<?php
/**
 * Example Configuration File for Outrun AI Contact Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to 'config.php' in the same directory
 * 2. Replace all placeholder values with your actual credentials
 * 3. Never commit config.php to version control
 * 
 * ENVIRONMENT VARIABLES (Recommended for Production):
 * Set these in your server environment or .htaccess:
 * - OUTRUNAI_SMTP_USERNAME
 * - OUTRUNAI_SMTP_PASSWORD
 * - OUTRUNAI_CONTACT_EMAIL
 * - OUTRUNAI_ALLOWED_REFERER
 * 
 * GMAIL APP PASSWORD SETUP:
 * 1. Go to Google Account → Security
 * 2. Enable 2-Step Verification if not already enabled
 * 3. Go to "App passwords" section
 * 4. Select "Mail" and "Other (Custom name)"
 * 5. Enter "Outrun AI Website" as the name
 * 6. Copy the generated 16-character password
 * 7. Use that password for SMTP_PASSWORD below (or set OUTRUNAI_SMTP_PASSWORD env var)
 * 
 * @package OutrunAI
 */

// SMTP Configuration for Gmail
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', getenv('OUTRUNAI_SMTP_USERNAME') ?: 'your-email@gmail.com');
define('SMTP_PASSWORD', getenv('OUTRUNAI_SMTP_PASSWORD') ?: 'xxxx xxxx xxxx xxxx');
define('SMTP_FROM_EMAIL', getenv('OUTRUNAI_SMTP_USERNAME') ?: 'your-email@gmail.com');
define('SMTP_FROM_NAME', 'Outrun AI');

// Contact Settings
define('CONTACT_EMAIL', getenv('OUTRUNAI_CONTACT_EMAIL') ?: 'your-email@gmail.com');

// Security Settings
define('ALLOWED_REFERER', getenv('OUTRUNAI_ALLOWED_REFERER') ?: 'yourdomain.com');
