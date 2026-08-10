import { profileData } from '../data/profile.js';
import { projectData } from '../data/projects.js';

export class OSLayer {
    constructor(windowManager, finderApp, terminalApp, browserApp, resumeApp, contactApp) {
        this.windowManager = windowManager;
        this.finderApp = finderApp;
        this.terminalApp = terminalApp;
        this.browserApp = browserApp;
        this.resumeApp = resumeApp;
        this.contactApp = contactApp;
        
        this.initBootScreen();
        this.initSpotlight();
        this.initContextMenu();
        this.initMenuBar();
        this.initEasterEggs();
        this.initTheme();
    }

    /* --------------------------------------------------- */
    /* Boot Screen */
    /* --------------------------------------------------- */
    initBootScreen() {
        const bootScreen = document.getElementById('boot-screen');
        if (!bootScreen) return;

        // Only show boot screen once per session
        if (sessionStorage.getItem('booted') === 'true') {
            bootScreen.classList.add('hidden');
            return;
        }

        const skipBoot = () => {
            bootScreen.classList.add('hidden');
            sessionStorage.setItem('booted', 'true');
            document.removeEventListener('keydown', skipBoot);
            document.removeEventListener('click', skipBoot);
        };

        document.addEventListener('keydown', skipBoot);
        document.addEventListener('click', skipBoot);

        setTimeout(skipBoot, 1500); // Auto skip after 1.5s
    }

    /* --------------------------------------------------- */
    /* Notifications */
    /* --------------------------------------------------- */
    notify(title, message, duration = 4000) {
        const container = document.getElementById('notifications-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.innerHTML = `
            <div class="notif-title">${title}</div>
            <div class="notif-msg">${message}</div>
        `;

        container.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300); // Match CSS transition
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, duration);
        }
    }

    /* --------------------------------------------------- */
    /* Spotlight Search */
    /* --------------------------------------------------- */
    initSpotlight() {
        this.spotlightOverlay = document.getElementById('spotlight-overlay');
        this.spotlightInput = document.getElementById('spotlight-input');
        this.spotlightResults = document.getElementById('spotlight-results');
        
        if (!this.spotlightOverlay || !this.spotlightInput) return;

        document.addEventListener('keydown', (e) => {
            // Cmd+Space or Ctrl+Space
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                this.toggleSpotlight();
            }
            
            // Escape to close
            if (e.code === 'Escape' && this.spotlightOverlay.classList.contains('visible')) {
                this.closeSpotlight();
            }
        });

        this.spotlightOverlay.addEventListener('click', (e) => {
            if (e.target === this.spotlightOverlay) {
                this.closeSpotlight();
            }
        });

        this.spotlightInput.addEventListener('input', () => this.handleSpotlightSearch());
    }

    toggleSpotlight() {
        if (this.spotlightOverlay.classList.contains('visible')) {
            this.closeSpotlight();
        } else {
            this.spotlightOverlay.classList.add('visible');
            this.spotlightInput.value = '';
            this.spotlightResults.innerHTML = '';
            setTimeout(() => this.spotlightInput.focus(), 50);
        }
    }

    closeSpotlight() {
        this.spotlightOverlay.classList.remove('visible');
        this.spotlightInput.blur();
    }

    handleSpotlightSearch() {
        const query = this.spotlightInput.value.toLowerCase().trim();
        this.spotlightResults.innerHTML = '';
        
        if (!query) return;

        const results = [];

        // Search Apps
        const apps = ['Terminal', 'Finder', 'Safari', 'Resume', 'Contact', 'Projects', 'About Me'];
        apps.forEach(app => {
            if (app.toLowerCase().includes(query)) {
                results.push({
                    title: app,
                    type: 'Application',
                    icon: '📱',
                    action: () => {
                        if (app === 'Terminal') this.terminalApp.open();
                        else if (app === 'Finder') this.finderApp.open();
                        else if (app === 'Safari') this.browserApp.open();
                        else if (app === 'Resume') this.resumeApp.open();
                        else if (app === 'Contact') this.contactApp.open();
                        else if (app === 'Projects') this.finderApp.open('/Projects');
                        else if (app === 'About Me') {
                            const btn = document.querySelector('[data-app="about"]');
                            if(btn) btn.click();
                        }
                    }
                });
            }
        });

        // Search Projects
        projectData.forEach(proj => {
            if (proj.name.toLowerCase().includes(query) || proj.description.toLowerCase().includes(query)) {
                results.push({
                    title: proj.name,
                    type: 'Project',
                    icon: '🚀',
                    action: () => {
                        this.finderApp.open(`/Projects/${proj.name}`);
                    }
                });
            }
        });

        // Search Skills
        Object.values(profileData.skills).flat().forEach(skill => {
            if (skill.toLowerCase().includes(query)) {
                results.push({
                    title: skill,
                    type: 'Skill',
                    icon: '⚡',
                    action: () => {
                        const btn = document.querySelector('[data-app="about"]');
                        if (btn) btn.click();
                    }
                });
            }
        });

        // Search Experience & Extracurriculars
        [...profileData.experience, ...profileData.extracurriculars].forEach(item => {
            if (item.title.toLowerCase().includes(query) || (item.company && item.company.toLowerCase().includes(query)) || (item.organization && item.organization.toLowerCase().includes(query))) {
                results.push({
                    title: item.title,
                    type: 'Experience',
                    icon: '💼',
                    action: () => {
                        this.resumeApp.open();
                    }
                });
            }
        });

        // Render Results
        // Take top 6
        results.slice(0, 6).forEach((result, idx) => {
            const item = document.createElement('div');
            item.className = 'spotlight-result-item';
            item.innerHTML = `
                <span class="spotlight-result-icon">${result.icon}</span>
                <span class="spotlight-result-title">${result.title}</span>
                <span class="spotlight-result-type">${result.type}</span>
            `;
            item.addEventListener('click', () => {
                this.closeSpotlight();
                result.action();
            });
            this.spotlightResults.appendChild(item);
        });
        
        if (results.length === 0) {
            this.spotlightResults.innerHTML = `<div style="padding: 12px 24px; opacity: 0.5; color: var(--theme-text);">No results found.</div>`;
        }
    }

    /* --------------------------------------------------- */
    /* Context Menu */
    /* --------------------------------------------------- */
    initContextMenu() {
        const desktop = document.querySelector('.desktop');
        const contextMenu = document.getElementById('context-menu');
        
        if (!desktop || !contextMenu) return;

        desktop.addEventListener('contextmenu', (e) => {
            // Only trigger on the main desktop area, not on windows or icons
            if (e.target.closest('.window') || e.target.closest('.desktop-icon')) return;
            
            e.preventDefault();
            
            // Constrain to viewport
            let x = e.clientX;
            let y = e.clientY;
            
            const menuWidth = 200;
            const menuHeight = 250;
            
            if (x + menuWidth > window.innerWidth) x -= menuWidth;
            if (y + menuHeight > window.innerHeight) y -= menuHeight;
            
            contextMenu.style.left = `${x}px`;
            contextMenu.style.top = `${y}px`;
            contextMenu.classList.add('visible');
        });

        document.addEventListener('click', () => {
            contextMenu.classList.remove('visible');
        });

        document.getElementById('ctx-new-folder')?.addEventListener('click', () => {
            this.notify('Desktop', 'Cannot create folders on a read-only portfolio filesystem.');
        });
        
        document.getElementById('ctx-refresh')?.addEventListener('click', () => {
            window.location.reload();
        });

        document.getElementById('ctx-wallpaper')?.addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('ctx-terminal')?.addEventListener('click', () => {
            this.terminalApp.open();
        });

        document.getElementById('ctx-finder')?.addEventListener('click', () => {
            this.finderApp.open();
        });
        
        document.getElementById('ctx-about')?.addEventListener('click', () => {
            this.openAboutMac();
        });
    }

    /* --------------------------------------------------- */
    /* Menu Bar & Shortcuts */
    /* --------------------------------------------------- */
    initMenuBar() {
        const appleIcon = document.querySelector('.apple-icon');
        let appleClicks = 0;
        let appleClickTimer;

        if (appleIcon) {
            appleIcon.addEventListener('click', () => {
                appleClicks++;
                clearTimeout(appleClickTimer);
                appleClickTimer = setTimeout(() => {
                    if (appleClicks === 1) {
                        this.openAboutMac();
                    } else if (appleClicks >= 5) {
                        this.notify('System Diagnostics', 'All systems operational. Easter egg unlocked! 👀');
                    }
                    appleClicks = 0;
                }, 300);
            });
        }
        
        // Global Shortcuts
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K (Terminal)
            if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
                e.preventDefault();
                this.terminalApp.open();
            }
            // Cmd/Ctrl + Shift + F (Finder)
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyF') {
                e.preventDefault();
                this.finderApp.open();
            }
            // Cmd/Ctrl + Shift + R (Resume)
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyR') {
                e.preventDefault();
                this.resumeApp.open();
            }
        });
    }

    /* --------------------------------------------------- */
    /* About This Mac & Settings */
    /* --------------------------------------------------- */
    openAboutMac() {
        const html = `
            <div class="about-mac-container">
                <div class="about-mac-logo">🍎</div>
                <div class="about-mac-title">Nitin's Mac</div>
                <div class="about-mac-specs">
                    <strong>System:</strong> NitinOS Portfolio<br>
                    <strong>Engine:</strong> HTML / CSS / Vanilla JS<br>
                    <strong>Environment:</strong> Static Web Application<br>
                    <strong>Version:</strong> 1.0 (Phase 9)
                </div>
                <button class="about-mac-btn" onclick="document.querySelector('#window-about-mac .close-btn').click()">Close</button>
            </div>
        `;
        this.windowManager.open('about-mac', 'About This Mac', html);
    }

    openSettings() {
        const html = `
            <div class="settings-container" id="settings-app">
                <div class="settings-section">
                    <h3>Appearance</h3>
                    <div class="settings-option" id="btn-theme-dark">
                        <span>Dark Mode</span>
                        <span class="indicator"></span>
                    </div>
                    <div class="settings-option" id="btn-theme-light">
                        <span>Light Mode</span>
                        <span class="indicator"></span>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Wallpaper</h3>
                    <div class="settings-option" id="btn-wall-default">
                        <span>Default (Monterey)</span>
                        <span class="indicator"></span>
                    </div>
                    <div class="settings-option" id="btn-wall-minimal">
                        <span>Minimal Dark</span>
                        <span class="indicator"></span>
                    </div>
                    <div class="settings-option" id="btn-wall-gradient">
                        <span>Dynamic Gradient</span>
                        <span class="indicator"></span>
                    </div>
                </div>
            </div>
        `;
        this.windowManager.open('settings', 'System Settings', html);

        setTimeout(() => {
            const container = document.getElementById('settings-app');
            if (!container) return;

            // Theme handlers
            container.querySelector('#btn-theme-dark').onclick = () => this.setTheme('dark');
            container.querySelector('#btn-theme-light').onclick = () => this.setTheme('light');

            // Wallpaper handlers
            container.querySelector('#btn-wall-default').onclick = () => this.setWallpaper('default');
            container.querySelector('#btn-wall-minimal').onclick = () => this.setWallpaper('minimal');
            container.querySelector('#btn-wall-gradient').onclick = () => this.setWallpaper('gradient');
            
        }, 50);
    }

    /* --------------------------------------------------- */
    /* Theme & Wallpaper Logic */
    /* --------------------------------------------------- */
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedWall = localStorage.getItem('wallpaper') || 'default';
        this.setTheme(savedTheme);
        this.setWallpaper(savedWall);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    setWallpaper(wall) {
        const desktop = document.querySelector('.desktop');
        if (!desktop) return;
        
        desktop.classList.remove('wall-default', 'wall-minimal', 'wall-gradient');
        
        if (wall === 'default') {
            desktop.style.background = 'url("assets/wallpaper/mac-wallpaper.png") center/cover no-repeat, linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
        } else if (wall === 'minimal') {
            desktop.style.background = '#111';
        } else if (wall === 'gradient') {
            desktop.style.background = 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)';
        }
        
        localStorage.setItem('wallpaper', wall);
    }

    /* --------------------------------------------------- */
    /* Konami Code Easter Egg */
    /* --------------------------------------------------- */
    initEasterEggs() {
        let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        let konamiPosition = 0;

        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiPosition]) {
                konamiPosition++;
                if (konamiPosition === konamiCode.length) {
                    this.notify('Developer Mode', 'Konami code accepted! You found an easter egg! 🎮');
                    this.setWallpaper('gradient');
                    konamiPosition = 0;
                }
            } else {
                konamiPosition = 0;
            }
        });
    }
}
