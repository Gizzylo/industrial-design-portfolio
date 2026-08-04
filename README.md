# Industrial design portfolio

Static portfolio site — two pages, one stylesheet, no build step and no dependencies.

```
index.html      hero, four project slots, About Me teaser
about.html      the second page: fuller background, capabilities, contact
css/style.css   all styling; design tokens at the top in :root
js/reveal.js    letter-by-letter hero animation (progressive enhancement)
netlify.toml    Netlify config (publishes the repo root as-is)
```

Type is [Fustat](https://fonts.google.com/specimen/Fustat) with
[Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) italic for
accents, both loaded from Google Fonts. If a font ever fails to load the pages fall
back to the system sans stack — nothing breaks.

## Editing

Everything is plain HTML — open a file and change the text.

- **Hero copy** — the `.hero` section in `index.html`. Keep the `<h1>` as plain text:
  `js/reveal.js` reads that text and rebuilds it as animated letters. Wrap a word in
  `<em>` anywhere in `.hero` or `.prose` to set it in Instrument Serif italic, or use
  `<span class="accent-serif">` elsewhere.
- **Projects** — the four `<article class="project">` blocks in `index.html`. Each has a
  title, a meta line (`year · category`), and a short description. Copy an `<article>`
  to add a fifth; the grid reflows on its own.
- **Project images** — replace the `<div class="project__media">` contents with
  `<img src="images/your-file.jpg" alt="...">` and delete the `project__placeholder`
  span. Put image files in an `images/` folder. 4:3 crops fit the existing layout best;
  images get a subtle zoom on hover.
- **Project detail pages** — when you write one, wrap the project title in a link
  (`<h3 class="project__title"><a href="projects/one.html">Project One</a></h3>`). The
  CSS already stretches that link over the whole card, so the image becomes clickable
  too.
- **About page** — `about.html`.
- **Colors, type scale, spacing** — the `:root` block at the top of `css/style.css`.
  Dark mode picks up the same tokens via `prefers-color-scheme`.

Visitors with "reduce motion" enabled get no hero animation, no hover zoom, and no
smooth scrolling — the splitter script exits early and leaves the plain heading alone.

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
