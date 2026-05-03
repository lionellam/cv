# Theme Configuration

The CV site supports three visual themes, each with a light and dark variant. The active theme is set in `config.js` and applies site-wide without any changes to the HTML or layout.

## How to Switch Themes

Open `config.js` and change the `theme` value:

```js
const SITE_CONFIG = {
  theme: "gold" // change this value
};
```

Save the file and reload the page in your browser.

---

## Available Themes

### `gold` — Warm, Classic, Professional
The default theme. Warm off-white background, navy type, and gold accents. A refined, timeless look suited to a professional CV.

### `slate` — Cool, Modern, Sharp
A cool-toned theme with a light grey background, dark slate type, and electric blue accents. Clean and contemporary.

### `paper` — Editorial, Minimal, Refined
A stark white background with black type and deep red accents. Headings use a serif font for an editorial, print-inspired feel.

---

## Dark Mode

Each theme has a built-in dark variant. Visitors can toggle dark mode using the moon/sun button in the navigation bar. Their preference is saved automatically in the browser.

The dark mode toggle works on top of whichever base theme is configured — so there are effectively six combinations:

| Base Theme | Light | Dark |
|---|---|---|
| Gold | `gold` | `gold-dark` |
| Slate | `slate` | `slate-dark` |
| Paper | `paper` | `paper-dark` |

---

## Where the Themes Live

| File | Purpose |
|---|---|
| `config.js` | Sets the active base theme |
| `css/theme.css` | Defines CSS variables for all six theme variants |
| `css/base.css` | Layout and structure — shared across all themes, not edited for theming |
