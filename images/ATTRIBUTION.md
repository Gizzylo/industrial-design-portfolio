# Placeholder image credits

**These four photos are licensed stock standing in for real project shots. They are
not Cindy's work.** They exist only so the tile layout can be judged with real
photography in it. Replace each one with your own project photo — and delete this
file once none of them remain.

Both sources allow free commercial use without attribution. The credits below are
recorded for provenance, so it's clear what came from where.

| File | Source | Photographer | Original |
|---|---|---|---|
| `wearable-01-smart-ring.jpg` | Unsplash | Andrey Matveev | https://unsplash.com/photos/MdFNFErNOz4 |
| `wearable-02-device-flatlay.jpg` | Pexels | — | https://www.pexels.com/photo/35147278/ |
| `wearable-03-smart-eyewear.jpg` | Unsplash | Tanmay Tikekar | https://unsplash.com/photos/MSfBl_SGiJ4 |
| `wearable-04-watch-in-use.jpg` | Unsplash | Daniel Romero | https://unsplash.com/photos/COvwQWG2XMc |

Licenses: [Unsplash](https://unsplash.com/license) · [Pexels](https://www.pexels.com/license/)

## Note on the photos themselves

Two of them show identifiable commercial products (an Apple Watch and iPhone in the
eyewear shot, a phone UI in the flat-lay). That's harmless for a placeholder, but it's
another reason not to leave them up — on a portfolio page they read as *your* designs.

## Replacing one

Files are cropped to exactly 1200×900 (4:3), which matches the `.project__media` box,
so nothing gets re-cropped by the browser. To swap one in:

```sh
# scale + centre-crop any photo to the same 4:3 box
sips -Z 1600 my-photo.jpg --out tmp.jpg
sips -c 900 1200 tmp.jpg -s format jpeg -s formatOptions 80 \
  --out images/wearable-01-smart-ring.jpg
```

Then update that tile's `alt` text in `index.html` to describe the real project, and
drop the `Placeholder:` prefix.
