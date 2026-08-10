import { fileSystem, getFileSystemNode, searchFileSystem } from '../data/filesystem.js';
import { renderProjectDetail } from '../data/projects.js';

export class BrowserApp {
    constructor(windowManager, aboutApp) {
        this.windowManager = windowManager;
        this.aboutApp = aboutApp;
        this.tabs = [];
        this.activeTabId = null;
        this.tabCounter = 0;
    }

    open(initialUrl = '') {
        const html = `
            <div id="browser-app" class="browser-container">
                <div class="browser-tab-bar" id="browser-tab-bar">
                    <!-- Tabs rendered here -->
                    <button class="browser-new-tab" id="browser-new-tab" aria-label="New Tab">+</button>
                </div>
                <div class="browser-toolbar">
                    <button class="browser-nav-btn" id="browser-back" aria-label="Back">←</button>
                    <button class="browser-nav-btn" id="browser-forward" aria-label="Forward">→</button>
                    <button class="browser-nav-btn" id="browser-reload" aria-label="Reload">↻</button>
                    <button class="browser-nav-btn" id="browser-home" aria-label="Home">🏠</button>
                    <div class="browser-address-container">
                        <input type="text" id="browser-address" class="browser-address-input" spellcheck="false" autocomplete="off" aria-label="Address">
                    </div>
                </div>
                <div class="browser-loading-bar" id="browser-loading"></div>
                <div class="browser-content-area" id="browser-content-area">
                    <!-- Tab contents rendered here -->
                </div>
            </div>
        `;

        this.windowManager.open('safari', 'Safari', html);

        setTimeout(() => {
            this.container = document.getElementById('browser-app');
            this.tabBar = document.getElementById('browser-tab-bar');
            this.contentArea = document.getElementById('browser-content-area');
            this.btnBack = document.getElementById('browser-back');
            this.btnForward = document.getElementById('browser-forward');
            this.btnReload = document.getElementById('browser-reload');
            this.btnHome = document.getElementById('browser-home');
            this.btnNewTab = document.getElementById('browser-new-tab');
            this.addressInput = document.getElementById('browser-address');
            this.loadingBar = document.getElementById('browser-loading');

            if (this.container) {
                this.attachEvents();
                // Ensure at least one tab is open
                if (this.tabs.length === 0) {
                    this.createTab(initialUrl || 'nitinrepswal.dev');
                } else {
                    this.renderTabs(); // Re-render if reopening
                    this.updateToolbar();
                }
            }
        }, 0);
    }

    attachEvents() {
        this.btnNewTab.addEventListener('click', () => this.createTab('nitinrepswal.dev'));
        this.btnHome.addEventListener('click', () => this.navigateActiveTab('nitinrepswal.dev'));
        this.btnBack.addEventListener('click', () => this.getActiveTab()?.goBack());
        this.btnForward.addEventListener('click', () => this.getActiveTab()?.goForward());
        this.btnReload.addEventListener('click', () => this.getActiveTab()?.reload());

        this.addressInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.navigateActiveTab(this.addressInput.value.trim());
                this.addressInput.blur();
            }
        });

        // Browser level shortcuts
        this.container.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 't') {
                    e.preventDefault();
                    this.createTab('nitinrepswal.dev');
                } else if (e.key === 'w') {
                    e.preventDefault();
                    if (this.activeTabId) this.closeTab(this.activeTabId);
                } else if (e.key === 'l') {
                    e.preventDefault();
                    this.addressInput.focus();
                    this.addressInput.select();
                } else if (e.key === 'r') {
                    e.preventDefault();
                    this.getActiveTab()?.reload();
                }
            }
        });
        
        // Ensure browser container can receive key events if clicked
        this.container.tabIndex = -1;
    }

    createTab(url) {
        const id = 'tab-' + (++this.tabCounter);
        const tab = new BrowserTab(id, this);
        this.tabs.push(tab);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'browser-tab-content';
        contentDiv.id = `content-${id}`;
        this.contentArea.appendChild(contentDiv);

        tab.setContentElement(contentDiv);
        this.activateTab(id);
        tab.navigate(url);
    }

    closeTab(id) {
        const index = this.tabs.findIndex(t => t.id === id);
        if (index === -1) return;

        // Remove DOM element
        const contentDiv = document.getElementById(`content-${id}`);
        if (contentDiv) contentDiv.remove();

        this.tabs.splice(index, 1);

        if (this.tabs.length === 0) {
            this.windowManager.close('safari');
        } else if (this.activeTabId === id) {
            // Activate adjacent tab
            const newIndex = Math.max(0, index - 1);
            this.activateTab(this.tabs[newIndex].id);
        } else {
            this.renderTabs();
        }
    }

    activateTab(id) {
        this.activeTabId = id;
        this.tabs.forEach(t => {
            const el = document.getElementById(`content-${t.id}`);
            if (el) {
                if (t.id === id) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });
        this.renderTabs();
        this.updateToolbar();
    }

    getActiveTab() {
        return this.tabs.find(t => t.id === this.activeTabId);
    }

    renderTabs() {
        // Remove existing tab elements (keep the + button)
        Array.from(this.tabBar.children).forEach(child => {
            if (child.id !== 'browser-new-tab') {
                child.remove();
            }
        });

        this.tabs.forEach(tab => {
            const tabEl = document.createElement('div');
            tabEl.className = `browser-tab ${tab.id === this.activeTabId ? 'active' : ''}`;
            
            const titleEl = document.createElement('span');
            titleEl.className = 'browser-tab-title';
            titleEl.textContent = tab.title || 'Loading...';
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'browser-tab-close';
            closeBtn.innerHTML = '×';
            closeBtn.onclick = (e) => {
                e.stopPropagation();
                this.closeTab(tab.id);
            };

            tabEl.onclick = () => this.activateTab(tab.id);

            tabEl.appendChild(titleEl);
            tabEl.appendChild(closeBtn);
            this.tabBar.insertBefore(tabEl, this.btnNewTab);
        });
    }

    updateToolbar() {
        const tab = this.getActiveTab();
        if (!tab) return;

        this.addressInput.value = tab.currentUrl;
        this.btnBack.disabled = !tab.canGoBack();
        this.btnForward.disabled = !tab.canGoForward();
    }

    navigateActiveTab(url) {
        const tab = this.getActiveTab();
        if (tab) tab.navigate(url);
    }

    showLoading() {
        this.loadingBar.style.opacity = '1';
        this.loadingBar.style.width = '30%';
        setTimeout(() => { this.loadingBar.style.width = '70%'; }, 100);
    }

    hideLoading() {
        this.loadingBar.style.width = '100%';
        setTimeout(() => {
            this.loadingBar.style.opacity = '0';
            setTimeout(() => { this.loadingBar.style.width = '0%'; }, 200);
        }, 200);
    }
    
    // Allow internal links in rendered content to navigate
    handleInternalLinkClick(e) {
        const a = e.target.closest('a');
        if (a && a.getAttribute('data-internal')) {
            e.preventDefault();
            this.navigateActiveTab(a.getAttribute('href'));
        }
    }
}

class BrowserTab {
    constructor(id, browserApp) {
        this.id = id;
        this.browserApp = browserApp;
        this.history = [];
        this.historyIndex = -1;
        this.currentUrl = '';
        this.title = 'New Tab';
        this.contentElement = null;
    }

    setContentElement(el) {
        this.contentElement = el;
        this.contentElement.addEventListener('click', (e) => this.browserApp.handleInternalLinkClick(e));
    }

    canGoBack() {
        return this.historyIndex > 0;
    }

    canGoForward() {
        return this.historyIndex < this.history.length - 1;
    }

    goBack() {
        if (this.canGoBack()) {
            this.historyIndex--;
            this.loadUrl(this.history[this.historyIndex]);
        }
    }

    goForward() {
        if (this.canGoForward()) {
            this.historyIndex++;
            this.loadUrl(this.history[this.historyIndex]);
        }
    }

    reload() {
        if (this.currentUrl) {
            this.loadUrl(this.currentUrl);
        }
    }

    navigate(url) {
        // Prefix default domain if missing scheme or internal structure
        if (!url.includes('.') && !url.includes('/')) {
            // It's a search
            url = 'search:' + url;
        } else if (url.startsWith('/')) {
            url = 'nitinrepswal.dev' + url;
        }

        // Manage History
        if (this.currentUrl !== url) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(url);
            this.historyIndex++;
        }
        
        this.loadUrl(url);
    }

    loadUrl(url) {
        this.currentUrl = url;
        this.browserApp.showLoading();

        // Simulate network delay
        setTimeout(() => {
            this.renderContent(url);
            this.browserApp.hideLoading();
            if (this.browserApp.activeTabId === this.id) {
                this.browserApp.renderTabs(); // update title
                this.browserApp.updateToolbar();
            }
        }, 150);
    }

    renderContent(url) {
        let html = '';
        
        // Handle External URLs securely
        if (url.startsWith('http://') || url.startsWith('https://')) {
            this.title = 'External Link';
            html = `
                <div class="browser-external">
                    <h2>You're leaving Nitin's Web</h2>
                    <p>External websites are opened in a new tab for your security.</p>
                    <a href="${url}" target="_blank" rel="noopener noreferrer" class="external-btn">Open ${url}</a>
                </div>
            `;
            this.contentElement.innerHTML = html;
            return;
        }

        // Handle internal routing
        let cleanUrl = url.replace('https://', '').replace('http://', '').trim();
        if (cleanUrl.endsWith('/')) {
            cleanUrl = cleanUrl.slice(0, -1);
        }

        if (cleanUrl === 'nitinrepswal.dev' || cleanUrl === 'nitinrepswal.dev/home') {
            this.title = "Nitin's Web";
            html = this.renderHome();
        } else if (cleanUrl === 'nitinrepswal.dev/about') {
            this.title = "About Me";
            html = this.browserApp.aboutApp.getHTML();
        } else if (cleanUrl === 'nitinrepswal.dev/resume') {
            this.title = "Resume";
            if (this.browserApp.resumeApp) {
                html = this.browserApp.resumeApp.getHTML();
            } else {
                html = this.renderError("Resume app not initialized.");
            }
        } else if (cleanUrl === 'nitinrepswal.dev/contact') {
            this.title = "Contact";
            if (this.browserApp.contactApp) {
                html = this.browserApp.contactApp.getHTML();
            } else {
                html = this.renderError("Contact app not initialized.");
            }
        } else if (cleanUrl.startsWith('nitinrepswal.dev/projects')) {
            const parts = cleanUrl.split('/').filter(Boolean);
            if (parts.length === 1 || parts[1] === 'projects') {
                // Just the projects list, we can render finder's file list or custom HTML
                this.title = "Projects";
                const projectsNode = getFileSystemNode('/Projects');
                html = this.renderProjectsList(projectsNode);
            } else {
                // Specific project
                let projectName = parts[parts.length - 1]; // e.g. codevise
                let targetPath = '';
                if (projectName.includes('codevise')) targetPath = '/Projects/CodeVise';
                else if (projectName.includes('formkey')) targetPath = '/Projects/FormKey';
                else if (projectName.includes('churn')) targetPath = '/Projects/Bank Churn Prediction';
                else if (projectName.includes('dsa')) targetPath = '/Projects/DSA Mentor';
                const node = getFileSystemNode(targetPath);
                if (node) {
                    this.title = node.metadata?.name || node.name;
                    // Render project detail (passing null for finderInstance so it doesn't render back button for Finder)
                    html = renderProjectDetail(node, null);
                } else {
                    this.title = "404 Not Found";
                    html = this.renderError("Project not found.");
                }
            }
        } else if (url.startsWith('search:')) {
            const query = url.substring(7);
            this.title = `Search: ${query}`;
            const results = searchFileSystem(query);
            html = this.renderSearchResults(query, results);
        } else {
            this.title = "404 Not Found";
            html = this.renderError("The requested page doesn't exist.");
        }

        this.contentElement.innerHTML = html;
        this.contentElement.scrollTop = 0;
        
        // Attach interactive events if apps need them
        if (cleanUrl.startsWith('nitinrepswal.dev/resume') && this.browserApp.resumeApp) {
            this.browserApp.resumeApp.attachEvents(this.contentElement);
        } else if (cleanUrl.startsWith('nitinrepswal.dev/contact') && this.browserApp.contactApp) {
            this.browserApp.contactApp.attachEvents(this.contentElement);
        }
    }

    renderHome() {
        return `
            <div class="browser-home">
                <h1>Nitin's Web</h1>
                <div class="browser-favorites">
                    <a href="nitinrepswal.dev/projects" data-internal="true" class="favorite-item">
                        <div class="favorite-icon">📁</div>
                        <div class="favorite-name">Projects</div>
                    </a>
                    <a href="nitinrepswal.dev/about" data-internal="true" class="favorite-item">
                        <div class="favorite-icon">👤</div>
                        <div class="favorite-name">About Me</div>
                    </a>
                    <a href="https://github.com/nitinrepswal" class="favorite-item">
                        <div class="favorite-icon">G</div>
                        <div class="favorite-name">GitHub</div>
                    </a>
                    <a href="https://linkedin.com/in/nitinrepswal" class="favorite-item">
                        <div class="favorite-icon">in</div>
                        <div class="favorite-name">LinkedIn</div>
                    </a>
                </div>
            </div>
        `;
    }

    renderProjectsList(node) {
        if (!node || !node.children) return this.renderError("Projects folder missing.");
        
        let listHtml = node.children.map(child => {
            const slug = child.name.toLowerCase().split(' ')[0]; // Basic slug
            return `
                <a href="nitinrepswal.dev/projects/${slug}" data-internal="true" style="display:block; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; color: inherit; text-decoration: none; margin-bottom: 16px;">
                    <div style="font-weight:bold; font-size: 18px; margin-bottom: 8px;">${child.name}</div>
                    <div style="color: rgba(255,255,255,0.7);">${child.metadata?.description || 'Folder'}</div>
                </a>
            `;
        }).join('');

        return `
            <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
                <h1 style="margin-bottom: 32px;">Projects</h1>
                ${listHtml}
            </div>
        `;
    }

    renderSearchResults(query, results) {
        if (results.length === 0) {
            return `
                <div style="padding: 40px; max-width: 800px; margin: 0 auto; text-align: center;">
                    <h2>No results found for "${query}"</h2>
                </div>
            `;
        }

        let listHtml = results.map(node => {
            let link = 'nitinrepswal.dev';
            if (node.type === 'project') {
                const slug = node.name.toLowerCase().split(' ')[0];
                link = `nitinrepswal.dev/projects/${slug}`;
            } else if (node.name === 'About') {
                link = 'nitinrepswal.dev/about';
            } else if (node.name === 'Projects') {
                link = 'nitinrepswal.dev/projects';
            }

            return `
                <a href="${link}" data-internal="true" style="display:block; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; color: inherit; text-decoration: none; margin-bottom: 16px;">
                    <div style="font-weight:bold; font-size: 18px; margin-bottom: 8px;">${node.name}</div>
                    <div style="color: rgba(255,255,255,0.7);">${node.metadata?.description || node.type}</div>
                </a>
            `;
        }).join('');

        return `
            <div style="padding: 40px; max-width: 800px; margin: 0 auto;">
                <h1 style="margin-bottom: 32px;">Search Results: "${query}"</h1>
                ${listHtml}
            </div>
        `;
    }

    renderError(msg) {
        return `
            <div class="browser-external">
                <h2>Page Not Found</h2>
                <p>${msg}</p>
                <a href="nitinrepswal.dev" data-internal="true" class="external-btn">Go Home</a>
            </div>
        `;
    }
}
