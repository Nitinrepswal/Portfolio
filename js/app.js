import { initClock } from './desktop/clock.js';
import { initDock } from './desktop/dock.js';
import { initDesktop } from './desktop/desktop.js';
import { WindowManager } from './core/windowManager.js';
import { FinderApp } from './apps/finder.js';
import { AboutApp } from './apps/about.js';
import { TerminalApp } from './apps/terminal.js';
import { BrowserApp } from './apps/safari.js';
import { ResumeApp } from './apps/resume.js';
import { ContactApp } from './apps/contact.js';
import { OSLayer } from './apps/osLayer.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize system components
    const windowManager = new WindowManager();
    const finderApp = new FinderApp(windowManager);
    const aboutApp = new AboutApp(windowManager);
    const terminalApp = new TerminalApp(windowManager, finderApp, aboutApp);
    const browserApp = new BrowserApp(windowManager, aboutApp);
    const resumeApp = new ResumeApp(windowManager, browserApp);
    const contactApp = new ContactApp(windowManager);
    
    // Attach browserApp to finderApp/aboutApp if needed later, or just pass it around
    terminalApp.browserApp = browserApp; // Give terminal access to browser
    terminalApp.resumeApp = resumeApp;
    terminalApp.contactApp = contactApp;
    
    browserApp.resumeApp = resumeApp;
    browserApp.contactApp = contactApp;
    
    initClock();
    initDock(windowManager, finderApp, aboutApp, terminalApp, browserApp, resumeApp, contactApp);
    initDesktop(windowManager, finderApp, aboutApp, terminalApp, browserApp, resumeApp, contactApp);
    
    // Initialize OS Layer features (Spotlight, Context Menu, Boot, etc.)
    const osLayer = new OSLayer(windowManager, finderApp, terminalApp, browserApp, resumeApp, contactApp);
});
