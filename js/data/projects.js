export const projectData = [
    {
        id: "dsa-mentor",
        name: "DSA Mentor",
        tagline: "AI-powered DSA learning platform",
        icon: "assets/icons/dsa_mentor.png",
        image: "assets/icons/dsa_mentor.png",
        category: "Software Development",
        description: "An AI-powered mentoring platform that helps students master Data Structures and Algorithms for coding interviews. It provides an interactive environment for practicing algorithmic problem-solving.",
        features: [
            "Interactive coding environment with real-time feedback",
            "AI-driven hints & contextual evaluation",
            "Adaptive problem difficulty scaling",
            "Progress tracking and analytics dashboard"
        ],
        technologies: ["JavaScript", "HTML", "CSS", "React", "Node.js"],
        status: "Active Development",
        github: "https://github.com/nitinrepswal/dsa-mentor",
        demo: ""
    },
    {
        id: "codevise",
        name: "CodeVise",
        tagline: "AI Code Reviewer",
        icon: "assets/icons/codevise_icon.png",
        iconScale: 1.6,
        image: "assets/icons/codevise_icon.png",
        category: "Software Development",
        description: "An intelligent code review assistant that automates the code review process. CodeVise analyzes pull requests and provides immediate, actionable feedback on code quality and best practices.",
        features: [
            "Automated syntax and style checking",
            "Security vulnerability detection",
            "Performance optimization suggestions",
            "Seamless integration with GitHub workflows"
        ],
        technologies: ["Python", "Machine Learning", "GitHub API", "Node.js"],
        status: "Completed",
        github: "https://github.com/nitinrepswal/codevise",
        demo: ""
    },
    {
        id: "formkey",
        name: "FormKey",
        tagline: "Privacy-focused Form Automation",
        icon: "assets/icons/formkey.png",
        image: "assets/icons/formkey.png",
        category: "Web Development",
        description: "A secure and privacy-focused form automation tool designed to handle data collection without compromising user privacy. It offers end-to-end encryption for all form submissions.",
        features: [
            "End-to-end encrypted form submissions",
            "No-code form builder interface",
            "Customizable data retention policies",
            "Spam protection and rate limiting"
        ],
        technologies: ["JavaScript", "React", "Node.js", "MongoDB"],
        status: "Completed",
        github: "https://github.com/nitinrepswal/formkey",
        demo: ""
    },
    {
        id: "bank-churn",
        name: "Bank Churn Prediction",
        tagline: "Machine Learning Project",
        icon: "assets/icons/bank_churn.png",
        image: "assets/icons/bank_churn.png",
        category: "AI/ML",
        description: "A machine learning pipeline built to predict customer churn in the banking sector. The project analyzes customer demographics and transaction history to identify at-risk accounts.",
        features: [
            "Data preprocessing and feature engineering",
            "Ensemble model training using XGBoost and Random Forest",
            "Model interpretability using SHAP values",
            "Interactive dashboard for customer risk analysis"
        ],
        technologies: ["Python", "Scikit-learn", "XGBoost", "SHAP", "Pandas"],
        status: "Completed",
        github: "https://github.com/nitinrepswal/bank-churn-prediction",
        demo: ""
    }
];

export function renderProjectDetail(node, finderInstance) {
    const meta = node.metadata || {};

    // Tech tags
    const techTags = (meta.technologies || []).map(t => `<span class="tag">${t}</span>`).join('');

    // Features list
    let featuresHtml = '';
    if (meta.features && meta.features.length > 0) {
        featuresHtml = `
            <div class="project-section">
                <div class="project-section-title">KEY FEATURES</div>
                <div class="feature-list">
                    ${meta.features.map((f, idx) => `
                        <div class="feature-item">
                            <span class="feature-number">${String(idx + 1).padStart(2, '0')}</span>
                            <span class="feature-text">${f}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Links
    let linksHtml = '';
    if (meta.github) linksHtml += `<a href="${meta.github}" target="_blank" class="btn btn-secondary">GitHub</a>`;
    if (meta.demo) linksHtml += `<a href="${meta.demo}" target="_blank" class="btn btn-primary">Live Demo</a>`;
    if (linksHtml) {
        linksHtml = `
            <div class="project-section">
                <div class="project-section-title">LINKS</div>
                <div class="project-links">
                    ${linksHtml}
                </div>
            </div>
        `;
    }

    // Media Handling
    let mediaHtml = '';
    if (meta.image) {
        mediaHtml = `
            <div class="project-image-container">
                <img src="${meta.image}" alt="${meta.name} Screenshot" class="project-image">
            </div>
        `;
    } else {
        mediaHtml = `
            <div class="project-image-placeholder">
                <div class="placeholder-icon">🚀</div>
                <div class="placeholder-text">PROJECT PREVIEW</div>
                <div class="placeholder-subtitle">Screenshot coming soon</div>
            </div>
        `;
    }

    return `
        <div class="project-detail-view">
            <button class="btn btn-secondary back-to-projects">← Back to Projects</button>
            <div class="project-content">
                <div class="project-main">
                    <div class="project-header">
                        <h2 class="project-title">${meta.name || node.name}</h2>
                        <div class="project-tagline">${meta.tagline || meta.category}</div>
                    </div>
                    
                    ${mediaHtml}

                    <div class="project-section">
                        <div class="project-section-title">ABOUT</div>
                        <div class="project-description">${meta.description || 'No description provided.'}</div>
                    </div>
                    
                    ${featuresHtml}
                </div>
                
                <div class="project-sidebar">
                    <div class="project-section">
                        <div class="project-section-title">TECHNOLOGIES</div>
                        <div class="project-tags">
                            ${techTags}
                        </div>
                    </div>

                    ${meta.status ? `
                    <div class="project-section">
                        <div class="project-section-title">STATUS</div>
                        <div class="project-status">${meta.status}</div>
                    </div>
                    ` : ''}

                    ${linksHtml}
                </div>
            </div>
        </div>
    `;
}
