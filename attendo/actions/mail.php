<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

session_start();
include(__DIR__ . '/ratelimiter.php');

if ($_SERVER['REQUEST_METHOD'] != 'POST' && $_SERVER['REQUEST_METHOD'] != 'OPTIONS') {
    header($_SERVER["SERVER_PROTOCOL"] . " 405 Method Not Allowed", true, 405);
}

$rateLimiter = new RateLimiter($_SERVER["REMOTE_ADDR"]);
$limit = 100;
$minutes = 1;
$seconds = floor($minutes * 60);

try {
    $rateLimiter->limitRequestsInMinutes($limit, $minutes);
} catch (RateExceededException $e) {
    header("HTTP/1.1 429 Too Many Requests");
    header(sprintf("Retry-After: %d", $seconds));
}


$field_mapper = [
    'name' => 'Ime i prezime',
    'start_contact' => "Pozivni",
    'contact' => 'Kontakt broj',
    'email' => 'E-mail',
    'company_name' => 'Naziv kompanije',
    'employees' => 'Broj uposlenih',
];

$fields = $_POST;

if (!isset($fields['form_id']))
    http_response_code(200);

$email_content = [];

foreach ($fields as $key => $value) {
    if (!isset($field_mapper[$key]))
        continue;

    $email_content[] = $field_mapper[$key] . ': ' . $value;
}

$recipient = "info@attendo.ba";

$subject = $fields['form_id'] . ' form website';
$email_content = implode("\n", $email_content);


if (mail($recipient, $subject, $email_content)) {
    http_response_code(200);
} else {
    http_response_code(500);
}
