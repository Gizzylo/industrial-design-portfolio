# Industrial design portfolio

Static portfolio site — two pages, one stylesheet, no build step and no dependencies.

```
index.html      hero, four project slots, About Me teaser
about.html      the second page: fuller background, capabilities, contact
css/style.css   all styling; design tokens at the top in :root
js/reveal.js    letter-by-letter hero animation (progressive enhancement)
images/         project photos, 1200×900 (4:3) — see ATTRIBUTION.md
netlify.toml    Netlify config (publishes the repo root as-is)
```

> **The four project images are licensed stock placeholders, not Cindy's work.**
> They're in place so the layout can be judged with real photography. Replace them
> before sharing the site — details and a crop recipe in `images/ATTRIBUTION.md`.

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
- **Project images** — swap the `<img>` inside each `<div class="project__media">`.
  Keep them 1200×900 (4:3) so they match the tile box exactly, and keep the
  `width`/`height` attributes so the page doesn't shift while they load. Rewrite the
  `alt` to describe the real project and drop the `Placeholder:` prefix. Images get a
  subtle zoom on hover.
- **Project detail pages** — when you write one, wrap the project title in a link
  (`<h3 class="project__title"><a href="projects/one.html">Project One</a></h3>`). The
  CSS already stretches that link over the whole card, so the image becomes clickable
  too.
- **About page** — `about.html`.
- **Colors, type scale, spacing** — the `:root` block at the top of `css/style.css`.
  The page is white-only: there is no dark mode, and `color-scheme: light` keeps it
  white even when the visitor's OS is set to dark.
- **Alignment** — everything is centred. `body` sets `text-align: center`, and the
  measure-constrained blocks (`.hero__body`, `.prose > *`, `.project__desc`, …) use
  `margin-inline: auto`. To go back to a left-aligned layout you'd remove the
  `text-align` on `body` and switch those `auto` inline margins back to `0`.

Visitors with "reduce motion" enabled get no hero animation, no hover zoom, and no
smooth scrolling — the splitter script exits early and leaves the plain heading alone.

## After editing CSS or JS — bump the version

`netlify.toml` tells browsers to cache `/css/*` and `/js/*` for an hour. The filenames
never change, so without help a returning visitor keeps the **old** stylesheet for up
to an hour after a deploy — new HTML, old styling. The `?v=` on the asset links is
what prevents that:

```html
<link rel="stylesheet" href="css/style.css?v=2">
<script src="js/reveal.js?v=2"></script>
```

Bump that number in all three HTML files whenever you change `style.css` or
`reveal.js`, and the new file is fetched immediately:

```sh
sed -i '' 's/?v=2/?v=3/g' index.html about.html 404.html
```

Images don't need this — give a changed photo a new filename instead.

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
