<?php
/**
 * PHZYN Project Quotes SMTP Mailer API for Hostinger / PHP Server Deployments.
 * This endpoint processes JSON submissions and sends email notifications via SMTP.
 */

// Configure CORS and JSON headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Restrict to POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "error" => "Method (" . $_SERVER['REQUEST_METHOD'] . ") not allowed. Only POST is supported."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. Load SMTP Env Secrets from .env files in parent directories
$env = [];
$searchDirs = [
    __DIR__,
    dirname(__DIR__),
    dirname(dirname(__DIR__)),
    dirname(dirname(dirname(__DIR__))),
    dirname(dirname(dirname(dirname(__DIR__))))
];

foreach ($searchDirs as $dir) {
    $envPath = $dir . '/.env';
    if (file_exists($envPath)) {
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines !== false) {
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || strpos($line, '#') === 0) {
                    continue;
                }
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $key = trim($parts[0]);
                    $val = trim($parts[1]);
                    // Strip enclosing quotes
                    $val = trim($val, " '\"");
                    $env[$key] = $val;
                }
            }
        }
        break; // Stop climbing if we found the root .env
    }
}

// Get SMTP configurations from environment variables or .env file
$smtpHost       = getenv('SMTP_HOST') ?: ($env['SMTP_HOST'] ?? '');
$smtpPortStr    = getenv('SMTP_PORT') ?: ($env['SMTP_PORT'] ?? '465');
$smtpPort       = (int)$smtpPortStr;
$smtpUser       = getenv('SMTP_USER') ?: ($env['SMTP_USER'] ?? '');
$smtpPass       = getenv('SMTP_PASS') ?: ($env['SMTP_PASS'] ?? '');
$smtpSenderName = getenv('SMTP_SENDER_NAME') ?: ($env['SMTP_SENDER_NAME'] ?? 'PHZYN Project Requests');

// 2. Parse incoming JSON Input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Invalid JSON payload or empty body."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Retrieve attributes
$fullName     = $data['fullName'] ?? '';
$companyName  = $data['companyName'] ?? '';
$email        = $data['email'] ?? '';
$phone        = $data['phone'] ?? '';
$serviceType  = $data['serviceType'] ?? '';
$areaSize     = $data['areaSize'] ?? '';
$budget       = $data['budget'] ?? '';
$timeline     = $data['timeline'] ?? '';
$details      = $data['details'] ?? '';
$city         = $data['city'] ?? '';
$neighborhood = $data['neighborhood'] ?? '';
$ticketNumber = $data['ticketNumber'] ?? ('PHZ-' . rand(100000, 999999));

// Basic presence validation
if (empty($fullName) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Missing required parameter values. Full Name, Email, and Phone number are required."
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Readable mapping helpers
function getServiceLabel($type) {
    switch ($type) {
        case 'commercial': return 'تنفيذ المحلات التجارية (Retail Store)';
        case 'office':     return 'تنفيذ المكاتب والشركات (Office Fit-out)';
        case 'booth':      return 'تنفيذ البوثات والمعارض (Exhibition Booth)';
        default:           return $type;
    }
}

function getTimelineLabel($tl) {
    switch ($tl) {
        case 'urgent':   return 'عاجل (Urgent)';
        case 'normal':   return 'طبيعي - من شهر إلى ٣ أشهر (Normal)';
        case 'flexible': return 'مرن - أكثر من ٣ أشهر (Flexible)';
        default:         return $tl;
    }
}

function getBudgetLabel($bg) {
    switch ($bg) {
        case 'under50k':   return 'أقل من 50,000 ريال سعودي';
        case '50k-150k':   return 'من 50,000 إلى 150,000 ريال سعودي';
        case '150k-500k':  return 'من 150,000 إلى 500,000 ريال سعودي';
        case 'over500k':   return 'أكثر من 500,000 ريال سعودي';
        default:           return $bg;
    }
}

// 3. Build Arabic HTML email template
$serviceLabel  = getServiceLabel($serviceType);
$timelineLabel = getTimelineLabel($timeline);
$budgetLabel   = getBudgetLabel($budget);
$detailsHtml   = !empty($details) ? nl2br(htmlspecialchars($details)) : 'لا يوجد';

$emailHtml = "
<!DOCTYPE html>
<html dir='rtl' lang='ar'>
<head>
  <meta charset='utf-8'>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 650px;
      margin: 30px auto;
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background-color: #10798e;
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 8px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0c5c6d;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .grid {
      display: table;
      width: 100%;
      margin-bottom: 25px;
    }
    .row {
      display: table-row;
    }
    .label {
      display: table-cell;
      padding: 10px 0;
      font-weight: 600;
      color: #64748b;
      width: 35%;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
      text-align: right;
    }
    .value {
      display: table-cell;
      padding: 10px 0;
      color: #0f172a;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
      text-align: right;
    }
    .details-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px 20px;
      font-size: 14px;
      line-height: 1.6;
      color: #334155;
    }
    .footer {
      background-color: #f1f5f9;
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>طلب مشروع جديد (PHZYN)</h1>
      <p>رقم تذكرة الطلب / Reference Code: <strong>$ticketNumber</strong></p>
    </div>
    
    <div class='content'>
      <h2 class='section-title'>١. معلومات العميل والاتصال</h2>
      <div class='grid'>
        <div class='row'>
          <div class='label'>اسم العميل بالكامل:</div>
          <div class='value'>$fullName</div>
        </div>
        <div class='row'>
          <div class='label'>الجهة أو العلامة التجارية:</div>
          <div class='value'>" . ($companyName ? htmlspecialchars($companyName) : '— (لم يحدد)') . "</div>
        </div>
        <div class='row'>
          <div class='label'>البريد الإلكتروني:</div>
          <div class='value' style='direction: ltr; text-align: right;'>$email</div>
        </div>
        <div class='row'>
          <div class='label'>رقم الجوال:</div>
          <div class='value' style='direction: ltr; text-align: right;'>$phone</div>
        </div>
      </div>

      <h2 class='section-title'>٢. بيانات المشروع والتنفيذ</h2>
      <div class='grid'>
        <div class='row'>
          <div class='label'>نوع الخدمة المطلوبة:</div>
          <div class='value'>$serviceLabel</div>
        </div>
        <div class='row'>
          <div class='label'>المدينة:</div>
          <div class='value'>" . ($city ? htmlspecialchars($city) : '—') . "</div>
        </div>
        <div class='row'>
          <div class='label'>الحي:</div>
          <div class='value'>" . ($neighborhood ? htmlspecialchars($neighborhood) : '—') . "</div>
        </div>
        <div class='row'>
          <div class='label'>مساحة الموقع التقريبية:</div>
          <div class='value'>$areaSize متر مربع (Sqm)</div>
        </div>
        <div class='row'>
          <div class='label'>الميزانية التقريبية:</div>
          <div class='value'>$budgetLabel</div>
        </div>
        <div class='row'>
          <div class='label'>الجدول الزمني المستهدف:</div>
          <div class='value'>$timelineLabel</div>
        </div>
      </div>

      <h2 class='section-title'>٣. المواصفات الإضافية والتعليمات</h2>
      <div class='details-box'>
        $detailsHtml
      </div>
    </div>

    <div class='footer'>
      تم إرسال هذا الطلب تلقائياً من نظام الموقع الإلكتروني لـ PHZYN
    </div>
  </div>
</body>
</html>
";

$subject = "طلب مشروع جديد [$ticketNumber] - $fullName";
$toEmail = 'phzyn@phzyn.sa';

// 4. Try sending via SMTP socket connection if configured
if (!empty($smtpHost) && !empty($smtpUser) && !empty($smtpPass)) {
    try {
        $secure = ($smtpPort === 465);
        $socketHost = $secure ? "ssl://" . $smtpHost : $smtpHost;
        
        $socket = @fsockopen($socketHost, $smtpPort, $errno, $errstr, 15);
        
        if (!$socket) {
            throw new Exception("Socket connection to $smtpHost:$smtpPort failed: $errstr ($errno)");
        }
        
        function read_smtp($socket, $expected) {
            $response = "";
            while (substr($response, 3, 1) !== ' ') {
                $line = fgets($socket, 512);
                if ($line === false) break;
                $response .= $line;
            }
            $code = substr($response, 0, 3);
            if ($code !== $expected) {
                throw new Exception("SMTP Expected code $expected, received: " . trim($response));
            }
            return $response;
        }

        read_smtp($socket, "220");
        
        fwrite($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ?? "localhost") . "\r\n");
        read_smtp($socket, "250");

        if ($smtpPort === 587) {
            fwrite($socket, "STARTTLS\r\n");
            read_smtp($socket, "220");
            stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
            fwrite($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ?? "localhost") . "\r\n");
            read_smtp($socket, "250");
        }

        fwrite($socket, "AUTH LOGIN\r\n");
        read_smtp($socket, "334");

        fwrite($socket, base64_encode($smtpUser) . "\r\n");
        read_smtp($socket, "334");

        fwrite($socket, base64_encode($smtpPass) . "\r\n");
        read_smtp($socket, "235");

        fwrite($socket, "MAIL FROM:<$smtpUser>\r\n");
        read_smtp($socket, "250");

        fwrite($socket, "RCPT TO:.<$toEmail>\r\n");
        read_smtp($socket, "250");

        fwrite($socket, "DATA\r\n");
        read_smtp($socket, "354");

        // Format MIME Headers correctly
        $boundary = md5(uniqid(time()));
        $headers = [
            "MIME-Version: 1.0",
            "Content-type: text/html; charset=UTF-8",
            "From: " . '=?UTF-8?B?' . base64_encode($smtpSenderName) . '?=' . " <$smtpUser>",
            "To: <$toEmail>",
            "Reply-To: <$email>",
            "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
            "Date: " . date("r"),
            "Message-ID: <" . time() . "-" . uniqid() . "@" . $smtpHost . ">"
        ];

        $message = implode("\r\n", $headers) . "\r\n\r\n" . $emailHtml . "\r\n.\r\n";
        fwrite($socket, $message);
        read_smtp($socket, "250");

        fwrite($socket, "QUIT\r\n");
        fclose($socket);

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Email sent successfully via SMTP server.",
            "ticketNumber" => $ticketNumber
        ], JSON_UNESCAPED_UNICODE);
        exit;

    } catch (Exception $e) {
        // Log locally or handle fallback
        error_log("SMTP Error: " . $e->getMessage());
        $smtpErrorMsg = $e->getMessage();
    }
} else {
    $smtpErrorMsg = "SMTP configurations are incomplete or not setup.";
}

// 5. Fallback to PHP's native mail() function (often pre-configured on Hostinger Shared Hosting)
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= 'From: ' . '=?UTF-8?B?' . base64_encode($smtpSenderName) . '?=' . " <$toEmail>" . "\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";

if (@mail($toEmail, $subject, $emailHtml, $headers)) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Email sent via backup system (PHP Native mail).",
        "ticketNumber" => $ticketNumber
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 6. Return failure JSON if both SMTP and native mail failed
http_response_code(500);
echo json_encode([
    "success" => false,
    "error" => "Technical issue occurred sending the email. All channels failed.",
    "smtp_details" => $smtpErrorMsg,
    "ticketNumber" => $ticketNumber
], JSON_UNESCAPED_UNICODE);
