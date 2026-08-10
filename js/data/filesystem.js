import { projectData } from './projects.js';
import { profileData } from './profile.js';

// Build dynamic Main Projects
const mainProjects = projectData.map(p => ({
    name: p.name,
    type: "project",
    path: `/Projects/${p.name}`,
    metadata: p
}));

export const fileSystem = {
    name: "Nitin's Mac",
    type: "folder",
    path: "/",
    children: [
        {
            name: "Projects",
            type: "folder",
            path: "/Projects",
            children: mainProjects
        },
        {
            name: "About",
            type: "folder",
            path: "/About",
            children: [
                {
                    name: "bio.txt",
                    type: "file",
                    path: "/About/bio.txt",
                    content: `<div style="padding:20px; font-size:16px; line-height:1.6; max-width:600px;">
                        <h2>Biography</h2>
                        <p>${profileData.bio}</p>
                    </div>`
                },
                {
                    name: "education.txt",
                    type: "file",
                    path: "/About/education.txt",
                    content: `<div style="padding:20px; font-size:16px; line-height:1.6; max-width:600px;">
                        <h2>Education</h2>
                        ${profileData.education.map(e => `
                            <div style="margin-bottom: 15px;">
                                <strong>${e.degree} in ${e.major}</strong><br>
                                ${e.university} (${e.years})<br>
                                <em>${e.details}</em>
                            </div>
                        `).join('')}
                    </div>`
                },
                {
                    name: "skills.txt",
                    type: "file",
                    path: "/About/skills.txt",
                    content: `<div style="padding:20px; font-size:16px; line-height:1.6; max-width:600px;">
                        <h2>Technical Skills</h2>
                        <p><strong>Languages:</strong> ${profileData.skills.languages.join(', ')}</p>
                        <p><strong>Technologies:</strong> ${profileData.skills.technologies.join(', ')}</p>
                        <p><strong>Domains:</strong> ${profileData.skills.domains.join(', ')}</p>
                    </div>`
                }
            ]
        },
        {
            name: "Resume",
            type: "file",
            path: "/Resume",
            content: `<div style="padding:20px; font-size:16px; text-align:center;">
                <h2>Resume</h2>
                <p>To view the full interactive resume, please open the <strong>Resume App</strong> from the desktop or dock.</p>
            </div>`
        },
        {
            name: "Contact",
            type: "folder",
            path: "/Contact",
            children: [
                {
                    name: "email.txt",
                    type: "file",
                    path: "/Contact/email.txt",
                    content: `<div style="padding:20px; font-size:16px;">
                        <h2>Email</h2>
                        <p><a href="mailto:${profileData.email}" style="color:var(--accent); text-decoration:none;">${profileData.email}</a></p>
                    </div>`
                },
                {
                    name: "github.url",
                    type: "file",
                    path: "/Contact/github.url",
                    content: `<div style="padding:20px; font-size:16px;">
                        <h2>GitHub</h2>
                        <p><a href="${profileData.github}" target="_blank" style="color:var(--accent); text-decoration:none;">${profileData.github}</a></p>
                    </div>`
                },
                {
                    name: "linkedin.url",
                    type: "file",
                    path: "/Contact/linkedin.url",
                    content: `<div style="padding:20px; font-size:16px;">
                        <h2>LinkedIn</h2>
                        <p><a href="${profileData.linkedin}" target="_blank" style="color:var(--accent); text-decoration:none;">${profileData.linkedin}</a></p>
                    </div>`
                }
            ]
        }
    ]
};

// Helper to find a node by path
export function getFileSystemNode(path) {
    if (path === '/') return fileSystem;
    
    const parts = path.split('/').filter(Boolean);
    let current = fileSystem;
    
    for (const part of parts) {
        if (!current.children) return null;
        const found = current.children.find(c => c.name === part);
        if (!found) return null;
        current = found;
    }
    return current;
}

// Helper to search globally across the filesystem
export function searchFileSystem(query) {
    const results = [];
    const lowerQuery = query.toLowerCase();
    
    function traverse(node) {
        if (node.name.toLowerCase().includes(lowerQuery)) {
            results.push(node);
        }
        if (node.children) {
            node.children.forEach(traverse);
        }
    }
    
    if (fileSystem.children) {
        fileSystem.children.forEach(traverse);
    }
    
    return results;
}
