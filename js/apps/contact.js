import { profileData } from '../data/profile.js';

export class ContactApp {
    constructor(windowManager) {
        this.windowManager = windowManager;
    }

    open() {
        this.windowManager.open('contact', 'Contact', this.getHTML());
        
        setTimeout(() => {
            this.attachEvents(document.getElementById('contact-app'));
        }, 0);
    }

    getHTML() {
        return `
            <div id="contact-app" class="contact-container">
                <div class="contact-content">
                    <div class="contact-header">
                        <h1 class="contact-title">Let's build something.</h1>
                        <div class="contact-subtitle">Get in touch via email or find me on social media.</div>
                    </div>

                    <div class="contact-links">
                        <div class="contact-link-card">
                            <div class="contact-link-left">
                                <div class="contact-link-label">Email</div>
                                <div class="contact-link-value">${profileData.email}</div>
                            </div>
                            <button class="contact-link-action" id="btn-copy-email">Copy Email</button>
                        </div>
                        <a href="${profileData.github}" target="_blank" rel="noopener noreferrer" class="contact-link-card">
                            <div class="contact-link-left">
                                <div class="contact-link-label">GitHub</div>
                                <div class="contact-link-value">${profileData.github.replace('https://', '')}</div>
                            </div>
                            <div class="contact-link-action">Open ↗</div>
                        </a>
                        <a href="${profileData.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-link-card">
                            <div class="contact-link-left">
                                <div class="contact-link-label">LinkedIn</div>
                                <div class="contact-link-value">${profileData.linkedin.replace('https://', '')}</div>
                            </div>
                            <div class="contact-link-action">Open ↗</div>
                        </a>
                    </div>

                    <div class="contact-form-section">
                        <div class="contact-link-label" style="margin-bottom:16px;">Send a message</div>
                        <form id="contact-form">
                            <div class="form-group">
                                <label class="form-label">Name</label>
                                <input type="text" id="contact-name" class="form-input" placeholder="Your name">
                                <div class="form-error" id="error-name">Name is required.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email</label>
                                <input type="email" id="contact-email" class="form-input" placeholder="Your email address">
                                <div class="form-error" id="error-email">Please enter a valid email address.</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Message</label>
                                <textarea id="contact-message" class="form-textarea" placeholder="How can I help you?"></textarea>
                                <div class="form-error" id="error-message">Message is required.</div>
                            </div>
                            <button type="submit" class="form-submit">Send via Email Client</button>
                            <div class="form-feedback" id="contact-feedback">Opening your email client...</div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents(container) {
        if (!container) return;

        const btnCopy = container.querySelector('#btn-copy-email');
        if (btnCopy) {
            btnCopy.addEventListener('click', () => {
                navigator.clipboard.writeText(profileData.email).then(() => {
                    const originalText = btnCopy.textContent;
                    btnCopy.textContent = 'Copied!';
                    setTimeout(() => {
                        btnCopy.textContent = originalText;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        }

        const form = container.querySelector('#contact-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const nameEl = container.querySelector('#contact-name');
                const emailEl = container.querySelector('#contact-email');
                const msgEl = container.querySelector('#contact-message');
                
                const errName = container.querySelector('#error-name');
                const errEmail = container.querySelector('#error-email');
                const errMsg = container.querySelector('#error-message');
                const feedback = container.querySelector('#contact-feedback');

                // Reset errors
                errName.style.display = 'none';
                errEmail.style.display = 'none';
                errMsg.style.display = 'none';
                feedback.style.display = 'none';

                let isValid = true;

                if (!nameEl.value.trim()) {
                    errName.style.display = 'block';
                    isValid = false;
                }

                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailEl.value.trim() || !emailRegex.test(emailEl.value.trim())) {
                    errEmail.style.display = 'block';
                    isValid = false;
                }

                if (!msgEl.value.trim()) {
                    errMsg.style.display = 'block';
                    isValid = false;
                }

                if (isValid) {
                    feedback.style.display = 'block';
                    
                    const subject = encodeURIComponent("Portfolio Contact");
                    const body = encodeURIComponent(`Name: ${nameEl.value.trim()}\nEmail: ${emailEl.value.trim()}\n\nMessage:\n${msgEl.value.trim()}`);
                    
                    const mailtoLink = `mailto:${profileData.email}?subject=${subject}&body=${body}`;
                    
                    setTimeout(() => {
                        window.location.href = mailtoLink;
                        feedback.style.display = 'none';
                        form.reset();
                    }, 800);
                }
            });
        }
    }
}
