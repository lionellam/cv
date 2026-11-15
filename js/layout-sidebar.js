// Sidebar layout: draws the CV from RESUME_DATA when config.js sets layout: "sidebar".
// Styles are in css/layout-sidebar.css; the classic layout is untouched.
document.addEventListener('DOMContentLoaded', () => {
  if (window.SITE_LAYOUT !== 'sidebar') return;
  const d = RESUME_DATA;
  const bullets = (list) => `<ul class="sb-bullets">${list.map((b) => `<li>${b}</li>`).join('')}</ul>`;
  const sections = [
    ['summary', 'Summary'], ['experience', 'Experience'], ['skills', 'Skills'], ['certifications', 'Certifications'],
    ['publications', 'Publications'], ['resources', 'Resources'], ['contributions', 'Contributions'], ['education', 'Education'],
  ];

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
    <div class="sb-bar"><b>${d.profile.name}</b>
      <button id="sb-menu" aria-label="Open menu"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    </div>
    <div class="sb-scrim" id="sb-scrim"></div>

    <div class="sb-wrap">
    <aside class="sb-side">
      <button class="sb-close" id="sb-close" aria-label="Close menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div>
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
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.dataset.id === en.target.id));
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  sections.forEach(([id]) => spy.observe(document.getElementById(id)));
  links[0].classList.add('active');

  // Light / dark: the same saved preference as the classic layout
  const base = (typeof SITE_CONFIG !== 'undefined' ? SITE_CONFIG.theme : null) || 'gold';
  const isDark = () => document.documentElement.getAttribute('data-theme').endsWith('-dark');
  const label = document.getElementById('sb-theme-label');
  label.textContent = isDark() ? 'Light mode' : 'Dark mode';
  document.getElementById('sb-theme').addEventListener('click', () => {
    const dark = !isDark();
    document.documentElement.setAttribute('data-theme', dark ? base + '-dark' : base);
    localStorage.setItem('theme-dark', dark ? 'true' : 'false');
    label.textContent = dark ? 'Light mode' : 'Dark mode';
  });

  // Menu on phones
  const close = () => document.body.classList.remove('sb-menu-open');
  document.getElementById('sb-menu').addEventListener('click', () => document.body.classList.add('sb-menu-open'));
  document.getElementById('sb-scrim').addEventListener('click', close);
  document.getElementById('sb-close').addEventListener('click', close);
  links.forEach((a) => a.addEventListener('click', close));
});
