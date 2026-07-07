# CV Website — Site Specification & How-To Guide

A personal reference document covering the structure, design system, and content model of this CV website. Use this to understand how the site works and how to make changes confidently.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [File Structure](#2-file-structure)
3. [How the Site Renders](#3-how-the-site-renders)
4. [Content Model — content.js](#4-content-model--contentjs)
5. [Theming System](#5-theming-system)
6. [Layout & CSS](#6-layout--css)
7. [Responsive Behaviour](#7-responsive-behaviour)
8. [How to Make Common Changes](#8-how-to-make-common-changes)
9. [Running Locally](#9-running-locally)
10. [Deployment](#10-deployment)

---

## 1. Project Overview

A single-page, static CV website. No frameworks, no build tools, no server-side code. It is plain HTML, CSS, and JavaScript — the browser renders everything directly.

**Key design decisions:**
- All content lives in one JavaScript object (`content.js`). Editing content never requires touching HTML.
- The page is rendered entirely by JavaScript on load — the HTML file itself has no visible text content, only empty container elements.
- Theming is config-driven and supports light/dark toggling without a page reload.

**GitHub repository:** `https://github.com/lionellam/cv`

---

## 2. File Structure

```
Project-CV/
├── index.html          # The page shell — containers and render script
├── content.js          # All CV content (the only file you normally edit)
├── config.js           # Site configuration (active theme)
├── css/
│   ├── theme.css       # Colour tokens for all themes (light + dark variants)
│   └── base.css        # Layout, typography, component styles
├── files/
│   └── lionellam-cv.pdf    # Downloadable CV PDF
├── img/
│   ├── badge-*.png     # Certification badge images
│   └── logo-*.png      # University logo images
├── THEMES.md           # Theme configuration instructions
└── SITE_SPEC.md        # This file
```

---

## 3. How the Site Renders

The page is blank HTML until JavaScript runs. Here is the sequence on load:

1. **`theme.css`** is loaded — defines all CSS custom property colour tokens.
2. **`base.css`** is loaded — defines layout and component styles using those tokens.
3. **`config.js`** is loaded — sets `SITE_CONFIG.theme` (e.g. `"gold"`).
4. An inline `<script>` in `<head>` runs immediately (before the page paints) and sets `data-theme` on `<html>`. This prevents a flash of the wrong theme.
5. After the DOM is ready, `content.js` is loaded — populates `RESUME_DATA`.
6. The `DOMContentLoaded` render script in `index.html` reads `RESUME_DATA` and injects HTML into every named container element (`#experience-container`, `#skills-container`, etc.).

**In short:** edit `content.js` → browser re-renders content on next load.

---

## 4. Content Model — content.js

All CV content is a single JavaScript constant: `RESUME_DATA`. Below is a field-by-field reference.

### 4.1 Top-level fields

```js
const RESUME_DATA = {
  lastUpdated: "7 July 2026",   // Shown in footer, bottom-right
  profile: { ... },
  summary: [ ... ],
  experience: [ ... ],
  earlierCareer: [ ... ],
  volunteer: [ ... ],
  skills: [ ... ],
  certifications: [ ... ],
  publications: [ ... ],
  education: [ ... ]
};
```

---

### 4.2 `profile`

```js
profile: {
  name: "Lionel Lam Song Poh",
  jobTitle: "Independent Scholar",          // Displayed above your name in gold
  postnominals: "PMP, PMI-ACP, ...",        // Displayed below your name
  contacts: [
    { label: "email@example.com", link: "mailto:email@example.com" },
    { label: "linkedin.com/in/lamsp", link: "https://linkedin.com/in/lamsp" }
  ]
}
```

---

### 4.3 `summary`

An array of strings — each string is one paragraph in the Summary section.

```js
summary: [
  "First paragraph...",
  "Second paragraph...",
  ...
]
```

To add a paragraph: append a new string to the array.
To reorder: move the strings around.

---

### 4.4 `experience`

An array of employer objects. The first item in the array appears first on the page (most recent role at the top).

```js
experience: [
  {
    employer: "Employer Name",
    role: "Job Title",           // Displayed in gold, uppercase, below employer name
    projects: [
      {
        title: "Project or Product Name",
        period: "Jan 2025 – Present<br>Organisation or Division Name",
        // <br> creates a line break between date range and sub-label
        bullets: [
          "Bullet point one.",
          "Bullet point two."
        ]
      }
    ]
  }
]
```

**Notes:**
- One employer can have multiple projects (they appear as rows under the same employer block).
- `bullets` can be an empty array `[]` if there is nothing to add yet.
- The `<br>` tag in `period` is intentional — it separates the date from the division/agency name on a second line.

---

### 4.5 `earlierCareer`

A simpler array for older roles — displayed as a compact two-column list (employer | description).

```js
earlierCareer: [
  {
    employer: "Company Name",
    desc: "Role — Brief description (Start – End)"
  }
]
```

---

### 4.6 `volunteer`

Same structure as `experience` — employer, role, projects with title/period/bullets. Rendered under "Other Contributions".

---

### 4.7 `skills`

An array of skill groups, each with a category name and an array of tags.

```js
skills: [
  { category: "Project Management", tags: ["Planning & Scheduling", "Agile", ...] },
  { category: "Artificial Intelligence", tags: ["Claude Code", ...] }
]
```

The skills are split automatically into two columns — the render script divides the array at the midpoint. You do not need to manage column assignment manually.

---

### 4.8 `certifications`

```js
certifications: [
  {
    name: "PMP — Project Management Professional",
    issuer: "Project Management Institute",
    id: "2807795",
    badge: "img/badge-pmp.png"    // Path relative to index.html
  }
]
```

Displayed as a 4-column grid (2-column on tablet, 1-column on mobile). To add a certification: add the badge image to `img/`, then add a new object to this array.

---

### 4.9 `publications`

```js
publications: [
  {
    title: "Article Title",
    date: "Jan 2026",
    link: "https://...",
    bullets: [
      "Summary paragraph one.",
      "Summary paragraph two."
    ]
  }
]
```

Each publication renders with a "Read article →" button that opens the link in a new tab.

---

### 4.10 `education`

```js
education: [
  {
    period: "2025 – 2027 (Expected)",
    degree: "Master of Science in Project Management",
    school: "Nanyang Technological University (NTU), Singapore",
    logo: "img/logo-ntu.png"
  }
]
```

Displayed as a three-column row: period | degree + school | logo.

---

### 4.11 `lastUpdated`

```js
lastUpdated: "7 July 2026"
```

Plain string. Shown in the footer, flush to the bottom-right on desktop/tablet, and on a new line below the copyright on mobile. Update this manually whenever you publish a meaningful change.

---

## 5. Theming System

### 5.1 How themes work

The `<html>` element carries a `data-theme` attribute. CSS rules in `theme.css` use attribute selectors to apply the correct colour tokens:

```css
[data-theme="gold"]      { --bg: #fdfcf9; --accent: #7a6032; ... }
[data-theme="gold-dark"] { --bg: #0f1520; --accent: #c9a96e; ... }
```

All layout and component styles in `base.css` reference these tokens (e.g. `color: var(--heading)`) — they never hard-code colours. This means changing the theme instantly repaints the whole site.

### 5.2 Available themes

| Theme name | Character | Accent colour |
|---|---|---|
| `gold` | Warm, classic, professional | Warm gold (#7a6032) |
| `slate` | Cool, modern, sharp | Electric blue (#2563eb) |
| `paper` | Editorial, minimal, serif | Deep red (#b91c1c) |

Each theme has a `-dark` variant (e.g. `gold-dark`).

The `paper` theme also applies a serif font (`Georgia`) to the `<h1>` heading and uses a thinner top rule bar.

### 5.3 Changing the active theme

Edit `config.js`:

```js
const SITE_CONFIG = {
  theme: "gold"   // Change to "slate" or "paper"
};
```

### 5.4 Dark / light toggle

The moon/sun button in the nav toggles between the base theme and its `-dark` variant. The user's preference is saved in `localStorage` under the key `theme-dark` (`"true"` or `"false"`). This persists across browser sessions.

The logic: on load, `config.js` sets the base theme; `localStorage` determines whether to append `-dark`.

### 5.5 CSS token reference

| Token | Purpose |
|---|---|
| `--bg` | Page background |
| `--bg-glass` | Navigation bar background (with transparency) |
| `--white` | Card/panel surfaces (e.g. skill tags, cert cards) |
| `--border` | Strong borders (section dividers, header underline) |
| `--border-light` | Subtle row dividers |
| `--heading` | Primary headings (name, employer names) |
| `--heading-mid` | Secondary headings (project names) |
| `--accent` / `--gold` | Brand accent — used for job title, rule bars, buttons, bullet dots |
| `--accent-light` / `--gold-light` | Lighter accent — used for bullet dots in body text |
| `--text` | Body text |
| `--text-mid` | Slightly muted body text (bullet content) |
| `--text-muted` | Muted text (postnominals, school name) |
| `--text-faint` | Faint text (dates, skill category labels, footer) |

`--gold` and `--gold-light` are legacy aliases for `--accent` and `--accent-light` — they are equivalent and interchangeable.

---

## 6. Layout & CSS

### 6.1 Page width

Content is constrained to `max-width: 950px`, centred, with `24px` side padding.

### 6.2 Section structure

Each section follows this pattern in HTML:

```html
<section class="section">
  <div class="section-header" id="section-anchor">
    <h2 class="section-title">Section Name</h2>
    <div class="section-rule"></div>   <!-- The horizontal rule to the right of the title -->
  </div>
  <div id="section-container"></div>  <!-- Populated by JavaScript -->
</section>
```

### 6.3 Experience / Volunteer layout

Each employer block renders:
- Employer name (large, bold)
- Role (small, uppercase, accent colour)
- One or more project rows in a two-column grid: `220px left (period)` | `1fr right (title + bullets)`

### 6.4 Skills layout

Two-column grid (`1.2fr | 1fr`). The JavaScript render script splits the skills array at its midpoint and places each half in a column — no manual column management needed.

### 6.5 Footer

```css
footer {
  display: flex;
  justify-content: space-between;  /* copyright left, last updated right */
  align-items: flex-end;
  border-top: 2px solid var(--border);
}
```

On mobile (`≤768px`): switches to `flex-direction: column` with `gap: 8px`, so both lines stack left-aligned.

---

## 7. Responsive Behaviour

| Breakpoint | Changes |
|---|---|
| `≤900px` | Certifications grid goes from 4 columns to 2. Nav link padding narrows. |
| `≤768px` | Header becomes single-column (name/contacts stack). Two-column layouts (skills, project rows, earlier career) collapse to single column. Nav links hide; hamburger menu appears. Footer stacks vertically. |
| `≤480px` | Certifications grid collapses to 1 column. |

---

## 8. How to Make Common Changes

### Update the last updated date
Edit `lastUpdated` at the top of `content.js`.

### Change the job title (under your name)
Edit `profile.jobTitle` in `content.js`.

### Add a new experience entry
Add a new object to the top of the `experience` array in `content.js`. Copy the structure from an existing entry. Leave `bullets: []` if you have nothing to add yet.

### Add bullet points to an existing role
Find the matching entry in `experience`, locate the correct project object, and add strings to its `bullets` array.

### Add a new skill category
Append a new object to the `skills` array: `{ category: "Category Name", tags: ["Tag 1", "Tag 2"] }`. Column placement is automatic.

### Add a certification
1. Place the badge image in `img/` (name it `badge-<shortname>.png`).
2. Add a new object to the `certifications` array.

### Add a publication
Append a new object to the `publications` array with `title`, `date`, `link`, and `bullets`.

### Change the active theme
Edit `config.js` — set `theme` to `"gold"`, `"slate"`, or `"paper"`.

### Add a new theme
1. Add a new `[data-theme="mytheme"]` and `[data-theme="mytheme-dark"]` block to `theme.css` defining all required CSS tokens.
2. Update `config.js` with the new theme name.
3. Document it in `THEMES.md`.

---

## 9. Running Locally

Start a local web server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

> Do not open `index.html` directly as a file (`file://...`) — browsers block loading of local JavaScript modules that way.

---

## 10. Deployment

The site is hosted via GitHub Pages from the `main` branch of `https://github.com/lionellam/cv`.

Deployment is automatic — any push to `main` goes live within seconds.

**Typical workflow:**
1. Make changes to `content.js` (or other files).
2. Preview locally via `python3 -m http.server 8000`.
3. When satisfied, commit and push:
   ```bash
   git add content.js
   git commit -m "Describe what changed"
   git push
   ```

There is no build step. What you see locally is exactly what goes live.
