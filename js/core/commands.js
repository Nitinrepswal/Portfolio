import { fileSystem } from '../data/filesystem.js';
import { projectData } from '../data/projects.js';
import { profileData } from '../data/profile.js';

export const commands = {
    help: (args, context) => {
        return `
Available commands:

  <span class="term-color-green">about</span>           About Nitin
  <span class="term-color-green">projects</span>        List projects
  <span class="term-color-green">project</span>         Open a specific project (e.g., project codevise)
  <span class="term-color-green">skills</span>          Show skills
  <span class="term-color-green">experience</span>      Show experience
  <span class="term-color-green">education</span>       Show education
  <span class="term-color-green">extracurricular</span> Show extracurriculars
  <span class="term-color-green">certifications</span>  Show certifications
  <span class="term-color-green">github</span>          Open GitHub
  <span class="term-color-green">linkedin</span>        Open LinkedIn
  <span class="term-color-green">contact</span>     Contact information
  <span class="term-color-green">resume</span>      Open resume
  <span class="term-color-green">whoami</span>      Current user
  <span class="term-color-green">date</span>        Current date/time
  <span class="term-color-green">neofetch</span>    System information
  <span class="term-color-green">clear</span>       Clear terminal
        `.trim();
    },

    about: (args, context) => {
        context.aboutApp.open();
        return `
<span class="term-bold">${profileData.name}</span>
${profileData.role}

${profileData.bio}

<span class="term-color-muted">Tip: Opened About window. Type "projects" to explore my work.</span>
        `.trim();
    },

    projects: (args, context) => {
        context.finderApp.open('/Projects');
        
        let output = `<span class="term-bold">PROJECTS</span>\n\n`;
        projectData.forEach((p, idx) => {
            output += `${String(idx + 1).padStart(2, '0')}  ${p.name}\n    <span class="term-color-muted">${p.category}</span>\n\n`;
        });
        
        output += `<span class="term-color-muted">Tip: Type "project [name]" to open directly.</span>`;
        return output.trim();
    },

    project: (args, context) => {
        if (args.length === 0) {
            return `<span class="term-color-red">Error: Missing project name. Usage: project &lt;name&gt;</span>`;
        }
        
        const query = args.join(' ').toLowerCase();
        
        // Find matching project
        const match = projectData.find(p => p.name.toLowerCase().includes(query));
        if (match) {
            const targetPath = `/Projects/${match.name}`;
            context.finderApp.open(targetPath);
            return `Opening ${match.name}...`;
        } else {
            return `<span class="term-color-red">Unknown project: ${query}</span>\nType "projects" to see available projects.`;
        }
    },

    open: (args, context) => {
        if (args.length === 0) {
            return `<span class="term-color-red">Error: Missing argument. Usage: open &lt;app|route&gt;</span>`;
        }
        const target = args[0].toLowerCase();
        if (target === 'safari') {
            if (context.browserApp) {
                context.browserApp.open();
                return `Opening Safari...`;
            }
        } else if (target === 'projects') {
            if (context.browserApp) {
                context.browserApp.open('nitinrepswal.dev/projects');
                return `Opening Projects in Safari...`;
            }
        }
        return `Opened ${target}`;
    },

    skills: (args, context) => {
        const lines = Object.entries(profileData.skills).map(([key, list]) => {
            const title = (key.charAt(0).toUpperCase() + key.slice(1) + ':').padEnd(14, ' ');
            return `<span class="term-bold">${title}</span> ${list.join(', ')}`;
        }).join('\n');
        
        return lines;
    },

    experience: (args, context) => {
        return profileData.experience.map(e => `
<span class="term-bold">${e.title}</span> at ${e.company}
<span class="term-color-muted">${e.location} | ${e.date}</span>
${e.description}
        `.trim()).join('\n\n');
    },

    education: (args, context) => {
        return profileData.education.map(e => `
<span class="term-bold">${e.degree}</span> - ${e.major}
<span class="term-color-muted">${e.university} | ${e.years}</span>
${e.details}
        `.trim()).join('\n\n');
    },

    extracurricular: (args, context) => {
        return profileData.extracurriculars.map(e => `
<span class="term-bold">${e.title}</span> - ${e.organization}
<span class="term-color-muted">${e.date}</span>
${e.description}
        `.trim()).join('\n\n');
    },

    certifications: (args, context) => {
        return profileData.certifications.map(c => `
- <span class="term-bold">${c.name}</span> (${c.issuer}) - <span class="term-color-muted">${c.date}</span>
        `.trim()).join('\n');
    },

    github: (args, context) => {
        const url = profileData.github;
        window.open(url, '_blank', 'noopener,noreferrer');
        return `Opening GitHub... (<a href="${url}" target="_blank" class="term-link">${url}</a>)`;
    },

    linkedin: (args, context) => {
        const url = profileData.linkedin;
        window.open(url, '_blank', 'noopener,noreferrer');
        return `Opening LinkedIn... (<a href="${url}" target="_blank" class="term-link">${url}</a>)`;
    },

    contact: (args, context) => {
        if (context.contactApp) {
            context.contactApp.open();
        }
        return `
<span class="term-bold">Contact Information</span>

Email:    <span class="term-color-blue">${profileData.email}</span>
GitHub:   <a href="${profileData.github}" target="_blank" class="term-link">${profileData.github}</a>
LinkedIn: <a href="${profileData.linkedin}" target="_blank" class="term-link">${profileData.linkedin}</a>
        `.trim();
    },

    email: (args, context) => {
        const mailtoLink = `mailto:${profileData.email}`;
        window.location.href = mailtoLink;
        return `Opening mail client for ${profileData.email}...`;
    },

    resume: (args, context) => {
        if (context.resumeApp) {
            context.resumeApp.open();
        }
        return `Opening Resume viewer...`;
    },

    whoami: (args, context) => {
        return `
${profileData.name}
${profileData.role}
        `.trim();
    },

    sudo: (args, context) => {
        return `Nice try 😄 This incident will be reported.`;
    },

    matrix: (args, context) => {
        return `Wake up, Nitin...<br>The Matrix has you...<br>Follow the white rabbit.`;
    },

    date: (args, context) => {
        return new Date().toString();
    },

    clear: (args, context) => {
        // Handled directly by TerminalApp to clear DOM
        return '__CLEAR__';
    },

    neofetch: (args, context) => {
        return `
<div class="neofetch-container">
    <div class="neofetch-logo">
      ████████
    ████████████
   ███  <span style="color:#e0e0e0">NITIN</span>  ███
    </div>
    <div class="neofetch-info">
        <div class="neofetch-title">nitin<span class="host">@mac</span></div>
        <div class="neofetch-sep">---------</div>
        <div class="neofetch-row"><span class="key">OS</span> NitinOS (Portfolio Simulation)</div>
        <div class="neofetch-row"><span class="key">Shell</span> nitin-shell v1.0</div>
        <div class="neofetch-row"><span class="key">Focus</span> Software Development</div>
        <div class="neofetch-row"><span class="key">Uptime</span> Always learning</div>
    </div>
</div>
        `.trim();
    }
};

export const commandNames = Object.keys(commands);
