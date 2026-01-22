/**
 * 🧙‍♂️ TGBrowser System Mod: Shaman's Developer Tools v3.1 (Beta 6 Edition)
 * TGUID: workshop.shaman.devkitui
 * Target: TGBrowser Beta 6 (Specific DOM Targeting)
 * Features: Deep UI Inspection, Ritual Detection, Data Barrier Monitoring
 */

(function() {
    'use strict';

    // 1. Manifest
    const manifest = {
        tguid: "workshop.shaman.devkitui",
        name: "Shaman's DevKit",
        version: "3.1-beta6", 
        author: "Shaman's Workshop",
        type: "system_monitor",
        description: "Deep system monitoring for TGBrowser Beta 6 Architecture"
    };

    // State tracking
    let devState = {
        activePlugs: [],
        browserFeatures: {},
        lastUpdate: null,
        browserVersion: "Detecting..."
    };

    // 2. Registration Ritual
    function startPlug() {
        if (window.TGMoLink && window.TGMoLink.register) {
            const success = window.TGMoLink.register(manifest.tguid);
            
            if (success) {
                console.log(`✨ [${manifest.name}] Linked to Kernel - v${manifest.version}`);
                setTimeout(() => {
                    detectRealVersion();
                    initDevTools();
                    startMonitoring();
                }, 200);
            } else {
                console.error(`[${manifest.name}] Registration failed.`);
            }
        } else {
            setTimeout(startPlug, 100);
        }
    }

    // 3. Environment Intelligence (Targeting Beta 6 DOM)
    function detectRealVersion() {
        // Strategy 1: scrape the version span in the menu header
        // In Beta 6 HTML: <div class="menu-header">...<span>v26.01.22 (Beta 6)</span></div>
        const headerSpans = document.querySelectorAll('.menu-header span');
        let foundVersion = null;

        headerSpans.forEach(span => {
            if (span.textContent.includes('v') && span.textContent.includes('Beta')) {
                foundVersion = span.textContent.trim();
            }
        });

        // Strategy 2: Check Document Title
        if (!foundVersion) {
            foundVersion = document.title; 
        }

        if (foundVersion) {
            devState.browserVersion = foundVersion; 
        } else {
            devState.browserVersion = "Unknown TGBrowser Build";
        }
        
        console.log(`🕵️ [DevKit] Identified Host: ${devState.browserVersion}`);
    }

    // 4. Main Initialization
    function initDevTools() {
        ensureFonts();
        injectDevUI();
        setupEventListeners();
        updateBrowserState();
        console.log(`🛠️ [${manifest.name}] UI Injection Complete`);
    }

    function ensureFonts() {
        if (!document.querySelector('link[href*="Material+Icons+Round"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons+Round';
            document.head.appendChild(link);
        }
    }

    // 5. Material You UI Injection
    function injectDevUI() {
        const oldUI = document.getElementById('shaman-dev-ui');
        if (oldUI) oldUI.remove();
        
        // Dynamic Styles based on host variables
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --dk-sys-primary: var(--primary, #d0bcff); /* Inherit from Host */
                --dk-sys-surface: rgba(20, 18, 24, 0.9);
                --dk-sys-surface-variant: rgba(255, 255, 255, 0.05);
                --dk-sys-outline: rgba(255, 255, 255, 0.2);
            }

            .shaman-dev-overlay {
                position: fixed; 
                top: 50%; left: 50%; 
                transform: translate(-50%, -50%) scale(0.95);
                opacity: 0;
                width: 420px; 
                max-height: 80vh;
                background: var(--dk-sys-surface); 
                backdrop-filter: blur(24px) saturate(180%);
                border: 1px solid var(--dk-sys-outline);
                border-radius: 28px;
                color: #e6e1e5; 
                z-index: 999999;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                display: none; 
                font-family: 'Segoe UI', Roboto, sans-serif;
                overflow: hidden;
                transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0, 0, 1);
            }

            .shaman-dev-overlay.visible {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            
            .shaman-dev-header {
                padding: 24px 24px 16px 24px;
                display: flex; justify-content: space-between; align-items: flex-start;
            }

            .header-title h2 {
                margin: 0; font-size: 20px; font-weight: 500;
                color: var(--dk-sys-primary);
                display: flex; align-items: center; gap: 8px;
            }
            
            .header-subtitle {
                font-size: 11px; color: #cac4d0; opacity: 0.7;
                margin-top: 6px; font-family: monospace; letter-spacing: 0.5px;
            }

            .close-btn {
                background: transparent; border: none; color: #e6e1e5;
                cursor: pointer; padding: 4px; border-radius: 50%;
            }
            .close-btn:hover { background: rgba(255,255,255,0.1); }
            
            .shaman-dev-body { padding: 0 24px 24px 24px; overflow-y: auto; max-height: 60vh; }

            .dev-card {
                background: var(--dk-sys-surface-variant);
                border-radius: 16px; padding: 16px; margin-bottom: 12px;
                border: 1px solid rgba(255,255,255,0.02);
            }

            .card-label {
                font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px;
                color: var(--dk-sys-primary); margin-bottom: 12px; font-weight: 700;
                opacity: 0.8;
            }

            .info-grid { display: grid; gap: 8px; }
            
            .info-item {
                display: flex; justify-content: space-between; align-items: center;
                font-size: 13px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
            }
            .info-item:last-child { border-bottom: none; }

            .val-pill {
                padding: 2px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;
                background: rgba(255,255,255,0.1); font-family: monospace;
            }
            .val-pill.on { background: rgba(182, 242, 186, 0.15); color: #b6f2ba; border: 1px solid rgba(182, 242, 186, 0.3); }
            .val-pill.off { background: rgba(255, 180, 171, 0.15); color: #ffb4ab; border: 1px solid rgba(255, 180, 171, 0.3); }
            .val-pill.warn { background: rgba(255, 220, 100, 0.15); color: #ffe088; }

            .action-bar { display: flex; gap: 8px; margin-top: 16px; }
            
            .btn-act {
                flex: 1; padding: 10px; border: none; border-radius: 8px;
                font-size: 12px; font-weight: 600; cursor: pointer;
                background: rgba(255,255,255,0.05); color: var(--dk-sys-primary);
                transition: background 0.2s;
            }
            .btn-act:hover { background: rgba(255,255,255,0.1); }
        `;
        document.head.appendChild(style);

        const ui = document.createElement('div');
        ui.id = 'shaman-dev-ui';
        ui.className = 'shaman-dev-overlay';
        
        ui.innerHTML = `
            <div class="shaman-dev-header">
                <div class="header-title">
                    <h2><i class="material-icons-round">build_circle</i> DevKit</h2>
                    <div class="header-subtitle">HOST: ${devState.browserVersion}</div>
                </div>
                <button class="close-btn" onclick="window.toggleDevUI()">
                    <i class="material-icons-round">close</i>
                </button>
            </div>
            
            <div class="shaman-dev-body">
                <div class="dev-card">
                    <div class="card-label">Core Features</div>
                    <div id="dk-feature-grid" class="info-grid"></div>
                </div>

                <div class="dev-card">
                    <div class="card-label">Visual Engine</div>
                    <div id="dk-visual-grid" class="info-grid"></div>
                </div>
                
                <div class="dev-card">
                    <div class="card-label">TGMoLink Bus (<span id="dk-plug-count">0</span>)</div>
                    <div id="dk-plug-list" style="font-size:12px; opacity:0.7; padding:4px 0;"></div>
                </div>
                
                <div class="action-bar">
                    <button class="btn-act" onclick="window.refreshDevPanel()">REFRESH STATE</button>
                    <button class="btn-act" onclick="window.exportDevData()">DUMP JSON</button>
                </div>
            </div>
        `;
        document.body.appendChild(ui);
        
        // Add a trigger if it doesn't exist in the menu
        injectMenuTrigger();
    }

    function injectMenuTrigger() {
        const menuContent = document.getElementById('menuContent');
        if (menuContent && !document.getElementById('dk-menu-item')) {
            const btn = document.createElement('div');
            btn.id = 'dk-menu-item';
            btn.className = 'menu-item';
            btn.style.cssText = "margin-top: 8px; border-top: 1px solid var(--border);";
            btn.innerHTML = `<span>🔧 Open DevKit</span>`;
            btn.onclick = () => {
                window.toggleDevUI();
                menuContent.style.display = 'none'; // Close host menu
            };
            menuContent.appendChild(btn);
        }
    }

    // 6. Deep State Analysis (Beta 6 Specifics)
    function updateBrowserState() {
        devState.lastUpdate = new Date();
        
        // -- DETECTING SPECIFIC BETA 6 ELEMENTS --
        
        // 1. TGRitual (Theme Engine)
        // Checks body class for 'ritual-*'
        const bodyClasses = Array.from(document.body.classList);
        const ritual = bodyClasses.find(c => c.startsWith('ritual-')) || 'Default (MD2)';

        // 2. Anti-Cookies (Data Barrier)
        // ID: dataBarrierToggle
        const barrierEl = document.getElementById('dataBarrierToggle');
        const barrierActive = barrierEl ? barrierEl.checked : false;

        // 3. TGChroma (Primary Color)
        // CSS Var: --primary
        const chromaColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();

        // 4. Night Mode
        const darkMode = document.body.classList.contains('dark-mode');

        // 5. Iframe Context
        const currentIframe = document.getElementById('browser');
        const currentUrl = currentIframe ? currentIframe.src : "TGHome (Idle)";

        devState.browserFeatures = {
            ritual: ritual.replace('ritual-', '').toUpperCase(),
            dataBarrier: barrierActive,
            nightMode: darkMode,
            chroma: chromaColor,
            url: currentUrl,
            sandbox: currentIframe ? currentIframe.getAttribute('sandbox') : 'N/A'
        };
        
        // Get Plugs
        devState.activePlugs = window.TGMoLink?.plugs || [];
        
        renderPanelContent();
    }

    function renderPanelContent() {
        const fGrid = document.getElementById('dk-feature-grid');
        const vGrid = document.getElementById('dk-visual-grid');
        const feat = devState.browserFeatures;

        // Core Features Render
        fGrid.innerHTML = `
            <div class="info-item">
                <span>Anti-Cookie Barrier</span>
                <span class="val-pill ${feat.dataBarrier ? 'on' : 'off'}">
                    ${feat.dataBarrier ? 'ACTIVE' : 'DISABLED'}
                </span>
            </div>
            <div class="info-item">
                <span>Sandbox Level</span>
                <span class="val-pill" style="max-width: 150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                    ${feat.dataBarrier ? 'STRICT' : 'STANDARD'}
                </span>
            </div>
            <div class="info-item">
                <span>Active Thread</span>
                <span class="val-pill" style="font-size:10px; max-width:180px; overflow:hidden; text-overflow:ellipsis;">
                    ${feat.url.replace('https://','')}
                </span>
            </div>
        `;

        // Visual Engine Render
        vGrid.innerHTML = `
            <div class="info-item">
                <span>TGRitual Engine</span>
                <span class="val-pill warn">${feat.ritual}</span>
            </div>
            <div class="info-item">
                <span>Dark AMOLED</span>
                <span class="val-pill ${feat.nightMode ? 'on' : 'off'}">
                    ${feat.nightMode ? 'ON' : 'OFF'}
                </span>
            </div>
            <div class="info-item">
                <span>TGChroma Hex</span>
                <div style="display:flex; align-items:center; gap:6px;">
                    <div style="width:12px; height:12px; border-radius:50%; background:${feat.chroma}; border:1px solid #fff;"></div>
                    <span style="font-family:monospace; font-size:11px;">${feat.chroma}</span>
                </div>
            </div>
        `;

        // Plug List Render
        document.getElementById('dk-plug-count').textContent = devState.activePlugs.length;
        document.getElementById('dk-plug-list').innerHTML = devState.activePlugs.length 
            ? devState.activePlugs.map(p => `<div>• ${p}</div>`).join('') 
            : 'No external mods loaded.';
    }

    // 7. Watchers
    function setupEventListeners() {
        // Watch for user toggling switches in the main menu
        const observer = new MutationObserver(() => {
            if (document.getElementById('shaman-dev-ui').style.display !== 'none') {
                updateBrowserState();
            }
        });
        
        // Observer config to watch body classes (Dark mode/Ritual) and attributes
        observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
        
        // Listen to toggle clicks specifically
        document.addEventListener('change', (e) => {
            if (e.target.matches('#dataBarrierToggle, #darkModeToggle, #ritualSelect, #chromaPicker')) {
                setTimeout(updateBrowserState, 50); // Small delay to let DOM update
            }
        });
    }

    function startMonitoring() {
        // Polling fallback
        setInterval(() => {
            if (document.getElementById('shaman-dev-ui').style.display !== 'none') {
                updateBrowserState();
            }
        }, 1500);
    }

    // 8. Public API
    window.toggleDevUI = function() {
        const ui = document.getElementById('shaman-dev-ui');
        if (!ui) return;
        
        if (ui.style.display === 'block') {
            ui.classList.remove('visible');
            setTimeout(() => ui.style.display = 'none', 200);
        } else {
            detectRealVersion(); // Re-check version on open
            ui.style.display = 'block';
            setTimeout(() => ui.classList.add('visible'), 10);
            updateBrowserState();
        }
    };

    window.refreshDevPanel = function() {
        updateBrowserState();
    };

    window.exportDevData = function() {
        const data = {
            host: devState.browserVersion,
            timestamp: new Date().toISOString(),
            features: devState.browserFeatures,
            mods: devState.activePlugs
        };
        const json = JSON.stringify(data, null, 2);
        
        // Modern Copy
        navigator.clipboard.writeText(json).then(() => {
            alert("DevData Dump copied to clipboard!");
        }).catch(err => {
            console.error("Copy failed", err);
            alert("Failed to copy dump.");
        });
    };

    // 9. Launch
    startPlug();

})();
