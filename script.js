const visualMarkup = {
  performance: '<div class="visual visual-performance" aria-hidden="true"><div class="visual-topline"><span>PERFORMANCE / OVERVIEW</span><span>•••</span></div><div class="metric-row"><span><i></i><i></i><i></i></span><span><i></i><i></i><i></i></span><span><i></i><i></i><i></i></span></div><div class="chart-area"><div class="chart-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="chart-baseline"></span></div><div class="visual-caption">A clearer view of what matters.</div></div>',
  architecture: '<div class="visual visual-architecture" aria-hidden="true"><span class="arch-node arch-source">SOURCE</span><span class="arch-node arch-model">MODEL</span><span class="arch-node arch-use">USE</span><span class="arch-connector connector-one"></span><span class="arch-connector connector-two"></span><span class="arch-caption">DESIGNED TO MAKE SENSE</span><span class="arch-spark">✳</span></div>',
  people: '<div class="visual visual-people" aria-hidden="true"><div class="people-ring ring-one"></div><div class="people-ring ring-two"></div><div class="people-dot dot-one"></div><div class="people-dot dot-two"></div><div class="people-dot dot-three"></div><div class="people-center">PEOPLE<br>FIRST</div><span class="people-caption">Context is part of the data.</span></div>'
};

const toolIconSources = {
  microsoftazure: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  azuredevops: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azuredevops/azuredevops-original.svg",
  amazonaws: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg"
};

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && typeof value === "string") element.textContent = value;
};

const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
};

const setLink = (selector, value) => {
  const element = document.querySelector(selector);
  const url = safeUrl(value);
  if (!element) return;
  if (url) {
    element.href = url;
    element.removeAttribute("aria-disabled");
  } else {
    element.removeAttribute("href");
    element.setAttribute("aria-disabled", "true");
  }
};

const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

function renderProfile(content) {
  const profile = content.profile;
  setText("#hero-eyebrow", profile.heroEyebrow);
  setText("#hero-headline-primary", profile.headlinePrimary);
  setText("#hero-headline-accent", profile.headlineAccent);
  setText("#hero-intro", profile.heroIntro);
  setText("#contact-intro", profile.contactIntro);

  const aboutTitle = document.querySelector("#about-title");
  aboutTitle.replaceChildren(make("span", "", profile.aboutTitle));
  aboutTitle.append(document.createElement("br"), make("em", "", profile.aboutAccent));

  const aboutParagraphs = document.querySelector("#about-paragraphs");
  aboutParagraphs.replaceChildren(...profile.aboutParagraphs.map((text) => make("p", "", text)));

  const contactTitle = document.querySelector("#connect-title");
  contactTitle.textContent = profile.contactTitle;

  const interestList = document.querySelector("#interest-list");
  interestList.replaceChildren(...profile.interests.map((text) => make("span", "", text)));

  const socials = content.socials;
  setLink("#social-linkedin", socials.linkedin);
  setLink("#social-x", socials.x);
  setLink("#social-youtube", socials.youtube);
  setLink("#footer-linkedin", socials.linkedin);
  setLink("#footer-x", socials.x);
  setLink("#footer-youtube", socials.youtube);
  setLink("#about-link", socials.linkedin);
  setLink("#contact-link", socials.linkedin);
  document.querySelector("#year").textContent = new Date().getFullYear();
}

function renderTools(tools) {
  const track = document.querySelector("#tool-belt-track");
  if (!track) return;
  track.replaceChildren();

  [false, true].forEach((duplicate) => {
    const group = make("div", "tool-belt-group");
    if (duplicate) group.setAttribute("aria-hidden", "true");
    (tools || []).forEach((tool) => {
      if (!/^[a-z0-9-]+$/.test(tool.icon || "")) return;
      const item = make("span", "tool-belt-item");
      if (tool.icon === "powerbi") {
        item.append(make("span", "tool-belt-glyph", "PB"));
      } else {
        const icon = document.createElement("img");
        icon.src = toolIconSources[tool.icon] || `https://cdn.simpleicons.org/${tool.icon}`;
        icon.alt = "";
        icon.loading = "lazy";
        icon.addEventListener("error", () => {
          icon.replaceWith(make("span", "tool-belt-glyph", tool.name.slice(0, 2).toUpperCase()));
        }, { once: true });
        item.append(icon);
      }
      item.append(make("span", "", tool.name));
      group.append(item);
    });
    track.append(group);
  });
}

function renderProjects(projects) {
  const grid = document.querySelector("#project-grid");
  grid.replaceChildren();

  if (!projects.length) {
    grid.append(make("p", "content-empty", "Projects will appear here as they’re published."));
    return;
  }

  projects.forEach((project, index) => {
    const card = make("article", "project-card");
    const visual = make("div", "visual");
    visual.setAttribute("aria-hidden", "true");
    visual.innerHTML = visualMarkup[project.visual] || visualMarkup.performance;

    const info = make("div", "project-info");
    const meta = make("div", "card-meta");
    meta.append(
      make("span", "", project.category),
      make("span", "project-number", project.number || String(index + 1).padStart(2, "0"))
    );
    const title = make("h3", "", project.title);
    const linkUrl = safeUrl(project.link);
    if (linkUrl) {
      const link = make("a", "project-title-link", project.title);
      link.href = linkUrl;
      link.target = "_blank";
      link.rel = "noreferrer";
      title.replaceChildren(link);
    }
    const description = make("p", "", project.description);
    const tags = make("div", "tag-list");
    tags.replaceChildren(...(project.tags || []).map((tag) => make("span", "", tag)));
    info.append(meta, title, description, tags);
    card.append(visual, info);
    grid.append(card);
  });
}

function renderPosts(posts) {
  const list = document.querySelector("#notes-list");
  const published = posts.filter((post) => post.published);
  list.replaceChildren();

  if (!published.length) {
    list.append(make("p", "content-empty content-empty-light", "New field notes will find their way here soon."));
    return;
  }

  published.forEach((post, index) => {
    const row = make("a", "note-row");
    row.href = `field-notes/${encodeURIComponent(post.slug)}/`;
    row.append(make("span", "note-number", String(index + 1).padStart(2, "0")));
    const copy = make("div", "note-copy");
    copy.append(make("span", "note-category", post.category), make("h3", "", post.title), make("p", "", post.excerpt));
    const read = make("span", "note-read", "Read field note");
    read.append(make("span", "", "↗"));
    row.append(copy, read);
    list.append(row);
  });
}

function renderLearning(items) {
  const list = document.querySelector("#learning-list");
  list.replaceChildren();

  if (!items.length) {
    list.append(make("p", "content-empty", "Learning notes and credentials will be added here."));
    return;
  }

  items.forEach((item, index) => {
    const row = make("article", "learning-row");
    const indexLabel = make("span", "learning-index", String(index + 1).padStart(2, "0"));
    const details = make("div");
    details.append(make("span", "learning-kind", item.kind), make("h3", "", item.title), make("p", "", item.provider));
    row.append(indexLabel, details);
    const url = safeUrl(item.link);
    if (url) {
      const link = make("a", "learning-arrow", "↗");
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.setAttribute("aria-label", `View ${item.title}`);
      row.append(link);
    }
    list.append(row);
  });
}

fetch("content/site.json")
  .then((response) => {
    if (!response.ok) throw new Error("Content is not available.");
    return response.json();
  })
  .then((content) => {
    renderProfile(content);
    renderTools(content.tools);
    renderProjects(content.projects);
    renderPosts(content.posts);
    renderLearning(content.learning);
  })
  .catch(() => {
    document.querySelectorAll(".content-empty").forEach((element) => {
      element.textContent = "Content is temporarily unavailable. Please try again shortly.";
    });
  });

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isOpen);
});
siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();