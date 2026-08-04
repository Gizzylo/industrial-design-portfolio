# Industrial design portfolio

Static portfolio site — two pages, one stylesheet, no build step and no dependencies.

```
index.html      intro, four project slots, About Me teaser
about.html      the second page: fuller background, capabilities, contact
css/style.css   all styling; design tokens at the top in :root
netlify.toml    Netlify config (publishes the repo root as-is)
```

## Editing

Everything is plain HTML — open a file and change the text.

- **Intro copy** — the `.intro` section in `index.html`.
- **Projects** — the four `<article class="project">` blocks in `index.html`. Each has a
  title, a meta line (`year · category`), and a short description. Copy an `<article>`
  to add a fifth; the grid reflows on its own.
- **Project images** — replace the `<div class="project__media">` contents with
  `<img src="images/your-file.jpg" alt="...">` and delete the `project__placeholder`
  span. Put image files in an `images/` folder. 4:3 crops fit the existing layout best.
- **About page** — `about.html`.
- **Colors, type scale, spacing** — the `:root` block at the top of `css/style.css`.
  Dark mode picks up the same tokens via `prefers-color-scheme`.

## Local preview

No tooling required — open the file directly:

```sh
open index.html
```

Or serve it, which more closely matches production:

```sh
python3 -m http.server 8000    # then visit http://localhost:8000
```

## Deploying

The Netlify site is linked to this GitHub repo, so **pushing to `main` deploys**:

```sh
git add -A
git commit -m "Update project copy"
git push
```

Netlify builds a preview for pull requests and publishes `main` to the live URL.

To deploy from your machine without pushing:

```sh
netlify deploy --prod
```

## Tooling notes

`gh` lives in `~/.local/bin`; Node and `netlify` come from `~/.local/node/bin`. Both
directories are added to `PATH` in `~/.zshrc`.
