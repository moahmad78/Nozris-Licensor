(function () {
    const NOZRIS_ENDPOINT = 'http://localhost:3000/api/nozris/integrity'; // In prod, this would be the actual domain
    const CHECK_INTERVAL = 30000; // 30 seconds

    function deployCountermeasures(reason) {
        // 1. Wipe Body
        document.body.innerHTML = '';

        // 2. Lock Styles
        const style = document.createElement('style');
        style.innerHTML = `
            body, html { 
                margin: 0; 
                padding: 0; 
                height: 100%; 
                overflow: hidden; 
                background: #000 !important; 
            }
            #nozris-lock {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2147483647;
                background: black;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: red;
                font-family: monospace;
                text-align: center;
            }
        `;
        document.head.appendChild(style);

        // 3. Show Overlay
        const overlay = document.createElement('div');
        overlay.id = 'nozris-lock';
        overlay.innerHTML = `
            <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h1 style="font-size: 3rem; margin: 20px 0;">SYSTEM LOCKED</h1>
            <p style="font-size: 1.5rem; color: #666;">${reason || 'Security Violation Detected'}</p>
            <p style="margin-top: 20px; color: #444;">Reference: ${btoa(window.location.hostname)}</p>
        `;
        document.body.appendChild(overlay);

        // 4. Report Breach
        fetch(NOZRIS_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'BREACH_DEPLOYED',
                reason: reason,
                host: window.location.hostname,
                ua: navigator.userAgent
            })
        });
    }

    async function checkIntegrity() {
        try {
            const response = await fetch(`${NOZRIS_ENDPOINT}?host=${window.location.hostname}`);
            const data = await response.json();

            if (data.status === 'TAMPERED') {
                deployCountermeasures('Unauthorized Modification Detected');
            }
            if (data.status === 'BLOCKED_DOMAIN') {
                deployCountermeasures('Domain Not Authorized');
            }
        } catch (e) {
            // Failsafe: If licensr is down, do we block? 
            // For now, fail open to avoid accidental denial of service if our server is down.
            console.warn('Nozris Integrity Check Failed (Network)');
        }
    }

    // Initial Start
    console.log('%c Nozris Neural Guard Active ', 'background: #000; color: #0f0; padding: 5px; border-radius: 3px;');
    checkIntegrity();
    setInterval(checkIntegrity, CHECK_INTERVAL);
})();
