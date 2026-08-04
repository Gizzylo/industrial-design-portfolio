/* Splits [data-split="letters"] headings into per-letter spans so CSS can
   stagger them in. Progressive enhancement: the plain text in the HTML is
   what ships, this only rearranges it. Skipped entirely when the visitor
   prefers reduced motion.

   The split spans are hidden from assistive tech and the original string is
   restored as an aria-label, so screen readers still read whole words. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('[data-split="letters"]').forEach(function (el) {
    var text = el.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;

    var shell = document.createElement('span');
    shell.setAttribute('aria-hidden', 'true');

    var i = 0;
    text.split(' ').forEach(function (chunk, w) {
      if (w > 0) shell.appendChild(document.createTextNode(' '));

      var word = document.createElement('span');
      word.className = 'reveal__word';

      chunk.split('').forEach(function (character) {
        var span = document.createElement('span');
        span.className = 'reveal__char';
        span.style.setProperty('--i', i++);
        span.textContent = character;
        word.appendChild(span);
      });

      shell.appendChild(word);
    });

    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.appendChild(shell);
    el.setAttribute('data-split', 'done');
  });
})();
