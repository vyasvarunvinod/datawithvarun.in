# DataWithVarun

A static personal portfolio for Varun Vyas. GitHub Pages serves the site, Pages CMS provides GitHub-authenticated editing, and `datawithvarun.in` is the configured custom domain.

## Repository

Recommended GitHub repository: `datawithvarun.in` (public). The local folder must be pushed to that repository under the `main` branch before the website can deploy.

## Publish with GitHub Pages

1. Create a GitHub repository named `datawithvarun.in` under your account and push this folder to its `main` branch.
2. In the repository, open **Settings → Pages** and set the build and deployment source to **GitHub Actions**.
3. Open **Actions** and confirm that the **Deploy website** workflow succeeds. The workflow runs on every push to `main`.
4. In **Settings → Pages → Custom domain**, confirm `datawithvarun.in` after DNS records have been added at your domain registrar.
5. Once DNS has propagated and GitHub has issued the certificate, turn on **Enforce HTTPS**.

The `CNAME` file already maps the Pages deployment to `datawithvarun.in`. At the domain registrar, configure the apex domain with GitHub Pages' current A records and add `www` as a CNAME pointing to `<your-github-username>.github.io`. GitHub's custom-domain guide lists the current records: <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site>.

## GitHub-authenticated content studio

1. Visit <https://app.pagescms.org/> and sign in using GitHub.
2. Install the Pages CMS GitHub App for the `datawithvarun.in` repository.
3. Select the repository and its `main` branch. Pages CMS reads `.pages.yml` automatically.
4. Open **Site content** to update your profile, links, projects, field notes, and learning records. Save changes to commit them to GitHub; the Pages workflow publishes the update.
5. For a new field note, choose a unique lowercase URL slug and enable **Published on the website**. Its shareable URL is `https://datawithvarun.in/field-notes/your-slug/`. Each article gets its own social preview metadata for LinkedIn and X.

The admin landing page is `https://datawithvarun.in/admin.html`. It links to Pages CMS; GitHub authentication happens on Pages CMS, not in this static website. Access control is enforced by GitHub repository permissions and the Pages CMS GitHub App. Only grant repository write access to people who should be able to publish website changes.

## Local preview

Build and preview the site through a local web server rather than opening `index.html` directly. The build step also creates the published article pages:

```sh
node scripts/build-site.mjs
ruby -run -e httpd dist -p 8000
```

Then open <http://localhost:8000>.