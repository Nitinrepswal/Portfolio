export function initDock(windowManager, finderApp, aboutApp, terminalApp, browserApp, resumeApp, contactApp) {
    const dockContainer = document.querySelector('.dock');
    const icons = document.querySelectorAll('.dock-icon-wrapper');
    
    const maxScale = 1.6; // Maximum scaling factor
    const baseWidth = 50; // Base width of icons
    const proximity = 150; // Distance in pixels that triggers scaling
    
    // Check if device supports hover (ignore on mobile/touch)
    const isTouch = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 768);
    
    // Intelligent Dock Visibility
    document.addEventListener('mousemove', (e) => {
        const threshold = window.innerHeight - 150; // Distance from bottom
        if (e.clientY > threshold || dockContainer.matches(':hover')) {
            dockContainer.parentElement.classList.remove('fade-out');
        } else {
            dockContainer.parentElement.classList.add('fade-out');
        }
    });

    if (isTouch) {
        // Just add fade-out prevention on mobile
        dockContainer.parentElement.classList.remove('fade-out');
    } else {
        dockContainer.addEventListener('mouseenter', () => {
            dockContainer.classList.add('is-hovering');
        });

        dockContainer.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        
        icons.forEach(icon => {
            const rect = icon.getBoundingClientRect();
            // Calculate distance from mouse to center of the icon
            const iconCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - iconCenterX);
            
            // Calculate scale based on proximity
            let scale = 1;
            if (distance < proximity) {
                // Closer it is, closer the scale factor gets to maxScale
                const scaleFactor = 1 - (distance / proximity);
                scale = 1 + (maxScale - 1) * scaleFactor;
            }
            
            // Apply scale logic: Adjust dimensions directly for smoother reflow
            const newWidth = baseWidth * scale;
            icon.style.width = `${newWidth}px`;
            icon.style.height = `${newWidth}px`;
            
            // Maintain bottom alignment in dock flex container
            // The transform origin in CSS is bottom center
        });
    });

    dockContainer.addEventListener('mouseleave', () => {
        dockContainer.classList.remove('is-hovering');
        // Reset all icons to base width when mouse leaves the dock
        icons.forEach(icon => {
            icon.style.width = `${baseWidth}px`;
            icon.style.height = `${baseWidth}px`;
        });
    });
    } // Close else block

    // Helper to handle dock click actions
    const handleDockAction = (icon, app, tooltip) => {
        // Launch Animation
        icon.classList.add('launching');
        setTimeout(() => icon.classList.remove('launching'), 600);

        const state = windowManager.getWindowState(app);
        
        if (state === 'closed') {
            if (app === 'finder') {
                finderApp.open('/');
            } else if (app === 'projects') {
                finderApp.open('/Projects');
            } else if (app === 'about') {
                aboutApp.open();
            } else if (app === 'terminal') {
                terminalApp.open();
            } else if (app === 'safari') {
                browserApp.open();
            } else if (app === 'resume') {
                resumeApp.open();
            } else if (app === 'contact') {
                contactApp.open();
            } else {
                const content = `<div style="display:flex; height:100%; align-items:center; justify-content:center; flex-direction:column; gap:20px;">
                    <h2>${tooltip}</h2>
                    <p>Functionality coming in a later phase</p>
                </div>`;
                windowManager.open(app, tooltip, content);
            }
        } else if (state === 'minimized') {
            windowManager.restore(app);
        } else if (state === 'open') {
            windowManager.focus(app);
        } else if (state === 'focused') {
            windowManager.minimize(app);
        }
    };

    // Add click event for dock icons to interact with window manager
    icons.forEach(icon => {
        const tooltip = icon.getAttribute('data-tooltip');
        const app = tooltip.toLowerCase();
        
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDockAction(icon, app, tooltip);
        });

        // Keyboard Accessibility
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDockAction(icon, app, tooltip);
            }
        });
    });

    // Synchronize running indicators
    document.addEventListener('window-opened', (e) => {
        const appId = e.detail.appId;
        const targetIcon = Array.from(icons).find(i => i.getAttribute('data-tooltip').toLowerCase() === appId);
        if (targetIcon) targetIcon.classList.add('running');
    });

    document.addEventListener('window-closed', (e) => {
        const appId = e.detail.appId;
        const targetIcon = Array.from(icons).find(i => i.getAttribute('data-tooltip').toLowerCase() === appId);
        if (targetIcon) targetIcon.classList.remove('running');
    });
}
