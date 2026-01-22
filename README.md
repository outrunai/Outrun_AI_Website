# Outrun AI - Website Oficial

Sitio web oficial de Outrun AI - Automatización de WhatsApp para clínicas estéticas, ortodoncistas, dentistas y cirujanos plásticos en Medellín, Colombia.

## Descripción

Este proyecto es un sitio web optimizado para rendimiento y SEO, diseñado específicamente para el mercado colombiano. La arquitectura prioriza tiempos de carga rápidos y una experiencia de usuario fluida en dispositivos móviles.

## Tecnologías

- **HTML5** - Estructura semántica con meta tags SEO
- **CSS3** - Diseño responsive mobile-first
- **JavaScript** - Vanilla JS sin dependencias de frameworks
- **PHP** - Para el formulario de contacto (implementación futura)

## Estructura del Proyecto

Para una documentación detallada de la arquitectura, consulta el archivo [ARCHITECTURE.md](./ARCHITECTURE.md).

```
OutrunAI_Website/
├── index.html
├── ARCHITECTURE.md
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   ├── images/
│   └── icons/
└── php/
```

## Instalación Local

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor local (opcional, para pruebas completas)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/OutrunAI_Website.git
   cd OutrunAI_Website
   ```

2. **Iniciar servidor local**
   
   Opción A - Python 3:
   ```bash
   python -m http.server 8000
   ```
   
   Opción B - Node.js:
   ```bash
   npx serve
   ```
   
   Opción C - PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:8000
   ```

## Despliegue en Hostinger VPS

### Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Minified CSS: `css/styles.min.css` created
- [ ] Minified JavaScript: `js/main.min.js` created
- [ ] Optimized all images in `assets/images/`
- [ ] Converted images to WebP format
- [ ] Updated `index.html` to use minified files
- [ ] Created `.htaccess` with caching rules
- [ ] Tested locally with minified files
- [ ] Verified contact form works locally

**Files to Upload (Production):**
```
index.html
.htaccess
css/styles.min.css
js/main.min.js
php/contact.php
php/config.php (configured with SMTP credentials)
assets/images/ (all optimized images)
assets/icons/ (all SVG icons)
```

**Apache Modules Required:**
- mod_deflate (compression)
- mod_expires (caching)
- mod_headers (security headers)
- mod_rewrite (URL rewriting)

### Step-by-Step VPS Deployment

#### 1. SSH Connection

```bash
# Connect to VPS
ssh usuario@tu-vps-ip

# Or with key-based authentication
ssh -i ~/.ssh/your_key usuario@tu-vps-ip
```

#### 2. Create Web Directory Structure

```bash
# Create directory
sudo mkdir -p /var/www/outrunai

# Set ownership
sudo chown -R $USER:www-data /var/www/outrunai

# Set permissions
sudo chmod -R 755 /var/www/outrunai
```

#### 3. Upload Files

**Option A - Git (recommended):**
```bash
cd /var/www/outrunai
git clone https://github.com/tu-usuario/OutrunAI_Website.git .
git pull origin main
```

**Option B - SFTP/SCP:**
```bash
# From local machine
scp -r ./* usuario@tu-vps-ip:/var/www/outrunai/
```

#### 4. Set File Permissions

```bash
# Directories: 755, Files: 644
find /var/www/outrunai -type d -exec chmod 755 {} \;
find /var/www/outrunai -type f -exec chmod 644 {} \;

# PHP files need execution permission
chmod 644 /var/www/outrunai/php/*.php
```

#### 5. Configure PHP Contact Form

```bash
# Copy config template
cp /var/www/outrunai/php/config.example.php /var/www/outrunai/php/config.php

# Edit with your credentials
nano /var/www/outrunai/php/config.php
```

**Config values to set:**
```php
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-16-char-app-password');
define('CONTACT_EMAIL', 'outrunai6@gmail.com');
```

#### 6. Install PHPMailer (if not present)

```bash
cd /var/www/outrunai/php
composer require phpmailer/phpmailer

# Or manually download
wget https://github.com/PHPMailer/PHPMailer/archive/master.zip
unzip master.zip
```

#### 7. Verify PHP Version

```bash
php -v  # Should be 7.4+ or 8.x
```

### Apache Virtual Host Configuration

Create virtual host file:

```bash
sudo nano /etc/apache2/sites-available/outrunai.conf
```

**Apache Configuration:**
```apache
<VirtualHost *:80>
    ServerName outrunai.com
    ServerAlias www.outrunai.com
    DocumentRoot /var/www/outrunai
    
    <Directory /var/www/outrunai>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # PHP handling
    <FilesMatch \.php$>
        SetHandler "proxy:unix:/var/run/php/php8.1-fpm.sock|fcgi://localhost"
    </FilesMatch>
    
    # Logging
    ErrorLog ${APACHE_LOG_DIR}/outrunai_error.log
    CustomLog ${APACHE_LOG_DIR}/outrunai_access.log combined
</VirtualHost>
```

**Enable site and modules:**
```bash
sudo a2ensite outrunai.conf
sudo a2enmod rewrite deflate expires headers
sudo systemctl restart apache2
```

### SSL/HTTPS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache

# Obtain certificate
sudo certbot --apache -d outrunai.com -d www.outrunai.com

# Test auto-renewal
sudo certbot renew --dry-run
```

After SSL setup, uncomment the HTTPS redirect in `.htaccess`:
```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Post-Deployment Testing

- [ ] Website loads correctly at https://outrunai.com
- [ ] All images display (WebP with fallback)
- [ ] Contact form sends emails
- [ ] Mobile responsiveness works
- [ ] Run PageSpeed Insights (target: 90+ mobile)
- [ ] Test from Colombian IP if possible
- [ ] Verify N8N still running properly
- [ ] Monitor resource usage for 24 hours

---

## Performance Testing

### Tools to Use

- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/
- **Chrome DevTools Lighthouse**

### Target Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint | < 1.5s | < 2.0s |
| Largest Contentful Paint | < 2.5s | < 3.0s |
| Total Blocking Time | < 200ms | < 300ms |
| Cumulative Layout Shift | < 0.1 | < 0.25 |
| Speed Index | < 3.0s | < 4.0s |
| Total Page Size | < 500KB | < 800KB |

### Testing Procedure

1. Test from Colombia-based server (GTmetrix location: São Paulo)
2. Test on mobile device (throttled 3G connection)
3. Test on desktop (fast connection)
4. Verify all images load with lazy loading
5. Check console for JavaScript errors
6. Verify contact form submission

### Optimization Checklist

- ✅ CSS minified and compressed
- ✅ JavaScript minified and deferred
- ✅ Images optimized and WebP format
- ✅ Lazy loading implemented
- ✅ Browser caching configured
- ✅ GZIP/Brotli compression enabled
- ✅ No render-blocking resources
- ✅ Font loading optimized (system fonts used)

---

## Deployment Checklist

### Pre-Deployment

- [ ] Minify CSS: `css/styles.min.css` created
- [ ] Minify JavaScript: `js/main.min.js` created
- [ ] Optimize all images in `assets/images/`
- [ ] Convert images to WebP format
- [ ] Update `index.html` to use minified files
- [ ] Create `.htaccess` with caching rules
- [ ] Test locally with minified files
- [ ] Verify contact form works locally

### VPS Setup

- [ ] SSH access configured
- [ ] Apache/Nginx installed and running
- [ ] PHP 7.4+ installed
- [ ] Required Apache modules enabled (mod_deflate, mod_expires, mod_headers, mod_rewrite)
- [ ] PHPMailer library installed
- [ ] SSL certificate configured (Let's Encrypt)

### Deployment

- [ ] Upload files to `/var/www/outrunai/`
- [ ] Set file permissions (755/644)
- [ ] Configure `php/config.php` with Gmail credentials
- [ ] Test `.htaccess` rules are working
- [ ] Verify virtual host configuration
- [ ] Test HTTPS redirect

### Post-Deployment

- [ ] Test website loads correctly
- [ ] Verify all images display (WebP with fallback)
- [ ] Test contact form sends emails
- [ ] Check mobile responsiveness
- [ ] Run PageSpeed Insights (target: 90+ mobile)
- [ ] Test from Colombian IP if possible
- [ ] Verify N8N still running properly
- [ ] Monitor resource usage for 24 hours

### Maintenance

- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Schedule weekly performance checks
- [ ] Monitor Gmail SMTP quota (2000 emails/day limit)

---

## Características

- ✅ SEO optimizado para Colombia/Medellín
- ✅ Diseño responsive mobile-first
- ✅ Tiempos de carga < 3 segundos
- ✅ Accesibilidad WCAG 2.1
- ✅ Open Graph para redes sociales

## Próximas Funcionalidades

- [ ] Formulario de contacto con integración Gmail
- [ ] Botón flotante de WhatsApp
- [ ] Integración con Google Analytics
- [ ] Banner de cookies GDPR

## Contacto

Para más información sobre Outrun AI y nuestros servicios de automatización de WhatsApp:

- **Email**: contacto@outrunai.com
- **WhatsApp**: +57 XXX XXX XXXX
- **Ubicación**: Medellín, Colombia

---

© 2026 Outrun AI. Todos los derechos reservados.
