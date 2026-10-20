const articleRoot = document.querySelector("#article-content");
const slug = new URLSearchParams(window.location.search).get("slug");

fetch("content/site.json")
  .then((response) => {
    if (!response.ok) throw new Error("Could not load the field note.");
    return response.json();
  })
  .then((content) => {
    const article = content.posts.find((post) => post.slug === slug && post.published);
    if (!article) throw new Error("This field note is not available.");

    document.title = `${article.title} — DataWithVarun`;
    document.querySelector('meta[name="description"]').content = article.excerpt;
    articleRoot.replaceChildren();

    const backLink = document.createElement("a");
    backLink.className = "article-back";
    backLink.href = "index.html#notes";
    backLink.textContent = "← All field notes";

    const category = document.createElement("p");
    category.className = "eyebrow article-category";
    category.textContent = article.category;

    const title = document.createElement("h1");
    title.textContent = article.title;

    const date = document.createElement("p");
    date.className = "article-date";
    date.textContent = article.date || "";

    const body = document.createElement("div");
    body.className = "article-body";
    article.body.split(/\n\s*\n/).filter(Boolean).forEach((paragraph) => {
      const element = document.createElement("p");
      element.textContent = paragraph;
      body.append(element);
    });

    articleRoot.append(backLink, category, title, date, body);
    if (article.link) {
      const link = document.createElement("a");
      link.className = "underlined-link article-related-link";
      link.href = article.link;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = "Related link ↗";
      articleRoot.append(link);
    }
  })
  .catch((error) => {
    articleRoot.replaceChildren();
    const message = document.createElement("p");
    message.className = "article-error";
    message.textContent = error.message;
    const backLink = document.createElement("a");
    backLink.className = "underlined-link";
    backLink.href = "index.html#notes";
    backLink.textContent = "Return to the website";
    articleRoot.append(message, backLink);
  });