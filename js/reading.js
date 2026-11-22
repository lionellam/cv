// Reading list helpers, shared by the CV's Reading list section (js/layout-sidebar.js) and the full page (reading.html).
// The list itself is RESUME_DATA.readingList in content.js.
const READING = (() => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  // Muted colours for drawn covers, picked from the title so a book keeps its colour
  const COLOURS = ['#5b4a2e', '#2f4a5b', '#6b3a2e', '#3b5a44', '#2e3550', '#4f4f4f', '#59344f', '#36524f', '#6a5330'];

  const list = () => (typeof RESUME_DATA !== 'undefined' && Array.isArray(RESUME_DATA.readingList) ? RESUME_DATA.readingList : []);
  const isNow = (r) => r.status === 'reading';
  // Finished items, newest first ("finished" is "YYYY-MM")
  const finished = () => list().filter((r) => !isNow(r)).sort((a, b) => String(b.finished ?? '').localeCompare(String(a.finished ?? '')));
  const now = () => list().filter(isNow);
  const year = (r) => (r.finished ? Number(String(r.finished).slice(0, 4)) : null);
  // "2026-10" → "Oct 2026"
  const month = (ym) => {
    const [y, m] = String(ym ?? '').split('-').map(Number);
    return y && m ? `${MONTHS[m - 1]} ${y}` : '';
  };
  const pick = (title) => {
    let h = 0;
    for (const ch of String(title)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return COLOURS[h % COLOURS.length];
  };
  // The cover: the supplied image if there is one, otherwise a drawn cover (journals drawn differently from books)
  const cover = (r) => {
    if (r.cover) return `<img class="rl-cover rl-img" src="${r.cover}" alt="Cover of ${r.title}" loading="lazy">`;
    const bg = r.colour || pick(r.title);
    return r.type === 'Journal'
      ? `<div class="rl-cover rl-drawn journal" style="background:${bg}" aria-hidden="true"><div class="cj">Journal</div><div class="ct">${r.title}</div><div class="ca">${r.author ?? ''}</div></div>`
      : `<div class="rl-cover rl-drawn" style="background:${bg}" aria-hidden="true"><div class="ct">${r.title}</div><div class="ca">${r.author ?? ''}</div></div>`;
  };
  return { list, now, finished, year, month, cover };
})();
