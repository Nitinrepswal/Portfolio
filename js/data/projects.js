export const projectData = [
    {
        id: "iris",
        name: "IRIS",
        displayName: "IRIS — Personal AI Assistant",
        tagline: "A local-first desktop AI assistant for macOS, combining conversational AI, voice interaction, memory, web search, filesystem tools, and desktop application control.",
        category: "Desktop AI Assistant · Local LLMs",
        flagship: true,
        icon: "assets/icons/iris_icon.png",
        image: "assets/icons/iris.png?v=5",
        imageAlt: "IRIS — Personal AI Assistant macOS Desktop Application",
        isPlaceholderImage: false,
        placeholderNote: "",
        description: "A local-first desktop AI assistant for macOS, combining conversational AI, voice interaction, memory, web search, filesystem tools, and desktop application control. Built with Python, PySide6, and Ollama, IRIS uses Qwen 2.5 3B for local language-model inference, with a separate local vision model for screenshot analysis.",
        overview: "IRIS began as an exploration of AI and machine learning and evolved into a modular desktop assistant. The goal was to go beyond a basic chatbot by connecting a local language model to practical tools, persistent memory, voice input and output, and multi-step task planning.<br><br>The application combines a custom desktop interface with an orchestration layer, tool management, permission controls, and supporting systems for memory, web retrieval, and visual analysis.",
        engineeringFocus: "A major part of the project was integrating multiple components into one desktop application without blocking the interface. PySide6 threads and signals separate important background operations from the GUI.\n\nIRIS also explores the challenges of using a compact local language model for tool-related tasks, managing context across conversations, and introducing permission checks around actions on a personal computer.",
        featuresTitle: "KEY CAPABILITIES",
        features: [
            {
                title: "Local AI Inference",
                badge: "Qwen 2.5 3B · Ollama",
                desc: "Run Qwen 2.5 3B through Ollama on the host machine."
            },
            {
                title: "Desktop Interface",
                badge: "PySide6 GUI",
                desc: "A custom PySide6 GUI with background workers for long-running operations."
            },
            {
                title: "Voice Interaction",
                badge: "macOS Speech",
                desc: "Speech recognition and spoken responses using macOS speech synthesis."
            },
            {
                title: "Filesystem Tools",
                badge: "Guarded FS",
                desc: "Search for files, read content, and create or edit files with applicable permission checks."
            },
            {
                title: "Web Access",
                badge: "Web Retrieval",
                desc: "Search the web and retrieve webpage content."
            },
            {
                title: "Application Launching",
                badge: "macOS Apps",
                desc: "Open supported macOS applications."
            },
            {
                title: "Screenshot Analysis",
                badge: "Local Vision",
                desc: "Capture screenshots and analyze them with a local vision model."
            },
            {
                title: "Memory System",
                badge: "Multi-Tier",
                desc: "Working memory, persistent long-term memory, and a personal profile."
            },
            {
                title: "Task Planning",
                badge: "Decomposition & Recovery",
                desc: "Decompose goals into steps, execute tools, observe results, and attempt recovery."
            },
            {
                title: "Extensibility",
                badge: "Plugin Manager",
                desc: "A plugin manager with a working reference plugin."
            },
            {
                title: "Permission Controls",
                badge: "Security Prompts",
                desc: "Confirmation prompts for selected sensitive operations."
            }
        ],
        architecture: {
            summary: "The application combines a custom desktop interface with an orchestration layer, tool management, permission controls, and supporting systems for memory, web retrieval, and visual analysis.",
            flow: [
                {
                    from: "User Interface (PySide6)",
                    to: "IRIS Core Orchestrator",
                    label: "Prompts, Voice & Screen Data"
                },
                {
                    from: "IRIS Core Orchestrator",
                    to: "Local LLM (Ollama / Qwen 2.5 3B)",
                    label: "Context Assembly & Streamed Inference"
                },
                {
                    from: "IRIS Core Orchestrator",
                    to: "Tool Manager & Permission Controls",
                    label: "Tool Routing & Confirmation Prompts"
                },
                {
                    from: "Tool Manager",
                    to: "Filesystem / Web / Applications / Vision",
                    label: "Guarded Execution & Result Observation"
                }
            ],
            subsystems: [
                {
                    name: "Desktop Interface",
                    icon: "🖥️",
                    desc: "Custom PySide6 GUI with background worker threads and Qt signals preventing UI freezes."
                },
                {
                    name: "Memory System",
                    icon: "🧠",
                    desc: "Working memory, persistent long-term memory, and personal profile information."
                },
                {
                    name: "Vision Pipeline",
                    icon: "👁️",
                    desc: "On-demand screenshot capture analyzed via a local vision model."
                },
                {
                    name: "Voice & Speech",
                    icon: "🎙️",
                    desc: "Speech recognition and spoken responses using macOS speech synthesis."
                },
                {
                    name: "Task Planning",
                    icon: "📋",
                    desc: "Goal decomposition into steps, execution observation, and error recovery."
                },
                {
                    name: "Permission Controls",
                    icon: "🛡️",
                    desc: "Confirmation prompts for selected sensitive desktop and file operations."
                }
            ]
        },
        challenges: [
            {
                title: "Non-Blocking Desktop Interface",
                context: "Integrating multiple components (LLM inference, speech recognition, web access) into one desktop application without freezing the interface.",
                decision: "Utilized PySide6 worker threads and Qt signals to cleanly isolate long-running operations from the GUI main thread, keeping the desktop responsive."
            },
            {
                title: "Compact Local LLM Tool Calling",
                context: "Using a compact local language model (Qwen 2.5 3B) for tool-related tasks reliably without massive cloud-model parameters.",
                decision: "Structured schema prompts, input validation, and execution observation loops to help the 3B model accurately invoke tools and recover from failures."
            },
            {
                title: "Context Management Across Conversations",
                context: "Maintaining coherence and relevant memory across extended conversations within local context window limits.",
                decision: "Divided memory into short-term working memory, persistent long-term storage, and structured personal profile context."
            },
            {
                title: "Permission Boundaries on a Personal Computer",
                context: "Enabling practical computer actions (file editing, app launching) without risking unintended system modifications.",
                decision: "Implemented permission controls that require explicit confirmation prompts for selected sensitive operations."
            }
        ],
        roadmapTitle: "CURRENT LIMITATIONS & FUTURE WORK",
        limitationsNote: "IRIS is an evolving personal project. Areas for improvement include more reliable natural-language tool selection, stronger multi-step task evaluation, better conversation context, expanded permission coverage, and more advanced visual computer interaction.<br><br>Cloud synchronization and broader plugin capabilities remain areas for future development.",
        futureImprovements: [
            {
                title: "Natural-Language Tool Selection",
                status: "Area for Improvement",
                desc: "More reliable natural-language tool selection for local compact language models."
            },
            {
                title: "Multi-Step Task Evaluation",
                status: "Area for Improvement",
                desc: "Stronger multi-step task evaluation, benchmarking, and error-handling verification."
            },
            {
                title: "Conversation Context",
                status: "Area for Improvement",
                desc: "Better context retention and memory retrieval across longer and multifaceted conversations."
            },
            {
                title: "Expanded Permission Coverage",
                status: "Area for Improvement",
                desc: "Broader confirmation prompts and fine-grained authorization policies across system actions."
            },
            {
                title: "Visual Computer Interaction",
                status: "Area for Improvement",
                desc: "More advanced visual computer interaction and visual element grounding."
            },
            {
                title: "Cloud Synchronization & Plugins",
                status: "Future Development",
                desc: "Cloud synchronization and broader plugin capabilities remain areas for future development."
            }
        ],
        technologies: ["Python", "PySide6", "Ollama", "Qwen 2.5 3B", "Local Vision Model", "macOS Speech"],
        status: "Active Development · Personal Project",
        github: "https://github.com/Nitinrepswal/IRIS",
        demo: "",
        primaryButton: {
            text: "Explore Project",
            action: "scroll"
        },
        secondaryButton: {
            text: "View Source Code ↗",
            url: "https://github.com/Nitinrepswal/IRIS",
            external: true
        }
    },
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
    const isFlagship = Boolean(meta.flagship);

    // Tech tags
    const techTags = (meta.technologies || []).map(t => `<span class="tag">${t}</span>`).join('');

    // Primary & Secondary Action Buttons
    let actionsHtml = '';
    if (meta.primaryButton || meta.secondaryButton) {
        const prim = meta.primaryButton || { text: "Explore Project", target: "#project-architecture" };
        const sec = meta.secondaryButton || { text: "View Source Code", url: meta.github };

        const primTarget = prim.target || '#project-architecture';
        actionsHtml = `
            <div class="project-action-buttons">
                <a href="${primTarget}" class="btn btn-primary btn-explore" id="btn-explore-project">${prim.text}</a>
                ${sec.url ? `
                    <a href="${sec.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-source" id="btn-view-source">
                        ${sec.text} ↗
                    </a>
                ` : `
                    <span class="btn btn-secondary btn-disabled" title="Repository URL placeholder">
                        ${sec.text} (URL Required)
                    </span>
                `}
            </div>
        `;
    } else {
        // Fallback for standard projects
        let linksList = '';
        if (meta.github) linksList += `<a href="${meta.github}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">GitHub ↗</a>`;
        if (meta.demo) linksList += `<a href="${meta.demo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Live Demo ↗</a>`;
        if (linksList) {
            actionsHtml = `<div class="project-links">${linksList}</div>`;
        }
    }

    // Media Handling
    let mediaHtml = '';
    if (meta.image) {
        mediaHtml = `
            <div class="project-image-container ${meta.isPlaceholderImage ? 'is-placeholder' : ''}">
                <img src="${meta.image}" alt="${meta.imageAlt || meta.name + ' Screenshot'}" class="project-image">
                ${meta.isPlaceholderImage ? `
                    <div class="image-placeholder-overlay">
                        <span class="placeholder-tag">📷 Visual Placeholder</span>
                        <span class="placeholder-caption">${meta.placeholderNote || 'Screenshot placeholder — can be replaced later'}</span>
                    </div>
                ` : ''}
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

    // Overview & Engineering Focus
    let overviewMotivationHtml = '';
    if (meta.motivation || meta.overview || meta.engineeringFocus) {
        overviewMotivationHtml = `
            <div class="project-section" id="project-overview">
                <div class="project-section-title">PROJECT OVERVIEW</div>
                ${meta.overview ? `<p class="project-paragraph">${meta.overview}</p>` : ''}
                ${meta.engineeringFocus ? `
                    <div class="motivation-callout" style="margin-top: 18px;">
                        <div class="motivation-icon">⚙️</div>
                        <div class="motivation-content">
                            <div class="motivation-title">Engineering Focus</div>
                            <p class="motivation-text">${meta.engineeringFocus.replace(/\n\n/g, '</p><p class="motivation-text" style="margin-top:8px;">')}</p>
                        </div>
                    </div>
                ` : ''}
                ${meta.motivation ? `
                    <div class="motivation-callout" style="margin-top: 18px;">
                        <div class="motivation-icon">💡</div>
                        <div class="motivation-content">
                            <div class="motivation-title">Motivation & Goals</div>
                            <p class="motivation-text">${meta.motivation}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Features / Key Capabilities List
    let featuresHtml = '';
    if (meta.features && meta.features.length > 0) {
        const isRichFeatures = typeof meta.features[0] === 'object';
        const sectionTitle = meta.featuresTitle || (isRichFeatures ? 'KEY CAPABILITIES' : 'KEY FEATURES');
        featuresHtml = `
            <div class="project-section" id="project-features">
                <div class="project-section-title">${sectionTitle}</div>
                <div class="${isRichFeatures ? 'features-rich-grid' : 'feature-list'}">
                    ${meta.features.map((f, idx) => {
                        if (isRichFeatures) {
                            return `
                                <div class="feature-card">
                                    <div class="feature-card-header">
                                        <span class="feature-card-number">${String(idx + 1).padStart(2, '0')}</span>
                                        <span class="feature-card-title">${f.title}</span>
                                        ${f.badge ? `<span class="feature-card-badge">${f.badge}</span>` : ''}
                                    </div>
                                    <p class="feature-card-desc">${f.desc}</p>
                                </div>
                            `;
                        } else {
                            return `
                                <div class="feature-item">
                                    <span class="feature-number">${String(idx + 1).padStart(2, '0')}</span>
                                    <span class="feature-text">${f}</span>
                                </div>
                            `;
                        }
                    }).join('')}
                </div>
            </div>
        `;
    }

    // Architecture Diagram & Explanation
    let architectureHtml = '';
    if (meta.architecture) {
        const arch = meta.architecture;
        architectureHtml = `
            <div class="project-section" id="project-architecture">
                <div class="project-section-title">SYSTEM ARCHITECTURE</div>
                ${arch.summary ? `<p class="project-paragraph">${arch.summary}</p>` : ''}
                
                <div class="architecture-diagram-container">
                    <div class="arch-flow">
                        <!-- Step 1: Presentation Layer -->
                        <div class="arch-card arch-card-ui">
                            <div class="arch-card-header">
                                <span class="arch-icon">🖥️</span>
                                <div>
                                    <div class="arch-card-title">User Interface (PySide6)</div>
                                    <div class="arch-card-sub">Native macOS Dark GUI · Voice Input · Spoken Audio · Screen Trigger</div>
                                </div>
                            </div>
                        </div>

                        <div class="arch-arrow-connector">
                            <span class="arch-arrow-line"></span>
                            <span class="arch-arrow-label">Voice / Text / Screen Input</span>
                            <span class="arch-arrow-char">↓</span>
                        </div>

                        <!-- Step 2: IRIS Core & Connected Subsystems -->
                        <div class="arch-core-block">
                            <div class="arch-card arch-card-core">
                                <div class="arch-card-header">
                                    <span class="arch-icon">⚡</span>
                                    <div>
                                        <div class="arch-card-title">IRIS Core Orchestrator</div>
                                        <div class="arch-card-sub">Central Dispatch Loop · Prompt Assembly · Context Pipeline</div>
                                    </div>
                                </div>
                            </div>

                            <div class="arch-subsystems-panel">
                                <div class="arch-subsystems-title">CONNECTED CORE SUBSYSTEMS</div>
                                <div class="arch-subsystems-grid">
                                    ${arch.subsystems.map(sub => `
                                        <div class="arch-subsystem-pill">
                                            <span class="subsystem-icon">${sub.icon}</span>
                                            <div class="subsystem-details">
                                                <div class="subsystem-name">${sub.name}</div>
                                                <div class="subsystem-desc">${sub.desc}</div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <div class="arch-arrow-split">
                            <div class="arch-split-stem">
                                <span class="arch-arrow-label">Inference Dispatch</span>
                                <span class="arch-arrow-char">↓</span>
                            </div>
                            <div class="arch-split-stem">
                                <span class="arch-arrow-label">Tool Verification</span>
                                <span class="arch-arrow-char">↓</span>
                            </div>
                        </div>

                        <!-- Step 3: Local LLM & Tool Manager -->
                        <div class="arch-parallel-grid">
                            <div class="arch-card arch-card-llm">
                                <div class="arch-card-header">
                                    <span class="arch-icon">🦙</span>
                                    <div>
                                        <div class="arch-card-title">Local LLM (Ollama)</div>
                                        <div class="arch-card-sub">Qwen 2.5 3B · Local-First Inference · Token Streaming</div>
                                    </div>
                                </div>
                                <div class="arch-pill-tag">100% On-Device · Zero Cloud Telemetry</div>
                            </div>

                            <div class="arch-card arch-card-tools">
                                <div class="arch-card-header">
                                    <span class="arch-icon">🛠️</span>
                                    <div>
                                        <div class="arch-card-title">Tool Manager & Registry</div>
                                        <div class="arch-card-sub">Argument Schema Validation · Plugin Interface · Safety Gates</div>
                                    </div>
                                </div>
                                <div class="arch-pill-tag">Human Confirmation for Sensitive Actions</div>
                            </div>
                        </div>

                        <div class="arch-arrow-connector">
                            <span class="arch-arrow-line"></span>
                            <span class="arch-arrow-label">Guarded Execution & Result Observation</span>
                            <span class="arch-arrow-char">↓</span>
                        </div>

                        <!-- Step 4: System Integrations -->
                        <div class="arch-integrations-bar">
                            <div class="arch-integrations-label">SYSTEM TOOLS & CAPABILITIES</div>
                            <div class="arch-tools-row">
                                <div class="arch-tool-badge">
                                    <span class="tool-icon">📁</span>
                                    <div>
                                        <div class="tool-title">Filesystem</div>
                                        <div class="tool-desc">Search, read, create & edit</div>
                                    </div>
                                </div>
                                <div class="arch-tool-badge">
                                    <span class="tool-icon">🌐</span>
                                    <div>
                                        <div class="tool-title">Web Retriever</div>
                                        <div class="tool-desc">Search & content extraction</div>
                                    </div>
                                </div>
                                <div class="arch-tool-badge">
                                    <span class="tool-icon">💻</span>
                                    <div>
                                        <div class="tool-title">Applications</div>
                                        <div class="tool-desc">Open supported macOS apps</div>
                                    </div>
                                </div>
                                <div class="arch-tool-badge">
                                    <span class="tool-icon">⚙️</span>
                                    <div>
                                        <div class="tool-title">System Tools</div>
                                        <div class="tool-desc">Screen capture & vision models</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Challenges & Engineering Decisions
    let challengesHtml = '';
    if (meta.challenges && meta.challenges.length > 0) {
        challengesHtml = `
            <div class="project-section" id="project-challenges">
                <div class="project-section-title">CHALLENGES & ENGINEERING DECISIONS</div>
                <div class="challenges-grid">
                    ${meta.challenges.map(c => `
                        <div class="challenge-card">
                            <div class="challenge-title">
                                <span class="challenge-indicator">⚙️</span>
                                <span>${c.title}</span>
                            </div>
                            ${c.context ? `
                                <div class="challenge-context">
                                    <strong>The Challenge:</strong> ${c.context}
                                </div>
                            ` : ''}
                            <div class="challenge-decision">
                                <strong>Engineering Solution:</strong> ${c.decision || c.solution || c.description}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Future Improvements / Current Limitations & Future Work
    let roadmapHtml = '';
    if ((meta.futureImprovements && meta.futureImprovements.length > 0) || meta.limitationsNote) {
        const title = meta.roadmapTitle || 'FUTURE IMPROVEMENTS (ROADMAP)';
        const note = meta.limitationsNote || 'These items represent active research and planned evolutions, clearly distinguished from verified features above.';
        roadmapHtml = `
            <div class="project-section" id="project-roadmap">
                <div class="project-section-title">${title}</div>
                <p class="roadmap-note">${note}</p>
                ${meta.futureImprovements && meta.futureImprovements.length > 0 ? `
                    <div class="roadmap-grid">
                        ${meta.futureImprovements.map(item => `
                            <div class="roadmap-card">
                                <div class="roadmap-card-header">
                                    <span class="roadmap-item-title">${item.title}</span>
                                    <span class="roadmap-status-badge">${item.status}</span>
                                </div>
                                <p class="roadmap-item-desc">${item.desc}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    const backButtonHtml = finderInstance ? `
        <button class="btn btn-secondary back-to-projects" title="Navigate back to projects folder">← Back to Projects</button>
    ` : `
        <a href="nitinrepswal.dev/projects" data-internal="true" class="btn btn-secondary back-to-projects">← Back to Projects</a>
    `;

    return `
        <div class="project-detail-view ${isFlagship ? 'is-flagship-view' : ''}">
            <div class="project-nav-bar">
                ${backButtonHtml}
                ${isFlagship ? `<span class="flagship-top-badge">★ Featured Flagship Project</span>` : ''}
            </div>

            <div class="project-content">
                <div class="project-main">
                    <div class="project-header">
                        <div class="project-header-left">
                            <h2 class="project-title">${meta.displayName || meta.name || node.name}</h2>
                            <div class="project-tagline">${meta.tagline || meta.category}</div>
                        </div>
                    </div>
                    
                    ${mediaHtml}

                    <div class="project-section" id="project-about">
                        <div class="project-section-title">ABOUT THIS PROJECT</div>
                        <div class="project-description">${meta.description || 'No description provided.'}</div>
                    </div>

                    ${overviewMotivationHtml}
                    ${architectureHtml}
                    ${featuresHtml}
                    ${challengesHtml}
                    ${roadmapHtml}
                </div>
                
                <div class="project-sidebar">
                    <div class="project-sidebar-card">
                        <div class="project-section">
                            <div class="project-section-title">ACTIONS</div>
                            ${actionsHtml}
                        </div>

                        <div class="project-section">
                            <div class="project-section-title">TECHNOLOGIES</div>
                            <div class="project-tags">
                                ${techTags}
                            </div>
                        </div>

                        ${meta.category ? `
                        <div class="project-section">
                            <div class="project-section-title">CATEGORY</div>
                            <div class="project-meta-value">${meta.category}</div>
                        </div>
                        ` : ''}

                        ${isFlagship ? `
                        <div class="project-section">
                            <div class="project-section-title">INFERENCE ENGINE</div>
                            <div class="project-meta-value">Qwen 2.5 3B (Ollama Local)</div>
                        </div>
                        <div class="project-section">
                            <div class="project-section-title">ARCHITECTURE</div>
                            <div class="project-meta-value">Local-First · Private On-Device</div>
                        </div>
                        ` : ''}

                        ${meta.status ? `
                        <div class="project-section">
                            <div class="project-section-title">STATUS</div>
                            <div class="project-status-badge">${meta.status}</div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}
