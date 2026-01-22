<?php
/**
 * Contact Form Handler
 * Processes contact form submissions and sends emails via Gmail SMTP
 *
 * @package OutrunAI
 */

// Enable error reporting for debugging (disable display_errors in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Load configuration
require_once 'config.php';

// Set headers
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
    exit;
}

// Check referer (basic CSRF protection)
if (defined('ALLOWED_REFERER') && ALLOWED_REFERER !== '') {
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    if (strpos($referer, ALLOWED_REFERER) === false) {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Solicitud no autorizada'
        ]);
        exit;
    }
}

// Rate limiting (simple file-based implementation)
function checkRateLimit($ip) {
    $rateLimitFile = sys_get_temp_dir() . '/outrunai_ratelimit_' . md5($ip) . '.json';
    $maxRequests = 5;
    $timeWindow = 3600; // 1 hour
    
    $data = [];
    if (file_exists($rateLimitFile)) {
        $content = file_get_contents($rateLimitFile);
        $data = json_decode($content, true) ?: [];
    }
    
    $now = time();
    // Remove old entries
    $data = array_filter($data, function($timestamp) use ($now, $timeWindow) {
        return ($now - $timestamp) < $timeWindow;
    });
    
    if (count($data) >= $maxRequests) {
        return false;
    }
    
    $data[] = $now;
    file_put_contents($rateLimitFile, json_encode($data));
    return true;
}

$clientIP = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
if (!checkRateLimit($clientIP)) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Demasiadas solicitudes. Por favor espera un momento antes de intentar nuevamente.'
    ]);
    exit;
}

// Honeypot check
$honeypot = $_POST['website'] ?? '';
if (!empty($honeypot)) {
    // Bot detected - return fake success
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado'
    ]);
    exit;
}

// Sanitize and validate inputs
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

// Safe strlen that works without mbstring extension
function safeStrlen($str) {
    return function_exists('mb_strlen') ? mb_strlen($str, 'UTF-8') : strlen($str);
}

function validateName($name) {
    $length = safeStrlen($name);
    return $length >= 2 && $length <= 100;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validatePhone($phone) {
    // Colombian phone format: +57 3XX XXX XXXX, 3XX XXX XXXX, or 3XXXXXXXXX
    $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
    // Remove 57 country code prefix if present
    if (strpos($cleaned, '57') === 0 && strlen($cleaned) > 10) {
        $cleaned = substr($cleaned, 2);
    }
    return preg_match('/^3[0-9]{9}$/', $cleaned);
}

function validateMessage($message) {
    $length = safeStrlen($message);
    return $length >= 10 && $length <= 1000;
}

// Get and sanitize form data
$nombre = sanitizeInput($_POST['nombre'] ?? '');
$email = sanitizeInput($_POST['email'] ?? '');
$telefono = sanitizeInput($_POST['telefono'] ?? '');
$mensaje = sanitizeInput($_POST['mensaje'] ?? '');

// Validate all fields
$errors = [];

if (!validateName($nombre)) {
    $errors[] = 'Por favor ingresa un nombre válido (2-100 caracteres)';
}

if (!validateEmail($email)) {
    $errors[] = 'Por favor ingresa un correo electrónico válido';
}

if (!validatePhone($telefono)) {
    $errors[] = 'Por favor ingresa un número de teléfono colombiano válido';
}

if (!validateMessage($mensaje)) {
    $errors[] = 'Por favor ingresa un mensaje válido (10-1000 caracteres)';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $errors[0] // Return first error
    ]);
    exit;
}

// Prepare email content
$subject = "Nuevo contacto desde Outrun AI - " . $nombre;

$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0066FF; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #0066FF; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Nuevo Mensaje de Contacto</h1>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Nombre:</span><br>
                {$nombre}
            </div>
            <div class='field'>
                <span class='label'>Correo Electrónico:</span><br>
                <a href='mailto:{$email}'>{$email}</a>
            </div>
            <div class='field'>
                <span class='label'>Teléfono:</span><br>
                <a href='tel:{$telefono}'>{$telefono}</a>
            </div>
            <div class='field'>
                <span class='label'>Mensaje:</span><br>
                " . nl2br($mensaje) . "
            </div>
        </div>
        <div class='footer'>
            <p>Este mensaje fue enviado desde el formulario de contacto de Outrun AI</p>
            <p>IP del remitente: {$clientIP}</p>
            <p>Fecha: " . date('Y-m-d H:i:s') . "</p>
        </div>
    </div>
</body>
</html>
";

// Plain text version
$plainTextBody = "
Nuevo Mensaje de Contacto - Outrun AI
=====================================

Nombre: {$nombre}
Correo Electrónico: {$email}
Teléfono: {$telefono}

Mensaje:
{$mensaje}

---
IP del remitente: {$clientIP}
Fecha: " . date('Y-m-d H:i:s') . "
";

// Send email using PHPMailer
try {
    // Check if PHPMailer is available
    $phpmailerPath = __DIR__ . '/vendor/autoload.php';
    $phpmailerManualPath = __DIR__ . '/PHPMailer/PHPMailer.php';
    
    if (file_exists($phpmailerPath)) {
        require $phpmailerPath;
    } elseif (file_exists($phpmailerManualPath)) {
        require $phpmailerManualPath;
        require __DIR__ . '/PHPMailer/SMTP.php';
        require __DIR__ . '/PHPMailer/Exception.php';
    } else {
        // Fallback to native mail() function
        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            'From: ' . SMTP_FROM_NAME . ' <' . SMTP_FROM_EMAIL . '>',
            'Reply-To: ' . $email,
            'X-Mailer: PHP/' . phpversion()
        ];
        
        $mailSent = mail(CONTACT_EMAIL, $subject, $emailBody, implode("\r\n", $headers));
        
        if ($mailSent) {
            echo json_encode([
                'success' => true,
                'message' => 'Mensaje enviado exitosamente'
            ]);
        } else {
            throw new Exception('Error al enviar el correo');
        }
        exit;
    }
    
    // Use PHPMailer
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = SMTP_PORT;
    $mail->CharSet = 'UTF-8';
    
    // Recipients
    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress(CONTACT_EMAIL);
    $mail->addReplyTo($email, $nombre);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $emailBody;
    $mail->AltBody = $plainTextBody;
    
    $mail->send();
    
    echo json_encode([
        'success' => true,
        'message' => 'Mensaje enviado exitosamente'
    ]);
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Hubo un error al enviar el mensaje. Por favor intenta nuevamente.'
    ]);
}
