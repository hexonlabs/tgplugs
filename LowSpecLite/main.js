// TGPlug: Performance Ritual (Low-Spec Mode)
// TGUID: workshop.shaman.performance
// Author: Master Shaman

(function() {
    'use strict';
    
    const MOD_ID = 'workshop.shaman.performance';
    
    // --- 1. Secure Initialization Pattern ---
    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            const success = window.TGMoLink.register(MOD_ID);
            if (success) {
                console.log(`[${MOD_ID}] Optimizer Loaded. ⚡`);
                initPerformanceMode();
            }
        } else {
            // Wait for TGMoLink
            setTimeout(startPlug, 100);
        }
    }

    // --- 2. Core Logic ---
    function initPerformanceMode() {
        injectMenuOption();
        setupEventListeners();
        
        // Run auto-detection
        if (TGPerformanceDetector.detect()) {
            activateMode();
        }
    }

    function injectMenuOption() {
        const select = document.getElementById('ritualSelect');
        if (!select) return;

        // Prevent duplicates
        if ([...select.options].some(o => o.value === 'performance')) return;

        const option = document.createElement('option');
        option.value = 'performance';
        option.textContent = 'Low-Spec Mode (Optimized)';
        
        // Insert after Matrix Mode (or at end if not found)
        const matrixOpt = select.querySelector('option[value="matrix"]');
        if (matrixOpt && matrixOpt.nextSibling) {
            select.insertBefore(option, matrixOpt.nextSibling);
        } else {
            select.appendChild(option);
        }
    }

    function setupEventListeners() {
        const select = document.getElementById('ritualSelect');
        if (!select) return;

        // We need to listen for changes to manually toggle our class
        // because the base browser only knows about standard themes
        select.addEventListener('change', (e) => {
            if (e.target.value === 'performance') {
                document.body.classList.add('ritual-performance');
                showNotification("⚡ Performance Mode Enabled");
            } else {
                document.body.classList.remove('ritual-performance');
            }
        });
    }

    function activateMode() {
        const select = document.getElementById('ritualSelect');
        if (select) {
            select.value = 'performance';
            // Trigger change event so base browser clears other themes
            select.dispatchEvent(new Event('change'));
        }
        document.body.classList.add('ritual-performance');
    }
    
    function showNotification(msg) {
        // Simple toaster for feedback
        const notif = document.createElement('div');
        notif.style.cssText = `
            position: fixed; top: 80px; right: 20px;
            background: #333; color: #fff; padding: 10px 20px;
            border-radius: 8px; z-index: 10000; font-size: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            animation: fadeIn 0.3s ease-out;
        `;
        notif.textContent = msg;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.opacity = 0;
            setTimeout(() => notif.remove(), 500);
        }, 3000);
    }

    // --- 3. Detection Engine (from code2.txt) ---
    const TGPerformanceDetector = {
        detect: function() {
            const checks = {
                isTV: this.checkIfTV(),
                lowRAM: this.checkRAM(),
                weakGPU: this.checkGPU(),
                // Added a check for saved preference
                isSaved: localStorage.getItem('tgRitual') === 'performance'
            };
            
            // If saved as performance, return true immediately
            if (checks.isSaved) return true;

            const isLowEnd = checks.isTV || checks.lowRAM || checks.weakGPU;
            
            if (isLowEnd) {
                console.log('[TGPlug] 🥔 Potato device detected. Optimizing...');
            }
            return isLowEnd;
        },
        
        checkIfTV: function() {
            const ua = navigator.userAgent.toLowerCase();
            const tvKeywords = ['smart-tv', 'smarttv', 'googletv', 'appletv', 'roku', 'webos', 'tizen'];
            return tvKeywords.some(k => ua.includes(k));
        },
        
        checkRAM: function() {
            // If deviceMemory API exists and is < 4GB
            return (navigator.deviceMemory && navigator.deviceMemory < 4);
        },
        
        checkGPU: function() {
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl');
                if (!gl) return true; // No WebGL = Weak
                
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    // Check for common weak mobile/integrated GPUs
                    return /mali|adreno|videocore|intel hd|intel uhd/i.test(renderer);
                }
            } catch (e) { return true; }
            return false;
        }
    };

    // Start
    startPlug();

})();