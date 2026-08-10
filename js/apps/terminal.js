import { commands, commandNames } from '../core/commands.js';

export class TerminalApp {
    constructor(windowManager, finderApp, aboutApp) {
        this.windowManager = windowManager;
        this.finderApp = finderApp;
        this.aboutApp = aboutApp;
        this.history = [];
        this.historyIndex = -1;
    }

    open() {
        const html = `
            <div id="terminal-app" class="terminal-container">
                <div class="terminal-output" id="terminal-output">
                    <div class="terminal-line">Last login: ${new Date().toLocaleString()} on console</div>
                </div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt"><span class="host">nitin@mac</span> <span class="path">~</span> %</span>
                    <div class="terminal-input-wrapper">
                        <input type="text" id="terminal-input" class="terminal-input" autocomplete="off" spellcheck="false" aria-label="Terminal command input">
                    </div>
                </div>
            </div>
        `;

        this.windowManager.open('terminal', 'Terminal', html);

        setTimeout(() => {
            this.container = document.getElementById('terminal-app');
            this.outputContainer = document.getElementById('terminal-output');
            this.inputElement = document.getElementById('terminal-input');

            if (this.container && this.inputElement) {
                this.attachEvents();
                this.inputElement.focus();
            }
        }, 0);
    }

    attachEvents() {
        // Keep focus on input unless user is selecting text
        this.container.addEventListener('click', () => {
            const selection = window.getSelection();
            if (selection.toString().length === 0) {
                this.inputElement.focus();
            }
        });

        this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const input = this.inputElement.value.trim();
            this.executeCommand(input);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.navigateHistory('up');
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.navigateHistory('down');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.handleAutocomplete();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'k')) {
            e.preventDefault();
            this.clearOutput();
        }
    }

    executeCommand(input) {
        if (input) {
            this.history.push(input);
            this.historyIndex = this.history.length;
        }

        // Echo the command
        this.printLine(`<span class="terminal-prompt"><span class="host">nitin@mac</span> <span class="path">~</span> %</span> ${this.escapeHtml(input)}`);
        
        this.inputElement.value = '';

        if (!input) {
            this.scrollToBottom();
            return;
        }

        const args = input.split(' ').filter(Boolean);
        const cmdName = args[0].toLowerCase();
        const cmdArgs = args.slice(1);

        if (commands[cmdName]) {
            const output = commands[cmdName](cmdArgs, {
                windowManager: this.windowManager,
                finderApp: this.finderApp,
                aboutApp: this.aboutApp,
                browserApp: this.browserApp,
                resumeApp: this.resumeApp,
                contactApp: this.contactApp
            });

            if (output === '__CLEAR__') {
                this.clearOutput();
            } else if (output) {
                this.printLine(output);
            }
        } else {
            this.printLine(`Command not found: ${this.escapeHtml(cmdName)}\nType "help" to see available commands.`);
        }

        this.scrollToBottom();
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;

        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.inputElement.value = this.history[this.historyIndex];
            }
        } else if (direction === 'down') {
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.inputElement.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.inputElement.value = '';
            }
        }
    }

    handleAutocomplete() {
        const input = this.inputElement.value;
        const args = input.split(' ');
        
        // Only autocomplete the first word (command)
        if (args.length === 1) {
            const prefix = args[0].toLowerCase();
            const matches = commandNames.filter(cmd => cmd.startsWith(prefix));
            
            if (matches.length === 1) {
                this.inputElement.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                this.printLine(`<span class="terminal-prompt"><span class="host">nitin@mac</span> <span class="path">~</span> %</span> ${this.escapeHtml(input)}`);
                this.printLine(matches.join('  '));
                this.scrollToBottom();
            }
        }
    }

    printLine(html) {
        const div = document.createElement('div');
        div.className = 'terminal-line';
        div.innerHTML = html;
        this.outputContainer.appendChild(div);
    }

    clearOutput() {
        this.outputContainer.innerHTML = '';
        this.inputElement.value = '';
        this.inputElement.focus();
    }

    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
}
