import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = join(root, "dist");
const content = JSON.parse(await readFile(join(root, "content/site.json"), "utf8"));
const files = [
  "index.html",
  "admin.html",
  "article.html",
  "article.js",
  "script.js",
  "styles.css",
  "CNAME",
  "content/site.json",
  "assets/datawithvarun-mark.svg",
  "assets/varun-portrait.jpg"
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function renderArticle(post) {
  const title = escapeHtml(post.title);
  const description = escapeHtml(post.excerpt);
  const canonical = `https://datawithvarun.in/field-notes/${post.slug}/`;
  const paragraphs = String(post.body || "")
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("\n          ");
  const relatedUrl = safeExternalUrl(post.link);
  const relatedLink = relatedUrl
    ? `<a class="underlined-link article-related-link" href="${escapeHtml(relatedUrl)}" target="_blank" rel="noreferrer">Related link ↗</a>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f3f3eb">
    <meta name="description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title} — DataWithVarun">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="https://datawithvarun.in/assets/varun-portrait.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title} — DataWithVarun">
    <meta name="twitter:description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="../../assets/datawithvarun-mark.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../../styles.css">
    <title>${title} — DataWithVarun</title>
  </head>
  <body class="article-page">
    <header class="site-header">
      <a class="wordmark" href="../../index.html" aria-label="DataWithVarun home"><img class="brand-mark" src="../../assets/datawithvarun-mark.svg" alt=""><span class="brand-type"><strong>DataWithVarun</strong><span>DATA · INSIGHT · DECISIONS</span></span></a>
      <a class="header-link" href="../../index.html#notes">All field notes <span aria-hidden="true">↗</span></a>
    </header>
    <main class="article-main">
      <a class="article-back" href="../../index.html#notes">← All field notes</a>
      <p class="eyebrow article-category">${escapeHtml(post.category)}</p>
      <h1>${title}</h1>
      <p class="article-date">${escapeHtml(post.date)}</p>
      <div class="article-body">
          ${paragraphs}
      </div>
      ${relatedLink}
    </main>
    <footer class="site-footer">
      <a class="wordmark footer-wordmark" href="../../index.html"><img class="brand-mark" src="../../assets/datawithvarun-mark.svg" alt=""><span class="brand-type"><strong>DataWithVarun</strong><span>DATA · INSIGHT · DECISIONS</span></span></a>
      <p>Making data a little more human.</p>
      <a class="footer-back" href="../../index.html#notes">Back to field notes ↑</a>
    </footer>
  </body>
</html>
`;
}

await rm(output, { recursive: true, force: true });
for (const file of files) {
  const target = join(output, file);
  await mkdir(dirname(target), { recursive: true });
  await cp(join(root, file), target);
}

const seenSlugs = new Set();
const publishedPosts = (content.posts || []).filter((post) => post.published);
for (const post of publishedPosts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || "")) {
    throw new Error(`Invalid post slug "${post.slug}". Use lowercase letters, numbers, and hyphens.`);
  }
  if (seenSlugs.has(post.slug)) {
    throw new Error(`Duplicate post slug "${post.slug}".`);
  }
  seenSlugs.add(post.slug);
  const target = join(output, "field-notes", post.slug, "index.html");
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, renderArticle(post));
}

console.log(`Built site with ${publishedPosts.length} published field note(s) in dist/.`);