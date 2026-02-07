<?php
/**
 * License Validation Snippet
 * Add this to the top of your index.php or header.php
 */

$LICENSE_KEY = 'YOUR_LICENSE_KEY_HERE';
$SERVER_URL = 'http://localhost:3000/api/license/validate'; // Change to your deployed URL
$DOMAIN = $_SERVER['HTTP_HOST'];

function validate_license($key, $domain, $url) {
    $data = json_encode(['licenseKey' => $key, 'domain' => $domain]);
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($data)
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200 || !$response) {
        // Fail open or closed depending on preference. Here we fail closed if server error.
        return false;
    }
    
    $result = json_decode($response, true);
    return isset($result['valid']) && $result['valid'] === true;
}

if (!validate_license($LICENSE_KEY, $DOMAIN, $SERVER_URL)) {
    // License invalid
    http_response_code(403);
    die("<h1>License Expired or Invalid</h1><p>Please contact support to renew your license.</p>");
}

// License valid, continue execution...
?>
