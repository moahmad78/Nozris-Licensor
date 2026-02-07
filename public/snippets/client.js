/**
 * License Validation Snippet (Node.js / Client-side Logic)
 * Note: Validating strictly on client-side is insecure as code can be modified.
 * This is best used in a Node.js backend or obscured build.
 */

const LICENSE_KEY = 'YOUR_LICENSE_KEY_HERE';
const SERVER_URL = 'http://localhost:3000/api/license/validate'; // Change to your deployed URL
// const domain = window.location.hostname; // Browser
const domain = 'client.com'; // Node

async function validateLicense() {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ licenseKey: LICENSE_KEY, domain })
        });

        const data = await response.json();

        if (!data.valid) {
            console.error('License Invalid:', data.reason);
            // Stop execution or redirect
            if (typeof window !== 'undefined') {
                document.body.innerHTML = '<h1>License Expired</h1>';
            } else {
                process.exit(1);
            }
        } else {
            console.log('License Valid');
        }
    } catch (error) {
        console.error('License Check Failed:', error);
        // Decide to fail open or closed
    }
}

validateLicense();
