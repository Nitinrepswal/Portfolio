export class WindowManager {
    constructor() {
        this.container = document.getElementById('window-container');
        this.windows = new Map(); // id -> window state
        this.zIndexCounter = 100;
        
        // Configuration
        this.baseZIndex = 100;
        this.defaultWidth = 700;
        this.defaultHeight = 450;
        this.menuBarHeight = 28;
        this.dockHeight = 80;
    }

    /**
     * Opens a window or focuses it if it's already open.
     */
    open(appId, title, contentHTML) {
        if (this.windows.has(appId)) {
            const winState = this.windows.get(appId);
            if (winState.isMinimized) {
                this.restore(appId);
            } else {
                this.focus(appId);
            }
            return;
        }

        // Create new window element
        const winEl = document.createElement('div');
        winEl.className = 'window';
        winEl.id = `window-${appId}`;
        
        // Determine initial position (cascade slightly based on how many windows exist)
        const offset = (this.windows.size * 30) % 150;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Responsive size adjustment
        let width = this.defaultWidth;
        let height = this.defaultHeight;
        if (screenWidth <= 768) {
            width = screenWidth - 20;
            height = screenHeight - this.menuBarHeight - this.dockHeight - 20;
        }
        
        let left = Math.max(10, (screenWidth - width) / 2 + offset);
        let top = Math.max(this.menuBarHeight + 10, (screenHeight - height) / 2 + offset);

        if (screenWidth <= 768) {
            width = screenWidth;
            // Subtract dock and menu bar strictly
            height = screenHeight - this.menuBarHeight - 60; // 60px is approx mobile dock height
            left = 0;
            top = this.menuBarHeight;
        }

        winEl.style.width = `${width}px`;
        winEl.style.height = `${height}px`;
        winEl.style.left = `${left}px`;
        winEl.style.top = `${top}px`;
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
            isMaximized: false,
            prevRect: null
        };
        this.windows.set(appId, state);

        this._attachEvents(state);
        this.focus(appId);
        
        // Entrance animation
        winEl.style.opacity = '0';
        winEl.style.transform = 'scale(0.95)';
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

        // Save current rect for restoring
        const rect = state.element.getBoundingClientRect();
        state.prevRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };

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
