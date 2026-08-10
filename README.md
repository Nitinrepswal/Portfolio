# Nitin Repswal — Interactive Developer Portfolio

An interactive, macOS-inspired developer portfolio built with pure HTML, CSS, and vanilla JavaScript. It simulates a desktop operating system to provide a unique, engaging way to explore my projects, skills, and background.

## Features

* **Interactive Desktop Environment:** Drag-and-drop windows, Z-index management, and a dynamic Dock with magnification.
* **Finder:** A fully simulated file system allowing you to browse through projects, contact information, and about data.
* **Terminal:** A functional command-line interface simulator that supports commands like `help`, `projects`, `resume`, `contact`, and `clear`.
* **Safari Browser:** A simulated web browser to view detailed project pages with history navigation and tab management.
* **Spotlight Search:** Global search across the simulated file system to quickly find information (Cmd/Ctrl + K).
* **Responsive Design:** Fully responsive, adapting from 4K desktop monitors down to mobile devices.
* **Reduced Motion:** Respects OS-level accessibility preferences for users who prefer fewer animations.

## Tech Stack

* **HTML5:** Semantic structure.
* **CSS3:** Custom properties (variables), Flexbox, Grid, and complex animations. No external frameworks (e.g., Tailwind or Bootstrap).
* **Vanilla JavaScript (ES6+):** Module-based architecture handling state management, window lifecycle, and DOM manipulation without any dependencies (e.g., React or Vue).

## Project Structure

```
├── index.html       # Primary entry point
├── css/             # Modular stylesheets (main, apps, components)
├── js/
│   ├── app.js       # Core initialization
│   ├── core/        # Window management and commands registry
│   ├── data/        # Centralized data sources (projects, profile)
│   ├── desktop/     # Desktop, Dock, Menu Bar scripts
│   └── apps/        # Individual application logic (Finder, Terminal, etc.)
└── assets/          # Icons, images, and resume PDF
```

## Running Locally

Because this project uses ES6 Modules (`type="module"` in the script tag), it must be served over HTTP/HTTPS rather than via the `file://` protocol.

The simplest way to run this locally is to use a basic static file server.

Using Node.js (`npx`):
```bash
npx serve .
```

Using Python:
```bash
python3 -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

## Deployment

This portfolio is entirely static and has zero dependencies. It is ready to be deployed directly to **GitHub Pages**, Vercel, Netlify, or any standard web host.

Ensure that the repository root is served, and `index.html` is the entry file.

## Updating Content

The architecture makes it easy to update content without touching the UI logic:
* **`js/data/profile.js`:** Update your bio, skills, education, and links here.
* **`js/data/projects.js`:** Add, remove, or modify your portfolio projects here.
* **`js/data/filesystem.js`:** Controls the simulated folder structure in the Finder app.

## Resume

To update the resume, simply replace the file at:
`assets/resume/resume.pdf`
