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

### Preparación

1. Asegúrate de tener acceso SSH al VPS
2. Configura el directorio web en `/var/www/outrunai`
3. Configura el virtual host de Apache/Nginx

### Despliegue

```bash
# Conectar al VPS
ssh usuario@tu-vps-ip

# Navegar al directorio
cd /var/www/outrunai

# Actualizar archivos
git pull origin main

# Establecer permisos
chmod -R 755 /var/www/outrunai
```

### Configuración de Nginx (ejemplo)

```nginx
server {
    listen 80;
    server_name outrunai.com www.outrunai.com;
    root /var/www/outrunai;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

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
