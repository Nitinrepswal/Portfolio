import { profileData } from '../data/profile.js';
import { projectData } from '../data/projects.js';

export class ResumeApp {
    constructor(windowManager, browserApp) {
        this.windowManager = windowManager;
        this.browserApp = browserApp;
    }

    open() {
        this.windowManager.open('resume', 'Resume', this.getHTML());
        
        setTimeout(() => {
            this.attachEvents(document.getElementById('resume-app'));
        }, 0);
    }

    getHTML() {
        const skillsHtml = Object.entries(profileData.skills).map(([key, list]) => {
            const title = key.toUpperCase();
            return `<div class="resume-skills"><strong>${title}</strong> <span>${list.join(' • ')}</span></div>`;
        }).join('');

        const eduHtml = profileData.education.map(edu => `
            <div class="resume-item">
                <div class="resume-item-title">${edu.degree}</div>
                <div class="resume-item-subtitle">${edu.major}</div>
                <div class="resume-item-desc">${edu.university} | ${edu.years} | ${edu.details}</div>
            </div>
        `).join('');

        const expHtml = profileData.experience.map(exp => `
            <div class="resume-item">
                <div class="resume-item-title">${exp.title}</div>
                <div class="resume-item-subtitle">${exp.company} - ${exp.location} | ${exp.date}</div>
                <div class="resume-item-desc">${exp.description}</div>
            </div>
        `).join('');

        const extraHtml = profileData.extracurriculars.map(ext => `
            <div class="resume-item">
                <div class="resume-item-title">${ext.title}</div>
                <div class="resume-item-subtitle">${ext.organization} | ${ext.date}</div>
                <div class="resume-item-desc">${ext.description}</div>
            </div>
        `).join('');

        const projectsHtml = projectData.map(proj => `
            <div class="resume-item">
                <div class="resume-item-title">${proj.name}</div>
                <div class="resume-item-subtitle">${proj.technologies.join(', ')} | ${proj.status}</div>
                <div class="resume-item-desc">${proj.description}</div>
            </div>
        `).join('');
        
        const certsHtml = profileData.certifications.map(cert => `
            <div class="resume-item">
                <div class="resume-item-title">${cert.name}</div>
                <div class="resume-item-subtitle">${cert.issuer} | ${cert.date}</div>
            </div>
        `).join('');

        return `
            <div id="resume-app" class="resume-container">
                <div class="resume-document">
                    <div class="resume-header">
                        <h1 class="resume-name">${profileData.name}</h1>
                        <div class="resume-role">${profileData.role}</div>
                        
                        <div class="resume-actions">
                            <a href="assets/resume.pdf" download class="btn btn-primary" id="btn-download-resume">Download PDF</a>
                            <button class="btn btn-secondary" id="btn-open-safari">Open in Safari</button>
                        </div>
                    </div>

                    <div class="resume-section">
                        <div class="resume-section-title">Education</div>
                        ${eduHtml}
                    </div>

                    <div class="resume-section">
                        <div class="resume-section-title">Skills</div>
                        ${skillsHtml}
                    </div>
                    
                    <div class="resume-section">
                        <div class="resume-section-title">Experience</div>
                        ${expHtml}
                    </div>

                    <div class="resume-section">
                        <div class="resume-section-title">Projects</div>
                        ${projectsHtml}
                    </div>
                    
                    <div class="resume-section">
                        <div class="resume-section-title">Extracurricular Activities</div>
                        ${extraHtml}
                    </div>
                    
                    <div class="resume-section">
                        <div class="resume-section-title">Certifications</div>
                        ${certsHtml}
                    </div>
                </div>
            </div>
        `;
    }

    attachEvents(container) {
        if (!container) return;

        const btnSafari = container.querySelector('#btn-open-safari');
        if (btnSafari && this.browserApp) {
            btnSafari.addEventListener('click', () => {
                this.browserApp.open('nitinrepswal.dev/resume');
            });
        }

        const btnDownload = container.querySelector('#btn-download-resume');
        if (btnDownload) {
            btnDownload.addEventListener('click', (e) => {
                // If the file doesn't exist, we don't want to throw an ugly error.
                // We'll let the browser handle the 404 naturally for now, 
                // but we could also check if it exists via fetch.
            });
        }
    }
}
