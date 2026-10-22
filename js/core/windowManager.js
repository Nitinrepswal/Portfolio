export class WindowManager {
    constructor() {
        this.container = document.getElementById('window-container');
        this.windows = new Map(); // id -> window state
        this.zIndexCounter = 100;
        
        // Configuration
        this.baseZIndex = 100;
        this.defaultWidth = 980;
        this.defaultHeight = 620;
        this.menuBarHeight = 28;
        this.dockHeight = 80;
    }

    /**
     * Opens a window or focuses it if it's already open.
     */
    open(appId, title, contentHTML, options = {}) {
        const shouldMaximize = options.maximized !== undefined 
            ? Boolean(options.maximized) 
            : (appId === 'finder' || appId === 'projects');

        if (this.windows.has(appId)) {
            const winState = this.windows.get(appId);
            if (winState.isMinimized) {
                this.restore(appId);
            } else {
                this.focus(appId);
            }
            if (shouldMaximize) {
                this.maximize(appId);
            }
            return;
        }

        // Create new window element
        const winEl = document.createElement('div');
        winEl.className = 'window';
        winEl.id = `window-${appId}`;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const availableHeight = screenHeight - this.menuBarHeight - this.dockHeight;

        // Restored rect if user toggles out of full screen
        const restoredW = Math.min(1080, Math.max(900, Math.floor(screenWidth * 0.72)));
        const restoredH = Math.min(720, Math.max(540, Math.floor(availableHeight * 0.82)));
        const prevRect = {
            left: Math.max(15, Math.floor((screenWidth - restoredW) / 2)),
            top: Math.max(this.menuBarHeight + 10, Math.floor((availableHeight - restoredH) / 2) + this.menuBarHeight),
            width: restoredW,
            height: restoredH
        };

        const isMobile = screenWidth <= 768;
        const fullHeight = isMobile ? `calc(100vh - ${this.menuBarHeight}px - 60px)` : `calc(100vh - ${this.menuBarHeight}px - ${this.dockHeight}px)`;

        if (shouldMaximize) {
            winEl.style.width = '100vw';
            winEl.style.height = fullHeight;
            winEl.style.left = '0px';
            winEl.style.top = `${this.menuBarHeight}px`;
            winEl.classList.add('maximized');
        } else {
            winEl.style.width = `${restoredW}px`;
            winEl.style.height = `${restoredH}px`;
            winEl.style.left = `${prevRect.left}px`;
            winEl.style.top = `${prevRect.top}px`;
        }

        winEl.style.zIndex = ++this.zIndexCounter;

        // Inner HTML structure
        winEl.innerHTML = `
            <div class="title-bar">
                <div class="traffic-lights">
                    <button class="traffic-light close-btn" aria-label="Close"></button>
                    <button class="traffic-light minimize-btn" aria-label="Minimize"></button>
                    <button class="traffic-light maximize-btn" aria-label="Maximize"></button>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">${contentHTML}</div>
        `;

        this.container.appendChild(winEl);

        const state = {
            id: appId,
            element: winEl,
            isMinimized: false,
            isMaximized: shouldMaximize,
            prevRect: prevRect
        };
        this.windows.set(appId, state);

        this._attachEvents(state);
        this.focus(appId);
        
        // Entrance animation
        winEl.style.opacity = '0';
        winEl.style.transform = shouldMaximize ? 'scale(0.99)' : 'scale(0.95)';
        requestAnimationFrame(() => {
            winEl.style.opacity = '1';
            winEl.style.transform = 'scale(1)';
        });

        // Dispatch event for dock synchronization
        document.dispatchEvent(new CustomEvent('window-opened', { detail: { appId } }));
    }

    _attachEvents(state) {
        const { element, id } = state;
        const titleBar = element.querySelector('.title-bar');
        const closeBtn = element.querySelector('.close-btn');
        const minimizeBtn = element.querySelector('.minimize-btn');
        const maximizeBtn = element.querySelector('.maximize-btn');

        // Focus on click anywhere
        element.addEventListener('mousedown', () => this.focus(id));
        
        // Traffic lights
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close(id);
        });
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimize(id);
        });
        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (state.isMaximized) {
                this.restoreMaximized(id);
            } else {
                this.maximize(id);
            }
        });

        // Double click title bar to toggle maximize
        titleBar.addEventListener('dblclick', () => {
            if (state.isMaximized) {
                this.restoreMaximized(id);
            } else {
                this.maximize(id);
            }
        });

        // Dragging
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const onPointerDown = (e) => {
            if (e.target.closest('.traffic-lights')) return; // Don't drag from buttons
            if (state.isMaximized) return; // Don't drag maximized windows
            if (window.innerWidth <= 768) return; // Disable drag on mobile to keep them fullscreen
            
            isDragging = true;
            this.focus(id);
            
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;

            element.style.transition = 'none'; // Disable transition for smooth dragging
            
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;
            
            let newLeft = startLeft + (e.clientX - startX);
            let newTop = startTop + (e.clientY - startY);
            
            // Constrain top to not hide under menu bar
            newTop = Math.max(this.menuBarHeight, newTop);
            
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        };

        const onPointerUp = () => {
            if (!isDragging) return;
            isDragging = false;
            
            // Re-enable transitions that might be needed for maximize/minimize
            element.style.transition = '';
            
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        };

        titleBar.addEventListener('pointerdown', onPointerDown);
    }

    close(appId) {
        if (!this.windows.has(appId)) return;
        const state = this.windows.get(appId);
        
        state.element.classList.add('closing');
        
        // Remove after animation
        setTimeout(() => {
            if (state.element.parentNode) {
                state.element.parentNode.removeChild(state.element);
            }
            this.windows.delete(appId);
            
            // Dispatch event for dock synchronization
            document.dispatchEvent(new CustomEvent('window-closed', { detail: { appId } }));
        }, 300); // Matches CSS transition duration
    }

    minimize(appId) {
        if (!this.windows.has(appId)) return;
        const state = this.windows.get(appId);
        
        state.isMinimized = true;
        state.element.classList.add('minimized');
    }

    restore(appId) {
        if (!this.windows.has(appId)) return;
        const state = this.windows.get(appId);
        
        state.isMinimized = false;
        state.element.classList.remove('minimized');
        this.focus(appId);
    }

    maximize(appId) {
        if (!this.windows.has(appId)) return;
        const state = this.windows.get(appId);
        if (state.isMaximized) return;

        // Save current rect for restoring if valid
        const rect = state.element.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 200) {
            state.prevRect = {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            };
        } else if (!state.prevRect) {
            const screenW = window.innerWidth;
            const availH = window.innerHeight - this.menuBarHeight - this.dockHeight;
            const resW = Math.min(1080, Math.max(900, Math.floor(screenW * 0.72)));
            const resH = Math.min(720, Math.max(540, Math.floor(availH * 0.82)));
            state.prevRect = {
                left: Math.max(15, Math.floor((screenW - resW) / 2)),
                top: Math.max(this.menuBarHeight + 10, Math.floor((availH - resH) / 2) + this.menuBarHeight),
                width: resW,
                height: resH
            };
        }

        state.isMaximized = true;
        state.element.classList.add('maximized');
        
        // Animate to full size (accounting for menu bar and dock loosely)
        // Adjust for mobile vs desktop
        const isMobile = window.innerWidth <= 768;
        const availableHeight = isMobile ? `calc(100vh - ${this.menuBarHeight}px - 60px)` : `calc(100vh - ${this.menuBarHeight}px - ${this.dockHeight}px)`;

        state.element.style.left = '0px';
        state.element.style.top = `${this.menuBarHeight}px`;
        state.element.style.width = '100vw';
        state.element.style.height = availableHeight;
        
        this.focus(appId);
    }

    restoreMaximized(appId) {
        if (!this.windows.has(appId)) return;
        const state = this.windows.get(appId);
        if (!state.isMaximized || !state.prevRect) return;

        state.isMaximized = false;
        state.element.classList.remove('maximized');
        
        state.element.style.left = `${state.prevRect.left}px`;
        state.element.style.top = `${state.prevRect.top}px`;
        state.element.style.width = `${state.prevRect.width}px`;
        state.element.style.height = `${state.prevRect.height}px`;
    }

    focus(appId) {
        if (!this.windows.has(appId)) return;
        
        // Remove active class from all
        this.windows.forEach(state => {
            state.element.classList.remove('active');
        });

        const state = this.windows.get(appId);
        state.element.classList.add('active');
        state.element.style.zIndex = ++this.zIndexCounter;
    }

    /**
     * Ensures a window has at least the given dimensions, expanding it smoothly if smaller.
     */
    ensureMinDimensions(appId, targetWidth, targetHeight) {
        if (!this.windows.has(appId)) return;
        const state = this.windows.get(appId);
        if (state.isMaximized || state.isMinimized) return;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const availableHeight = screenHeight - this.menuBarHeight - this.dockHeight;
        if (screenWidth <= 768) return;

        const currentW = parseInt(state.element.style.width, 10) || state.element.offsetWidth;
        const currentH = parseInt(state.element.style.height, 10) || state.element.offsetHeight;

        const neededW = Math.min(screenWidth - 30, Math.max(currentW, targetWidth));
        const neededH = Math.min(availableHeight - 16, Math.max(currentH, targetHeight));

        if (neededW > currentW || neededH > currentH) {
            state.element.style.width = `${neededW}px`;
            state.element.style.height = `${neededH}px`;
            
            const newLeft = Math.max(15, Math.floor((screenWidth - neededW) / 2));
            const newTop = Math.max(this.menuBarHeight + 10, Math.floor((availableHeight - neededH) / 2) + this.menuBarHeight);
            state.element.style.left = `${newLeft}px`;
            state.element.style.top = `${newTop}px`;
        }
    }
    
    // Helper to check window state for dock integration
    getWindowState(appId) {
        if (!this.windows.has(appId)) return 'closed';
        const state = this.windows.get(appId);
        if (state.isMinimized) return 'minimized';
        
        // It's open. Check if it's the topmost window.
        let isFocused = true;
        const currentZ = parseInt(state.element.style.zIndex, 10) || 0;
        
        for (const [id, otherState] of this.windows.entries()) {
            if (id !== appId && !otherState.isMinimized) {
                const otherZ = parseInt(otherState.element.style.zIndex, 10) || 0;
                if (otherZ > currentZ) {
                    isFocused = false;
                    break;
                }
            }
        }
        
        return isFocused ? 'focused' : 'open';
    }
}
