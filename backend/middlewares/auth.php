<?php
require_once __DIR__ . '/../utils/jwt.php';

$headers = getallheaders();

if (!isset($headers['Authorization'])) {
    error_log(" Authorization header not found");
    http_response_code(401);
    echo json_encode(["error" => "Authorization header not found"]);
    exit;
}

$authHeader = $headers['Authorization'];
$token = str_replace('Bearer ', '', $authHeader);

error_log("Token: " . $token);

try {
    $decoded = JWT::validate($token);

    if (!$decoded || !isset($decoded['user_id'])) {
        error_log(" Invalid token payload: " . json_encode($decoded));
        http_response_code(401);
        echo json_encode(["error" => "Invalid token payload"]);
        exit;
    }

    $user_id = $decoded['user_id'];
    error_log(" User authenticated: user_id = " . $user_id);

} catch (Exception $e) {
    error_log(" Token validation failed: " . $e->getMessage());
    http_response_code(401);
    echo json_encode(["error" => "Token validation failed: " . $e->getMessage()]);
    exit;
}
