# Industrial design portfolio

Static portfolio site — one stylesheet, no build step and no dependencies.

```
index.html      hero + the four project tiles
about.html      fuller background, capabilities, contact
projects/       one page per project, linked from the tiles
404.html        styled not-found page
css/style.css   all styling; design tokens at the top in :root
js/reveal.js    word-by-word hero animation (progressive enhancement)
js/cursor.js    the bubble that trails the pointer
images/         flat dark-grey SVG placeholders — swap for real photos
netlify.toml    Netlify config (publishes the repo root as-is)
```

> **All imagery is placeholder.** Every image points at a flat dark-grey SVG
> (`images/placeholder-4x3.svg` and `placeholder-16x9.svg`), reused across the tiles
> and project pages. Replace them with real photography before sharing the site.

Type is [Fustat](https://fonts.google.com/specimen/Fustat) throughout, with
[Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) italic for
accents — both from Google Fonts. If a font ever fails to load the pages fall back to
the system stack — nothing breaks.

The header mark is the bold "CL" monogram. It carries an `aria-label` with the full
name, since two letters on their own tell a screen reader nothing.

## Editing

Everything is plain HTML — open a file and change the text.

- **Hero copy** — the `.hero` section in `index.html`. Keep the `<h1>` as plain text:
  `js/reveal.js` reads that text and rebuilds it as animated words, then fades the
  `.hero__body` paragraph in as one block once the heading has finished. The stagger
  and duration live only in `reveal.js` — it pushes them to CSS as `--stagger`,
  `--dur` and `--delay`, so the JS and CSS timings can't drift apart. Wrap a word in
  `<em>` anywhere in `.hero` or `.prose` to set it in Instrument Serif italic, or use
  `<span class="accent-serif">` elsewhere.
- **Project tiles** — the four `<article class="project">` blocks in `index.html`. Each
  is just an image with its title alongside; the title links to the project page. Copy
  an `<article>` to add a fifth; the grid reflows on its own.
- **Project images** — swap the `<img>` inside each `<div class="project__media">`.
  Keep 4:3 (1200×900 suits the tiles, 1600×900 the case-study leads) and keep the
  `width`/`height` attributes so the page doesn't shift while they load. The
  placeholders carry `alt=""` because a grey rectangle says nothing; write real alt
  text once there's a real photo. Tile images blur on hover; the small scale paired
  with it hides the pale fringe a blur leaves at the tile edge.
- **Project case studies** — each page in `projects/` is an image-led scroll modelled on
  a Behance case study: the hero shot comes first, edge to edge, then the title and
  one-line subtitle, a `.case-meta` spec row (Duration / Industry / Skills / Role), and
  nine numbered workflow stages — Context, Research, The problem, Users, Ideation,
  Development, Prototyping, Details, Final design. Each stage is a short block of copy
  followed by its images. Case pages are left-aligned (`.case` on `<main>`), unlike the
  centred homepage.
- **Full-bleed images** — add `.bleed` to a direct child of `<main>`. It zeroes the
  gutter padding that `main > *` supplies; don't add a negative margin, which shifts
  the box rather than widening it because `max-width: 100%` stops it growing back.
- **Page width** — the layout is full-bleed: `--page: 100%`, so sections span the
  viewport and are held off the edges only by `--gutter`. Reading copy stays readable
  because `--measure` still caps paragraph width. The project grid is a fixed two
  columns above 46rem rather than auto-fit, which would keep adding columns on wide
  screens and shrink the images again.
- **Project pages** — one file per project in `projects/`. To add a fifth, copy an
  existing one, then add a matching `<article class="project">` to `index.html` whose
  title links to it. The tile title is a stretched link, so clicking anywhere on the
  card (including the image) opens the project.
  Note that pages inside `projects/` reach shared assets with `../` — keep that when
  copying, or the stylesheet silently fails to load.
- **About page** — `about.html`.
- **Colors, type scale, spacing** — the `:root` block at the top of `css/style.css`.
  The page is white-only: there is no dark mode, and `color-scheme: light` keeps it
  white even when the visitor's OS is set to dark.
- **Alignment** — everything is centred. `body` sets `text-align: center`, and the
  measure-constrained blocks (`.hero__body`, `.prose > *`, `.about-teaser__body`, …) use
  `margin-inline: auto`. To go back to a left-aligned layout you'd remove the
  `text-align` on `body` and switch those `auto` inline margins back to `0`.

**Pointer bubble** — `js/cursor.js` adds a soft bubble that eases toward the cursor
rather than tracking it exactly; that lag is what reads as liquid, and it stretches
along its direction of travel. The native cursor stays visible on purpose, since
people need a precise point to aim with. It's `pointer-events: none`, so it can never
swallow a click.

Visitors with "reduce motion" enabled get no hero animation, no hover transition, no
bubble, and no smooth scrolling — both scripts exit early and leave the plain heading
alone. The bubble is also skipped entirely on touch devices, where there's no pointer
to follow.

## After editing CSS or JS — bump the version

`netlify.toml` tells browsers to cache `/css/*` and `/js/*` for an hour. The filenames
never change, so without help a returning visitor keeps the **old** stylesheet for up
to an hour after a deploy — new HTML, old styling. The `?v=` on the asset links is
what prevents that:

```html
<link rel="stylesheet" href="css/style.css?v=3">
<script src="js/reveal.js?v=3"></script>
```

Bump that number in every HTML file whenever you change `style.css` or
`reveal.js`, and the new file is fetched immediately. This increments whatever the
current version is, so there's no number to keep in sync here:

```sh
perl -pi -e 's/\?v=(\d+)/"?v=".($1+1)/ge' index.html about.html 404.html projects/*.html
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
