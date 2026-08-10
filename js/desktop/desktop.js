export function initDesktop(windowManager, finderApp, aboutApp, terminalApp, browserApp, resumeApp, contactApp) {
    const desktop = document.querySelector('.desktop');
    const icons = document.querySelectorAll('.desktop-icon');
    
    // Handle icon selection
    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Prevent bubbling to desktop
            e.stopPropagation();
            
            // Deselect all others
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
            
            // If on mobile/touch, launch immediately
            if (window.innerWidth <= 768 || ('ontouchstart' in window)) {
                icon.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
            }
        });

        // Double click: launch
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            const app = icon.getAttribute('data-app');
            const title = icon.querySelector('span').innerText;
            
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
                    <h2>${title}</h2>
                    <p>Functionality coming in a later phase</p>
                </div>`;
                windowManager.open(app, title, content);
            }
            
            // Optional: remove selection after launch
            icon.classList.remove('selected');
        });
    });
    
    // Deselect icons when clicking on empty desktop space
    desktop.addEventListener('click', () => {
        icons.forEach(i => i.classList.remove('selected'));
    });
}
