/* Splits [data-split="words"] headings into per-word spans so CSS can stagger
   them in, then fades the paragraph beneath in once the last word has landed.

   Progressive enhancement: the plain text in the HTML is what ships, this only
   rearranges it. Skipped entirely when the visitor prefers reduced motion.

   The split spans are hidden from assistive tech and the original string is
   restored as an aria-label, so screen readers still read whole sentences.

   STAGGER and DURATION live here only — they're pushed to CSS as custom
   properties so the timings can't drift out of sync between the two files. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var STAGGER = 105;  // ms between one word starting and the next
  var DURATION = 850; // ms for a single word to arrive

  document.querySelectorAll('[data-split="words"]').forEach(function (el) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;

    var shell = document.createElement('span');
    shell.setAttribute('aria-hidden', 'true');

    var words = text.split(' ');
    words.forEach(function (word, i) {
      if (i > 0) shell.appendChild(document.createTextNode(' '));
      var span = document.createElement('span');
      span.className = 'reveal__word';
      span.style.setProperty('--i', i);
      shell.appendChild(span).textContent = word;
    });

    el.style.setProperty('--stagger', STAGGER + 'ms');
    el.style.setProperty('--dur', DURATION + 'ms');
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.appendChild(shell);
    el.setAttribute('data-split', 'done');

    /* The last word starts at (n-1)*STAGGER and takes DURATION to finish, so
       that sum is the moment the heading is fully present. */
    var body = el.parentElement && el.parentElement.querySelector('.hero__body');
    if (body) {
      body.style.setProperty('--delay', (words.length - 1) * STAGGER + DURATION + 'ms');
      body.setAttribute('data-reveal', 'after');
    }
  });
})();
