// Sidebar layout: draws the CV from RESUME_DATA when config.js sets layout: "sidebar".
// Styles are in css/layout-sidebar.css; the classic layout is untouched.
document.addEventListener('DOMContentLoaded', () => {
  if (window.SITE_LAYOUT !== 'sidebar') return;
  const d = RESUME_DATA;
  const bullets = (list) => `<ul class="sb-bullets">${list.map((b) => `<li>${b}</li>`).join('')}</ul>`;
  // The Reading list section and its menu item appear only once content.js has entries in readingList
  const hasReading = typeof READING !== 'undefined' && READING.list().length > 0;
  const sections = [
    ['summary', 'Summary'], ['experience', 'Experience'], ['skills', 'Skills'], ['certifications', 'Certifications'],
    ['publications', 'Publications'], ['resources', 'Resources'], ['reading', 'Reading list'], ['contributions', 'Contributions'], ['education', 'Education'],
  ].filter(([id]) => id !== 'reading' || hasReading);

  // Reading list: everything being read now, the four most recently finished, and a link to the full list (reading.html)
  const shelf = (label, list) => list.length ? `<div class="sb-label">${label}</div><div class="rl-shelf">${list.map((r) => `
    <div class="rl-item">${READING.cover(r)}<div class="rl-title">${r.title}</div><div class="rl-by">${r.author ?? ''}</div></div>`).join('')}</div>` : '';
  const readingSection = () => `
      <section id="reading"><h2 class="sb-heading">Reading list</h2>
        ${shelf('Reading now', READING.now())}${shelf('Recently read', READING.finished().slice(0, 4))}
        <a class="sb-more rl-all" href="reading.html">See the full reading list →</a>
      </section>
`;

  const employer = (e) => `
    <div class="sb-entry">
      <div class="sb-when">${e.projects[0]?.period ?? ''}</div>
      <div>
        <div class="sb-org">${e.employer}</div>
        <div class="sb-role">${e.role}</div>
        ${e.projects.map((p, i) => `${i ? `<div class="sb-when" style="margin-top:14px">${p.period}</div>` : ''}<div class="sb-proj">${p.title}</div>${bullets(p.bullets)}`).join('')}
      </div>
    </div>`;

  const root = document.createElement('div');
  root.id = 'sidebar-root';
  root.innerHTML = `
    <div class="sb-bar">
      <div class="sb-bar-icons">
      <button id="sb-bar-theme" aria-label="Toggle light or dark mode"><svg class="sb-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><svg class="sb-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg></button>
      <button id="sb-menu" aria-label="Open menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      </div>
    </div>
    <div class="sb-scrim" id="sb-scrim"></div>
    <!-- Phones only: back to the top, as in the classic layout -->
    <button class="sb-top" id="sb-top" aria-label="Back to top"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg></button>

    <div class="sb-wrap">
    <aside class="sb-side">
      <button class="sb-close" id="sb-close" aria-label="Close menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="sb-id">
        <div class="sb-title">${d.profile.jobTitle}</div>
        <h1>${d.profile.name}</h1>
        <div class="sb-post">${d.profile.postnominals}</div>
      </div>
      <ul class="sb-contacts">${d.profile.contacts.map((c) => `<li><a href="${c.link}">${c.label}</a></li>`).join('')}</ul>
      <nav class="sb-nav"><ul>${sections.map(([id, label]) => `<li><a href="#${id}" data-id="${id}">${label}</a></li>`).join('')}</ul></nav>
      <div class="sb-foot">
        <a class="sb-btn" href="files/lionellam-cv.pdf" target="_blank" rel="noopener noreferrer">Download CV</a>
        <button class="sb-toggle" id="sb-theme" aria-label="Toggle light or dark mode">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span id="sb-theme-label"></span>
        </button>
        <div class="sb-updated">Last updated ${d.lastUpdated}</div>
      </div>
    </aside>

    <main class="sb-main">
      <!-- Phones only: who this is, at the top of the page. Contacts and the CV download are in the menu -->
      <div class="sb-mprofile">
        <div class="sb-title">${d.profile.jobTitle}</div>
        <div class="sb-mname">${d.profile.name}</div>
        <div class="sb-post">${d.profile.postnominals}</div>
      </div>
      <section id="summary" class="sb-summary"><h2 class="sb-heading">Summary</h2>${d.summary.map((p) => `<p>${p}</p>`).join('')}</section>

      <section id="experience"><h2 class="sb-heading">Experience</h2>
        ${d.experience.map(employer).join('')}
        <div class="sb-label" style="margin:28px 0 8px">Earlier career · 2009 – 2020</div>
        <ul class="sb-earlier">${d.earlierCareer.map((e) => `<li><b>${e.employer}</b><span>${e.desc}</span></li>`).join('')}</ul>
      </section>

      <section id="skills"><h2 class="sb-heading">Skills</h2>
        <div class="sb-skills">${d.skills.map((s) => `<div class="sb-cat">${s.category}</div><div class="sb-tags">${s.tags.join(' · ')}</div>`).join('')}</div>
      </section>

      <section id="certifications"><h2 class="sb-heading">Certifications</h2>
        <div class="sb-certs">${d.certifications.map((c) => `
          <div class="sb-cert"><img src="${c.badge}" alt="${c.name}"><div><div class="sb-cert-name">${c.name}</div><div class="sb-cert-issuer">${c.issuer} · ID ${c.id}</div></div></div>`).join('')}</div>
      </section>

      <section id="publications"><h2 class="sb-heading">Publications</h2>
        ${d.publications.map((p) => `
          <div class="sb-entry"><div class="sb-when">${p.date}</div>
            <div><a class="sb-pub-title" href="${p.link}">${p.title}</a>${bullets(p.bullets)}<a class="sb-more" href="${p.link}">Read article →</a></div></div>`).join('')}
      </section>

      <section id="resources"><h2 class="sb-heading">Resources</h2>
        ${d.resources.map((r) => `
          <div class="sb-res">${r.thumbnail ? `<img src="${r.thumbnail}" alt="">` : '<span></span>'}
            <div><div class="sb-org">${r.title}</div><div class="sb-res-desc">${r.desc}</div><a class="sb-more" href="${r.file}" target="_blank" rel="noopener noreferrer">Download PDF →</a></div></div>`).join('')}
      </section>

${hasReading ? readingSection() : ''}
      <section id="contributions"><h2 class="sb-heading">Other contributions</h2>${d.volunteer.map(employer).join('')}</section>

      <section id="education"><h2 class="sb-heading">Education</h2>
        ${d.education.map((e) => `<div class="sb-edu"><div class="sb-when">${e.period}</div><div><div class="sb-org">${e.degree}</div><div class="sb-school">${e.school}</div></div><img src="${e.logo}" alt="${e.school} logo"></div>`).join('')}
      </section>

      <footer class="sb-footer">© ${new Date().getFullYear()} ${d.profile.name}</footer>
    </main>
    </div>`;
  document.body.appendChild(root);

  // Highlight the section being read
  const links = [...root.querySelectorAll('.sb-nav a')];
  const lastId = sections[sections.length - 1][0];
  let reading = sections[0][0];
  let chosen = null; // a section picked from the menu, kept until the reader scrolls by hand
  const show = (id) => links.forEach((a) => a.classList.toggle('active', a.dataset.id === id));
  // The last section can be too short to reach the reading band, so the bottom of the page counts as it
  const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
  const update = () => show(chosen ?? (atBottom() ? lastId : reading));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) reading = en.target.id; });
    update();
  }, { rootMargin: '-30% 0px -65% 0px' });
  sections.forEach(([id]) => spy.observe(document.getElementById(id)));
  window.addEventListener('scroll', update, { passive: true });
  links.forEach((a) => a.addEventListener('click', () => { chosen = a.dataset.id; update(); }));
  // Summary is the first section, so choosing it goes right to the top of the page (on phones, back above the
  // profile), rather than to the Summary heading. The same applies when the page is opened at #summary
  const first = sections[0][0];
  const firstLink = links.find((a) => a.dataset.id === first);
  firstLink.addEventListener('click', (ev) => {
    ev.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.hash !== '#' + first) history.pushState(null, '', '#' + first);
  });
  if (location.hash === '#' + first) window.scrollTo(0, 0);
  ['wheel', 'touchmove', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { chosen = null; }, { passive: true }));
  update();

  // Light / dark: the same saved preference as the classic layout
  const base = (typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.theme : null) || 'gold';
  const isDark = () => document.documentElement.getAttribute('data-theme').endsWith('-dark');
  const label = document.getElementById('sb-theme-label');
  label.textContent = isDark() ? 'Light mode' : 'Dark mode';
  const toggleTheme = () => {
    const dark = !isDark();
    document.documentElement.setAttribute('data-theme', dark ? base + '-dark' : base);
    localStorage.setItem('theme-dark', dark ? 'true' : 'false');
    label.textContent = dark ? 'Light mode' : 'Dark mode';
  };
  // In the side menu on wider screens, and in the top bar on phones
  document.getElementById('sb-theme').addEventListener('click', toggleTheme);
  document.getElementById('sb-bar-theme').addEventListener('click', toggleTheme);

  // Menu on phones
  const close = () => document.body.classList.remove('sb-menu-open');
  document.getElementById('sb-menu').addEventListener('click', () => document.body.classList.add('sb-menu-open'));
  document.getElementById('sb-scrim').addEventListener('click', close);
  document.getElementById('sb-close').addEventListener('click', close);
  links.forEach((a) => a.addEventListener('click', close));

  // Back to top on phones: appears once the reader has scrolled down a little
  const toTop = document.getElementById('sb-top');
  const showTop = () => toTop.classList.toggle('visible', window.scrollY > 300);
  window.addEventListener('scroll', showTop, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  showTop();
});
