import { profileData } from '../data/profile.js';

export class AboutApp {
    constructor(windowManager) {
        this.windowManager = windowManager;
    }

    open() {
        this.windowManager.open('about', 'About Me', this.getHTML());
    }

    getHTML() {
        const skillsHtml = Object.entries(profileData.skills).map(([key, list]) => {
            let title = '';
            if (key === 'languages') title = 'Languages';
            else if (key === 'core') title = 'Core';
            else if (key === 'aiml') title = 'AI / ML';
            else if (key === 'web') title = 'Web & Tools';
            else title = key;

            return `
                <div class="skill-group">
                    <div class="skill-group-title">${title}</div>
                    <div class="skill-tags">
                        ${list.map(item => `<span class="tag">${item}</span>`).join('')}
                    </div>
                </div>
            `;
        }).join('');

        const focusHtml = profileData.focus.map((item, idx) => `
            <div class="focus-item">
                <span class="focus-number">0${idx + 1}</span>
                <span class="focus-text">${item}</span>
            </div>
        `).join('');

        const eduHtml = profileData.education.map(e => `
            <div class="about-timeline-item">
                <div class="timeline-title">${e.degree} - ${e.major}</div>
                <div class="timeline-meta">${e.university} | ${e.years}</div>
                <div class="timeline-details">${e.details}</div>
            </div>
        `).join('');

        const expHtml = profileData.experience.map(e => `
            <div class="about-timeline-item">
                <div class="timeline-title">${e.title} at ${e.company}</div>
                <div class="timeline-meta">${e.location} | ${e.date}</div>
                <div class="timeline-details">${e.description}</div>
            </div>
        `).join('');

        const extraHtml = profileData.extracurriculars.map(e => `
            <div class="about-timeline-item">
                <div class="timeline-title">${e.title} - ${e.organization}</div>
                <div class="timeline-meta">${e.date}</div>
                <div class="timeline-details">${e.description}</div>
            </div>
        `).join('');

        return `
            <div class="about-container">
                <div class="about-header">
                    <h1 class="about-name">${profileData.name}</h1>
                    <h2 class="about-role">${profileData.role}</h2>
                    <p class="about-intro">${profileData.bio}</p>
                </div>

                <div class="about-section">
                    <div class="about-section-title">Currently Focused On</div>
                    <div class="focus-list">
                        ${focusHtml}
                    </div>
                </div>

                <div class="about-section">
                    <div class="about-section-title">Experience</div>
                    <div class="timeline-container">
                        ${expHtml}
                    </div>
                </div>

                <div class="about-section">
                    <div class="about-section-title">Education</div>
                    <div class="timeline-container">
                        ${eduHtml}
                    </div>
                </div>

                <div class="about-section">
                    <div class="about-section-title">Skills</div>
                    <div class="skills-grid">
                        ${skillsHtml}
                    </div>
                </div>

                <div class="about-section">
                    <div class="about-section-title">Extracurricular Activities</div>
                    <div class="timeline-container">
                        ${extraHtml}
                    </div>
                </div>

                <div class="about-section">
                    <div class="about-section-title">Connect</div>
                    <div class="social-links">
                        <a href="${profileData.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">GitHub ↗</a>
                        <a href="${profileData.linkedin}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">LinkedIn ↗</a>
                    </div>
                </div>
            </div>
        `;
    }
}
