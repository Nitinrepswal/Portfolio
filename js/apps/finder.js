import { fileSystem, getFileSystemNode, searchFileSystem } from '../data/filesystem.js';
import { renderProjectDetail } from '../data/projects.js';

export class FinderApp {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.currentPath = '/';
        this.historyBack = [];
        this.historyForward = [];
        this.viewMode = 'icon'; // 'icon' or 'list'
        this.sortBy = 'name'; // 'name' or 'kind'
        this.selectedItem = null;
        this.searchQuery = '';
    }

    open(initialPath = '/') {
        // Ensure the window is open
        const containerHTML = `<div id="finder-app" class="finder-container"></div>`;
        this.windowManager.open('finder', 'Finder', containerHTML);
        
        // Let the DOM update, then mount the app
        setTimeout(() => {
            this.container = document.getElementById('finder-app');
            if (this.container) {
                this.navigate(initialPath);
            }
        }, 0);
    }

    render() {
        if (!this.container) return;

        let mainContent = '';
        const node = getFileSystemNode(this.currentPath);
        
        if (this.searchQuery) {
            const results = searchFileSystem(this.searchQuery);
            mainContent = this.renderFileList(results);
        } else if (node && node.type === 'folder') {
            let children = node.children || [];
            // Sort
            children = [...children].sort((a, b) => {
                if (this.sortBy === 'name') return a.name.localeCompare(b.name);
                if (this.sortBy === 'kind') return a.type.localeCompare(b.type);
                return 0;
            });
            mainContent = this.renderFileList(children);
        } else if (node && node.type === 'project') {
            mainContent = this.renderProjectDetail(node);
        } else if (node && node.type === 'file') {
            mainContent = `<div class="empty-state">${node.content || 'File content...'}</div>`;
        } else {
            mainContent = `<div class="empty-state">Not Found</div>`;
        }

        const canGoBack = this.historyBack.length > 0;
        const canGoForward = this.historyForward.length > 0;
        const canGoUp = this.currentPath !== '/';

        this.container.innerHTML = `
            <div class="finder-sidebar">
                <div class="sidebar-section">
                    <div class="sidebar-title">Favorites</div>
                    <div class="sidebar-item ${this.currentPath.startsWith('/Projects') ? 'active' : ''}" data-nav="/Projects">⭐ Projects</div>
                    <div class="sidebar-item ${this.currentPath === '/' ? 'active' : ''}" data-nav="/">🏠 Home</div>
                    <div class="sidebar-item ${this.currentPath.startsWith('/About') ? 'active' : ''}" data-nav="/About">👤 About</div>
                </div>
                <div class="sidebar-section">
                    <div class="sidebar-title">Locations</div>
                    <div class="sidebar-item ${this.currentPath === '/' ? 'active' : ''}" data-nav="/">💻 Nitin's Mac</div>
                </div>
            </div>
            <div class="finder-main">
                <div class="finder-toolbar">
                    <div class="toolbar-nav">
                        <button class="toolbar-btn btn-back" ${!canGoBack ? 'disabled' : ''}>←</button>
                        <button class="toolbar-btn btn-forward" ${!canGoForward ? 'disabled' : ''}>→</button>
                        <button class="toolbar-btn btn-up" ${!canGoUp ? 'disabled' : ''}>⬆</button>
                    </div>
                    <div class="breadcrumb">
                        ${this.renderBreadcrumbs()}
                    </div>
                    <div class="toolbar-controls">
                        <button class="toolbar-btn btn-view" title="Toggle View (Icon/List)">
                            ${this.viewMode === 'icon' ? '☰' : '𖡄'}
                        </button>
                        <input type="text" class="search-input" placeholder="Search" value="${this.searchQuery}">
                    </div>
                </div>
                <div class="file-area" id="finder-file-area">
                    ${mainContent}
                </div>
            </div>
        `;

        this.attachEvents();
    }

    renderBreadcrumbs() {
        if (this.searchQuery) return `<span>Search Results for "${this.searchQuery}"</span>`;

        const parts = this.currentPath.split('/').filter(Boolean);
        let html = `<span class="breadcrumb-item" data-path="/">Nitin's Mac</span>`;
        let accPath = '';
        
        parts.forEach(part => {
            accPath += `/${part}`;
            html += `<span class="breadcrumb-separator">></span>`;
            html += `<span class="breadcrumb-item" data-path="${accPath}">${part}</span>`;
        });
        return html;
    }

    renderFileList(items) {
        if (items.length === 0) {
            return `<div class="empty-state">No Results</div>`;
        }

        let html = '';
        if (this.viewMode === 'icon') {
            html += `<div class="view-icon">`;
            items.forEach(item => {
                const isProject = item.type === 'project';
                const hasCustomIcon = isProject && item.metadata && item.metadata.icon;
                const scale = hasCustomIcon && item.metadata.iconScale ? `transform: scale(${item.metadata.iconScale});` : '';
                const iconHtml = hasCustomIcon ? `<img src="${item.metadata.icon}" style="width:100%; height:100%; object-fit:contain; ${scale}">` : (item.type === 'folder' ? '📁' : (isProject ? '🚀' : '📄'));
                const isSelected = this.selectedItem === item.path ? 'selected' : '';
                html += `
                    <div class="file-item ${isSelected}" data-path="${item.path}" data-type="${item.type}">
                        <div class="icon">${iconHtml}</div>
                        <div class="name">${item.name}</div>
                    </div>
                `;
            });
            html += `</div>`;
        } else {
            html += `
                <div class="view-list">
                    <div class="list-header">
                        <div>Name</div>
                        <div>Kind</div>
                    </div>
            `;
            items.forEach(item => {
                const isProject = item.type === 'project';
                const hasCustomIcon = isProject && item.metadata && item.metadata.icon;
                const scale = hasCustomIcon && item.metadata.iconScale ? `transform: scale(${item.metadata.iconScale});` : '';
                const iconHtml = hasCustomIcon ? `<img src="${item.metadata.icon}" style="width:18px; height:18px; object-fit:contain; vertical-align:middle; display:inline-block; margin-right:4px; ${scale}">` : (item.type === 'folder' ? '📁' : (isProject ? '🚀' : '📄'));
                const kind = item.type === 'folder' ? 'Folder' : (isProject ? 'Project' : 'Document');
                const isSelected = this.selectedItem === item.path ? 'selected' : '';
                html += `
                    <div class="list-item ${isSelected}" data-path="${item.path}" data-type="${item.type}">
                        <div class="col-name"><span style="font-size: 16px; line-height: 1;">${iconHtml}</span> ${item.name}</div>
                        <div>${kind}</div>
                    </div>
                `;
            });
            html += `</div>`;
        }
        return html;
    }

    renderProjectDetail(node) {
        return renderProjectDetail(node, this);
    }

    attachEvents() {
        // Sidebar navigation
        this.container.querySelectorAll('.sidebar-item').forEach(el => {
            el.addEventListener('click', () => {
                this.navigate(el.getAttribute('data-nav'));
            });
        });

        // Toolbar navigation
        const btnBack = this.container.querySelector('.btn-back');
        if (btnBack) btnBack.addEventListener('click', () => this.goBack());
        
        const btnForward = this.container.querySelector('.btn-forward');
        if (btnForward) btnForward.addEventListener('click', () => this.goForward());
        
        const btnUp = this.container.querySelector('.btn-up');
        if (btnUp) btnUp.addEventListener('click', () => this.goUp());

        const btnView = this.container.querySelector('.btn-view');
        if (btnView) btnView.addEventListener('click', () => this.toggleView());

        // Breadcrumbs
        this.container.querySelectorAll('.breadcrumb-item').forEach(el => {
            el.addEventListener('click', () => {
                this.navigate(el.getAttribute('data-path'));
            });
        });

        // File/Folder clicking
        const fileArea = this.container.querySelector('.file-area');
        const items = this.container.querySelectorAll('.file-item, .list-item');
        
        items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (window.innerWidth <= 768) {
                    // Mobile: single click to navigate directly
                    const path = item.getAttribute('data-path');
                    this.navigate(path);
                } else {
                    // Desktop: single click to select
                    this.selectedItem = item.getAttribute('data-path');
                    this.render(); // Re-render to show selection
                }
            });

            item.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const path = item.getAttribute('data-path');
                this.navigate(path);
            });
        });

        fileArea.addEventListener('click', () => {
            if (this.selectedItem !== null) {
                this.selectedItem = null;
                this.render();
            }
        });

        // Search
        const searchInput = this.container.querySelector('.search-input');
        if (searchInput) {
            // Keep focus if it had it
            const val = searchInput.value;
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.render();
                // re-focus after render since DOM is replaced
                const newSearch = this.container.querySelector('.search-input');
                if (newSearch) {
                    newSearch.focus();
                    // Put cursor at end
                    newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
                }
            });
        }
        
        // Project Detail Back button
        const btnBackToProjects = this.container.querySelector('.back-to-projects');
        if (btnBackToProjects) {
            btnBackToProjects.addEventListener('click', () => {
                this.goUp();
            });
        }
    }

    navigate(path, isHistory = false) {
        if (!isHistory && this.currentPath !== path) {
            this.historyBack.push(this.currentPath);
            this.historyForward = []; // Clear forward history on new navigation
        }
        this.currentPath = path;
        this.selectedItem = null;
        this.searchQuery = '';
        
        // Update window title
        const winTitle = document.querySelector('#window-finder .window-title');
        if (winTitle) {
            const parts = path.split('/').filter(Boolean);
            winTitle.textContent = parts.length > 0 ? parts[parts.length - 1] : "Nitin's Mac";
        }
        
        this.render();
    }

    goBack() {
        if (this.historyBack.length > 0) {
            this.historyForward.push(this.currentPath);
            const path = this.historyBack.pop();
            this.navigate(path, true);
        }
    }

    goForward() {
        if (this.historyForward.length > 0) {
            this.historyBack.push(this.currentPath);
            const path = this.historyForward.pop();
            this.navigate(path, true);
        }
    }

    goUp() {
        if (this.currentPath === '/') return;
        const parts = this.currentPath.split('/').filter(Boolean);
        parts.pop(); // remove last segment
        const parentPath = '/' + parts.join('/');
        this.navigate(parentPath);
    }

    toggleView() {
        this.viewMode = this.viewMode === 'icon' ? 'list' : 'icon';
        this.render();
    }
}
