/* A soft bubble that trails the pointer. The lag between the real cursor and
   the bubble is what reads as "liquid": the bubble eases toward the pointer
   rather than tracking it exactly, and stretches along its direction of travel.

   The native cursor is deliberately left visible — people need a precise point
   to aim with, and hiding it makes links harder to hit.

   Runs only for real pointing devices, and not at all under reduced motion. */
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var EASE = 0.13;      // how quickly the bubble catches up (0–1)
  var GROW = 1.55;      // scale when over something clickable

  var bubble = document.createElement('div');
  bubble.className = 'cursor-bubble';
  bubble.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bubble);

  var tx = innerWidth / 2, ty = innerHeight / 2;   // pointer
  var x = tx, y = ty;                              // bubble
  var px = x, py = y;                              // previous frame
  var grow = 1, growTarget = 1;
  var seen = false;

  /* The loop stops once the bubble has caught up and nothing is changing, and
     restarts on the next pointer event. An always-on rAF loop would burn a
     frame forever while the mouse sits still. */
  var raf = null;

  function kick() {
    if (raf === null) raf = requestAnimationFrame(frame);
  }

  addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    if (!seen) {
      seen = true;
      x = tx; y = ty; px = tx; py = ty;   // start where the pointer already is
      bubble.classList.add('is-visible');
    }
    kick();
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    bubble.classList.remove('is-visible');
  });

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest('a, button')) { growTarget = GROW; kick(); }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest('a, button')) { growTarget = 1; kick(); }
  });

  function frame() {
    x += (tx - x) * EASE;
    y += (ty - y) * EASE;
    grow += (growTarget - grow) * 0.12;

    var vx = x - px, vy = y - py;
    px = x; py = y;

    /* Stretch along travel, squash across it — surface tension, roughly. */
    var speed = Math.min(Math.sqrt(vx * vx + vy * vy), 38);
    var stretch = (1 + speed / 95) * grow;
    var squash = (1 - speed / 170) * grow;
    var angle = Math.atan2(vy, vx) * 180 / Math.PI;

    bubble.style.transform =
      'translate(' + x + 'px,' + y + 'px) rotate(' + angle + 'deg) scale(' +
      stretch.toFixed(3) + ',' + squash.toFixed(3) + ')';

    var settled = Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1 &&
                  Math.abs(growTarget - grow) < 0.005;
    raf = settled ? null : requestAnimationFrame(frame);
  }
})();
