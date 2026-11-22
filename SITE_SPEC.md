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
11. [Possible Future Changes](#11-possible-future-changes)

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
├── reading.html        # The full reading list, linked from the CV's Reading list section
├── content.js          # All CV content (the only file you normally edit)
├── config.js           # Site configuration (active theme and layout)
├── css/
│   ├── theme.css       # Colour tokens for all themes (light + dark variants)
│   ├── base.css        # Classic layout: layout, typography, component styles
│   ├── layout-sidebar.css  # Sidebar layout styles (used instead of base.css)
│   └── reading.css     # Reading list covers (the CV section and reading.html)
├── js/
│   ├── layout-sidebar.js   # Draws the sidebar layout from content.js
│   └── reading.js      # Reading list helpers (covers, dates), shared with reading.html
├── files/
│   └── lionellam-cv.pdf    # Downloadable CV PDF
├── img/
│   ├── badge-*.png     # Certification badge images
│   ├── logo-*.png      # University logo images
│   └── reading/        # Reading list cover images (create when the first one is added)
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
  resources: [ ... ],
  readingList: [ ... ],
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

In the classic layout, displayed as a 4-column grid (2-column on tablet, 1-column on mobile) with 80px badges. In the sidebar layout, two per row (one on phones), each with a 56px badge beside its name, large enough for the badge lettering to be read. To add a certification: add the badge image to `img/`, then add a new object to this array.

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

### 4.11 `readingList`

```js
readingList: [
  {
    title: "Thinking in Systems: A Primer",
    author: "Donella H. Meadows",
    type: "Book",                 // "Book" or "Journal"
    status: "reading",            // "reading" (reading now) or "read"
    finished: "2026-10",          // "YYYY-MM", for items that have been read
    link: "https://…",                        // optional, makes the title a link on reading.html
    cover: "img/reading/thinking-in-systems.jpg"  // optional
  }
]
```

Books and journals being read now, and already read. Both layouts show it.

- **On the CV:** a Reading list section after Resources ("Reading List" in the classic layout, where each cover sits on a card with a gold top edge, like Certifications), with its own menu item, showing two shelves of covers: **Reading now** (everything with `status: "reading"`) and **Recently read** (the four most recently finished, by `finished`), each with its title and author, then a **See the full reading list →** link. Four covers to a row, two on phones. The section and its menu item stay hidden while the list is empty.
- **On `reading.html`:** the whole list, with a short introduction, filters for All / Books / Journals (shown only when the list has both), and two groups, each with its count: **Reading now**, then **Read**, with every finished item newest first. Each group is a grid of covers, five in a row (two on phones), with the title (linked if `link` is set) and author beneath; finished items also show the month they were finished, for example "Finished Oct 2026". The page uses the configured theme, in dark if the visitor chose dark on the CV, and has a "← Back to CV" link.
- **Covers:** with `cover`, the image is shown, cropped to a book's 2:3 shape; about 400 × 600 pixels and under 150 KB is plenty. Without it, a cover is drawn from the title and author in a muted colour picked from the title (journals are drawn squarer and labelled "Journal"). The drawn cover's colour can be chosen with `colour: "#2f4a5b"`.

---

### 4.12 `lastUpdated`

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

### 5.5 Choosing a layout

The site has two layouts, both drawn from the same `content.js` and theme colours:

| Layout | Character | Files |
|---|---|---|
| `classic` | The original layout: top navigation bar, cards and badges | `base.css` and the render script in `index.html` |
| `sidebar` | Minimal: a fixed side menu (a top bar with a slide-out menu on phones) and one reading column | `css/layout-sidebar.css` and `js/layout-sidebar.js` |

Edit `config.js`:

```js
const SITE_CONFIG = {
  theme: "gold",
  layout: "classic"   // Change to "sidebar"
};
```

#### The sidebar layout in detail

**Computers and tablets (wider than 900px):**
- **Side menu** (pinned on the left while the page scrolls): job title, name, post-nominals, contact links, the list of sections, and at the bottom the **Download CV** button, the light/dark switch and "Last updated".
- **Current section:** the section being read is marked in the menu with an accent bar. Choosing a section from the menu keeps it marked until the reader scrolls by hand, and at the very bottom of the page the last section (Education) is marked, since it can be too short to reach the reading position. Choosing **Summary**, the first section, scrolls right to the top of the page (on phones, back above the profile), rather than to the Summary heading; opening the page at `#summary` does the same.
- **Reading column:** one column of content, with a hairline after each section heading, and the © footer at the bottom, level with "Last updated" in the menu. Certifications show two per row, with a 56px badge beside each name. Bulleted lists (Experience, Publications, Other contributions) use the classic layout's gold dot (`--accent-light`), with the sidebar's slightly smaller 14.5px text and 10px between bullets.
- **Wide screens:** the side menu and reading column form one centred block, at most 1,240px wide. On screens wider than 1,280px, where the block leaves a margin on each side, it has a hairline down each outer edge (`--border-light`, matching the line beside the menu) and a soft 32px shadow beyond it, so the column sits above the margins like a sheet of paper. The block runs the full height of the page, and its shadow is clipped to the left and right sides. A copy of the column (background, outer lines, the line beside the menu and the shadow) is drawn on a layer fixed behind the page (`body::before`), lined up exactly with the block, so it can't be seen at rest. When a trackpad or phone pulls past the top or bottom of the page (rubber banding), the layer stays put and the column carries on into the pulled area instead of stopping abruptly. This relies on the browser keeping fixed elements still while rubber banding; a browser that doesn't simply shows the column ending, as before. The shadow colour is set per theme (`--sb-shadow` in `css/layout-sidebar.css`): warm for gold, blue-grey for slate, neutral for paper, and a deeper black in dark mode, where it is much less visible.

**Phones and narrow windows (900px and narrower):**
- **Top bar** (pinned at the top): the light/dark switch (a moon in light mode, a sun in dark mode, as in the classic layout) and the menu button, on the right. The name isn't shown in the bar.
- **Profile at the top of the page**, centred: job title, name and post-nominals, followed by Summary. Contact links and the **Download CV** button are in the menu.
- **Slide-out menu:** opens from the left over the darkened page and holds the same as the side menu on wider screens, left-aligned: job title, name, post-nominals, contact links, the list of sections (with the current one marked), and at the bottom the **Download CV** button and "Last updated". Only the light/dark switch is left out, as it's in the top bar. Tapping a section, the darkened page or the cross closes it.
- **Back to top:** a round accent-coloured button with an up arrow, as in the classic layout, appears in the bottom-right corner once the reader has scrolled down 300px, and scrolls smoothly back to the top.
- **Content:** two-column rows (dates beside entries, skill categories, education) stack into one column, and certifications go to one column. No edge lines or shadow.

**Previewing without editing config:** on a local server only, add `?layout=sidebar` or `?layout=classic` to the address, for example `http://localhost:8080/?layout=sidebar`. This is ignored on the live site, so only `config.js` decides what visitors see.

Both layouts share the dark/light preference (`theme-dark` in `localStorage`), so switching layouts keeps the visitor's choice.

### 5.6 CSS token reference

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

This section describes the classic layout (`css/base.css`). The sidebar layout is described in Section 5.5.

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

**Classic layout:**

| Breakpoint | Changes |
|---|---|
| `≤900px` | Certifications grid goes from 4 columns to 2. Nav link padding narrows. |
| `≤768px` | Header becomes single-column (name/contacts stack). Two-column layouts (skills, project rows, earlier career) collapse to single column. Nav links hide; hamburger menu appears. Footer stacks vertically. |
| `≤480px` | Certifications grid collapses to 1 column. |

**Sidebar layout** (details in Section 5.5):

| Breakpoint | Changes |
|---|---|
| `>1280px` | Hairline down each outer edge of the centred block, with a soft shadow beyond it, and the column continued on a fixed layer behind the page for rubber banding. |
| `≤900px` | The side menu becomes a slide-out menu, opened from a top bar holding the light/dark switch and the menu button. A centred profile (title, name, post-nominals) appears at the top of the page. The back-to-top button appears after scrolling. Two-column rows and the certifications grid stack into one column. Summary paragraphs are left-aligned instead of justified. |

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

### Add to the reading list
1. Add an object to `readingList` in `content.js` with `title`, `author`, `type` and `status: "reading"` (see Section 4.11).
2. Optionally, put its cover image in `img/reading/` and set `cover`.
3. When you finish it, change `status` to `"read"` and add `finished: "YYYY-MM"`.

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

---

## 11. Possible Future Changes

Ideas discussed but not yet scheduled.

### Drive the menu and section order from `content.js`

*Discussed 22 November 2026; deferred to a future release.*

**Today:** in the sidebar layout, the menu's labels and order are a fixed list in `js/layout-sidebar.js` (`sections`; since November 2026 it includes Reading list, which is left out while `readingList` is empty), and the page draws its sections in a fixed order in the same file, each with its own heading. `content.js` only holds the text inside each section. The two can differ: the menu says "Contributions" where the heading says "Other contributions". Adding a section to `content.js` doesn't add it to the menu or the page. The classic layout's menu is written twice in `index.html` (its Reading List items are marked `data-reading` and stay hidden while the list is empty). With nine items, the classic top menu tightens its spacing below 1,140px and switches to the phone menu below 1,000px.

**Options considered:**

- **A. Menu only:** a `sections` list in `content.js` (`id`, `label`) builds the menu, but the page keeps its fixed order. Smallest change, but the menu and page can disagree, and removing an item hides it from the menu only.
- **B. Menu and page follow one list (recommended):** `sections: [{ id, menu, heading }]` in `content.js`, where `heading` is only needed when it differs from `menu` (for example `{ id: "contributions", menu: "Contributions", heading: "Other contributions" }`). The layout keeps one drawing function per section, keyed by `id`, draws them in the list's order and builds the menu from the same list. Reordering, relabelling or hiding a section is then a `content.js` change; a new kind of section still needs code, and an unknown `id` is skipped with a console warning. The scroll highlight, "the first section scrolls to the top" and "the last section is marked at the bottom of the page" would follow the list's first and last entries.
- **C. Fully data-driven sections:** each section in `content.js` declares a type (paragraphs, dated entries, tag rows, badge cards, download links) drawn by general functions, so new sections need no code. A large rewrite with a real risk of changing each section's hand-tuned look; more than the site needs today.

**Also to decide:** whether the classic layout (not in use) follows the list too (suggested: leave it as it is, and say so here); whether `lastUpdated` is bumped for a change visitors can't see (suggested: no); and documenting the `sections` list in Section 4.
