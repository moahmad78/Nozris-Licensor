/**
 * Nozris Guard v2.0 — Functional Lock
 * 
 * This script is embedded on client websites via a <script> tag.
 * It validates the license and bootstraps the UI. Without this script,
 * the site remains a non-functional skeleton.
 * 
 * Embed: <script data-k="LICENSE_KEY_HEX" src="https://yourdomain.com/nozris.js" defer></script>
 */
; (function () {
    // ─── Hex-encoded strings (no obvious keywords in source) ───
    var _0x = {
        // 'api/license/validate'
        a: [97, 112, 105, 47, 108, 105, 99, 101, 110, 115, 101, 47, 118, 97, 108, 105, 100, 97, 116, 101],
        // 'api/license/heartbeat'
        b: [97, 112, 105, 47, 108, 105, 99, 101, 110, 115, 101, 47, 104, 101, 97, 114, 116, 98, 101, 97, 116],
        // 'app-root'
        c: [97, 112, 112, 45, 114, 111, 111, 116],
        // 'license-warning'
        d: [108, 105, 99, 101, 110, 115, 101, 45, 119, 97, 114, 110, 105, 110, 103],
        // 'lw-overlay'
        e: [108, 119, 45, 111, 118, 101, 114, 108, 97, 121],
        // '_lsr_cache'
        f: [95, 108, 115, 114, 95, 99, 97, 99, 104, 101],
        // 'Content-Type'
        g: [67, 111, 110, 116, 101, 110, 116, 45, 84, 121, 112, 101],
        // 'application/json'
        h: [97, 112, 112, 108, 105, 99, 97, 116, 105, 111, 110, 47, 106, 115, 111, 110],
        // 'POST'
        i: [80, 79, 83, 84],
        // 'data-k'
        j: [100, 97, 116, 97, 45, 107],
        // 'display'
        k: [100, 105, 115, 112, 108, 97, 121],
        // 'none'
        l: [110, 111, 110, 101],
        // 'block'
        m: [98, 108, 111, 99, 107],
        // 'visibility'
        n: [118, 105, 115, 105, 98, 105, 108, 105, 116, 121],
        // 'opacity'
        o: [111, 112, 97, 99, 105, 116, 121],
    };

    // Decode char-code arrays to strings
    function _d(arr) { return arr.map(function (c) { return String.fromCharCode(c); }).join(''); }

    // Resolved strings (decoded once)
    var S = {};
    for (var k in _0x) S[k] = _d(_0x[k]);

    // ─── Configuration ───
    var _mounted = false;
    var _token = null;
    var _key = null;
    var _baseUrl = '';

    // Find our script tag and extract license key + base URL
    function _init() {
        var scripts = document.querySelectorAll('script[' + S.j + ']');
        for (var i = 0; i < scripts.length; i++) {
            var s = scripts[i];
            var keyAttr = s.getAttribute(S.j);
            if (keyAttr) {
                _key = keyAttr;
                // Derive base URL from the script's src
                var src = s.getAttribute('src') || '';
                var idx = src.lastIndexOf('/');
                _baseUrl = idx > 0 ? src.substring(0, idx + 1).replace(/\/+$/, '') : '';
                break;
            }
        }
        if (!_key) {
            // No key found — can't do anything
            return;
        }
        // If baseUrl is empty (inline script), try to read from data-api attribute
        if (!_baseUrl) {
            var apiAttr = document.querySelector('script[data-api]');
            _baseUrl = apiAttr ? apiAttr.getAttribute('data-api') : '';
        }
        _validate();
    }

    // ─── Core Validation ───
    function _validate() {
        var url = _baseUrl + '/' + S.a;
        var payload = JSON.stringify({
            licenseKey: _key,
            domain: window.location.hostname
        });

        _fetch(url, payload, function (data) {
            if (data && data.valid === true) {
                _token = data.heartbeatToken;
                _applyPayload(data.payload);
                _mounted = true;
                _cacheToken(data.payload);
                _startHeartbeat();
            } else {
                // Validation failed — try cache before locking
                if (!_tryCache()) {
                    _deployLock(data ? data.reason : 'Validation Failed');
                }
            }
        }, function () {
            // Network error — try 24-hour cache (fail-safe)
            if (!_tryCache()) {
                _deployLock('Network Error — Unable to verify license');
            }
        });
    }

    // ─── Apply the signed payload ───
    function _applyPayload(encoded) {
        try {
            var json = atob(encoded);
            var env = JSON.parse(json);
            // Inject CSS from the signed envelope
            var style = document.createElement('style');
            style.setAttribute('data-s', '1');
            style.textContent = env.c;
            document.head.appendChild(style);
        } catch (e) {
            _deployLock('Payload decode error');
        }
    }

    // ─── LocalStorage Cache (24-hour fail-safe) ───
    function _cacheToken(payload) {
        try {
            var obj = { p: payload, t: Date.now() };
            localStorage.setItem(S.f, JSON.stringify(obj));
        } catch (e) { /* storage disabled */ }
    }

    function _tryCache() {
        try {
            var raw = localStorage.getItem(S.f);
            if (!raw) return false;
            var obj = JSON.parse(raw);
            var age = Date.now() - obj.t;
            var MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
            if (age < MAX_AGE && obj.p) {
                _applyPayload(obj.p);
                _mounted = true;
                _startHeartbeat();
                return true;
            }
            // Cache expired — remove it
            localStorage.removeItem(S.f);
            return false;
        } catch (e) {
            return false;
        }
    }

    // ─── Heartbeat (random 45-90 second intervals) ───
    function _startHeartbeat() {
        function _beat() {
            // 1. Check for DevTools CSS overrides
            var root = document.getElementById(S.c.replace(/-/g, '-'));
            if (!root) root = document.getElementById('app-root');
            var styles = null;
            if (root) {
                var cs = window.getComputedStyle(root);
                styles = {
                    display: cs.getPropertyValue(S.k),
                    visibility: cs.getPropertyValue(S.n),
                    opacity: cs.getPropertyValue(S.o)
                };
            }

            var url = _baseUrl + '/' + S.b;
            var payload = JSON.stringify({
                licenseKey: _key,
                token: _token,
                computedStyles: styles,
                scriptDidMount: _mounted
            });

            _fetch(url, payload, function (data) {
                if (data) {
                    if (data.status === 'TAMPERED' || data.status === 'SUSPENDED') {
                        _mounted = false;
                        _clearCache();
                        _deployLock('License revoked: ' + (data.reason || data.status));
                        return;
                    }
                    if (data.status === 'EXPIRED') {
                        _mounted = false;
                        _clearCache();
                        _deployLock('License has expired. Contact your provider.');
                        return;
                    }
                    if (data.token) {
                        _token = data.token; // Rotate token
                    }
                }
                // Schedule next heartbeat (randomized 45-90s)
                var delay = 45000 + Math.floor(Math.random() * 45000);
                setTimeout(_beat, delay);
            }, function () {
                // Network error during heartbeat — don't kill the site,
                // just retry after a longer interval
                setTimeout(_beat, 120000);
            });
        }

        // First heartbeat after random 30-60s
        var initial = 30000 + Math.floor(Math.random() * 30000);
        setTimeout(_beat, initial);

        // ─── Passive DevTools Monitor ───
        _monitorOverrides();
    }

    // ─── DevTools Override Detection ───
    function _monitorOverrides() {
        // Check every 5 seconds if CSS was manually overridden
        setInterval(function () {
            if (!_mounted) return;
            var root = document.getElementById('app-root');
            if (!root) return;

            // Check if our <style data-s="1"> tag was removed
            var shield = document.querySelector('style[data-s="1"]');
            if (!shield) {
                // Someone removed our style tag — they're trying to replace it
                // Re-validate immediately
                _mounted = false;
                _validate();
                return;
            }

            // Check if an inline style was added directly to override
            var inlineDisplay = root.style.display;
            var inlineVisibility = root.style.visibility;
            var inlineOpacity = root.style.opacity;

            // If the element has inline styles that aren't from us, flag it
            if (inlineDisplay || inlineVisibility || inlineOpacity) {
                // Our script never sets inline styles — only injects a <style> tag
                // So any inline style presence is suspicious
                console.warn('[Nozris] Inline style override detected');
            }
        }, 5000);
    }

    // ─── Lock Screen (Kill Switch) ───
    function _deployLock(reason) {
        // Remove any existing content mounting styles
        var existing = document.querySelectorAll('style[data-s]');
        for (var i = 0; i < existing.length; i++) existing[i].remove();

        // Force-hide the app root
        var root = document.getElementById('app-root');
        if (root) {
            root.style.setProperty(S.k, S.l, 'important');
            root.style.setProperty(S.n, 'hidden', 'important');
            root.style.setProperty(S.o, '0', 'important');
        }

        // Create lock overlay
        var lock = document.createElement('div');
        lock.id = 'lsr-lock';
        lock.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483647;' +
            'background:#0a0a0a;display:flex;flex-direction:column;align-items:center;justify-content:center;' +
            'color:#ef4444;font-family:system-ui,sans-serif;text-align:center;padding:2rem;">' +
            '<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>' +
            '<line x1="12" y1="8" x2="12" y2="12"></line>' +
            '<line x1="12" y1="16" x2="12.01" y2="16"></line>' +
            '</svg>' +
            '<h1 style="font-size:1.8rem;margin:1.5rem 0 0.5rem;font-weight:800;letter-spacing:-0.02em;">ACCESS RESTRICTED</h1>' +
            '<p style="font-size:0.95rem;color:#71717a;max-width:400px;line-height:1.6;">' + (reason || 'License verification failed') + '</p>' +
            '<p style="margin-top:1.5rem;font-size:0.75rem;color:#3f3f46;">Ref: ' + btoa(window.location.hostname) + '</p>' +
            '</div>';
        document.body.appendChild(lock);
    }

    // ─── Helpers ───
    function _clearCache() {
        try { localStorage.removeItem(S.f); } catch (e) { }
    }

    function _fetch(url, body, onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        xhr.open(S.i, url, true);
        xhr.setRequestHeader(_d(_0x.g), _d(_0x.h));
        xhr.timeout = 15000;
        xhr.onload = function () {
            try {
                var data = JSON.parse(xhr.responseText);
                onSuccess(data);
            } catch (e) {
                onError();
            }
        };
        xhr.onerror = onError;
        xhr.ontimeout = onError;
        xhr.send(body);
    }

    // ─── Anti-Tamper: Detect script removal via MutationObserver ───
    function _watchDom() {
        if (typeof MutationObserver === 'undefined') return;
        var observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var removed = mutations[i].removedNodes;
                for (var j = 0; j < removed.length; j++) {
                    var node = removed[j];
                    // If someone removes our style tag
                    if (node.nodeType === 1 && node.getAttribute && node.getAttribute('data-s') === '1') {
                        _mounted = false;
                        _deployLock('Security component removed');
                        return;
                    }
                }
            }
        });
        observer.observe(document.head, { childList: true });
        observer.observe(document.body, { childList: true });
    }

    // ─── Boot ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { _init(); _watchDom(); });
    } else {
        _init();
        _watchDom();
    }
})();
